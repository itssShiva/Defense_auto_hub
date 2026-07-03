import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useBlog } from '../blogs/hooks/useBlog';
import { Calendar, ArrowLeft, Clock, Share2, Bookmark, User, ChevronRight, Link as LinkIcon, Eye, CarFront, Gauge, PhoneCall, ArrowUpRight, MessageCircle, Mail } from 'lucide-react';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentBlog, blogs, loading, fetchOneBlog, fetchAllBlogs } = useBlog();

    // Scroll progress for the main content area
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        if (id) {
            fetchOneBlog(id);
        }
        if (!blogs || blogs.length === 0) {
            fetchAllBlogs();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id, fetchOneBlog, fetchAllBlogs, blogs?.length]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafbf8] flex flex-col justify-center items-center">
                <div className="relative w-24 h-24">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-[#b48001]" />
                    <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-2 rounded-full border-4 border-slate-200 border-b-[#19456d]" />
                </div>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    className="mt-8 text-[#19456d] font-bold text-xl tracking-widest uppercase"
                >
                    Loading Experience...
                </motion.p>
            </div>
        );
    }

    if (!currentBlog) {
        return (
            <div className="min-h-screen bg-[#fafbf8] flex flex-col justify-center items-center pt-24 px-4 text-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full">
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-[#19456d] mb-4">Article Not Found</h2>
                    <p className="text-slate-500 mb-8 text-lg">The story you are looking for has vanished into thin air or has been moved.</p>
                    <button onClick={() => navigate('/blogs')} className="px-8 py-4 bg-[#19456d] text-white rounded-2xl font-bold shadow-lg hover:bg-[#b48001] hover:-translate-y-1 transition-all duration-300 w-full">
                        Return to Journal
                    </button>
                </motion.div>
            </div>
        );
    }

    // Filter blogs for the left sidebar (same category)
    const categoryBlogs = blogs?.filter(b => b.category === currentBlog.category) || [];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-[#eef4fb] to-[#fafbf8] font-sans selection:bg-[#b48001] selection:text-white relative flex flex-col lg:flex-row overflow-x-hidden">

            {/* Reading Progress */}
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#b48001] origin-left z-50 shadow-[0_0_10px_rgba(180,128,1,0.5)]" style={{ scaleX }} />

            {/* LEFT SIDEBAR: Category Blogs List */}
            <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 bg-linear-to-b from-[#19456d]/5 via-white to-white border-r border-[#19456d]/10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto custom-scrollbar z-40 flex flex-col">
                <div className="p-6 md:p-8 flex-1 overflow-hidden">
                    <motion.button
                        onClick={() => navigate('/blogs')}
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-slate-500 hover:text-[#b48001] font-bold mb-10 transition-colors group w-fit"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#b48001]/10 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="tracking-widest uppercase text-xs">Back to Articles</span>
                    </motion.button>

                    <div className="mb-8">
                        <span className="text-[#b48001] font-black uppercase tracking-[0.2em] text-xs">Explore</span>
                        <h2 className="text-3xl font-extrabold text-[#19456d] mt-2 wrap-break-words">More in {currentBlog.category}</h2>
                        <div className="w-12 h-1.5 bg-[#b48001] mt-4 rounded-full"></div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <AnimatePresence>
                            {categoryBlogs.map((blog, idx) => {
                                const isActive = blog._id === currentBlog._id;
                                return (
                                    <motion.div
                                        key={blog._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => navigate(`/blogs/${blog._id}`)}
                                        className={`group cursor-pointer rounded-2xl p-4 flex gap-4 transition-all duration-300 border overflow-hidden ${isActive
                                            ? 'bg-linear-to-br from-[#19456d] to-[#123351] border-[#19456d] shadow-xl shadow-[#19456d]/20 scale-[1.02]'
                                            : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 relative">
                                            <img src={blog.blogImages?.[0]} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                            {isActive && (
                                                <div className="absolute inset-0 bg-[#b48001]/20 backdrop-blur-[2px] flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-[#b48001] rounded-full flex items-center justify-center text-white shadow-lg">
                                                        <Eye className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center py-1 overflow-hidden">
                                            <h4 className={`font-bold text-sm sm:text-base leading-snug line-clamp-3 mb-2 transition-colors wrap-break-words ${isActive ? 'text-white' : 'text-[#19456d] group-hover:text-[#b48001]'
                                                }`}>
                                                {blog.title}
                                            </h4>
                                            <div className={`flex items-center gap-2 text-xs font-semibold ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                                                <Calendar className="w-3 h-3" />
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Main Article Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-linear-to-br from-[#eef4fb] via-slate-50 to-[#fafbf8] relative overflow-hidden">

                {/* Hero Banner for Right Column */}
                <div className="relative h-[50vh] min-h-[450px] w-full bg-[#19456d] overflow-hidden">
                    <motion.div initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0">
                        <img
                            src={currentBlog.blogImages?.[0] || 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1920&q=80'}
                            alt={currentBlog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-90" />
                        <div className="absolute inset-0 bg-[#19456d]/30 mix-blend-multiply" />
                    </motion.div>

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16 z-10 overflow-hidden">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm font-semibold mb-6 uppercase tracking-widest wrap-break-words">
                                <Link to="/" className="hover:text-[#b48001] transition-colors shrink-0">Home</Link>
                                <ChevronRight className="w-3 h-3 shrink-0" />
                                <span className="wrap-break-words">{currentBlog.category}</span>
                            </div>

                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#b48001] text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#b48001]/40 border border-[#b48001]/50 mb-6 wrap-break-words">
                                {currentBlog.category}
                            </span>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight drop-shadow-xl max-w-4xl wrap-break-words">
                                {currentBlog.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium border-t border-white/20 pt-6 max-w-4xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#b48001] to-yellow-500 p-0.5 shadow-lg shadow-[#b48001]/20 shrink-0">
                                        <div className="w-full h-full bg-[#19456d] rounded-full flex items-center justify-center border-2 border-[#19456d]">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-base">FoujiAdda Editorial</p>
                                        <p className="text-[#b48001] text-[10px] font-black uppercase tracking-widest">Verified Author</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/20 hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{new Date(currentBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        <p className="text-white/50 text-[10px] uppercase tracking-wider">Published</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">5 Min</p>
                                        <p className="text-white/50 text-[10px] uppercase tracking-wider">Read Time</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Gradient band between hero and article card */}
                <div className="h-8 bg-linear-to-b from-slate-900/30 to-transparent pointer-events-none -mt-8 relative z-10" />

                {/* Article Body */}
                <div className="flex-1 px-8 md:px-12 lg:px-16 py-12 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-linear-to-br from-white via-white to-[#f0f7ff] rounded-4xl shadow-2xl shadow-[#19456d]/10 border border-[#19456d]/10 p-8 md:p-14 -mt-24 relative overflow-hidden max-w-5xl mx-auto"
                    >
                        {/* Decorative gradient corners */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-bl from-[#b48001]/15 via-[#b48001]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-32 bg-linear-to-tr from-[#19456d]/8 to-transparent rounded-tr-full pointer-events-none"></div>

                        {/* Top Share Bar inside content */}
                        <div className="flex justify-between items-center pb-8 border-b border-slate-100 mb-10">
                            <div className="flex gap-3">
                                <span className="font-bold text-[#19456d] uppercase tracking-wider text-xs mr-2 self-center shrink-0">Share:</span>
                                {[MessageCircle, Share2, Mail, LinkIcon].map((Icon, idx) => (
                                    <button key={idx} className="w-10 h-10 rounded-full bg-slate-50 shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#b48001] hover:border-[#b48001] transition-colors shrink-0">
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#19456d] font-bold text-sm hover:border-[#19456d] hover:bg-[#19456d] hover:text-white transition-all group shrink-0">
                                <Bookmark className="w-4 h-4 group-hover:fill-current shrink-0" />
                                Save
                            </button>
                        </div>

                        {/* Excerpt */}
                        <div className="relative mb-14 bg-linear-to-r from-[#b48001]/8 via-[#fde047]/5 to-transparent rounded-2xl px-6 py-5 border-l-4 border-[#b48001] overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-[#b48001]/5 to-transparent pointer-events-none rounded-2xl" />
                            <p className="relative text-xl md:text-2xl text-[#19456d] font-bold leading-relaxed italic wrap-break-words">
                                {currentBlog.shortDescription}
                            </p>
                        </div>

                        {/* HTML Content */}
                        <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
                            prose-headings:font-extrabold prose-headings:text-[#19456d] prose-headings:tracking-tight prose-headings:mb-6 prose-headings:mt-12 prose-headings:break-words
                            prose-a:text-[#b48001] prose-a:font-bold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#19456d] prose-a:break-words
                            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12 prose-img:border prose-img:border-slate-100
                            prose-blockquote:border-l-4 prose-blockquote:border-[#b48001] prose-blockquote:bg-slate-50 prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:rounded-r-2xl prose-blockquote:shadow-inner prose-blockquote:text-xl prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[#19456d] prose-blockquote:break-words
                            prose-strong:text-[#19456d] prose-strong:font-bold
                            prose-li:marker:text-[#b48001] prose-ul:space-y-3 prose-ol:space-y-3 prose-li:break-words
                            prose-p:leading-loose prose-p:text-slate-600 prose-p:tracking-wide prose-p:mb-8 prose-p:break-words">
                            <div className="wrap-break-words overflow-hidden" dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
                        </div>

                        {/* Gallery Section */}
                        {currentBlog.blogImages?.length > 1 && (
                            <div className="mt-20 -mx-8 md:-mx-14 px-8 md:px-14 pt-16 pb-12 bg-linear-to-br from-[#19456d] via-[#123351] to-[#0d273e] rounded-3xl">
                                <div className="flex items-center gap-4 mb-10">
                                    <h3 className="text-3xl font-extrabold text-white">Story Gallery</h3>
                                    <div className="h-px bg-white/20 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {currentBlog.blogImages.slice(1).map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                                            className="rounded-3xl overflow-hidden h-72 sm:h-80 shadow-xl hover:shadow-2xl transition-shadow group relative border border-white/10 cursor-zoom-in"
                                        >
                                            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                                            <div className="absolute inset-0 bg-[#b48001]/0 group-hover:bg-[#b48001]/20 transition-colors duration-500" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bottom CTA Block */}
                        <div className="mt-20 bg-linear-to-br from-[#19456d] via-[#1a5280] to-[#123351] rounded-3xl p-10 text-white shadow-2xl shadow-[#19456d]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[#19456d]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b48001]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
                            <div className="relative z-10 max-w-lg">
                                <h3 className="text-3xl font-extrabold mb-4">Looking for your next vehicle?</h3>
                                <p className="text-blue-100/80 text-lg mb-0">Explore our comprehensive inventory and find the perfect car that fits your lifestyle and budget.</p>
                            </div>
                            <div className="relative z-10 shrink-0 flex flex-col gap-3 w-full md:w-auto">
                                <Link to="/cars" className="bg-[#b48001] px-8 py-4 rounded-xl font-bold text-center hover:bg-yellow-500 transition-colors shadow-lg shadow-[#b48001]/30 flex items-center justify-center gap-2 group">
                                    Explore Inventory <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                                <Link to="/compare" className="bg-white/10 px-8 py-4 rounded-xl font-bold text-center hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm">
                                    Compare Models
                                </Link>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* Custom scrollbar styles specifically for the sidebar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f8fafc;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default BlogDetails;