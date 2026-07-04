import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Settings2, Users, ChevronRight } from 'lucide-react';
import { getImageUrl, formatCompactPrice, getRouteId, FALLBACK_IMAGE } from '../utils/helpers';

const VariantCard = ({ variant }) => {
  const imageSrc = getImageUrl(variant.variantImages?.[0]) || FALLBACK_IMAGE;

  return (
    <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.18 }}>
      <Link
        to={`/variants/${getRouteId(variant)}`}
        className="group flex gap-4 p-4 bg-white rounded-xl border border-[#708ca4]/15
                   shadow-sm hover:shadow-md hover:border-[#b48001]/30 transition-all duration-250"
      >
        {/* Thumbnail */}
        <div className="w-28 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#fafbf8]">
          <img
            src={imageSrc}
            alt={variant.variantName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#19456d] group-hover:text-[#b48001] transition-colors truncate mb-1.5">
            {variant.variantName}
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {variant.fuelType && (
              <span className="flex items-center gap-1 text-[11px] text-[#708ca4] font-semibold">
                <Fuel className="w-3 h-3 text-[#b48001]" />{variant.fuelType}
              </span>
            )}
            {variant.transmissionType && (
              <span className="flex items-center gap-1 text-[11px] text-[#708ca4] font-semibold">
                <Settings2 className="w-3 h-3 text-[#b48001]" />{variant.transmissionType}
              </span>
            )}
            {variant.seatingCapacity && (
              <span className="flex items-center gap-1 text-[11px] text-[#708ca4] font-semibold">
                <Users className="w-3 h-3 text-[#b48001]" />{variant.seatingCapacity} Seats
              </span>
            )}
          </div>
          {variant.CSDPrice && (
            <p className="text-sm font-extrabold text-[#b48001]">
              {formatCompactPrice(variant.CSDPrice)}
              <span className="text-[#708ca4] text-[11px] font-normal ml-1">CSD</span>
            </p>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-[#708ca4] self-center flex-shrink-0 group-hover:translate-x-1 group-hover:text-[#b48001] transition-all" />
      </Link>
    </motion.div>
  );
};

export default VariantCard;
