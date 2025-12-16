import dotenv from "dotenv";
dotenv.config();

import { payForBooking } from "../../services/paymentService.js"; 

async function testPayment() {
    try {
        const bookingIds = [35];

        // Stripe test payment method (Visa)
        const paymentMethodId = "pm_card_visa";

        const result = await payForBooking(bookingIds, paymentMethodId);

        console.log("Payment test result:", result);
    } catch (err) {
        console.error("Test payment failed:", err);
    }
}

testPayment();