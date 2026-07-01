import React, { useState, useRef, useEffect } from "react";
import { useCars } from "../../cars/hooks/useCars.jsx";
import { toast } from "react-hot-toast";

/* ─── Initial form state ─────────────────────────────────────────── */
const INITIAL = {
    modelId: "",
    variantName: "",
    fuelType: "",
    transmissionType: "",
    engine: "",
    maxPower: "",
    maxTorque: "",
    mileage: "",
    seatingCapacity: "",
    bootSpace: "",
    bodyType: "",
    // Normal Pricing
    CSDPrice: "",
    OnRoadPrice: "",
    ExShowroomPrice: "",
    RTO: "",
    Insurance: "",
    RegistraionFee: "",
    FastTagFee: "",
    HPEndorsementFee: "",
    HSRPSMartCardTemporaryFee: "",
    // BH Pricing
    BHOnRoadPrice: "",
    ExShowroomPriceBH: "",
    BHRegistrationCost: "",
    BHInsurance: "",
    BHRegistrationFee: "",
    BHFastTagFee: "",
    BHHPEndorsementFee: "",
    BHHSRPSMartCardTemporaryFee: "",
    // Other Pricing
    civilExShowroomPrice: "",
    MonthlyEMI: "",
    // Additional
    Entitlement: "",
    Remarks: "Please verify the details with car dealer before placing order on CSD AFD Portal.",
    features: "",
    description: "",
};

/* ─── Reusable field components ─────────────────────────────────── */
const Field = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#708ca4] uppercase tracking-widest">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
);

const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium focus:outline-none focus:ring-1 ${err
        ? "border-red-400 focus:border-red-500 focus:ring-red-400"
        : "border-[#708ca4]/40 focus:border-[#19456d] focus:ring-[#19456d]"
    }`;

const SectionTitle = ({ icon, children }) => (
    <div className="col-span-full border-b border-[#708ca4]/20 pb-2 mb-1 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <h3 className="text-base font-bold text-[#19456d]">{children}</h3>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const AddVariants = () => {
    const { addVariant, fetchAllModels, loading } = useCars();

    const [form, setForm] = useState(INITIAL);
    const [variantImages, setVariantImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [models, setModels] = useState([]);
    const [modelsLoading, setModelsLoading] = useState(true);
    const fileInputRef = useRef(null);

    /* ── Load car models for the dropdown ── */
    useEffect(() => {
        const load = async () => {
            setModelsLoading(true);
            const res = await fetchAllModels();
            if (res?.success && res.models) {
                setModels(res.models);
            } else {
                toast.error("Could not load car models. Please refresh and try again.");
            }
            setModelsLoading(false);
        };
        load();
    }, [fetchAllModels]);

    /* ── Two-way binding ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ── Image handler ── */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const invalid = files.filter(f => !f.type.startsWith("image/"));
        if (invalid.length) { toast.error("Only image files are accepted."); e.target.value = ""; return; }
        const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) { toast.error(`${oversized.length} file(s) exceed 5 MB and were skipped.`); }
        const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
        if (!valid.length) { e.target.value = ""; return; }
        setVariantImages(prev => [...prev, ...valid]);
        setImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
        if (errors.variantImages) setErrors(prev => ({ ...prev, variantImages: "" }));
        e.target.value = "";
    };

    const removeImage = (idx) => {
        setVariantImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── Client-side validation ── */
    const validate = () => {
        const errs = {};

        if (!form.modelId) errs.modelId = "Please select a car model.";
        if (!form.variantName?.trim()) errs.variantName = "Variant name is required.";

        // Overridden powertrain fields (required if user wants to differentiate from base model)
        if (!form.fuelType) errs.fuelType = "Fuel type is required.";
        if (!form.transmissionType) errs.transmissionType = "Transmission type is required.";

        const textFields = ["engine", "maxPower", "mileage", "bootSpace", "bodyType"];
        textFields.forEach((f) => {
            if (!form[f]?.trim()) errs[f] = "This field is required.";
        });

        // Seating capacity
        const seatsNum = Number(form.seatingCapacity);
        if (!form.seatingCapacity) {
            errs.seatingCapacity = "Seating capacity is required.";
        } else if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 20) {
            errs.seatingCapacity = "Must be a number between 1 and 20.";
        }

        if (!variantImages.length) errs.variantImages = "At least one image is required. (optional — defaults to parent model images)";

        return errs;
    };

    /* ── Submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the highlighted errors before submitting.");
            const firstKey = Object.keys(validationErrors)[0];
            document.getElementById(`variant-field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== "") formData.append(key, value);
        });
        variantImages.forEach(img => formData.append("variantImages", img));

        const res = await addVariant(formData);
        if (res?.success) {
            setForm(INITIAL);
            setVariantImages([]);
            setImagePreviews([]);
            setErrors({});
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    /* ── Reset ── */
    const handleReset = () => {
        setForm(INITIAL);
        setVariantImages([]);
        setImagePreviews([]);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    /* ── Derived: selected model details for preview ── */
    const selectedModel = models.find((m) => m._id === form.modelId) || null;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-1">Add New Variant</h2>
                <p className="text-[#708ca4] text-sm">
                    Select a base car model and define variant-specific overrides such as pricing, trim, and specs.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* ═══ SECTION 1: Model Selection ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 gap-5">
                        <SectionTitle icon="🚗">Base Car Model</SectionTitle>

                        <Field label="Select Car Model" required error={errors.modelId}>
                            <select
                                id="variant-field-modelId"
                                name="modelId"
                                value={form.modelId}
                                onChange={handleChange}
                                disabled={modelsLoading}
                                className={inputCls(errors.modelId)}
                            >
                                <option value="">
                                    {modelsLoading ? "Loading models…" : "-- Select a base model --"}
                                </option>
                                {models.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.brandName} {m.modelName} ({m.year}) — {m.fuelType} / {m.transmissionType}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        {/* Preview card for selected model */}
                        {selectedModel && (
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#19456d]/20 shadow-sm">
                                <img
                                    src={selectedModel.carImage || "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png"}
                                    alt={selectedModel.modelName}
                                    className="w-20 h-14 rounded-lg object-cover border border-gray-200"
                                />
                                <div>
                                    <p className="text-sm font-extrabold text-[#19456d]">
                                        {selectedModel.brandName} {selectedModel.modelName}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        <span className="px-2 py-0.5 text-xs font-bold bg-[#19456d]/10 text-[#19456d] rounded-full">
                                            {selectedModel.fuelType}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs font-bold bg-[#b48001]/10 text-[#b48001] rounded-full">
                                            {selectedModel.transmissionType}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-full">
                                            {selectedModel.category}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-full">
                                            {selectedModel.year}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Field label="Variant Name" required error={errors.variantName}>
                            <input
                                id="variant-field-variantName"
                                type="text"
                                name="variantName"
                                value={form.variantName}
                                onChange={handleChange}
                                placeholder="e.g. ZXI+, Top Trim, LXI, AMT"
                                className={inputCls(errors.variantName)}
                            />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Powertrain (Override) ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="⚙️">Powertrain & Specs</SectionTitle>

                        <Field label="Fuel Type" required error={errors.fuelType}>
                            <select id="variant-field-fuelType" name="fuelType"
                                value={form.fuelType} onChange={handleChange}
                                className={inputCls(errors.fuelType)}>
                                <option value="">Select Fuel Type</option>
                                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Transmission Type" required error={errors.transmissionType}>
                            <select id="variant-field-transmissionType" name="transmissionType"
                                value={form.transmissionType} onChange={handleChange}
                                className={inputCls(errors.transmissionType)}>
                                <option value="">Select Transmission</option>
                                {["Manual", "Automatic", "AMT", "CVT", "DCT"].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Engine Displacement" required error={errors.engine}>
                            <input id="variant-field-engine" type="text" name="engine"
                                value={form.engine} onChange={handleChange}
                                placeholder="e.g. 1197 cc"
                                className={inputCls(errors.engine)} />
                        </Field>

                        <Field label="Max Power" required error={errors.maxPower}>
                            <input id="variant-field-maxPower" type="text" name="maxPower"
                                value={form.maxPower} onChange={handleChange}
                                placeholder="e.g. 89 bhp @ 6000 rpm"
                                className={inputCls(errors.maxPower)} />
                        </Field>

                        <Field label="Max Torque" error={errors.maxTorque}>
                            <input id="variant-field-maxTorque" type="text" name="maxTorque"
                                value={form.maxTorque} onChange={handleChange}
                                placeholder="e.g. 113 Nm @ 4200 rpm (optional)"
                                className={inputCls(errors.maxTorque)} />
                        </Field>

                        <Field label="Mileage" required error={errors.mileage}>
                            <input id="variant-field-mileage" type="text" name="mileage"
                                value={form.mileage} onChange={handleChange}
                                placeholder="e.g. 22.38 km/l"
                                className={inputCls(errors.mileage)} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 3: Dimensions & Capacity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="📐">Dimensions & Capacity</SectionTitle>

                        <Field label="Seating Capacity" required error={errors.seatingCapacity}>
                            <input id="variant-field-seatingCapacity" type="number" name="seatingCapacity"
                                value={form.seatingCapacity} onChange={handleChange}
                                placeholder="e.g. 5" min="1" max="20"
                                className={inputCls(errors.seatingCapacity)} />
                        </Field>

                        <Field label="Boot Space" required error={errors.bootSpace}>
                            <input id="variant-field-bootSpace" type="text" name="bootSpace"
                                value={form.bootSpace} onChange={handleChange}
                                placeholder="e.g. 268 L"
                                className={inputCls(errors.bootSpace)} />
                        </Field>

                        <Field label="Body Type" required error={errors.bodyType}>
                            <input id="variant-field-bodyType" type="text" name="bodyType"
                                value={form.bodyType} onChange={handleChange}
                                placeholder="e.g. 5-Door Hatchback"
                                className={inputCls(errors.bodyType)} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 4: Normal Pricing ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="₹">Normal (Non-BH) Pricing</SectionTitle>

                        {[
                            { name: "CSDPrice", label: "CSD Price" },
                            { name: "OnRoadPrice", label: "On Road Price" },
                            { name: "ExShowroomPrice", label: "Ex-Showroom Price" },
                            { name: "RTO", label: "RTO" },
                            { name: "Insurance", label: "Insurance" },
                            { name: "FastTagFee", label: "FASTag Fee" },
                            { name: "HPEndorsementFee", label: "HP Endorsement Fee" },
                            { name: "HSRPSMartCardTemporaryFee", label: "HSRP / Smart Card / Temp Fee" },
                            { name: "civilExShowroomPrice", label: "Civil Ex-Showroom Price" },
                            { name: "MonthlyEMI", label: "Monthly EMI" },
                        ].map(({ name, label }) => (
                            <Field key={name} label={`${label} (₹)`} error={errors[name]}>
                                <input id={`variant-field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={inputCls(errors[name])} />
                            </Field>
                        ))}

                        <Field label="Registration Fee" error={errors.RegistraionFee}>
                            <input id="variant-field-RegistraionFee" type="text" name="RegistraionFee"
                                value={form.RegistraionFee} onChange={handleChange}
                                placeholder="e.g. Inclusive / 5500"
                                className={inputCls(errors.RegistraionFee)} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 5: BH Series Pricing ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="🏗️">BH Series Pricing</SectionTitle>

                        {[
                            { name: "BHOnRoadPrice", label: "BH On Road Price" },
                            { name: "ExShowroomPriceBH", label: "BH Ex-Showroom Price" },
                            { name: "BHRegistrationCost", label: "BH Registration Cost" },
                            { name: "BHInsurance", label: "BH Insurance" },
                            { name: "BHRegistrationFee", label: "BH Registration Fee" },
                            { name: "BHFastTagFee", label: "BH FASTag Fee" },
                            { name: "BHHPEndorsementFee", label: "BH HP Endorsement Fee" },
                            { name: "BHHSRPSMartCardTemporaryFee", label: "BH HSRP / Smart Card / Temp Fee" },
                        ].map(({ name, label }) => (
                            <Field key={name} label={`${label} (₹)`} error={errors[name]}>
                                <input id={`variant-field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={inputCls(errors[name])} />
                            </Field>
                        ))}
                    </div>
                </div>

                {/* ═══ SECTION 6: Additional Details ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 gap-5">
                        <SectionTitle icon="📝">Additional Details</SectionTitle>

                        <Field label="Entitlement" error={errors.Entitlement}>
                            <input id="variant-field-Entitlement" type="text" name="Entitlement"
                                value={form.Entitlement} onChange={handleChange}
                                placeholder="e.g. Cat I, Cat II"
                                className={inputCls(errors.Entitlement)} />
                        </Field>

                        <Field label="Features" error={errors.features}>
                            <textarea
                                id="variant-field-features"
                                name="features"
                                value={form.features}
                                onChange={handleChange}
                                placeholder="e.g. Sunroof, Cruise Control, 360° Camera, Android Auto, Apple CarPlay…"
                                rows={3}
                                className={`${inputCls(errors.features)} resize-none`}
                            />
                        </Field>

                        <Field label="Description" error={errors.description}>
                            <textarea
                                id="variant-field-description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Short description of this variant…"
                                rows={3}
                                className={`${inputCls(errors.description)} resize-none`}
                            />
                        </Field>

                        <Field label="Remarks" error={errors.Remarks}>
                            <textarea id="variant-field-Remarks" name="Remarks"
                                value={form.Remarks} onChange={handleChange}
                                placeholder="Disclaimer / additional remarks…"
                                rows={2}
                                className={`${inputCls(errors.Remarks)} resize-none`} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 6: Variant Images ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="border-b border-[#708ca4]/20 pb-2 mb-5 flex items-center gap-2">
                        <span className="text-lg">🖼️</span>
                        <div>
                            <h3 className="text-base font-bold text-[#19456d]">Variant Images</h3>
                            <p className="text-xs text-[#708ca4]">Upload up to 10 images. If none selected, parent model images are used.</p>
                        </div>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                            {imagePreviews.map((src, idx) => (
                                <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#708ca4]/30 aspect-square bg-white">
                                    <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                    {idx === 0 && (
                                        <span className="absolute top-1 left-1 bg-[#19456d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">MAIN</span>
                                    )}
                                    <button type="button" onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold hidden group-hover:flex items-center justify-center shadow"
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <input
                            id="variant-field-variantImages"
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium
                                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                                hover:file:bg-[#19456d]/20 cursor-pointer focus:outline-none focus:ring-1
                                ${errors.variantImages ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "border-[#708ca4]/40 focus:border-[#19456d] focus:ring-[#19456d]"}`}
                        />
                        {errors.variantImages && <p className="text-xs text-red-500 font-medium">{errors.variantImages}</p>}
                        <p className="text-xs text-[#708ca4]">Accepted: JPG, PNG, WEBP · Max 5 MB per image · Up to 10 images. If none selected, parent model images are used.</p>
                        {variantImages.length > 0 && (
                            <p className="text-xs font-semibold text-[#19456d]">✅ {variantImages.length} image(s) selected</p>
                        )}
                    </div>
                </div>

                {/* ═══ Action Buttons ═══ */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="px-6 py-3.5 rounded-xl font-bold border-2 border-[#708ca4]/40 text-[#708ca4] hover:border-[#19456d] hover:text-[#19456d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        disabled={loading || modelsLoading}
                        className="px-8 py-3.5 rounded-xl font-bold text-white bg-[#19456d] hover:bg-[#113150] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center min-w-[220px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Adding Variant…
                            </div>
                        ) : (
                            <span>✨ Add Variant</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVariants;
