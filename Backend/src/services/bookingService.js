import { Geocode } from "../utils/calculateDistance.js";
import { findEligibleCleaners } from "./cleanerService.js";
import { findAvailableCleaners } from "./availabilityService.js";
import { createBooking } from "../models/bookingModel.js";
import { bookSlot } from "../models/availabilityModel.js";
import { getRequiredSlots, getPricingMatrixId } from "../models/pricingMatrixModel.js";
import { getServiceTier } from "../models/serviceModel.js";
import { calculateBookingPrice } from "../utils/priceUtils.js";
import pool from "../config/db.js";

/**
 * Get all possible slot blocks for customer to choose from
 * @param {string} bookingAddress - Address to clean
 * @param {number} requiredSlots - number of consecutive slots needed
 * @param {number} maxDistanceMiles - maximum allowed travel distance
 * @param {Array<{serviceId: number, vehicleTypeId: number}>} vehicles - array of vehicle types
 * @param {string} date - booking date
 * @returns {Array} List of cleaners with their available slot blocks and distances
 */
async function getAvailableBookingOptions(bookingAddress, maxDistanceMiles, date, vehicles) {
    // 1. Geocode the booking address
    const bookingCoords = await Geocode(bookingAddress);
    // 2. get the required tier
    const tiers = await Promise.all(vehicles.map(v => getServiceTier(v.serviceId)));
    const requiredTier = Math.max(...tiers);
    // 3. Get all eligible cleaners within distance & tier
    const eligibleCleaners = await findEligibleCleaners(bookingCoords, maxDistanceMiles, date, requiredTier);

    if (!eligibleCleaners.length) return [];

    // 4. Get the required number of slots and pricing matrix id
        let totalRequiredSlots = 0;
        const pricingMatrixIds = [];

    for (const vehicle of vehicles) {
        const { serviceId, vehicleTypeId } = vehicle;

        const requiredSlots = await getRequiredSlots(serviceId, vehicleTypeId);
        totalRequiredSlots += requiredSlots;

        const pricingMatrixId = await getPricingMatrixId(serviceId, vehicleTypeId);
        pricingMatrixIds.push(pricingMatrixId);
    }

    // 5. For each cleaner, find available consecutive slots for the date
    const availableCleaners = await findAvailableCleaners(eligibleCleaners, date, totalRequiredSlots);

    return {availableCleaners, bookingCoords, pricingMatrixIds}; // Array of { cleaner, availableOptions: [ [{id, slot}, ...] ] }
}

// (async () => {
//     try {
//         const results = await getAvailableBookingOptions("38 Moxhull Rd, B37 6LL", 10, "2025-09-17", [{serviceId: 1, vehicleTypeId: 1}, {serviceId: 2, vehicleTypeId: 2}]);
//         console.log(JSON.stringify(results, null, 2));
//     } catch (error) {
//         console.error(error);
//     }
// })();

/**
 * @param {Object} bookingRequest
 * @param {number} bookingRequest.customer_id
 * @param {number} bookingRequest.selectedCleanerId
 * @param {Array} bookingRequest.chosenSlots - array of availability IDs
 * @param {Array} bookingRequest.slotTimes - array of slot strings
 * @param {string} bookingRequest.date
 * @param {string} bookingRequest.address
 * @param {{ latitude: number, longitude: number }} bookingRequest.bookingCoords
 * @param {Array<{serviceId: number, vehicleTypeId: number, pricingMatrixId?: number}>} bookingRequest.services - array of service objects
 * @param {number} bookingRequest.num_cars
 * @param {number} bookingRequest.cleanerDistance - distance in miles (from eligible cleaners)
 */
async function createBookingForCustomer(bookingRequest) {
    const {
        customer_id,
        selectedCleanerId,
        chosenSlots,
        slotTimes,
        date,
        address,
        bookingCoords: { latitude, longitude },
        services,
        num_cars = 1,
        cleanerDistance
    } = bookingRequest;

    if (!chosenSlots || chosenSlots.length === 0) {
        throw new Error("No slots selected");
    }

    if (!Array.isArray(chosenSlots) || chosenSlots.length !== services.length) {
        throw new Error("Chosen slots must be an array and match number of service types");
    }

    if (!Array.isArray(services)) {
        throw new Error("Service type is not an array");
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const priceResult = await calculateBookingPrice(services, cleanerDistance);

        const bookingResults = [];

        for (let i = 0; i < services.length; i++) {
            const serviceObj = services[i];
            const slotIds = chosenSlots[i];
            const slotTimeBlock = slotTimes[i];
            const slotTime = slotTimeBlock[0];

            const requiredSlots = await getRequiredSlots(serviceObj.serviceId, serviceObj.vehicleTypeId);
            if (!requiredSlots) {
                throw new Error(`Required slots not found for service ${serviceObj.serviceId} and vehicle type ${serviceObj.vehicleTypeId}`);
            }

            if (slotIds.length < requiredSlots) {
                throw new Error(`Not enough slots available for service ${serviceObj.serviceId} and vehicle type ${serviceObj.vehicleTypeId}`);
            }

            if (slotIds.length > requiredSlots) {
                throw new Error(`Too many slots selected for service ${serviceObj.serviceId} and vehicle type ${serviceObj.vehicleTypeId}`);
            }

            // Only apply travel fee on the first booking
            const travelFee = i === 0 ? priceResult.travelFee : 0.00;

            // First booking gets service + travel, others just get their service portion
            const totalPrice =
                i === 0
                    ? priceResult.servicePriceBreakdown[i] + travelFee
                    : priceResult.servicePriceBreakdown[i];
            
                    // !DOUBLE CHECK PRICING FOR DOEUBLE CHARGING

            const { serviceId, vehicleTypeId } = serviceObj;

            const bookingId = await createBooking(connection,{
                customer_id,
                service_id: serviceId,
                vehicle_type_id: vehicleTypeId,
                pricing_matrix_id: serviceObj.pricingMatrixId || null, // we can fetch this if needed from pricing_matrix
                num_cars,
                slots_required: slotIds.length,
                start_slot: slotTime,
                date,
                address,
                latitude,
                longitude,
                assigned_cleaner_id: selectedCleanerId,
                travel_fee: travelFee,
                total_price: totalPrice,
                status: "pending"
            });


            for (const slotId of slotIds) {
                const success = await bookSlot(connection,slotId, bookingId, selectedCleanerId);
                if (!success) {
                    throw new Error(`Failed to book slot ID ${slotId}`);
                }
            }

            bookingResults.push({
                bookingId,
                cleanerId: selectedCleanerId,
                slots: slotIds,
                travelFee,
                totalPrice
            });
        }

    await connection.commit();
    return bookingResults;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}


export { getAvailableBookingOptions, createBookingForCustomer };