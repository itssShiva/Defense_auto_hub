import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, User, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TYPES = {
  bestPrice: {
    title: 'Get Best CSD Price',
    subtitle: "We'll share exclusive defence pricing with you",
    accent: '#b48001',
  },
  testDrive: {
    title: 'Book a Test Drive',
    subtitle: 'Schedule at your nearest authorised dealer',
    accent: '#19456d',
  },
  callback: {
    title: 'Request a Callback',
    subtitle: 'Our expert will reach you within 24 hours',
    accent: '#708ca4',
  },
};

const INITIAL = { name: '', phone: '', email: '', message: '' };

const LeadForm = ({ isOpen, onClose, type = 'bestPrice', carName = '' }) => {
  const cfg = TYPES[type] || TYPES.bestPrice;
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // TODO: Replace with actual API call → POST /api/v1/inquiry/create
      await new Promise((r) => setTimeout(r, 1600));
      setSuccess(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
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

  const Field = ({ name, label, type: inputType = 'text', placeholder, Icon }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />}
        <input
          type={inputType}
          value={form[name]}
          onChange={(e) => {
            setForm((p) => ({ ...p, [name]: e.target.value }));
            if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
          }}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 transition-all
            ${errors[name] ? 'border-red-400 focus:ring-red-400' : 'border-[#708ca4]/30 focus:border-[#19456d] focus:ring-[#19456d]'}`}
        />
      </div>
      {errors[name] && <p className="text-[11px] text-red-500 font-medium">{errors[name]}</p>}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4" style={{ background: `${cfg.accent}0d` }}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#19456d]">{cfg.title}</h2>
                  {carName && <p className="text-[#b48001] font-bold text-sm mt-0.5">{carName}</p>}
                  <p className="text-[#708ca4] text-sm mt-1">{cfg.subtitle}</p>
                </div>
                <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#708ca4]/12 hover:bg-red-100 text-[#708ca4] hover:text-red-500 transition-all ml-3 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {success ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#19456d] mb-2">Inquiry Submitted!</h3>
                  <p className="text-[#708ca4] text-sm mb-6">We'll get back to you shortly via call or WhatsApp.</p>
                  <button onClick={handleClose} className="px-8 py-3 bg-[#b48001] text-white font-bold rounded-full hover:bg-[#19456d] transition-colors">
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field name="name" label="Full Name *" placeholder="Your full name" Icon={User} />
                  <Field name="phone" label="Phone Number *" inputType="tel" placeholder="10-digit mobile number" Icon={Phone} />
                  <Field name="email" label="Email (Optional)" inputType="email" placeholder="your@email.com" Icon={Mail} />

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">Message (Optional)</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-[#708ca4]" />
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder="Any specific requirements or questions?"
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#708ca4]/30 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 focus:border-[#19456d] focus:ring-[#19456d] resize-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-98 mt-1"
                    style={{ background: `linear-gradient(135deg, ${cfg.accent}, #19456d)` }}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Submitting…' : cfg.title}
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

export default LeadForm;
