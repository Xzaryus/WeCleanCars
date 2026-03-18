import { Router }  from 'express';

const router = Router();

import {
    logon,
    register
} from '../controllers/adminController.js';

router.post('/logon', logon);
router.post('/register', register);

export default router;