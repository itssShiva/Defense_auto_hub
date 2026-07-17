import React, { useState, useRef, useEffect } from "react";
import { useCars } from "../../cars/hooks/useCars";
import { getAllBrands, createBrand } from "../../brand/api/brand.api";
import { toast } from "react-hot-toast";
import CustomSelect from "../components/CustomSelect.jsx";

const VEHICLE_TYPES = [
    "Car", "Bike", "Scooter", "Truck",
    "Commercial", "Pickup", "Van", "Electric"
];

/* ─── Initial form state ────────────────────────────────────────── */
const INITIAL = {
    brandId: "",
    brandName: "",
    vehicleName: "",
    vehicleType: "",
    category: "",
    description: "",
    // Powertrain
    fuelType: "",
    transmissionType: "",
    engine: "",
    maxPower: "",
    maxTorque: "",
    mileage: "",
    // Dimensions
    seatingCapacity: "",
    bootSpace: "",
    bodyType: "",
    fuelTankCapacity: "",
    groundClearance: "",
    length: "",
    width: "",
    height: "",
    wheelbase: "",
    // CSD
    IndexNo: "",
    Entitlement: "",
    // Normal Pricing
    CSDPrice: "",
    OnRoadPrice: "",
    ExShowroomPrice: "",
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
    Remarks: "Please verify the details with vehicle dealer before placing order on CSD AFD Portal.",
    details: "",
};

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

const SectionTitle = ({ children }) => (
    <div className="col-span-full mb-1 border-b border-[#708ca4]/20 pb-2">
        <h3 className="text-base font-bold text-[#19456d]">{children}</h3>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const AddCars = () => {
    const { addVehicle } = useCars();
    const [form, setForm] = useState(INITIAL);
    const [vehicleImages, setVehicleImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isOtherBrand, setIsOtherBrand] = useState(false);
    const [customBrandName, setCustomBrandName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await getAllBrands();
                if (res?.success) {
                    setBrands(res.brands || []);
                }
            } catch (err) {
                console.error("Failed to fetch brands", err);
            }
        };
        fetchBrands();
    }, []);

    /* ── Two-way binding handler ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ── Image handler ── */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const badType = files.filter(f => !ALLOWED.includes(f.type));
        if (badType.length > 0) {
            toast.error(`Unsupported image type: ${[...new Set(badType.map(f => f.name.split('.').pop().toUpperCase()))].join(', ')}. Only JPEG, PNG and WEBP are allowed.`);
        }
        const typeOk = files.filter(f => ALLOWED.includes(f.type));
        const oversized = typeOk.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) {
            toast.error(`${oversized.length} file(s) exceed 5 MB and were skipped.`);
        }
        const valid = typeOk.filter(f => f.size <= 5 * 1024 * 1024);
        if (!valid.length) { e.target.value = ""; return; }
        setVehicleImages(prev => [...prev, ...valid]);
        setImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
        if (errors.vehicleImages) setErrors(prev => ({ ...prev, vehicleImages: "" }));
        e.target.value = ""; // allow re-selecting same files
    };

    const removeImage = (idx) => {
        setVehicleImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── Client-side validation ── */
    const validate = () => {
        const newErrors = {};
        const requiredTextFields = ["brandId", "vehicleName", "vehicleType", "category"];

        requiredTextFields.forEach((f) => {
            if (!form[f]?.trim()) newErrors[f] = "This field is required.";
        });
        if (!vehicleImages.length) newErrors.vehicleImages = "At least one vehicle image is required.";
        if (vehicleImages.length > 10) newErrors.vehicleImages = "Maximum 10 images allowed.";

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
            document.getElementById(`field-${firstErrorKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setLoading(true);

        try {
            // Handle creating new brand if 'Others' is selected
            if (isOtherBrand) {
                if (!customBrandName.trim()) {
                    toast.error("Please enter the custom brand name.");
                    setLoading(false);
                    return;
                }
                const brandFormData = new FormData();
                brandFormData.append("brandName", customBrandName.trim());
                brandFormData.append("brandCountry", "Unknown"); // Default for now

                const brandRes = await createBrand(brandFormData);
                if (brandRes?.success) {
                    setForm(prev => ({ ...prev, brandId: brandRes.brand._id, brandName: brandRes.brand.brandName }));

                    // Add to brands list locally so we have it
                    setBrands(prev => [...prev, brandRes.brand]);
                } else {
                    toast.error(brandRes?.message || "Failed to create custom brand.");
                    setLoading(false);
                    return;
                }
            }

            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });
            vehicleImages.forEach((img) => {
                formData.append("vehicleImages", img);
            });
            const response = await addVehicle(formData);

            if (response?.success) {
                // Reset form
                setForm(INITIAL);
                setVehicleImages([]);
                setImagePreviews([]);
                setErrors({});
                setIsOtherBrand(false);
                setCustomBrandName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ── Reset form ── */
    const handleReset = () => {
        setForm(INITIAL);
        setVehicleImages([]);
        setImagePreviews([]);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const errCls = (field) => ""; // Deprecated, kept for no breaking

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">Add New Vehicle</h2>
                <p className="text-[#708ca4]">
                    Fill in the core identity details to add a new vehicle to the catalogue.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* ═══ SECTION 1: Car Identity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Vehicle Identity</SectionTitle>

                        {/* Brand */}
                        <Field label="Brand" required error={errors.brandId}>
                            <CustomSelect
                                id="field-brandId"
                                name="brandId"
                                value={form.brandId}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value === "others") {
                                        setIsOtherBrand(true);
                                    } else {
                                        setIsOtherBrand(false);
                                        const selectedBrand = brands.find(b => b._id === e.target.value);
                                        if (selectedBrand) setForm(p => ({ ...p, brandName: selectedBrand.brandName }));
                                    }
                                }}
                                error={errors.brandId}
                                placeholder="Select a Brand"
                                options={[
                                    ...brands.map(b => ({ value: b._id, label: b.brandName })),
                                    { value: "others", label: "Others" }
                                ]}
                            />

                            {isOtherBrand && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        placeholder="Enter new brand name"
                                        value={customBrandName}
                                        onChange={(e) => setCustomBrandName(e.target.value)}
                                        className={inputCls(!customBrandName.trim())}
                                    />
                                    {!customBrandName.trim() && <p className="mt-1 text-xs text-red-500 font-medium">Brand name is required.</p>}
                                </div>
                            )}
                        </Field>

                        {/* Vehicle Name */}
                        <Field label="Vehicle Name" required error={errors.vehicleName}>
                            <input id="field-vehicleName" type="text" name="vehicleName"
                                value={form.vehicleName} onChange={handleChange}
                                placeholder="e.g. Fortuner, Splendor"
                                className={inputCls(errors.vehicleName)} />
                        </Field>

                        {/* Vehicle Type */}
                        <Field label="Vehicle Type" required error={errors.vehicleType}>
                            <CustomSelect
                                id="field-vehicleType"
                                name="vehicleType"
                                value={form.vehicleType}
                                onChange={handleChange}
                                error={errors.vehicleType}
                                placeholder="Select Vehicle Type"
                                options={VEHICLE_TYPES.map(t => ({ value: t, label: t }))}
                            />
                        </Field>

                        {/* Category */}
                        <Field label="Category" required error={errors.category}>
                            <input id="field-category" type="text" name="category"
                                value={form.category} onChange={handleChange}
                                placeholder="e.g. SUV, Sedan, Cruiser"
                                className={inputCls(errors.category)} />
                        </Field>

                        {/* Description */}
                        <Field label="Description">
                            <textarea id="field-description" name="description"
                                value={form.description} onChange={handleChange}
                                rows="3" placeholder="Enter vehicle description..."
                                className={inputCls()}></textarea>
                        </Field>

                        {/* Entitlement */}
                        <Field label="Entitlement Category">
                            <input id="field-Entitlement" type="text" name="Entitlement"
                                value={form.Entitlement} onChange={handleChange}
                                className={inputCls()} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Powertrain ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Powertrain</SectionTitle>

                        <Field label="Fuel Type">
                            <CustomSelect
                                id="field-fuelType"
                                name="fuelType"
                                value={form.fuelType}
                                onChange={handleChange}
                                placeholder="Select Fuel Type"
                                options={[
                                    { value: "Petrol", label: "Petrol" },
                                    { value: "Diesel", label: "Diesel" },
                                    { value: "Electric", label: "Electric" },
                                    { value: "CNG", label: "CNG" },
                                    { value: "Hybrid", label: "Hybrid" },
                                    { value: "Mild Hybrid", label: "Mild Hybrid" },
                                    { value: "Strong Hybrid", label: "Strong Hybrid" },
                                ]}
                            />
                        </Field>

                        <Field label="Transmission Type">
                            <CustomSelect
                                id="field-transmissionType"
                                name="transmissionType"
                                value={form.transmissionType}
                                onChange={handleChange}
                                placeholder="Select Transmission"
                                options={[
                                    { value: "Manual", label: "Manual" },
                                    { value: "Automatic", label: "Automatic" },
                                    { value: "AMT", label: "AMT" },
                                    { value: "CVT", label: "CVT" },
                                    { value: "DCT", label: "DCT" },
                                    { value: "iMT", label: "iMT" },
                                ]}
                            />
                        </Field>

                        {[
                            { name: "engine", label: "Engine Displacement", placeholder: "e.g. 1498 cc" },
                            { name: "maxPower", label: "Max Power", placeholder: "e.g. 120 bhp @ 6600 rpm" },
                            { name: "maxTorque", label: "Max Torque", placeholder: "e.g. 143 Nm @ 4200 rpm" },
                            { name: "mileage", label: "Mileage", placeholder: "e.g. 22.4 km/l" },
                        ].map(({ name, label, placeholder }) => (
                            <Field key={name} label={label}>
                                <input id={`field-${name}`} type="text" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder={placeholder}
                                    className={inputCls()} />
                            </Field>
                        ))}
                    </div>
                </div>

                {/* ═══ SECTION 3: Dimensions & Capacity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Dimensions &amp; Capacity</SectionTitle>

                        <Field label="Body Type">
                            <input id="field-bodyType" type="text" name="bodyType"
                                value={form.bodyType} onChange={handleChange}
                                placeholder="e.g. SUV, Sedan, Hatchback"
                                className={inputCls()} />
                        </Field>

                        <Field label="Seating Capacity">
                            <input id="field-seatingCapacity" type="number" name="seatingCapacity"
                                value={form.seatingCapacity} onChange={handleChange}
                                placeholder="e.g. 5" min="1" max="20"
                                className={inputCls()} />
                        </Field>

                        {[
                            { name: "bootSpace", label: "Boot Space", placeholder: "e.g. 328 L" },
                            { name: "fuelTankCapacity", label: "Fuel Tank Capacity", placeholder: "e.g. 50 L" },
                            { name: "groundClearance", label: "Ground Clearance", placeholder: "e.g. 190 mm" },
                            { name: "length", label: "Length", placeholder: "e.g. 4270 mm" },
                            { name: "width", label: "Width", placeholder: "e.g. 1760 mm" },
                            { name: "height", label: "Height", placeholder: "e.g. 1635 mm" },
                            { name: "wheelbase", label: "Wheelbase", placeholder: "e.g. 2570 mm" },
                        ].map(({ name, label, placeholder }) => (
                            <Field key={name} label={label}>
                                <input id={`field-${name}`} type="text" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder={placeholder}
                                    className={inputCls()} />
                            </Field>
                        ))}
                    </div>
                </div>

                {/* ═══ SECTION 4: Normal Pricing ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Normal (Non-BH) Pricing</SectionTitle>

                        {[
                            { name: "CSDPrice", label: "CSD Price" },
                            { name: "OnRoadPrice", label: "On Road Price" },
                            { name: "ExShowroomPrice", label: "Ex-Showroom Price" },
                            { name: "Insurance", label: "Insurance" },
                            { name: "FastTagFee", label: "FASTag Fee" },
                            { name: "HPEndorsementFee", label: "HP Endorsement Fee" },
                            { name: "HSRPSMartCardTemporaryFee", label: "HSRP / Smart Card / Temp Fee" },
                            { name: "civilExShowroomPrice", label: "Civil Ex-Showroom Price" },
                            { name: "MonthlyEMI", label: "Monthly EMI" },
                        ].map(({ name, label }) => (
                            <Field key={name} label={`${label} (₹)`} error={errors[name]}>
                                <input id={`field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={inputCls(errors[name])} />
                            </Field>
                        ))}

                        <Field label="Registration Fee" error={errors.RegistraionFee}>
                            <input id="field-RegistraionFee" type="text" name="RegistraionFee"
                                value={form.RegistraionFee} onChange={handleChange}
                                placeholder="e.g. Inclusive / 5500"
                                className={inputCls(errors.RegistraionFee)} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION: BH Series Pricing ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>BH Series Pricing</SectionTitle>

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
                                <input id={`field-${name}`} type="number" name={name}
                                    value={form[name]} onChange={handleChange}
                                    placeholder="₹ 0" min="0"
                                    className={inputCls(errors[name])} />
                            </Field>
                        ))}
                    </div>
                </div>

                {/* ═══ SECTION: Additional Details ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 gap-5">
                        <SectionTitle>Additional Pricing Details</SectionTitle>

                        <Field label="Details" error={errors.details}>
                            <textarea id="field-details" name="details"
                                value={form.details} onChange={handleChange}
                                placeholder="Describe any pricing notes…"
                                rows={3}
                                className={`${inputCls(errors.details)} resize-none`} />
                        </Field>

                        <Field label="Remarks" error={errors.Remarks}>
                            <textarea id="field-Remarks" name="Remarks"
                                value={form.Remarks} onChange={handleChange}
                                placeholder="Disclaimer / additional remarks…"
                                rows={2}
                                className={`${inputCls(errors.Remarks)} resize-none`} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 3: Car Images ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="border-b border-[#708ca4]/20 pb-2 mb-5">
                        <h3 className="text-base font-bold text-[#19456d]">Vehicle Images</h3>
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
                            id="field-vehicleImages"
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium
                                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                                hover:file:bg-[#19456d]/20 cursor-pointer focus:outline-none focus:ring-1
                                ${errors.vehicleImages ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "border-[#708ca4]/40 focus:border-[#19456d] focus:ring-[#19456d]"}`}
                        />
                        {errors.vehicleImages && <p className="text-xs text-red-500">{errors.vehicleImages}</p>}
                        <p className="text-xs text-[#708ca4]">
                            Accepted formats: JPG, PNG, WEBP · Max 5 MB per image · Up to 10 images
                        </p>
                        {vehicleImages.length > 0 && (
                            <p className="text-xs font-semibold text-[#19456d]">✅ {vehicleImages.length} image(s) selected</p>
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
                                Saving...
                            </div>
                        ) : (
                            <span>🚗 Add Vehicle Entity</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCars;
