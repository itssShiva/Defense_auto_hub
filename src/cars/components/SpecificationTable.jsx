import React from 'react';
import { motion } from 'framer-motion';

const SpecificationTable = ({ specs = [], title }) => {
  const validRows = specs.filter(
    ([, val]) => val !== null && val !== undefined && val !== ''
  );
  if (!validRows.length) return null;

  return (
    <div>
      {title && (
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-1 h-5 bg-[#b48001] rounded-full" />
          <h3 className="text-base font-bold text-[#19456d]">{title}</h3>
        </div>
      )}
      <div className="rounded-2xl border border-[#708ca4]/15 overflow-hidden">
        {validRows.map(([label, value], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.035, duration: 0.3 }}
            className={`flex items-start ${
              i % 2 === 0 ? 'bg-white' : 'bg-[#fafbf8]'
            } border-b border-[#708ca4]/8 last:border-b-0`}
          >
            <div className="w-2/5 px-4 py-3 text-sm font-semibold text-[#708ca4] border-r border-[#708ca4]/10 shrink-0">
              {label}
            </div>
            <div className="flex-1 px-4 py-3 text-sm font-bold text-[#19456d]">
              {value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpecificationTable;
