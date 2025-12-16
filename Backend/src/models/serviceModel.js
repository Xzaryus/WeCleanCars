import pool from '../config/db.js';

// Get all services
async function getAllServices() {
    const [rows] = await pool.query('SELECT * FROM services');
    return rows;
}

// Get service by ID
async function getServiceById(id) {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0] || null;
}

async function getServiceTier(id) {
    const [rows] = await pool.query('SELECT required_tier FROM services WHERE id = ?', [id]);
    return rows[0]?.tier_id || null;
}

export { getAllServices, getServiceById, getServiceTier };
