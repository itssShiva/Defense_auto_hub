import React, { useState } from "react";
import AddUsers from "./AddUsers.jsx";
import UpdateUser from "./UpdateUser.jsx";
import AllUsers from "./AllUsers.jsx";
import AllDealers from "./AllDealers.jsx";
import AllCars from "./AllCars.jsx";
import AllModels from "./AllModels.jsx";
import EditModels from "./EditModels.jsx";
import EditNewCar from "./editNewCar.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import AddCars from "./AddCars.jsx";
import AddNewModel from "./AddNewModel.jsx";
import AddVariants from "./AddVariants.jsx";
import AllVariants from "./AllVariants.jsx";
import EditVariants from "./EditVariants.jsx";

const NAV = [
    { id: "All Users", icon: "👥", label: "All Users" },
    { id: "All Dealers", icon: "🏪", label: "All Dealers" },
    { id: "All Cars", icon: "🚗", label: "All Cars" },
    { id: "All Models", icon: "📋", label: "All Models" },
    { id: "All Variants", icon: "📑", label: "All Variants" },
    { id: "Add User", icon: "➕", label: "Add Account" },
    { id: "Add Cars", icon: "🆕", label: "Add Car" },
    { id: "Add Model", icon: "✨", label: "Add Model" },
    { id: "Add Variant", icon: "🔧", label: "Add Variant" },
    { id: "Settings", icon: "⚙️", label: "Settings" },
];

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState("All Users");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [selectedVariantId, setSelectedVariantId] = useState(null);

    const { logoutUser, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    /* ── Edit user / dealer ── */
    const handleEditClick = (id, type) => {
        setSelectedUserId(id);
        setSelectedUserType(type);
        setActivePage("Update User");
    };

    /* ── Edit car ── */
    const handleEditCarClick = (id) => {
        setSelectedCarId(id);
        setActivePage("Edit Car");
    };

    /* ── Edit model ── */
    const handleEditModelClick = (id) => {
        setSelectedModelId(id);
        setActivePage("Edit Model");
    };

    /* ── Edit variant ── */
    const handleEditVariantClick = (id) => {
        setSelectedVariantId(id);
        setActivePage("Edit Variant");
    };

    /* ── Header title ── */
    const pageTitle = () => {
        if (activePage === "Update User") return "Update Account";
        if (activePage === "Edit Car") return "Edit Car";
        if (activePage === "Edit Model") return "Edit Model";
        if (activePage === "Edit Variant") return "Edit Variant";
        return activePage;
    };

    /* ── Sidebar active highlight logic ── */
    const isNavActive = (id) => {
        if (activePage === id) return true;
        if (activePage === "Update User" && id === "All Users") return true;
        if (activePage === "Edit Car" && id === "All Cars") return true;
        if (activePage === "Edit Model" && id === "All Models") return true;
        if (activePage === "Edit Variant" && id === "All Variants") return true;
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
                    <span className="text-gray-600 font-medium">Welcome, {user?.name || "Admin"} 👋</span>
                </header>

                {/* 3. MAIN DASHBOARD CONTENT */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">

                    {activePage === "All Users" && (
                        <AllUsers handleEditClick={handleEditClick} />
                    )}

                    {activePage === "All Dealers" && (
                        <AllDealers handleEditClick={handleEditClick} />
                    )}

                    {activePage === "All Cars" && (
                        <AllCars handleEditCarClick={handleEditCarClick} />
                    )}

                    {activePage === "All Models" && (
                        <AllModels handleEditModelClick={handleEditModelClick} />
                    )}

                    {activePage === "All Variants" && (
                        <AllVariants handleEditVariantClick={handleEditVariantClick} />
                    )}

                    {activePage === "Add User" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddUsers />
                        </div>
                    )}

                    {activePage === "Update User" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <UpdateUser
                                userId={selectedUserId}
                                userType={selectedUserType}
                                goBack={() => setActivePage(selectedUserType === "dealer" ? "All Dealers" : "All Users")}
                            />
                        </div>
                    )}

                    {activePage === "Add Cars" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddCars />
                        </div>
                    )}

                    {activePage === "Add Model" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddNewModel />
                        </div>
                    )}

                    {activePage === "Add Variant" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddVariants />
                        </div>
                    )}

                    {activePage === "Edit Car" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <EditNewCar
                                carId={selectedCarId}
                                goBack={() => setActivePage("All Cars")}
                            />
                        </div>
                    )}

                    {activePage === "Edit Model" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <EditModels
                                modelId={selectedModelId}
                                goBack={() => setActivePage("All Models")}
                            />
                        </div>
                    )}

                    {activePage === "Edit Variant" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <EditVariants
                                variantId={selectedVariantId}
                                handleBack={() => setActivePage("All Variants")}
                            />
                        </div>
                    )}

                    {activePage === "Settings" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-[#19456d] mb-4">Settings</h2>
                            <p className="text-gray-600">Admin settings will go here.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;