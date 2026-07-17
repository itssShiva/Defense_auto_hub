import React, { useState } from "react";
import AddUsers from "./AddUsers.jsx";
import UpdateUser from "./UpdateUser.jsx";
import AllUsers from "./AllUsers.jsx";
import AllDealers from "./AllDealers.jsx";
import AllCars from "./AllCars.jsx";
import AllModels from "./AllModels.jsx";
import EditModels from "./EditModels.jsx";
import EditNewCar from "./EditNewCar.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import AddCars from "./AddCars.jsx";
import AddNewModel from "./AddNewModel.jsx";
import AddVariants from "./AddVariants.jsx";
import AllVariants from "./AllVariants.jsx";
import EditVariants from "./EditVariants.jsx";
import AddUsedCar from "./AddUsedCar.jsx";
import UsedCarApproval from "./usedCarApproval.jsx";
import AddBlog from "./AddBlog.jsx";
import AllBlogs from "./AllBlogs.jsx";
import EditBlog from "./EditBlog.jsx";
import AddBrands from "./AddBrands.jsx";
import AllBrands from "./AllBrands.jsx";
import EditBrand from "./EditBrand.jsx";

const NAV = [
    { id: "All Users", icon: "👥", label: "All Users" },
    { id: "All Dealers", icon: "🏪", label: "All Dealers" },
    { id: "All Cars", icon: "🚗", label: "All Vehicles" },
    { id: "All Models", icon: "📋", label: "All Models" },
    { id: "All Variants", icon: "📑", label: "All Variants" },
    { id: "Add User", icon: "➕", label: "Add Account" },
    { id: "Add Cars", icon: "🆕", label: "Add Vehicle" },
    { id: "Add Model", icon: "✨", label: "Add Model" },
    { id: "Add Variant", icon: "🔧", label: "Add Variant" },
    { id: "All Brands", icon: "🏷️", label: "All Brands" },
    { id: "Add Brand", icon: "➕", label: "Add Brand" },
    { id: "Add Used Car", icon: "🚗", label: "Add Used Vehicle" },
    { id: "Used Car Approvals", icon: "✅", label: "Used Vehicle Approvals" },
    { id: "All Blogs", icon: "📰", label: "All Blogs" },
    { id: "Add Blog", icon: "📝", label: "Add Blog" },
    { id: "Settings", icon: "⚙️", label: "Settings" },
];

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState("All Users");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [selectedModelId, setSelectedModelId] = useState(null);
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [selectedBrandId, setSelectedBrandId] = useState(null);

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

    /* ── Edit blog ── */
    const handleEditBlogClick = (id) => {
        setSelectedBlogId(id);
        setActivePage("Edit Blog");
    };

    /* ── Edit brand ── */
    const handleEditBrandClick = (id) => {
        setSelectedBrandId(id);
        setActivePage("Edit Brand");
    };

    /* ── Header title ── */
    const pageTitle = () => {
        if (activePage === "Update User") return "Update Account";
        if (activePage === "Edit Car") return "Edit Vehicle";
        if (activePage === "Edit Model") return "Edit Model";
        if (activePage === "Edit Variant") return "Edit Variant";
        if (activePage === "Edit Blog") return "Edit Blog Post";
        if (activePage === "Edit Brand") return "Edit Brand";
        return activePage;
    };

    /* ── Sidebar active highlight logic ── */
    const isNavActive = (id) => {
        if (activePage === id) return true;
        if (activePage === "Update User" && id === "All Users") return true;
        if (activePage === "Edit Car" && id === "All Cars") return true;
        if (activePage === "Edit Model" && id === "All Models") return true;
        if (activePage === "Edit Variant" && id === "All Variants") return true;
        if (activePage === "Edit Blog" && id === "All Blogs") return true;
        if (activePage === "Edit Brand" && id === "All Brands") return true;
        return false;
    };

    return (
        <div className="flex h-screen bg-background font-sans">
            {/* 1. SIDEBAR */}
            <aside className="w-72 bg-[#19456d] text-white hidden md:flex flex-col h-full">
                {/* Logo Section */}
                <div className="p-5 shrink-0">
                    <h2 className="text-2xl font-bold tracking-wider text-[#b48001]">
                        Fouji<span className="text-white">Mart</span>
                    </h2>
                </div>

                {/* Scrollable Navigation */}
                <div className="flex-1 overflow-y-auto px-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <nav className="space-y-1 pb-4 mt-2">
                        {NAV.map(({ id, icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setActivePage(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition duration-200 text-left ${isNavActive(id)
                                    ? "bg-[#b48001] text-white"
                                    : "text-gray-300 hover:bg-[#708ca4]/20 hover:text-white"
                                    }`}
                            >
                                <span className="shrink-0 text-base leading-none">{icon}</span>
                                <span className="text-sm font-medium leading-tight whitespace-nowrap truncate">{label}</span>
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

                    {activePage === "Add Used Car" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddUsedCar />
                        </div>
                    )}

                    {activePage === "Used Car Approvals" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <UsedCarApproval />
                        </div>
                    )}

                    {activePage === "Add Blog" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddBlog />
                        </div>
                    )}

                    {activePage === "All Blogs" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AllBlogs handleEditBlogClick={handleEditBlogClick} />
                        </div>
                    )}

                    {activePage === "Edit Blog" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <EditBlog
                                blogId={selectedBlogId}
                                goBack={() => setActivePage("All Blogs")}
                            />
                        </div>
                    )}

                    {activePage === "All Brands" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AllBrands handleEditBrandClick={handleEditBrandClick} />
                        </div>
                    )}

                    {activePage === "Add Brand" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <AddBrands />
                        </div>
                    )}

                    {activePage === "Edit Brand" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <EditBrand
                                brandId={selectedBrandId}
                                goBack={() => setActivePage("All Brands")}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;