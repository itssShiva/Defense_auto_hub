import React, { useState, useRef, useEffect } from "react";
import { useCars } from "../../cars/hooks/useCars";
import { getAllBrands, createBrand } from "../../brand/api/brand.api";
import { toast } from "react-hot-toast";

const VEHICLE_TYPES = [
    "Car", "Bike", "Scooter", "Truck",
    "Commercial", "Pickup", "Van", "Electric"
];

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
    // carId here means vehicleId
    const { fetchVehicleById, updateVehicle, loading } = useCars();

    const fileInputRef = useRef(null);
    const [form, setForm] = useState(null);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isOtherBrand, setIsOtherBrand] = useState(false);
    const [customBrandName, setCustomBrandName] = useState("");
    const [errors, setErrors] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await getAllBrands();
                if (res?.success) setBrands(res.brands || []);
            } catch (err) {
                console.error("Failed to fetch brands", err);
            }
        };
        fetchBrands();
    }, []);

    /* ── Load existing vehicle on mount ── */
    useEffect(() => {
        const load = async () => {
            setInitialLoading(true);
            const res = await fetchVehicleById(carId);
            if (res?.success && res.vehicle) {
                const v = res.vehicle;
                setForm({
                    brandId: v.brandId?._id || v.brandId || "",
                    brandName: v.brandId?.brandName || "",
                    vehicleName: v.vehicleName || "",
                    vehicleType: v.vehicleType || "",
                    category: v.category || "",
                    IndexNo: v.IndexNo || "",
                    Entitlement: v.Entitlement || "",
                    description: v.description || "",
                });
                if (v.vehicleImages?.length) {
                    setExistingImages(v.vehicleImages);
                }
            } else {
                toast.error("Failed to load vehicle details.");
                goBack();
            }
            setInitialLoading(false);
        };
        load();
    }, [carId, fetchVehicleById, goBack]);

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
        const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length) toast.error(`${oversized.length} file(s) exceed 5 MB and were skipped.`);

        const valid = files.filter(f => f.size <= 5 * 1024 * 1024 && f.type.startsWith("image/"));
        if (!valid.length) { e.target.value = ""; return; }

        setNewImages(prev => [...prev, ...valid]);
        setNewImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
        e.target.value = "";
    };

    const removeNewImage = (idx) => {
        setNewImages(prev => prev.filter((_, i) => i !== idx));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (idx) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── Client-side validation ── */
    const validate = () => {
        const newErrors = {};
        const requiredTextFields = ["brandId", "vehicleName", "vehicleType", "category"];

        requiredTextFields.forEach((f) => {
            if (!form[f]?.trim()) newErrors[f] = "This field is required.";
        });
        
        if (existingImages.length === 0 && newImages.length === 0) {
            newErrors.carImages = "At least one image is required.";
        }

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
        try {
            if (isOtherBrand) {
                if (!customBrandName.trim()) {
                    toast.error("Please enter the custom brand name.");
                    return;
                }
                const brandFormData = new FormData();
                brandFormData.append("brandName", customBrandName.trim());
                brandFormData.append("brandCountry", "Unknown");

                const brandRes = await createBrand(brandFormData);
                if (brandRes?.success) {
                    form.brandId = brandRes.brand._id;
                    form.brandName = brandRes.brand.brandName;

                    setBrands(prev => [...prev, brandRes.brand]);
                } else {
                    toast.error(brandRes?.message || "Failed to create custom brand.");
                    return;
                }
            }

            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            newImages.forEach(img => formData.append("vehicleImages", img));
            formData.append("existingImages", JSON.stringify(existingImages));

            const res = await updateVehicle(carId, formData);
            if (res?.success) {
                goBack();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update vehicle. Please try again.");
        }
    };

    const errCls = (field) =>
        errors[field] ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "";

    /* ── Loading skeleton ── */
    if (initialLoading) {
        return (
            <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19456d] mb-4"></div>
                <p className="text-[#708ca4] font-medium">Loading vehicle details…</p>
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
                    title="Back to All Vehicles"
                >
                    ← Back
                </button>
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d] mb-1">Edit Vehicle</h2>
                    <p className="text-[#708ca4] text-sm">
                        Updating: <span className="font-semibold text-[#b48001]">{form.vehicleName}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* ═══ SECTION 1: Car Identity ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <SectionTitle>Vehicle Identity</SectionTitle>

                        {/* Brand */}
                        <Field label="Brand" required>
                            <select id="field-brandId" name="brandId"
                                value={isOtherBrand ? "others" : form.brandId}
                                onChange={(e) => {
                                    if (e.target.value === "others") {
                                        setIsOtherBrand(true);
                                        setForm(prev => ({ ...prev, brandId: "", brandName: "" }));
                                    } else {
                                        setIsOtherBrand(false);
                                        const selectedBrand = brands.find(b => b._id === e.target.value);
                                        setForm(prev => ({
                                            ...prev,
                                            brandId: e.target.value,
                                            brandName: selectedBrand ? selectedBrand.brandName : ""
                                        }));
                                    }
                                    if (errors.brandId) setErrors(prev => ({ ...prev, brandId: "" }));
                                }}
                                className={`${inputCls} ${errCls("brandId")}`}>
                                <option value="">Select Brand</option>
                                {brands.map((b) => (
                                    <option key={b._id} value={b._id}>{b.brandName}</option>
                                ))}
                                <option value="others">Others (Add New)</option>
                            </select>
                            {errors.brandId && !isOtherBrand && <p className="mt-1 text-xs text-red-500">{errors.brandId}</p>}

                            {isOtherBrand && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        placeholder="Enter new brand name"
                                        value={customBrandName}
                                        onChange={(e) => setCustomBrandName(e.target.value)}
                                        className={`${inputCls} ${!customBrandName.trim() ? "border-red-400 focus:border-red-500 focus:ring-red-400" : ""}`}
                                    />
                                    {!customBrandName.trim() && <p className="mt-1 text-xs text-red-500">Brand name is required.</p>}
                                </div>
                            )}
                        </Field>

                        {/* Vehicle Name */}
                        <Field label="Vehicle Name" required>
                            <input id="edit-field-vehicleName" type="text" name="vehicleName"
                                value={form.vehicleName} onChange={handleChange}
                                placeholder="e.g. Fortuner"
                                className={`${inputCls} ${errCls("vehicleName")}`} />
                            {errors.vehicleName && <p className="mt-1 text-xs text-red-500">{errors.vehicleName}</p>}
                        </Field>

                        {/* Vehicle Type */}
                        <Field label="Vehicle Type" required>
                            <select id="edit-field-vehicleType" name="vehicleType"
                                value={form.vehicleType} onChange={handleChange}
                                className={`${inputCls} ${errCls("vehicleType")}`}>
                                <option value="">Select Type</option>
                                {VEHICLE_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.vehicleType && <p className="mt-1 text-xs text-red-500">{errors.vehicleType}</p>}
                        </Field>

                        {/* Category */}
                        <Field label="Category" required>
                            <input id="edit-field-category" type="text" name="category"
                                value={form.category} onChange={handleChange}
                                placeholder="e.g. Hatchback, SUV, Sedan"
                                className={`${inputCls} ${errCls("category")}`} />
                            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                        </Field>

                        {/* Index No */}
                        <Field label="Index No">
                            <input id="edit-field-IndexNo" type="text" name="IndexNo"
                                value={form.IndexNo} onChange={handleChange}
                                placeholder="e.g. CAR-001"
                                className={inputCls} />
                        </Field>

                        <Field label="Entitlement">
                            <input id="edit-field-Entitlement" type="text" name="Entitlement"
                                value={form.Entitlement} onChange={handleChange}
                                placeholder="e.g. Cat I, Cat II"
                                className={inputCls} />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Description ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm space-y-5">
                    <div className="border-b border-[#708ca4]/20 pb-2">
                        <h3 className="text-base font-bold text-[#19456d]">Description</h3>
                    </div>

                    <Field label="Vehicle Description">
                        <textarea id="edit-field-description" name="description" rows={4}
                            value={form.description} onChange={handleChange}
                            placeholder="Describe the vehicle..."
                            className={`${inputCls} resize-none`} />
                    </Field>
                </div>

                {/* ═══ SECTION 3: Car Images ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="border-b border-[#708ca4]/20 pb-2 mb-5 flex items-center gap-2">
                        <span className="text-lg">🖼️</span>
                        <div>
                            <h3 className="text-base font-bold text-[#19456d]">Vehicle Images (Optional to Update)</h3>
                            <p className="text-xs text-[#708ca4]">Upload multiple images. The first image will be used as the primary thumbnail.</p>
                        </div>
                    </div>

                    {/* Existing images */}
                    {existingImages.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Current Images</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {existingImages.map((src, idx) => {
                                    const imgSrc = src.startsWith("http") ? src : `${import.meta.env.VITE_BACKEND_URL}${src}`;
                                    return (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#708ca4]/30 aspect-square bg-white">
                                            <img src={imgSrc} alt={`existing-${idx}`} className="w-full h-full object-cover" />
                                            {idx === 0 && (
                                                <span className="absolute top-1 left-1 bg-[#19456d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">MAIN</span>
                                            )}
                                            <button type="button" onClick={() => removeExistingImage(idx)}
                                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold hidden group-hover:flex items-center justify-center shadow"
                                            >✕</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* New image previews */}
                    {newImagePreviews.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">New Images to Add</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {newImagePreviews.map((src, idx) => (
                                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-green-300 aspect-square bg-white">
                                        <img src={src} alt={`new-${idx}`} className="w-full h-full object-cover" />
                                        <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">NEW</span>
                                        <button type="button" onClick={() => removeNewImage(idx)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold hidden group-hover:flex items-center justify-center shadow"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <input
                            id="edit-field-carImages"
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 transition-all bg-white text-[#19456d] font-medium
                                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                                hover:file:bg-[#19456d]/20 cursor-pointer focus:outline-none focus:ring-1
                                focus:border-[#19456d] focus:ring-[#19456d]"
                        />
                        <p className="text-xs text-[#708ca4]">
                            Accepted formats: JPG, PNG, WEBP · Max size: 5 MB per image · Leave empty to keep current images
                        </p>
                        {errors.carImages && <p className="text-xs text-red-500">{errors.carImages}</p>}
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
