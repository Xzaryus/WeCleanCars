import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function BookingLayout() {
    const [bookingData, setBookingData] = useState({});
    const [paymentData, setPaymentData] = useState({});
    
    return (
        //!  Header and progress bar 
        <Outlet 
            context={[ 
                bookingData,
                setBookingData,
                paymentData,
                setPaymentData
            ]}
        />
    );
}