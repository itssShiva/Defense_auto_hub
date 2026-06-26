import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';
import {
    Search, Shield, Car, Banknote, BadgeIndianRupee, Building2, ChevronRight,
    Heart, ArrowRight, ShieldCheck, ThumbsUp, Users, PenTool, CheckCircle, Plus, Minus, Mail, MapPin, Settings, Star, TrendingUp, Calendar, Zap
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// --- Shared Animations ---
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// --- Subcomponents ---

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FAF3CD]">
            {/* Animated Blobs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FA7D21]/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
            />
            <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FBC28A]/30 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-32 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 flex flex-col justify-center">
                        <motion.div variants={fadeUp} className="inline-block self-start px-4 py-2 rounded-full bg-[#FA7D21]/10 border border-[#FA7D21]/30 backdrop-blur-sm">
                            <span className="text-[#FA7D21] font-bold text-sm tracking-widest uppercase">Premium Automobile Marketplace</span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold text-[#673413] leading-[1.15]">
                            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FA7D21] to-[#673413]">Perfect Car</span> With Confidence
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-xl text-[#673413]/80 leading-relaxed max-w-xl">
                            Explore New Cars, Used Cars, Loans, Insurance, and exclusive CSD Prices from our network of Trusted Dealers.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 pt-4">
                            <button className="group relative overflow-hidden px-8 py-4 rounded-full font-bold text-[#FAF3CD] bg-[#FA7D21] shadow-[0_0_20px_rgba(250,125,33,0.3)] hover:shadow-[0_0_30px_rgba(250,125,33,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-[#FA7D21] to-[#673413] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center justify-center gap-2">
                                    Explore Cars <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            <button className="group relative px-8 py-4 rounded-full font-bold text-[#673413] border-2 border-[#673413]/20 hover:border-[#FA7D21] hover:text-[#FA7D21] transition-all duration-300 backdrop-blur-sm bg-white/10">
                                Compare Cars
                            </button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative w-full flex justify-center items-center"
                    >
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-full"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1592853625597-7d17be820d0c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3BvcnRzY2FyfGVufDB8fDB8fHww"
                                alt="Luxury Sports Car"
                                className="w-full h-72 md:h-96 object-cover drop-shadow-2xl rounded-[2.5rem]"
                            />
                        </motion.div>

                        {/* Floating Stats */}
                        <motion.div
                            animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-4 -left-6 md:-left-12 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#FA7D21]/20 flex items-center justify-center"><Car className="text-[#FA7D21] w-6 h-6" /></div>
                                <div>
                                    <p className="text-2xl font-black text-[#673413]">1000+</p>
                                    <p className="text-xs font-bold text-[#673413]/70 uppercase tracking-widest">Cars Listed</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute bottom-4 -right-6 md:-right-12 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#FBC28A]/50 flex items-center justify-center"><Star className="text-[#FA7D21] w-6 h-6" /></div>
                                <div>
                                    <p className="text-2xl font-black text-[#673413]">95%</p>
                                    <p className="text-xs font-bold text-[#673413]/70 uppercase tracking-widest">Satisfaction</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

const SmartSearch = () => {
    const [activeTab, setActiveTab] = useState('New Cars');
    const tabs = ['New Cars', 'Used Cars', 'CSD Cars'];

    return (
        <section className="relative z-20 -mt-16 max-w-5xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(103,52,19,0.1)] border border-white"
            >
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#FAF3CD]' : 'text-[#673413] hover:bg-[#FBC28A]/20'
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div layoutId="searchTab" className="absolute inset-0 bg-[#FA7D21] rounded-full -z-10" />
                            )}
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    {['Brand', 'Model', 'Budget', 'Fuel Type'].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label className="text-xs font-bold text-[#673413]/60 uppercase tracking-wider mb-2 ml-2">{field}</label>
                            <select className="bg-white border border-[#FBC28A]/50 rounded-2xl px-4 py-3 text-[#673413] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FA7D21] appearance-none cursor-pointer">
                                <option>Select {field}</option>
                            </select>
                        </div>
                    ))}
                    <button className="h-[50px] rounded-2xl bg-[#673413] text-[#FAF3CD] font-bold flex items-center justify-center gap-2 hover:bg-[#FA7D21] transition-colors shadow-lg group">
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" /> Search
                    </button>
                </div>
            </motion.div>
        </section>
    );
};

const FeaturedCategories = () => {
    const categories = [
        { name: 'New Cars', icon: Car },
        { name: 'Used Cars', icon: Settings },
        { name: 'Car Loan', icon: Banknote },
        { name: 'Insurance', icon: Shield },
        { name: 'CSD Price', icon: BadgeIndianRupee },
        { name: 'Dealers', icon: Building2 },
    ];

    return (
        <section className="py-24 bg-[#FAF3CD]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx} variants={fadeUp}
                            className="group cursor-pointer bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-[#FA7D21]/0 to-[#FA7D21]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-16 h-16 rounded-2xl bg-[#FAF3CD] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FA7D21]/10 transition-all duration-300 shadow-inner">
                                <cat.icon className="w-8 h-8 text-[#FA7D21]" />
                            </div>
                            <h3 className="font-bold text-[#673413] group-hover:text-[#FA7D21] transition-colors">{cat.name}</h3>
                            <div className="mt-4 w-8 h-1 bg-[#FBC28A] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const PopularBrands = () => {
    const brands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'Kia', 'MG', 'BMW', 'Mercedes', 'Audi', 'Skoda'];

    return (
        <section className="py-16 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#673413]">Popular Brands</h2>
            </div>
            <div className="relative flex overflow-x-hidden group">
                <div className="py-4 animate-marquee whitespace-nowrap flex gap-8 px-4 items-center group-hover:[animation-play-state:paused]">
                    {[...brands, ...brands].map((brand, idx) => (
                        <div key={idx} className="flex-none bg-white rounded-2xl px-8 py-6 shadow-sm border border-[#FBC28A]/20 hover:border-[#FA7D21] hover:shadow-md transition-all cursor-pointer flex items-center justify-center min-w-[200px]">
                            <span className="font-extrabold text-[#673413]/60 text-xl uppercase tracking-wider">{brand}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeaturedCars = () => {
    const cars = [
        { name: 'BMW X5', type: 'SUV', price: '₹95.90 Lakh', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' },
        { name: 'Mercedes C-Class', type: 'Sedan', price: '₹60.00 Lakh', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80' },
        { name: 'Audi Q7', type: 'SUV', price: '₹84.70 Lakh', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80' },
        { name: 'Toyota Fortuner', type: 'SUV', price: '₹33.43 Lakh', image: 'https://images.unsplash.com/photo-1619767886645-0ae16581bf6b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { name: 'Mahindra XUV700', type: 'SUV', price: '₹14.03 Lakh', image: 'https://www.mahindra.com/sites/default/files/social-thumbnail/XUV%20700%20%28955X736_0.jpg' },
        { name: 'Tata Safari', type: 'SUV', price: '₹15.65 Lakh', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-extrabold text-[#673413] mb-4">Featured Cars</h2>
                        <p className="text-[#673413]/70 font-medium">Discover our handpicked selection of premium vehicles.</p>
                    </div>
                    <button className="hidden md:flex font-bold text-[#FA7D21] items-center gap-2 hover:gap-3 transition-all">
                        View All <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
                    pagination={{ clickable: true }}
                    modules={[EffectCoverflow, Pagination]}
                    className="w-full pb-16!"
                >
                    {cars.map((car, idx) => (
                        <SwiperSlide key={idx} className="w-[350px]! md:w-[400px]!">
                            <div className="bg-[#FAF3CD]/50 rounded-3xl overflow-hidden border border-[#FBC28A]/30 group hover:shadow-2xl transition-all duration-500">
                                <div className="relative h-56 overflow-hidden">
                                    <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FA7D21] hover:text-white transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#673413]">
                                        {car.type}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-[#673413] mb-2">{car.name}</h3>
                                    <p className="text-xl font-extrabold text-[#FA7D21] mb-6">{car.price}</p>
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-[#673413] text-[#FAF3CD] py-3 rounded-xl font-bold hover:bg-[#FA7D21] transition-colors">View Details</button>
                                        <button className="px-4 border-2 border-[#673413]/20 rounded-xl hover:border-[#FA7D21] hover:text-[#FA7D21] text-[#673413] transition-colors">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

const CompareCarsBanner = () => {
    return (
        <section className="py-24 bg-[#FAF3CD] relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-[#FA7D21]/10 to-transparent" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-[#673413] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#FA7D21] rounded-full blur-[120px] opacity-20" />

                    <div className="flex-1 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Compare Multiple Cars Side by Side
                        </h2>
                        <p className="text-white/70 text-lg mb-8 max-w-md">
                            Make the right decision. Compare features, specs, and prices of your favorite cars instantly.
                        </p>
                        <button className="bg-[#FA7D21] text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#FA7D21] transition-colors flex items-center gap-2">
                            Start Comparing <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 relative z-10 w-full flex justify-center">
                        <div className="relative w-full max-w-sm h-64">
                            {/* Abstract visualization of 2 cars comparing */}
                            <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute left-0 top-10 w-48 h-32 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-xl z-20">
                                <div className="w-full h-1/2 bg-white/20 rounded-lg mb-2"></div>
                                <div className="w-2/3 h-4 bg-white/20 rounded"></div>
                            </motion.div>
                            <motion.div animate={{ x: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute right-0 bottom-10 w-48 h-32 bg-[#FA7D21]/20 backdrop-blur-md rounded-2xl border border-[#FA7D21]/40 p-4 shadow-xl z-10">
                                <div className="w-full h-1/2 bg-[#FA7D21]/30 rounded-lg mb-2"></div>
                                <div className="w-2/3 h-4 bg-[#FA7D21]/30 rounded"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CSDPricingHighlight = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    className="relative rounded-[2.5rem] overflow-hidden bg-linear-to-br from-[#1a2e1a] to-[#2a452a] p-10 md:p-16 text-center border-4 border-[#FAF3CD]"
                >
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <BadgeIndianRupee className="w-16 h-16 mx-auto text-[#FA7D21] mb-6" />
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#FAF3CD] mb-6">Exclusive CSD Pricing</h2>
                    <p className="text-lg text-[#FAF3CD]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Special discounted pricing exclusively for our Defence Personnel. Experience massive savings and a hassle-free buying process designed for heroes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-[#FAF3CD] text-[#1a2e1a] px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                            Explore CSD Prices
                        </button>
                        <button className="bg-transparent border-2 border-[#FA7D21] text-[#FA7D21] px-8 py-4 rounded-full font-bold hover:bg-[#FA7D21] hover:text-white transition-all">
                            Savings Calculator
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const LoanEMISection = () => {
    return (
        <section className="py-24 bg-[#FAF3CD]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-extrabold text-[#673413] mb-4">Finance Your Dream Car</h2>
                    <p className="text-[#673413]/70 font-medium text-lg">Instant approvals, lowest interest rates, and flexible EMI options.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'EMI Calculator', icon: Calendar, desc: 'Plan your monthly budget easily' },
                        { title: 'Loan Eligibility', icon: UserCircleIcon, desc: 'Check instantly in 2 minutes' },
                        { title: 'Lowest Interest', icon: TrendingUp, desc: 'Starting from 8.5% p.a.' },
                        { title: 'Instant Enquiry', icon: Zap, desc: 'Get a callback in 10 minutes' }
                    ].map((item, idx) => (
                        <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx} className="bg-white rounded-3xl p-8 hover:shadow-xl transition-shadow border border-[#FBC28A]/20 group">
                            <div className="w-14 h-14 bg-[#FA7D21]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FA7D21] transition-all">
                                <item.icon className="w-7 h-7 text-[#FA7D21] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#673413] mb-2">{item.title}</h3>
                            <p className="text-[#673413]/60 mb-6">{item.desc}</p>
                            <button className="text-[#FA7D21] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Check Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Fallback icon for UserCircleIcon since it might not be imported
const UserCircleIcon = Users;

const InsuranceSection = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="w-16 h-16 bg-[#FBC28A]/30 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-[#FA7D21]" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#673413] leading-tight">
                            Comprehensive Car Insurance
                        </h2>
                        <p className="text-lg text-[#673413]/70">
                            Protect your prized possession with our range of insurance plans tailored to your needs. Compare top providers and get instant policies.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {['New Insurance', 'Renewal', 'Third Party', 'Zero Depreciation'].map((type, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-[#FA7D21]" />
                                    <span className="font-bold text-[#673413]">{type}</span>
                                </div>
                            ))}
                        </div>
                        <button className="bg-[#673413] text-[#FAF3CD] px-8 py-4 rounded-full font-bold hover:bg-[#FA7D21] transition-colors shadow-lg">
                            Get Insurance Quote
                        </button>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="bg-[#FAF3CD] p-6 rounded-3xl mt-8">
                                <Shield className="w-10 h-10 text-[#FA7D21] mb-4" />
                                <h4 className="font-bold text-[#673413] text-lg">Cashless Repair</h4>
                                <p className="text-sm text-[#673413]/70 mt-2">Network of 5000+ garages</p>
                            </motion.div>
                            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="bg-[#FA7D21] p-6 rounded-3xl mb-8 shadow-xl shadow-[#FA7D21]/20">
                                <ThumbsUp className="w-10 h-10 text-white mb-4" />
                                <h4 className="font-bold text-white text-lg">Instant Claim</h4>
                                <p className="text-sm text-white/80 mt-2">100% digital process</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const WhyChooseUs = () => {
    const features = [
        { title: 'Verified Dealers', icon: ShieldCheck },
        { title: 'Best Prices', icon: Banknote },
        { title: 'Transparent Comparison', icon: Search },
        { title: 'Easy Loan', icon: TrendingUp },
        { title: 'Fast Test Drive', icon: Car },
        { title: 'Expert Support', icon: Users },
    ];

    return (
        <section className="py-24 bg-[#FAF3CD]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-[#673413] mb-16">Why Choose Defence Auto Hub</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feat, idx) => (
                        <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx} className="bg-white/60 backdrop-blur-sm border border-white/50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all group">
                            <feat.icon className="w-10 h-10 text-[#FA7D21] mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-[#673413] mb-3">{feat.title}</h3>
                            <p className="text-[#673413]/70">Experience seamless car buying with our premium features tailored for a superior experience.</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LatestBlogs = () => {
    const blogs = [
        { title: 'Best SUVs in India for 2026', category: 'Buying Guide', img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80' },
        { title: 'EV Buying Guide: Things to Know', category: 'Electric', img: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon-EV/11024/1755845297648/front-left-side-47.jpg' },
        { title: 'Maximizing Your Car Insurance', category: 'Insurance', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNQP1wOuBXM45idhIM3-rUxnmtPJQSL_Z4S0RjCUwrnVyOHwUeMNTZmDC&s=10' },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-4xl font-extrabold text-[#673413]">Latest Articles</h2>
                    <button className="text-[#FA7D21] font-bold hidden md:block hover:underline">View All Blogs</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, idx) => (
                        <div key={idx} className="group cursor-pointer">
                            <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                                <img src={blog.img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold text-[#FA7D21] uppercase tracking-wider">
                                    {blog.category}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-[#673413] mb-3 group-hover:text-[#FA7D21] transition-colors">{blog.title}</h3>
                            <p className="text-[#673413]/70 mb-4 line-clamp-2">Stay updated with the latest trends, guides, and tips from our automotive experts.</p>
                            <span className="text-[#FA7D21] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CustomerTestimonials = () => {
    return (
        <section className="py-24 bg-[#FAF3CD] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-[#673413] mb-16">What Our Customers Say</h2>

                <Swiper slidesPerView={1} spaceBetween={30} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} autoplay={{ delay: 3000 }} modules={[Autoplay]} className="pb-12">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <SwiperSlide key={i}>
                            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-xl relative mt-8">
                                <div className="absolute -top-8 left-8 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" />
                                </div>
                                <div className="flex gap-1 text-[#FA7D21] mb-6 mt-6">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-[#673413]/80 italic mb-6">"The experience was seamless. Comparing cars, checking CSD pricing, and finalizing the loan all happened in one place. Highly recommended!"</p>
                                <div>
                                    <h4 className="font-bold text-[#673413]">Major Raj Aryan</h4>
                                    <p className="text-sm text-[#FA7D21]">New Delhi</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

const StatisticsCounters = () => {
    // We'll use simple hardcoded numbers that we can animate via Framer if desired, or just static styled for now.
    const stats = [
        { num: '1000+', label: 'Cars Listed' },
        { num: '500+', label: 'Trusted Dealers' },
        { num: '15k+', label: 'Happy Customers' },
        { num: '50+', label: 'Auto Brands' },
    ];

    return (
        <section className="py-20 bg-white border-y border-[#FBC28A]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center">
                            <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linaer-to-r from-[#FA7D21] to-[#673413] mb-2">{stat.num}</h3>
                            <p className="font-bold text-[#673413]/70 uppercase tracking-widest text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQPreview = () => {
    const faqs = [
        "How to compare cars?",
        "How to apply for a loan?",
        "How does CSD pricing work?",
        "Can I book a test drive online?"
    ];

    return (
        <section className="py-24 bg-[#FAF3CD]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-[#673413] mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center group">
                            <h4 className="font-bold text-[#673413] text-lg">{faq}</h4>
                            <div className="w-8 h-8 rounded-full bg-[#FA7D21]/10 flex items-center justify-center group-hover:bg-[#FA7D21] transition-colors">
                                <Plus className="w-5 h-5 text-[#FA7D21] group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CallToAction = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-[#673413]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1500&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-linear-to-t from-[#673413] to-transparent" />
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <h2 className="text-5xl md:text-6xl font-black text-white mb-8">Ready to Find Your Dream Car?</h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button className="bg-[#FA7D21] text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(250,125,33,0.4)]">
                        Explore Cars Now
                    </button>
                    <button className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-[#673413] transition-colors">
                        Contact Dealer
                    </button>
                </div>
            </div>
        </section>
    );
};

const NewsletterSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <Mail className="w-12 h-12 text-[#FA7D21] mx-auto mb-6" />
                <h2 className="text-3xl font-extrabold text-[#673413] mb-4">Stay Updated</h2>
                <p className="text-[#673413]/70 mb-10 max-w-xl mx-auto">Subscribe to our newsletter for the latest car launches, exclusive offers, and automotive tips.</p>
                <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-2 p-2 bg-[#FAF3CD] rounded-full border border-[#FBC28A]/50 focus-within:ring-2 focus-within:ring-[#FA7D21] transition-all">
                    <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-6 py-3 text-[#673413] font-medium focus:outline-none placeholder:text-[#673413]/40" />
                    <button className="bg-[#673413] text-[#FAF3CD] px-8 py-3 rounded-full font-bold hover:bg-[#FA7D21] transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>
        </section>
    );
};

export default function Home() {
    // Global scroll progress could be used here for parallax if needed

    return (
        <div className="w-full bg-[#FAF3CD] font-sans overflow-x-hidden selection:bg-[#FA7D21] selection:text-white">
            <HeroSection />
            <SmartSearch />
            <FeaturedCategories />
            <PopularBrands />
            <FeaturedCars />
            <CompareCarsBanner />
            <CSDPricingHighlight />
            <LoanEMISection />
            <InsuranceSection />
            <WhyChooseUs />
            <LatestBlogs />
            <CustomerTestimonials />
            <StatisticsCounters />
            <CallToAction />
            <FAQPreview />
            <NewsletterSection />
        </div>
    );
}
