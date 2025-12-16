import pool from '../config/db.js';
import bcrypt from 'bcrypt';

async function createCustomer(customerData) {
    const { full_name, email, phone, address } = customerData;

    const query = `
        INSERT INTO customers (full_name, email, phone, address)
        VALUES (?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.query(query, [full_name, email, phone, address]);
        return result.insertId;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

async function getCustomerById(id) {
    const query = 'SELECT * FROM customers WHERE id = ?';
    try {
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
}

async function getCustomerByEmail(email) {
    const query = 'SELECT * FROM customers WHERE email = ?';
    try {
        const [rows] = await pool.query(query, [email]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
}

async function updateCustomer(id, updateData) {
    const { full_name, email, phone, address } = updateData;

    const query = `
        UPDATE customers
        SET full_name = ?, email = ?, phone = ?, address = ?
        WHERE id = ?
    `;

    try {
        const [result] = await pool.query(query, [full_name, email, phone, address, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
}

async function deleteCustomer(id) {
    const query = 'DELETE FROM customers WHERE id = ?';
    try {
        const [result] = await pool.query(query, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
}

async function createCustomerAccount({name, phone, email, address, vehicle, password}) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const existingCustomer = await getCustomerByEmail(email);

    if (existingCustomer && existingCustomer.has_account) {
        throw new Error('Customer already has an account');
    }
    else if (existingCustomer) {
        await pool.query('UPDATE customers SET full_name = ?, phone = ?, address = ?, password = ?, has_account = ?, vehicle_type_id = ? WHERE email = ?',
            [name, phone, address, hashedPassword, true, vehicle, email]);
        return {
            id: existingCustomer.id,
            name,
            phone,
            email,
            address,
            vehicle,
            hasAccount: true
        }
    } else {
        const [result] = await pool.query('INSERT INTO customers (full_name, phone, email, address, password, has_account, vehicle_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, phone, email, address, hashedPassword, true, vehicle]);
        return {
            id: result.insertId,
            name,
            phone,
            email,
            address,
            vehicle,
            hasAccount: true
        }
    }
}
export {
    createCustomer,
    getCustomerById,
    getCustomerByEmail,
    updateCustomer,
    deleteCustomer,
    createCustomerAccount
};