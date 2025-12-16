import { getAvailabilityByCleanerAndDate } from "../models/availabilityModel.js";
import { slotOrder, areConsecutive } from "../utils/slotUtils.js";


async function findAvailableCleaners(eligibleCleaners, bookingDate, requiredSlots) {
    const results = [];

    for (const cleaner of eligibleCleaners) {
        // 1. Get all availability rows for this cleaner on the given date
        const availability = await getAvailabilityByCleanerAndDate(cleaner.id, bookingDate);

        if (!availability || availability.length === 0) continue;

        // 2. Sort slots in chronological order
        const sorted = availability.sort(
            (a, b) => slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot)
        );

        // 3. Look for consecutive free blocks
        const slotBlocks = [];
        for (let i = 0; i <= sorted.length - requiredSlots; i++) {
            const block = sorted.slice(i, i + requiredSlots);

            // check if every slot in the block is free
            const allFree = block.every(s => Number(s.is_booked) === 0 || !s.is_booked);

            // check if they are consecutive (e.g. slot 1 + slot 2)
            const consecutive = areConsecutive(block.map(s => s.slot));

            if (allFree && consecutive) {
                slotBlocks.push(block.map(s => ({ id: s.id, slot: s.slot })));
            }
        }

        // 4. Add this cleaner with their available slot options
        if (slotBlocks.length > 0) {
            results.push({
                cleaner: cleaner,
                availableOptions: slotBlocks
            });
        }
    }

    return results;
}

export { findAvailableCleaners };

// (async () => {
//     try {
//         const results = await findAvailableCleaners([{id: 3}, {id: 4}, {id: 6}], "2025-09-17", 2);
//         console.log(JSON.stringify(results, null, 2));
//     } catch (error) {
//         console.error(error);
//     }
// })();