import express from 'express';
import { Router }  from 'express';

import {
    createBookingForCustomerController,
    getAvailableBookingOptionsController,
    getBookingsByDateController,
    getBookingsByDateRangeController
} from '../controllers/bookingController.js';

const router = Router();

// POST /api/bookings/available
router.post('/available', getAvailableBookingOptionsController);
router.post('/create', createBookingForCustomerController);
router.get('/date/:date', getBookingsByDateController);
router.get('/date-range/:startDate/:endDate', getBookingsByDateRangeController);


export default router;