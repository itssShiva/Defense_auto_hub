import React, { useState, useRef } from "react";
import { addNewCar } from "../../cars/Api/cars.api";
import { toast } from "react-hot-toast";

/* ─── Initial form state ────────────────────────────────────────── */
const INITIAL = {
    IndexNo: "",
    Model: "",
    FuelType: "",
    TransmissionType: "",
    BodyType: "",
    Entitlement: "",
    SeatingCapacity: "",
    engineDisplacement: "",
    MaxPower: "",
    CityMileage: "",
    BootSpace: "",
    CSDPrice: "",
    OnRoadPrice: "",
    ExShowroomPrice: "",
    RTO: "",
    Insurance: "",
    RegistraionFee: "",
    FastTagFee: "",
    HPEndorsementFee: "",
    HSRPSMartCardTemporaryFee: "",
    BHOnRoadPrice: "",
    ExShowroomPriceBH: "",
    BHRegistrationCost: "",
    BHInsurance: "",
    BHRegistrationFee: "",
    BHFastTagFee: "",
    BHHPEndorsementFee: "",
    BHHSRPSMartCardTemporaryFee: "",
    civilExShowroomPrice: "",
    MonthlyEMI: "",
    details: "",
    Remarks: "Please verify the details with car dealer before placing order on CSD AFD Portal.",
};

/* ─── Reusable field components ─────────────────────────────────── */
const Field = ({ label, required, children }) => (
    <div className="group">
        <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium";

const SectionTitle = ({ children }) => (
    <div className="col-span-full mb-1 border-b border-[#708ca4]/20 pb-2">
        <h3 className="text-base font-bold text-[#19456d]">{children}</h3>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const AddCars = () => {
    const [form, setForm] = useState(INITIAL);
    const [carImages, setCarImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    /* ── Two-way binding handler ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear field-level error on change
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ── Image handler ── */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) {
            toast.error(`${oversized.length} file(s) exceed 5 MB and were skipped.`);
        }
        const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
        if (!valid.length) { e.target.value = ""; return; }
        setCarImages(prev => [...prev, ...valid]);
        setImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
        if (errors.carImages) setErrors(prev => ({ ...prev, carImages: "" }));
        e.target.value = ""; // allow re-selecting same files
    };

    const removeImage = (idx) => {
        setCarImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── Client-side validation ── */
    const validate = () => {
        const newErrors = {};
        const requiredTextFields = [
            "IndexNo", "Model", "FuelType", "TransmissionType", "BodyType",
            "Entitlement", "engineDisplacement", "MaxPower", "CityMileage",
            "BootSpace", "RegistraionFee", "details",
        ];
        const requiredNumberFields = [
            "SeatingCapacity", "CSDPrice", "OnRoadPrice", "ExShowroomPrice",
            "RTO", "Insurance", "FastTagFee", "HPEndorsementFee",
            "HSRPSMartCardTemporaryFee", "BHOnRoadPrice", "ExShowroomPriceBH",
            "BHRegistrationCost", "BHInsurance", "BHRegistrationFee",
            "BHFastTagFee", "BHHPEndorsementFee", "BHHSRPSMartCardTemporaryFee",
            "civilExShowroomPrice", "MonthlyEMI",
        ];

        requiredTextFields.forEach((f) => {
            if (!form[f]?.trim()) newErrors[f] = "This field is required.";
        });
        requiredNumberFields.forEach((f) => {
            if (form[f] === "" || isNaN(Number(form[f])))
                newErrors[f] = "Enter a valid number.";
        });
        if (!carImages.length) newErrors.carImages = "At least one car image is required.";
        if (carImages.length > 10) newErrors.carImages = "Maximum 10 images allowed.";
        if (form.details?.trim().length > 0 && form.details.trim().length < 10)
            newErrors.details = "Details must be at least 10 characters.";

        return newErrors;
    };

    /* ── Submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the highlighted errors before submitting.");
            // Scroll to first error
            const firstErrorKey = Object.keys(validationErrors)[0];
            document.getElementById(`field-${firstErrorKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Adding car to database…");

        try {
            const formData = new FormData();
            // Append all text/number fields
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });
            // Append all images
            carImages.forEach(img => formData.append("carImages", img));

            const response = await addNewCar(formData);

            if (response?.success) {
                toast.success(`Car "${form.Model}" added successfully!`, { id: toastId });
                // Reset form
                setForm(INITIAL);
                setCarImages([]);
                setImagePreviews([]);
                setErrors({});
                if (fileInputRef.current) fileInputRef.current.value = "";
            } else {
                toast.error(response?.message || "Failed to add car. Please try again.", { id: toastId });
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    /* ── Reset form ── */
    const handleReset = () => {
        setForm(INITIAL);
        setCarImages([]);
        setImagePreviews([]);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const errCls = (field) =>
        errors[field] ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "";

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">Add New Car</h2>
                <p className="text-[#708ca4]">
                    Fill in all the details below to add a new car to the CSD catalogue.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* ═══ SECTION 1: Car Identity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Car Identity</SectionTitle>

                        {/* Index No */}
                        <Field label="Index No" required>
                            <input id="field-IndexNo" type="text" name="IndexNo"
                                value={form.IndexNo} onChange={handleChange}
                                placeholder="e.g. CAR-001"
                                className={`${inputCls} ${errCls("IndexNo")}`} />
                            {errors.IndexNo && <p className="mt-1 text-xs text-red-500">{errors.IndexNo}</p>}
                        </Field>

                        {/* Model */}
                        <Field label="Car Model" required>
                            <input id="field-Model" type="text" name="Model"
                                value={form.Model} onChange={handleChange}
                                placeholder="e.g. Maruti Swift ZXI"
                                className={`${inputCls} ${errCls("Model")}`} />
                            {errors.Model && <p className="mt-1 text-xs text-red-500">{errors.Model}</p>}
                        </Field>

                        {/* Fuel Type */}
                        <Field label="Fuel Type" required>
                            <select id="field-FuelType" name="FuelType"
                                value={form.FuelType} onChange={handleChange}
                                className={`${inputCls} ${errCls("FuelType")}`}>
                                <option value="">Select Fuel Type</option>
                                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                            {errors.FuelType && <p className="mt-1 text-xs text-red-500">{errors.FuelType}</p>}
                        </Field>

                        {/* Transmission */}
                        <Field label="Transmission Type" required>
                            <select id="field-TransmissionType" name="TransmissionType"
                                value={form.TransmissionType} onChange={handleChange}
                                className={`${inputCls} ${errCls("TransmissionType")}`}>
                                <option value="">Select Transmission</option>
                                {["Manual", "Automatic", "AMT", "CVT", "DCT"].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.TransmissionType && <p className="mt-1 text-xs text-red-500">{errors.TransmissionType}</p>}
                        </Field>

                        {/* Body Type */}
                        <Field label="Body Type" required>
                            <input id="field-BodyType" type="text" name="BodyType"
                                value={form.BodyType} onChange={handleChange}
                                placeholder="e.g. Hatchback, SUV, Sedan"
                                className={`${inputCls} ${errCls("BodyType")}`} />
                            {errors.BodyType && <p className="mt-1 text-xs text-red-500">{errors.BodyType}</p>}
                        </Field>

                        {/* Entitlement */}
                        <Field label="Entitlement" required>
                            <input id="field-Entitlement" type="text" name="Entitlement"
                                value={form.Entitlement} onChange={handleChange}
                                placeholder="e.g. Cat I, Cat II"
                                className={`${inputCls} ${errCls("Entitlement")}`} />
                            {errors.Entitlement && <p className="mt-1 text-xs text-red-500">{errors.Entitlement}</p>}
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Specs ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Technical Specifications</SectionTitle>

                        <Field label="Seating Capacity" required>
                            <input id="field-SeatingCapacity" type="number" name="SeatingCapacity"
                                value={form.SeatingCapacity} onChange={handleChange}
                                placeholder="e.g. 5" min="1"
                                className={`${inputCls} ${errCls("SeatingCapacity")}`} />
                            {errors.SeatingCapacity && <p className="mt-1 text-xs text-red-500">{errors.SeatingCapacity}</p>}
                        </Field>

                        <Field label="Engine Displacement" required>
                            <input id="field-engineDisplacement" type="text" name="engineDisplacement"
                                value={form.engineDisplacement} onChange={handleChange}
                                placeholder="e.g. 1197 cc"
                                className={`${inputCls} ${errCls("engineDisplacement")}`} />
                            {errors.engineDisplacement && <p className="mt-1 text-xs text-red-500">{errors.engineDisplacement}</p>}
                        </Field>

                        <Field label="Max Power" required>
                            <input id="field-MaxPower" type="text" name="MaxPower"
                                value={form.MaxPower} onChange={handleChange}
                                placeholder="e.g. 89 bhp @ 6000 rpm"
                                className={`${inputCls} ${errCls("MaxPower")}`} />
                            {errors.MaxPower && <p className="mt-1 text-xs text-red-500">{errors.MaxPower}</p>}
                        </Field>

                        <Field label="City Mileage" required>
                            <input id="field-CityMileage" type="text" name="CityMileage"
                                value={form.CityMileage} onChange={handleChange}
                                placeholder="e.g. 22.38 km/l"
                                className={`${inputCls} ${errCls("CityMileage")}`} />
                            {errors.CityMileage && <p className="mt-1 text-xs text-red-500">{errors.CityMileage}</p>}
                        </Field>

                        <Field label="Boot Space" required>
                            <input id="field-BootSpace" type="text" name="BootSpace"
                                value={form.BootSpace} onChange={handleChange}
                                placeholder="e.g. 268 L"
                                className={`${inputCls} ${errCls("BootSpace")}`} />
                            {errors.BootSpace && <p className="mt-1 text-xs text-red-500">{errors.BootSpace}</p>}
                        </Field>

                        <Field label="Monthly EMI (₹)" required>
                            <input id="field-MonthlyEMI" type="number" name="MonthlyEMI"
                                value={form.MonthlyEMI} onChange={handleChange}
                                placeholder="e.g. 8500" min="0"
                                className={`${inputCls} ${errCls("MonthlyEMI")}`} />
                            {errors.MonthlyEMI && <p className="mt-1 text-xs text-red-500">{errors.MonthlyEMI}</p>}
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 3: Normal Pricing ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Normal (Non-BH) Pricing (₹)</SectionTitle>

                        {[
                            { name: "CSDPrice", label: "CSD Price" },
                            { name: "OnRoadPrice", label: "On Road Price" },
                            { name: "ExShowroomPrice", label: "Ex-Showroom Price" },
                            { name: "RTO", label: "RTO" },
                            { name: "Insurance", label: "Insurance" },
                            { name: "FastTagFee", label: "FASTag Fee" },
                            { name: "HPEndorsementFee", label: "HP Endorsement Fee" },
                            { name: "HSRPSMartCardTemporaryFee", label: "HSRP / Smart Card / Temp Fee" },
                        ].map(({ name, label }) => (
                            <Field key={name} label={label} required>
                                <input id={`field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={`${inputCls} ${errCls(name)}`} />
                                {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                            </Field>
                        ))}

                        {/* Registration Fee — String in schema */}
                        <Field label="Registration Fee" required>
                            <input id="field-RegistraionFee" type="text" name="RegistraionFee"
                                value={form.RegistraionFee} onChange={handleChange}
                                placeholder="e.g. Inclusive / 5500"
                                className={`${inputCls} ${errCls("RegistraionFee")}`} />
                            {errors.RegistraionFee && <p className="mt-1 text-xs text-red-500">{errors.RegistraionFee}</p>}
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 4: BH Pricing ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>BH Series Pricing (₹)</SectionTitle>

                        {[
                            { name: "BHOnRoadPrice", label: "BH On Road Price" },
                            { name: "ExShowroomPriceBH", label: "BH Ex-Showroom Price" },
                            { name: "civilExShowroomPrice", label: "Civil Ex-Showroom Price" },
                            { name: "BHRegistrationCost", label: "BH Registration Cost" },
                            { name: "BHInsurance", label: "BH Insurance" },
                            { name: "BHRegistrationFee", label: "BH Registration Fee" },
                            { name: "BHFastTagFee", label: "BH FASTag Fee" },
                            { name: "BHHPEndorsementFee", label: "BH HP Endorsement Fee" },
                            { name: "BHHSRPSMartCardTemporaryFee", label: "BH HSRP / Smart Card / Temp Fee" },
                        ].map(({ name, label }) => (
                            <Field key={name} label={label} required>
                                <input id={`field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={`${inputCls} ${errCls(name)}`} />
                                {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                            </Field>
                        ))}
                    </div>
                </div>

                {/* ═══ SECTION 5: Description & Remarks ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm space-y-5">
                    <div className="border-b border-[#708ca4]/20 pb-2">
                        <h3 className="text-base font-bold text-[#19456d]">Description & Remarks</h3>
                    </div>

                    <Field label="Car Details" required>
                        <textarea id="field-details" name="details" rows={4}
                            value={form.details} onChange={handleChange}
                            placeholder="Describe the car variant, features, and any important notes (min 10 characters)…"
                            className={`${inputCls} resize-none ${errCls("details")}`} />
                        {errors.details && <p className="mt-1 text-xs text-red-500">{errors.details}</p>}
                    </Field>

                    <Field label="Remarks">
                        <textarea id="field-Remarks" name="Remarks" rows={2}
                            value={form.Remarks} onChange={handleChange}
                            placeholder="Disclaimer / additional remarks…"
                            className={`${inputCls} resize-none`} />
                    </Field>
                </div>

                {/* ═══ SECTION 6: Car Images ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="border-b border-[#708ca4]/20 pb-2 mb-5">
                        <h3 className="text-base font-bold text-[#19456d]">Car Images</h3>
                        <p className="text-xs text-[#708ca4] mt-1">Upload up to 10 images. First image will be used as the main thumbnail.</p>
                    </div>

                    {/* Image Previews Grid */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                            {imagePreviews.map((src, idx) => (
                                <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#708ca4]/30 aspect-square bg-white">
                                    <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                    {idx === 0 && (
                                        <span className="absolute top-1 left-1 bg-[#19456d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">MAIN</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
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
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium
                                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                                hover:file:bg-[#19456d]/20 cursor-pointer focus:outline-none focus:ring-1
                                ${errors.carImages ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "border-[#708ca4]/40 focus:border-[#19456d] focus:ring-[#19456d]"}`}
                        />
                        {errors.carImages && <p className="text-xs text-red-500">{errors.carImages}</p>}
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
                                Uploading Car…
                            </div>
                        ) : (
                            <span>🚗 Add Car to Catalogue</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCars;