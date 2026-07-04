import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Fuel, Settings2, Gauge, Users, Zap, Calendar,
  BadgeIndianRupee, PhoneCall
} from 'lucide-react';
import { getAllModels, getAllVariants } from '../Api/cars.api';
import GalleryCarousel from '../components/GalleryCarousel';
import ImageViewer from '../components/ImageViewer';
import LeadForm from '../components/LeadForm';
import SpecificationTable from '../components/SpecificationTable';
import PriceBreakup from '../components/PriceBreakup';
import VariantCard from '../components/VariantCard';
import { HeroSkeleton, VariantListSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { formatCompactPrice, formatIndianPrice, calculateEMI } from '../utils/helpers';

const TABS = ['Overview', 'Specifications', 'Pricing', 'Gallery', 'Variants'];

const ModelDetailPage = () => {
  const { slug } = useParams();
  const [model, setModel] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [leadForm, setLeadForm] = useState({ open: false, type: 'bestPrice' });
  const [fuelFilter, setFuelFilter] = useState('All');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [modelsRes, variantsRes] = await Promise.all([getAllModels(), getAllVariants()]);

      if (modelsRes?.success) {
        const found = (modelsRes.models || []).find((m) => m.slug === slug || m._id === slug);
        setModel(found || null);
        if (found) {
          document.title = `${found.modelName} — Defence Auto Hub`;
          if (variantsRes?.success) {
            const rel = (variantsRes.variants || []).filter(
              (v) => v.modelId?._id === found._id || v.modelId === found._id
            );
            setVariants(rel);
          }
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  const emi = useMemo(() => calculateEMI(model?.CSDPrice), [model]);
  const images = model?.carImages || [];

  const fuelTypes = useMemo(() => {
    const set = new Set(variants.map((v) => v.fuelType).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [variants]);

  const filteredVariants = useMemo(() => {
    if (fuelFilter === 'All') return variants;
    return variants.filter((v) => v.fuelType === fuelFilter);
  }, [variants, fuelFilter]);

  const specRows = model
    ? [
        ['Brand', model.brandName],
        ['Model Name', model.modelName],
        ['Year', model.year],
        ['Category', model.category],
        ['Body Type', model.bodyType],
        ['Fuel Type', model.fuelType],
        ['Transmission', model.transmissionType],
        ['Engine', model.engine],
        ['Max Power', model.maxPower],
        ['Max Torque', model.maxTorque],
        ['Mileage', model.mileage],
        ['Seating Capacity', model.seatingCapacity ? `${model.seatingCapacity} persons` : null],
        ['Boot Space', model.bootSpace],
      ]
    : [];

  if (!loading && !model) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState title="Model not found" message="This model may have been removed." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Back nav */}
      <div className="bg-white border-b border-[#708ca4]/10 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Link to="/cars"
            className="inline-flex items-center gap-2 text-[#708ca4] hover:text-[#19456d] text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Cars
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HeroSkeleton />
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-[#708ca4]/10 rounded-xl animate-pulse" />)}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Gallery */}
            <GalleryCarousel images={images} layout="vertical" onFullscreen={(idx) => { setViewerIndex(idx); setViewerOpen(true); }} />

            {/* Info */}
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-[#b48001] uppercase tracking-widest mb-1.5">{model.brandName} · {model.year}</p>
                <h1 className="text-3xl font-extrabold text-[#19456d] leading-tight mb-2">{model.modelName}</h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { icon: Fuel, label: model.fuelType },
                    { icon: Settings2, label: model.transmissionType },
                    { icon: Gauge, label: model.mileage },
                    { icon: Users, label: model.seatingCapacity ? `${model.seatingCapacity} Seats` : null },
                    { icon: Zap, label: model.maxPower },
                  ].filter((s) => s.label).map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#708ca4]/20 text-[#19456d] text-xs font-semibold rounded-full">
                      <Icon className="w-3.5 h-3.5 text-[#b48001]" />{label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              {model.CSDPrice && (
                <div className="bg-gradient-to-r from-[#19456d] to-[#1a3a5c] rounded-2xl p-5 text-white">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">CSD Price</p>
                  <p className="text-3xl font-extrabold mb-1">{formatCompactPrice(model.CSDPrice)}</p>
                  {emi && (
                    <p className="text-[#b48001] text-sm font-semibold mt-1 flex items-center gap-1">
                      <BadgeIndianRupee className="w-4 h-4" />
                      EMI from {formatIndianPrice(emi)}/mo
                    </p>
                  )}
                </div>
              )}

              {/* Variants count */}
              {variants.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-[#b48001]/8 rounded-xl border border-[#b48001]/20">
                  <div className="w-10 h-10 bg-[#b48001] rounded-xl flex items-center justify-center text-white font-extrabold text-lg">{variants.length}</div>
                  <div>
                    <p className="font-bold text-[#19456d] text-sm">Available Variants</p>
                    <p className="text-[#708ca4] text-xs">Multiple fuel & transmission options</p>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setLeadForm({ open: true, type: 'bestPrice' })}
                  className="flex items-center justify-center gap-1.5 py-3 bg-[#b48001] text-white font-bold rounded-xl hover:bg-[#19456d] transition-colors text-xs">
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
            </div>
          </div>
        )}

        {/* Tabs */}
        {!loading && model && (
          <>
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
                {model.details && (
                  <div className="bg-white rounded-2xl border border-[#708ca4]/15 p-6">
                    <h3 className="font-bold text-[#19456d] mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-[#b48001] rounded-full" />Overview</h3>
                    <p className="text-[#708ca4] leading-relaxed">{model.details}</p>
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
                <PriceBreakup item={model} />
              </motion.div>
            )}

            {activeTab === 'Gallery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.length ? images.map((img, i) => (
                  <button key={i} onClick={() => { setViewerIndex(i); setViewerOpen(true); }}
                    className="aspect-video rounded-xl overflow-hidden border border-[#708ca4]/10 hover:border-[#b48001]/40 transition-all hover:shadow-md">
                    <img src={img?.startsWith('http') ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`}
                      alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png'; }} />
                  </button>
                )) : <EmptyState title="No images" message="No gallery images available." />}
              </motion.div>
            )}

            {activeTab === 'Variants' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Fuel filter */}
                {fuelTypes.length > 2 && (
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {fuelTypes.map((f) => (
                      <button key={f} onClick={() => setFuelFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                          fuelFilter === f ? 'bg-[#b48001] text-white border-transparent' : 'bg-white border-[#708ca4]/20 text-[#19456d] hover:border-[#b48001]'
                        }`}>{f}</button>
                    ))}
                  </div>
                )}
                {filteredVariants.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredVariants.map((v) => <VariantCard key={v._id} variant={v} />)}
                  </div>
                ) : <EmptyState title="No variants" message="No variants match your filter." />}
              </motion.div>
            )}
          </>
        )}
      </div>

      <ImageViewer images={images} initialIndex={viewerIndex} isOpen={viewerOpen} onClose={() => setViewerOpen(false)} />
      <LeadForm isOpen={leadForm.open} onClose={() => setLeadForm((p) => ({ ...p, open: false }))} type={leadForm.type} carName={model?.modelName} />
    </div>
  );
};

export default ModelDetailPage;
