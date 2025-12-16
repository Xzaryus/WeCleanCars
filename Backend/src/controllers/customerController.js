import {
    createCustomer,
    getCustomerById,
    getCustomerByEmail,
    updateCustomer,
    deleteCustomer,
    createCustomerAccount
} from '../models/customerModel.js';

// Create a new customer

async function addCustomer(req, res) {
    const customerData = req.body;
    if (!customerData.full_name || !customerData.email || !customerData.phone || !customerData.address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const id = await createCustomer(customerData);
        res.status(201).json({ message: 'Customer added', id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add customer' });
    }
}

// Get customer by ID
async function fetchCustomeryById(req, res) {
    const customerId = req.params.id;
    try {
        const customer = await getCustomerById(customerId);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve customer' });
    }
}

// Get customer by email
async function fetchCustomerByEmail(req, res) {
    const email = req.params.email;
    try {
        const customer = await getCustomerByEmail(email);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve customer' });
    }
}

// Update customer
async function editCustomer(req, res) {
    const customerId = req.params.id;
    const customerData = req.body;
    try {
        const updated = await updateCustomer(customerId, customerData);
        if (updated) {
            res.status(200).json({ message: 'Customer updated' });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update customer' });
    }
}

// Delete customer
async function removeCustomer(req, res) {
    const customerId = req.params.id;
    try {
        const deleted = await deleteCustomer(customerId);
        if (deleted) {
            res.status(200).json({ message: 'Customer deleted' });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
}


// Create customer account
async function createAccount(req, res) {
    const {name, phone, email, address, car, password} = req.body;
    if (!email || !password){
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const customer = await createCustomerAccount({name, phone, email, address, car, password});
        res.status(201).json({ message: 'Customer account created', customer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer account' });
    }
}

export { 
    addCustomer,
    fetchCustomeryById,
    fetchCustomerByEmail,
    editCustomer,
    removeCustomer,
    createAccount
};