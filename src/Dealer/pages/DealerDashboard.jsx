import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import DealerProfile from "./DealerProfile.jsx";
import ChangePassword from "./ChangePassword.jsx";
import AddUsedCar from "./AddUsedCar.jsx";
import AllUsedCars from "./AllUsedCars.jsx";
import EditUsedCar from "./EditUsedCar.jsx";

const NAV = [
    { id: "Dealer Profile", icon: "🏪", label: "Dealer Profile" },
    { id: "Add Used Car", icon: "🚗", label: "Add Used Vehicle" },
    { id: "All Used Cars", icon: "📋", label: "All Used Vehicles" },
    { id: "Change Password", icon: "🔒", label: "Change Password" },
];

const DealerDashboard = () => {
    const [activePage, setActivePage] = useState("Dealer Profile");
    const [editUsedCarId, setEditUsedCarId] = useState(null);

    const { logoutUser, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    /* ── Header title ── */
    const pageTitle = () => {
        return activePage;
    };

    /* ── Sidebar active highlight logic ── */
    const isNavActive = (id) => {
        if (activePage === id) return true;
        if (activePage === "Edit Used Car" && id === "All Used Cars") return true;
        return false;
    };

    return (
        <div className="flex h-screen bg-background font-sans">
            {/* 1. SIDEBAR */}
            <aside className="w-64 bg-[#19456d] text-white hidden md:flex flex-col justify-between">
                <div className="p-5">
                    <h2 className="text-2xl font-bold tracking-wider text-[#b48001]">
                        Fouji<span className="text-white">Mart</span>
                    </h2>
                    <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest font-semibold">Dealer Portal</p>
                    <nav className="mt-8 space-y-1">
                        {NAV.map(({ id, icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setActivePage(id)}
                                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition duration-200 ${isNavActive(id)
                                    ? "bg-[#b48001] text-white"
                                    : "text-gray-300 hover:bg-[#708ca4]/20 hover:text-white"
                                    }`}
                            >
                                <span>{icon}</span> <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
                    >
                        <span>🚪</span> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#fafbf8]">
                {/* 2. TOP NAVIGATION BAR */}
                <header className="flex justify-between items-center bg-background py-4 px-6 border-b border-gray-200 shadow-lg">
                    <h1 className="text-2xl font-semibold text-[#673413]">{pageTitle()}</h1>
                    <span className="text-gray-600 font-medium">Welcome, {user?.name || "Dealer"} 👋</span>
                </header>

                {/* 3. MAIN DASHBOARD CONTENT */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {activePage === "Dealer Profile" && (
                        <DealerProfile />
                    )}

                    {activePage === "Add Used Car" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddUsedCar />
                        </div>
                    )}

                    {activePage === "All Used Cars" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AllUsedCars onEdit={(id) => {
                                setEditUsedCarId(id);
                                setActivePage("Edit Used Car");
                            }} />
                        </div>
                    )}

                    {activePage === "Edit Used Car" && editUsedCarId && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <EditUsedCar 
                                carId={editUsedCarId} 
                                onCancel={() => {
                                    setEditUsedCarId(null);
                                    setActivePage("All Used Cars");
                                }} 
                            />
                        </div>
                    )}

                    {activePage === "Change Password" && (
                        <ChangePassword />
                    )}
                </main>
            </div>
        </div>
    );
};

export default DealerDashboard;