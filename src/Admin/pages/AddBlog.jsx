import React, { useState, useRef } from "react";
import { useBlog } from "../../blogs/hooks/useBlog";
import { toast } from "react-hot-toast";

/* ─── Initial form state ─────────────────────────────────────────── */
const INITIAL = {
    title: "",
    category: "",
    shortDescription: "",
    content: "",
};

const CATEGORIES = [
    "Vehicle Reviews",
    "Buying Guide",
    "News",
    "Electric Vehicles",
    "Tips & Tricks",
    "Comparisons",
];

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
const AddBlog = () => {
    const { createBlog, loading } = useBlog();

    const [form, setForm] = useState(INITIAL);
    const [blogImages, setBlogImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    /* ── Two-way binding ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ── Image Handler ── */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Validations
        const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length) toast.error(`${oversized.length} file(s) exceed 5 MB.`);

        const valid = files.filter(f => f.size <= 5 * 1024 * 1024 && f.type.startsWith("image/"));
        if (!valid.length) { e.target.value = ""; return; }

        setBlogImages(prev => [...prev, ...valid]);
        setImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
        e.target.value = "";

        if (errors.blogImages) setErrors(prev => ({ ...prev, blogImages: "" }));
    };

    const removeImage = (idx) => {
        setBlogImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── Client Validation ── */
    const validate = () => {
        const newErrors = {};

        if (!form.title.trim()) newErrors.title = "Blog title is required.";
        if (!form.category) newErrors.category = "Please select a category.";
        if (!form.content.trim()) newErrors.content = "Blog content is required.";

        if (!form.shortDescription.trim()) {
            newErrors.shortDescription = "Short description is required.";
        } else if (form.shortDescription.length > 300) {
            newErrors.shortDescription = "Description cannot exceed 300 characters.";
        }

        if (!blogImages.length) {
            newErrors.blogImages = "At least one blog image is required.";
        } else if (blogImages.length > 5) {
            newErrors.blogImages = "Maximum 5 images allowed.";
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
            const firstKey = Object.keys(validationErrors)[0];
            document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        blogImages.forEach(img => formData.append("blogImages", img));

        const res = await createBlog(formData);
        if (res?.success) {
            // Toast is handled in useBlog, so we just clear form
            handleReset();
            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    /* ── Reset ── */
    const handleReset = () => {
        setForm(INITIAL);
        setBlogImages([]);
        setImagePreviews([]);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-[#19456d] mb-2">Add New Blog Post</h2>
                <p className="text-[#708ca4]">Create a new blog article and publish it to the platform.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ═══ SECTION 1: Basic Information ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="flex flex-col gap-5">
                        <SectionTitle icon="📝">Blog Details</SectionTitle>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Blog Title" required error={errors.title}>
                                <input
                                    id="field-title"
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Top 10 Electric Vehicles in 2026"
                                    className={inputCls(errors.title)}
                                />
                            </Field>

                            <Field label="Category" required error={errors.category}>
                                <select
                                    id="field-category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={inputCls(errors.category)}
                                >
                                    <option value="">Select a Category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="Short Description (Max 300 chars)" required error={errors.shortDescription}>
                            <textarea
                                id="field-shortDescription"
                                name="shortDescription"
                                value={form.shortDescription}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Write a brief excerpt or summary of the blog..."
                                className={`${inputCls(errors.shortDescription)} resize-none`}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {form.shortDescription.length} / 300
                            </div>
                        </Field>

                        <Field label="Full Blog Content" required error={errors.content}>
                            <textarea
                                id="field-content"
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                rows="12"
                                placeholder="Write the complete blog content here..."
                                className={`${inputCls(errors.content)}`}
                            />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Images ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <SectionTitle icon="🖼️">Blog Images</SectionTitle>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                            {imagePreviews.map((src, idx) => (
                                <div key={idx} className="relative group aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                        title="Remove Image"
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div id="field-blogImages" className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${errors.blogImages ? 'border-red-400 bg-red-50/50' : 'border-[#708ca4]/30 hover:border-[#19456d] bg-white'}`}>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            id="blog-image-upload"
                        />
                        <label htmlFor="blog-image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-[#19456d]/10 text-[#19456d] rounded-full flex items-center justify-center text-2xl">
                                📸
                            </div>
                            <div>
                                <span className="font-bold text-[#19456d] hover:underline">Click to browse</span>
                                <span className="text-[#708ca4]"> or drag images here</span>
                            </div>
                            <p className="text-xs text-[#708ca4]">JPG, PNG, WEBP • Max 5MB per file • Max 5 images</p>
                        </label>
                        {errors.blogImages && <p className="text-red-500 text-sm font-bold mt-2">{errors.blogImages}</p>}
                    </div>
                </div>

                {/* ═══ ACTIONS ═══ */}
                <div className="flex gap-4 sticky bottom-6 z-10 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="px-6 py-3 border-2 border-[#708ca4]/20 text-[#19456d] font-bold rounded-xl hover:bg-[#fafbf8] transition-colors"
                    >
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-[#19456d] text-white font-bold rounded-xl hover:bg-[#113150] transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Publishing Blog...
                            </>
                        ) : (
                            "Publish Blog"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBlog;
