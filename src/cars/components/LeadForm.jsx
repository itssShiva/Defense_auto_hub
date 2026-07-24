import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, User, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useOtp } from '../../hooks/useOtp';

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

const INITIAL = { name: '', phone: '', email: '', message: '', otp: '' };

const LeadForm = ({ isOpen, onClose, type = 'bestPrice', carName = '', carId = '' }) => {
  const cfg = TYPES[type] || TYPES.bestPrice;
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { otpSent, otpVerified, otpSending, otpVerifying, resendTimer, sendOtp, resendOtp, verifyOtp, resetOtpState } = useOtp();

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

    if (!otpVerified) {
      toast.error("Please verify your phone number first");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/lead/create`, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        reason: form.message,
        leadType: type,
        ...(carId && { carId })
      });
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
    resetOtpState();
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };



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
                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, name: e.target.value }));
                          if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                        }}
                        placeholder="Your full name"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 transition-all
                          ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-[#708ca4]/30 focus:border-[#19456d] focus:ring-[#19456d]'}`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4] z-10" />
                        <input
                          type="tel"
                          value={form.phone}
                          disabled={otpVerified || otpSent}
                          onChange={(e) => {
                            setForm((p) => ({ ...p, phone: e.target.value }));
                            if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                          }}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          className={`w-full pl-10 pr-28 py-3 rounded-xl border bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 transition-all
                            ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-[#708ca4]/30 focus:border-[#19456d] focus:ring-[#19456d]'} disabled:bg-gray-100`}
                        />
                        {!otpSent && (
                          <button
                            type="button"
                            onClick={() => sendOtp(form.phone)}
                            disabled={otpSending}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#19456d] hover:bg-[#b48001] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                          >
                            {otpSending ? 'Sending...' : 'Send OTP'}
                          </button>
                        )}
                        {otpVerified && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold border border-green-200">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </div>
                        )}
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
                    </div>

                    {otpSent && !otpVerified && (
                      <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                        <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">Enter OTP *</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={form.otp}
                            onChange={(e) => setForm((p) => ({ ...p, otp: e.target.value }))}
                            placeholder="6-digit OTP"
                            maxLength={6}
                            className="flex-1 px-4 py-3 rounded-xl border border-[#708ca4]/30 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 focus:border-[#19456d] focus:ring-[#19456d]"
                          />
                          <button
                            type="button"
                            onClick={() => verifyOtp(form.phone, form.otp)}
                            disabled={otpVerifying || form.otp.length < 4}
                            className="px-6 py-3 bg-[#b48001] hover:bg-[#906601] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                          >
                            {otpVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                          </button>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => resendOtp(form.phone)}
                            disabled={resendTimer > 0 || otpSending}
                            className="text-xs font-bold text-[#19456d] hover:text-[#b48001] transition-colors disabled:opacity-50 disabled:hover:text-[#19456d]"
                          >
                            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, email: e.target.value }));
                          if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                        }}
                        required
                        placeholder="your@email.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 transition-all
                          ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-[#708ca4]/30 focus:border-[#19456d] focus:ring-[#19456d]'}`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
                  </div>

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
                    disabled={loading || !otpVerified}
                    className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-98 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
