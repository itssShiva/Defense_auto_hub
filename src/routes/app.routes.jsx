import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../Pages/Home.jsx";
import Contact from "../Pages/Contact.jsx";




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
        ]
    }
]);

export default router;
