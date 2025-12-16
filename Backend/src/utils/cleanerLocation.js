import pool from '../config/db.js';

async function getCleanerLocation(cleanerId, date) {
    try {
        // Get the most recent booking (on or before the given date)
        const [rows] = await pool.query(`
            SELECT latitude, longitude, date, start_slot
            FROM bookings
            WHERE assigned_cleaner_id = ?
            AND date = ?
            ORDER BY date DESC, FIELD(start_slot,
                '08:30-10:00','10:30-12:00','12:30-14:00','14:30-16:00','16:30-18:00','18:30-20:00'
            ) DESC
            LIMIT 1;
        `, [cleanerId, date]);

        if (rows.length > 0 && rows[0].latitude && rows[0].longitude) {
            return {
                latitude: parseFloat(rows[0].latitude),
                longitude: parseFloat(rows[0].longitude),
                source: 'last_booking'
            };
        }

        // Otherwise, return their home location
        const [cleaner] = await pool.query(`
            SELECT latitude, longitude
            FROM cleaners
            WHERE id = ?;
        `, [cleanerId]);

        if (cleaner.length > 0) {
            return {
                latitude: parseFloat(cleaner[0].latitude),
                longitude: parseFloat(cleaner[0].longitude),
                source: 'home'
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching cleaner location:', error);
        return null;
    }
}

// (async () => {
//     const location = await getCleanerLocation(4, '2025-09-17');
//     console.log(location);
// })();

export {
    getCleanerLocation
};