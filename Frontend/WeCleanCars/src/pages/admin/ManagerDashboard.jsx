import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { views } from "./ViewsConfig";
import { ManagerCards } from "../../components/DashboardCards";
export default function ManagerDashboard() {
    const [ , setUser] = useOutletContext();
    const navigate = useNavigate();
    const [view, setView] = useState(null);
    const handleLogout = () => {
        setUser(null);
        navigate("/admin");
    }

    const active = views.find(v => v.key === view);

    //render the active view component
    if (active) {
        const ActiveComponent = active.component; // must be capitalized
        return <ActiveComponent onBack={() => setView(null)} />;
    }

    return (
        <>  
            <button className="logoutButton" onClick={handleLogout}>Logout</button>
            <div className="dashboardCards">
                {views.map(view => (
                    <ManagerCards className="dashboardCard"
                    icon={view.icon}
                    key={view.key}
                    title={view.title}
                    onClick={() => setView(view.key)}
                    /> 
                ))}
            </div>
        </>
    );
}