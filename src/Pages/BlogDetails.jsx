import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Share2, Link2, BookOpen, ChevronRight } from 'lucide-react';

const Facebook = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
import { getOneBlog, getAllBlogs } from '../blogs/api/blog.api';
import { BlogCardSkeleton } from '../cars/components/LoadingSkeleton';
import EmptyState from '../cars/components/EmptyState';
import { getImageUrl, truncateText, getReadingTime, FALLBACK_IMAGE } from '../cars/utils/helpers';
import toast from 'react-hot-toast';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Reading progress bar */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      const [blogRes, allRes] = await Promise.all([getOneBlog(id), getAllBlogs()]);
      if (blogRes?.success && blogRes.blog) {
        setBlog(blogRes.blog);
        document.title = `${blogRes.blog.title} — Defence Auto Hub`;
        if (allRes?.success) {
          const others = (allRes.blogs || [])
            .filter((b) => b._id !== id && b.category === blogRes.blog.category)
            .slice(0, 3);
          setRelated(others.length ? others : (allRes.blogs || []).filter((b) => b._id !== id).slice(0, 3));
        }
      }
      setLoading(false);
    })();
  }, [id]);

  const handleShare = (type) => {
    const url = window.location.href;
    if (type === 'copy') { navigator.clipboard.writeText(url); toast.success('Link copied!'); return; }
    if (type === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    if (type === 'tw') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(blog?.title || '')}`, '_blank');
  };

  const img = getImageUrl(blog?.blogImages?.[0] || blog?.image || blog?.thumbnail) || FALLBACK_IMAGE;
  const date = blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const readTime = getReadingTime(blog?.content || blog?.body || '');

  if (!loading && !blog) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState title="Article not found" message="This blog post may have been removed." action={{ label: 'Browse Articles', onClick: () => (window.location.href = '/blogs') }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Reading progress */}
      <motion.div style={{ scaleX, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-[#b48001] to-[#19456d] z-50" />

      {/* Back nav */}
      <div className="bg-white border-b border-[#708ca4]/10 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-[#708ca4] hover:text-[#19456d] text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
          {blog && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#708ca4] font-medium hidden sm:block">Share:</span>
              <button onClick={() => handleShare('fb')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#fafbf8] hover:bg-blue-100 text-[#708ca4] hover:text-blue-600 transition-all"><Facebook className="w-4 h-4" /></button>
              <button onClick={() => handleShare('tw')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#fafbf8] hover:bg-sky-100 text-[#708ca4] hover:text-sky-500 transition-all"><Twitter className="w-4 h-4" /></button>
              <button onClick={() => handleShare('copy')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#fafbf8] hover:bg-[#b48001]/10 text-[#708ca4] hover:text-[#b48001] transition-all"><Link2 className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {loading ? (
          <div className="space-y-6">
            <div className="h-12 bg-[#708ca4]/10 rounded-2xl animate-pulse w-3/4" />
            <div className="h-72 bg-[#708ca4]/10 rounded-3xl animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className={`h-4 bg-[#708ca4]/8 rounded-xl animate-pulse ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />)}
            </div>
          </div>
        ) : blog && (
          <>
            {/* Article header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {blog.category && (
                <Link to="/blogs" className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#b48001]/10 text-[#b48001] text-xs font-bold rounded-full mb-4 hover:bg-[#b48001]/20 transition-colors uppercase tracking-widest">
                  <Tag className="w-3 h-3" />{blog.category}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#19456d] leading-tight mb-4">{blog.title}</h1>
              <div className="flex items-center gap-4 text-[#708ca4] text-sm mb-8">
                {date && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{date}</span>}
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{readTime}</span>
              </div>
            </motion.div>

            {/* Hero image */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="rounded-3xl overflow-hidden mb-10 border border-[#708ca4]/10 shadow-xl">
              <img src={img} alt={blog.title} className="w-full h-64 md:h-96 object-cover"
                onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
            </motion.div>

            {/* Content */}
            <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl border border-[#708ca4]/10 p-8 shadow-sm text-[#19456d] leading-relaxed text-base whitespace-pre-wrap">
                {blog.content || blog.body || <p className="text-[#708ca4] italic">No content available.</p>}
              </div>
            </motion.article>

            {/* Tags / Share bottom */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#708ca4]/15 flex-wrap gap-4">
              {blog.category && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fafbf8] border border-[#708ca4]/20 text-[#708ca4] text-xs font-bold rounded-full">
                  <Tag className="w-3 h-3" />{blog.category}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#708ca4] font-medium">Share:</span>
                <button onClick={() => handleShare('fb')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#fafbf8] border border-[#708ca4]/15 hover:bg-blue-50 hover:border-blue-200 text-[#708ca4] hover:text-blue-600 transition-all"><Facebook className="w-4 h-4" /></button>
                <button onClick={() => handleShare('tw')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#fafbf8] border border-[#708ca4]/15 hover:bg-sky-50 hover:border-sky-200 text-[#708ca4] hover:text-sky-500 transition-all"><Twitter className="w-4 h-4" /></button>
                <button onClick={() => handleShare('copy')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#fafbf8] border border-[#708ca4]/15 hover:bg-[#b48001]/10 hover:border-[#b48001]/30 text-[#708ca4] hover:text-[#b48001] transition-all"><Link2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#b48001] rounded-full" /> Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {related.map((b) => {
                    const rImg = getImageUrl(b.blogImages?.[0] || b.image || b.thumbnail) || FALLBACK_IMAGE;
                    return (
                      <motion.div key={b._id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                        <Link to={`/blogs/${b._id}`}
                          className="group block bg-white rounded-2xl border border-[#708ca4]/15 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#b48001]/30 transition-all">
                          <div className="h-36 overflow-hidden bg-[#fafbf8]">
                            <img src={rImg} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                              onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-[#19456d] text-sm leading-snug group-hover:text-[#b48001] transition-colors">{b.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-[#b48001] font-bold mt-2 group-hover:gap-2 transition-all">
                              Read <ChevronRight className="w-3 h-3" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;