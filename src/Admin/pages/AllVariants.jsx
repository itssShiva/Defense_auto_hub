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
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
        <span className="text-xs font-bold text-[#708ca4] uppercase tracking-wider w-40 shrink-0">{label}</span>
        <span className="text-sm text-[#19456d] font-medium text-right wrap-break-words">{value || "—"}</span>
    </div>
);

/* ─── Variant Detail Modal ─────────────────────────────────────────── */
const VariantModal = ({ variant, onClose, rtoRate, selectedState, selectedCity }) => {
    if (!variant) return null;

    const exShowroom = Number(variant.ExShowroomPrice) || 0;
    const calcRTO = exShowroom > 0 ? Math.round((exShowroom * rtoRate) / 100) : null;
    const otherFees = (Number(variant.Insurance) || 0) + (Number(variant.FastTagFee) || 0) + (Number(variant.HPEndorsementFee) || 0) + (Number(variant.HSRPSMartCardTemporaryFee) || 0);
    const calcOnRoad = exShowroom > 0 ? exShowroom + (calcRTO || 0) + otherFees : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-linear-to-r from-[#19456d] to-[#2a6094] px-6 py-5 flex items-center gap-4 shrink-0">
                    <img
                        src={imgUrl(variant.variantImages?.[0])}
                        alt={variant.variantName}
                        className="w-20 h-14 rounded-xl object-cover border-2 border-white/30 shadow bg-white/10"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-extrabold text-white truncate">{variant.brandId?.brandName || variant.brandName} {variant.modelId?.modelName || variant.modelName} - {variant.variantName}</h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 bg-[#b48001] text-white text-xs font-bold rounded-full">{variant.fuelType}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">{variant.transmissionType}</span>
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
                <div className="overflow-y-auto px-6 py-4 space-y-6">
                    {/* Identity & Basic Details */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2 border-b pb-1">Basic Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <DetailRow label="Variant Name" value={variant.variantName} />
                            <DetailRow label="Brand Name" value={variant.brandId?.brandName || variant.brandName} />
                            <DetailRow label="Model Name" value={variant.modelId?.modelName || variant.modelName} />
                            <DetailRow label="Category" value={variant.vehicleId?.category || variant.category} />
                            <DetailRow label="Fuel Type" value={variant.fuelType} />
                            <DetailRow label="Transmission" value={variant.transmissionType} />
                            <DetailRow label="Engine" value={variant.engine} />
                            <DetailRow label="Mileage" value={variant.mileage} />
                            <DetailRow label="Entitlement" value={variant.Entitlement} />
                        </div>
                    </div>

                    {/* Dynamic Pricing */}
                    {exShowroom > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">
                                📍 On-Road Price Calculation {selectedCity ? `— ${selectedCity}, ${selectedState}` : selectedState ? `— ${selectedState}` : "(Select State/City)"}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <DetailRow label="Ex-Showroom" value={fmt(exShowroom)} />
                                <DetailRow label={`RTO (${rtoRate}%)`} value={calcRTO !== null ? fmt(calcRTO) : "Select State"} />
                                <DetailRow label="Insurance + Other Fees" value={fmt(otherFees)} />
                            </div>
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-200">
                                <span className="text-sm font-extrabold text-green-700 uppercase tracking-wide">Total On-Road Price</span>
                                <span className="text-base font-extrabold text-green-700">{calcOnRoad !== null ? fmt(calcOnRoad) : "—"}</span>
                            </div>
                        </div>
                    )}

                    {/* Normal Pricing */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2 border-b pb-1">Normal (Non-BH) Pricing</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <DetailRow label="CSD Price" value={fmt(variant.CSDPrice)} />
                            <DetailRow label="On Road Price (DB)" value={fmt(variant.OnRoadPrice)} />
                            <DetailRow label="Ex-Showroom Price" value={fmt(variant.ExShowroomPrice)} />
                            <DetailRow label={`RTO (${rtoRate}%)`} value={calcRTO !== null ? fmt(calcRTO) : "Select State"} />
                            <DetailRow label="Insurance" value={fmt(variant.Insurance)} />
                            <DetailRow label="Registration Fee" value={variant.RegistraionFee} />
                            <DetailRow label="FASTag Fee" value={fmt(variant.FastTagFee)} />
                            <DetailRow label="HP Endorsement Fee" value={fmt(variant.HPEndorsementFee)} />
                            <DetailRow label="HSRP/Temp Fee" value={fmt(variant.HSRPSMartCardTemporaryFee)} />
                        </div>
                    </div>

                    {/* BH Series Pricing */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2 border-b pb-1">BH Series Pricing</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <DetailRow label="BH On Road Price" value={fmt(variant.BHOnRoadPrice)} />
                            <DetailRow label="BH Ex-Showroom" value={fmt(variant.ExShowroomPriceBH)} />
                            <DetailRow label="BH Registration Cost" value={fmt(variant.BHRegistrationCost)} />
                            <DetailRow label="BH Insurance" value={fmt(variant.BHInsurance)} />
                            <DetailRow label="BH Registration Fee" value={fmt(variant.BHRegistrationFee)} />
                            <DetailRow label="BH FASTag Fee" value={fmt(variant.BHFastTagFee)} />
                            <DetailRow label="BH HP Endorsement" value={fmt(variant.BHHPEndorsementFee)} />
                            <DetailRow label="BH HSRP/Temp Fee" value={fmt(variant.BHHSRPSMartCardTemporaryFee)} />
                        </div>
                    </div>

                    {/* Other Pricing */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2 border-b pb-1">Other Pricing</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <DetailRow label="Civil Ex-Showroom" value={fmt(variant.civilExShowroomPrice)} />
                            <DetailRow label="Monthly EMI" value={fmt(variant.MonthlyEMI)} />
                        </div>
                    </div>

                    {/* Remarks & Details */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2 border-b pb-1">Additional Details</p>
                        {variant.details && (
                            <div className="mt-2">
                                <span className="text-xs font-bold text-[#708ca4] uppercase tracking-wider block mb-1">Details</span>
                                <p className="text-sm text-[#19456d] leading-relaxed">{variant.details}</p>
                            </div>
                        )}
                        {variant.Remarks && (
                            <div className="mt-2">
                                <span className="text-xs font-bold text-[#708ca4] uppercase tracking-wider block mb-1">Remarks</span>
                                <p className="text-sm text-[#19456d] leading-relaxed">{variant.Remarks}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════ */
const AllVariants = ({ handleEditVariantClick }) => {
    const { variants, loading, fetchAllVariants, removeVariant } = useCars();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVariant, setSelectedVariant] = useState(null);

    // RTO State/City Selection
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const cities = useMemo(() => getCitiesForState(selectedState), [selectedState]);
    const rtoRate = useMemo(() => getRTORate(selectedState, selectedCity), [selectedState, selectedCity]);

    useEffect(() => {
        fetchAllVariants();
    }, [fetchAllVariants]);

    const filteredVariants = variants.filter(
        (v) =>
            v.variantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (v.modelId?.modelName || v.modelName)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (v.brandId?.brandName || v.brandName)?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* Calculate dynamic on-road price for a variant */
    const getCalcOnRoad = (variant) => {
        const ex = Number(variant.ExShowroomPrice) || 0;
        if (!ex || !selectedState) return null;
        const rto = (ex * rtoRate) / 100;
        const other = (Number(variant.Insurance) || 0) + (Number(variant.FastTagFee) || 0) + (Number(variant.HPEndorsementFee) || 0) + (Number(variant.HSRPSMartCardTemporaryFee) || 0);
        return Math.round(ex + rto + other);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Header Area */}
            <div className="p-6 border-b border-gray-100 flex flex-col gap-4 bg-[#fafbf8]">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#19456d]">All Variants</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and organize all vehicle variants</p>
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

                <div className="relative w-full shrink-0">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search variants..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19456d]/20 focus:border-[#19456d] transition-all bg-white text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List Area */}
            <div className="overflow-x-auto flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="w-10 h-10 border-4 border-[#19456d]/20 border-t-[#19456d] rounded-full animate-spin" />
                        <p className="text-[#19456d] font-medium animate-pulse">Loading variants...</p>
                    </div>
                ) : filteredVariants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl opacity-50">🚙</span>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No variants found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#19456d] text-white text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold rounded-tl-lg">Image</th>
                                <th className="px-6 py-4 font-bold">Identity</th>
                                <th className="px-6 py-4 font-bold">Specs</th>
                                <th className="px-6 py-4 font-bold">Ex-Showroom</th>
                                <th className="px-6 py-4 font-bold">
                                    On-Road Price
                                    {selectedState && (
                                        <span className="ml-1 text-amber-200 font-normal normal-case block">
                                            ({selectedCity || selectedState}, {rtoRate}% RTO)
                                        </span>
                                    )}
                                </th>
                                <th className="px-6 py-4 font-bold text-center rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white text-sm">
                            {filteredVariants.map((variant) => {
                                const calcOnRoad = getCalcOnRoad(variant);
                                return (
                                <tr key={variant._id} className="hover:bg-[#fafbf8] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group-hover:shadow transition-all">
                                            <img
                                                src={imgUrl(variant.variantImages?.[0])}
                                                alt={variant.variantName}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-[#19456d]">{variant.variantName}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{variant.brandId?.brandName || variant.brandName} • {variant.modelId?.modelName || variant.modelName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#708ca4]/10 text-[#19456d]">{variant.fuelType}</span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#708ca4]/10 text-[#19456d]">{variant.transmissionType}</span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#b48001]/10 text-[#b48001]">{variant.engine}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-600">{fmt(variant.ExShowroomPrice)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {calcOnRoad !== null ? (
                                            <div>
                                                <p className="font-bold text-[#b48001]">{fmt(calcOnRoad)}</p>
                                                <p className="text-xs text-amber-600">incl. {rtoRate}% RTO</p>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Select state</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedVariant(variant)}
                                                className="w-8 h-8 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                                title="View Details"
                                            >👁️</button>
                                            <button
                                                onClick={() => handleEditVariantClick(variant._id)}
                                                className="w-8 h-8 rounded bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                                title="Edit Variant"
                                            >✏️</button>
                                            <button
                                                onClick={() => removeVariant(variant._id)}
                                                className="w-8 h-8 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                                title="Delete Variant"
                                            >🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination / Footer Area */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                <span>Showing {filteredVariants.length} variants</span>
                {/* Future: Add pagination controls here */}
            </div>

            {/* Modal */}
            <VariantModal 
                variant={selectedVariant} 
                onClose={() => setSelectedVariant(null)} 
                rtoRate={rtoRate}
                selectedState={selectedState}
                selectedCity={selectedCity}
            />
        </div>
    );
};

export default AllVariants;
