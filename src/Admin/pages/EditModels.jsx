import React, { useState, useRef, useEffect } from "react";
import { useCars } from "../../cars/hooks/useCars.jsx";
import { toast } from "react-hot-toast";

/* ─── Reusable field components ─────────────────────────────────── */
const Field = ({ label, required, error, children }) => (
    <div className="group flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[#708ca4] uppercase tracking-widest">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
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
const EditModels = ({ modelId, goBack }) => {
    const { fetchAllModels, updateModel, loading } = useCars();

    const [form, setForm] = useState({
        brandName: "",
        modelName: "",
        category: "",
        year: "",
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
        Remarks: "",
        details: "",
    });

    const [originalForm, setOriginalForm] = useState(null);
    const [carImage, setCarImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    /* ── Load existing data ── */
    useEffect(() => {
        const loadModel = async () => {
            if (!modelId) return;

            const res = await fetchAllModels();
            if (res?.success && res.models) {
                const existingModel = res.models.find((m) => m._id === modelId);
                if (existingModel) {
                    const initialValues = {
                        brandName: existingModel.brandName || "",
                        modelName: existingModel.modelName || "",
                        category: existingModel.category || "",
                        year: existingModel.year || "",
                        fuelType: existingModel.fuelType || "",
                        transmissionType: existingModel.transmissionType || "",
                        engine: existingModel.engine || "",
                        maxPower: existingModel.maxPower || "",
                        maxTorque: existingModel.maxTorque || "",
                        mileage: existingModel.mileage || "",
                        seatingCapacity: existingModel.seatingCapacity || "",
                        bootSpace: existingModel.bootSpace || "",
                        bodyType: existingModel.bodyType || "",
                        // Normal Pricing
                        CSDPrice: existingModel.CSDPrice ?? "",
                        OnRoadPrice: existingModel.OnRoadPrice ?? "",
                        ExShowroomPrice: existingModel.ExShowroomPrice ?? "",
                        RTO: existingModel.RTO ?? "",
                        Insurance: existingModel.Insurance ?? "",
                        RegistraionFee: existingModel.RegistraionFee || "",
                        FastTagFee: existingModel.FastTagFee ?? "",
                        HPEndorsementFee: existingModel.HPEndorsementFee ?? "",
                        HSRPSMartCardTemporaryFee: existingModel.HSRPSMartCardTemporaryFee ?? "",
                        // BH Pricing
                        BHOnRoadPrice: existingModel.BHOnRoadPrice ?? "",
                        ExShowroomPriceBH: existingModel.ExShowroomPriceBH ?? "",
                        BHRegistrationCost: existingModel.BHRegistrationCost ?? "",
                        BHInsurance: existingModel.BHInsurance ?? "",
                        BHRegistrationFee: existingModel.BHRegistrationFee ?? "",
                        BHFastTagFee: existingModel.BHFastTagFee ?? "",
                        BHHPEndorsementFee: existingModel.BHHPEndorsementFee ?? "",
                        BHHSRPSMartCardTemporaryFee: existingModel.BHHSRPSMartCardTemporaryFee ?? "",
                        // Other
                        civilExShowroomPrice: existingModel.civilExShowroomPrice ?? "",
                        MonthlyEMI: existingModel.MonthlyEMI ?? "",
                        // Additional
                        Entitlement: existingModel.Entitlement || "",
                        Remarks: existingModel.Remarks || "",
                        details: existingModel.details || "",
                    };
                    setForm(initialValues);
                    setOriginalForm(initialValues);
                    if (existingModel.carImage) {
                        setImagePreview(existingModel.carImage);
                    }
                } else {
                    toast.error("Model not found!");
                    if (goBack) goBack();
                }
            }
        };
        
        loadModel();
    }, [modelId, fetchAllModels, goBack]);

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
            toast.error("Image must be less than 5 MB.");
            e.target.value = "";
            return;
        }
        setCarImage(file);
        setImagePreview(URL.createObjectURL(file));
        if (errors.carImage) setErrors((prev) => ({ ...prev, carImage: "" }));
    };

    /* ── Client-side validation ── */
    const validate = () => {
        const errs = {};
        const textFields = [
            "brandName", "modelName", "category", "fuelType",
            "transmissionType", "engine", "maxPower", "maxTorque",
            "mileage", "bootSpace", "bodyType",
        ];
        textFields.forEach((f) => {
            if (!String(form[f])?.trim()) errs[f] = "This field is required.";
        });

        // Year
        const yearNum = Number(form.year);
        if (!form.year) {
            errs.year = "Year is required.";
        } else if (isNaN(yearNum) || yearNum < 1980 || yearNum > new Date().getFullYear() + 2) {
            errs.year = `Year must be between 1980 and ${new Date().getFullYear() + 2}.`;
        }

        // Seating capacity
        const seatsNum = Number(form.seatingCapacity);
        if (!form.seatingCapacity) {
            errs.seatingCapacity = "Seating capacity is required.";
        } else if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 20) {
            errs.seatingCapacity = "Must be a number between 1 and 20.";
        }

        // Note: Image is not required on edit, because they might keep the old one.

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
            document.getElementById(`model-field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const formData = new FormData();
        let hasChanges = false;

        if (originalForm) {
            Object.keys(form).forEach((key) => {
                // Compare current form value against the original
                if (String(form[key]) !== String(originalForm[key])) {
                    formData.append(key, form[key]);
                    hasChanges = true;
                }
            });
        }

        // Only append image if a new one was selected
        if (carImage) {
            formData.append("carImage", carImage);
            hasChanges = true;
        }

        if (!hasChanges) {
            toast("No changes were made.", { icon: "ℹ️" });
            if (goBack) goBack();
            return;
        }

        const res = await updateModel(modelId, formData);
        if (res?.success) {
            if (goBack) goBack();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <button
                            onClick={goBack}
                            className="p-1.5 rounded-lg bg-[#19456d]/5 text-[#19456d] hover:bg-[#19456d]/10 transition"
                            title="Go Back"
                        >
                            ←
                        </button>
                        <h2 className="text-2xl font-extrabold text-[#19456d]">Update Car Model</h2>
                    </div>
                    <p className="text-[#708ca4] text-sm ml-10">
                        Modify the details for this car model in the catalogue.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* ═══ SECTION 1: Identity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="🚗">Car Identity</SectionTitle>

                        <Field label="Brand Name" required error={errors.brandName}>
                            <input id="model-field-brandName" type="text" name="brandName"
                                value={form.brandName} onChange={handleChange}
                                placeholder="e.g. Maruti Suzuki, Tata, Hyundai"
                                className={inputCls(errors.brandName)} />
                        </Field>

                        <Field label="Model Name" required error={errors.modelName}>
                            <input id="model-field-modelName" type="text" name="modelName"
                                value={form.modelName} onChange={handleChange}
                                placeholder="e.g. Swift ZXI, Nexon XZ+"
                                className={inputCls(errors.modelName)} />
                        </Field>

                        <Field label="Category" required error={errors.category}>
                            <input id="model-field-category" type="text" name="category"
                                value={form.category} onChange={handleChange}
                                placeholder="e.g. Hatchback, SUV, Sedan"
                                className={inputCls(errors.category)} />
                        </Field>

                        <Field label="Body Type" required error={errors.bodyType}>
                            <input id="model-field-bodyType" type="text" name="bodyType"
                                value={form.bodyType} onChange={handleChange}
                                placeholder="e.g. 5-Door Hatchback"
                                className={inputCls(errors.bodyType)} />
                        </Field>

                        <Field label="Year" required error={errors.year}>
                            <input id="model-field-year" type="number" name="year"
                                value={form.year} onChange={handleChange}
                                placeholder={`e.g. ${new Date().getFullYear()}`}
                                min="1980" max={new Date().getFullYear() + 2}
                                className={inputCls(errors.year)} />
                        </Field>

                        <Field label="Price (₹)" required error={errors.price}>
                            <input id="model-field-price" type="number" name="price"
                                value={form.price} onChange={handleChange}
                                placeholder="e.g. 850000" min="0"
                                className={inputCls(errors.price)} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Powertrain ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="⚙️">Powertrain</SectionTitle>

                        <Field label="Fuel Type" required error={errors.fuelType}>
                            <select id="model-field-fuelType" name="fuelType"
                                value={form.fuelType} onChange={handleChange}
                                className={inputCls(errors.fuelType)}>
                                <option value="">Select Fuel Type</option>
                                {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Transmission Type" required error={errors.transmissionType}>
                            <select id="model-field-transmissionType" name="transmissionType"
                                value={form.transmissionType} onChange={handleChange}
                                className={inputCls(errors.transmissionType)}>
                                <option value="">Select Transmission</option>
                                {["Manual", "Automatic", "AMT", "CVT", "DCT"].map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Engine Displacement" required error={errors.engine}>
                            <input id="model-field-engine" type="text" name="engine"
                                value={form.engine} onChange={handleChange}
                                placeholder="e.g. 1197 cc"
                                className={inputCls(errors.engine)} />
                        </Field>

                        <Field label="Max Power" required error={errors.maxPower}>
                            <input id="model-field-maxPower" type="text" name="maxPower"
                                value={form.maxPower} onChange={handleChange}
                                placeholder="e.g. 89 bhp @ 6000 rpm"
                                className={inputCls(errors.maxPower)} />
                        </Field>

                        <Field label="Max Torque" required error={errors.maxTorque}>
                            <input id="model-field-maxTorque" type="text" name="maxTorque"
                                value={form.maxTorque} onChange={handleChange}
                                placeholder="e.g. 113 Nm @ 4200 rpm"
                                className={inputCls(errors.maxTorque)} />
                        </Field>

                        <Field label="Mileage" required error={errors.mileage}>
                            <input id="model-field-mileage" type="text" name="mileage"
                                value={form.mileage} onChange={handleChange}
                                placeholder="e.g. 22.38 km/l"
                                className={inputCls(errors.mileage)} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 3: Dimensions ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle icon="📐">Dimensions & Capacity</SectionTitle>

                        <Field label="Seating Capacity" required error={errors.seatingCapacity}>
                            <input id="model-field-seatingCapacity" type="number" name="seatingCapacity"
                                value={form.seatingCapacity} onChange={handleChange}
                                placeholder="e.g. 5" min="1" max="20"
                                className={inputCls(errors.seatingCapacity)} />
                        </Field>

                        <Field label="Boot Space" required error={errors.bootSpace}>
                            <input id="model-field-bootSpace" type="text" name="bootSpace"
                                value={form.bootSpace} onChange={handleChange}
                                placeholder="e.g. 268 L"
                                className={inputCls(errors.bootSpace)} />
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
                                <input id={`model-field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={inputCls(errors[name])} />
                            </Field>
                        ))}

                        <Field label="Registration Fee" error={errors.RegistraionFee}>
                            <input id="model-field-RegistraionFee" type="text" name="RegistraionFee"
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
                                <input id={`model-field-${name}`} type="number" name={name}
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
                            <input id="model-field-Entitlement" type="text" name="Entitlement"
                                value={form.Entitlement} onChange={handleChange}
                                placeholder="e.g. Cat I, Cat II"
                                className={inputCls(errors.Entitlement)} />
                        </Field>

                        <Field label="Details" error={errors.details}>
                            <textarea id="model-field-details" name="details"
                                value={form.details} onChange={handleChange}
                                placeholder="Describe the car model, features, and any important notes…"
                                rows={3}
                                className={`${inputCls(errors.details)} resize-none`} />
                        </Field>

                        <Field label="Remarks" error={errors.Remarks}>
                            <textarea id="model-field-Remarks" name="Remarks"
                                value={form.Remarks} onChange={handleChange}
                                placeholder="Disclaimer / additional remarks…"
                                rows={2}
                                className={`${inputCls(errors.Remarks)} resize-none`} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 7: Car Image ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="border-b border-[#708ca4]/20 pb-2 mb-5 flex items-center gap-2">
                        <span className="text-lg">🖼️</span>
                        <h3 className="text-base font-bold text-[#19456d]">Car Image (Optional to Update)</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Preview */}
                        <div className={`shrink-0 w-48 h-36 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all
                            ${imagePreview ? "border-[#19456d]/50 bg-white" : "border-[#708ca4]/30 bg-white/60"}
                            ${errors.carImage ? "border-red-400" : ""}`}>
                            {imagePreview
                                ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                : <div className="text-center p-4">
                                    <span className="text-4xl">🚗</span>
                                    <p className="text-xs text-[#708ca4] mt-1 font-medium">No image<br />selected</p>
                                </div>
                            }
                        </div>

                        {/* File input */}
                        <div className="flex-1 space-y-3">
                            <input
                                id="model-field-carImage"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium
                                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                    file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                                    hover:file:bg-[#19456d]/20 cursor-pointer focus:outline-none focus:ring-1
                                    ${errors.carImage
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                                        : "border-[#708ca4]/40 focus:border-[#19456d] focus:ring-[#19456d]"}`}
                            />
                            {errors.carImage && (
                                <p className="text-xs text-red-500 font-medium">{errors.carImage}</p>
                            )}
                            {carImage && (
                                <div className="flex items-center gap-2 text-sm text-[#52602d] font-medium">
                                    <span>✅</span>
                                    <span className="truncate max-w-xs">{carImage.name}</span>
                                    <span className="text-[#708ca4] shrink-0">({(carImage.size / 1024).toFixed(1)} KB)</span>
                                    <button type="button"
                                        onClick={() => {
                                            setCarImage(null);
                                            // Reset to original image if they cancel new upload
                                            const original = models.find(m => m._id === modelId)?.carImage;
                                            setImagePreview(original || null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        className="ml-auto text-red-400 hover:text-red-600 font-bold text-xs transition-colors shrink-0">
                                        ✕ Revert
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-[#708ca4]">
                                Accepted: JPG, PNG, WEBP · Max size: 5 MB (Leave empty to keep current image)
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
                                Updating Model…
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

export default EditModels;
