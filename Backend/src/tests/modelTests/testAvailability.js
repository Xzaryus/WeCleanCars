import pool from "../../config/db.js";

import {
    addAvailability,
    getAvailabilityByCleanerAndDate,
    getAvailabilityByCleaner,
    getAvailabilityByDate,
    bookSlot,
    unbookSlot
} from '../../models/availabilityModel.js';

(async () => {
    try {
        console.log('--- testing availability model ---');

    // 1. ADD AVAILABILITY
        const availabilityData = {
            cleaner_id: 7,
            date: '2025-09-17',
            slot: '18:30-20:00'
        };

        const availabilityId = await addAvailability(availabilityData);
        console.log('Added availability with ID:', availabilityId);
// 
    // 2. GET AVAILABILITY BY CLEANER AND DATE
        // const availabilityByCleanerAndDate = await getAvailabilityByCleanerAndDate(6, '2025-09-17');
        // console.log('Availability by Cleaner and Date:', availabilityByCleanerAndDate);

    // 3. GET AVAILABILITY BY CLEANER
        // const availabilityByCleaner = await getAvailabilityByCleaner(1);
        // console.log('Availability by Cleaner:', availabilityByCleaner);

    // 4. GET AVAILABILITY BY DATE
        // const availabilityByDate = await getAvailabilityByDate('2025-09-17');
        // console.log('Availability by Date:', availabilityByDate);

    // 5. BOOK SLOT
        const bookingData = {
            cleaner_id: 2,
            date: '2025-09-17',
            slot: '10:30-12:00'
        };

        // const isBooked = await bookSlot(4, 3, 2);
        // console.log('Booked slot:', isBooked);

    // 6. UNBOOK SLOT
        // const isUnbooked = await unbookSlot(21, 5);
        // console.log('Unbooked slot:', isUnbooked);

    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        process.exit();
    }
})();