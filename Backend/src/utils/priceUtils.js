import { getPrice } from "../models/pricingMatrixModel.js";
/**
 * Calculate travel fee
 * @param {number} distanceMiles - Distance from cleaner to booking in miles
 * @returns {number} Travel fee (£)
 */
function calculateTravelFee(distanceMiles) {

    if (!distanceMiles || distanceMiles <= 1) return 0.00; // first mile free
    const extraMiles = distanceMiles - 1;
    return parseFloat((extraMiles * 1.25).toFixed(2));
}

/**
 * Get base price for a given service type
 * @param {number} serviceId - Name of the service
 * @param {number} vehicleTypeId - Vehicle type
 * @returns {number} Base price (£)
 */

async function getBasePrice(serviceId, vehicleTypeId) {
    
    const row = await getPrice(serviceId, vehicleTypeId);
    return row ? parseFloat(row.base_price) : 0;
}

/**
 * Calculate total booking price
 * @param {{ serviceId: number, vehicleTypeId: number }[]} services - Array of services chosen (one per car)
 * @param {number} slotsRequired - Number of slots booked
 * @param {number} distanceMiles - Cleaner distance in miles
 * @returns {{ travelFee: number, servicePrice: number, totalPrice: number }}
 */
async function calculateBookingPrice(services, distanceMiles) {
    // Base price * cars 
    const pricePromises = services.map(s => getBasePrice(s.serviceId, s.vehicleTypeId));
    const prices = await Promise.all(pricePromises);

    const servicePrice = prices.reduce((sum, p) => sum + p, 0);


    // Travel fee
    const hasWholePackage = services.some(s => s.serviceId === 3)
    const travelFee = hasWholePackage ? 0 : calculateTravelFee(distanceMiles);
    

    // Total
    const totalPrice = parseFloat((servicePrice + travelFee).toFixed(2));

    return {
        travelFee,
        servicePrice,
        totalPrice,
        servicePriceBreakdown: prices
    };
}

// (async () => {
//     try {
//         const results = await calculateBookingPrice(
//             [
//                 { serviceId: 1, vehicleTypeId: 1 },
//                 { serviceId: 2, vehicleTypeId: 2 },
//             ],
//             5.7
//         );
//         console.log(JSON.stringify(results, null, 2));
//     } catch (error) {
//         console.error(error);
//     }
// })();


export {
    calculateTravelFee,
    getBasePrice,
    calculateBookingPrice
};