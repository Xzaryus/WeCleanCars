import { createBrowserRouter } from "react-router-dom";

import BookingLayout from "./layouts/BookingLayout";
import AdminLayout from "./layouts/AdminLayout";

import Step0CustomerCreation from "./components/CustomerCreation.jsx";
import Step1BookingForm from "./components/BookingForm.jsx";
import Step2CleanerOptions from "./components/CleanerOptions.jsx";
import Step3CreateBooking from "./components/CreateBooking.jsx";
import Step4Payment from "./components/Payment.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <BookingLayout />,
        children: [
            { index: true, element: <Step0CustomerCreation /> },
            { path: "details", element: <Step1BookingForm /> },
            { path: "cleaners", element: <Step2CleanerOptions /> },
            { path: "confirm", element: <Step3CreateBooking /> },
            { path: "payment", element: <Step4Payment /> },
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminLogin />},
            { path: "manager", element: <ManagerDashboard />},
            { path: "cleaner", element: <CleanerDashboard />},
        ]
    }
])