import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import { formatIndianPrice } from '../utils/helpers';

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
  if (!item) return null;

  const csdRows = [
    ['Ex-Showroom Price', item.ExShowroomPrice],
    ['RTO', item.RTO],
    ['Insurance', item.Insurance],
    ['Fast Tag Fee', item.FastTagFee],
    ['HP Endorsement Fee', item.HPEndorsementFee],
    ['HSRP Smart Card Fee', item.HSRPSMartCardTemporaryFee],
    ['On Road Price', item.OnRoadPrice, false],
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
      {item.Remarks && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">{item.Remarks}</p>
        </div>
      )}

      <PriceSection title="CSD Price Breakup" badge="For CSD beneficiaries" color="#b48001" rows={csdRows} />
      <PriceSection title="BH Scheme Pricing" badge="Bharat Series (BH) Registration" color="#19456d" rows={bhRows} />
      {item.civilExShowroomPrice && (
        <PriceSection title="Civil / Open Market" badge="Without CSD/BH concessions" color="#708ca4" rows={civilRows} />
      )}

      {item.Entitlement && (
        <div className="p-4 bg-[#fafbf8] rounded-xl border border-[#708ca4]/20">
          <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest mb-1">Entitlement</p>
          <p className="text-sm text-[#19456d] font-medium">{item.Entitlement}</p>
        </div>
      )}
    </div>
  );
};

export default PriceBreakup;
