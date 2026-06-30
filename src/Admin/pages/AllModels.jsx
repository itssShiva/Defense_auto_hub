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

/* ─── Model Detail Modal ─────────────────────────────────────────── */
const ModelModal = ({ model, onClose }) => {
    if (!model) return null;
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
                        src={model.carImage || "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png"}
                        alt={model.modelName}
                        className="w-20 h-14 rounded-xl object-cover border-2 border-white/30 shadow bg-white/10"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-extrabold text-white truncate">{model.brandName} {model.modelName}</h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 bg-[#b48001] text-white text-xs font-bold rounded-full">{model.fuelType}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">{model.transmissionType}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">{model.bodyType}</span>
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
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Identity & Category</p>
                        <DetailRow label="Brand Name" value={model.brandName} />
                        <DetailRow label="Model Name" value={model.modelName} />
                        <DetailRow label="Category" value={model.category} />
                        <DetailRow label="Launch Year" value={model.year} />
                        <DetailRow label="Body Type" value={model.bodyType} />
                        <DetailRow label="Base Price" value={fmt(model.price)} />
                    </div>

                    {/* Powertrain */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Powertrain & Performance</p>
                        <DetailRow label="Fuel Type" value={model.fuelType} />
                        <DetailRow label="Transmission" value={model.transmissionType} />
                        <DetailRow label="Engine" value={model.engine} />
                        <DetailRow label="Max Power" value={model.maxPower} />
                        <DetailRow label="Max Torque" value={model.maxTorque} />
                        <DetailRow label="Mileage" value={model.mileage} />
                    </div>

                    {/* Dimensions & Capacity */}
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Capacity & Dimensions</p>
                        <DetailRow label="Seating Capacity" value={model.seatingCapacity} />
                        <DetailRow label="Boot Space" value={model.bootSpace} />
                    </div>

                    {/* Details & Remarks */}
                    {model.description && (
                        <div>
                            <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Description</p>
                            <p className="text-sm text-[#19456d] leading-relaxed">{model.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════ */
const AllModels = ({ handleEditModelClick }) => {
    const { models, loading, fetchAllModels, removeModel } = useCars();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModel, setSelectedModel] = useState(null);
    const [fuelFilter, setFuelFilter] = useState("All");

    useEffect(() => {
        fetchAllModels();
    }, [fetchAllModels]);

    const FUEL_TYPES = ["All", "Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

    const filtered = models.filter((m) => {
        const matchSearch =
            m.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.modelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFuel = fuelFilter === "All" || m.fuelType === fuelFilter;
        return matchSearch && matchFuel;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d]">All Models</h2>
                    <p className="text-[#708ca4] text-sm mt-1">
                        {models.length} base model{models.length !== 1 ? "s" : ""} in catalogue
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
                            placeholder="Search brand, model..."
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
                                ? "No models match your filters."
                                : "No models in catalogue yet."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4">Model</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Fuel / Trans.</th>
                                    <th className="px-6 py-4">Year</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((m) => (
                                    <tr key={m._id} className="hover:bg-[#fafbf8] transition group">
                                        {/* Model Image & Identity */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={m.carImage || "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png"}
                                                    alt={m.modelName}
                                                    className="w-14 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-[#19456d]">{m.brandName}</p>
                                                    <p className="text-xs font-medium text-[#708ca4]">{m.modelName}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                                                {m.category}
                                            </span>
                                        </td>

                                        {/* Fuel & Trans */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-[#19456d]">{m.fuelType}</span>
                                                <span className="text-xs text-[#708ca4]">{m.transmissionType}</span>
                                            </div>
                                        </td>

                                        {/* Year */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-[#19456d]">{m.year}</span>
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-[#b48001]">{fmt(m.price)}</span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => setSelectedModel(m)}
                                                    className="p-2 text-[#708ca4] hover:text-[#19456d] hover:bg-[#19456d]/10 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    👁️
                                                </button>
                                                {handleEditModelClick && (
                                                    <button
                                                        onClick={() => handleEditModelClick(m._id)}
                                                        className="p-2 text-[#708ca4] hover:text-[#b48001] hover:bg-[#b48001]/10 rounded-lg transition"
                                                        title="Edit Model"
                                                    >
                                                        ✏️
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => removeModel(m._id)}
                                                    className="p-2 text-[#708ca4] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete Model"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            <ModelModal model={selectedModel} onClose={() => setSelectedModel(null)} />
        </div>
    );
};

export default AllModels;