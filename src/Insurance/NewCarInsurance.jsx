import React, { useState } from "react";
import {
    Car, ChevronRight, CheckCircle2, Sparkles,
    Loader2, AlertCircle, Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInsuranceWizard } from "./hooks/useInsuranceWizard";

// ─── Form initial state ───────────────────────────────────────────────────────
const initialForm = {
    fullName: "",
    phone: "",
    email: "",
    nomineeName: "",
    city: "",
    year: "",
    address: "",
    ncb: "",
    policyTenure: "",
    policyType: "",
    vehicleUsageType: "",
    manualBrand: "",
    manualModel: "",
    manualFuel: "",
    manualVariant: "",
};

// Only these fields are required to pass the first "Details" step
const REQUIRED_FIELDS = [
    "fullName", "phone", "email", "nomineeName", "city", 
    "year", "address", "ncb", "policyTenure", "policyType", "vehicleUsageType"
];

// ─── Wizard step labels ───────────────────────────────────────────────────────
const STEP_LABELS = {
    details: "0. Details",
    brand: "1. Brand",
    vehicle: "2. Model",
    fuel: "3. Fuel",
    variant: "4. Variant",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Spinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#b48001]" />
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-[#708ca4]">
            <AlertCircle className="h-8 w-8 mb-2 opacity-60" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
const NewCarInsurance = () => {
    const navigate = useNavigate();
    const {
        brands, brandsLoading,
        vehicles, vehiclesLoading, fetchVehicles,
        variantsLoading, fetchVariants,
        fuelTypes, variantsByFuel,
    } = useInsuranceWizard();

    const [step, setStep] = useState("details");
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Selections (full DB objects)
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // ── Form helpers ──────────────────────────────────────────
    const setField = (key, val) => {
        setForm((p) => ({ ...p, [key]: val }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const validate = () => {
        const errs = {};
        REQUIRED_FIELDS.forEach((f) => {
            if (!form[f]?.trim()) errs[f] = "This field is required";
        });
        if (form.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email))
            errs.email = "Enter a valid email";
        if (form.phone && !/^\+?[0-9]{10,15}$/.test(form.phone))
            errs.phone = "Enter a valid phone number";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const isFormValid = REQUIRED_FIELDS.every((f) => form[f]?.trim());

    // ── Step transitions ──────────────────────────────────────
    const onBrandSelect = (brand) => {
        setSelectedBrand(brand);
        setSelectedVehicle(null);
        setSelectedFuel(null);
        setSelectedVariant(null);
        fetchVehicles(brand._id);
        setStep("vehicle");
    };

    const onVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        setSelectedFuel(null);
        setSelectedVariant(null);
        fetchVariants(vehicle._id);
        setStep("fuel");
    };

    const onFuelSelect = (fuel) => {
        setSelectedFuel(fuel);
        setSelectedVariant(null);
        setStep("variant");
    };

    const onVariantSelect = (variant) => {
        setSelectedVariant(variant);
        setStep("confirm");
    };

    // ── Submit ────────────────────────────────────────────────
    const handleSubmit = () => setSubmitted(true);

    // ── Success screen ────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center px-6 pt-28">
                <div className="bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(25,69,109,0.15)] border border-[#708ca4]/15 p-10 max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#19456d]">Application Received!</h2>
                    <p className="mt-3 text-sm text-[#708ca4] leading-relaxed">
                        Thanks,{" "}
                        <span className="font-bold text-[#19456d]">{form.fullName.split(" ")[0]}</span>.
                        Our team will contact you on{" "}
                        <span className="font-mono text-[#19456d]">{form.phone}</span> within 15 minutes.
                    </p>
                    <div className="mt-2 text-xs text-[#708ca4] font-mono">
                        Reference: INS-{Math.floor(100000 + Math.random() * 900000)}
                    </div>
                    <button
                        onClick={() => navigate("/insurance")}
                        className="mt-8 px-8 py-3 rounded-full font-bold text-white bg-[#b48001] hover:bg-[#19456d] transition-colors"
                    >
                        Back to Insurance
                    </button>
                </div>
            </div>
        );
    }

    // ── Step indicator ────────────────────────────────────────
    const StepIndicator = () => (
        <div className="flex flex-wrap gap-1.5">
            {Object.entries(STEP_LABELS).map(([id, label]) => (
                <span
                    key={id}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        step === id
                            ? "bg-[#19456d] text-white"
                            : "bg-[#fafbf8] text-[#708ca4] border border-[#708ca4]/20"
                    }`}
                >
                    {label}
                </span>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafbf8] pt-28 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl border border-[#708ca4]/15 shadow-[0_8px_40px_-12px_rgba(25,69,109,0.1)] overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-7 py-5 border-b border-[#708ca4]/10">
                        <div>
                            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-[#b48001]/10 text-[#b48001] border border-[#b48001]/20">
                                Insurance Wizard
                            </span>
                            <h3 className="mt-1.5 text-xl font-extrabold text-[#19456d]">
                                New Car Insurance Configurator
                            </h3>
                        </div>
                        <StepIndicator />
                    </div>

                    {/* Content */}
                    <div className="p-7 space-y-5 max-h-[72vh] overflow-y-auto">

                        {/* ══ STEP: DETAILS ══════════════════════════════ */}
                        {step === "details" && (
                            <div className="space-y-5">
                                <h4 className="text-sm font-extrabold text-[#19456d]">Personal Details</h4>
                                <div className="grid gap-4 md:grid-cols-2">

                                    {/* Text inputs */}
                                    {[
                                        { field: "fullName", label: "Full Name (as per RC)", placeholder: "Your full name" },
                                        { field: "phone", label: "Phone", placeholder: "+91 98765 43210" },
                                        { field: "email", label: "Email", placeholder: "you@email.com" },
                                        { field: "nomineeName", label: "Nominee Name", placeholder: "Nominee's full name" },
                                        { field: "city", label: "City", placeholder: "e.g. New Delhi" },
                                        { field: "year", label: "Manufacturing Year", placeholder: "e.g. 2024" },
                                        { field: "ncb", label: "NCB %", placeholder: "0 / 20 / 25 / 35 / 45 / 50" },
                                    ].map(({ field, label, placeholder }) => (
                                        <label key={field} className="flex flex-col gap-1 text-sm">
                                            <span className="font-semibold text-[#19456d]/70">{label}</span>
                                            <input
                                                value={form[field]}
                                                onChange={(e) => setField(field, e.target.value)}
                                                placeholder={placeholder}
                                                className="rounded-xl border border-[#708ca4]/30 bg-[#fafbf8] px-3 py-2.5 text-[#19456d] placeholder-[#708ca4]/50 outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001]/30 transition"
                                            />
                                            {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
                                        </label>
                                    ))}

                                    {/* Address — full width */}
                                    <label className="flex flex-col gap-1 text-sm md:col-span-2">
                                        <span className="font-semibold text-[#19456d]/70">Address</span>
                                        <input
                                            value={form.address}
                                            onChange={(e) => setField("address", e.target.value)}
                                            placeholder="Full address"
                                            className="rounded-xl border border-[#708ca4]/30 bg-[#fafbf8] px-3 py-2.5 text-[#19456d] placeholder-[#708ca4]/50 outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001]/30 transition"
                                        />
                                        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                    </label>

                                    {/* Selects */}
                                    {[
                                        {
                                            field: "policyTenure",
                                            label: "Policy Tenure",
                                            options: [
                                                { value: "1 year", label: "1 Year" },
                                                { value: "Multi-year", label: "Multi-year" },
                                                { value: "Long-term (2W)", label: "Long-term (2W)" },
                                            ],
                                        },
                                        {
                                            field: "policyType",
                                            label: "Policy Type",
                                            options: [
                                                { value: "comprehensive", label: "Comprehensive" },
                                                { value: "third-party", label: "Third-party Only" },
                                                { value: "own-damage", label: "Own Damage Only" },
                                            ],
                                        },
                                        {
                                            field: "vehicleUsageType",
                                            label: "Vehicle Usage",
                                            options: [
                                                { value: "Personal", label: "Personal" },
                                                { value: "Commercial", label: "Commercial" },
                                            ],
                                        },
                                    ].map(({ field, label, options }) => (
                                        <label key={field} className="flex flex-col gap-1 text-sm">
                                            <span className="font-semibold text-[#19456d]/70">{label}</span>
                                            <select
                                                value={form[field]}
                                                onChange={(e) => setField(field, e.target.value)}
                                                className="rounded-xl border border-[#708ca4]/30 bg-[#fafbf8] px-3 py-2.5 text-[#19456d] outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001]/30 transition"
                                            >
                                                <option value="">Select…</option>
                                                {options.map((o) => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                            {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
                                        </label>
                                    ))}

                                    <button
                                        onClick={() => { if (validate()) setStep("brand"); }}
                                        disabled={!isFormValid}
                                        className={`md:col-span-2 mt-2 py-3.5 rounded-xl font-bold text-white transition-all ${
                                            isFormValid
                                                ? "bg-[#b48001] hover:bg-[#19456d] shadow-[0_8px_24px_-8px_rgba(180,128,1,0.4)] hover:-translate-y-0.5"
                                                : "bg-[#708ca4]/30 cursor-not-allowed"
                                        }`}
                                    >
                                        Next — Select Brand
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ══ STEP: BRAND ════════════════════════════════ */}
                        {step === "brand" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-extrabold text-[#19456d]">Choose Manufacturer</h4>
                                    <button onClick={() => setStep("details")} className="text-xs font-bold text-[#b48001] hover:underline">
                                        ← Back to Details
                                    </button>
                                </div>

                                {brandsLoading ? (
                                    <Spinner />
                                ) : brands.length === 0 ? (
                                    <EmptyState message="No brands found. Please add brands from the admin panel." />
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {brands.map((brand) => (
                                            <button
                                                key={brand._id}
                                                onClick={() => onBrandSelect(brand)}
                                                className={`p-4 rounded-xl border text-left transition-all hover:border-[#b48001] hover:shadow-md ${
                                                    selectedBrand?._id === brand._id
                                                        ? "border-[#b48001] bg-[#b48001]/5 ring-1 ring-[#b48001]"
                                                        : "border-[#708ca4]/20 bg-[#fafbf8]"
                                                }`}
                                            >
                                                {brand.logo ? (
                                                    <img
                                                        src={brand.logo}
                                                        alt={brand.brandName}
                                                        className="h-8 w-auto object-contain mb-2"
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <Car className="h-5 w-5 text-[#708ca4] mb-2" />
                                                )}
                                                <p className="text-xs font-bold text-[#19456d]">{brand.brandName}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-[#708ca4]/10 text-center">
                                    <p className="text-sm text-[#708ca4] mb-2">Can't find your vehicle brand?</p>
                                    <button 
                                        onClick={() => {
                                            setSelectedBrand(null);
                                            setSelectedVehicle(null);
                                            setSelectedFuel(null);
                                            setSelectedVariant(null);
                                            setStep("manual_entry");
                                        }}
                                        className="text-sm font-bold text-[#b48001] hover:text-[#19456d] hover:underline transition-colors"
                                    >
                                        Enter Vehicle Details Manually →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ══ STEP: VEHICLE (MODEL) ══════════════════════ */}
                        {step === "vehicle" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-extrabold text-[#19456d]">
                                        Select Model —{" "}
                                        <span className="text-[#b48001]">{selectedBrand?.brandName}</span>
                                    </h4>
                                    <button onClick={() => setStep("brand")} className="text-xs font-bold text-[#b48001] hover:underline">
                                        ← Change Brand
                                    </button>
                                </div>

                                {vehiclesLoading ? (
                                    <Spinner />
                                ) : vehicles.length === 0 ? (
                                    <EmptyState message="No models found for this brand." />
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {vehicles.map((vehicle) => (
                                            <button
                                                key={vehicle._id}
                                                onClick={() => onVehicleSelect(vehicle)}
                                                className={`p-4 rounded-xl border text-center transition-all hover:border-[#b48001] hover:shadow-md ${
                                                    selectedVehicle?._id === vehicle._id
                                                        ? "border-[#b48001] bg-[#b48001]/5 ring-1 ring-[#b48001]"
                                                        : "border-[#708ca4]/20 bg-[#fafbf8]"
                                                }`}
                                            >
                                                <p className="text-xs font-bold text-[#19456d]">{vehicle.vehicleName}</p>
                                                {vehicle.VehicleType && (
                                                    <span className="text-[10px] text-[#708ca4]">{vehicle.VehicleType}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-[#708ca4]/10 text-center">
                                    <p className="text-sm text-[#708ca4] mb-2">Can't find your specific model?</p>
                                    <button 
                                        onClick={() => {
                                            setField("manualBrand", selectedBrand?.brandName || "");
                                            setStep("manual_entry");
                                        }}
                                        className="text-sm font-bold text-[#b48001] hover:text-[#19456d] hover:underline transition-colors"
                                    >
                                        Enter Model Details Manually →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ══ STEP: FUEL ═════════════════════════════════ */}
                        {step === "fuel" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-extrabold text-[#19456d]">Choose Fuel Type</h4>
                                    <button onClick={() => setStep("vehicle")} className="text-xs font-bold text-[#b48001] hover:underline">
                                        ← Change Model
                                    </button>
                                </div>

                                {variantsLoading ? (
                                    <Spinner />
                                ) : fuelTypes.length === 0 ? (
                                    <EmptyState message="No fuel types found for this model." />
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {fuelTypes.map((fuel) => (
                                            <button
                                                key={fuel}
                                                onClick={() => onFuelSelect(fuel)}
                                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all hover:border-[#b48001] hover:shadow-md ${
                                                    selectedFuel === fuel
                                                        ? "border-[#b48001] bg-[#b48001]/5 ring-1 ring-[#b48001]"
                                                        : "border-[#708ca4]/20 bg-[#fafbf8]"
                                                }`}
                                            >
                                                <Zap className="h-5 w-5 text-[#b48001]" />
                                                <p className="text-xs font-bold text-[#19456d]">{fuel}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-[#708ca4]/10 text-center">
                                    <p className="text-sm text-[#708ca4] mb-2">Fuel type missing?</p>
                                    <button 
                                        onClick={() => {
                                            setField("manualBrand", selectedBrand?.brandName || "");
                                            setField("manualModel", selectedVehicle?.vehicleName || "");
                                            setStep("manual_entry");
                                        }}
                                        className="text-sm font-bold text-[#b48001] hover:text-[#19456d] hover:underline transition-colors"
                                    >
                                        Enter Fuel & Variant Manually →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ══ STEP: VARIANT ══════════════════════════════ */}
                        {step === "variant" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-extrabold text-[#19456d]">
                                        Select Trim —{" "}
                                        <span className="text-[#b48001]">{selectedFuel}</span>
                                    </h4>
                                    <button onClick={() => setStep("fuel")} className="text-xs font-bold text-[#b48001] hover:underline">
                                        ← Change Fuel
                                    </button>
                                </div>

                                {variantsLoading ? (
                                    <Spinner />
                                ) : variantsByFuel(selectedFuel).length === 0 ? (
                                    <EmptyState message="No variants found for this fuel type." />
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {variantsByFuel(selectedFuel).map((variant) => (
                                            <button
                                                key={variant._id}
                                                onClick={() => onVariantSelect(variant)}
                                                className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all hover:border-[#b48001] hover:shadow-md ${
                                                    selectedVariant?._id === variant._id
                                                        ? "border-[#b48001] bg-[#b48001]/5 ring-1 ring-[#b48001]"
                                                        : "border-[#708ca4]/20 bg-[#fafbf8]"
                                                }`}
                                            >
                                                <div>
                                                    <p className="text-xs font-bold text-[#19456d]">{variant.variantName}</p>
                                                    <span className="text-[10px] text-[#708ca4]">
                                                        {variant.Engine || ""}
                                                        {variant.ExShowroomPrice
                                                            ? ` · ₹${Number(variant.ExShowroomPrice).toLocaleString("en-IN")}`
                                                            : ""}
                                                    </span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-[#708ca4] shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-[#708ca4]/10 text-center">
                                    <p className="text-sm text-[#708ca4] mb-2">Can't find your specific trim?</p>
                                    <button 
                                        onClick={() => {
                                            setField("manualBrand", selectedBrand?.brandName || "");
                                            setField("manualModel", selectedVehicle?.vehicleName || "");
                                            setField("manualFuel", selectedFuel || "");
                                            setStep("manual_entry");
                                        }}
                                        className="text-sm font-bold text-[#b48001] hover:text-[#19456d] hover:underline transition-colors"
                                    >
                                        Enter Variant Details Manually →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ══ STEP: MANUAL ENTRY (FALLBACK) ══════════════ */}
                        {step === "manual_entry" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-extrabold text-[#19456d]">Enter Vehicle Manually</h4>
                                    <button onClick={() => setStep("brand")} className="text-xs font-bold text-[#b48001] hover:underline">
                                        ← Back to Brands
                                    </button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {[
                                        { field: "manualBrand", label: "Brand Name", placeholder: "e.g. Ford" },
                                        { field: "manualModel", label: "Model Name", placeholder: "e.g. EcoSport" },
                                        { field: "manualFuel", label: "Fuel Type", placeholder: "e.g. Petrol" },
                                        { field: "manualVariant", label: "Variant / Trim", placeholder: "e.g. Titanium" },
                                    ].map(({ field, label, placeholder }) => (
                                        <label key={field} className="flex flex-col gap-1 text-sm">
                                            <span className="font-semibold text-[#19456d]/70">{label}</span>
                                            <input
                                                value={form[field]}
                                                onChange={(e) => setField(field, e.target.value)}
                                                placeholder={placeholder}
                                                className="rounded-xl border border-[#708ca4]/30 bg-[#fafbf8] px-3 py-2.5 text-[#19456d] placeholder-[#708ca4]/50 outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001]/30 transition"
                                            />
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => {
                                            if (form.manualBrand && form.manualModel) setStep("confirm");
                                            else alert("Please enter at least Brand and Model.");
                                        }}
                                        className="md:col-span-2 mt-2 py-3.5 rounded-xl font-bold text-white bg-[#b48001] hover:bg-[#19456d] transition-all shadow-[0_8px_24px_-8px_rgba(180,128,1,0.4)] hover:-translate-y-0.5"
                                    >
                                        Next — Confirm Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ══ STEP: CONFIRM ══════════════════════════════ */}
                        {step === "confirm" && (
                            <div className="space-y-5">
                                {/* Vehicle summary */}
                                <div className="bg-[#fafbf8] rounded-2xl border border-[#708ca4]/15 p-5 space-y-2">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#708ca4]">Selected Vehicle</p>
                                    <h4 className="text-lg font-extrabold text-[#19456d]">
                                        {selectedBrand ? `${selectedBrand.brandName} ${selectedVehicle?.vehicleName}` : `${form.manualBrand} ${form.manualModel}`}
                                    </h4>
                                    <p className="text-sm text-[#708ca4] font-medium">
                                        {selectedFuel ? `${selectedFuel} · ${selectedVariant?.variantName}` : `${form.manualFuel} · ${form.manualVariant}`}
                                    </p>
                                    {selectedVariant?.ExShowroomPrice && (
                                        <p className="text-sm font-bold text-[#b48001]">
                                            Ex-Showroom: ₹{Number(selectedVariant.ExShowroomPrice).toLocaleString("en-IN")}
                                        </p>
                                    )}
                                </div>

                                {/* Buyer summary */}
                                <div className="bg-[#fafbf8] rounded-2xl border border-[#708ca4]/15 p-5">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#708ca4] mb-3">Buyer Details</p>
                                    <div className="grid gap-2 text-sm">
                                        {[
                                            ["Name", form.fullName],
                                            ["Phone", form.phone],
                                            ["Email", form.email],
                                            ["City", form.city],
                                            ["Year", form.year],
                                            ["Address", form.address],
                                            ["Nominee", form.nomineeName],
                                            ["Policy Tenure", form.policyTenure],
                                            ["Policy Type", form.policyType],
                                            ["Vehicle Usage", form.vehicleUsageType],
                                            ["NCB %", form.ncb],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex gap-3 justify-between border-b border-[#708ca4]/10 pb-1.5 last:border-0">
                                                <span className="font-semibold text-[#19456d]">{label}</span>
                                                <span className="text-[#708ca4] text-right">{val || "—"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RTI tip */}
                                <div className="bg-[#b48001]/8 border border-[#b48001]/20 rounded-xl p-4 flex gap-3">
                                    <Sparkles className="h-5 w-5 text-[#b48001] shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="font-bold text-sm text-[#19456d]">
                                            Return-to-Invoice (RTI) is Highly Recommended
                                        </h5>
                                        <p className="text-xs text-[#708ca4] mt-0.5 leading-relaxed">
                                            Standard insurance pays a depreciated IDV. RTI pays the full original invoice
                                            price including road taxes if your car is stolen or totalled.
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 justify-end pt-2 border-t border-[#708ca4]/10">
                                    <button
                                        onClick={() => setStep("variant")}
                                        className="px-5 py-2.5 border border-[#708ca4]/30 hover:bg-[#fafbf8] text-sm font-bold text-[#19456d] rounded-xl transition"
                                    >
                                        Modify Selections
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="group inline-flex items-center gap-2 bg-[#b48001] hover:bg-[#19456d] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_8px_24px_-8px_rgba(180,128,1,0.4)] hover:-translate-y-0.5"
                                    >
                                        Proceed to Quotation
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCarInsurance;
