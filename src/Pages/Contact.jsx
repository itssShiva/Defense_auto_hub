import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Smartphone, MessageSquare, ChevronRight, Clock, Headphones, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const contactInfo = [
    { icon: Headphones, label: 'Phone', value: '+91 123 456 7890', detail: 'Mon-Sat 9AM to 6PM', color: 'from-[#b48001] to-[#19456d]' },
    { icon: Mail, label: 'Email', value: 'support@foujiadda.com', detail: 'We reply within 24 hrs', color: 'from-[#19456d] to-[#708ca4]' },
    { icon: MapPin, label: 'Address', value: '123 Defence Colony, New Delhi, 110024', detail: 'Visit us anytime', color: 'from-[#708ca4] to-[#b48001]' },
];

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [focused, setFocused] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpSending, setOtpSending] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        console.log('Form submitted:', formData);
        setSubmitting(false);
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }, 4000);
    };

    const handleSendOtp = async () => {
        if (!formData.phone || formData.phone.length < 10) return;
        setOtpSending(true);
        await new Promise(r => setTimeout(r, 1200));
        setOtpSending(false);
        setOtpSent(true);
        setTimeout(() => setOtpSent(false), 3000);
    };

    const inputCls = (name) =>
        `w-full bg-white border-2 transition-all duration-300 rounded-xl px-4 py-3.5 text-[#19456d] font-medium outline-none ${focused === name ? 'border-[#b48001] shadow-lg shadow-[#b48001]/15 ring-1 ring-[#b48001]/30' : 'border-[#708ca4]/20 hover:border-[#708ca4]/40'} focus:border-[#b48001] focus:shadow-lg focus:shadow-[#b48001]/15 focus:ring-1 focus:ring-[#b48001]/30`;

    const labelCls = (name) =>
        `text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${focused === name ? 'text-[#b48001]' : 'text-[#19456d]/60'}`;

    return (
        <div className="min-h-screen bg-[#fafbf8] overflow-hidden">
            {/* ─── Hero ─── */}
            <section className="relative bg-[#19456d] pt-28 sm:pt-32 pb-28 sm:pb-36 px-4 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#b48001]/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#708ca4]/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#b48001]/10 rounded-full blur-[80px]"
                />
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [-30, 30, -30], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 4 + i * 1.5, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            width: `${4 + i * 3}px`, height: `${4 + i * 3}px`,
                            top: `${15 + i * 18}%`, left: `${10 + i * 15}%`,
                        }}
                    />
                ))}
                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#b48001]/15 backdrop-blur-sm text-[#b48001] text-xs font-bold rounded-full mb-6 uppercase tracking-[3px] border border-[#b48001]/20">
                            <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
                        </span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-5">
                        We'd Love to <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-amber-300">Hear</span> From You
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-[#708ca4] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question, feedback, or want to know more about our vehicles? Our team is ready to assist you.
                    </motion.p>
                </div>
                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto">
                        <path d="M0 80V40C240 0 480 60 720 40C960 20 1200 60 1440 30V80H0Z" fill="#fafbf8" />
                    </svg>
                </div>
            </section>

            {/* ─── Content ─── */}
            <div className="max-w-6xl mx-auto px-4 -mt-16 pb-28 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* ─── Contact Info Sidebar ─── */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
                        className="lg:col-span-2 space-y-6">
                        <motion.div variants={fadeUp}
                            className="bg-white rounded-3xl shadow-xl shadow-[#19456d]/5 border border-[#708ca4]/15 p-7 md:p-8 space-y-6 hover:shadow-2xl transition-shadow duration-500">
                            <div>
                                <h2 className="text-xl font-extrabold text-[#19456d]">Contact Information</h2>
                                <p className="text-[#708ca4] text-sm mt-1">Reach out through any of these channels</p>
                            </div>
                            <div className="space-y-4">
                                {contactInfo.map((item, i) => (
                                    <motion.div key={item.label} variants={fadeUp}
                                        whileHover={{ x: 6, scale: 1.01 }}
                                        className="group relative flex items-start gap-4 p-4 rounded-2xl bg-[#fafbf8] border border-[#708ca4]/10 hover:border-[#b48001]/40 transition-all duration-400 cursor-default overflow-hidden">
                                        <div className="absolute inset-0 bg-linear-to-br from-[#b48001]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                        <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-[#19456d]/5 to-[#b48001]/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-400 group-hover:shadow-lg group-hover:shadow-[#b48001]/10">
                                            <item.icon className="w-5 h-5 text-[#b48001] group-hover:rotate-[-8deg] transition-transform duration-400" />
                                        </div>
                                        <div className="relative">
                                            <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-[2px]">{item.label}</p>
                                            <p className="font-bold text-[#19456d] text-sm mt-0.5">{item.value}</p>
                                            <p className="text-xs text-[#708ca4] mt-1 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />{item.detail}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>


                    </motion.div>

                    {/* ─── Form ─── */}
                    <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-xl shadow-[#19456d]/5 border border-[#708ca4]/15 p-7 md:p-10 hover:shadow-2xl transition-shadow duration-500">
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col items-center justify-center py-16 text-center">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className="w-20 h-20 rounded-full bg-[#b48001]/10 flex items-center justify-center mb-6">
                                            <CheckCircle className="w-10 h-10 text-[#b48001]" />
                                        </motion.div>
                                        <h3 className="text-2xl font-extrabold text-[#19456d] mb-2">Message Sent!</h3>
                                        <p className="text-[#708ca4] max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-extrabold text-[#19456d] flex items-center gap-2">
                                                Send a Message <motion.span animate={{ rotate: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">✉️</motion.span>
                                            </h2>
                                            <p className="text-[#708ca4] text-sm mt-1">Fill in the form and we'll get back to you shortly</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {[{ name: 'name', label: 'Your Name', icon: MessageSquare, placeholder: 'John Doe' },
                                                { name: 'email', label: 'Email Address', icon: Mail, placeholder: 'john@example.com', type: 'email' }].map((field, i) => (
                                                    <motion.div key={field.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                                        className="space-y-1.5">
                                                        <label htmlFor={field.name} className={labelCls(field.name)}>{field.label}</label>
                                                        <div className="relative">
                                                            <field.icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focused === field.name ? 'text-[#b48001]' : 'text-[#708ca4]'}`} />
                                                            <input type={field.type || 'text'} id={field.name} name={field.name}
                                                                value={formData[field.name]} onChange={handleChange}
                                                                onFocus={() => setFocused(field.name)} onBlur={() => setFocused('')} required
                                                                className={`${inputCls(field.name)} pl-11`} placeholder={field.placeholder} />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                                className="space-y-1.5">
                                                <label htmlFor="phone" className={labelCls('phone')}>Mobile Number</label>
                                                <div className="relative">
                                                    <Smartphone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focused === 'phone' ? 'text-[#b48001]' : 'text-[#708ca4]'}`} />
                                                    <input type="tel" id="phone" name="phone" value={formData.phone}
                                                        onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData(prev => ({ ...prev, phone: v })); }}
                                                        onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                                                        maxLength={10} className={`${inputCls('phone')} pl-11 pr-36`} placeholder="9876543210" />
                                                    <motion.button type="button" onClick={handleSendOtp} disabled={formData.phone.length < 10 || otpSending || otpSent}
                                                        whileTap={{ scale: 0.96 }}
                                                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-md ${otpSent ? 'bg-green-500 text-white shadow-green-500/30' : formData.phone.length < 10 ? 'bg-[#708ca4]/20 text-[#708ca4] cursor-not-allowed' : 'bg-[#b48001] hover:bg-[#19456d] text-white shadow-[#b48001]/20 hover:shadow-lg'}`}>
                                                        {otpSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : otpSent ? <CheckCircle className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                                                        {otpSending ? 'Sending...' : otpSent ? 'Sent!' : 'Send OTP'}
                                                    </motion.button>
                                                </div>
                                            </motion.div>

                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                                className="space-y-1.5">
                                                <label htmlFor="subject" className={labelCls('subject')}>Subject</label>
                                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange}
                                                    onFocus={() => setFocused('subject')} onBlur={() => setFocused('')} required
                                                    className={inputCls('subject')} placeholder="How can we help you?" />
                                            </motion.div>

                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                                className="space-y-1.5">
                                                <label htmlFor="message" className={labelCls('message')}>Message</label>
                                                <textarea id="message" name="message" value={formData.message} onChange={handleChange}
                                                    onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                                                    required rows="5" className={`${inputCls('message')} resize-none`} placeholder="Write your message here..." />
                                            </motion.div>

                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                                <motion.button type="submit" disabled={submitting}
                                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                                    className="relative w-full py-4 bg-[#19456d] text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 overflow-hidden group text-base disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-[#19456d]/20 hover:shadow-[#b48001]/20">
                                                    <motion.span className="absolute inset-0 bg-linear-to-r from-[#b48001] to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                                    <span className="relative flex items-center gap-3">
                                                        {submitting ? (
                                                            <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                                                        ) : (
                                                            <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Send Message <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                                        )}
                                                    </span>
                                                </motion.button>
                                            </motion.div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                </div>
            </div>

        </div>
    );
};

export default Contact;
