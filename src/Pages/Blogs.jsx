import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlog } from '../blogs/hooks/useBlog';
import { Search, Calendar, ArrowRight, Loader2, BookOpen, Clock, ChevronRight } from 'lucide-react';

const CATEGORIES = [
    "All",
    "Car Reviews",
    "Buying Guide",
    "News",
    "Electric Vehicles",
    "Tips & Tricks",
    "Comparisons",
];

const Blogs = () => {
    const navigate = useNavigate();
    const { blogs, loading, fetchAllBlogs, fetchBlogsByCategory } = useBlog();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        if (activeCategory === "All") {
            fetchAllBlogs();
        } else {
            fetchBlogsByCategory(activeCategory);
        }
    }, [activeCategory, fetchAllBlogs, fetchBlogsByCategory]);

    const filteredBlogs = blogs?.filter(blog =>
        blog?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog?.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#b48001] selection:text-white">
            {/* Dynamic Hero Section with Abstract Background */}
            <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-[#19456d]">
                {/* Decorative background shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        className="absolute top-[20%] right-[10%] w-[60%] h-[60%] rounded-full bg-linear-to-br from-[#b48001]/30 to-transparent blur-3xl mix-blend-overlay"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
                        className="absolute -ottom-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-linear-to-tr from-blue-400/20 to-transparent blur-3xl mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold tracking-wider mb-6 backdrop-blur-md uppercase">
                            FoujiAdda Journal
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                            Discover the <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-yellow-300">Future</span><br /> of Driving
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto font-medium leading-relaxed">
                            Expert reviews, industry insights, and the ultimate guides to making your next automotive decision.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                {/* Advanced Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-2xl shadow-blue-900/5 border border-white/40 flex flex-col xl:flex-row justify-between items-center gap-6"
                >
                    {/* Animated Tab Bar */}
                    <div className="flex overflow-x-auto w-full lg:flex-1 hide-scrollbar gap-1 md:gap-2 px-1 items-center pb-2 lg:pb-0">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`relative px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors duration-300 z-10 shrink-0 ${activeCategory === category
                                    ? 'text-white'
                                    : 'text-[#19456d] hover:text-[#b48001] hover:bg-slate-50'
                                    }`}
                            >
                                {activeCategory === category && (
                                    <motion.div
                                        layoutId="activeCategoryIndicator"
                                        className="absolute inset-0 bg-linear-to-r from-[#19456d] to-[#2a629a] rounded-xl -z-10 shadow-md shadow-[#19456d]/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full lg:w-80 xl:w-96 group shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#b48001] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#b48001] focus:ring-4 focus:ring-[#b48001]/10 transition-all duration-300 outline-none text-slate-700 font-medium placeholder-slate-400 shadow-inner"
                        />
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="py-16">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 space-y-4">
                            <div className="relative w-16 h-16">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-[#b48001]" />
                            </div>
                            <p className="text-slate-500 font-semibold animate-pulse">Curating insights for you...</p>
                        </div>
                    ) : (
                        <>
                            {filteredBlogs.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                                >
                                    <AnimatePresence mode='popLayout'>
                                        {filteredBlogs.map((blog, idx) => (
                                            <motion.div
                                                key={blog._id}
                                                layout
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                                onClick={() => navigate(`/blogs/${blog._id}`)}
                                                className="group cursor-pointer bg-white rounded-3xl border border-[#708ca4]/30 p-5 hover:shadow-xl transition-shadow"
                                            >
                                                {/* Image */}
                                                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                                                    <img
                                                        src={blog.blogImages?.[0] || 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80'}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                    {/* Category pill */}
                                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold text-[#b48001] uppercase tracking-wider">
                                                        {blog.category}
                                                    </div>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mb-3 px-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-[#b48001]" />
                                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-[#b48001]" />
                                                        5 min read
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl font-bold text-[#19456d] mb-3 group-hover:text-[#b48001] transition-colors px-1 line-clamp-2">
                                                    {blog.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-[#19456d]/70 mb-4 line-clamp-2 px-1 leading-relaxed">
                                                    {blog.shortDescription}
                                                </p>

                                                {/* CTA */}
                                                <span className="text-[#b48001] font-bold flex items-center gap-2 group-hover:gap-3 transition-all px-1">
                                                    Read Article <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                /* Interactive Empty State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm"
                                >
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-[#b48001]/20 blur-2xl rounded-full" />
                                        <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-[#19456d]/5 border border-slate-100">
                                            <Search className="w-12 h-12 text-[#19456d]" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-slate-800 mb-3">No articles found</h3>
                                    <p className="text-slate-500 text-lg max-w-md mb-8">We couldn't find anything matching your current search or category filters.</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setActiveCategory("All"); setSearchTerm(""); }}
                                        className="px-8 py-4 bg-[#19456d] text-white rounded-2xl font-bold shadow-lg shadow-[#19456d]/30 hover:bg-[#123351] transition-colors flex items-center gap-2"
                                    >
                                        Clear all filters
                                    </motion.button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* CSS for hiding scrollbar in horizontal lists */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default Blogs;