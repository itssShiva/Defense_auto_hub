import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, Car, Package, Inbox } from 'lucide-react';

const ICONS = { search: SearchX, car: Car, package: Package, default: Inbox };

const EmptyState = ({
  icon = 'default',
  title = 'No results found',
  message = 'Try adjusting your search or filters.',
  action,
}) => {
  const Icon = ICONS[icon] || ICONS.default;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-[#708ca4]/10 flex items-center justify-center mb-6 ring-8 ring-[#708ca4]/5">
        <Icon className="w-11 h-11 text-[#708ca4]" />
      </div>
      <h3 className="text-2xl font-extrabold text-[#19456d] mb-2">{title}</h3>
      <p className="text-[#708ca4] text-base max-w-sm mb-8">{message}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="px-8 py-3 bg-[#b48001] text-white font-bold rounded-full hover:bg-[#19456d] transition-colors shadow-md"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
