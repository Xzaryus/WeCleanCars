import { createBrowserRouter } from "react-router-dom";

import BookingLayout from "./layouts/BookingLayout";
import AdminLayout from "./layouts/AdminLayout";

import AdminLogin from "./pages/admin/AdminLogin";
import ManagerDashboard from "./pages/admin/ManagerDashboard";
import CleanerDashboard from "./pages/admin/CleanerDashboard";

import Step0CustomerCreation from "./pages/booking/NewCustomerCreation.jsx";
import Step1BookingForm from "./pages/booking/NewBookingForm.jsx";
import Step2CleanerOptions from "./pages/booking/NewCleanerOptions.jsx";
import Step3CreateBooking from "./pages/booking/NewCreateBooking.jsx";
import Step4Payment from "./pages/booking/NewPayment.jsx";

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