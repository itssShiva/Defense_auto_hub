import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Fuel, Settings2, Gauge, Users, Zap, Box,
  BadgeIndianRupee, PhoneCall, Calendar, Star, CheckCircle
} from 'lucide-react';
import { getVariantById } from '../Api/cars.api';
import GalleryCarousel from '../components/GalleryCarousel';
import ImageViewer from '../components/ImageViewer';
import LeadForm from '../components/LeadForm';
import SpecificationTable from '../components/SpecificationTable';
import PriceBreakup from '../components/PriceBreakup';
import { HeroSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { formatCompactPrice, formatIndianPrice, calculateEMI } from '../utils/helpers';

const TABS = ['Overview', 'Specifications', 'Pricing', 'Gallery', 'Features'];

const VariantDetailPage = () => {
  const { slug } = useParams();
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [leadForm, setLeadForm] = useState({ open: false, type: 'bestPrice' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getVariantById(slug);
      if (res?.success && res.variant) {
        setVariant(res.variant);
        document.title = `${res.variant.variantName} — Defence Auto Hub`;
      }
      setLoading(false);
    })();
  }, [slug]);

  const emi = useMemo(() => calculateEMI(variant?.CSDPrice), [variant]);
  const images = variant?.variantImages || [];

  const specRows = variant
    ? [
        ['Brand', variant.brandName || variant.brandId?.brandName],
        ['Model', variant.modelName || variant.modelId?.modelName],
        ['Variant', variant.variantName],
        ['Year', variant.year],
        ['Category', variant.category],
        ['Body Type', variant.bodyType],
        ['Fuel Type', variant.fuelType],
        ['Transmission', variant.transmissionType],
        ['Engine', variant.engine],
        ['Max Power', variant.maxPower],
        ['Max Torque', variant.maxTorque],
        ['Mileage', variant.mileage],
        ['Seating Capacity', variant.seatingCapacity ? `${variant.seatingCapacity} persons` : null],
        ['Boot Space', variant.bootSpace],
      ]
    : [];

  const features = variant?.features
    ? variant.features.split(/[,\n]+/).map((f) => f.trim()).filter(Boolean)
    : [];

  if (!loading && !variant) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState title="Variant not found" message="This variant may have been removed." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Back nav */}
      <div className="bg-white border-b border-[#708ca4]/10 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Link
            to={variant ? `/models/${variant.modelId?.slug || variant.modelId?._id || variant.modelId}` : '/cars'}
            className="inline-flex items-center gap-2 text-[#708ca4] hover:text-[#19456d] text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Model
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HeroSkeleton />
            <div className="space-y-4"><TableSkeleton rows={5} /></div>
          </div>
        ) : (
          <>
            {/* ── Hero Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Gallery */}
              <GalleryCarousel
                images={images}
                layout="vertical"
                onFullscreen={(idx) => { setViewerIndex(idx); setViewerOpen(true); }}
              />

              {/* Info */}
              <div className="space-y-5">
                {/* Breadcrumb labels */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#b48001] uppercase tracking-widest">
                    {variant.brandName || variant.brandId?.brandName}
                  </span>
                  <span className="text-[#708ca4]">›</span>
                  <span className="text-xs font-bold text-[#708ca4] uppercase tracking-widest">
                    {variant.modelName || variant.modelId?.modelName}
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#19456d] leading-tight mb-3">
                    {variant.variantName}
                  </h1>
                  {variant.year && (
                    <span className="inline-block px-3 py-1 bg-[#708ca4]/10 text-[#708ca4] text-xs font-bold rounded-full mr-2">
                      {variant.year}
                    </span>
                  )}
                  {variant.category && (
                    <span className="inline-block px-3 py-1 bg-[#19456d]/8 text-[#19456d] text-xs font-bold rounded-full">
                      {variant.category}
                    </span>
                  )}
                </div>

                {/* Spec chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Fuel, label: variant.fuelType },
                    { icon: Settings2, label: variant.transmissionType },
                    { icon: Users, label: variant.seatingCapacity ? `${variant.seatingCapacity} Seats` : null },
                    { icon: Gauge, label: variant.mileage },
                    { icon: Zap, label: variant.maxPower },
                    { icon: Box, label: variant.bootSpace ? `${variant.bootSpace} Boot` : null },
                  ].filter((s) => s.label).map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#708ca4]/20 text-[#19456d] text-xs font-semibold rounded-full">
                      <Icon className="w-3.5 h-3.5 text-[#b48001]" />{label}
                    </span>
                  ))}
                </div>

                {/* Price card */}
                <div className="bg-gradient-to-br from-[#19456d] to-[#1a3a5c] rounded-2xl p-5 text-white">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {variant.CSDPrice && (
                      <div>
                        <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest mb-0.5">CSD Price</p>
                        <p className="text-2xl font-extrabold text-[#b48001]">{formatCompactPrice(variant.CSDPrice)}</p>
                      </div>
                    )}
                    {variant.BHOnRoadPrice && (
                      <div>
                        <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest mb-0.5">BH Price</p>
                        <p className="text-2xl font-extrabold">{formatCompactPrice(variant.BHOnRoadPrice)}</p>
                      </div>
                    )}
                    {variant.OnRoadPrice && (
                      <div>
                        <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest mb-0.5">On-Road</p>
                        <p className="text-xl font-bold">{formatCompactPrice(variant.OnRoadPrice)}</p>
                      </div>
                    )}
                    {variant.ExShowroomPrice && (
                      <div>
                        <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest mb-0.5">Ex-Showroom</p>
                        <p className="text-xl font-bold">{formatCompactPrice(variant.ExShowroomPrice)}</p>
                      </div>
                    )}
                  </div>
                  {emi && (
                    <div className="border-t border-white/15 pt-3 flex items-center gap-2">
                      <BadgeIndianRupee className="w-4 h-4 text-[#b48001]" />
                      <p className="text-sm text-[#b48001] font-semibold">
                        EMI from {formatIndianPrice(emi)}/mo @ 8.5% for 5 yrs
                      </p>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setLeadForm({ open: true, type: 'bestPrice' })}
                    className="flex items-center justify-center gap-1.5 py-3 bg-[#b48001] text-white font-bold rounded-xl hover:bg-[#19456d] transition-colors text-xs shadow-md">
                    <BadgeIndianRupee className="w-4 h-4" /> Best Price
                  </button>
                  <button onClick={() => setLeadForm({ open: true, type: 'testDrive' })}
                    className="flex items-center justify-center gap-1.5 py-3 bg-[#19456d] text-white font-bold rounded-xl hover:bg-[#b48001] transition-colors text-xs">
                    <Calendar className="w-4 h-4" /> Test Drive
                  </button>
                  <button onClick={() => setLeadForm({ open: true, type: 'callback' })}
                    className="flex items-center justify-center gap-1.5 py-3 border-2 border-[#19456d] text-[#19456d] font-bold rounded-xl hover:bg-[#19456d] hover:text-white transition-all text-xs">
                    <PhoneCall className="w-4 h-4" /> Callback
                  </button>
                </div>

                {variant.Entitlement && (
                  <div className="p-4 bg-[#b48001]/8 border border-[#b48001]/20 rounded-xl">
                    <p className="text-[10px] font-bold text-[#b48001] uppercase tracking-widest mb-1">Entitlement</p>
                    <p className="text-sm text-[#19456d] font-medium">{variant.Entitlement}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-white rounded-2xl border border-[#708ca4]/15 p-1.5 mb-8 overflow-x-auto shadow-sm">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-max px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab ? 'bg-[#19456d] text-white shadow-md' : 'text-[#708ca4] hover:text-[#19456d]'
                  }`}>{tab}</button>
              ))}
            </div>

            {activeTab === 'Overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {variant.description && (
                  <div className="bg-white rounded-2xl border border-[#708ca4]/15 p-6">
                    <h3 className="font-bold text-[#19456d] mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-[#b48001] rounded-full" />Description
                    </h3>
                    <p className="text-[#708ca4] leading-relaxed">{variant.description}</p>
                  </div>
                )}
                <SpecificationTable title="Key Specifications" specs={specRows.slice(0, 8)} />
              </motion.div>
            )}

            {activeTab === 'Specifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SpecificationTable title="Full Specifications" specs={specRows} />
              </motion.div>
            )}

            {activeTab === 'Pricing' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <PriceBreakup item={variant} />
              </motion.div>
            )}

            {activeTab === 'Gallery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.length ? images.map((img, i) => (
                  <button key={i} onClick={() => { setViewerIndex(i); setViewerOpen(true); }}
                    className="aspect-video rounded-xl overflow-hidden border border-[#708ca4]/10 hover:border-[#b48001]/40 transition-all hover:shadow-md">
                    <img
                      src={img?.startsWith('http') ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`}
                      alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png'; }}
                    />
                  </button>
                )) : <div className="col-span-full"><EmptyState title="No images" message="No gallery images available." /></div>}
              </motion.div>
            )}

            {activeTab === 'Features' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {features.length ? (
                  <div className="bg-white rounded-2xl border border-[#708ca4]/15 p-6">
                    <h3 className="font-bold text-[#19456d] mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-[#b48001] rounded-full" />
                      <Star className="w-4 h-4 text-[#b48001]" /> Key Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.map((feat, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-3 p-3 bg-[#fafbf8] rounded-xl border border-[#708ca4]/10">
                          <CheckCircle className="w-4 h-4 text-[#b48001] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#19456d] font-medium">{feat}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No features listed" message="Feature list not available for this variant." />
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      <ImageViewer images={images} initialIndex={viewerIndex} isOpen={viewerOpen} onClose={() => setViewerOpen(false)} />
      <LeadForm isOpen={leadForm.open} onClose={() => setLeadForm((p) => ({ ...p, open: false }))} type={leadForm.type} carName={variant?.variantName} />
    </div>
  );
};

export default VariantDetailPage;
