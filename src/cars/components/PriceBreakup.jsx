import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, MapPin } from 'lucide-react';
import { formatIndianPrice } from '../utils/helpers';
import { statesList, getCitiesForState, getRTORate } from '../../utils/rtoRates.js';

/* Single price row */
const PriceRow = ({ label, value, isTotal }) => {
  if (value === null || value === undefined || value === '') return null;
  const display = typeof value === 'number' ? formatIndianPrice(value) : value;
  return (
    <div
      className={`flex items-center justify-between py-3 ${isTotal
        ? 'border-t-2 border-[#b48001]/30 mt-1'
        : 'border-b border-[#708ca4]/8'
        } last:border-b-0`}
    >
      <span className={`text-sm ${isTotal ? 'font-extrabold text-[#19456d]' : 'text-[#708ca4] font-medium'}`}>
        {label}
      </span>
      <span className={`text-sm ${isTotal ? 'font-extrabold text-[#b48001] text-base' : 'font-bold text-[#19456d]'}`}>
        {display}
      </span>
    </div>
  );
};

/* Price section block */
const PriceSection = ({ title, badge, color, rows }) => {
  const valid = rows.filter(([, v]) => v !== null && v !== undefined && v !== '');
  if (!valid.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#708ca4]/15 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ background: `${color}10` }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Shield className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <h4 className="font-extrabold text-[#19456d] text-sm">{title}</h4>
          {badge && <p className="text-xs text-[#708ca4] mt-0.5">{badge}</p>}
        </div>
      </div>
      {/* Rows */}
      <div className="px-5 pb-4 pt-1">
        {valid.map(([label, value, isTotal], i) => (
          <PriceRow key={i} label={label} value={value} isTotal={isTotal} />
        ))}
      </div>
    </motion.div>
  );
};

const PriceBreakup = ({ item }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = useMemo(() => getCitiesForState(selectedState), [selectedState]);
  const rtoRate = useMemo(() => getRTORate(selectedState, selectedCity), [selectedState, selectedCity]);

  if (!item) return null;

  // Dynamic RTO Calculation
  const exShowroom = Number(item.ExShowroomPrice) || 0;
  let calcRTO = null;
  let calcOnRoad = null;

  if (exShowroom > 0 && selectedState) {
    calcRTO = Math.round((exShowroom * rtoRate) / 100);
    const otherFees = (Number(item.Insurance) || 0) + (Number(item.FastTagFee) || 0) + (Number(item.HPEndorsementFee) || 0) + (Number(item.HSRPSMartCardTemporaryFee) || 0);
    calcOnRoad = exShowroom + calcRTO + otherFees;
  }

  const csdRows = [
    ['Ex-Showroom Price', item.ExShowroomPrice],
    [`RTO (${selectedState ? rtoRate + '%' : 'Select State'})`, calcRTO !== null ? calcRTO : item.RTO], // Fallback to item.RTO if no state selected just in case
    ['Insurance', item.Insurance],
    ['Fast Tag Fee', item.FastTagFee],
    ['HP Endorsement Fee', item.HPEndorsementFee],
    ['HSRP Smart Card Fee', item.HSRPSMartCardTemporaryFee],
    ['On Road Price', calcOnRoad !== null ? calcOnRoad : item.OnRoadPrice, false],
    ['CSD Price', item.CSDPrice, true],
  ];

  const bhRows = [
    ['Ex-Showroom (BH)', item.ExShowroomPriceBH],
    ['BH Registration Cost', item.BHRegistrationCost],
    ['BH Insurance', item.BHInsurance],
    ['BH Registration Fee', item.BHRegistrationFee],
    ['BH Fast Tag Fee', item.BHFastTagFee],
    ['BH HP Endorsement Fee', item.BHHPEndorsementFee],
    ['BH HSRP Smart Card', item.BHHSRPSMartCardTemporaryFee],
    ['BH On Road Price', item.BHOnRoadPrice, true],
  ];

  const civilRows = [
    ['Civil Ex-Showroom Price', item.civilExShowroomPrice, true],
  ];

  return (
    <div className="space-y-4">
      
      {/* Location Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 rounded-2xl border border-amber-200 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-amber-600" />
          <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wide">
            Select Location for On-Road Price
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            >
              <option value="">Select State</option>
              {statesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">City (Optional)</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState || cities.length === 0}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{!selectedState ? "Select State First" : cities.length === 0 ? "No cities listed" : "All Cities (State Rate)"}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {selectedState && (
          <p className="mt-3 text-xs font-medium text-amber-700 bg-amber-100/50 inline-block px-3 py-1.5 rounded-lg">
            Calculating RTO at <strong>{rtoRate}%</strong> for <strong>{selectedCity || selectedState}</strong>
          </p>
        )}
      </motion.div>

      {item.Remarks && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">{item.Remarks}</p>
        </div>
      )}

      <PriceSection title="CSD Price Breakup" badge="For CSD beneficiaries" color="#b48001" rows={csdRows} />
      <PriceSection title="BH Scheme Pricing" badge="Bharat Series (BH) Registration" color="#19456d" rows={bhRows} />
      {item.civilExShowroomPrice && (
        <PriceSection title="Civil / Open Market" badge="Without CSD/BH concessions" color="#708ca4" rows={civilRows} />
      )}

      {item.Entitlement && (
        <div className="p-4 bg-[#fafbf8] rounded-xl border border-[#708ca4]/20 mt-4">
          <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest mb-1">Entitlement</p>
          <p className="text-sm text-[#19456d] font-medium">{item.Entitlement}</p>
        </div>
      )}
    </div>
  );
};

export default PriceBreakup;
