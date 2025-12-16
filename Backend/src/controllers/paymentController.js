import { payForBooking } from "../services/paymentService.js";

/**
 * Controller to handle booking payments
 * Expects: { bookingIds: [Number, ...] } in body
 */
async function createPaymentIntent (req, res) {
    try {
        const { bookingIds } = req.body;

        if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
            return res.status(400).json({ message: "Invalid or missing booking IDs." });
        }

        const result = await payForBooking(bookingIds);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            clientSecret: result.clientSecret,
            totalPrice: result.totalPrice,
            message: result.message,
        });
    } catch (error) {
        console.error("Error in payForBookingController:", error);
        return res.status(500).json({ message: error.message || "Internal server error." });
    }
}

export { createPaymentIntent };
