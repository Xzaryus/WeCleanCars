import StaffView from "../../components/StaffView";
import BookingView from "../../components/BookingView";
import staffIcon from "../../assets/staff-symbol.svg";
import bookingIcon from "../../assets/Booking-view.svg";

export const views = [
    {
        key: "staff",
        title: "Staff View",
        component: StaffView,
        icon: staffIcon
    },
    {
        key: "booking",
        title: "Booking View",
        component: BookingView,
        icon: bookingIcon
    }
];