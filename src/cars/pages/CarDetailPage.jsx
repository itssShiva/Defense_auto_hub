import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Fuel, Settings2, Gauge, Users, Box, Zap,
  BadgeIndianRupee, PhoneCall, Calendar, Share2, Heart
} from 'lucide-react';
import { getAllCars, getAllModels } from '../Api/cars.api';
import GalleryCarousel from '../components/GalleryCarousel';
import ImageViewer from '../components/ImageViewer';
import LeadForm from '../components/LeadForm';
import SpecificationTable from '../components/SpecificationTable';
import ModelCard from '../components/ModelCard';
import { CarCardSkeleton, HeroSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { formatCompactPrice, formatIndianPrice, calculateEMI } from '../utils/helpers';

const TABS = ['Overview', 'Specifications', 'Gallery'];

const CarDetailPage = () => {
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [relatedModels, setRelatedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [leadForm, setLeadForm] = useState({ open: false, type: 'bestPrice' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [carsRes, modelsRes] = await Promise.all([getAllCars(), getAllModels()]);

      if (carsRes?.success) {
        const found = (carsRes.cars || []).find((c) => c.slug === slug || c._id === slug);
        setCar(found || null);
        if (found) {
          document.title = `${found.Model || found.modelName} — Defence Auto Hub`;
          if (modelsRes?.success) {
            const rel = (modelsRes.models || []).filter(
              (m) =>
                m._id !== found._id &&
                ((m.brandId && m.brandId?._id === (found.brandId?._id || found.brandId)) ||
                (m.brandId && m.brandId === found.brandId) ||
                (m.brandName && m.brandName?.toLowerCase() === found.brandName?.toLowerCase()))
            );
            setRelatedModels(rel);
          }
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  const emi = useMemo(() => calculateEMI(car?.CSDPrice), [car]);
  const images = car?.carImages || [];
  const name = car?.Model || car?.modelName || '';
  const currentBrand = car?.brandName || car?.brandId?.brandName || '';

  const openLead = (type) => setLeadForm({ open: true, type });

  const specRows = car
    ? [
      ['Body Type', car.BodyType || car.bodyType],
      ['Fuel Type', car.FuelType || car.fuelType],
      ['Transmission', car.TransmissionType || car.transmissionType],
      ['Engine', car.engineDisplacement || car.engine],
      ['Max Power', car.MaxPower || car.maxPower],
      ['Max Torque', car.maxTorque],
      ['Mileage', car.CityMileage || car.mileage],
      ['Seating Capacity', (car.SeatingCapacity || car.seatingCapacity) ? `${car.SeatingCapacity || car.seatingCapacity} persons` : null],
      ['Boot Space', car.BootSpace || car.bootSpace],
      ['Category', car.category],
    ]
    : [];

  if (!loading && !car) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState title="Car not found" message="This listing may have been removed." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Back */}
      <div className="bg-white border-b border-[#708ca4]/10 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Link to="/cars" className="inline-flex items-center gap-2 text-[#708ca4] hover:text-[#19456d] text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Cars
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
                {car.brandName && (
                  <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-1.5">{car.brandName}</p>
                )}
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#19456d] leading-tight mb-3">{name}</h1>
                {car.category && (
                  <span className="inline-block px-3 py-1 bg-[#19456d]/8 text-[#19456d] text-xs font-bold rounded-full">{car.category}</span>
                )}
              </div>

              {/* Quick spec chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Fuel, label: car.FuelType || car.fuelType },
                  { icon: Settings2, label: car.TransmissionType || car.transmissionType },
                  { icon: Users, label: (car.SeatingCapacity || car.seatingCapacity) ? `${car.SeatingCapacity || car.seatingCapacity} Seats` : null },
                  { icon: Gauge, label: car.CityMileage || car.mileage },
                  { icon: Zap, label: car.MaxPower || car.maxPower },
                  { icon: Box, label: (car.BootSpace || car.bootSpace) ? `${car.BootSpace || car.bootSpace} Boot` : null },
                ].filter((s) => s.label).map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#708ca4]/20 text-[#19456d] text-xs font-semibold rounded-full">
                    <Icon className="w-3.5 h-3.5 text-[#b48001]" />{label}
                  </span>
                ))}
              </div>

              {/* Price block */}
              {(car.CSDPrice || car.OnRoadPrice) && (
                <div className="bg-linear-to-r from-[#19456d] to-[#1a3a5c] rounded-2xl p-5 text-white">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">CSD Price</p>
                  <p className="text-3xl font-extrabold mb-1">{formatCompactPrice(car.CSDPrice || car.OnRoadPrice)}</p>
                  {car.CSDPrice && car.OnRoadPrice && (
                    <p className="text-white/60 text-sm">On-Road: {formatCompactPrice(car.OnRoadPrice)}</p>
                  )}
                  {emi && (
                    <p className="text-[#b48001] text-sm font-semibold mt-2 flex items-center gap-1">
                      <BadgeIndianRupee className="w-4 h-4" />
                      EMI from {formatIndianPrice(emi)}/mo @ 8.5% for 5 yrs
                    </p>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => openLead('bestPrice')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#b48001] text-white font-bold rounded-xl hover:bg-[#19456d] transition-colors text-sm shadow-md">
                  <BadgeIndianRupee className="w-4 h-4" /> Best Price
                </button>
                <button onClick={() => openLead('testDrive')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#19456d] text-white font-bold rounded-xl hover:bg-[#b48001] transition-colors text-sm">
                  <Calendar className="w-4 h-4" /> Test Drive
                </button>
                <button onClick={() => openLead('callback')}
                  className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-[#19456d] text-[#19456d] font-bold rounded-xl hover:bg-[#19456d] hover:text-white transition-all text-sm">
                  <PhoneCall className="w-4 h-4" /> Callback
                </button>
              </div>

              {car.Entitlement && (
                <div className="p-4 bg-[#b48001]/8 border border-[#b48001]/30 rounded-xl">
                  <p className="text-[10px] font-bold text-[#b48001] uppercase tracking-widest mb-1">Entitlement</p>
                  <p className="text-sm text-[#19456d] font-medium">{car.Entitlement}</p>
                </div>
              )}
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

            {/* ── Explore Models Section (Always visible below tabs) ── */}
            <div className="mt-16 border-t border-[#708ca4]/15 pt-12">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#19456d] mb-2">Explore More Cars</h2>
                  <p className="text-[#708ca4]">
                    {currentBrand ? `Other models from ${currentBrand}` : "Available related models"}
                  </p>
                </div>
              </div>

              {relatedModels.length === 0 ? (
                <EmptyState title="No models found" message="No related models available for this car." />
              ) : (
                <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory">
                  {relatedModels.map((m) => (
                    <div key={m._id} className="min-w-[280px] sm:min-w-[320px] snap-center">
                      <ModelCard model={m} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ImageViewer images={images} initialIndex={viewerIndex} isOpen={viewerOpen} onClose={() => setViewerOpen(false)} />
      <LeadForm isOpen={leadForm.open} onClose={() => setLeadForm((p) => ({ ...p, open: false }))} type={leadForm.type} carName={name} />
    </div>
  );
};

export default CarDetailPage;
