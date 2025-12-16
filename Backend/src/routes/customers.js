import express from 'express';
import { Router }  from 'express';

const router = Router();

import { 
    addCustomer,
    fetchCustomeryById,
    fetchCustomerByEmail,
    editCustomer,
    removeCustomer,
    createAccount
} from '../controllers/customerController.js';

router.post('/customers', addCustomer);
router.post('/customers/account', createAccount);
router.get('/customers/email/:email', fetchCustomerByEmail);
router.get('/customers/:id', fetchCustomeryById);
router.put('/customers/:id', editCustomer);
router.delete('/customers/:id', removeCustomer);

export default router;
