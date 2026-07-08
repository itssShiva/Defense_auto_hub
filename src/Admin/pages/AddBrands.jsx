import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useBrand } from "../../brand/hooks/useBrand";

const INITIAL = {
    brandName: "",
    brandCountry: "",
};

const Field = ({ label, required, children }) => (
    <div className="group mb-4">
        <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium";

const AddBrands = () => {
    const { createBrand, loading } = useBrand();
    const [form, setForm] = useState(INITIAL);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!ALLOWED.includes(file.type)) {
            toast.error(`Unsupported file type: .${file.name.split('.').pop().toUpperCase()}. Only JPEG, PNG and WEBP are allowed.`);
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5 MB");
            e.target.value = "";
            return;
        }
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
        if (errors.logo) setErrors((prev) => ({ ...prev, logo: "" }));
    };

    const removeImage = () => {
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validate = () => {
        const newErrors = {};
        if (!form.brandName?.trim()) newErrors.brandName = "Brand Name is required.";
        if (!form.brandCountry?.trim()) newErrors.brandCountry = "Brand Country is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the highlighted errors before submitting.");
            return;
        }

        const toastId = toast.loading("Adding brand...");

        try {
            const formData = new FormData();
            formData.append("brandName", form.brandName);
            formData.append("brandCountry", form.brandCountry);
            if (logoFile) {
                formData.append("logo", logoFile);
            }

            // Using standard API but wrapped in hook
            const response = await createBrand(formData);

            if (response?.success) {
                toast.success(`Brand "${form.brandName}" added successfully!`, { id: toastId });
                handleReset();
            } else {
                toast.error(response?.message || "Failed to add brand.", { id: toastId });
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.", { id: toastId });
        }
    };

    const handleReset = () => {
        setForm(INITIAL);
        removeImage();
        setErrors({});
    };

    const errCls = (field) =>
        errors[field] ? "border-red-400 focus:border-red-500 focus:ring-red-400" : "";

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">Add New Brand</h2>
                <p className="text-[#708ca4]">
                    Add a new car brand to the system catalogue.
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6 bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">

                <Field label="Brand Name" required>
                    <input
                        type="text"
                        name="brandName"
                        value={form.brandName}
                        onChange={handleChange}
                        placeholder="e.g. Maruti Suzuki"
                        className={`${inputCls} ${errCls("brandName")}`}
                    />
                    {errors.brandName && <p className="mt-1 text-xs text-red-500">{errors.brandName}</p>}
                </Field>

                <Field label="Brand Country" required>
                    <input
                        type="text"
                        name="brandCountry"
                        value={form.brandCountry}
                        onChange={handleChange}
                        placeholder="e.g. Japan, India"
                        className={`${inputCls} ${errCls("brandCountry")}`}
                    />
                    {errors.brandCountry && <p className="mt-1 text-xs text-red-500">{errors.brandCountry}</p>}
                </Field>

                <div className="mb-5">
                    <h3 className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Brand Logo</h3>

                    {logoPreview && (
                        <div className="relative w-32 h-32 mb-4 group rounded-xl overflow-hidden border border-[#708ca4]/30 bg-white">
                            <img src={logoPreview} alt="preview" className="w-full h-full object-contain p-2" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow"
                            >✕</button>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#19456d] font-medium
                            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                            file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d]
                            hover:file:bg-[#19456d]/20 cursor-pointer focus:outline-none focus:ring-1`}
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl font-bold border-2 border-[#708ca4]/40 text-[#708ca4] hover:border-[#19456d] hover:text-[#19456d] transition-all disabled:opacity-50"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-[#19456d] hover:bg-[#113150] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex justify-center items-center min-w-[150px]"
                    >
                        {loading ? "Saving..." : "Add Brand"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBrands;
