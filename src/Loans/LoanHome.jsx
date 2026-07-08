import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Percent,
    Zap,
    Wallet,
    ShieldCheck,
    CalendarRange,
    Home as HomeIcon,
    ArrowRight,
    Check,
    X,
    ChevronDown,
    Calculator,
    UserRound,
    Car,
    SlidersHorizontal,
    FileCheck2,
    KeyRound,
    Phone,
    MapPin,
    User,
    Info,
    Calendar,
    Sparkles,
    DollarSign,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const ICONS = {
    Percent,
    Zap,
    Wallet,
    ShieldCheck,
    CalendarRange,
    Home: HomeIcon,
};
const STEP_ICONS = { UserRound, Car, SlidersHorizontal, FileCheck2, KeyRound };

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
        <span className="inline-block font-bold text-xs tracking-[2px] uppercase rounded-full px-4 py-1.5 text-[#b48001] bg-[#b48001]/10 border border-[#b48001]/30 backdrop-blur-sm">
            {children}
        </span>
    );
}

// Renders a bank logo image with text fallback on error
function BankLogo({ src, alt, fallback, size = "md" }) {
    const [failed, setFailed] = useState(false);
    const dim = size === "sm" ? "h-6 w-6" : "h-8 w-8";
    const textSize = size === "sm" ? "text-[9px]" : "text-[10px]";
    return (
        <div className="h-full w-full flex items-center justify-center">
            {failed ? (
                <span className={`${textSize} font-extrabold text-white`}>{fallback}</span>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className={`${dim} object-contain`}
                    onError={() => setFailed(true)}
                />
            )}
        </div>
    );
}

function Hero({ onApply, onCalculate }) {
    return (
        <section className="relative overflow-hidden bg-[#19456d] text-white">
            {/* Dot grid background */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                }}
            />
            {/* Decorative blobs */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#b48001]/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#b48001]/15 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-0 lg:pt-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
                {/* Left: Text */}
                <div className="pb-20">
                    {/* Live rate pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6 bg-white/10 border border-white/20 rounded-full px-4 py-1.5"
                    >
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-xs tracking-widest uppercase text-slate-300">Rates from 8.65% p.a.</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-4xl lg:text-5xl text-white font-extrabold leading-[1.08] tracking-tight"
                    >
                        Drive home your
                        <br />
                        <span className="text-[#b48001]">dream car today.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-5 text-base text-slate-300 max-w-lg leading-relaxed"
                    >
                        Compare live car loan offers from HDFC, ICICI, SBI and more — side by side, in minutes, without visiting a single branch.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex flex-wrap gap-4"
                    >
                        <button
                            onClick={onApply}
                            className="group inline-flex items-center gap-2 bg-[#b48001] hover:bg-[#c99200] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(180,128,1,0.6)] hover:shadow-[0_12px_40px_-6px_rgba(180,128,1,0.7)] hover:-translate-y-0.5"
                        >
                            Check my eligibility
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={onCalculate}
                            className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/5 px-7 py-3.5 rounded-xl font-medium transition-all"
                        >
                            <Calculator size={18} /> EMI Calculator
                        </button>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="mt-10 grid grid-cols-3 gap-4"
                    >
                        {[
                            { n: "₹2,400 Cr+", l: "Disbursed", icon: "💰" },
                            { n: "8+", l: "Partner Banks", icon: "🏦" },
                            { n: "15 min", l: "Avg. Approval", icon: "⚡" },
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
                            { icon: "🔒", label: "RBI Compliant" },
                            { icon: "✅", label: "Zero Spam" },
                            { icon: "⭐", label: "4.9 Rated" },
                        ].map(({ icon, label }) => (
                            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                <span>{icon}</span> {label}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: Car image + floating UI cards */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative pb-0 hidden lg:block"
                >
                    {/* Car image */}
                    <motion.img
                        src="/loan_hero_car.png"
                        alt="Dream Car"
                        className="w-full max-w-xl mx-auto drop-shadow-2xl"
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Floating EMI card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="absolute top-6 -left-8 bg-white rounded-2xl px-5 py-4 shadow-2xl min-w-[160px]"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#708ca4] mb-1">Monthly EMI</p>
                        <p className="text-2xl font-extrabold text-[#19456d]">₹8,450</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-[11px] text-slate-400">At 8.65% p.a.</span>
                        </div>
                    </motion.div>

                    {/* Floating approval card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="absolute bottom-32 -right-4 bg-[#b48001] rounded-2xl px-5 py-4 shadow-2xl min-w-[170px]"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-white shrink-0" />
                            <div>
                                <p className="text-white font-extrabold text-sm">Pre-Approved!</p>
                                <p className="text-white/70 text-[11px]">In just 15 minutes</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating bank logos card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="absolute bottom-20 left-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-xl"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-2">Partner Banks</p>
                        <div className="flex gap-2">
                            {BANK_PARTNERS.slice(0, 4).map(b => (
                                <div key={b.name} className="h-8 w-8 bg-white rounded-lg overflow-hidden">
                                    <BankLogo src={b.logo} alt={b.name} fallback={b.fallback} size="sm" />
                                </div>
                            ))}
                            <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">+4</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Wave divider */}
            <div className="relative">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full -mb-1 block">
                    <path d="M0 60L1440 60L1440 20C1200 60 800 0 400 40C200 60 0 20 0 20L0 60Z" fill="#fafbf8" />
                </svg>
            </div>
        </section>
    );
}

// Ascending bar + bubble chart: market figures as hollow bars, CarHub's figure
// tall, solid and highlighted — mirrors the Cars24 "18% → 16% → 14% → 11%" motif.
function MetricBubbles({ metrics }) {
    const heights = [34, 52, 70, 92]; // % of track height, ascending left→right
    return (
        <div className="relative h-[320px] flex items-end justify-center gap-6 sm:gap-10 px-4">
            {metrics.map((m, i) => (
                <div
                    key={m.label}
                    className="flex flex-col items-center justify-end h-full"
                >
                    <motion.div
                        key={m.value}
                        initial={{ opacity: 0, y: 16, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.4,
                            delay: i * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`flex items-center justify-center rounded-full font-bold shrink-0 mb-2 ${m.isOurs
                            ? "h-20 w-20 sm:h-24 sm:w-24 text-base sm:text-lg bg-[#b48001] text-white shadow-[0_12px_30px_-8px_rgba(180,128,1,0.5)]"
                            : "h-14 w-14 sm:h-16 sm:w-16 text-xs sm:text-sm bg-white text-[#19456d] border-2 border-[#708ca4]/30"
                            }`}
                    >
                        {m.value}
                    </motion.div>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heights[i]}%` }}
                        transition={{
                            duration: 0.5,
                            delay: i * 0.06,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`w-px ${m.isOurs ? "bg-[#b48001]" : "bg-[#708ca4]/30"} border-l ${m.isOurs ? "" : "border-dashed"}`}
                    />
                    <span className="mt-3 text-[11px] font-medium text-[#708ca4] uppercase tracking-wide">
                        {m.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function Benefits() {
    const [active, setActive] = useState(0);
    const timerRef = useRef(null);
    const benefit = BENEFITS[active];

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActive((a) => (a + 1) % BENEFITS.length);
        }, 4500);
        return () => clearInterval(timerRef.current);
    }, []);

    const pick = (i) => {
        clearInterval(timerRef.current);
        setActive(i);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
            <Reveal>
                <SectionLabel>Why FoujiMart</SectionLabel>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#19456d] max-w-xl">
                    Exclusive benefits with our car loan
                </h2>
            </Reveal>

            <div className="mt-12 grid lg:grid-cols-2 gap-14 items-center">
                <div>
                    {/* Icon tab row */}
                    <div className="flex flex-wrap gap-3">
                        {BENEFITS.map((b, i) => {
                            const Icon = ICONS[b.icon];
                            const isActive = i === active;
                            return (
                                <button
                                    key={b.title}
                                    onClick={() => pick(i)}
                                    aria-label={b.short}
                                    className={`relative h-14 w-14 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive
                                        ? "border-[#b48001] bg-[#b48001]/10"
                                        : "border-[#708ca4]/30 bg-white hover:border-[#708ca4]/60"
                                        }`}
                                >
                                    <Icon
                                        size={20}
                                        className={isActive ? "text-[#b48001]" : "text-[#708ca4]"}
                                    />
                                    {isActive && (
                                        <motion.span
                                            layoutId="benefit-underline"
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#b48001]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="mt-9"
                        >
                            <h3 className="text-2xl font-extrabold text-[#b48001]">
                                {benefit.title}
                            </h3>
                            <p className="mt-3 text-[#708ca4] leading-relaxed max-w-md">
                                {benefit.desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress dots showing auto-advance */}
                    <div className="mt-8 flex gap-2">
                        {BENEFITS.map((_, i) => (
                            <span
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-[#19456d]" : "w-4 bg-[#708ca4]/25"}`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={benefit.title + "-chart"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MetricBubbles metrics={benefit.metrics} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

function Process() {
    const [active, setActive] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActive((a) => (a + 1) % PROCESS_STEPS.length);
        }, 3800);
        return () => clearInterval(timerRef.current);
    }, []);

    const pick = (i) => {
        clearInterval(timerRef.current);
        setActive(i);
    };

    return (
        <section className="bg-[#fafbf8] py-24">
            <div className="max-w-7xl h-90 mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-14">
                <Reveal>
                    <SectionLabel>The process</SectionLabel>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#19456d]">
                        Easy steps for your car loan
                    </h2>
                    <div className="mt-4 inline-flex items-center gap-2 text-[#19456d] text-xs tracking-widest uppercase font-bold">
                        <Zap size={14} className="fill-[#19456d] text-[#19456d]" />
                        Swift, simple & secure
                    </div>
                </Reveal>

                <div className="relative">
                    {PROCESS_STEPS.map((s, i) => {
                        const Icon = STEP_ICONS[s.icon];
                        const isActive = i === active;
                        const isLast = i === PROCESS_STEPS.length - 1;
                        return (
                            <div key={s.step} className="flex gap-5">
                                {/* Rail: number + connecting line */}
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        animate={{
                                            backgroundColor: isActive ? "#b48001" : "#FFFFFF",
                                            borderColor: isActive ? "#b48001" : "#708ca4",
                                            color: isActive ? "#ffffff" : "#708ca4",
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="h-10 w-10 shrink-0 rounded-full border-2 flex items-center justify-center font-mono text-sm font-semibold"
                                    >
                                        {s.step}
                                    </motion.div>
                                    {!isLast && (
                                        <motion.div
                                            animate={{
                                                backgroundColor: i < active ? "#b48001" : "#708ca4",
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="w-0.5 flex-1 my-1"
                                        />
                                    )}
                                </div>

                                {/* Step body */}
                                <button
                                    onClick={() => pick(i)}
                                    className="flex-1 text-left mb-4"
                                >
                                    <AnimatePresence initial={false} mode="wait">
                                        {isActive ? (
                                            <motion.div
                                                key="expanded"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{
                                                    duration: 0.35,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="overflow-hidden rounded-2xl bg-white border border-[#b48001]/30 shadow-[0_16px_40px_-24px_rgba(25,69,109,0.2)] p-6 flex items-center gap-5"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-[#19456d]">
                                                        {s.title}
                                                    </h3>
                                                    <p className="mt-1.5 text-sm text-[#708ca4] leading-relaxed">
                                                        {s.desc}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:flex h-16 w-16 rounded-xl bg-[#19456d] items-center justify-center shrink-0">
                                                    <Icon size={26} className="text-[#b48001]" />
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="collapsed"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="rounded-xl border border-slate-200 bg-white/60 px-5 py-3.5 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
                                            >
                                                {s.title}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Comparison() {
    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
            <Reveal>
                <SectionLabel>See the difference</SectionLabel>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#19456d] max-w-2xl">
                    FoujiMart vs. walking into a bank vs. other marketplaces.
                </h2>
            </Reveal>
            <Reveal custom={1} className="mt-12 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm min-w-[720px]">
                    <thead>
                        <tr className="bg-[#19456d] text-white">
                            <th className="text-left font-medium px-6 py-4 font-[Space_Grotesk]">
                                What matters
                            </th>
                            <th className="text-left font-bold px-6 py-4 text-[#b48001]">
                                FoujiMart
                            </th>
                            <th className="text-left font-medium px-6 py-4 text-slate-300 font-[Space_Grotesk]">
                                Direct bank
                            </th>
                            <th className="text-left font-medium px-6 py-4 text-slate-300 font-[Space_Grotesk]">
                                Other portals
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPARISON_ROWS.map((row, i) => (
                            <tr
                                key={row.label}
                                className={i % 2 ? "bg-slate-50" : "bg-white"}
                            >
                                <td className="px-6 py-4 text-slate-600 font-medium">
                                    {row.label}
                                </td>
                                <td className="px-6 py-4 font-bold text-[#b48001]">
                                    {typeof row.carhub === "boolean" ? (
                                        row.carhub ? (
                                            <Check size={18} className="text-[#b48001]" />
                                        ) : (
                                            <X size={18} className="text-slate-300" />
                                        )
                                    ) : (
                                        row.carhub
                                    )}
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">
                                    {typeof row.bank === "boolean" ? (
                                        row.bank ? (
                                            <Check size={18} className="text-slate-400" />
                                        ) : (
                                            <X size={18} className="text-slate-300" />
                                        )
                                    ) : (
                                        row.bank
                                    )}
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">
                                    {typeof row.other === "boolean" ? (
                                        row.other ? (
                                            <Check size={18} className="text-slate-400" />
                                        ) : (
                                            <X size={18} className="text-slate-300" />
                                        )
                                    ) : (
                                        row.other
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Reveal>
        </section>
    );
}

function BankPartners() {
    const loop = [...BANK_PARTNERS, ...BANK_PARTNERS];
    return (
        <section className="py-20 bg-[#19456d] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10 text-center">
                <h2 className="text-3xl font-extrabold text-white mb-3">
                    8+ banks compete for your loan.
                </h2>
                <p className="text-slate-400 text-base">You just fill one form — we do the rest.</p>
            </div>

            {/* Bank logos marquee */}
            <div className="relative">
                <div className="flex gap-4 w-max animate-[scroll_28s_linear_infinite]">
                    {loop.map((b, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-6 py-4 min-w-[220px]"
                        >
                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                <BankLogo src={b.logo} alt={b.name} fallback={b.fallback} />
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">{b.name}</div>
                                <div className="font-bold text-xs text-[#b48001]">
                                    from {b.rate}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats row */}
            <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: "💰", value: "₹2,400 Cr+", label: "Loans Disbursed" },
                    { icon: "🏦", value: "8+", label: "Partner Banks" },
                    { icon: "⚡", value: "15 min", label: "Avg Approval Time" },
                    { icon: "⭐", value: "4.9/5", label: "Customer Rating" },
                ].map(({ icon, value, label }) => (
                    <motion.div
                        key={label}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        viewport={{ once: true }}
                        className="bg-white/[0.07] border border-white/10 rounded-2xl p-5 text-center"
                    >
                        <div className="text-3xl mb-2">{icon}</div>
                        <div className="text-2xl font-extrabold text-white font-mono">{value}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">{label}</div>
                    </motion.div>
                ))}
            </div>



            <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
        </section>
    );
}

function FaqItem({ item, isOpen, onToggle }) {
    return (
        <div className="border-b border-slate-200">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-5 text-left"
            >
                <span className="font-bold text-[#19456d] pr-6">
                    {item.q}
                </span>
                <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#b48001] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <p className="pb-5 text-sm text-[#708ca4] leading-relaxed max-w-2xl">
                    {item.a}
                </p>
            </motion.div>
        </div>
    );
}

function Faq() {
    const [open, setOpen] = useState(0);
    return (
        <section className="max-w-4xl mx-auto px-6 lg:px-10 py-24">
            <Reveal>
                <SectionLabel>Questions</SectionLabel>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#19456d]">
                    Everything you're probably wondering.
                </h2>
            </Reveal>
            <Reveal custom={1} className="mt-10">
                {FAQS.map((item, i) => (
                    <FaqItem
                        key={item.q}
                        item={item}
                        isOpen={open === i}
                        onToggle={() => setOpen(open === i ? -1 : i)}
                    />
                ))}
            </Reveal>
        </section>
    );
}

function CtaBand({ onApply }) {
    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
            <Reveal className="rounded-3xl bg-linear-to-br from-[#19456d] to-[#12314e] px-8 py-16 sm:px-14 text-center relative overflow-hidden">
                <div className="absolute -top-20 -left-20 h-72 w-72 bg-[#b48001]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 h-48 w-48 bg-[#b48001]/10 rounded-full blur-3xl" />
                {/* Dashboard graphic */}
                <div className="flex justify-center mb-8">
                    <img src="/loan_stats_dashboard.png" alt="" className="h-36 object-contain opacity-80" />
                </div>
                <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
                    Your next car is one form away from a better rate.
                </h2>
                <p className="relative mt-4 text-white/70">
                    Free eligibility check. No branch visits. No paperwork you can't do from your phone.
                </p>
                {/* Mini trust chips */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    {["🔒 RBI Compliant", "✅ No credit score hit", "⚡ 15 min approval", "🏦 8+ partner banks"].map(t => (
                        <span key={t} className="bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full">{t}</span>
                    ))}
                </div>
                <button
                    onClick={onApply}
                    className="relative mt-8 inline-flex items-center gap-2 bg-[#b48001] hover:bg-[#c99200] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_8px_20px_-8px_rgba(180,128,1,0.6)] hover:shadow-[0_12px_30px_-6px_rgba(180,128,1,0.7)] hover:-translate-y-0.5"
                >
                    Start my application <ArrowRight size={18} />
                </button>
            </Reveal>
        </section>
    );
}

export default function CarLoanHome() {
    const navigate = useNavigate();
    return (
        <div className="bg-[#fafbf8] font-sans">
            <Hero
                onApply={() => navigate("/loan/eligibility-documents")}
                onCalculate={() => navigate("/loan/emi-calculator")}
            />
            <Benefits />
            <Process />
            <Comparison />
            <BankPartners />
            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-24 flex flex-wrap gap-4 justify-center">
                {/* <button
          onClick={() => navigate("/loan/eligibility-documents")}
          className="inline-flex items-center gap-2 border border-slate-300 hover:border-[#0E1A2B] px-6 py-3 rounded-xl font-medium text-[#0E1A2B] transition-colors"
        >
          View eligibility & documents <ArrowRight size={16} />
        </button> */}
            </div>
            <Faq />
            <CtaBand onApply={() => navigate("/loan/enquiry-form")} />
        </div>
    );
}

// Shared data for the Car Loan module — swap with API data when backend is ready.

const BANK_PARTNERS = [
    { name: "HDFC Bank", rate: "8.75%", logo: "/hdfc_logo.png", fallback: "HD" },
    { name: "ICICI Bank", rate: "8.90%", logo: "/icici_logo.png", fallback: "IC" },
    { name: "SBI", rate: "8.65%", logo: "/sbi_logo.png", fallback: "SB" },
    { name: "Axis Bank", rate: "9.05%", logo: "/axis_logo.png", fallback: "AX" },
    { name: "Kotak Mahindra", rate: "8.99%", logo: "/kotak_logo.png", fallback: "KO" },
    { name: "IDFC FIRST Bank", rate: "9.10%", logo: "/idfc_logo.png", fallback: "ID" },
    { name: "Bank of Baroda", rate: "8.70%", logo: "/bob_logo.png", fallback: "BB" },
    { name: "Tata Capital", rate: "9.25%", logo: "/tata_logo.png", fallback: "TA" },
];

// Each benefit drives the tab AND the bubble-chart visual on the right.
// `metrics`: ascending bars left→right; the last entry (isOurs: true) is the
// highlighted CarHub figure, the rest are what the market typically offers.
const BENEFITS = [
    {
        title: "Lowest interest rates",
        short: "Rates",
        desc: "Enjoy the lowest interest rates, starting from just 8.65%, making your dream car more affordable than ever.",
        icon: "Percent",
        metrics: [
            { value: "13.5%", label: "Bank A" },
            { value: "11.9%", label: "Bank B" },
            { value: "10.2%", label: "Bank C" },
            { value: "8.65%", label: "FoujiMart", isOurs: true },
        ],
    },
    {
        title: "Fastest approval",
        short: "Speed",
        desc: "Get pre-approved in as little as 15 minutes with a soft eligibility check — no branch visit, no waiting in line.",
        icon: "Zap",
        metrics: [
            { value: "72 hr", label: "Bank A" },
            { value: "48 hr", label: "Bank B" },
            { value: "24 hr", label: "Bank C" },
            { value: "15 min", label: "FoujiMart", isOurs: true },
        ],
    },
    {
        title: "Higher on-road funding",
        short: "Funding",
        desc: "Finance the full on-road price — insurance, RTO and accessories included — not just the ex-showroom amount.",
        icon: "Wallet",
        metrics: [
            { value: "75%", label: "Bank A" },
            { value: "85%", label: "Bank B" },
            { value: "90%", label: "Bank C" },
            { value: "100%", label: "FoujiMart", isOurs: true },
        ],
    },
    {
        title: "Zero hidden charges",
        short: "Charges",
        desc: "Every fee is disclosed upfront in your sanction letter, so what you're quoted is exactly what you pay.",
        icon: "ShieldCheck",
        metrics: [
            { value: "1.5%", label: "Bank A" },
            { value: "1.0%", label: "Bank B" },
            { value: "0.75%", label: "Bank C" },
            { value: "0.4%", label: "FoujiMart", isOurs: true },
        ],
    },
    {
        title: "Flexible tenure",
        short: "Tenure",
        desc: "Choose anywhere from 12 to 84 months and watch your EMI update live before you commit to a plan.",
        icon: "CalendarRange",
        metrics: [
            { value: "36 mo", label: "Bank A" },
            { value: "48 mo", label: "Bank B" },
            { value: "60 mo", label: "Bank C" },
            { value: "84 mo", label: "FoujiMart", isOurs: true },
        ],
    },
    {
        title: "Free doorstep service",
        short: "Doorstep",
        desc: "An agent collects and verifies your documents at home or work, at no extra cost to you.",
        icon: "Home",
        metrics: [
            { value: "₹999", label: "Bank A" },
            { value: "₹499", label: "Bank B" },
            { value: "₹199", label: "Bank C" },
            { value: "Free", label: "FoujiMart", isOurs: true },
        ],
    },
];

const PROCESS_STEPS = [
    {
        step: "01",
        title: "Share basic details",
        desc: "Enter a few personal & address details for us to check your eligibility.",
        icon: "UserRound",
    },
    {
        step: "02",
        title: "Add car details",
        desc: "Tell us the car, its on-road price, and whether it's new or used.",
        icon: "Car",
    },
    {
        step: "03",
        title: "Customise your offer",
        desc: "Pick a tenure and down payment, and compare live rates from every partner bank.",
        icon: "SlidersHorizontal",
    },
    {
        step: "04",
        title: "Upload documents",
        desc: "Submit KYC, income and address proof directly from your phone — no branch visit.",
        icon: "FileCheck2",
    },
    {
        step: "05",
        title: "Get funded & drive away",
        desc: "Receive your sanction letter digitally; funds are disbursed to the dealer on delivery day.",
        icon: "KeyRound",
    },
];

const FAQS = [
    {
        q: "How is my interest rate decided?",
        a: "Your rate depends on your credit score, income stability, loan tenure and the lender's current policy. We show you personalised rates from each partner after a soft eligibility check, which does not affect your credit score.",
    },
    {
        q: "Can I prepay or foreclose my car loan?",
        a: "Yes. Most of our partner banks allow part-prepayment or full foreclosure after 6 EMIs with little to no penalty. Exact terms vary by lender and are shown before you accept an offer.",
    },
    {
        q: "Is a down payment mandatory?",
        a: "Most lenders finance up to 90–100% of the on-road price, so a down payment isn't always mandatory, but paying 10–15% upfront usually gets you a better interest rate.",
    },
    {
        q: "What if I have a low credit score?",
        a: "You can still apply. Some partner lenders specialise in near-prime borrowers, though rates will be higher. Adding a co-applicant with stable income can also improve your offer.",
    },
    {
        q: "Does checking my eligibility affect my CIBIL score?",
        a: "No. Our eligibility check is a soft enquiry and does not impact your credit score. A hard enquiry only happens once you formally accept a lender's offer.",
    },
    {
        q: "Can I switch my existing car loan to a lower rate?",
        a: "Yes, this is called a balance transfer. If your current lender's rate is higher than what we quote, you can refinance the outstanding amount with a new lender at a lower rate.",
    },
];

const COMPARISON_ROWS = [
    { label: "Interest rate", carhub: "8.65% – 9.25%", bank: "9.25% – 11.50%", other: "9.00% – 10.75%" },
    { label: "Processing time", carhub: "Same day", bank: "3–7 working days", other: "1–3 working days" },
    { label: "Lenders compared", carhub: "8+ in one form", bank: "1 (branch only)", other: "3–4" },
    { label: "On-road funding", carhub: "Up to 100%", bank: "Up to 85%", other: "Up to 90%" },
    { label: "Processing fee", carhub: "0.4% (capped ₹5,999)", bank: "0.5% – 1%", other: "0.5% – 1.5%" },
    { label: "Doorstep service", carhub: true, bank: false, other: true },
    { label: "Prepayment charges", carhub: "Nil after 6 EMIs", bank: "2% – 4%", other: "1% – 3%" },
];



