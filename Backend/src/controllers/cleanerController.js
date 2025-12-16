import {
    createCleaner,
    getCleanerById,
    getAllCleaners,
    updateCleaner,
    deleteCleaner
} from "../models/cleanerModel.js";

// Create a new cleaner
async function addCleaner(req, res) {
    const cleanerData = req.body;
    if (!cleanerData.full_name || !cleanerData.phone || !cleanerData.home_postcode || !cleanerData.tier) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const id = await createCleaner(cleanerData);
        res.status(201).json({ message: 'Cleaner added', id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add cleaner' });
    }
}

// Get cleaner by ID
async function fetchCleanerById(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Missing cleaner ID' });
    }
    try {
        const cleaner = await getCleanerById(id);
        if (cleaner) {
            res.status(200).json(cleaner);
        } else {
            res.status(404).json({ error: 'Cleaner not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cleaner' });
    }
}

// Get all cleaners
async function fetchAllCleaners(req, res) {
    try {
        const cleaners = await getAllCleaners();
        res.json(cleaners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cleaners' });
    }
}

// Update cleaner by ID
async function editCleaner(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    if (!id || !updateData) {
        return res.status(400).json({ error: 'Missing cleaner ID or update data' });
    }
    try {
        const updated = await updateCleaner(id, updateData);
        if (updated) {
            res.status(200).json({ message: 'Cleaner updated' });
        } else {
            res.status(404).json({ error: 'Cleaner not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cleaner' });
    }
}

// Delete cleaner by ID
async function removeCleaner(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Missing cleaner ID' });
    }
    try {
        const deleted = await deleteCleaner(id);
        if (deleted) {
            res.status(200).json({ message: 'Cleaner deleted' });
        } else {
            res.status(404).json({ error: 'Cleaner not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete cleaner' });
    }
}

export {
    addCleaner,
    fetchCleanerById,
    fetchAllCleaners,
    editCleaner,
    removeCleaner
}