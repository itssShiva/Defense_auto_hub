import React, { useState, useRef, useEffect } from "react";
import { useCars } from "../../cars/hooks/useCars.jsx";
import { useBrand } from "../../brand/hooks/useBrand.js";
import { toast } from "react-hot-toast";

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
const EditVariants = ({ variantId, handleBack }) => {
    const { updateVariant, fetchVariantById, fetchVehiclesByBrandId, fetchModelsByVehicleId, vehicles, models, loading } = useCars();

    const [form, setForm] = useState(null);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [pageLoading, setPageLoading] = useState(true);
    const fileInputRef = useRef(null);

    const { getAllBrands } = useBrand();
    const [brands, setBrands] = useState([]);
    
    useEffect(() => {
        const fetchBrands = async () => {
            const res = await getAllBrands();
            if (res?.success && res.brands) {
                setBrands(res.brands);
            }
        };
        fetchBrands();
    }, [getAllBrands]);

    /* ── Load car models & variant data ── */
    useEffect(() => {
        const load = async () => {
            setPageLoading(true);

            if (variantId) {
                const variantRes = await fetchVariantById(variantId);
                if (variantRes?.success && variantRes.variant) {
                    const v = variantRes.variant;
                    const bId = v.brandId?._id || v.brandId || "";
                    const vId = v.vehicleId?._id || v.vehicleId || "";
                    const mId = v.modelId?._id || v.modelId || "";

                    if (bId) await fetchVehiclesByBrandId(bId);
                    if (vId) await fetchModelsByVehicleId(vId);

                    setForm({
                        brandId: bId,
                        vehicleId: vId,
                        modelId: mId,
                        variantName: v.variantName || "",
                        fuelType: v.fuelType || "",
                        transmissionType: v.transmissionType || "",
                        engine: v.engine || "",
                        maxPower: v.maxPower || "",
                        maxTorque: v.maxTorque || "",
                        mileage: v.mileage || "",
                        seatingCapacity: v.seatingCapacity || "",
                        bootSpace: v.bootSpace || "",
                        bodyType: v.bodyType || "",
                        // Normal Pricing
                        CSDPrice: v.CSDPrice || "",
                        OnRoadPrice: v.OnRoadPrice || "",
                        ExShowroomPrice: v.ExShowroomPrice || "",
                        RTO: v.RTO || "",
                        Insurance: v.Insurance || "",
                        RegistraionFee: v.RegistraionFee || "",
                        FastTagFee: v.FastTagFee || "",
                        HPEndorsementFee: v.HPEndorsementFee || "",
                        HSRPSMartCardTemporaryFee: v.HSRPSMartCardTemporaryFee || "",
                        // BH Pricing
                        BHOnRoadPrice: v.BHOnRoadPrice || "",
                        ExShowroomPriceBH: v.ExShowroomPriceBH || "",
                        BHRegistrationCost: v.BHRegistrationCost || "",
                        BHInsurance: v.BHInsurance || "",
                        BHRegistrationFee: v.BHRegistrationFee || "",
                        BHFastTagFee: v.BHFastTagFee || "",
                        BHHPEndorsementFee: v.BHHPEndorsementFee || "",
                        BHHSRPSMartCardTemporaryFee: v.BHHSRPSMartCardTemporaryFee || "",
                        // Other Pricing
                        civilExShowroomPrice: v.civilExShowroomPrice || "",
                        MonthlyEMI: v.MonthlyEMI || "",
                        // Additional
                        Entitlement: v.Entitlement || "",
                        Remarks: v.Remarks || "Please verify the details with vehicle dealer before placing order on CSD AFD Portal.",
                        features: v.features || "",
                        description: v.description || "",
                    });
                    if (v.variantImages?.length) {
                        setExistingImages(v.variantImages);
                    }
                } else {
                    toast.error("Could not load variant data.");
                    handleBack();
                }
            }
            setPageLoading(false);
        };
        load();
    }, [variantId, fetchVariantById, fetchVehiclesByBrandId, fetchModelsByVehicleId, handleBack]);

    /* ── Two-way binding & Cascade ── */
    const handleChange = async (e) => {
        const { name, value } = e.target;
        
        if (name === "brandId") {
            setForm((prev) => ({ ...prev, brandId: value, vehicleId: "", modelId: "" }));
            if (value) await fetchVehiclesByBrandId(value);
        } else if (name === "vehicleId") {
            setForm((prev) => ({ ...prev, vehicleId: value, modelId: "" }));
            if (value) await fetchModelsByVehicleId(value);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
        
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
        const errs = {};

        if (!form.brandId) errs.brandId = "Please select a brand.";
        if (!form.vehicleId) errs.vehicleId = "Please select a vehicle.";
        if (!form.modelId) errs.modelId = "Please select a vehicle model.";
        if (!form.variantName?.trim()) errs.variantName = "Variant name is required.";

        if (!form.fuelType) errs.fuelType = "Fuel type is required.";
        if (!form.transmissionType) errs.transmissionType = "Transmission type is required.";

        const textFields = ["engine", "maxPower", "mileage", "bootSpace", "bodyType"];
        textFields.forEach((f) => {
            if (!form[f]?.toString().trim()) errs[f] = "This field is required.";
        });

        // Seating capacity
        const seatsNum = Number(form.seatingCapacity);
        if (!form.seatingCapacity) {
            errs.seatingCapacity = "Seating capacity is required.";
        } else if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 20) {
            errs.seatingCapacity = "Must be a number between 1 and 20.";
        }

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
        // Always send all form fields so the backend receives a complete update
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        if (newImages.length) {
            newImages.forEach(img => formData.append("variantImages", img));
        }
        // Always send existingImages so backend knows which to keep
        formData.append("existingImages", JSON.stringify(existingImages));

        const res = await updateVariant(variantId, formData);
        if (res?.success) {
            handleBack();
        }
    };

    if (pageLoading || !form) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-10 h-10 border-4 border-[#19456d]/20 border-t-[#19456d] rounded-full animate-spin" />
                <p className="text-[#19456d] font-medium animate-pulse">Loading variant details...</p>
            </div>
        );
    }

    const selectedModel = models.find((m) => m._id === form.modelId) || null;

    return (
        <div className="max-w-4xl mx-auto relative">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                            ←
                        </button>
                        <h2 className="text-2xl font-extrabold text-[#19456d]">Edit Variant</h2>
                    </div>
                    <p className="text-[#708ca4] text-sm ml-11">
                        Update variant details and specifications.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* ═══ SECTION 1: Model Selection ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="grid grid-cols-1 gap-5">
                        <SectionTitle icon="🚗">Base Vehicle Model</SectionTitle>

                        <Field label="Brand" required error={errors.brandId}>
                            <select id="variant-field-brandId" name="brandId"
                                value={form.brandId} onChange={handleChange}
                                className={inputCls(errors.brandId)}>
                                <option value="">Select a Brand</option>
                                {brands.map(b => (
                                    <option key={b._id} value={b._id}>{b.brandName}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Vehicle Entity" required error={errors.vehicleId}>
                            <select id="variant-field-vehicleId" name="vehicleId"
                                value={form.vehicleId} onChange={handleChange}
                                disabled={!form.brandId}
                                className={inputCls(errors.vehicleId)}>
                                <option value="">{form.brandId ? "Select a Vehicle" : "Select Brand First"}</option>
                                {vehicles.map(v => (
                                    <option key={v._id} value={v._id}>{v.vehicleName}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Parent Model" required error={errors.modelId}>
                            <select id="variant-field-modelId" name="modelId"
                                value={form.modelId} onChange={handleChange}
                                className={inputCls(errors.modelId)}
                                disabled={!form.vehicleId}>
                                <option value="">{form.vehicleId ? "Select a Model" : "Select Vehicle First"}</option>
                                {models.map(m => (
                                    <option key={m._id} value={m._id}>
                                        {m.modelName} ({m.year})
                                    </option>
                                ))}
                            </select>
                        </Field>

                        {/* Preview card for selected model */}
                        {selectedModel && (
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#19456d]/20 shadow-sm">
                                <img
                                    src={selectedModel.carImages?.[0] || "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png"}
                                    alt={selectedModel.modelName}
                                    className="w-20 h-14 rounded-lg object-cover border border-gray-200"
                                />
                                <div>
                                    <p className="text-sm font-extrabold text-[#19456d]">
                                        {selectedModel.brandId?.brandName || ""} {selectedModel.vehicleId?.vehicleName || ""} {selectedModel.modelName}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        <span className="px-2 py-0.5 text-xs font-bold bg-[#19456d]/10 text-[#19456d] rounded-full">
                                            {selectedModel.fuelType}
                                        </span>
                                        <span className="px-2 py-0.5 text-xs font-bold bg-[#b48001]/10 text-[#b48001] rounded-full">
                                            {selectedModel.transmissionType}
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
                            <h3 className="text-base font-bold text-[#19456d]">Variant Images (Optional to Update)</h3>
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
                            id="variant-field-variantImages"
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
                            Accepted: JPG, PNG, WEBP · Max size: 5 MB per image · Leave empty to keep current images
                        </p>
                    </div>
                </div>

                {/* ═══ Action Buttons ═══ */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                    <button
                        type="button"
                        onClick={handleBack}
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
                                Updating Variant…
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

export default EditVariants;
