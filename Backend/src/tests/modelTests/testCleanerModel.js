import pool from "../../config/db.js";

import {
    createCleaner,
    getCleanerById,
    getAllCleaners,
    updateCleaner,
    deleteCleaner
} from "../../models/cleanerModel.js";

(async () => {
    try {
        console.log('--- Testing Cleaner Model ---');

    // 1. CREATE CLEANER
        const newCleaner = {
            full_name: 'Jason Butler',
            phone: '07977253631',
            home_postcode: 'B24 9AQ',
            tier_id: 2
        };

        const cleanerId = await createCleaner(newCleaner);
        console.log('Created cleaner with ID:', cleanerId);

    // 2. GET BY ID
        // const cleanerById = await getCleanerById(cleanerId);
        // console.log('Cleaner by ID:', cleanerById);

    // 3. GET BY EMAIL
        // const everyCleaner = await getAllCleaners();
        // console.log('All of the Cleaners are:', everyCleaner);

    // 4. UPDATE CLEANER
        const updateData = {
            full_name: 'New Test Geo',
            phone: '9876543210',
            home_postcode: 'B29 4JU',
            tier_id: 1
        };

        // const updated = await updateCleaner(4, updateData);
        // console.log('Cleaner updated:', updated);

    // 5. DELETE CLEANER
        // const deleted = await deleteCleaner(cleanerId);
        // console.log('Cleaner deleted:', deleted);

    } catch (err) {
        console.error('Test error:', err);
    } finally {
        try{
            // await pool.query('DELETE FROM cleaners');    //! clears table for testing
            // await pool.query('ALTER TABLE cleaners AUTO_INCREMENT = 1');
            // console.log('Cleaners table cleared and reset.');
        } catch (error) {
            console.error('Error clearing cleaners table:', error);
        } finally {
        process.exit();
        }
    }
})();