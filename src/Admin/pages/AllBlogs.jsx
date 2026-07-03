import React, { useState, useEffect } from "react";
import { useBlog } from "../../blogs/hooks/useBlog";

/* ─── Detail row for modal ─────────────────────────────────────── */
const DetailRow = ({ label, value, isContent }) => (
    <div className={`flex ${isContent ? 'flex-col gap-1' : 'justify-between items-start'} py-2.5 border-b border-gray-100 last:border-0`}>
        <span className="text-xs font-bold text-[#708ca4] uppercase tracking-wider shrink-0">{label}</span>
        <span className={`text-sm text-[#19456d] ${isContent ? 'whitespace-pre-wrap leading-relaxed' : 'font-medium text-right break-all'}`}>{value ?? "—"}</span>
    </div>
);

/* ─── Blog Detail Modal ─────────────────────────────────────────── */
const BlogModal = ({ blog, onClose }) => {
    if (!blog) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-linear-to-r from-[#19456d] to-[#2a6094] px-6 py-5 flex items-center gap-4 shrink-0">
                    <img
                        src={blog.blogImages?.[0] ? `${import.meta.env.VITE_BACKEND_URL}${blog.blogImages[0]}` : "https://via.placeholder.com/150"}
                        alt={blog.title}
                        className="w-20 h-14 rounded-xl object-cover border-2 border-white/30 shadow bg-white/10"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-extrabold text-white truncate">{blog.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 bg-[#b48001] text-white text-xs font-bold rounded-full">{blog.category}</span>
                            <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full text-lg font-bold transition shrink-0"
                    >✕</button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-4 space-y-4">
                    <div>
                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2">Blog Details</p>
                        <DetailRow label="Title" value={blog.title} />
                        <DetailRow label="Category" value={blog.category} />
                        <DetailRow label="Created At" value={new Date(blog.createdAt).toLocaleString()} />
                        <DetailRow label="Short Description" value={blog.shortDescription} />
                        <DetailRow label="Full Content" value={blog.content} isContent />
                    </div>

                    {/* Images Gallery */}
                    {blog.blogImages?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-2 mt-4">Images</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {blog.blogImages.map((img, idx) => (
                                    <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}${img}`} alt={`blog-img-${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════ */
const AllBlogs = ({ handleEditBlogClick }) => {
    const { blogs, loading, fetchAllBlogs, deleteBlog } = useBlog();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("All");

    useEffect(() => {
        fetchAllBlogs();
    }, [fetchAllBlogs]);

    const CATEGORIES = ["All", "Car Reviews", "Buying Guide", "News", "Electric Vehicles", "Tips & Tricks", "Comparisons"];

    const filtered = blogs.filter((b) => {
        const matchSearch =
            b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === "All" || b.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d]">All Blogs</h2>
                    <p className="text-[#708ca4] text-sm mt-1">
                        {blogs.length} blog{blogs.length !== 1 ? "s" : ""} published
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex gap-1 flex-wrap">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategoryFilter(c)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                                    categoryFilter === c
                                        ? "bg-[#19456d] text-white shadow-md"
                                        : "bg-white text-[#708ca4] border border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                        <input
                            type="text"
                            placeholder="Search title or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#19456d] focus:border-transparent w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#19456d]/20 border-t-[#b48001] rounded-full animate-spin"></div>
                    <p className="text-[#708ca4] font-medium mt-4 animate-pulse">Loading blogs...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <div className="text-4xl mb-3 opacity-50">📝</div>
                    <h3 className="text-[#19456d] font-bold text-lg mb-1">No Blogs Found</h3>
                    <p className="text-[#708ca4] text-sm">Try adjusting your search or category filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((b) => (
                        <div key={b._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            {/* Card Header (Image) */}
                            <div className="h-48 bg-gray-100 relative group overflow-hidden">
                                {b.blogImages?.[0] ? (
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}${b.blogImages[0]}`}
                                        alt={b.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">📝</div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className="bg-[#b48001] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-md">
                                        {b.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-[#19456d] font-extrabold text-lg line-clamp-1 mb-1" title={b.title}>
                                    {b.title}
                                </h3>
                                <p className="text-[#708ca4] text-xs font-medium mb-3">
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                    {b.shortDescription}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setSelectedBlog(b)}
                                        className="flex-1 py-2 text-xs font-bold text-[#19456d] bg-[#19456d]/5 hover:bg-[#19456d]/10 rounded-lg transition-colors flex justify-center items-center gap-1.5"
                                    >
                                        <span>👁️</span> Details
                                    </button>
                                    <button
                                        onClick={() => handleEditBlogClick(b._id)}
                                        className="w-10 h-10 flex items-center justify-center text-[#19456d] hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border border-gray-200"
                                        title="Edit Blog"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this blog?")) {
                                                deleteBlog(b._id);
                                            }
                                        }}
                                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-200"
                                        title="Delete Blog"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
        </div>
    );
};

export default AllBlogs;
