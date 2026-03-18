import {
    login,
    createUser
} from '../models/newAdminModel.js';

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

export { logon, register };