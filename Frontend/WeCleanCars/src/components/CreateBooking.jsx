import axios from "axios";

export default function Step3ConfirmBooking({ bookingData, setStep, setPaymentData, setBookingData }) {
  const handleNext = async () => {
    try {
      
      const res = await axios.post("http://localhost:3000/api/bookings/create", bookingData);

      alert("Booking created successfully!");
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
      alert("Error creating booking");
    }
  };

  return (
    <div>
      <h2>Confirm Booking</h2>
      <p>Address: {bookingData.address}</p>
      <p>Date: {bookingData.date}</p>
      <p>Slots: {bookingData.chosenSlots}</p>
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