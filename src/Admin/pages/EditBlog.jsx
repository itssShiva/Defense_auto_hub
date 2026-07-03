import React, { useState, useRef, useEffect } from "react";
import { useBlog } from "../../blogs/hooks/useBlog";
import { toast } from "react-hot-toast";

const CATEGORIES = [
    "Car Reviews",
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
const EditBlog = ({ blogId, goBack }) => {
    const { updateBlog, fetchOneBlog, loading } = useBlog();

    const [form, setForm] = useState({
        title: "",
        category: "",
        shortDescription: "",
        content: ""
    });

    // Existing images coming from DB
    const [existingImages, setExistingImages] = useState([]);

    // Newly uploaded images
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const [errors, setErrors] = useState({});
    const [fetching, setFetching] = useState(true);
    const fileInputRef = useRef(null);

    /* ── Load initial data ── */
    useEffect(() => {
        const loadBlog = async () => {
            if (!blogId) return;
            setFetching(true);
            const res = await fetchOneBlog(blogId);
            if (res?.success && res.data) {
                const b = res.data;
                setForm({
                    title: b.title || "",
                    category: b.category || "",
                    shortDescription: b.shortDescription || "",
                    content: b.content || ""
                });
                setExistingImages(b.blogImages || []);
            } else {
                goBack();
            }
            setFetching(false);
        };
        loadBlog();
    }, [blogId, fetchOneBlog, goBack]);

    /* ── Two-way binding ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ── Existing Image Handler ── */
    const removeExistingImage = (idx) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── New Image Handler ── */
    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Validations
        const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
        if (oversized.length) toast.error(`${oversized.length} file(s) exceed 5 MB.`);

        const valid = files.filter(f => f.size <= 5 * 1024 * 1024 && f.type.startsWith("image/"));
        if (!valid.length) { e.target.value = ""; return; }

        setNewImages(prev => [...prev, ...valid]);
        setNewImagePreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
        e.target.value = "";

        if (errors.images) setErrors(prev => ({ ...prev, images: "" }));
    };

    const removeNewImage = (idx) => {
        setNewImages(prev => prev.filter((_, i) => i !== idx));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
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

        const totalImages = existingImages.length + newImages.length;
        if (totalImages === 0) {
            newErrors.images = "At least one blog image is required.";
        } else if (totalImages > 5) {
            newErrors.images = "Maximum 5 images allowed in total.";
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

        // Append existing images array as a JSON string so backend knows which ones to keep
        formData.append("existingImages", JSON.stringify(existingImages));

        // Append newly uploaded images
        newImages.forEach(img => formData.append("blogImages", img));

        const res = await updateBlog(blogId, formData);
        if (res?.success) {
            goBack();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-[#19456d]/20 border-t-[#b48001] rounded-full animate-spin"></div>
                <p className="text-[#708ca4] font-medium mt-4 animate-pulse">Loading blog details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={goBack}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-[#19456d] rounded-xl hover:bg-gray-50 shadow-sm transition"
                >
                    ←
                </button>
                <div>
                    <h2 className="text-3xl font-extrabold text-[#19456d] mb-1">Edit Blog Post</h2>
                    <p className="text-[#708ca4]">Update the details of this blog post.</p>
                </div>
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
                                className={`${inputCls(errors.content)}`}
                            />
                        </Field>
                    </div>
                </div>

                {/* ═══ SECTION 2: Images ═══ */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <SectionTitle icon="🖼️">Manage Images</SectionTitle>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-3">Currently Published Images</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {existingImages.map((src, idx) => (
                                    <div key={idx} className="relative group aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                        <img src={`http://localhost:3000${src}`} alt={`existing-${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(idx)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                            title="Remove Image"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images Previews */}
                    {newImagePreviews.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">New Images to Upload</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {newImagePreviews.map((src, idx) => (
                                    <div key={idx} className="relative group aspect-video bg-gray-100 rounded-xl overflow-hidden border border-green-200 shadow-sm shadow-green-100">
                                        <img src={src} alt={`new-${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(idx)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                            title="Remove New Image"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div id="field-images" className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${errors.images ? 'border-red-400 bg-red-50/50' : 'border-[#708ca4]/30 hover:border-[#19456d] bg-white'}`}>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleNewImageChange}
                            className="hidden"
                            id="blog-image-upload"
                        />
                        <label htmlFor="blog-image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-[#19456d]/10 text-[#19456d] rounded-full flex items-center justify-center text-2xl">
                                📸
                            </div>
                            <div>
                                <span className="font-bold text-[#19456d] hover:underline">Click to browse</span>
                                <span className="text-[#708ca4]"> or drag new images here</span>
                            </div>
                            <p className="text-xs text-[#708ca4]">Total active images must be between 1 and 5.</p>
                        </label>
                        {errors.images && <p className="text-red-500 text-sm font-bold mt-2">{errors.images}</p>}
                    </div>
                </div>

                {/* ═══ ACTIONS ═══ */}
                <div className="flex gap-4 sticky bottom-6 z-10 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={loading}
                        className="px-6 py-3 border-2 border-[#708ca4]/20 text-[#19456d] font-bold rounded-xl hover:bg-[#fafbf8] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-[#19456d] text-white font-bold rounded-xl hover:bg-[#113150] transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Updating Blog...
                            </>
                        ) : (
                            "Update Blog"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlog;
