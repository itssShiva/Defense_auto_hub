import React, { useState, useEffect } from "react";
import { useCars } from "../../cars/hooks/useCars.jsx";

/* ─── Currency formatter ───────────────────────────────────────── */
const fmt = (n) =>
    n !== undefined && n !== null
        ? `₹${Number(n).toLocaleString("en-IN")}`
        : "—";

/* ─── Detail row for modal ─────────────────────────────────────── */
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-xs font-bold text-[#708ca4] uppercase tracking-wider w-40 shrink-0">{label}</span>
        <span className="text-sm text-[#19456d] font-medium text-right break-all">{value ?? "—"}</span>
    </div>
);

/* ─── Car Detail Modal ─────────────────────────────────────────── */
const CarModal = ({ car, onClose }) => {
    if (!car) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-linear-to-r from-[#19456d] to-[#2a6094] px-6 py-5 flex items-center gap-4 shrink-0">
                    <img
                        src={car.carImages?.[0] || "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png"}
                        alt={car.Model}
                        className="w-20 h-14 rounded-xl object-cover border-2 border-white/30 shadow bg-white/10"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-extrabold text-white truncate">{car.Model}</h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 bg-[#b48001] text-white text-xs font-bold rounded-full">{car.FuelType}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">{car.TransmissionType}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">{car.BodyType}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full text-lg font-bold transition shrink-0"
                    >✕</button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-4 space-y-4">
                    {/* Identity */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Identity</p>
                        <DetailRow label="Index No" value={car.IndexNo} />
                        <DetailRow label="Entitlement" value={car.Entitlement} />
                        <DetailRow label="Seating Capacity" value={car.SeatingCapacity} />
                        <DetailRow label="Engine Displacement" value={car.engineDisplacement} />
                        <DetailRow label="Max Power" value={car.MaxPower} />
                        <DetailRow label="City Mileage" value={car.CityMileage} />
                        <DetailRow label="Boot Space" value={car.BootSpace} />
                        <DetailRow label="Monthly EMI" value={fmt(car.MonthlyEMI)} />
                    </div>

                    {/* Normal Pricing */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Normal Pricing</p>
                        <DetailRow label="CSD Price" value={fmt(car.CSDPrice)} />
                        <DetailRow label="On-Road Price" value={fmt(car.OnRoadPrice)} />
                        <DetailRow label="Ex-Showroom" value={fmt(car.ExShowroomPrice)} />
                        <DetailRow label="RTO" value={fmt(car.RTO)} />
                        <DetailRow label="Insurance" value={fmt(car.Insurance)} />
                        <DetailRow label="Registration Fee" value={car.RegistraionFee} />
                        <DetailRow label="FASTag Fee" value={fmt(car.FastTagFee)} />
                        <DetailRow label="HP Endorsement" value={fmt(car.HPEndorsementFee)} />
                        <DetailRow label="HSRP/SmartCard/Temp" value={fmt(car.HSRPSMartCardTemporaryFee)} />
                    </div>

                    {/* BH Pricing */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">BH Series Pricing</p>
                        <DetailRow label="BH On-Road Price" value={fmt(car.BHOnRoadPrice)} />
                        <DetailRow label="BH Ex-Showroom" value={fmt(car.ExShowroomPriceBH)} />
                        <DetailRow label="Civil Ex-Showroom" value={fmt(car.civilExShowroomPrice)} />
                        <DetailRow label="BH Reg. Cost" value={fmt(car.BHRegistrationCost)} />
                        <DetailRow label="BH Insurance" value={fmt(car.BHInsurance)} />
                        <DetailRow label="BH Reg. Fee" value={fmt(car.BHRegistrationFee)} />
                        <DetailRow label="BH FASTag Fee" value={fmt(car.BHFastTagFee)} />
                        <DetailRow label="BH HP Endorsement" value={fmt(car.BHHPEndorsementFee)} />
                        <DetailRow label="BH HSRP/SmartCard" value={fmt(car.BHHSRPSMartCardTemporaryFee)} />
                    </div>

                    {/* Details & Remarks */}
                    {car.details && (
                        <div>
                            <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Details</p>
                            <p className="text-sm text-[#19456d] leading-relaxed">{car.details}</p>
                        </div>
                    )}
                    {car.Remarks && (
                        <div>
                            <p className="text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-1">Remarks</p>
                            <p className="text-xs text-[#708ca4] italic">{car.Remarks}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════ */
const AllCars = ({ handleEditCarClick }) => {
    const { cars, loading, fetchAllCars, removeCar } = useCars();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCar, setSelectedCar] = useState(null);
    const [fuelFilter, setFuelFilter] = useState("All");

    useEffect(() => {
        fetchAllCars();
    }, [fetchAllCars]);

    const FUEL_TYPES = ["All", "Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

    const filtered = cars.filter((c) => {
        const matchSearch =
            c.Model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.IndexNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.BodyType?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFuel = fuelFilter === "All" || c.FuelType === fuelFilter;
        return matchSearch && matchFuel;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d]">All Cars</h2>
                    <p className="text-[#708ca4] text-sm mt-1">
                        {cars.length} car{cars.length !== 1 ? "s" : ""} in catalogue
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Fuel filter */}
                    <div className="flex gap-1 flex-wrap">
                        {FUEL_TYPES.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFuelFilter(f)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${fuelFilter === f
                                    ? "bg-[#19456d] text-white"
                                    : "bg-[#19456d]/10 text-[#19456d] hover:bg-[#19456d]/20"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#708ca4]">🔍</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search model, type…"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#708ca4]/30 bg-[#fafbf8] focus:outline-none focus:ring-2 focus:ring-[#19456d]/30 focus:border-[#19456d] text-sm text-[#19456d] transition"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#19456d]"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-[#708ca4]">
                        <p className="text-4xl mb-3">🚗</p>
                        <p className="font-semibold">
                            {searchQuery || fuelFilter !== "All"
                                ? "No cars match your filters."
                                : "No cars in catalogue yet."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4">Car</th>
                                    <th className="px-6 py-4">Fuel / Trans.</th>
                                    <th className="px-6 py-4">Body Type</th>
                                    <th className="px-6 py-4">CSD Price</th>
                                    <th className="px-6 py-4">On-Road Price</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((car) => (
                                    <tr key={car._id} className="hover:bg-[#fafbf8] transition duration-150">
                                        {/* Car image + model */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={car.carImages?.[0] || "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png"}
                                                    alt={car.Model}
                                                    className="h-10 w-16 rounded-lg object-cover border border-gray-200 bg-gray-50"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{car.Model}</p>
                                                    <p className="text-xs text-[#708ca4]">#{car.IndexNo}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Fuel + Transmission */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                                                    ⛽ {car.FuelType}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                                                    ⚙️ {car.TransmissionType}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Body Type */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{car.BodyType || "—"}</td>

                                        {/* CSD Price */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#19456d]">
                                            {fmt(car.CSDPrice)}
                                        </td>

                                        {/* On-Road Price */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#b48001]">
                                            {fmt(car.OnRoadPrice)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditCarClick(car._id)}
                                                    className="px-3 py-1.5 bg-[#19456d]/10 hover:bg-[#19456d]/20 text-[#19456d] text-xs font-bold rounded-lg transition"
                                                >✏️ Edit</button>
                                                <button
                                                    onClick={() => setSelectedCar(car)}
                                                    className="px-3 py-1.5 bg-[#b48001]/10 hover:bg-[#b48001]/20 text-[#b48001] text-xs font-bold rounded-lg transition"
                                                >👁 View</button>
                                                <button
                                                    onClick={() => removeCar(car._id)}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition"
                                                >🗑 Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Car Detail Modal */}
            <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
        </div>
    );
};

export default AllCars;
