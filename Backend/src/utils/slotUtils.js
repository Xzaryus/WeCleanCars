

// const slotOrder = [
//     "08:30-10:00",
//     "10:30-12:00",
//     "12:30-14:00",
//     "14:30-16:00",
//     "16:30-18:00",
//     "18:30-20:00"
// ]

const slotOrder = [
    "08:30-09:30",
    "09:30-10:30",
    "10:30-11:30",
    "11:30-12:30",
    "12:30-13:30",
    "13:30-14:30",
    "14:30-15:30",
    "15:30-16:30",
    "16:30-17:30",
    "17:30-18:30",
    "18:30-19:30",
    "19:30-20:30"
]

function isValidSlot(slot) {
    return slotOrder.includes(slot);
}

function expandSlots(startSlot, slotsRequired){
    const startIndex = slotOrder.indexOf(startSlot);
    if (startIndex === -1) return [];
    return slotOrder.slice(startIndex, startIndex + slotsRequired);
}

function areConsecutive(slots) {
    return slots.every((slot, idx) => {
        if (idx === 0) return true;
        const prevSlotIndex = slotOrder.indexOf(slots[idx - 1]);
        const currentSlotIndex = slotOrder.indexOf(slot);
        return currentSlotIndex === prevSlotIndex + 1;
    });
}



export {
    slotOrder,
    isValidSlot,
    expandSlots,
    areConsecutive
}