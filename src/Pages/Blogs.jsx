import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Tag, ChevronRight, BookOpen } from 'lucide-react';
import { getAllBlogs } from '../blogs/api/blog.api';
import Pagination from '../cars/components/Pagination';
import EmptyState from '../cars/components/EmptyState';
import { BlogCardSkeleton } from '../cars/components/LoadingSkeleton';
import { getImageUrl, truncateText, getReadingTime, FALLBACK_IMAGE } from '../cars/utils/helpers';

const PER_PAGE = 9;

const BlogCard = ({ blog, featured }) => {
  const img = getImageUrl(blog.image || blog.thumbnail) || FALLBACK_IMAGE;
  const date = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const readTime = getReadingTime(blog.content || blog.body || '');

  if (featured) {
    return (
      <Link to={`/blogs/${blog._id}`}
        className="group relative block rounded-3xl overflow-hidden border border-[#708ca4]/15 shadow-lg hover:shadow-2xl transition-all duration-400 bg-white">
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {blog.category && (
              <span className="inline-block px-3 py-1 bg-[#b48001] text-white text-xs font-bold rounded-full mb-3 uppercase tracking-widest">
                {blog.category}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight group-hover:text-[#b48001] transition-colors">{blog.title}</h2>
            {blog.content && <p className="text-white/70 text-sm line-clamp-2 mb-4">{truncateText(blog.content, 160)}</p>}
            <div className="flex items-center gap-4 text-white/60 text-xs">
              {date && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{date}</span>}
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{readTime}</span>
              <span className="ml-auto flex items-center gap-1 font-bold text-[#b48001] group-hover:gap-2 transition-all">
                Read More <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.22 }}>
      <Link to={`/blogs/${blog._id}`}
        className="group block bg-white rounded-2xl border border-[#708ca4]/15 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#b48001]/30 transition-all duration-300">
        <div className="relative h-48 overflow-hidden bg-[#fafbf8]">
          <img src={img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
          {blog.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#19456d]/85 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              {blog.category}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-extrabold text-[#19456d] group-hover:text-[#b48001] transition-colors leading-snug mb-2 text-base">
            {blog.title}
          </h3>
          {blog.content && (
            <p className="text-[#708ca4] text-sm leading-relaxed mb-3">{truncateText(blog.content, 100)}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-[#708ca4]">
            {date && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{date}</span>}
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{readTime}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#b48001] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = 'Blogs — Defence Auto Hub';
    (async () => {
      setLoading(true);
      const res = await getAllBlogs();
      if (res?.success) setBlogs(res.blogs || []);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(blogs.map((b) => b.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [blogs]);

  const filtered = useMemo(() => {
    let list = [...blogs];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.title?.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q));
    }
    if (activeCategory !== 'All') list = list.filter((b) => b.category === activeCategory);
    return list;
  }, [blogs, search, activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const totalPages = Math.ceil(rest.length / PER_PAGE);
  const paged = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#19456d] to-[#1a3a5c] pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#b48001] text-xs font-bold uppercase tracking-[4px] mb-3">
            Defence Auto Hub
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Auto <span className="text-[#b48001]">Insights</span>
          </motion.h1>
          <p className="text-[#708ca4] mb-8">{loading ? '…' : `${blogs.length} articles for defence auto enthusiasts`}</p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#708ca4]" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles…"
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white text-[#19456d] font-medium focus:outline-none shadow-2xl text-base" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category tabs */}
        {categories.length > 2 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === cat ? 'bg-[#b48001] text-white shadow-md' : 'bg-white border border-[#708ca4]/20 text-[#19456d] hover:border-[#b48001]'
                }`}>
                <Tag className="w-3.5 h-3.5" />{cat}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No articles found" message="Try a different search or category." action={{ label: 'Clear', onClick: () => { setSearch(''); setActiveCategory('All'); } }} />
        ) : (
          <>
            {featured && (
              <div className="mb-8">
                <BlogCard blog={featured} featured />
              </div>
            )}
            {paged.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((blog) => (
                  <motion.div key={blog._id} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;