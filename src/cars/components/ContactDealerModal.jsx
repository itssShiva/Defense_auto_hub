import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MessageSquare, CheckCircle, Loader2, Building2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeads } from '../../leads/hooks/useLeads';

const INITIAL = { name: '', phone: '', email: '', reason: '' };

const REASONS = [
  'Interested in buying',
  'Request a test drive',
  'Ask about price / EMI',
  'Ask about vehicle condition',
  'Schedule a visit',
  'Other',
];

const Field = ({ name, label, inputType = 'text', placeholder, Icon, value, onChange, error }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />}
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border bg-[#fafbf8] text-[#19456d] font-medium text-sm focus:outline-none focus:ring-2 transition-all
          ${error
            ? 'border-red-400 focus:ring-red-300'
            : 'border-[#708ca4]/25 focus:border-[#19456d] focus:ring-[#19456d]/20 focus:bg-white'}`}
      />
    </div>
    {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
  </div>
);

const ContactDealerModal = ({ isOpen, onClose, carName = '', carId = null, dealer = null }) => {
  const { submitLead } = useLeads();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!form.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!carId || !dealer) {
      toast.error('Vehicle or Dealer information is missing.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        reason: form.reason,
        carId: carId,
        dealerId: dealer._id || dealer
      });

      if (res.success) {
        setSuccess(true);
      }
    } catch {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(INITIAL);
    setErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleFieldChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 28 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-br from-[#19456d] to-[#1a3a5c] p-6 text-white relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/25 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold leading-tight">Contact Dealer</h2>
                  {carName && (
                    <p className="text-[#b48001] font-bold text-sm mt-0.5 truncate max-w-[220px]">{carName}</p>
                  )}
                  <p className="text-white/65 text-xs mt-0.5">
                    {dealer?.dealerName || 'Our team will reach you shortly'}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#19456d] mb-2">Message Sent!</h3>
                  <p className="text-[#708ca4] text-sm mb-6">
                    The dealer will get back to you soon via call or WhatsApp.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-[#b48001] text-white font-bold rounded-full hover:bg-[#19456d] transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-[#708ca4] -mt-1 mb-2">
                    Fields marked <span className="text-red-500 font-bold">*</span> are required.
                  </p>

                  <Field
                    name="name"
                    label="Your Name"
                    placeholder="Enter your full name"
                    Icon={User}
                    value={form.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    error={errors.name}
                  />
                  <Field
                    name="phone"
                    label="Phone Number"
                    inputType="tel"
                    placeholder="10-digit mobile number"
                    Icon={Phone}
                    value={form.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    error={errors.phone}
                  />
                  <Field
                    name="email"
                    label="Email Address"
                    inputType="email"
                    placeholder="your@email.com"
                    Icon={Mail}
                    value={form.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    error={errors.email}
                  />

                  {/* Reason dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">
                      Reason for Contact
                      <span className="ml-1 text-[#b48001] font-medium normal-case tracking-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4] pointer-events-none" />
                      <select
                        value={form.reason}
                        onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#708ca4]/25 bg-[#fafbf8] text-[#19456d] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#19456d]/20 focus:border-[#19456d] focus:bg-white transition-all appearance-none"
                      >
                        <option value="">Select a reason…</option>
                        {REASONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-[#708ca4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 bg-linear-to-r from-[#b48001] to-[#19456d] hover:opacity-90 active:scale-[0.98] transition-all mt-2 shadow-md"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactDealerModal;
