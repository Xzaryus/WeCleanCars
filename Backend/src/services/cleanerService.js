// services/cleanerService.js
import { getAllCleaners, getCleanersByMinTier } from '../models/cleanerModel.js';
import { RoadDistance } from '../utils/calculateDistance.js';
import { getCleanerLocation } from '../utils/cleanerLocation.js';

/**
 * Find eligible cleaners for a booking based on distance and optional tier
 * @param {string} bookingAddress - The address of the booking
 * @param {number} maxDistanceMiles - Maximum travel distance in miles
 * @param {number|null} requiredTier - Optional filter for cleaner tier (1 or 2)
 * @returns {Array} List of cleaners with distance info
 */
async function findEligibleCleaners(bookingCoords, maxDistanceMiles, date, requiredTier = null) {
    try {
        // Fetch all cleaners or cleaners with minimum tier
        const cleaners = requiredTier ? await getCleanersByMinTier(requiredTier) : await getAllCleaners();

        const eligibleCleaners = [];

        // Loop through cleaners and calculate distance
        for (const cleaner of cleaners) {
            const cleanerCoords = await getCleanerLocation(cleaner.id, date);
            if (!cleanerCoords) continue;

            const roadInfo = await RoadDistance(cleanerCoords, bookingCoords);
            if (!roadInfo) continue;

            const distanceMiles = parseFloat(roadInfo.distance);

            // Apply max distance filter
            if (distanceMiles <= maxDistanceMiles) {
                eligibleCleaners.push({
                    ...cleaner,
                    distance: distanceMiles,
                    travelTimeSeconds: roadInfo.duration
                });
            }
        }

        // Sort cleaners by distance (closest first)
        eligibleCleaners.sort((a, b) => a.distance - b.distance);

        return eligibleCleaners;
    } catch (error) {
        console.error('Error finding eligible cleaners:', error);
        throw error;
    }
}

export {
    findEligibleCleaners
};
