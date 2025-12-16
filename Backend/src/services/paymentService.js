import { createPayment, updatePaymentStatus, hasSucceededPayment } from "../models/paymentModel.js";
import { updateBookingStatus, getBookingPrice } from "../models/bookingModel.js";
import pool from "../config/db.js";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



// Stripe payment handler

async function createPaymentIntent(amount, bookingIds) {
    const paymentIntent = await stripe.paymentIntents.create(
        {
            amount: Math.round(amount * 100), // Convert to pence
            currency: "gbp",
            automatic_payment_methods: { enabled: true },
            metadata: { bookings: bookingIds.join(",") }, // helpful for webhook lookup
        },
        {
            idempotencyKey: `booking_${bookingIds.join("_")}`, // prevents duplicates
        }
    );

    return paymentIntent.client_secret; // Send this to frontend
}

/**
 * Pay for a booking
 * @param {number[]} bookingIds
 * @param {string} paymentMethodId (Stripe payment method or token)
 */
async function payForBooking(bookingIds) {
    const connection = await pool.getConnection();
    try {
        // Validate booking IDs
        if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
            throw new Error("Invalid booking IDs");
        }

        await connection.beginTransaction();


        // Check for already paid bookings
        for (const id of bookingIds) {
            const hasPaid = await hasSucceededPayment(id, connection);
            if (hasPaid) {
                throw new Error(`Booking with ID ${id} has already been paid`);
            }
        }

        // Calculate total price
        let totalPrice = 0;
        const prices = [];

        for (const id of bookingIds) {
            const { total_price } = await getBookingPrice(id, connection);
            const price = Number(total_price);

            if (isNaN(price) || price <= 0) {
                throw new Error(`Invalid price for booking with ID ${id}`);
            }

            totalPrice += price;
            prices.push({id, price});
        }
        console.log("Total price:", totalPrice);

        // Create Stripe payment intent
        const clientSecret = await createPaymentIntent(totalPrice, bookingIds);


        // Log a “pending” payment entry for
        for (const item of prices) {
            const { id, price } = item;
            await createPayment({
                booking_id: id,
                stripe_payment_id: null,
                amount: price,
                payment_status: "pending",
            }, connection);
        }

        await connection.commit();

        return {
            success: true,
            clientSecret,
            totalPrice,
            message: "Payment initiated. Confirm on frontend.",
        };
    } catch (error) {
        await connection.rollback();
        console.error("Payment initiation error:", error);
        return { success: false, message: error.message };
    } finally {
        connection.release();
    }
}

export { payForBooking };

const test = async () => {
    const result = await payForBooking([49, 50]);
    console.log("Test result:", result);
}

// test();