import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Settings2, ChevronRight } from 'lucide-react';
import { getImageUrl, formatCompactPrice, getRouteId, FALLBACK_IMAGE } from '../utils/helpers';

const CarCard = ({ car, linkTo, layout = 'grid' }) => {
  const imageSrc = getImageUrl(car.carImages?.[0] || car.vehicleImages?.[0] || car.variantImages?.[0]) || FALLBACK_IMAGE;
  const name = car.Model || car.modelName || car.vehicleName || car.variantName || 'Vehicle';
  const price = car.CSDPrice || car.OnRoadPrice || car.price || 0;
  const finalLink = linkTo || `/cars/${getRouteId(car)}`;

  if (layout === 'list') {
    return (
      <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.18 }}>
        <Link to={finalLink} className="flex gap-5 bg-white rounded-2xl border border-[#708ca4]/15 p-4 shadow-sm hover:shadow-md hover:border-[#b48001]/30 transition-all">
          <div className="w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-[#fafbf8] relative">
            <img src={imageSrc} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
            {car.category && <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#19456d]/85 backdrop-blur-sm text-white text-[9px] font-bold rounded-full uppercase">{car.category}</div>}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-[10px] font-bold text-[#b48001] uppercase tracking-widest">{car.brandName}</p>
            <h3 className="text-lg font-extrabold text-[#19456d] leading-tight mb-2">{name}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {car.FuelType && <span className="flex items-center gap-1 text-xs text-[#708ca4]"><Fuel className="w-3 h-3 text-[#b48001]" />{car.FuelType}</span>}
              {car.TransmissionType && <span className="flex items-center gap-1 text-xs text-[#708ca4]"><Settings2 className="w-3 h-3 text-[#b48001]" />{car.TransmissionType}</span>}
            </div>
            {price && <p className="text-xl font-extrabold text-[#19456d]">{formatCompactPrice(price)}</p>}
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
      <Link
        to={finalLink}
        className="group block bg-white rounded-2xl border border-[#708ca4]/15 overflow-hidden
                   shadow-sm hover:shadow-xl hover:border-[#b48001]/30 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#fafbf8]">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-500"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category chip */}
          {car.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#19456d]/85 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              {car.category}
            </div>
          )}

          {/* Year chip */}
          {car.year && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
              {car.year}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-[10px] font-bold text-[#b48001] uppercase tracking-widest mb-1">{car.brandName}</p>
          <h3 className="text-lg font-extrabold text-[#19456d] group-hover:text-[#b48001] transition-colors leading-snug mb-3">
            {name}
          </h3>

          {/* Spec chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {car.FuelType && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-[#fafbf8] border border-[#708ca4]/20 text-[#19456d] text-[11px] font-semibold rounded-full">
                <Fuel className="w-3 h-3 text-[#b48001]" />{car.FuelType}
              </span>
            )}
            {car.TransmissionType && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-[#fafbf8] border border-[#708ca4]/20 text-[#19456d] text-[11px] font-semibold rounded-full">
                <Settings2 className="w-3 h-3 text-[#b48001]" />{car.TransmissionType}
              </span>
            )}
          </div>

          {/* Price */}
          {price ? (
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-xl font-extrabold text-[#19456d]">{formatCompactPrice(price)}</span>
              <span className="text-xs text-[#708ca4]">{car.CSDPrice ? 'CSD Price' : 'On-Road'}</span>
            </div>
          ) : (
            <p className="text-sm text-[#708ca4] italic mb-3">Price on request</p>
          )}

          <div className="flex items-center gap-1 text-sm font-semibold text-[#708ca4] group-hover:text-[#b48001] transition-colors">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard;
