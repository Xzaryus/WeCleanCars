// src/payments/stripeWebhook.js
import Stripe from "stripe";
import dotenv from "dotenv";
import { updatePaymentStatus, createPayment } from "../models/paymentModel.js";
import { updateBookingStatus } from "../models/bookingModel.js";
import pool from "../config/db.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function stripeWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // raw body required
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(" Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            const stripePaymentId = paymentIntent.id;
            const amount = paymentIntent.amount / 100;
            const bookings = paymentIntent.metadata.bookings?.split(",") || [];

            for (const bookingId of bookings) {
                await updatePaymentStatus(bookingId, stripePaymentId, "succeeded", connection);
                await updateBookingStatus(bookingId, "paid", connection);
            }
        }
        await connection.commit();
        res.json({ received: true });
    } catch (err) {
        console.error("Webhook DB error:", err);
        await connection.rollback();
        res.status(500).send("DB update failed");
    } finally {
        connection.release();
    }
}
