import express from 'express';
import { Router }  from 'express';

import {
    createBookingForCustomerController,
    getAvailableBookingOptionsController
} from '../controllers/bookingController.js';

const router = Router();

// POST /api/bookings/available
router.post('/available', getAvailableBookingOptionsController);

// POST /api/bookings
router.post('/create', createBookingForCustomerController);


export default router;