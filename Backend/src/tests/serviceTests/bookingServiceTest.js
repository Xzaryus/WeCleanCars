import { createBookingForCustomer } from "../../services/bookingService.js";

async function testCreateBooking() {
    try {
        // Simulated frontend request data
        const bookingRequest = {
            customer_id: 2,
            selectedCleanerId: 3,
            chosenSlots: [[24]], // availability IDs returned from findAvailableCleaners
            slotTimes: [["08:30-10:00"]], // human-readable slot strings
            date: "2025-09-17",
            address: "63 Vicarage Road, B6 5JU",
            bookingCoords: { latitude: 52.50288, longitude: -1.87956 },
            services: [{ serviceId: 2, vehicleTypeId: 1, pricingMatrixId: 4 }],
            num_cars: 1,
            cleanerDistance: 8.16 // miles (already calculated in findEligibleCleaners)
        };

        const result = await createBookingForCustomer(bookingRequest);

        console.log("Booking created successfully:", result);
    } catch (error) {
        console.error("Booking creation failed:", error.message);
    }
}

// Run test
testCreateBooking();