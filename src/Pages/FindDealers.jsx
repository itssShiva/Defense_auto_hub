import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, Tv, Search, MapPin, Phone, Mail, Map, X, Star, Clock, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { getAllDealers } from '../auth/Api/auth.api';

const CATEGORIES = {
    all: { title: 'All Categories', icon: Search },
    cars: { title: 'Vehicles', icon: Car },
    bikes: { title: 'Bikes', icon: Bike },
    electronics: { title: 'Electronics', icon: Tv }
};

const FindDealers = () => {
    // Data & loading state
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter State
    const [filterState, setFilterState] = useState('All');
    const [filterCity, setFilterCity] = useState('All');
    const [filterBrand, setFilterBrand] = useState('All');

    // Modal State
    const [viewDealer, setViewDealer] = useState(null);
    const [contactDealer, setContactDealer] = useState(null);
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '' });
    const [contactSubmitted, setContactSubmitted] = useState(false);

    // Fetch dealers from backend on mount
    useEffect(() => {
        const fetchDealers = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllDealers();
                if (data?.success) {
                    setDealers(data.dealers || []);
                } else {
                    setError(data?.message || 'Failed to fetch dealers.');
                }
            } catch (err) {
                setError('Could not connect to the server. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchDealers();
    }, []);

    // Compute unique brands from fetched dealers
    const availableBrands = useMemo(() => {
        const brands = new Set();
        dealers.forEach(d => {
            (d.brandsHandled || []).forEach(b => {
                if (b?.brandName) brands.add(b.brandName);
            });
        });
        return ['All', ...Array.from(brands).sort()];
    }, [dealers]);

    // Compute unique states from fetched dealers
    const availableStates = useMemo(() => {
        const states = new Set(dealers.map(d => d.state).filter(Boolean));
        return ['All', ...Array.from(states).sort()];
    }, [dealers]);

    // Compute cities filtered by selected state
    const availableCities = useMemo(() => {
        const source = filterState === 'All' ? dealers : dealers.filter(d => d.state === filterState);
        const cities = new Set(source.map(d => d.city).filter(Boolean));
        return ['All', ...Array.from(cities).sort()];
    }, [dealers, filterState]);

    // Reset city when state changes
    const handleStateChange = (val) => {
        setFilterState(val);
        setFilterCity('All'); // clear city so it resets to the new state's cities
    };

    // Filtered dealers (client-side filtering on fetched data)
    const filteredDealers = useMemo(() => {
        return dealers.filter(dealer => {
            const matchState = filterState === 'All' || dealer.state === filterState;
            const matchCity = filterCity === 'All' || dealer.city === filterCity;
            const matchBrand = filterBrand === 'All' || (dealer.brandsHandled || []).some(b => b?.brandName === filterBrand);
            return matchState && matchCity && matchBrand;
        });
    }, [dealers, filterState, filterCity, filterBrand]);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log("=== DEALER CONTACT SUBMITTED ===");
        console.log("Dealer:", { id: contactDealer._id, name: contactDealer.dealerName, city: contactDealer.city });
        console.log("Form Data:", contactForm);
        console.log("================================");
        setContactSubmitted(true);
    };

    const closeContactModal = () => {
        setContactDealer(null);
        setContactForm({ name: '', email: '', phone: '' });
        setContactSubmitted(false);
    };

    return (
        <div className="min-h-screen bg-[#fafbf8] font-sans selection:bg-[#b48001] selection:text-white pb-24">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#19456d] pt-24 pb-20">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#b48001] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute top-40 -left-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }} />
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="px-4 py-1.5 rounded-full bg-white/10 text-[#b48001] text-sm font-bold tracking-wider uppercase border border-white/20 backdrop-blur-md mb-6 inline-block">
                            Authorized Dealerships
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                            Find CSD AFD Dealers <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-yellow-300">Near You</span>
                        </h1>
                        <p className="text-[#b8cede] max-w-xl mx-auto text-base font-medium">
                            Discover authorized dealerships offering exclusive subsidized rates for armed forces personnel.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT: Filters */}
                    <div className="w-full lg:w-72 shrink-0">
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-[#19456d]/5 sticky top-24">
                            <h2 className="text-lg font-extrabold text-[#19456d] mb-5 flex items-center gap-2">
                                <Search size={18} className="text-[#b48001]" /> Search Filters
                            </h2>

                            {/* State Filter */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-[#19456d] uppercase tracking-wider mb-2">State</label>
                                <div className="relative">
                                    <select
                                        value={filterState}
                                        onChange={(e) => handleStateChange(e.target.value)}
                                        className="w-full bg-[#fafbf8] border border-gray-200 rounded-xl py-3 pl-4 pr-9 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-2 focus:ring-[#b48001] appearance-none"
                                    >
                                        {availableStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-[#708ca4] pointer-events-none" />
                                </div>
                            </div>

                            {/* City Filter — cascades from selected State */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-[#19456d] uppercase tracking-wider mb-2">City</label>
                                <div className="relative">
                                    <select
                                        value={filterCity}
                                        onChange={(e) => setFilterCity(e.target.value)}
                                        disabled={filterState === 'All'}
                                        className="w-full bg-[#fafbf8] border border-gray-200 rounded-xl py-3 pl-4 pr-9 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-2 focus:ring-[#b48001] appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {availableCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-[#708ca4] pointer-events-none" />
                                </div>
                                {filterState === 'All' && (
                                    <p className="text-[10px] text-[#708ca4] mt-1 pl-1">Select a state first to filter by city</p>
                                )}
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-5">
                                <label className="block text-xs font-bold text-[#19456d] uppercase tracking-wider mb-2">Brand</label>
                                <div className="relative">
                                    <select
                                        value={filterBrand}
                                        onChange={(e) => setFilterBrand(e.target.value)}
                                        className="w-full bg-[#fafbf8] border border-gray-200 rounded-xl py-3 pl-4 pr-9 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-2 focus:ring-[#b48001] appearance-none"
                                    >
                                        {availableBrands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-[#708ca4] pointer-events-none" />
                                </div>
                            </div>

                            {/* Reset */}
                            {(filterState !== 'All' || filterCity !== 'All' || filterBrand !== 'All') && (
                                <button
                                    onClick={() => { setFilterState('All'); setFilterCity('All'); setFilterBrand('All'); }}
                                    className="w-full text-sm text-[#708ca4] hover:text-[#19456d] font-semibold py-2 border border-gray-200 rounded-xl transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Results */}
                    <div className="flex-1 min-w-0">

                        {/* Loading State */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-24 text-[#708ca4]">
                                <Loader2 size={40} className="animate-spin mb-4 text-[#b48001]" />
                                <p className="font-semibold">Fetching dealers...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {!loading && error && (
                            <div className="bg-white rounded-3xl p-10 text-center border border-red-100 shadow-sm">
                                <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-[#19456d] mb-1">Could not load dealers</h3>
                                <p className="text-[#708ca4] text-sm">{error}</p>
                            </div>
                        )}

                        {/* Results */}
                        {!loading && !error && (
                            <>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xl font-extrabold text-[#19456d]">
                                        {filteredDealers.length} {filteredDealers.length === 1 ? 'Dealer' : 'Dealers'} Found
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <AnimatePresence mode="popLayout">
                                        {filteredDealers.map(dealer => (
                                            <motion.div
                                                key={dealer._id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="bg-white rounded-2xl p-6 shadow-md shadow-black/5 border border-gray-100 flex flex-col"
                                            >
                                                {/* Header */}
                                                <div className="flex gap-4 items-start mb-4">
                                                    <img
                                                        src={dealer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(dealer.dealerName)}&background=19456d&color=fff&bold=true`}
                                                        alt={dealer.dealerName}
                                                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-gray-100 bg-gray-50"
                                                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dealer.dealerName)}&background=19456d&color=fff&bold=true`; }}
                                                    />
                                                    <div className="min-w-0">
                                                        <h4 className="text-base font-extrabold text-[#19456d] leading-tight mb-0.5 truncate">{dealer.dealerName}</h4>
                                                        <div className="flex items-center text-xs text-[#708ca4] gap-1 font-medium">
                                                            <MapPin size={12} /> <span className="truncate">{dealer.city}{dealer.state ? `, ${dealer.state}` : ''}</span>
                                                        </div>
                                                        {/* Brands */}
                                                        {dealer.brandsHandled?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {dealer.brandsHandled.slice(0, 3).map(b => (
                                                                    <span key={b._id || b.brandName} className="px-2 py-0.5 bg-[#fafbf8] border border-gray-200 text-[#19456d] text-[10px] font-bold rounded-md">
                                                                        {b.brandName}
                                                                    </span>
                                                                ))}
                                                                {dealer.brandsHandled.length > 3 && (
                                                                    <span className="px-2 py-0.5 bg-[#fafbf8] border border-gray-200 text-[#708ca4] text-[10px] font-bold rounded-md">
                                                                        +{dealer.brandsHandled.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Buttons */}
                                                <div className="mt-auto pt-4 border-t border-gray-50 flex gap-3">
                                                    <button
                                                        onClick={() => setViewDealer(dealer)}
                                                        className="flex-1 bg-white border-2 border-[#19456d] text-[#19456d] hover:bg-[#19456d] hover:text-white py-2.5 rounded-xl font-bold transition-colors text-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => { setContactDealer(dealer); setContactSubmitted(false); }}
                                                        className="flex-1 bg-[#b48001] hover:bg-[#c99200] text-white py-2.5 rounded-xl font-bold transition-colors text-sm shadow-[0_4px_14px_-4px_rgba(180,128,1,0.5)]"
                                                    >
                                                        Contact Dealer
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {filteredDealers.length === 0 && (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                        <Search size={40} className="text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-[#19456d] mb-1">No dealers found</h3>
                                        <p className="text-[#708ca4] text-sm">Try changing the city or clearing the brand filter.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* VIEW DETAILS MODAL */}
            <AnimatePresence>
                {viewDealer && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewDealer(null)} className="absolute inset-0 bg-[#19456d]/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#fafbf8]">
                                <h3 className="text-xl font-extrabold text-[#19456d]">Dealer Details</h3>
                                <button onClick={() => setViewDealer(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex gap-4 items-center">
                                    <img
                                        src={viewDealer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewDealer.dealerName)}&background=19456d&color=fff&bold=true`}
                                        alt={viewDealer.dealerName}
                                        className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(viewDealer.dealerName)}&background=19456d&color=fff&bold=true`; }}
                                    />
                                    <div>
                                        <h4 className="text-lg font-extrabold text-[#19456d]">{viewDealer.dealerName}</h4>
                                        <p className="text-sm text-[#708ca4] font-medium">{viewDealer.contactPerson}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 bg-[#fafbf8] rounded-2xl p-4">
                                    <div className="flex items-start gap-3 text-[#19456d]">
                                        <Map className="text-[#b48001] shrink-0 mt-0.5" size={18} />
                                        <span className="font-medium text-sm leading-relaxed">{viewDealer.address}, {viewDealer.city}, {viewDealer.state} – {viewDealer.pincode}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#19456d]">
                                        <Phone className="text-[#b48001] shrink-0" size={18} />
                                        <span className="font-medium text-sm">{viewDealer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#19456d]">
                                        <Mail className="text-[#b48001] shrink-0" size={18} />
                                        <span className="font-medium text-sm break-all">{viewDealer.email}</span>
                                    </div>
                                </div>
                                {viewDealer.brandsHandled?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-[#19456d] uppercase tracking-wider mb-2">Brands Handled</p>
                                        <div className="flex flex-wrap gap-2">
                                            {viewDealer.brandsHandled.map(b => (
                                                <span key={b._id || b.brandName} className="px-3 py-1 bg-[#19456d]/10 text-[#19456d] text-xs font-bold rounded-lg">
                                                    {b.brandName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => { setViewDealer(null); setContactDealer(viewDealer); setContactSubmitted(false); }}
                                    className="w-full bg-[#b48001] hover:bg-[#c99200] text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-[#b48001]/20"
                                >
                                    Contact this Dealer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CONTACT DEALER MODAL */}
            <AnimatePresence>
                {contactDealer && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeContactModal} className="absolute inset-0 bg-[#19456d]/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-extrabold text-[#19456d]">Contact Dealer</h3>
                                    <p className="text-xs font-semibold text-[#708ca4] mt-0.5">To: {contactDealer.dealerName}</p>
                                </div>
                                <button onClick={closeContactModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-6">
                                {contactSubmitted ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-extrabold text-[#19456d] mb-1">Request Sent!</h4>
                                        <p className="text-sm text-[#708ca4]">Your contact details have been submitted. The dealer will reach out to you shortly.</p>
                                        <button onClick={closeContactModal} className="mt-5 bg-[#19456d] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#11304d] transition-colors">Close</button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#19456d] uppercase tracking-wider mb-1.5">Your Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={contactForm.name}
                                                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                                className="w-full bg-[#fafbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-[#19456d] focus:outline-none focus:ring-2 focus:ring-[#b48001]"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#19456d] uppercase tracking-wider mb-1.5">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={contactForm.email}
                                                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                                className="w-full bg-[#fafbf8] border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-[#19456d] focus:outline-none focus:ring-2 focus:ring-[#b48001]"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#19456d] uppercase tracking-wider mb-1.5">Phone Number</label>
                                            <div className="relative">
                                                <Phone size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                                                <input
                                                    required
                                                    type="tel"
                                                    value={contactForm.phone}
                                                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                    className="w-full bg-[#fafbf8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#19456d] focus:outline-none focus:ring-2 focus:ring-[#b48001]"
                                                    placeholder="10-digit mobile number"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[#19456d] hover:bg-[#11304d] text-white py-3 rounded-xl font-bold transition-colors mt-1"
                                        >
                                            Submit Request
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default FindDealers;
