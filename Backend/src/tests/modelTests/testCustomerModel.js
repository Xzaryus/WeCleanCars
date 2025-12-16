import pool from "../../config/db.js";

import {
    createCustomer,
    getCustomerById,
    getCustomerByEmail,
    updateCustomer,
    deleteCustomer
} from "../../models/customerModel.js";

(async () => {
    try {
        console.log('--- Testing Customer Model ---');

    // 1. CREATE CUSTOMER
        const newCustomer = {
            full_name: 'Johnathan Doe',
            email: 'exampletestcustee@example.com',
            phone: '07967673668',
            address: 'Example Address'
        };

        const customerId = await createCustomer(newCustomer);
        console.log('Created customer with ID:', customerId);

    // 2. GET BY ID
        const customerById = await getCustomerById(customerId);
        console.log('Customer by ID:', customerById);

    // 3. GET BY EMAIL
        // const customerByEmail = await getCustomerByEmail('testcustomer@example.com');
        // console.log('Customer by Email:', customerByEmail);

    // 4. UPDATE CUSTOMER
        const updateData = {
            full_name: 'Updated Customer',
            email: 'updatedcustomer@example.com',
            phone: '9876543210',
            address: 'Updated Address'
        };

        // const updated = await updateCustomer(customerId, updateData);
        // console.log('Customer updated:', updated);

    // 5. DELETE CUSTOMER
        // const deleted = await deleteCustomer(customerId);
        // console.log('Customer deleted:', deleted);

    } catch (err) {
        console.error('Test error:', err);
    } finally {
        try{
            // await pool.query('DELETE FROM customers');    //! clears table for testing
            // await pool.query('ALTER TABLE customers AUTO_INCREMENT = 1');
            // console.log('Customers table cleared and reset.');
        } catch (error) {
            console.error('Error clearing customers table:', error);
        } finally{
            process.exit();
        }
    }
})();