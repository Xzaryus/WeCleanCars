
const ManagerCards = ({ title, desc, icon, onClick }) => (
    <button className="dashboardCard" onClick={onClick}>
        <img src={icon} className="cardIcon" alt="icon" />
        <h3>{title}</h3>
        <p>{desc}</p>
    </button>
);

const CleanerCards = ({ title, desc, icon, onClick }) => (
    <button className="dashboardCard" onClick={onClick}>
        <img src={icon} className="cardIcon" alt="icon" /> 
        <h3>{title}</h3>
        <p>{desc}</p>
    </button>
);

const StaffCards = ({ name, tier, onClick}) => (
    <button className="staffCard" onClick={onClick}>
        <h3>{name}</h3>
        <p>Tier: {tier}</p>
    </button>
)

const BookingCards = ({ id, service, address, time, date, price }) => (
    <div className="bookingCard">
        <h3>Booking ID: {id}</h3>
        <p>Service: {service}</p>
        <p>Address: {address}</p>
        <p>Time: {time}</p>
        <p>Date: {date}</p>
        <p>Price: {price}</p>
    </div>
)

export {
    ManagerCards,
    CleanerCards,
    StaffCards,
    BookingCards
}