import pool from "../config/db.js";

async function login(username, password) {
    const query = 'SELECT * FROM users WHERE username = ? AND passcode = ?';
    try {
        const [rows] = await pool.query(query, [username, password]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
}

async function createUser(username, password, role) {
    const query = 'INSERT INTO users (username, passcode, role) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.query(query, [username, password, role]);
        return result.insertId;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export {
    login,
    createUser
};