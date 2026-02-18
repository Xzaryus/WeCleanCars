import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function AppNew() {
    return <RouterProvider router={router} />;
}

export default AppNew;
