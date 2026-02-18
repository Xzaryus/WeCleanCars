import { useState } from "react";
import axios from "axios";

export default function Step0CustomerCreation({ bookingData, setBookingData, setStep }) {

    const [form, setForm] = useState({
        full_name: bookingData.full_name || "",
        email: bookingData.email || "",
        phone: bookingData.phone || "",
        address: bookingData.address || ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const { data: res } = await axios.post(
            "http://localhost:3000/api/customers", // replace with your customer endpoint
            form
        );

        // Merge customer info into bookingData
        const updatedBookingData = {
        ...bookingData,
        customer_id: res.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address
    };
setBookingData(updatedBookingData);
console.log("Updated booking data:", updatedBookingData);

        console.log(res);

        setStep(1); // move to booking step

        } catch (err) {
        console.error(err);
        alert("Error creating customer. Please try again.");
        }
    };

    return (
        <form id="customerForm" onSubmit={handleSubmit}>
        <div className="formRow">
            <label htmlFor="full_name">Full Name:</label>
            <input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            />
        </div>

        <div className="formRow">
            <label htmlFor="email">Email:</label>
            <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            />
        </div>

        <div className="formRow">
            <label htmlFor="phone">Phone:</label>
            <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            />
        </div>

        <div className="formRow">
            <label htmlFor="address">Address:</label>
            <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            />
        </div>

        <div className="bottomButtons">
            <button type="submit">Continue</button>
        </div>
        </form>
    );
}
