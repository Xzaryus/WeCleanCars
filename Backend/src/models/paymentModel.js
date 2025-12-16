import pool from '../config/db.js';

async function createPayment(paymentData, connection = pool) {
    const { booking_id, stripe_payment_id, amount, payment_status = 'pending'} = paymentData;

    try {
        const [existing] = await connection.query(
            `SELECT * FROM payments WHERE booking_id = ? AND payment_status = 'succeeded'`,
            [booking_id]
        );
        if (existing.length > 0) {
            throw new Error('A payment has already been made for this booking.');
        }

        const query = `
            INSERT INTO payments (booking_id, stripe_payment_id, amount, payment_status)
            VALUES (?, ?, ?, ?)
        `;
    
    
        const [result] = await connection.query(query, [booking_id, stripe_payment_id, amount, payment_status]);
        return result.insertId;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}
async function getPaymentById(id) {
    const query = 'SELECT * FROM payments WHERE id = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error retrieving payment:', error);
        throw error;
    }
}

async function getPaymentsByBooking(bookingId, connection = pool) {
    const query = `SELECT * FROM payments WHERE booking_id = ?`;
    try {
        const [rows] = await connection.query(query, [bookingId]);
        return rows;
    } catch (error) {
        console.error('Error retrieving payments:', error);
        throw error;
    }
}

async function updatePaymentStatus(booking_id, stripe_payment_id , newStatus, connection = pool) {
    const query = `UPDATE payments SET payment_status = ?, stripe_payment_id = ?
    WHERE booking_id = ?`;
    try {
        const [result] = await connection.query(query, [newStatus, stripe_payment_id, booking_id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
}

async function hasSucceededPayment(bookingId, connection = pool) {
    const payments = await getPaymentsByBooking(bookingId, connection);
    return payments.some(p => p.payment_status === 'succeeded');
}

export {
    createPayment,
    getPaymentById,
    getPaymentsByBooking,
    updatePaymentStatus,
    hasSucceededPayment
};