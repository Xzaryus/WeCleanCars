import './index.css'
// import { useEffect } from "react";
import { useState} from "react";
import Step1BookingForm from "./components/BookingForm.jsx";
import Step2CleanerOptions from "./components/CleanerOptions.jsx";
import Step3CreateBooking from "./components/CreateBooking.jsx";
import Step4Payment from "./components/Payment.jsx";
import { bookingStepInfo } from './config/extraInfo.js';

function App() {
  const [step, setStep] = useState(1);
  // const [theme, setTheme] = useState("light");
  const [bookingData, setBookingData] = useState({
    customer_id: 7, // hardcoded for now
  });
  const [paymentData, setPaymentData] = useState({});

  // useEffect(() => {
  //   const root = document.documentElement;
  //   root.classList.toggle("dark", theme === "dark");
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme(prev => (prev === "light" ? "dark" : "light"));
  // };

  return (
    <>  
      <header>
        <ul id = "progressBar">
          <li className={step === 1 ? "active" : ""}>Your details</li>
          <li className={step === 2 ? "active" : ""}>Pick a Cleaner</li>
          <li className={step === 3 ? "active" : ""}>Confirmation</li>
          <li className={step === 4 ? "active" : ""}>Payment</li>
        </ul>
        {/* <button id = "themeButton" onClick={toggleTheme}>
          {theme === "light" ? "Dark" : "Light"} Mode
        </button> */}
      </header>
      <div className="main">
        <div id = "allForms">
          {/* <h1 id = "title">Booking Flow Test</h1> */}

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
          <aside>
            <h2>{bookingStepInfo[step].title}</h2>
            <p>{bookingStepInfo[step].description}</p>
          </aside>
      </div>
    </>
  );
}

export default App;
