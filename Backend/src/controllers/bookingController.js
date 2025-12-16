import {
    createBookingForCustomer,
    getAvailableBookingOptions
} from '../services/bookingService.js';


async function getAvailableBookingOptionsController(req, res) {
    try {
        const { bookingAddress, maxDistanceMiles, date, vehicles } = req.body;

        // Basic validation (optional)
        if (!bookingAddress || !maxDistanceMiles || !date || !vehicles) {
            return res.status(400).json({ message: 'Missing required booking fields.' });
        }

        const result = await getAvailableBookingOptions(
            bookingAddress,
            maxDistanceMiles,
            date,
            vehicles
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching available booking options:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

async function createBookingForCustomerController(req, res) {
    try {
        const bookingData = req.body;

        if (!bookingData.customer_id || !bookingData.selectedCleanerId) {
        return res.status(400).json({ message: 'Missing customer or cleaner information.' });
        }

        const bookingResults = await createBookingForCustomer(bookingData);
        res.status(201).json({ success: true, bookings: bookingResults });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

export {
    getAvailableBookingOptionsController,
    createBookingForCustomerController
};