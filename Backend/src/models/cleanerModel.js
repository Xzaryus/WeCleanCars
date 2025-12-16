import pool from '../config/db.js';
import { Geocode } from '../utils/calculateDistance.js';

async function createCleaner(cleanerData) {
    const { full_name, phone, home_postcode, tier_id = 1 } = cleanerData;

    // Geocode the home postcode
    let latitude = null;
    let longitude = null;
    try {
        const coords = await Geocode(home_postcode);
        if (coords) {
            latitude = coords.latitude;
            longitude = coords.longitude;
        }
    } catch (err) {
        console.error('Geocoding failed:', err);
    }

    const query = `
        INSERT INTO cleaners (full_name, phone, home_postcode, tier_id, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.query(query, [
            full_name,
            phone,
            home_postcode,
            tier_id,
            latitude,
            longitude
        ]);
        return result.insertId;
    } catch (error) {
        console.error('Error creating cleaner:', error);
        throw error;
    }
}

async function getCleanerById(id) {
    const query = 'SELECT * FROM cleaners WHERE id = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error retrieving cleaner:', error);
        throw error;
    }
}

async function getAllCleaners() {
    const query = 'SELECT * FROM cleaners';
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error retrieving cleaners:', error);
        throw error;
    }
}

async function getCleanersByMinTier(minTier) {
    const query = 'SELECT * FROM cleaners WHERE tier_id >= ?';
    try {
        const [rows] = await pool.query(query, [minTier]);
        return rows;
    } catch (error) {
        console.error('Error retrieving cleaners:', error);
        throw error;
    }
}

async function updateCleaner(id, updateData) {
    const { full_name, phone, home_postcode, tier_id } = updateData;

    // Geocode first if a new postcode is provided
    let latitude = null;
    let longitude = null;
    if (home_postcode) {
        try {
            const coords = await Geocode(home_postcode);
            if (coords) {
                latitude = coords.latitude;
                longitude = coords.longitude;
            }
        } catch (err) {
            console.error(`Geocoding failed for cleaner ${id}:`, err);
        }
    }

    const query = `
        UPDATE cleaners
        SET full_name = ?, phone = ?, home_postcode = ?, tier_id = ?, latitude = COALESCE(?, latitude), longitude = COALESCE(?, longitude)
        WHERE id = ?
    `;

    try {
        const [result] = await pool.query(query, [
            full_name,
            phone,
            home_postcode,
            tier_id,
            latitude,
            longitude,
            id
        ]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating cleaner:', error);
        throw error;
    }
}

async function deleteCleaner(id) {
    const query = 'DELETE FROM cleaners WHERE id = ?';
    try {
        const [result] = await pool.query(query, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting cleaner:', error);
        throw error;
    }
}

export {
    createCleaner,
    getCleanerById,
    getAllCleaners,
    getCleanersByMinTier,
    updateCleaner,
    deleteCleaner
};