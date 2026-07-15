import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
    ArrowRight,
    ChevronDown,
    ChevronRight,
    ShieldCheck,
    RefreshCw,
    FileText,
    Layers,
    Shield,
    MapPin,
    Sparkles,
    Star,
    CheckCircle,
    Wrench,
    Zap,
    Scale,
    PhoneCall,
} from "lucide-react";
import {
    RATING,
    FAQS,
    WHY_CHOOSE,
    INSURANCE_PARTNERS,
} from "./InsuranceApi";
import { useNavigate } from "react-router-dom";

import image from "./images/Screenshot 2026-07-07 160506.png";
import ratingbanner from "./images/feec5f97-c104-4676-915c-32dae0cfb885Social proof.avif";
import { Link } from "react-router-dom";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    }),
};

function Reveal({ children, className, custom = 0 }) {
    return (
        <motion.div
            className={className}
            variants={fadeUp}
            custom={custom}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
        >
            {children}
        </motion.div>
    );
}

function SectionLabel({ children }) {
    return (
        <span className="inline-block font-bold text-xs tracking-[2px] uppercase rounded-full px-4 py-1.5 text-[#b48001] bg-[#b48001]/10 border border-[#b48001]/30">
            {children}
        </span>
    );
}

function CountUp({ target }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
        const steps = 60;
        const increment = numericTarget / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) { setCount(numericTarget); clearInterval(timer); }
            else setCount(current);
        }, 2000 / steps);
        return () => clearInterval(timer);
    }, [isInView, target]);

    const formatted = target.includes("+")
        ? `${Math.floor(count).toLocaleString()}+`
        : target.includes(".")
            ? count.toFixed(1)
            : Math.floor(count).toLocaleString();

    return <span ref={ref}>{formatted}</span>;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
    const navigate = useNavigate();
    return (
        <section className="relative overflow-hidden bg-[#19456d] text-white">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                }}
            />
            {/* Blobs */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#b48001]/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#b48001]/15 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-0 lg:pt-28 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
                {/* Left */}
                <div className="pb-20">
                    {/* Trust pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6 bg-white/10 border border-white/20 rounded-full px-4 py-1.5"
                    >
                        <Star className="w-3.5 h-3.5 fill-[#b48001] text-[#b48001]" />
                        <span className="font-mono text-xs tracking-widest uppercase text-slate-300">
                            {RATING?.score || 4.8} · {RATING?.count || "2,400+"} {RATING?.label || "Reviews"}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-[3.2rem] font-extrabold leading-[1.1] tracking-tight"
                    >
                        Car Insurance that's<br />
                        <span className="text-[#b48001]">there when it matters.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-5 text-base text-slate-300 max-w-lg leading-relaxed"
                    >
                        Compare comprehensive and third-party plans from 15+ insurers, renew in minutes,
                        and settle claims with a 98%+ success rate — all in one place.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex flex-wrap gap-4"
                    >
                        <button
                            onClick={() => navigate("/newCar-Insurance")}
                            className="group inline-flex items-center gap-2 bg-[#b48001] hover:bg-[#c99200] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(180,128,1,0.6)] hover:shadow-[0_12px_40px_-6px_rgba(180,128,1,0.7)] hover:-translate-y-0.5"
                        >
                            Get New Insurance
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={() => navigate("/insurance/renew")}
                            className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/5 px-7 py-3.5 rounded-xl font-medium transition-all"
                        >
                            <RefreshCw size={16} /> Renew Policy
                        </button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="mt-10 grid grid-cols-3 gap-4"
                    >
                        {[
                            { n: "15+", l: "Insurers", icon: "🏢" },
                            { n: "6000+", l: "Network Garages", icon: "🔧" },
                            { n: "98.6%", l: "Claim Settlement", icon: "✅" },
                        ].map(({ n, l, icon }) => (
                            <div key={l} className="bg-white/[0.07] border border-white/10 rounded-2xl px-4 py-4 text-center">
                                <div className="text-2xl mb-1">{icon}</div>
                                <div className="text-xl font-extrabold text-white font-mono">{n}</div>
                                <div className="text-[11px] text-slate-400 uppercase tracking-wide mt-0.5">{l}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-8 flex flex-wrap items-center gap-5"
                    >
                        {[
                            { icon: "🔒", label: "IRDAI Regulated" },
                            { icon: "✅", label: "Zero Spam" },
                            { icon: "⭐", label: `${RATING?.score || 4.8} Rated` },
                        ].map(({ icon, label }) => (
                            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                <span>{icon}</span> {label}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: hero image */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative pb-0 hidden lg:block"
                >
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-[#b48001]/20 rounded-3xl blur-2xl" />
                        <img
                            src={image}
                            alt="Car Insurance"
                            className="relative w-full rounded-3xl border border-white/10 shadow-2xl object-cover"
                        />
                    </motion.div>

                    {/* Floating card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="absolute top-6 -left-8 bg-white rounded-2xl px-5 py-4 shadow-2xl min-w-[160px]"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#708ca4] mb-1">Premium From</p>
                        <p className="text-2xl font-extrabold text-[#19456d]">₹2,094/yr</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-[11px] text-slate-400">Third-party cover</span>
                        </div>
                    </motion.div>

                    {/* Floating approval */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                        className="absolute bottom-10 -right-4 bg-[#b48001] rounded-2xl px-5 py-4 shadow-2xl"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle size={20} className="text-white shrink-0" />
                            <div>
                                <p className="text-white font-extrabold text-sm">Instant Policy!</p>
                                <p className="text-white/70 text-[11px]">In under 2 minutes</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Wave */}
            <div className="relative">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full -mb-1 block">
                    <path d="M0 60L1440 60L1440 20C1200 60 800 0 400 40C200 60 0 20 0 20L0 60Z" fill="#fafbf8" />
                </svg>
            </div>
        </section>
    );
}

// ─── Insurance Products ────────────────────────────────────────────────────────
function InsuranceProducts() {
    const navigate = useNavigate();
    const cards = [
        {
            title: "New Car Insurance",
            desc: "Full showroom value protection (Return-to-Invoice) for newly unregistered vehicles.",
            icon: Sparkles,
            accent: "bg-[#b48001]/10 text-[#b48001]",
            route: "/newCar-Insurance",
        },
        {
            title: "Fast-Track Renewal",
            desc: "No inspection required. Retain up to 50% No Claim Bonus on your active policy.",
            icon: RefreshCw,
            accent: "bg-[#19456d]/10 text-[#19456d]",
            route: "/insurance/renew",
        },
        {
            title: "Third Party Only",
            desc: "Legal minimum compliance required by Indian Motor Vehicles Act — affordable & instant.",
            icon: FileText,
            accent: "bg-emerald-50 text-emerald-600",
            route: "/quotation-form?tab=thirdparty",
        },
        {
            title: "Comprehensive Cover",
            desc: "Own damage, theft, disasters + Third-party liability with highly customized IDVs.",
            icon: Layers,
            accent: "bg-blue-50 text-blue-600",
            route: "/quotation-form?tab=comprehensive",
        },
        {
            title: "Zero Depreciation",
            desc: "Must-have addon for cars up to 5 years old. Save on plastic & fiber replacement costs.",
            icon: Shield,
            accent: "bg-rose-50 text-rose-500",
            route: "/insurance/zero-dep",
        },
        {
            title: "RTO Risk Zones",
            desc: "Calculate premiums based on local RTO risk weights and cashless workshop proximity.",
            icon: MapPin,
            accent: "bg-[#708ca4]/10 text-[#708ca4]",
            route: "/insurance/City",
        },
    ];

    return (
        <section className="py-24 bg-[#fafbf8]">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <Reveal className="text-center mb-14">
                    <SectionLabel>Our Services</SectionLabel>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#19456d] leading-tight">
                        Insure Your Car{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-[#19456d]">
                            The Right Way
                        </span>
                    </h2>
                    <p className="mt-3 text-[#708ca4] max-w-lg mx-auto text-sm leading-relaxed">
                        Choose from our comprehensive range of insurance products tailored for every need
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cards.map((card, i) => (
                        <Reveal key={card.title} custom={i}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(card.route)}
                                className="group relative bg-white p-6 rounded-2xl border border-[#708ca4]/15 cursor-pointer transition-all duration-300 hover:shadow-[0_12px_40px_-12px_rgba(25,69,109,0.15)] hover:border-[#b48001]/30 h-full"
                            >
                                {/* Gold top accent on hover */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#b48001] to-[#19456d] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                                <div className={`w-12 h-12 rounded-xl ${card.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <card.icon className="h-5 w-5" />
                                </div>

                                <h4 className="font-bold text-lg text-[#19456d] group-hover:text-[#b48001] transition-colors">
                                    {card.title}
                                </h4>
                                <p className="text-sm text-[#708ca4] mt-2 leading-relaxed">
                                    {card.desc}
                                </p>

                                <div className="mt-5 flex items-center text-sm font-bold text-[#b48001]">
                                    <span className="relative">
                                        Get Started
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b48001] group-hover:w-full transition-all duration-300" />
                                    </span>
                                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1.5 transition-transform" />
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Why Choose ───────────────────────────────────────────────────────────────
const ICON_MAP = { Scale, Zap, ShieldCheck, Wrench };

function WhyChoose() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <Reveal className="text-center mb-14">
                    <SectionLabel>Why Us</SectionLabel>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#19456d] leading-tight">
                        Why Choose{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-[#19456d]">
                            Fouji Mart
                        </span>
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(WHY_CHOOSE || []).map((w, i) => {
                        const Icon = ICON_MAP[w.icon] || Shield;
                        return (
                            <Reveal key={w.title} custom={i}>
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className="group bg-[#fafbf8] rounded-3xl p-7 text-center border border-[#708ca4]/15 hover:border-[#b48001]/30 transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(25,69,109,0.12)] h-full"
                                >
                                    <div className="mb-5 flex justify-center">
                                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
                                            <div className="absolute inset-0 bg-[#b48001]/10 rounded-2xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            {w.img ? (
                                                <img src={w.img} alt={w.title} className="relative h-36 w-auto object-contain" />
                                            ) : (
                                                <div className="relative h-14 w-14 rounded-2xl bg-[#b48001]/10 flex items-center justify-center">
                                                    <Icon className="h-7 w-7 text-[#b48001]" />
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                    <h3 className="font-bold text-[#19456d] text-lg group-hover:text-[#b48001] transition-colors duration-300">
                                        {w.title}
                                    </h3>
                                    <p className="mt-3 text-sm text-[#708ca4] leading-relaxed">
                                        {w.desc}
                                    </p>
                                </motion.div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ─── Partners Grid ────────────────────────────────────────────────────────────
function PartnersSlider() {
    const partners = INSURANCE_PARTNERS || [];
    if (partners.length === 0) return null;

    return (
        <section className="py-20 bg-[#19456d]">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <Reveal className="text-center mb-12">
                    <SectionLabel>Insurance Partners</SectionLabel>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                        Backed by India's{" "}
                        <span className="text-[#b48001]">Leading Insurers</span>
                    </h2>
                    <p className="mt-3 text-slate-400 max-w-md mx-auto text-sm">
                        Trusted partnerships with the most reputable insurance providers
                    </p>
                </Reveal>

                {/* Static grid — each logo renders exactly once */}
                <div className="flex flex-wrap justify-center gap-5">
                    {partners.map((p, i) => (
                        <Reveal key={p.name} custom={i}>
                            <motion.div
                                whileHover={{ y: -4, scale: 1.05 }}
                                className="group flex flex-col items-center gap-3 bg-white/[0.07] hover:bg-white/12 border border-white/10 hover:border-[#b48001]/40 rounded-2xl px-5 py-5 w-[140px] transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(180,128,1,0.2)]"
                            >
                                <div className="aspect-square w-full overflow-hidden rounded-xl bg-white flex items-center justify-center p-2">
                                    <img
                                        src={p.logo}
                                        alt={p.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                </div>
                                <div className="text-white/70 group-hover:text-white text-xs font-semibold text-center transition-colors leading-tight">
                                    {p.name}
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}


// ─── Rating Banner ────────────────────────────────────────────────────────────
function ReviewRating() {
    return (
        <section className="py-20 bg-[#fafbf8]">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <Reveal>
                    <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(25,69,109,0.15)] border border-[#708ca4]/15">
                        <img
                            src={ratingbanner}
                            alt="Customer Reviews & Ratings"
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#19456d]/20 via-transparent to-transparent" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqItem({ item, isOpen, onToggle }) {
    return (
        <div className="border-b border-[#708ca4]/15 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-5 text-left group"
            >
                <span className="font-semibold text-[#19456d] pr-6 group-hover:text-[#b48001] transition-colors text-sm sm:text-base">
                    {item.q}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-[#b48001] text-white" : "bg-[#b48001]/10 text-[#b48001]"
                        }`}
                >
                    <ChevronDown size={16} />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-sm text-[#708ca4] leading-relaxed max-w-2xl">
                            {item.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Faq() {
    const [open, setOpen] = useState(0);
    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-10">
                <Reveal className="text-center mb-12">
                    <SectionLabel>FAQ</SectionLabel>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#19456d] leading-tight">
                        Got Questions?{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-[#19456d]">
                            We've Got Answers
                        </span>
                    </h2>
                </Reveal>

                <Reveal custom={1}>
                    <div className="bg-[#fafbf8] rounded-3xl border border-[#708ca4]/15 p-6 sm:p-8 shadow-[0_8px_30px_-12px_rgba(25,69,109,0.08)]">
                        {(FAQS || []).map((item, i) => (
                            <FaqItem
                                key={item.q}
                                item={item}
                                isOpen={open === i}
                                onToggle={() => setOpen(open === i ? -1 : i)}
                            />
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CtaBanner() {
    const navigate = useNavigate();
    return (
        <section className="py-24 bg-[#fafbf8] relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-[#b48001]/10 to-transparent" />
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#19456d]/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"
            />

            <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
                <Reveal>
                    <SectionLabel>Get Protected Today</SectionLabel>
                    <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#19456d] leading-tight">
                        Don't drive without the{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#b48001] to-[#19456d]">
                            right coverage.
                        </span>
                    </h2>
                    <p className="mt-4 text-[#708ca4] text-lg max-w-xl mx-auto">
                        Compare plans, get instant quotes, and buy in minutes. 15+ insurers, one platform.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/quotation-form")}
                            className="group relative overflow-hidden px-8 py-4 rounded-full font-bold text-white bg-[#b48001] shadow-[0_0_20px_rgba(180,128,1,0.3)] hover:shadow-[0_0_30px_rgba(180,128,1,0.5)] transition-all duration-300 hover:-translate-y-1"
                        >
                            <span className="absolute inset-0 w-full h-full bg-linear-to-r from-[#b48001] to-[#19456d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Link to={"/quotation-form"} className="relative flex items-center justify-center gap-2">
                                Get Instant Quote <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </button>
                        <button
                            onClick={() => navigate("/insurance/renew")}
                            className="px-8 py-4 rounded-full font-bold text-[#19456d] border-2 border-[#19456d]/20 hover:border-[#b48001] hover:text-[#b48001] transition-all duration-300"
                        >
                            Renew Existing Policy
                        </button>
                    </div>

                    {/* Quick contact */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[#708ca4]">
                        <div className="flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-[#b48001]" />
                            <span>1800-XXX-XXXX (Toll Free)</span>
                        </div>
                        <div className="w-px h-4 bg-[#708ca4]/30 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>IRDAI Regulated • Paperless • Instant Policy</span>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function InsuranceHome() {
    return (
        <div className="bg-[#fafbf8]">
            <Hero />
            <InsuranceProducts />
            <WhyChoose />
            <PartnersSlider />
            <ReviewRating />
            <Faq />
            <CtaBanner />
        </div>
    );
}
