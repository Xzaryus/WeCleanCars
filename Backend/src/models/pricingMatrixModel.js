import pool from '../config/db.js';

// Get all pricing rows
async function getAllPricing() {
    const [rows] = await pool.query('SELECT * FROM pricing_matrix');
    return rows;
}

async function getPricingMatrixId(serviceId, vehicleTypeId) {
    const query = `
        SELECT id FROM pricing_matrix
        WHERE service_id = ? AND vehicle_type_id = ?
    `;
    const [rows] = await pool.query(query, [serviceId, vehicleTypeId]);
    return rows[0]?.id || null;
}

// Get price by service + vehicle type
async function getPrice(serviceId, vehicleTypeId) {
    const query = `
        SELECT base_price FROM pricing_matrix
        WHERE service_id = ? AND vehicle_type_id = ?
    `;
    const [rows] = await pool.query(query, [serviceId, vehicleTypeId]);
    return rows[0] || null;
}

async function getRequiredSlots(serviceId, vehicleTypeId) {
    const query = `
        SELECT slots_required FROM pricing_matrix
        WHERE service_id = ? AND vehicle_type_id = ?
    `;
    const [rows] = await pool.query(query, [serviceId, vehicleTypeId]);
    return rows[0]?.slots_required || null;
}

export { getAllPricing, getPricingMatrixId, getPrice, getRequiredSlots };
