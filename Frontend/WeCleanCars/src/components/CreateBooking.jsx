import axios from "axios";
import { useState } from "react";


export default function Step3ConfirmBooking({ bookingData, setStep, setPaymentData, setBookingData }) {
  const [toast, setToast] = useState({ message: "", type: "" }); // type: "success" || "error"

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  }
  const handleNext = async () => {
    try {
      
      const res = await axios.post("http://localhost:3000/api/bookings/create", bookingData);

      showToast("Booking created successfully!", "success");
      console.log(res.data);

      const bookings = res.data.bookings;
      const totalAmount = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);
      const bookingIds = bookings.map(b => b.bookingId);

      setPaymentData({
        bookingIds,         
        amount: Number(totalAmount.toFixed(2)),
        bookings,            
      });
      setStep(4);
    } catch (err) {
      console.error(err);
      showToast("Error creating booking", "error");
    }
  };

  return (
    <div>
      <h2>Confirm Booking</h2>
      <p>Address: {bookingData.address}</p>
      <p>Date: {bookingData.date}</p>
      <p>Time: {bookingData.slotTimes.map(t => t).join(" / ") }</p>
      <button onClick={handleNext}>Confirm Booking</button>
      <button onClick={() => {
                setBookingData(prev => {
                  const updated = {
                    ...prev,

                    bookingAddress: prev.address,
                    date: prev.date,
                    maxDistanceMiles: prev.maxDistanceMiles || 10,
                    vehicles: prev.services?.map(s => ({
                      serviceId: s.serviceId,
                      vehicleTypeId: s.vehicleTypeId
                    })) || [],


                    selectedCleanerId: null,
                    chosenSlots: [],
                    slotTimes: [],
                    cleanerDistance: null
                };
                console.log("Back", updated);
                return updated;
                });
                setStep(2)}}
                >
                Back
                </button>
    {/* Toast message  */}
    {toast.message && (<div className={`toast ${toast.type}`}>{toast.message}</div>)}
    </div>
  );
}

/* response:
Object
bookings
: 
Array(1)
0
: 
{bookingId: 51, cleanerId: 8, slots: Array(1), travelFee: 4.86, totalPrice: 34.86}
length
: 
1
[[Prototype]]
: 
Array(0)
success
: 
true
[[Prototype]]
: 
Object
*/