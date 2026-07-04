import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Building2 } from 'lucide-react';

const DealerModal = ({ isOpen, onClose, dealer }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-[#19456d] p-6 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-extrabold mb-1">Dealer Information</h2>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Verified Seller</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {!dealer ? (
              <p className="text-center text-[#708ca4] py-4">Dealer details are not available for this car.</p>
            ) : (
              <>
                <div className="flex items-start gap-4 p-4 bg-[#fafbf8] border border-[#708ca4]/15 rounded-xl">
                  <User className="w-5 h-5 text-[#b48001] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider mb-0.5">Dealer Name</p>
                    <p className="text-sm font-bold text-[#19456d]">{dealer.dealerName || 'Unknown Dealer'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-[#fafbf8] border border-[#708ca4]/15 rounded-xl">
                  <Phone className="w-5 h-5 text-[#b48001] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider mb-0.5">Phone Number</p>
                    <a href={`tel:${dealer.phone}`} className="text-sm font-bold text-[#19456d] hover:text-[#b48001] transition-colors">
                      {dealer.phone || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#fafbf8] border border-[#708ca4]/15 rounded-xl">
                  <Mail className="w-5 h-5 text-[#b48001] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider mb-0.5">Email Address</p>
                    <a href={`mailto:${dealer.email}`} className="text-sm font-bold text-[#19456d] hover:text-[#b48001] transition-colors break-all">
                      {dealer.email || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#fafbf8] border border-[#708ca4]/15 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#b48001] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-sm font-bold text-[#19456d]">{dealer.city || dealer.location || 'N/A'}</p>
                  </div>
                </div>
              </>
            )}
            
            <button
              onClick={onClose}
              className="w-full mt-2 py-3.5 bg-[#19456d] text-white text-sm font-bold rounded-xl hover:bg-[#b48001] transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DealerModal;
