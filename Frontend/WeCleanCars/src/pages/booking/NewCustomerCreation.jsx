import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Step0CustomerCreation() {
    const [bookingData, setBookingData] = useOutletContext();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: bookingData.full_name || "",
        email: bookingData.email || "",
        phone: bookingData.phone || "",
        address: bookingData.address || ""
    });

    const postcodeCheck = async (postcode) => {
        try {
            const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const postcodeResult = await postcodeCheck(form.postcode);
        if (!postcodeResult || postcodeResult.false) {
            alert("Invalid postcode. Please enter a valid postcode.");
            return;
        }
        try {
            // Check if postcode is valid

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
                address: form.postcode + " " + form.address
            };
        setBookingData(updatedBookingData);
        console.log("Updated booking data:", updatedBookingData);

        console.log(res);

        navigate("/details"); // move to booking step

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
            <label htmlFor="postcode">Postcode:</label>
            <input
            id="postcode"
            name="postcode"
            value={form.postcode}
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
