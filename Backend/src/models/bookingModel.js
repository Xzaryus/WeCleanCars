import pool from '../config/db.js';
import { Geocode } from '../utils/calculateDistance.js';

//! Default values for optional fields will need to be overridden 
//! booking logic will need to check availability for multiple slots
//! Update cleaner_availability table on booking creation
async function createBooking(connection, bookingData) {
    const {
        customer_id,
        service_id,
        vehicle_type_id,
        pricing_matrix_id,
        num_cars = 1,
        slots_required,
        start_slot,
        date,
        address,
        latitude,
        longitude,
        assigned_cleaner_id,
        travel_fee = 0.00,
        total_price = 0.00,
        status = 'pending'
    } = bookingData;


    const query = `
        INSERT INTO bookings
        (customer_id, service_id, vehicle_type_id, pricing_matrix_id, num_cars, slots_required, start_slot, date, address, latitude, longitude, assigned_cleaner_id, travel_fee, total_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await connection.query(query, [
            customer_id,
            service_id,
            vehicle_type_id,
            pricing_matrix_id,
            num_cars,
            slots_required,
            start_slot,
            date,
            address,
            latitude,
            longitude,
            assigned_cleaner_id,
            travel_fee,
            total_price,
            status
        ]);

        return result.insertId; // returns the booking ID
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

async function getBookingsById(id) {
    const query = 'SELECT * FROM bookings WHERE id = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        throw error;
    }
}

async function getBookingsByDate(date) {
    const query = 'SELECT * FROM bookings WHERE date = ?';
    try {
        const [rows] = await pool.query(query, [date]);
        return rows;
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        throw error;
    }
}

async function getBookingsByCleaner(id, status) {
    const query = status
        ? 'SELECT * FROM bookings WHERE assigned_cleaner_id = ? AND status = ?'
        : 'SELECT * FROM bookings WHERE assigned_cleaner_id = ?';
    const params = status ? [id, status] : [id];
    try {
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error retrieving bookings:', error);
        throw error;
    }
}

async function getBookingPrice(bookingId, connection = pool) {
    const query = 'SELECT total_price, travel_fee FROM bookings WHERE id = ?';
    try {
        const [rows] = await connection.query(query, [bookingId]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error retrieving booking price:', error);
        throw error;
    }
}

async function updateBookingStatus(bookingId, newStatus, connection) {
    const query = 'UPDATE bookings SET status = ? WHERE id = ?';
    try {
        const [result] = await connection.query(query, [newStatus, bookingId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
}

export {
    createBooking,
    getBookingsById,
    getBookingsByDate,
    getBookingsByCleaner,
    getBookingPrice,
    updateBookingStatus
};