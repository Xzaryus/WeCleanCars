import { useState, useEffect } from "react";
import axios from "axios";
import { StaffCards } from "./DashboardCards";

export default function StaffView({ onBack }) {
    const [staff, setStaff] = useState([]);
    async function getStaff() {
        try {
            const response = await axios.get("http://localhost:3000/api/cleaners");

            const staffList = response.data.map((staff) => ({
                id: staff.id,
                name: staff.full_name,
                tier: staff.tier_id
            }))
            setStaff(staffList);
            console.log(staffList);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getStaff();
    }, []);

    return (
        <div>
            <button onClick={onBack}>Back</button>
            <div className="staffList">
                {staff.map(staff => (
                    <StaffCards
                    key={staff.id}
                    name={staff.name} 
                    tier={staff.tier}
                    // onClick={}
                    /> 
                ))}
            </div>
        </div>
    );
}