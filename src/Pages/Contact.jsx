import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Smartphone, MessageSquare, ChevronRight, Clock, Headphones } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [focused, setFocused] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message. We will get back to you soon!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const inputCls = (name) =>
        `w-full bg-white border-2 transition-all duration-300 rounded-xl px-4 py-3.5 text-[#19456d] font-medium outline-none ${focused === name ? 'border-[#b48001] shadow-lg shadow-[#b48001]/10' : 'border-[#708ca4]/20 hover:border-[#708ca4]/40'} focus:border-[#b48001] focus:shadow-lg focus:shadow-[#b48001]/10`;

    const labelCls = (name) =>
        `text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${focused === name ? 'text-[#b48001]' : 'text-[#19456d]/60'}`;

    const contactInfo = [
        { icon: Headphones, label: 'Phone', value: '+91 123 456 7890', detail: 'Mon-Sat 9AM to 6PM' },
        { icon: Mail, label: 'Email', value: 'support@foujiadda.com', detail: 'We reply within 24 hrs' },
        { icon: MapPin, label: 'Address', value: '123 Defence Colony,\nNew Delhi, 110024', detail: 'Visit us anytime' },
    ];

    const fadeUp = {
        initial: { opacity: 0, y: 24 },
        animate: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
    };

    return (
        <div className="min-h-screen bg-[#fafbf8]">
            {/* Hero */}
            <div className="relative bg-[#19456d] pt-28 pb-24 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#b48001]/15 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#708ca4]/15 rounded-full blur-[80px]" />
                    <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-[#b48001]/40 rounded-full" />
                    <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full" />
                    <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-[#b48001]/30 rounded-full" />
                </div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-[#b48001]/20 text-[#b48001] text-xs font-bold rounded-full mb-5 uppercase tracking-[3px]">
                        Get in Touch
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                        We'd Love to <span className="text-[#b48001]">Hear</span> From You
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-[#708ca4] text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question, feedback, or want to know more about our vehicles? Our team is ready to assist you.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-16 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* ─── Contact Info Sidebar ─── */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                        className="lg:col-span-2 space-y-5">
                        <div className="bg-white rounded-3xl shadow-xl shadow-[#19456d]/5 border border-[#708ca4]/15 p-7 space-y-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-[#19456d]">Contact Information</h2>
                                <p className="text-[#708ca4] text-sm mt-1">Reach out through any of these channels</p>
                            </div>
                            <div className="space-y-5">
                                {contactInfo.map((item, i) => (
                                    <div key={item.label}
                                        className="flex items-start gap-4 p-4 rounded-2xl bg-[#fafbf8] border border-[#708ca4]/10 hover:border-[#b48001]/30 hover:shadow-md transition-all duration-300 group">
                                        <div className="w-12 h-12 rounded-2xl bg-[#19456d]/5 flex items-center justify-center shrink-0 group-hover:bg-[#b48001]/10 transition-colors">
                                            <item.icon className="w-5 h-5 text-[#b48001]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#708ca4] uppercase tracking-wider">{item.label}</p>
                                            <p className="font-bold text-[#19456d] text-sm whitespace-pre-line mt-0.5">{item.value}</p>
                                            <p className="text-xs text-[#708ca4] mt-0.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />{item.detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#19456d] rounded-3xl p-7 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#b48001]/20 rounded-full blur-[60px]" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-[#b48001]/20 flex items-center justify-center mb-4">
                                    <MessageSquare className="w-6 h-6 text-[#b48001]" />
                                </div>
                                <h3 className="text-lg font-extrabold mb-2">Need Quick Help?</h3>
                                <p className="text-white/70 text-sm leading-relaxed mb-4">
                                    Our support team is available Monday to Saturday, 9 AM to 6 PM. We typically respond within 24 hours.
                                </p>
                                <div className="flex items-center gap-2 text-[#b48001] text-sm font-bold">
                                    Learn more <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── Form ─── */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-xl shadow-[#19456d]/5 border border-[#708ca4]/15 p-8 md:p-10">
                            <div className="mb-8">
                                <h2 className="text-2xl font-extrabold text-[#19456d]">Send a Message</h2>
                                <p className="text-[#708ca4] text-sm mt-1">Fill in the form and we'll get back to you shortly</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {['name', 'email'].map((field, i) => (
                                        <motion.div key={field} custom={i} variants={fadeUp} initial="initial" animate="animate" className="space-y-1.5">
                                            <label htmlFor={field} className={labelCls(field)}>
                                                {field === 'name' ? 'Your Name' : 'Email Address'}
                                            </label>
                                            <div className="relative">
                                                {field === 'name' ? (
                                                    <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
                                                ) : (
                                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
                                                )}
                                                <input
                                                    type={field === 'email' ? 'email' : 'text'}
                                                    id={field} name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocused(field)}
                                                    onBlur={() => setFocused('')}
                                                    required
                                                    className={`${inputCls(field)} ${field === 'name' ? 'pl-11' : 'pl-11'}`}
                                                    placeholder={field === 'name' ? 'John Doe' : 'john@example.com'}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div custom={2} variants={fadeUp} initial="initial" animate="animate" className="space-y-1.5">
                                    <label htmlFor="phone" className={labelCls('phone')}>Mobile Number</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
                                        <input
                                            type="tel" id="phone" name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onFocus={() => setFocused('phone')}
                                            onBlur={() => setFocused('')}
                                            maxLength={10}
                                            className={`${inputCls('phone')} pl-11 pr-28`}
                                            placeholder="9876543210"
                                        />
                                        <button type="button"
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#b48001] hover:bg-[#19456d] text-white text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md shadow-[#b48001]/20 hover:shadow-lg">
                                            <Smartphone className="w-3.5 h-3.5" />
                                            Send OTP
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.div custom={3} variants={fadeUp} initial="initial" animate="animate" className="space-y-1.5">
                                    <label htmlFor="subject" className={labelCls('subject')}>Subject</label>
                                    <input type="text" id="subject" name="subject"
                                        value={formData.subject} onChange={handleChange}
                                        onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                                        required
                                        className={inputCls('subject')}
                                        placeholder="How can we help you?" />
                                </motion.div>

                                <motion.div custom={4} variants={fadeUp} initial="initial" animate="animate" className="space-y-1.5">
                                    <label htmlFor="message" className={labelCls('message')}>Message</label>
                                    <textarea id="message" name="message"
                                        value={formData.message} onChange={handleChange}
                                        onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                                        required rows="5"
                                        className={`${inputCls('message')} resize-none`}
                                        placeholder="Write your message here..."></textarea>
                                </motion.div>

                                <motion.div custom={5} variants={fadeUp} initial="initial" animate="animate">
                                    <button type="submit"
                                        className="w-full py-4 bg-[#19456d] text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#b48001] transition-all duration-300 shadow-xl shadow-[#19456d]/20 hover:shadow-[#b48001]/20 group text-base">
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        Send Message
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Contact;