import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Step1BookingForm({ bookingData, setBookingData, setStep }) {

    const serviceTypes = [
        { id: 1, name: "£30 Detail" },
        { id: 2, name: "Full Steam Ahead" },
        { id: 3, name: "Whole Package" },
    ];

    const vehicleTypes = [
        { id: 1, name: "5 Seater" },
        { id: 2, name: "7 Seater" },
        { id: 3, name: "Van" },
    ];

    const [form, setForm] = useState({
        bookingAddress: bookingData.bookingAddress,
        date: bookingData.date,
        maxDistanceMiles: 10,
        vehicles: bookingData.vehicles || [{serviceId: 1, vehicleTypeId: 1}]
    });

    const updateVehicle = (index, field, value) => {
        const updatedVehicles = [...form.vehicles];
        updatedVehicles[index][field] = Number(value);
        setForm({ ...form, vehicles: updatedVehicles });
    }

    const addVehicle = () => {
        setForm({ 
            ...form,
            vehicles: [...form.vehicles, {serviceId: 1, vehicleTypeId: 1}]
        });
    }

    const removeVehicle = (index) => {
        setForm({
            ...form,
            vehicles: form.vehicles.filter((_, i) => i !== index)
        })
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const payload = {
        bookingAddress: form.bookingAddress,
        date: form.date,
        maxDistanceMiles: form.maxDistanceMiles,
        vehicles : form.vehicles.map(v => ({
            serviceId: v.serviceId,
            vehicleTypeId: v.vehicleTypeId
        }))
    }
    console.log(payload);

    const { data: cachedData, isFetching, refetch } = useQuery({
        queryKey: ["availableBookingOptions", payload],
        queryFn: async () => {
            const res = await axios.post("http://localhost:3000/api/bookings/available", payload);
            return res.data;
        },
        enabled: false,
        staleTime: 10 * 60 * 1000,
        cacheTime: 10 * 60 * 1000
    });

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (cachedData) {
                console.log("Cached data exists.")
            } else {
                console.log("Cached data does not exist.")
            }

            try {
                const { data: res } = await refetch();

                if (cachedData) {
                    console.log("Using cached data.");
                } else {
                    console.log("Fetching new data.");
                }

        if (!res || !res.availableCleaners.length) {
            alert("No cleaners available");
            return;
        }

        const services = payload.vehicles.map((v, i) => ({
            ...v,
            pricingMatrixId: res.pricingMatrixIds[i],
        }))

        setBookingData((prev) => ({
            ...prev,
            ...payload,
            services,
            pricingMatrixId: res.pricingMatrixIds,
            bookingCoords: res.bookingCoords,
            availableOptions: res.availableCleaners
        }));

        setStep(2);
        } catch (err) {
            if (err.response) {
                console.error("status:", err.response.status);
                console.error("Response data:", err.response.data);
            } else {
                console.error(err);
            }
        alert("Error fetching options");
        }
    };
    //! add error for no cleaners

    return (
        <form id="bookingForm" onSubmit={handleSubmit}>
            <div className="formRow">
                <label htmlFor="address">Address:</label>
                <input id="address"
                    name="bookingAddress"
                    value={form.bookingAddress}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="formRow">
                <label htmlFor="date">Date:</label>
                <input id="date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
            </div>
            

            {form.vehicles.map((vehicle, index) => (
                <div key={index}>
                    <div className="formRow">
                        <label htmlFor={`serviceType-${index}`}>Service Type:</label>
                        <select id={`serviceType-${index}`}
                        value={vehicle.serviceId}
                        onChange={(e) => updateVehicle(index, "serviceId", e.target.value)}
                        >
                        {serviceTypes.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                        </select>
                    </div>
                    <div className="formRow">
                        <label htmlFor={`vehicleType-${index}`}>Vehicle Type:</label>
                        <select id={`vehicleType-${index}`}
                        value={vehicle.vehicleTypeId}
                        onChange={(e) => updateVehicle(index, "vehicleTypeId", e.target.value)}
                        >
                        {vehicleTypes.map((v) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                        </select>
                    </div>

                    {form.vehicles.length > 1 && (
                    <button id="removeVehicle" type="button" onClick={() => removeVehicle(index)}>
                        Remove Vehicle
                    </button>
                    )}
                </div>
                ))}
            <div className="bottomButtons">
                <button type="button" onClick={addVehicle}>Add another vehicle</button>

                <button type="submit" disabled={isFetching}>Find Options</button>
            </div>
        </form>
    );
}
