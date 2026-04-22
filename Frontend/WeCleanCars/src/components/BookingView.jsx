import { useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { BookingCards } from './DashboardCards';

export default function BookingView({ onBack }) {
    function formatDateForSQL(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
    const [date, setDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    async function getBookings() {
        try {
            const response = await axios.get(`http://localhost:3000/api/bookings/date/${formatDateForSQL(date)}`);
            setBookings(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    const handleClick = () => {
        getBookings();
        setHasSearched(true);
        console.log(bookings);
    }
    return (
        <>
            {!hasSearched ? (
                <div className="calendarPage">
                    <Calendar
                    onChange={setDate}
                    value={date}
                    />
                    
                    <div className='calendarBtns'>
                        <button onClick={() => onBack?.()}>Back</button>
                        <button onClick = {handleClick}>View Bookings</button>
                    </div>
                </div>
            ) : bookings.length > 0 ? (
                <div className="bookingList">
                    {bookings.map(booking => (
                        <BookingCards
                        key={booking.id}
                        id={booking.id}
                        service={booking.service}
                        address={booking.address}
                        time={booking.time}
                        date={booking.date}
                        price={booking.totalPrice}
                />
                    ))}
                <button onClick={() => setHasSearched(false)}>Back</button>
                </div>
                ) : (
                    <div>
                    <p>No bookings found for the selected date.</p>
                    <button onClick={() => setHasSearched(false)}>Back</button>
                    </div>
                    )}

        </>
    );
}