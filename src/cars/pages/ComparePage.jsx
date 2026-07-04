import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown, BarChart3, Trash2 } from 'lucide-react';
import { getAllBrands } from '../../brand/api/brand.api';
import { getAllModels, getAllVariants } from '../Api/cars.api';
import EmptyState from '../components/EmptyState';
import { formatCompactPrice, getImageUrl, FALLBACK_IMAGE } from '../utils/helpers';

const MAX_COMPARE = 3;

const SPEC_LABELS = [
  ['fuelType', 'Fuel Type'],
  ['transmissionType', 'Transmission'],
  ['engine', 'Engine'],
  ['maxPower', 'Max Power'],
  ['maxTorque', 'Max Torque'],
  ['mileage', 'Mileage'],
  ['seatingCapacity', 'Seating'],
  ['bootSpace', 'Boot Space'],
  ['bodyType', 'Body Type'],
  ['category', 'Category'],
  ['year', 'Year'],
  ['CSDPrice', 'CSD Price'],
  ['BHOnRoadPrice', 'BH On-Road'],
  ['OnRoadPrice', 'On-Road Price'],
  ['ExShowroomPrice', 'Ex-Showroom'],
];

const PRICE_FIELDS = ['CSDPrice', 'BHOnRoadPrice', 'OnRoadPrice', 'ExShowroomPrice'];

const ComparePage = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Selection state per slot */
  const [slots, setSlots] = useState([
    { brandId: '', modelId: '', variantId: '' },
    { brandId: '', modelId: '', variantId: '' },
  ]);

  useEffect(() => {
    document.title = 'Compare Cars — Defence Auto Hub';
    (async () => {
      const [br, mo, va] = await Promise.all([getAllBrands(), getAllModels(), getAllVariants()]);
      if (br?.success) setBrands(br.brands || []);
      if (mo?.success) setModels(mo.models || []);
      if (va?.success) setVariants(va.variants || []);
      setLoading(false);
    })();
  }, []);

  const updateSlot = (index, key, value) =>
    setSlots((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        if (key === 'brandId') return { brandId: value, modelId: '', variantId: '' };
        if (key === 'modelId') return { ...s, modelId: value, variantId: '' };
        return { ...s, [key]: value };
      })
    );

  const removeSlot = (index) => setSlots((prev) => prev.filter((_, i) => i !== index));
  const addSlot = () => setSlots((prev) => [...prev, { brandId: '', modelId: '', variantId: '' }]);

  const getModelsForBrand = (brandId) =>
    brandId ? models.filter((m) => m.brandId?._id === brandId || m.brandId === brandId) : [];

  const getVariantsForModel = (modelId) =>
    modelId ? variants.filter((v) => v.modelId?._id === modelId || v.modelId === modelId) : [];

  const selectedVariants = slots.map((s) =>
    s.variantId ? variants.find((v) => v._id === s.variantId) || null : null
  );

  const activeVariants = selectedVariants.filter(Boolean);

  const getVal = (variant, key) => {
    const val = variant?.[key];
    if (val === null || val === undefined || val === '') return '—';
    if (PRICE_FIELDS.includes(key)) return formatCompactPrice(val) || '—';
    return String(val);
  };

  const isHighlighted = (key, index) => {
    if (!PRICE_FIELDS.includes(key)) return false;
    const vals = selectedVariants.map((v) => (v ? Number(v[key]) || Infinity : Infinity));
    const min = Math.min(...vals);
    const current = Number(selectedVariants[index]?.[key]) || Infinity;
    return current === min && current !== Infinity;
  };

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#19456d] to-[#1a3a5c] pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#b48001] text-xs font-bold uppercase tracking-[4px] mb-3">Defence Auto Hub</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Compare <span className="text-[#b48001]">Variants</span>
          </motion.h1>
          <p className="text-[#708ca4] text-base">Select up to {MAX_COMPARE} variants and compare side by side</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Slot selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {slots.map((slot, i) => {
            const slotModels = getModelsForBrand(slot.brandId);
            const slotVariants = getVariantsForModel(slot.modelId);
            const chosen = selectedVariants[i];

            return (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#708ca4]/15 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-[#708ca4] uppercase tracking-widest">Car {i + 1}</p>
                  {slots.length > 2 && (
                    <button onClick={() => removeSlot(i)} className="w-7 h-7 flex items-center justify-center text-[#708ca4] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Brand */}
                <div className="relative">
                  <select value={slot.brandId} onChange={(e) => updateSlot(i, 'brandId', e.target.value)}
                    className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-[#708ca4]/25 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 focus:ring-[#b48001] appearance-none">
                    <option value="">Select Brand</option>
                    {brands.map((b) => <option key={b._id} value={b._id}>{b.brandName}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4] pointer-events-none" />
                </div>

                {/* Model */}
                <div className="relative">
                  <select value={slot.modelId} onChange={(e) => updateSlot(i, 'modelId', e.target.value)}
                    disabled={!slot.brandId}
                    className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-[#708ca4]/25 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 focus:ring-[#b48001] appearance-none disabled:opacity-40">
                    <option value="">Select Model</option>
                    {slotModels.map((m) => <option key={m._id} value={m._id}>{m.modelName} ({m.year})</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4] pointer-events-none" />
                </div>

                {/* Variant */}
                <div className="relative">
                  <select value={slot.variantId} onChange={(e) => updateSlot(i, 'variantId', e.target.value)}
                    disabled={!slot.modelId}
                    className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-[#708ca4]/25 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 focus:ring-[#b48001] appearance-none disabled:opacity-40">
                    <option value="">Select Variant</option>
                    {slotVariants.map((v) => <option key={v._id} value={v._id}>{v.variantName} — {v.fuelType}/{v.transmissionType}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4] pointer-events-none" />
                </div>

                {/* Chosen preview */}
                {chosen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-3 bg-[#fafbf8] rounded-xl border border-[#708ca4]/10">
                    <img src={getImageUrl(chosen.variantImages?.[0]) || FALLBACK_IMAGE} alt=""
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#19456d] truncate">{chosen.variantName}</p>
                      <p className="text-[#b48001] text-xs font-bold">{formatCompactPrice(chosen.CSDPrice) || 'Price N/A'}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Add slot button */}
          {slots.length < MAX_COMPARE && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={addSlot}
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#708ca4]/30 rounded-2xl p-8 text-[#708ca4] hover:border-[#b48001] hover:text-[#b48001] transition-all group min-h-[200px]">
              <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-[#b48001]/8 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm">Add Another Car</span>
            </motion.button>
          )}
        </div>

        {/* Comparison table */}
        {activeVariants.length >= 2 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#708ca4]/15 overflow-hidden shadow-md">
            {/* Header row with images */}
            <div className="grid border-b border-[#708ca4]/10" style={{ gridTemplateColumns: `180px repeat(${selectedVariants.length}, 1fr)` }}>
              <div className="p-5 bg-[#19456d] flex items-center">
                <div className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-4 h-4 text-[#b48001]" />
                  <span className="font-bold text-sm">Specification</span>
                </div>
              </div>
              {selectedVariants.map((v, i) => (
                <div key={i} className={`p-5 text-center border-l border-[#708ca4]/10 ${!v ? 'opacity-30' : ''}`}>
                  {v ? (
                    <>
                      <img src={getImageUrl(v.variantImages?.[0]) || FALLBACK_IMAGE} alt=""
                        className="w-full h-28 object-contain mx-auto mb-3 rounded-xl" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
                      <p className="text-xs font-bold text-[#b48001] mb-0.5 truncate">{v.brandName}</p>
                      <p className="text-sm font-extrabold text-[#19456d] truncate">{v.variantName}</p>
                    </>
                  ) : (
                    <div className="h-28 flex items-center justify-center text-[#708ca4] text-sm">—</div>
                  )}
                </div>
              ))}
            </div>

            {/* Spec rows */}
            {SPEC_LABELS.map(([key, label], rowIdx) => (
              <div key={key} className={`grid border-b border-[#708ca4]/8 last:border-b-0 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#fafbf8]'}`}
                style={{ gridTemplateColumns: `180px repeat(${selectedVariants.length}, 1fr)` }}>
                <div className="px-5 py-3.5 text-sm font-semibold text-[#708ca4] border-r border-[#708ca4]/8 flex items-center">
                  {label}
                </div>
                {selectedVariants.map((v, i) => {
                  const val = getVal(v, key);
                  const highlight = isHighlighted(key, i);
                  return (
                    <div key={i} className={`px-5 py-3.5 text-sm font-bold text-center border-l border-[#708ca4]/8 ${highlight ? 'text-[#b48001] bg-[#b48001]/5' : 'text-[#19456d]'}`}>
                      {highlight && <span className="text-[10px] font-bold block text-[#b48001] mb-0.5">BEST</span>}
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#708ca4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-[#708ca4]" />
            </div>
            <h3 className="text-xl font-bold text-[#19456d] mb-2">Select at least 2 variants to compare</h3>
            <p className="text-[#708ca4] text-sm">Use the dropdowns above to pick cars for comparison</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
