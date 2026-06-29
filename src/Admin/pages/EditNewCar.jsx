import React, { useState, useRef, useEffect } from "react";
import { useCars } from "../../cars/hooks/useCars.jsx";
import { toast } from "react-hot-toast";

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
const EditNewCar = ({ carId, goBack }) => {
    const { car, fetchCarById, updateCar, loading } = useCars();

    const fileInputRef = useRef(null);
    const [form, setForm] = useState(null);           // null until loaded
    const [carImage, setCarImage] = useState(null);   // new file (optional)
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);

    /* ── Load existing car on mount ── */
    useEffect(() => {
        const load = async () => {
            setInitialLoading(true);
            const res = await fetchCarById(carId);
            if (res?.success && res.car) {
                const c = res.car;
                setForm({
                    IndexNo: c.IndexNo || "",
                    Model: c.Model || "",
                    FuelType: c.FuelType || "",
                    TransmissionType: c.TransmissionType || "",
                    BodyType: c.BodyType || "",
                    Entitlement: c.Entitlement || "",
                    SeatingCapacity: c.SeatingCapacity ?? "",
                    engineDisplacement: c.engineDisplacement || "",
                    MaxPower: c.MaxPower || "",
                    CityMileage: c.CityMileage || "",
                    BootSpace: c.BootSpace || "",
                    CSDPrice: c.CSDPrice ?? "",
                    OnRoadPrice: c.OnRoadPrice ?? "",
                    ExShowroomPrice: c.ExShowroomPrice ?? "",
                    RTO: c.RTO ?? "",
                    Insurance: c.Insurance ?? "",
                    RegistraionFee: c.RegistraionFee || "",
                    FastTagFee: c.FastTagFee ?? "",
                    HPEndorsementFee: c.HPEndorsementFee ?? "",
                    HSRPSMartCardTemporaryFee: c.HSRPSMartCardTemporaryFee ?? "",
                    BHOnRoadPrice: c.BHOnRoadPrice ?? "",
                    ExShowroomPriceBH: c.ExShowroomPriceBH ?? "",
                    BHRegistrationCost: c.BHRegistrationCost ?? "",
                    BHInsurance: c.BHInsurance ?? "",
                    BHRegistrationFee: c.BHRegistrationFee ?? "",
                    BHFastTagFee: c.BHFastTagFee ?? "",
                    BHHPEndorsementFee: c.BHHPEndorsementFee ?? "",
                    BHHSRPSMartCardTemporaryFee: c.BHHSRPSMartCardTemporaryFee ?? "",
                    civilExShowroomPrice: c.civilExShowroomPrice ?? "",
                    MonthlyEMI: c.MonthlyEMI ?? "",
                    details: c.details || "",
                    Remarks: c.Remarks || "Please verify the details with car dealer before placing order on CSD AFD Portal.",
                });
                setImagePreview(c.carImage || null);
            } else {
                toast.error("Failed to load car details.");
                goBack();
            }
            setInitialLoading(false);
        };
        load();
    }, [carId]);

    /* ── Two-way binding ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ── Image handler ── */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Car image must be less than 5 MB.");
            e.target.value = "";
            return;
        }
        setCarImage(file);
        setImagePreview(URL.createObjectURL(file));
        if (errors.carImage) setErrors((prev) => ({ ...prev, carImage: "" }));
    };

    /* ── Client-side validation (only validates filled fields) ── */
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
            const firstErrorKey = Object.keys(validationErrors)[0];
            document.getElementById(`edit-field-${firstErrorKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (carImage) formData.append("carImage", carImage);

        const res = await updateCar(carId, formData);
        if (res?.success) {
            goBack();
        }
    };

    const errCls = (field) =>
        errors[field] ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "";

    /* ── Loading skeleton ── */
    if (initialLoading) {
        return (
            <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19456d] mb-4"></div>
                <p className="text-[#708ca4] font-medium">Loading car details…</p>
            </div>
        );
    }

    if (!form) return null;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={goBack}
                    className="p-2 rounded-xl border border-[#708ca4]/30 hover:border-[#19456d] text-[#708ca4] hover:text-[#19456d] transition-all"
                    title="Back to All Cars"
                >
                    ← Back
                </button>
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d] mb-1">Edit Car</h2>
                    <p className="text-[#708ca4] text-sm">
                        Updating: <span className="font-semibold text-[#b48001]">{form.Model}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* ═══ SECTION 1: Car Identity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Car Identity</SectionTitle>

                        <Field label="Index No" required>
                            <input id="edit-field-IndexNo" type="text" name="IndexNo"
                                value={form.IndexNo} onChange={handleChange}
                                placeholder="e.g. CAR-001"
                                className={`${inputCls} ${errCls("IndexNo")}`} />
                            {errors.IndexNo && <p className="mt-1 text-xs text-red-500">{errors.IndexNo}</p>}
                        </Field>

                        <Field label="Car Model" required>
                            <input id="edit-field-Model" type="text" name="Model"
                                value={form.Model} onChange={handleChange}
                                placeholder="e.g. Maruti Swift ZXI"
                                className={`${inputCls} ${errCls("Model")}`} />
                            {errors.Model && <p className="mt-1 text-xs text-red-500">{errors.Model}</p>}
                        </Field>

                        <Field label="Fuel Type" required>
                            <select id="edit-field-FuelType" name="FuelType"
                                value={form.FuelType} onChange={handleChange}
                                className={`${inputCls} ${errCls("FuelType")}`}>
                                <option value="">Select Fuel Type</option>
                                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                            {errors.FuelType && <p className="mt-1 text-xs text-red-500">{errors.FuelType}</p>}
                        </Field>

                        <Field label="Transmission Type" required>
                            <select id="edit-field-TransmissionType" name="TransmissionType"
                                value={form.TransmissionType} onChange={handleChange}
                                className={`${inputCls} ${errCls("TransmissionType")}`}>
                                <option value="">Select Transmission</option>
                                {["Manual", "Automatic", "AMT", "CVT", "DCT"].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.TransmissionType && <p className="mt-1 text-xs text-red-500">{errors.TransmissionType}</p>}
                        </Field>

                        <Field label="Body Type" required>
                            <input id="edit-field-BodyType" type="text" name="BodyType"
                                value={form.BodyType} onChange={handleChange}
                                placeholder="e.g. Hatchback, SUV, Sedan"
                                className={`${inputCls} ${errCls("BodyType")}`} />
                            {errors.BodyType && <p className="mt-1 text-xs text-red-500">{errors.BodyType}</p>}
                        </Field>

                        <Field label="Entitlement" required>
                            <input id="edit-field-Entitlement" type="text" name="Entitlement"
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
                            <input id="edit-field-SeatingCapacity" type="number" name="SeatingCapacity"
                                value={form.SeatingCapacity} onChange={handleChange}
                                placeholder="e.g. 5" min="1"
                                className={`${inputCls} ${errCls("SeatingCapacity")}`} />
                            {errors.SeatingCapacity && <p className="mt-1 text-xs text-red-500">{errors.SeatingCapacity}</p>}
                        </Field>

                        <Field label="Engine Displacement" required>
                            <input id="edit-field-engineDisplacement" type="text" name="engineDisplacement"
                                value={form.engineDisplacement} onChange={handleChange}
                                placeholder="e.g. 1197 cc"
                                className={`${inputCls} ${errCls("engineDisplacement")}`} />
                            {errors.engineDisplacement && <p className="mt-1 text-xs text-red-500">{errors.engineDisplacement}</p>}
                        </Field>

                        <Field label="Max Power" required>
                            <input id="edit-field-MaxPower" type="text" name="MaxPower"
                                value={form.MaxPower} onChange={handleChange}
                                placeholder="e.g. 89 bhp @ 6000 rpm"
                                className={`${inputCls} ${errCls("MaxPower")}`} />
                            {errors.MaxPower && <p className="mt-1 text-xs text-red-500">{errors.MaxPower}</p>}
                        </Field>

                        <Field label="City Mileage" required>
                            <input id="edit-field-CityMileage" type="text" name="CityMileage"
                                value={form.CityMileage} onChange={handleChange}
                                placeholder="e.g. 22.38 km/l"
                                className={`${inputCls} ${errCls("CityMileage")}`} />
                            {errors.CityMileage && <p className="mt-1 text-xs text-red-500">{errors.CityMileage}</p>}
                        </Field>

                        <Field label="Boot Space" required>
                            <input id="edit-field-BootSpace" type="text" name="BootSpace"
                                value={form.BootSpace} onChange={handleChange}
                                placeholder="e.g. 268 L"
                                className={`${inputCls} ${errCls("BootSpace")}`} />
                            {errors.BootSpace && <p className="mt-1 text-xs text-red-500">{errors.BootSpace}</p>}
                        </Field>

                        <Field label="Monthly EMI (₹)" required>
                            <input id="edit-field-MonthlyEMI" type="number" name="MonthlyEMI"
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
                                <input id={`edit-field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={`${inputCls} ${errCls(name)}`} />
                                {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                            </Field>
                        ))}

                        <Field label="Registration Fee" required>
                            <input id="edit-field-RegistraionFee" type="text" name="RegistraionFee"
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
                                <input id={`edit-field-${name}`} type="number" name={name}
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
                        <textarea id="edit-field-details" name="details" rows={4}
                            value={form.details} onChange={handleChange}
                            placeholder="Describe the car variant, features, and any important notes…"
                            className={`${inputCls} resize-none ${errCls("details")}`} />
                        {errors.details && <p className="mt-1 text-xs text-red-500">{errors.details}</p>}
                    </Field>

                    <Field label="Remarks">
                        <textarea id="edit-field-Remarks" name="Remarks" rows={2}
                            value={form.Remarks} onChange={handleChange}
                            placeholder="Disclaimer / additional remarks…"
                            className={`${inputCls} resize-none`} />
                    </Field>
                </div>

                {/* ═══ SECTION 6: Car Image ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="border-b border-[#708ca4]/20 pb-2 mb-5">
                        <h3 className="text-base font-bold text-[#19456d]">Car Image</h3>
                        <p className="text-xs text-[#708ca4] mt-1">Leave unchanged to keep the existing image.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Preview */}
                        <div className={`shrink-0 w-48 h-36 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all
                            ${imagePreview ? "border-[#19456d]/50 bg-white" : "border-[#708ca4]/30 bg-white/50"}`}>
                            {imagePreview
                                ? <img src={imagePreview} alt="Car preview" className="w-full h-full object-cover rounded-xl" />
                                : <div className="text-center p-4">
                                    <span className="text-4xl">🚗</span>
                                    <p className="text-xs text-[#708ca4] mt-1 font-medium">No image<br />selected</p>
                                </div>
                            }
                        </div>

                        {/* File input */}
                        <div className="flex-1 space-y-3">
                            <input
                                id="edit-field-carImage"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:ring-1 focus:ring-[#19456d] focus:border-[#19456d] transition-all bg-white text-[#19456d] font-medium
                                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                    file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                                    hover:file:bg-[#19456d]/20 cursor-pointer"
                            />
                            {carImage && (
                                <div className="flex items-center gap-2 text-sm text-[#52602d] font-medium">
                                    <span>✅</span>
                                    <span>{carImage.name}</span>
                                    <span className="text-[#708ca4]">({(carImage.size / 1024).toFixed(1)} KB)</span>
                                    <button type="button"
                                        onClick={() => {
                                            setCarImage(null);
                                            // Revert to original image from car object
                                            setImagePreview(car?.carImage || null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        className="ml-2 text-red-400 hover:text-red-600 font-bold text-xs transition-colors">
                                        ✕ Remove
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-[#708ca4]">
                                Accepted formats: JPG, PNG, WEBP · Max size: 5 MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═══ Action Buttons ═══ */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={loading}
                        className="px-6 py-3.5 rounded-xl font-bold border-2 border-[#708ca4]/40 text-[#708ca4] hover:border-[#19456d] hover:text-[#19456d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
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
                                Saving Changes…
                            </div>
                        ) : (
                            <span>💾 Save Changes</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditNewCar;