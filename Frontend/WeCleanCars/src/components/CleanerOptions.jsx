import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Step2SelectOption({ bookingData, setBookingData, setStep }) {
    const [selectedBlock, setSelectedBlock] = useState(null);
    // const [availableOptions, setAvailableOptions] = useState([]);

    // useEffect(() => {
    //     // Try to load cached API response from Step 1
    //     const cached = sessionStorage.getItem("availableOptions");
    //     if (cached) {
    //     const parsed = JSON.parse(cached);
    //     if (parsed.availableCleaners) {
    //         setAvailableOptions(parsed.availableCleaners);

    //         // Optionally restore bookingData if not already set
    //         if (!bookingData.availableOptions) {
    //         setBookingData((prev) => ({
    //             ...prev,
    //             availableOptions: parsed.availableCleaners,
    //             pricingMatrixId: parsed.pricingMatrixIds,
    //             bookingCoords: parsed.bookingCoords,
    //         }));
    //         }
    //     }
    //     } else {
    //     // fallback to current bookingData
    //     setAvailableOptions(bookingData.availableOptions || []);
    //     }
    // }, [bookingData.availableOptions, setBookingData]);

    const queryClient = useQueryClient();

    useEffect(() => {
        setSelectedBlock(null);
    }, [])

    // Get cached response from Step 1
    const cachedData = queryClient.getQueryData([
        "availableBookingOptions",
        {
        bookingAddress: bookingData.bookingAddress,
        date: bookingData.date,
        maxDistanceMiles: bookingData.maxDistanceMiles,
        vehicles: bookingData.services?.map(s => ({
            serviceId: s.serviceId,
            vehicleTypeId: s.vehicleTypeId
        })) || []
        }
    ]);

    const availableOptions = cachedData?.availableCleaners || bookingData.availableOptions || [];

    const handleSelect = (cleaner, slotBlock) => {
        setSelectedBlock({ cleaner, slotBlock });
    };

    const handleNext = () => {
        if (!selectedBlock) {
            alert("Please select a time block.");
            return;
        }

        const updatedBookingData = {
            ...bookingData,
            selectedCleanerId: selectedBlock.cleaner.id,
            chosenSlots: [selectedBlock.slotBlock.map(s => s.id)],
            slotTimes: selectedBlock.slotBlock.map(s => s.slot),
            cleanerDistance: selectedBlock.cleaner.distance
        };
        setBookingData(updatedBookingData);

          // Flattened payload 
        const payload = {
            customer_id: updatedBookingData.customer_id,
            selectedCleanerId: updatedBookingData.selectedCleanerId,
            chosenSlots: updatedBookingData.chosenSlots.flat().map(slot => [slot]),
            slotTimes: [updatedBookingData.slotTimes].flat().map(slot => [slot]),
            date: updatedBookingData.date,
            address: updatedBookingData.bookingAddress,
            bookingCoords: updatedBookingData.bookingCoords,
            services: updatedBookingData.services.map((s) => (
            {
                serviceId: s.serviceId,
                vehicleTypeId: s.vehicleTypeId,
                pricingMatrixId: s.pricingMatrixId
            }
            )),
            num_cars: updatedBookingData.services.length,
            cleanerDistance: updatedBookingData.cleanerDistance
        };

        console.log("Flattened booking payload:", payload);

        setBookingData(payload);

        setStep(3); // move to next step
    };

    return (
        <div>
            <h2>Select a Time Block</h2>
            {availableOptions.length === 0 ? (
                <p>No available options for your booking.</p>
            ) : (
                availableOptions.map(({ cleaner, availableOptions: blocks }) => (
                    <div key={cleaner.id}>
                        <p><strong>Cleaner:</strong> {cleaner.full_name}</p>
                        <p><strong>Distance:</strong> {cleaner.distance.toFixed(2)} miles</p>

                        {blocks.map((block, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(cleaner, block)}
                            >
                                {block.map(s => s.slot).join(" / ")}
                            </button>
                        ))}
                    </div>
                ))
            )}
            <button onClick={handleNext}>Next</button>
            <button onClick={() => {
                setSelectedBlock(null);
                setBookingData(prev => ({
                    ...prev,
                    selectedCleanerId: null,
                    chosenSlots: [],
                    slotTimes: [],
                    cleanerDistance: null
                }));
                setStep(1);
                }}
                >
                Back
            </button>
        </div>
    );
}
