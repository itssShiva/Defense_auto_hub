import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Fuel, Settings2, Calendar, MapPin, CheckCircle,
  Building2, Phone, Mail, User, IndianRupee
} from 'lucide-react';
import { getAllUsedCars } from '../Api/cars.api';
import GalleryCarousel from '../components/GalleryCarousel';
import ImageViewer from '../components/ImageViewer';
import EmptyState from '../components/EmptyState';
import DealerModal from '../components/DealerModal';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import { formatCompactPrice, formatIndianPrice, calculateEMI } from '../utils/helpers';
import SpecificationTable from '../components/SpecificationTable';

const UsedCarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // Dealer Modal
  const [dealerModalOpen, setDealerModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAllUsedCars();

      if (res?.success) {
        const found = (res.usedCars || res.cars || []).find((c) => c._id === slug);
        setCar(found || null);
        if (found) {
          document.title = `${found.brandName} ${found.modelName || found.Model} — Defence Auto Hub`;
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  const price = car?.CSDPrice || car?.price || car?.askingPrice;
  const emi = useMemo(() => calculateEMI(price), [price]);
  const images = car?.carImages || [];
  const name = car?.modelName || car?.Model || 'Used Car';

  const specRows = car
    ? [
        ['Year', car.year],
        ['Kilometers Driven', car.kmTravelled || car.kmDriven ? `${(car.kmTravelled || car.kmDriven).toLocaleString('en-IN')} km` : null],
        ['Fuel Type', car.fuelType],
        ['Transmission', car.transmissionType],
        ['Color', car.color],
        ['Owner', car.owner],
        ['Location', car.City || car.city || car.Address || car.location],
      ]
    : [];

  if (!loading && !car) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState title="Used Car not found" message="This listing may have been removed or sold." action={{ label: "Go Back", onClick: () => navigate('/used-cars') }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      <DealerModal isOpen={dealerModalOpen} onClose={() => setDealerModalOpen(false)} dealer={car?.postedBy} />

      {/* Back */}
      <div className="bg-white border-b border-[#708ca4]/10 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Link to="/used-cars" className="inline-flex items-center gap-2 text-[#708ca4] hover:text-[#19456d] text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Used Cars
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HeroSkeleton />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#708ca4]/10 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* ── LEFT: Gallery ── */}
            <div>
              <GalleryCarousel images={images} layout="vertical" onFullscreen={(idx) => { setViewerIndex(idx); setViewerOpen(true); }} />
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="space-y-5">
              {/* Brand + Name */}
              <div>
                <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-1.5">{car.brandName}</p>
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#19456d] leading-tight mb-3">{name}</h1>
                  {(car.status === 'approved' || car.isApproved || car.isVerified === 'Approved' || car.isVerified === 'approved' || car.isVerified === 'Verified' || car.isVerified === 'verified') && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full flex-shrink-0">
                      <CheckCircle className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Quick spec chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Fuel, label: car.fuelType },
                  { icon: Settings2, label: car.transmissionType },
                  { icon: Calendar, label: car.year },
                  { icon: MapPin, label: car.City || car.city },
                ].filter((s) => s.label).map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#708ca4]/20 text-[#19456d] text-xs font-semibold rounded-full">
                    <Icon className="w-3.5 h-3.5 text-[#b48001]" />{label}
                  </span>
                ))}
              </div>

              {/* Price block */}
              {price && (
                <div className="bg-gradient-to-r from-[#19456d] to-[#1a3a5c] rounded-2xl p-5 text-white">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Asking Price</p>
                  <p className="text-3xl font-extrabold mb-1">{formatCompactPrice(price)}</p>
                  {emi && (
                    <p className="text-[#b48001] text-sm font-semibold mt-2 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      EMI from {formatIndianPrice(emi)}/mo @ 8.5% for 5 yrs
                    </p>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => setDealerModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-4 px-4 bg-[#b48001] text-white font-bold rounded-xl hover:bg-[#19456d] transition-colors text-sm shadow-md">
                  <Building2 className="w-5 h-5" /> View Dealer Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Specifications ── */}
        {!loading && car && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SpecificationTable title="Used Car Specifications" specs={specRows} />
          </motion.div>
        )}
      </div>

      <ImageViewer images={images} initialIndex={viewerIndex} isOpen={viewerOpen} onClose={() => setViewerOpen(false)} />
    </div>
  );
};

export default UsedCarDetailPage;
