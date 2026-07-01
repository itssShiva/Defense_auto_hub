import React, { useState, useRef } from "react";
import { useCars } from "../cars/hooks/useCars";
import { toast } from "react-hot-toast";

/* ─── Initial form state ──────────────────────────────────── */
const INITIAL = {
    brandName: "",
    modelName: "",
    price: "",
    kmTravelled: "",
    year: "",
    fuelType: "",
    transmissionType: "",
    color: "",
    owner: "",
    Address: "",
    City: "",
    State: "",
};

/* ─── Reusable field components ─────────────────────────── */
const Field = ({ label, required, error, children }) => (
    <div className="group">
        <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium";

const errCls = (errors, field) =>
    errors[field] ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "";

const SectionTitle = ({ icon, children }) => (
    <div className="col-span-full mb-1 border-b border-[#708ca4]/20 pb-2 flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <h3 className="text-base font-bold text-[#19456d]">{children}</h3>
    </div>
);

/* ═══════════════════════════════════════════════════════════ */
const AddUsedCar = () => {
    const { addUsedCar, loading } = useCars();
    const [form, setForm] = useState(INITIAL);
    const [carImages, setCarImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

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
        const invalid = files.filter(f => !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type));
        if (invalid.length) { toast.error("Only JPG, PNG, and WEBP images are accepted."); e.target.value = ""; return; }
        const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) { toast.error(`${oversized.length} file(s) exceed 5 MB and were skipped.`); }
        const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
        if (!valid.length) { e.target.value = ""; return; }
        setCarImages(prev => [...prev, ...valid]);
        setImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
        if (errors.carImages) setErrors(prev => ({ ...prev, carImages: "" }));
        e.target.value = "";
    };

    const removeImage = (idx) => {
        setCarImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── Client-side validation ── */
    const validate = () => {
        const newErrors = {};
        const requiredText = ["brandName", "modelName", "fuelType", "transmissionType", "color", "owner", "Address", "City", "State"];
        const requiredNumber = ["price", "kmTravelled", "year"];

        requiredText.forEach((f) => {
            if (!form[f]?.trim()) newErrors[f] = "This field is required.";
        });
        requiredNumber.forEach((f) => {
            if (form[f] === "" || isNaN(Number(form[f]))) newErrors[f] = "Enter a valid number.";
        });

        // Year range check
        const yr = Number(form.year);
        if (!isNaN(yr) && (yr < 1980 || yr > new Date().getFullYear())) {
            newErrors.year = `Year must be between 1980 and ${new Date().getFullYear()}.`;
        }
        // KM check
        const km = Number(form.kmTravelled);
        if (!isNaN(km) && km < 0) newErrors.kmTravelled = "KM driven cannot be negative.";

        if (!carImages.length) newErrors.carImages = "At least one car image is required.";
        if (carImages.length > 10) newErrors.carImages = "Maximum 10 images allowed.";
        return newErrors;
    };

    /* ── Submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the highlighted errors before submitting.");
            const firstKey = Object.keys(validationErrors)[0];
            document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        carImages.forEach(img => formData.append("carImages", img));

        const res = await addUsedCar(formData);
        if (res?.success) {
            toast.success("Used car added successfully!");
            setForm(INITIAL);
            setCarImages([]);
            setImagePreviews([]);
            setErrors({});
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    /* ── Reset ── */
    const handleReset = () => {
        setForm(INITIAL);
        setCarImages([]);
        setImagePreviews([]);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const currentYear = new Date().getFullYear();

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">Add Used Car Listing</h2>
                <p className="text-[#708ca4]">
                    Fill in the details below to list a pre-owned vehicle on the platform.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* ═══ SECTION 1: Car Identity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="🚗">Car Identity</SectionTitle>

                        <Field label="Brand Name" required error={errors.brandName}>
                            <input id="field-brandName" type="text" name="brandName"
                                value={form.brandName} onChange={handleChange}
                                placeholder="e.g. Maruti Suzuki, Hyundai"
                                className={`${inputCls} ${errCls(errors, "brandName")}`} />
                        </Field>

                        <Field label="Model Name" required error={errors.modelName}>
                            <input id="field-modelName" type="text" name="modelName"
                                value={form.modelName} onChange={handleChange}
                                placeholder="e.g. Swift ZXI, Creta SX"
                                className={`${inputCls} ${errCls(errors, "modelName")}`} />
                        </Field>

                        <Field label="Manufacturing Year" required error={errors.year}>
                            <input id="field-year" type="number" name="year"
                                value={form.year} onChange={handleChange}
                                placeholder={`e.g. ${currentYear - 3}`}
                                min="1980" max={currentYear}
                                className={`${inputCls} ${errCls(errors, "year")}`} />
                        </Field>

                        <Field label="Color" required error={errors.color}>
                            <input id="field-color" type="text" name="color"
                                value={form.color} onChange={handleChange}
                                placeholder="e.g. Midnight Black, Pearl White"
                                className={`${inputCls} ${errCls(errors, "color")}`} />
                        </Field>

                        <Field label="Fuel Type" required error={errors.fuelType}>
                            <select id="field-fuelType" name="fuelType"
                                value={form.fuelType} onChange={handleChange}
                                className={`${inputCls} ${errCls(errors, "fuelType")}`}>
                                <option value="">Select Fuel Type</option>
                                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Transmission" required error={errors.transmissionType}>
                            <select id="field-transmissionType" name="transmissionType"
                                value={form.transmissionType} onChange={handleChange}
                                className={`${inputCls} ${errCls(errors, "transmissionType")}`}>
                                <option value="">Select Transmission</option>
                                {["Manual", "Automatic", "AMT", "CVT", "DCT"].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Ownership & Usage ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="📋">Ownership & Usage</SectionTitle>

                        <Field label="Owner Name" required error={errors.owner}>
                            <input id="field-owner" type="text" name="owner"
                                value={form.owner} onChange={handleChange}
                                placeholder="e.g. 1st Owner, 2nd Owner"
                                className={`${inputCls} ${errCls(errors, "owner")}`} />
                        </Field>

                        <Field label="Kilometers Driven" required error={errors.kmTravelled}>
                            <input id="field-kmTravelled" type="number" name="kmTravelled"
                                value={form.kmTravelled} onChange={handleChange}
                                placeholder="e.g. 45000" min="0"
                                className={`${inputCls} ${errCls(errors, "kmTravelled")}`} />
                        </Field>

                        <Field label="Price (₹)" required error={errors.price}>
                            <input id="field-price" type="number" name="price"
                                value={form.price} onChange={handleChange}
                                placeholder="e.g. 750000" min="0"
                                className={`${inputCls} ${errCls(errors, "price")}`} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 3: Location ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="📍">Location Details</SectionTitle>

                        <Field label="Address" required error={errors.Address}>
                            <input id="field-Address" type="text" name="Address"
                                value={form.Address} onChange={handleChange}
                                placeholder="e.g. 42, MG Road, Civil Lines"
                                className={`${inputCls} ${errCls(errors, "Address")}`} />
                        </Field>

                        <Field label="City" required error={errors.City}>
                            <input id="field-City" type="text" name="City"
                                value={form.City} onChange={handleChange}
                                placeholder="e.g. New Delhi"
                                className={`${inputCls} ${errCls(errors, "City")}`} />
                        </Field>

                        <Field label="State" required error={errors.State}>
                            <input id="field-State" type="text" name="State"
                                value={form.State} onChange={handleChange}
                                placeholder="e.g. Delhi"
                                className={`${inputCls} ${errCls(errors, "State")}`} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 4: Car Images ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="border-b border-[#708ca4]/20 pb-2 mb-5 flex items-center gap-2">
                        <span className="text-lg">📸</span>
                        <div>
                            <h3 className="text-base font-bold text-[#19456d]">Car Images</h3>
                            <p className="text-xs text-[#708ca4]">Upload up to 10 images. First image will be the main thumbnail.</p>
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
                            id="field-carImages"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium
                                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                                hover:file:bg-[#19456d]/20 cursor-pointer
                                ${errors.carImages ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "border-[#708ca4]/40 focus:border-[#19456d] focus:ring-[#19456d]"}
                                focus:outline-none focus:ring-1`}
                        />
                        {errors.carImages && (
                            <p className="text-xs text-red-500">{errors.carImages}</p>
                        )}
                        <p className="text-xs text-[#708ca4]">
                            Accepted formats: JPG, PNG, WEBP · Max 5 MB per image · Up to 10 images
                        </p>
                        {carImages.length > 0 && (
                            <p className="text-xs font-semibold text-[#19456d]">✅ {carImages.length} image(s) selected</p>
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
                        disabled={loading}
                        className="px-8 py-3.5 rounded-xl font-bold text-white bg-[#19456d] hover:bg-[#113150] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center min-w-[220px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Submitting Listing…
                            </div>
                        ) : (
                            <span>🚗 Submit Used Car Listing</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUsedCar;
