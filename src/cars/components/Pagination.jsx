import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  /* Build visible page numbers with ellipsis */
  const buildPages = () => {
    const delta = 2;
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
    const result = [];
    let prev = 0;
    for (const page of range) {
      if (prev && page - prev > 1) result.push('…');
      result.push(page);
      prev = page;
    }
    return result;
  };

  const pages = buildPages();

  return (
    <div className="flex items-center justify-center gap-2 mt-14">
      {/* Prev */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#708ca4]/30 text-[#19456d] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#b48001] hover:text-[#b48001] transition-all bg-white"
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {pages.map((item, i) =>
        item === '…' ? (
          <span key={`ell-${i}`} className="w-10 h-10 flex items-center justify-center text-[#708ca4] select-none">
            …
          </span>
        ) : (
          <motion.button
            key={item}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(item)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
              currentPage === item
                ? 'bg-[#b48001] text-white shadow-lg shadow-[#b48001]/30'
                : 'border border-[#708ca4]/25 text-[#19456d] hover:border-[#b48001] hover:text-[#b48001] bg-white'
            }`}
          >
            {item}
          </motion.button>
        )
      )}

      {/* Next */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#708ca4]/30 text-[#19456d] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#b48001] hover:text-[#b48001] transition-all bg-white"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default Pagination;
