import React, { useState, useEffect, useMemo } from "react";
import { useCars } from "../../cars/hooks/useCars.jsx";
import { statesList, getCitiesForState, getRTORate } from "../../utils/rtoRates.js";

/* ── Image URL helper ── */
const imgUrl = (src) =>
    src ? (src.startsWith("http") ? src : `${import.meta.env.VITE_BACKEND_URL}${src}`) : "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png";

/* ── Currency formatter ───────────────────────────────────────── */
const fmt = (n) =>
    n !== undefined && n !== null && n !== "" && !isNaN(Number(n))
        ? `₹${Number(n).toLocaleString("en-IN")}`
        : "—";

/* ─── Detail row for modal ─────────────────────────────────────── */
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-xs font-bold text-[#708ca4] uppercase tracking-wider w-40 shrink-0">{label}</span>
        <span className="text-sm text-[#19456d] font-medium text-right break-all">{value ?? "—"}</span>
    </div>
);

/* ─── RTO Info Badge ────────────────────────────────────────────── */
const RTOBadge = ({ rate, state, city }) => (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs">
        <span className="text-amber-600 font-bold">RTO {rate}%</span>
        <span className="text-amber-500">•</span>
        <span className="text-amber-600">{city || state || "Select City"}</span>
    </div>
);

/* ─── Car Detail Modal ─────────────────────────────────────────── */
const CarModal = ({ car, onClose, rtoRate, selectedState, selectedCity }) => {
    if (!car) return null;

    const exShowroom = Number(car.ExShowroomPrice) || 0;
    const calcRTO = exShowroom > 0 ? Math.round((exShowroom * rtoRate) / 100) : null;
    const otherFees = (Number(car.Insurance) || 0) + (Number(car.FastTagFee) || 0) + (Number(car.HPEndorsementFee) || 0) + (Number(car.HSRPSMartCardTemporaryFee) || 0);
    const calcOnRoad = exShowroom > 0 ? exShowroom + (calcRTO || 0) + otherFees : null;

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
                        src={imgUrl(car.vehicleImages?.[0])}
                        alt={car.vehicleName}
                        className="w-20 h-14 rounded-xl object-cover border-2 border-white/30 shadow bg-white/10"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-extrabold text-white truncate">{car.vehicleName}</h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 bg-[#b48001] text-white text-xs font-bold rounded-full">{car.brandId?.brandName || "Unknown Brand"}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">{car.vehicleType}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">{car.category}</span>
                        </div>
                        {(selectedState || selectedCity) && (
                            <p className="text-white/70 text-xs mt-1">📍 {[selectedCity, selectedState].filter(Boolean).join(", ")}</p>
                        )}
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
                        <DetailRow label="Vehicle Type" value={car.vehicleType} />
                        <DetailRow label="Category" value={car.category} />
                        <DetailRow label="Monthly EMI" value={fmt(car.MonthlyEMI)} />
                    </div>

                    {/* Dynamic Pricing */}
                    {exShowroom > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">
                                📍 On-Road Price Calculation {selectedCity ? `— ${selectedCity}, ${selectedState}` : selectedState ? `— ${selectedState}` : "(Select State/City)"}
                            </p>
                            <DetailRow label="Ex-Showroom" value={fmt(exShowroom)} />
                            <DetailRow label={`RTO (${rtoRate}%)`} value={calcRTO !== null ? fmt(calcRTO) : "Select State"} />
                            <DetailRow label="Insurance + Other Fees" value={fmt(otherFees)} />
                            <div className="flex justify-between items-center pt-2 mt-1 border-t border-green-200">
                                <span className="text-sm font-extrabold text-green-700 uppercase tracking-wide">Total On-Road Price</span>
                                <span className="text-base font-extrabold text-green-700">{calcOnRoad !== null ? fmt(calcOnRoad) : "—"}</span>
                            </div>
                        </div>
                    )}

                    {/* Normal Pricing */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Normal Pricing</p>
                        <DetailRow label="CSD Price" value={fmt(car.CSDPrice)} />
                        <DetailRow label="On-Road Price (DB)" value={fmt(car.OnRoadPrice)} />
                        <DetailRow label="Ex-Showroom" value={fmt(car.ExShowroomPrice)} />
                        <DetailRow label={`RTO (${rtoRate}%)`} value={calcRTO !== null ? fmt(calcRTO) : "Select State"} />
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
                    {car.description && (
                        <div>
                            <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Description</p>
                            <p className="text-sm text-[#19456d] leading-relaxed">{car.description}</p>
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

    // RTO State/City Selection
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const cities = useMemo(() => getCitiesForState(selectedState), [selectedState]);
    const rtoRate = useMemo(() => getRTORate(selectedState, selectedCity), [selectedState, selectedCity]);

    useEffect(() => {
        fetchAllCars();
    }, [fetchAllCars]);

    const FUEL_TYPES = ["All", "Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

    const filtered = cars.filter((c) => {
        const sq = searchQuery.toLowerCase().trim();
        const matchSearch = !sq ||
            String(c.vehicleName || "").toLowerCase().includes(sq) ||
            String(c.brandId?.brandName || "").toLowerCase().includes(sq) ||
            String(c.IndexNo || "").toLowerCase().includes(sq) ||
            String(c.category || "").toLowerCase().includes(sq) ||
            String(c.vehicleType || "").toLowerCase().includes(sq);

        const matchFuel = fuelFilter === "All" ||
            String(c.fuelType || "").toLowerCase().trim() === fuelFilter.toLowerCase();

        return matchSearch && matchFuel;
    });

    /* Calculate dynamic on-road price for a car */
    const getCalcOnRoad = (car) => {
        const ex = Number(car.ExShowroomPrice) || 0;
        if (!ex || !selectedState) return null;
        const rto = (ex * rtoRate) / 100;
        const other = (Number(car.Insurance) || 0) + (Number(car.FastTagFee) || 0) + (Number(car.HPEndorsementFee) || 0) + (Number(car.HSRPSMartCardTemporaryFee) || 0);
        return Math.round(ex + rto + other);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#19456d]">All Vehicles</h2>
                        <p className="text-[#708ca4]">Manage your new vehicles catalogue</p>
                        <p className="text-[#708ca4] text-sm mt-1">
                            {cars.length} vehicle{cars.length !== 1 ? "s" : ""} in catalogue
                        </p>
                    </div>
                </div>

                {/* RTO State / City Filter */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📍</span>
                        <h3 className="text-sm font-bold text-amber-800">On-Road Price Calculator — Select State & City</h3>
                        {selectedState && (
                            <span className="ml-auto px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">
                                RTO: {rtoRate}%
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">State</label>
                            <select
                                id="rto-state-select"
                                value={selectedState}
                                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); }}
                                className="w-full px-3 py-2.5 rounded-xl border border-amber-300 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                            >
                                <option value="">Select State</option>
                                {statesList.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">City (Optional)</label>
                            <select
                                id="rto-city-select"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                disabled={!selectedState || cities.length === 0}
                                className="w-full px-3 py-2.5 rounded-xl border border-amber-300 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">{!selectedState ? "Select State First" : cities.length === 0 ? "No cities listed" : "All Cities (State Rate)"}</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        {selectedState && (
                            <div className="flex items-end">
                                <button
                                    onClick={() => { setSelectedState(""); setSelectedCity(""); }}
                                    className="px-3 py-2.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-800 text-sm font-bold transition"
                                >
                                    ✕ Clear
                                </button>
                            </div>
                        )}
                    </div>
                    {selectedState && (
                        <p className="mt-2 text-xs text-amber-700">
                            RTO rate for <strong>{selectedCity || selectedState}</strong>: <strong>{rtoRate}%</strong> of Ex-Showroom price
                        </p>
                    )}
                </div>

                {/* Fuel + Search Filters */}
                <div className="flex flex-wrap gap-2 items-center">
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

                    <div className="relative w-full sm:w-64 ml-auto">
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
                                    <th className="px-6 py-4">Vehicle</th>
                                    <th className="px-6 py-4">Type / Category</th>
                                    <th className="px-6 py-4">Brand</th>
                                    <th className="px-6 py-4">CSD Price</th>
                                    <th className="px-6 py-4">Ex-Showroom</th>
                                    <th className="px-6 py-4">
                                        On-Road Price
                                        {selectedState && (
                                            <span className="ml-1 text-amber-600 font-normal normal-case">
                                                ({selectedCity || selectedState}, {rtoRate}% RTO)
                                            </span>
                                        )}
                                    </th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((car) => {
                                    const calcOnRoad = getCalcOnRoad(car);
                                    return (
                                        <tr key={car._id} className="hover:bg-[#fafbf8] transition duration-150">
                                            {/* Car image + model */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={imgUrl(car.vehicleImages?.[0])}
                                                        alt={car.vehicleName}
                                                        className="h-10 w-16 rounded-lg object-cover border border-gray-200 bg-gray-50"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{car.vehicleName}</p>
                                                        <p className="text-xs text-[#708ca4]">#{car.IndexNo || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type + Category */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 w-fit">
                                                        🚗 {car.vehicleType}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 w-fit">
                                                        🏷️ {car.category}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Brand */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{car.brandId?.brandName || "—"}</td>

                                            {/* CSD Price */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#19456d]">
                                                {fmt(car.CSDPrice)}
                                            </td>

                                            {/* Ex-Showroom */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600">
                                                {fmt(car.ExShowroomPrice)}
                                            </td>

                                            {/* On-Road Price (Dynamic) */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {calcOnRoad !== null ? (
                                                    <div>
                                                        <p className="text-sm font-bold text-[#b48001]">{fmt(calcOnRoad)}</p>
                                                        <p className="text-xs text-amber-600">incl. {rtoRate}% RTO</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Select state to calculate</span>
                                                )}
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Car Detail Modal */}
            <CarModal
                car={selectedCar}
                onClose={() => setSelectedCar(null)}
                rtoRate={rtoRate}
                selectedState={selectedState}
                selectedCity={selectedCity}
            />
        </div>
    );
};

export default AllCars;
