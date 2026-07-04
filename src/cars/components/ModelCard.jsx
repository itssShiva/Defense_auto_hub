import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Settings2, Gauge, ChevronRight } from 'lucide-react';
import { getImageUrl, formatCompactPrice, getRouteId, FALLBACK_IMAGE } from '../utils/helpers';

const ModelCard = ({ model, variantCount }) => {
  const imageSrc = getImageUrl(model.carImages?.[0]) || FALLBACK_IMAGE;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <Link
        to={`/models/${getRouteId(model)}`}
        className="group block bg-white rounded-2xl border border-[#708ca4]/15 overflow-hidden
                   shadow-sm hover:shadow-lg hover:border-[#b48001]/30 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-[#fafbf8]">
          <img
            src={imageSrc}
            alt={model.modelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
          {model.year && (
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
              {model.year}
            </div>
          )}
          {variantCount !== undefined && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#b48001]/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
              {variantCount} Variant{variantCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[10px] font-bold text-[#b48001] uppercase tracking-widest mb-1">{model.brandName}</p>
          <h3 className="text-base font-bold text-[#19456d] group-hover:text-[#b48001] transition-colors mb-2.5 leading-snug">
            {model.modelName}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {model.fuelType && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#fafbf8] border border-[#708ca4]/20 text-[#19456d] text-[11px] font-medium rounded-full">
                <Fuel className="w-2.5 h-2.5 text-[#b48001]" />{model.fuelType}
              </span>
            )}
            {model.transmissionType && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#fafbf8] border border-[#708ca4]/20 text-[#19456d] text-[11px] font-medium rounded-full">
                <Settings2 className="w-2.5 h-2.5 text-[#b48001]" />{model.transmissionType}
              </span>
            )}
            {model.mileage && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#fafbf8] border border-[#708ca4]/20 text-[#19456d] text-[11px] font-medium rounded-full">
                <Gauge className="w-2.5 h-2.5 text-[#b48001]" />{model.mileage}
              </span>
            )}
          </div>

          {model.CSDPrice ? (
            <p className="text-sm font-extrabold text-[#19456d] mb-2">
              <span className="text-[#b48001]">CSD </span>{formatCompactPrice(model.CSDPrice)}
            </p>
          ) : null}

          <div className="flex items-center gap-1 text-xs font-semibold text-[#708ca4] group-hover:text-[#b48001] transition-colors">
            <span>View Model</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ModelCard;
