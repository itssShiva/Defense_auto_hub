import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Tag, FastForward, Car, Bike, Tv, Search, MapPin, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const FindDealers = () => {
    const [activeCategory, setActiveCategory] = useState('cars');
    const [activeFaq, setActiveFaq] = useState(null);

    const benefits = [
        { icon: Tag, title: 'Subsidized Rates', desc: 'Exclusive tax-free pricing for armed forces personnel.' },
        { icon: Shield, title: 'No Hidden Costs', desc: 'Transparent pricing with absolutely zero hidden charges.' },
        { icon: FastForward, title: 'Priority Delivery', desc: 'Fast-tracked delivery process for our premium members.' }
    ];

    const categories = {
        cars: {
            title: 'Cars',
            icon: Car,
            brands: ['Maruti', 'Tata', 'Hyundai', 'Kia', 'Mahindra', 'Honda', 'Toyota']
        },
        bikes: {
            title: 'Bikes',
            icon: Bike,
            brands: ['Hero', 'Bajaj', 'Yamaha', 'Royal Enfield', 'TVS', 'Suzuki', 'Jawa', 'Honda']
        },
        electronics: {
            title: 'Electronics',
            icon: Tv,
            brands: ['Samsung', 'LG', 'IFB', 'Bosch', 'Whirlpool']
        }
    };

    const steps = [
        { title: 'Download or Visit', desc: 'Get the Fouji Adda app or visit our website.' },
        { title: 'Navigate to CSD', desc: 'Go to the CSD section in the main menu.' },
        { title: 'Select Category', desc: 'Choose Cars, Bikes, or AFD Electronics.' },
        { title: 'Enter Location', desc: 'Type in your city or pin code.' },
        { title: 'View Dealers', desc: 'Instantly get a list of authorized dealers near you.' },
        { title: 'Contact Dealer', desc: 'Click to view details and contact them for availability.' }
    ];

    const faqs = [
        { q: 'What is a CSD dealer?', a: 'A CSD dealer is an authorized dealership that offers products to armed forces personnel and their families at subsidized rates through the Canteen Stores Department (CSD).' },
        { q: 'Who can purchase products from a CSD dealer?', a: 'Armed forces personnel and their families who meet the eligibility criteria can purchase products from a CSD dealer. Eligibility may vary by category.' },
        { q: 'How can I find a CSD dealer in my area?', a: 'You can find a CSD dealer easily by using the Fouji Adda app or website. Our platform lists authorized dealerships based on your precise location.' },
        { q: 'What are the benefits of purchasing from a CSD dealer?', a: 'Benefits include subsidized rates, priority delivery, easy financing options, and no hidden costs.' },
        { q: 'Can I purchase products from a CSD dealer online?', a: 'No, you cannot purchase directly from a CSD dealer online. You must visit the authorized dealership in person, but orders are placed on the CSD AFD portal.' }
    ];

    return (
        <div className="min-h-screen bg-[#fafbf8] font-sans selection:bg-[#b48001] selection:text-white">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#19456d] pt-24 pb-32">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#b48001] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute top-40 -left-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-white/10 text-[#b48001] text-sm font-bold tracking-wider uppercase border border-white/20 backdrop-blur-md mb-6 inline-block">
                            Authorized Dealerships
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Find CSD AFD Dealers <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-yellow-300">Near You</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#708ca4] max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                            Discover authorized dealerships for Cars, Bikes, and Electronics offering exclusive subsidized rates for armed forces personnel.
                        </p>

                        {/* Search Bar Simulation */}
                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-linear-to-r from-[#b48001] to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl">
                                <div className="p-3 text-[#708ca4]">
                                    <MapPin size={24} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your city or pin code..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-lg text-[#19456d] font-medium placeholder-[#708ca4]/50 outline-none w-full"
                                />
                                <button className="bg-[#19456d] hover:bg-[#143655] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                                    <Search size={18} />
                                    <span className="hidden sm:inline">Search</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Benefits */}
            <section className="py-20 px-4 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-[#19456d]/5 group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-14 h-14 bg-[#fafbf8] rounded-2xl flex items-center justify-center mb-6 border border-[#708ca4]/20 group-hover:bg-[#19456d] transition-colors duration-300">
                                    <b.icon className="w-6 h-6 text-[#b48001]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#19456d] mb-3">{b.title}</h3>
                                <p className="text-[#708ca4] font-medium leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Showcase (Bento layout) */}
            <section className="py-20 px-4 bg-white border-t border-[#708ca4]/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#19456d] mb-4">Explore Dealerships</h2>
                        <p className="text-[#708ca4] text-lg max-w-2xl mx-auto">Browse authorized brands across premium vehicles and smart electronics.</p>
                    </div>

                    {/* Custom Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {Object.entries(categories).map(([key, cat]) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveCategory(key)}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all duration-300 ${isActive
                                        ? 'bg-[#19456d] text-white shadow-lg shadow-[#19456d]/20 scale-105'
                                        : 'bg-[#fafbf8] text-[#708ca4] hover:bg-gray-100 border border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-[#b48001]' : ''} />
                                    {cat.title}
                                </button>
                            );
                        })}
                    </div>

                    {/* Brands Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {categories[activeCategory].brands.map((brand, idx) => (
                                <Link to={activeCategory === 'cars' ? '/cars' : '#'} key={idx} className="block group">
                                    <div className="bg-[#fafbf8] border border-[#708ca4]/15 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-white hover:border-[#b48001]/50 hover:shadow-xl hover:shadow-[#b48001]/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                                            <span className="font-extrabold text-[#19456d] text-lg">{brand.charAt(0)}</span>
                                        </div>
                                        <span className="font-bold text-[#19456d]">{brand}</span>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Timeline / How it works */}
            <section className="py-24 px-4 bg-[#19456d] relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">How to Locate a Dealer</h2>
                        <p className="text-[#708ca4] text-lg max-w-2xl mx-auto">Follow these simple steps on Fouji Adda to find the nearest authorized CSD dealer.</p>
                    </div>

                    <div className="space-y-6">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-6 items-center bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors"
                            >
                                <div className="w-12 h-12 shrink-0 bg-linear-to-br from-[#b48001] to-yellow-500 rounded-full flex items-center justify-center text-white font-extrabold shadow-lg shadow-black/20">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">{step.title}</h4>
                                    <p className="text-[#708ca4] mt-1 text-sm md:text-base">{step.desc}</p>
                                </div>
                                <div className="ml-auto opacity-20 hidden sm:block">
                                    <CheckCircle2 size={32} className="text-[#b48001]" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#19456d] mb-4">Frequently Asked Questions</h2>
                        <p className="text-[#708ca4] text-lg max-w-2xl mx-auto">Everything you need to know about CSD Dealers.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => {
                            const isOpen = activeFaq === idx;
                            return (
                                <motion.div
                                    key={idx}
                                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#b48001] bg-[#fafbf8] shadow-md' : 'border-[#708ca4]/20 hover:border-[#708ca4]/50 bg-white'}`}
                                >
                                    <button
                                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <span className={`font-bold pr-4 ${isOpen ? 'text-[#b48001]' : 'text-[#19456d]'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#b48001] text-white' : 'bg-gray-100 text-[#19456d]'}`}>
                                            <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 pt-0 text-[#708ca4] leading-relaxed font-medium">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 bg-[#fafbf8]">
                <div className="max-w-5xl mx-auto bg-linear-to-r from-[#19456d] to-[#12314e] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to find your dealer?</h2>
                        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
                            Join the Fouji Adda community today and get access to exclusive military discounts, CSD dealers, and more.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/login" className="px-8 py-4 bg-[#b48001] hover:bg-yellow-600 text-white font-bold rounded-xl shadow-lg shadow-[#b48001]/30 transition-all flex items-center justify-center gap-2">
                                Get Started <ArrowRight size={18} />
                            </Link>
                            <Link to="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

// Quick ArrowRight icon since it wasn't imported from lucide-react in the top list
const ArrowRight = ({ size = 24, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default FindDealers;
