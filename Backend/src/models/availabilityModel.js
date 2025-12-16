import pool from '../config/db.js';

async function addAvailability(availabilityData) {
    const { cleaner_id, date, slot} = availabilityData;
    const query = `
        INSERT INTO cleaner_availability (cleaner_id, date, slot)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE slot = slot
    `;

    try {
        const [result] = await pool.query(query, [cleaner_id, date, slot]);
        return result.insertId;
    } catch (error) {
        console.error('Error adding availability:', error);
        throw error;
    }
}

async function getAvailabilityByCleanerAndDate(cleanerId, date) {
    const query = `
        SELECT * FROM cleaner_availability
        WHERE cleaner_id = ? AND date = ?
    `;

    try {
        const [rows] = await pool.query(query, [cleanerId, date]);
        return rows;
    } catch (error) {
        console.error('Error retrieving availability:', error);
        throw error;
    }
}

async function getAvailabilityByCleaner(cleanerId) {
    const query = `
        SELECT * FROM cleaner_availability
        WHERE cleaner_id = ?
    `;

    try {
        const [rows] = await pool.query(query, [cleanerId]);
        return rows;
    } catch (error) {
        console.error('Error retrieving availability:', error);
        throw error;
    }
}

async function getAvailabilityByDate(date) {
    const query = `
        SELECT * FROM cleaner_availability
        WHERE date = ?
    `;

    try {
        const [rows] = await pool.query(query, [date]);
        return rows;
    } catch (error) {
        console.error('Error retrieving availability:', error);
        throw error;
    }
}

async function bookSlot(connection,availabilityId, bookingId, cleanerId) {
    const query = `
        UPDATE cleaner_availability
        SET is_booked = TRUE, booking_id = ?
        WHERE id = ? AND is_booked = FALSE AND cleaner_id = ?
    `;

    try {
        const [result] = await connection.query(query, [bookingId, availabilityId, cleanerId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error booking slot:', error);
        throw error;
    }
}

async function unbookSlot(availabilityId, cleanerId) {
    const query = `
        UPDATE cleaner_availability
        SET is_booked = FALSE, booking_id = NULL
        WHERE id = ? AND is_booked = TRUE AND cleaner_id = ?
    `;

    try {
        const [result] = await pool.query(query, [availabilityId, cleanerId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error unbooking slot:', error);
        throw error;
    }
}

export {
    addAvailability,
    getAvailabilityByCleanerAndDate,
    getAvailabilityByCleaner,
    getAvailabilityByDate,
    bookSlot,
    unbookSlot
};