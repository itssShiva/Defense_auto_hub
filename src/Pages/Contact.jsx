import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log('Form submitted:', formData);
        alert('Thank you for your message. We will get back to you soon!');
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-bg-light py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary-navy mb-4">Contact Us</h1>
                    <div className="w-24 h-1.5 bg-accent-gold mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-primary-navy/70 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary-slate/20">

                    {/* Contact Information */}
                    <div className="bg-primary-navy p-10 text-bg-light flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold rounded-full blur-[80px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-slate rounded-full blur-[60px] opacity-20 -translate-x-1/4 translate-y-1/4"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
                            <p className="text-bg-light/80 mb-12">
                                Fill up the form and our team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-accent-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Phone</h4>
                                        <p className="text-bg-light/80">+91 123 456 7890</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-accent-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Email</h4>
                                        <p className="text-bg-light/80">support@foujiadda.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-accent-gold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Address</h4>
                                        <p className="text-bg-light/80">123 Defence Colony,<br />New Delhi, 110024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 p-10 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-primary-navy/70 uppercase tracking-wider">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-bg-light border border-secondary-slate/30 rounded-xl px-4 py-3 text-primary-navy focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-primary-navy/70 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-bg-light border border-secondary-slate/30 rounded-xl px-4 py-3 text-primary-navy focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-bold text-primary-navy/70 uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-bg-light border border-secondary-slate/30 rounded-xl px-4 py-3 text-primary-navy focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-primary-navy/70 uppercase tracking-wider">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full bg-bg-light border border-secondary-slate/30 rounded-xl px-4 py-3 text-primary-navy focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full md:w-auto bg-primary-navy text-bg-light px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-gold transition-colors duration-300 shadow-lg"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
