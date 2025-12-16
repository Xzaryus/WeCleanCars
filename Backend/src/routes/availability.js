import express from 'express';
import { Router }  from 'express';

const router = Router();

import {
    fetchAvailabilityByCleaner,
    fetchAvailabilityByCleanerAndDate,
    fetchAvailabilityByDate,
    createAvailability,
    reserveSlot,
    releaseSlot
} from '../controllers/availabilityController.js';


router.get('/availability/date/:date', fetchAvailabilityByDate);
router.get('/availability/:cleanerId/:date', fetchAvailabilityByCleanerAndDate);
router.get('/availability/:cleanerId', fetchAvailabilityByCleaner);
router.post('/availability', createAvailability);
router.post('/availability/reserve', reserveSlot);
router.post('/availability/release', releaseSlot);

export default router;