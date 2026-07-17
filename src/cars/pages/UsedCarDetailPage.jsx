  import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Fuel, Settings2, Gauge, Users, Box, Zap,
  BadgeIndianRupee, Calendar, MapPin, CheckCircle,
  Building2, Phone, Mail, User, IndianRupee, MessageCircle
} from 'lucide-react';
import { getUsedCarById } from '../Api/cars.api';
import GalleryCarousel from '../components/GalleryCarousel';
import ImageViewer from '../components/ImageViewer';
import EmptyState from '../components/EmptyState';
import DealerModal from '../components/DealerModal';
import ContactDealerModal from '../components/ContactDealerModal';
import SpecificationTable from '../components/SpecificationTable';
import PriceBreakup from '../components/PriceBreakup';
import { HeroSkeleton } from '../components/LoadingSkeleton';
import { formatCompactPrice, formatIndianPrice, calculateEMI } from '../utils/helpers';

const TABS = ['Overview', 'Specifications', 'Pricing', 'Gallery'];

const UsedCarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const [activeTab, setActiveTab] = useState('Overview');

  // Dealer Modal
  const [dealerModalOpen, setDealerModalOpen] = useState(false);

  // Contact Dealer Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getUsedCarById(slug);

      if (res?.success && res.usedCar) {
        setCar(res.usedCar);
        document.title = `${res.usedCar.brandName} ${res.usedCar.modelName} — Defence Auto Hub`;
      }
      setLoading(false);
    })();
  }, [slug]);

  const price = car?.CSDPrice || car?.price || car?.askingPrice;
  const emi = useMemo(() => calculateEMI(price), [price]);
  const images = car?.carImages || [];
  const name = car?.modelName || car?.Model || 'Used Vehicle';

  const specRows = car
    ? [
      ['Year', car.year],
      ['Kilometers Driven', car.kmTravelled || car.kmDriven ? `${(car.kmTravelled || car.kmDriven).toLocaleString('en-IN')} km` : null],
      ['Fuel Type', car.fuelType],
      ['Transmission', car.transmissionType],
      ['Engine', car.engine],
      ['Max Power', car.maxPower],
      ['Max Torque', car.maxTorque],
      ['Mileage', car.mileage],
      ['Color', car.color],
      ['Owner', car.owner],
      ['Registration No.', car.registrationNumber],
      ['Insurance Valid Till', car.insuranceValidTill ? new Date(car.insuranceValidTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null],
      ['Location', car.City || car.city || car.Address || car.location],
    ]
    : [];

  if (!loading && !car) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState title="Used Vehicle not found" message="This listing may have been removed or sold." action={{ label: "Go Back", onClick: () => navigate('/used-cars') }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      <DealerModal isOpen={dealerModalOpen} onClose={() => setDealerModalOpen(false)} dealer={car?.postedBy} />
      <ContactDealerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        carName={car ? `${car.brandName || ''} ${car.modelName || car.Model || ''}`.trim() : ''}
        carId={car?._id}
        dealer={car?.postedBy}
      />

      {/* Back */}
      <div className="bg-white border-b border-[#708ca4]/10 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Link to="/used-cars" className="inline-flex items-center gap-2 text-[#708ca4] hover:text-[#19456d] text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Used Vehicles
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
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full shrink-0">
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
                  { icon: Gauge, label: car.mileage },
                  { icon: Zap, label: car.maxPower },
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
                <div className="bg-linear-to-r from-[#19456d] to-[#1a3a5c] rounded-2xl p-5 text-white">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Asking Price</p>
                  <p className="text-3xl font-extrabold mb-1">{formatCompactPrice(price)}</p>
                  {emi && (
                    <p className="text-[#b48001] text-sm font-semibold mt-2 flex items-center gap-1">
                      <BadgeIndianRupee className="w-4 h-4" />
                      EMI from {formatIndianPrice(emi)}/mo @ 8.5% for 5 yrs
                    </p>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => setDealerModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-[#19456d] text-[#19456d] font-bold rounded-xl hover:bg-[#19456d] hover:text-white transition-colors text-sm">
                  <Building2 className="w-5 h-5" /> View Dealer
                </button>
                <button onClick={() => setContactModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#b48001] text-white font-bold rounded-xl hover:bg-[#19456d] transition-colors text-sm shadow-md">
                  <MessageCircle className="w-5 h-5" /> Contact Dealer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TABS ── */}
        {!loading && car && (
          <>
            <div className="flex gap-1 bg-white rounded-2xl border border-[#708ca4]/15 p-1.5 mb-8 overflow-x-auto shadow-sm">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-max px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#19456d] text-white shadow-md' : 'text-[#708ca4] hover:text-[#19456d]'
                    }`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {car.details && (
                  <div className="bg-white rounded-2xl border border-[#708ca4]/15 p-6">
                    <h3 className="font-bold text-[#19456d] mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-[#b48001] rounded-full" />Overview
                    </h3>
                    <p className="text-[#708ca4] leading-relaxed">{car.details}</p>
                  </div>
                )}
                <SpecificationTable title="Key Specifications" specs={specRows} />
              </motion.div>
            )}

            {activeTab === 'Specifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SpecificationTable title="Full Specifications" specs={specRows} />
              </motion.div>
            )}

            {activeTab === 'Pricing' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <PriceBreakup item={car} />
              </motion.div>
            )}

            {activeTab === 'Gallery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {images.map((img, i) => (
                  <button key={i} onClick={() => { setViewerIndex(i); setViewerOpen(true); }}
                    className="aspect-video rounded-xl overflow-hidden bg-[#fafbf8] border border-[#708ca4]/10 hover:border-[#b48001]/40 transition-all hover:shadow-md">
                    <img src={img?.startsWith('http') ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`}
                      alt={`img ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png'; }} />
                  </button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      <ImageViewer images={images} initialIndex={viewerIndex} isOpen={viewerOpen} onClose={() => setViewerOpen(false)} />
    </div>
  );
};

export default UsedCarDetailPage;
