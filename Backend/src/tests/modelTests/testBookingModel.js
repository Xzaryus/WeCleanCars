import pool from '../../config/db.js';

import {
    createBooking,
    getBookingsById,
    getBookingsByDate,
    getBookingsByCleaner,
    updateBookingStatus
} from '../../models/bookingModel.js'; // adjust the path if needed

// Wrap in an async function so we can use await
(async () => {
    try {
        console.log('--- Testing Booking Model ---');

    // 1. CREATE BOOKING
        const newBooking = {
            customer_id: 4,
            service_id: 2,
            vehicle_type_id: 1,
            pricing_matrix_id: 4,
            num_cars: 1,
            slots_required: 1,
            start_slot: '08:30-10:00',
            date: '2025-10-02',
            address: '123 Back St',   
            assigned_cleaner_id: 2,
            status: 'pending'
        };

        const bookingId = await createBooking(newBooking);
        console.log('Created booking with ID:', bookingId);

        // 2. GET BY ID
        const bookingById = await getBookingsById(bookingId);
        console.log('Booking by ID:', bookingById);

        // 3. GET BY DATE
        // const bookingsByDate = await getBookingsByDate('2025-08-26');
        // console.log('Bookings by Date:', bookingsByDate);

        // 4. GET BY CLEANER
        // const bookingsByCleaner = await getBookingsByCleaner(1, 'pending');
        // console.log('Bookings by Cleaner (pending):', bookingsByCleaner);

        // 5. UPDATE BOOKING STATUS
        // const updated = await updateBookingStatus(bookingId, 'completed');
        // console.log('Status updated?', updated);

        // Re-fetch to verify
        const updatedBooking = await getBookingsById(bookingId);
        console.log('Updated Booking:', updatedBooking);

    } catch (err) {
        console.error('Test script error:', err);
    } finally {
        try{
            // await pool.query('DELETE FROM bookings');    //! clears table for testing
            // await pool.query('ALTER TABLE bookings AUTO_INCREMENT = 1');
            // console.log('Bookings table cleared and reset.');
        } catch (error) {
            console.error('Error clearing bookings table:', error);
        } finally{
            process.exit();
        }
    }
})();
