import {
    login,
    createUser
} from '../models/newAdminModel.js';
import {getAllVehicleTypes} from '../models/VehicleModel.js';
import { getAllServices } from '../models/serviceModel.js';

async function logon(req, res) {
    const { username, password } = req.body;
    const user = await login(username, password);
    res.json(user);
}

async function register(req, res) {
    const { username, password, role } = req.body;
    const id = await createUser(username, password, role);
    res.json({ message: 'User created', id });
}

async function fetchAllServices(req, res) {
    try {
        const services = await getAllServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
}

async function fetchAllVehicleTypes(req, res) {
    try {
        const vehicleTypes = await getAllVehicleTypes();
        res.json(vehicleTypes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicle types' });
    }
}

export { 
    logon,
    register,
    fetchAllServices,
    fetchAllVehicleTypes
};