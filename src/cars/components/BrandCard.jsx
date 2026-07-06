import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ChevronRight } from 'lucide-react';
import { getImageUrl, getRouteId } from '../utils/helpers';

const BrandCard = ({ brand, modelCount }) => {
  const logoSrc = getImageUrl(brand.logo);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
      <Link
        to={`/brand/${getRouteId(brand)}`}
        className="group block bg-white rounded-2xl border border-[#708ca4]/15 p-6 text-center
                   shadow-sm hover:shadow-xl hover:border-[#b48001]/40 transition-all duration-300
                   relative overflow-hidden"
      >
        {/* Top accent bar */}
        <span className="absolute top-0 inset-x-0 h-[3px] bg-linear-to-r from-[#b48001] to-[#19456d] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-2xl" />

        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#fafbf8] border border-[#708ca4]/10 flex items-center justify-center overflow-hidden p-2">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={brand.brandName}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span className="text-3xl font-extrabold text-[#708ca4]/40 select-none">
              {brand.brandName?.charAt(0)}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-[#19456d] group-hover:text-[#b48001] transition-colors mb-1 leading-tight">
          {brand.brandName}
        </h3>

        {/* Country */}
        {brand.brandCountry && (
          <div className="flex items-center justify-center gap-1 text-[#708ca4] text-xs mb-3">
            <Globe className="w-3 h-3" />
            <span>{brand.brandCountry}</span>
          </div>
        )}

        {/* Model count badge */}
        {modelCount !== undefined && modelCount !== null && (
          <span className="inline-block text-xs font-bold text-[#b48001] bg-[#b48001]/8 px-3 py-1 rounded-full mb-3">
            {modelCount} {modelCount === 1 ? 'Model' : 'Models'}
          </span>
        )}

        {/* Explore CTA */}
        <div className="flex items-center justify-center gap-1 text-xs font-semibold text-[#708ca4] group-hover:text-[#19456d] transition-colors">
          <span>Explore</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
};

export default BrandCard;
