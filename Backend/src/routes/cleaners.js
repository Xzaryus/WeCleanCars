import express from 'express';
import { Router }  from 'express';

const router = Router();

import {
    addCleaner,
    fetchCleanerById,
    fetchAllCleaners,
    editCleaner,
    removeCleaner
} from '../controllers/cleanerController.js';

router.post('/cleaners', addCleaner);
router.get('/cleaners/:id', fetchCleanerById);
router.get('/cleaners', fetchAllCleaners);
router.put('/cleaners/:id', editCleaner);
router.delete('/cleaners/:id', removeCleaner);

export default router;