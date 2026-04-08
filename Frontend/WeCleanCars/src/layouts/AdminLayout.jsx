import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
    const [user, setUser] = useState({});

    return <Outlet
        context={[user, setUser]} 
        />;
}