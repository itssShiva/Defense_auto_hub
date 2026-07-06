import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/helpers';

const ImageViewer = ({ images = [], initialIndex = 0, isOpen, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setCurrent(initialIndex);
    setZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, images.length, onClose]);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/96 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full">
            {current + 1} / {images.length}
          </div>

          {/* Zoom toggle */}
          <button onClick={() => setZoomed((z) => !z)} className="absolute top-4 right-16 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
            {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button onClick={prev} className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`max-w-5xl ${zoomed ? 'overflow-auto cursor-zoom-out w-full' : 'overflow-hidden cursor-zoom-in'}`}
            onClick={() => setZoomed((z) => !z)}
          >
            <img
              src={getImageUrl(images[current]) || FALLBACK_IMAGE}
              alt={`Image ${current + 1}`}
              className={`transition-all duration-300 ${zoomed ? 'max-w-none w-[160%]' : 'max-w-full max-h-[80vh] object-contain mx-auto block'
                }`}
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
            />
          </motion.div>

          {/* Next */}
          {images.length > 1 && (
            <button onClick={next} className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`shrink-0 w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${i === current ? 'border-[#b48001] opacity-100' : 'border-transparent opacity-45 hover:opacity-75'
                    }`}
                >
                  <img src={getImageUrl(img) || FALLBACK_IMAGE} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageViewer;
