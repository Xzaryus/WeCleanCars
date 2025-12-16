import cron from 'node-cron';
import pool from '../config/db.js';

console.log ("Cron on");
async function removeAllUnpaidBookings() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Free all cleaner slots for unpaid bookings older than 30 minutes
        await connection.execute(`
            UPDATE cleaner_availability ca
            JOIN bookings b ON ca.booking_id = b.id
            SET ca.is_booked = FALSE, ca.booking_id = NULL
            WHERE b.status = 'pending' AND b.created_at < NOW() - INTERVAL 30 MINUTE
        `);

        // Delete all unpaid bookings older than 30 minutes
        const [result] = await connection.execute(`
            DELETE FROM bookings
            WHERE status = 'pending' AND created_at < NOW() - INTERVAL 30 MINUTE
        `);

        await connection.commit();
        console.log(`Removed ${result.affectedRows} unpaid booking(s) and freed cleaner slots.`);
    } catch (error) {
        await connection.rollback();
        console.error('Error removing unpaid bookings:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Cron job: runs every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    try {
        await removeAllUnpaidBookings();
    } catch (err) {
        console.error('Cron job failed:', err);
    }
});
