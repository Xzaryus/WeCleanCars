
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

export {
    ManagerCards,
    CleanerCards,
    StaffCards
}