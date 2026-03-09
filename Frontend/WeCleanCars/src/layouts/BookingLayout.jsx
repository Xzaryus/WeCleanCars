import { Outlet } from "react-router-dom";
import { useState } from "react";
// import "./bookings.css";

export default function BookingLayout() {
    const [bookingData, setBookingData] = useState({});
    const [paymentData, setPaymentData] = useState({});
    
    return (
        //!  Header and progress bar 
        <div className = "main">
            <div className="allForms">
                <Outlet 
                    context={[ 
                        bookingData,
                        setBookingData,
                        paymentData,
                        setPaymentData
                    ]}
                />
            </div>
        </div>
        );
}