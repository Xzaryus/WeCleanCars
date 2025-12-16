import './index.css'
import { useState } from "react";
import Step1BookingForm from "./components/BookingForm.jsx";
import Step2CleanerOptions from "./components/CleanerOptions.jsx";
import Step3CreateBooking from "./components/CreateBooking.jsx";
import Step4Payment from "./components/Payment.jsx";

function App() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    customer_id: 7, // hardcoded for now
  });
  const [paymentData, setPaymentData] = useState({});

  return (
    <div>
      <h1>Booking Flow Test</h1>

      {step === 1 && (
        <Step1BookingForm bookingData={bookingData} setBookingData={setBookingData} setStep={setStep} />
      )}

      {step === 2 && (
        <Step2CleanerOptions bookingData={bookingData} setBookingData={setBookingData} setStep={setStep} />
      )}

      {step === 3 && (
        <Step3CreateBooking bookingData={bookingData} setBookingData={setBookingData} setStep={setStep} paymentData={paymentData} setPaymentData={setPaymentData} />
      )}

      { step === 4 && (
        <Step4Payment 
          bookingIds={paymentData.bookingIds} 
          amount={paymentData.amount}
          bookings={paymentData.bookings}
          setStep={setStep}
        />
      )} 
    </div>
  );
}

export default App;
