import pool from '../config/db.js';

// Get all vehicle types
async function getAllVehicleTypes() {
    const [rows] = await pool.query('SELECT * FROM vehicle_types');
    return rows;
}

// Get vehicle type by ID
async function getVehicleTypeById(id) {
    const [rows] = await pool.query('SELECT * FROM vehicle_types WHERE id = ?', [id]);
    return rows[0] || null;
}

export { getAllVehicleTypes, getVehicleTypeById };
