const pool = require ('../config/db.js');

const {
    createPayment,
    getPaymentById,
    getPaymentsByBooking,
    updatePaymentStatus
} = require ('../models/paymentModel.js');

(async () => {
    try {
        console.log('--- testing payment model ---');

    // 1. CREATE PAYMENT
        const paymentData = {
            booking_id: 1,
            stripe_payment_id: 'stripe_payment_id',
            amount: 100,
            payment_status: 'pending'
        };

        const paymentId = await createPayment(paymentData);
        console.log('Created payment with ID:', paymentId);

    // 2. GET PAYMENT BY ID
        const paymentById = await getPaymentById(paymentId);
        console.log('Payment by ID:', paymentById);

    // 3. GET PAYMENTS BY BOOKING
        const paymentsByBooking = await getPaymentsByBooking(1);
        console.log('Payments by Booking:', paymentsByBooking);

    // 4. UPDATE PAYMENT STATUS
        const updated = await updatePaymentStatus(paymentId, 'succeeded');
        console.log('Updated payment status:', updated);

    } catch (error) {
        console.error('Error testing payment model:', error);
    } finally {
        process.exit();
    }
})();