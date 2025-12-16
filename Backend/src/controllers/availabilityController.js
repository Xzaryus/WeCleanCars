import {
    addAvailability,
    getAvailabilityByCleanerAndDate,
    getAvailabilityByCleaner,
    getAvailabilityByDate,
    bookSlot,
    unbookSlot
} from '../models/availabilityModel.js';

// Get all availability for a cleaner
async function fetchAvailabilityByCleaner(req, res) {
    const { cleanerId } = req.params;
    if (!cleanerId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const availability = await getAvailabilityByCleaner(cleanerId);
        res.json(availability);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
}

// Get availability for a cleaner on a specific date
async function fetchAvailabilityByCleanerAndDate(req, res) {
    const { cleanerId, date } = req.params;
    if (!cleanerId || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const availability = await getAvailabilityByCleanerAndDate(cleanerId, date);
        res.json(availability);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch availability for that date' });
    }
}

// Get all availability on a specific date
async function fetchAvailabilityByDate(req, res) {
    const { date } = req.params;
    if (!date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const availability = await getAvailabilityByDate(date);
        res.json(availability);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch availability for that date' });
    }
}

// Add availability
async function createAvailability(req, res) {
    const availabilityData = req.body;
    if (!availabilityData.cleaner_id || !availabilityData.date || !availabilityData.slot) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const id = await addAvailability(availabilityData);
        res.status(201).json({ message: 'Availability added', id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add availability' });
    }
}

// Book a slot
async function reserveSlot(req, res) {
    const { availabilityId, bookingId, cleanerId } = req.body;
    if (!availabilityId || !bookingId || !cleanerId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const success = await bookSlot(availabilityId, bookingId, cleanerId);
        if (!success) return res.status(400).json({ error: 'Slot already booked or invalid' });
        res.json({ message: 'Slot booked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to book slot' });
    }
}

// Unbook a slot
async function releaseSlot(req, res) {
    const { availabilityId, cleanerId } = req.body;
    if (!availabilityId || !cleanerId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const success = await unbookSlot(availabilityId, cleanerId);
        if (!success) return res.status(400).json({ error: 'Slot not booked or invalid' });
        res.json({ message: 'Slot unbooked' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unbook slot' });
    }
}

export {
    fetchAvailabilityByCleaner,
    fetchAvailabilityByCleanerAndDate,
    fetchAvailabilityByDate,
    createAvailability,
    reserveSlot,
    releaseSlot
};