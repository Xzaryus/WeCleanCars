import { Router }  from 'express';

const router = Router();

import {
    logon,
    register,
    fetchAllServices,
    fetchAllVehicleTypes
} from '../controllers/adminController.js';

router.post('/logon', logon);
router.post('/register', register);
router.get('/services', fetchAllServices);
router.get('/vehicle-types', fetchAllVehicleTypes);

export default router;