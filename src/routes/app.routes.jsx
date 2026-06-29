import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../Pages/Home.jsx";
import Contact from "../Pages/Contact.jsx";
import Login from "../auth/pages/Login.jsx";
import AdminDashboard from "../Admin/pages/AdminDashboard.jsx";
import DealerDashboard from "../Dealer/pages/DealerDashboard.jsx";
import AdminRoute from "../ProtectiveRoutes/adminRoutes.jsx";
import DealerRoute from "../ProtectiveRoutes/dealerRoutes.jsx";
import GuestRoute from "../ProtectiveRoutes/guestRoutes.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: '/login',
                element: (
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                )
            },


            {
                path: '/admin-dashboard',
                element: (
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                )
            },


            {
                path: '/dealer-dashboard',
                element: (
                    <DealerRoute>
                        <DealerDashboard />
                    </DealerRoute>
                )
            },
        ]
    }
]);

export default router;
