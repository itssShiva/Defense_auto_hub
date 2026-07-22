
import React, { useMemo, useState } from "react";
import {
    ArrowRight, ShieldCheck, Info, CheckCircle2, XCircle,
    TrendingUp, AlertTriangle, ChevronDown, ChevronUp, BadgePercent, Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEPRECIATION_RATES = {
    "Rubber / Nylon / Plastic": { rate: 50, example: "Bumper, dashboard, tyres" },
    "Fibre / Glass": { rate: 30, example: "Windshield, body panels" },
    "Metal parts (general)": { rate: 0, example: "Engine block, chassis" },
    "Painting": { rate: 50, example: "Respray / touch-up" },
};
const CONSUMABLES_ADDON_RATE = 0.0012;
const ZERO_DEP_BASE_RATE = 0.003;
const ZERO_DEP_EXTRA_CLAIM_RATE = 0.0015;
const ZERO_DEP_UNLIMITED_RATE = 0.005;

const ELIGIBILITY_RULES = [
    { id: "age", label: "Vehicle age \u2264 5 years", check: (a) => a <= 5, failReason: "Zero Dep is only available for cars up to 5 years old." },
    { id: "type", label: "Private car (not commercial / two-wheeler)", check: (_, t) => t === "private-car", failReason: "Only private cars are eligible." },
    { id: "policy", label: "Comprehensive base policy", check: (_, __, p) => p === "comprehensive", failReason: "Zero Dep requires a Comprehensive base policy." },
];

function Tooltip({ text }) {
    const [open, setOpen] = useState(false);
    return (
        <span className="relative inline-block align-middle ml-1 cursor-pointer"
            onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <Info className="h-3.5 w-3.5 text-slate-400 inline" />
            {open && <span className="absolute z-50 left-5 -top-1 w-56 rounded-xl bg-slate-900 text-white text-[11px] px-3 py-2 shadow-xl leading-relaxed">{text}</span>}
        </span>
    );
}
function SectionLabel({ children }) {
    return <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4">{children}</p>;
}
function Field({ label, tooltip, children }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                {label}{tooltip && <Tooltip text={tooltip} />}
            </label>
            {children}
        </div>
    );
}
function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-800">{value}</span>
        </div>
    );
}
const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-[#234A73] focus:ring-2 focus:ring-[#234A73]/10 transition";
const selectCls = inputCls + " appearance-none cursor-pointer";

const ZeroDep = () => {
    const navigate = useNavigate();

    const [idvInput, setIdvInput] = useState(600000);
    const [vehicleYear, setVehicleYear] = useState(new Date().getFullYear() - 2);
    const [vehicleType, setVehicleType] = useState("private-car");
    const [policyType, setPolicyType] = useState("comprehensive");
    const [claimsAllowed, setClaimsAllowed] = useState("1");
    const [includeConsumables, setIncludeConsumables] = useState(false);
    const [selected, setSelected] = useState(true);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showSimulator, setShowSimulator] = useState(false);
    const [simRepairCost, setSimRepairCost] = useState(25000);

    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleYear;
    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

    const eligibilityResults = useMemo(() =>
        ELIGIBILITY_RULES.map(rule => ({ ...rule, passed: rule.check(vehicleAge, vehicleType, policyType) })),
        [vehicleAge, vehicleType, policyType]);
    const isEligible = eligibilityResults.every(r => r.passed);

    const depFactor = useMemo(() => {
        if (vehicleAge <= 1) return 0.9;
        if (vehicleAge === 2) return 0.8;
        if (vehicleAge === 3) return 0.7;
        return 0.5;
    }, [vehicleAge]);
    const estimatedIDV = Math.round(idvInput * depFactor);

    const zeroDepPremium = useMemo(() => {
        if (!selected || !isEligible) return 0;
        let rate = ZERO_DEP_BASE_RATE;
        if (claimsAllowed === "2") rate += ZERO_DEP_EXTRA_CLAIM_RATE;
        if (claimsAllowed === "unlimited") rate = ZERO_DEP_UNLIMITED_RATE;
        return Math.round(estimatedIDV * rate);
    }, [selected, isEligible, claimsAllowed, estimatedIDV]);

    const consumablesPremium = useMemo(() => {
        if (!includeConsumables || !isEligible) return 0;
        return Math.round(estimatedIDV * CONSUMABLES_ADDON_RATE);
    }, [includeConsumables, isEligible, estimatedIDV]);

    const totalAddonPremium = zeroDepPremium + consumablesPremium;
    const gst = Math.round(totalAddonPremium * 0.18);
    const addonTotal = totalAddonPremium + gst;

    const simResult = useMemo(() => {
        const rb = {
            "Rubber / Nylon / Plastic": Math.round(simRepairCost * 0.35),
            "Fibre / Glass": Math.round(simRepairCost * 0.25),
            "Metal parts (general)": Math.round(simRepairCost * 0.30),
            "Painting": Math.round(simRepairCost * 0.10),
        };
        let totalDed = 0;
        const lines = Object.entries(rb).map(([mat, cost]) => {
            const ded = Math.round(cost * (DEPRECIATION_RATES[mat].rate / 100));
            totalDed += ded;
            return { mat, cost, deduction: ded };
        });
        return { lines, claimWithout: simRepairCost - totalDed, claimWith: simRepairCost, savings: totalDed };
    }, [simRepairCost]);

    const handleContinue = () => {
        navigate(`/quotation-form?zeroDep=true&idv=${estimatedIDV}&claimsAllowed=${claimsAllowed}&consumables=${includeConsumables}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6">

                {/* Hero */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#B8860B]">Vehicle Add-on Cover</p>
                            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Zero Depreciation Cover</h1>
                            <p className="mt-2 max-w-xl text-sm text-slate-500 leading-relaxed">
                                Get the full repair amount without any deduction for depreciation on plastic, rubber, and fibre parts.
                            </p>
                        </div>
                        <div className="shrink-0 rounded-2xl bg-amber-50 border border-amber-100 px-5 py-4 text-right">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold">Add-on premium</p>
                            <p className="text-3xl font-black text-[#B8860B] mt-1">&#x20B9;{totalAddonPremium.toLocaleString()}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">+ &#x20B9;{gst.toLocaleString()} GST</p>
                        </div>
                    </div>
                    <div className="mt-6 rounded-2xl bg-[#234A73]/5 border border-[#234A73]/10 p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#234A73]" />
                            <div className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">Why it matters: </span>
                                Insurers deduct depreciation from claim payouts — 50% on plastic parts. If your bumper costs &#x20B9;15,000,
                                you get only &#x20B9;7,500 without Zero Dep. Zero Dep removes that deduction entirely.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionLabel>Configure your add-on</SectionLabel>
                    <div className="grid gap-5 lg:grid-cols-2">

                        <div className="space-y-4">
                            <Field label="Ex-Showroom Price (&#x20B9;)" tooltip="Original purchase price. Used to compute IDV and the zero-dep premium.">
                                <input type="number" min="100000" step="10000" value={idvInput}
                                    onChange={e => setIdvInput(Number(e.target.value))} className={inputCls} />
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Estimated IDV at {vehicleAge} yr:&nbsp;
                                    <strong className="text-slate-600">&#x20B9;{estimatedIDV.toLocaleString()}</strong>
                                    <Tooltip text={`IDV = Ex-showroom x ${Math.round(depFactor * 100)}% (IRDAI depreciation for ${vehicleAge}-yr-old car).`} />
                                </p>
                            </Field>
                            <Field label="Manufacturing year">
                                <select value={vehicleYear} onChange={e => setVehicleYear(Number(e.target.value))} className={selectCls}>
                                    {yearOptions.map(y => <option key={y} value={y}>{y} ({currentYear - y} yr old)</option>)}
                                </select>
                            </Field>
                            <Field label="Vehicle type">
                                <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className={selectCls}>
                                    <option value="private-car">Private car</option>
                                    <option value="two-wheeler">Two-wheeler</option>
                                    <option value="commercial">Commercial vehicle</option>
                                </select>
                            </Field>
                            <Field label="Base policy type">
                                <select value={policyType} onChange={e => setPolicyType(e.target.value)} className={selectCls}>
                                    <option value="comprehensive">Comprehensive</option>
                                    <option value="third-party">Third-party only</option>
                                </select>
                            </Field>
                        </div>

                        <div className="space-y-4">
                            {/* Eligibility */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Eligibility check</p>
                                <ul className="space-y-2.5">
                                    {eligibilityResults.map(r => (
                                        <li key={r.id} className="flex items-start gap-2 text-xs">
                                            {r.passed
                                                ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                                : <XCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />}
                                            <div>
                                                <span className={r.passed ? "text-slate-700" : "text-rose-600 font-semibold"}>{r.label}</span>
                                                {!r.passed && <p className="text-rose-400 text-[11px] mt-0.5">{r.failReason}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {isEligible
                                    ? <p className="mt-3 text-[11px] text-emerald-600 font-semibold bg-emerald-50 rounded-lg px-3 py-1.5">Your vehicle qualifies for Zero Dep cover.</p>
                                    : <p className="mt-3 text-[11px] text-rose-500 font-semibold bg-rose-50 rounded-lg px-3 py-1.5">Not eligible with the current configuration.</p>}
                            </div>

                            {/* Toggle */}
                            <div className={`rounded-2xl border p-4 transition ${isEligible ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60 pointer-events-none"}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">Include Zero Dep cover</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Removes depreciation deductions on claims</p>
                                    </div>
                                    <button type="button" onClick={() => isEligible && setSelected(s => !s)}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${selected && isEligible ? "bg-[#234A73]" : "bg-slate-300"}`}>
                                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${selected && isEligible ? "left-6" : "left-1"}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Claim slots */}
                            <Field label="Claim slots per year" tooltip="Number of zero-dep claims per policy year. More slots = higher premium.">
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { val: "1", label: "1 claim", sub: "standard" },
                                        { val: "2", label: "2 claims", sub: "+&#x20B9;" + Math.round(estimatedIDV * ZERO_DEP_EXTRA_CLAIM_RATE).toLocaleString() },
                                        { val: "unlimited", label: "Unlimited", sub: "max cover" },
                                    ].map(opt => (
                                        <button key={opt.val} type="button" onClick={() => setClaimsAllowed(opt.val)}
                                            className={`rounded-xl border py-2.5 text-center text-xs font-semibold transition ${claimsAllowed === opt.val ? "border-[#234A73] bg-[#234A73] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#234A73]/40"}`}>
                                            <div>{opt.label}</div>
                                            <div className={`text-[10px] mt-0.5 ${claimsAllowed === opt.val ? "text-blue-200" : "text-slate-400"}`} dangerouslySetInnerHTML={{ __html: opt.sub }} />
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        </div>
                    </div>

                    {/* Consumables */}
                    <div className={`mt-5 rounded-2xl border p-4 transition ${isEligible ? "border-amber-100 bg-amber-50/60" : "border-slate-100 bg-slate-50 opacity-60 pointer-events-none"}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={includeConsumables}
                                onChange={e => isEligible && setIncludeConsumables(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded accent-[#B8860B]" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Bundle Consumables Cover
                                        <Tooltip text="Covers nuts, bolts, engine oil, coolant, brake fluid (normally excluded). ~0.12% of IDV." />
                                    </p>
                                    {includeConsumables && isEligible && <span className="text-xs font-bold text-[#B8860B]">+&#x20B9;{consumablesPremium.toLocaleString()}</span>}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">Covers nuts, bolts, engine oil, coolant and brake fluid replaced during repair — excluded in standard claims.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Premium breakdown */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionLabel>Premium breakdown</SectionLabel>
                    <div className="divide-y divide-slate-100">
                        <Row label="Zero Dep premium" value={zeroDepPremium.toLocaleString()} />
                        {includeConsumables && isEligible && <Row label="Consumables cover" value={"&#x20B9;" + consumablesPremium.toLocaleString()} />}
                        <Row label="GST @ 18%" value={gst.toLocaleString()} />
                        <div className="flex items-center justify-between pt-4">
                            <span className="text-sm font-bold text-slate-900">Total add-on cost</span>
                            <span className="text-xl font-black text-[#B8860B]">&#x20B9;{addonTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                        <p className="text-xs font-bold text-slate-700 mb-3">IRDAI depreciation schedule (what is protected)</p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {Object.entries(DEPRECIATION_RATES).map(([mat, { rate, example }]) => (
                                <div key={mat} className="rounded-xl bg-white border border-slate-200 p-3">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-snug">{mat}</p>
                                    <p className="text-lg font-black text-rose-500 mt-1">{rate}%</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{example}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-[11px] text-slate-400">
                            Without Zero Dep, these percentages are <strong>deducted from your claim payout</strong>. Zero Dep eliminates those deductions.
                        </p>
                    </div>
                </div>

                {/* Simulator */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <button type="button" onClick={() => setShowSimulator(s => !s)} className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-[#234A73]/10 p-2"><TrendingUp className="h-5 w-5 text-[#234A73]" /></div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-900">Claim savings simulator</p>
                                <p className="text-xs text-slate-500">See exactly how much Zero Dep saves on a real repair bill</p>
                            </div>
                        </div>
                        {showSimulator ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </button>
                    {showSimulator && (
                        <div className="mt-5 space-y-4">
                            <Field label="Total repair bill (&#x20B9;)" tooltip="Slide to simulate a repair and see the payout difference.">
                                <input type="range" min="5000" max="200000" step="1000" value={simRepairCost}
                                    onChange={e => setSimRepairCost(Number(e.target.value))} className="w-full accent-[#234A73] h-2 rounded" />
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>&#x20B9;5,000</span>
                                    <span className="font-bold text-slate-700">&#x20B9;{simRepairCost.toLocaleString()}</span>
                                    <span>&#x20B9;2,00,000</span>
                                </div>
                            </Field>
                            <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                                            <th className="px-4 py-2.5 text-left font-bold">Part category</th>
                                            <th className="px-4 py-2.5 text-right font-bold">Cost</th>
                                            <th className="px-4 py-2.5 text-right font-bold text-rose-500">Dep. deducted</th>
                                            <th className="px-4 py-2.5 text-right font-bold text-emerald-600">Saved w/ ZD</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {simResult.lines.map(({ mat, cost, deduction }) => (
                                            <tr key={mat} className="bg-white">
                                                <td className="px-4 py-3 text-slate-700">{mat}</td>
                                                <td className="px-4 py-3 text-right text-slate-700">&#x20B9;{cost.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-rose-500 font-semibold">-&#x20B9;{deduction.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-emerald-600 font-semibold">+&#x20B9;{deduction.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-center">
                                    <p className="text-[10px] font-bold uppercase text-rose-400 tracking-wider mb-1">Without ZD</p>
                                    <p className="text-lg font-black text-rose-600">&#x20B9;{simResult.claimWithout.toLocaleString()}</p>
                                    <p className="text-[10px] text-rose-300 mt-0.5">After depreciation</p>
                                </div>
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                                    <p className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider mb-1">With ZD</p>
                                    <p className="text-lg font-black text-emerald-600">&#x20B9;{simResult.claimWith.toLocaleString()}</p>
                                    <p className="text-[10px] text-emerald-400 mt-0.5">Full amount</p>
                                </div>
                                <div className="rounded-2xl bg-[#234A73]/5 border border-[#234A73]/10 p-4 text-center">
                                    <p className="text-[10px] font-bold uppercase text-[#234A73]/70 tracking-wider mb-1">You save</p>
                                    <p className="text-lg font-black text-[#234A73]">&#x20B9;{simResult.savings.toLocaleString()}</p>
                                    <p className="text-[10px] text-[#234A73]/50 mt-0.5">per such claim</p>
                                </div>
                            </div>
                            {zeroDepPremium > 0 && (
                                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-2 text-xs text-amber-700">
                                    <BadgePercent className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>Break-even: You recover the &#x20B9;{zeroDepPremium.toLocaleString()} add-on cost if depreciation
                                        deductions on your claim exceed that amount. This simulator shows <strong>&#x20B9;{simResult.savings.toLocaleString()}</strong> saved on one such repair.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Coverage details */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionLabel>What is covered and excluded</SectionLabel>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-bold text-emerald-600 mb-3 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Covered</p>
                            <ul className="space-y-2 text-sm text-slate-600">
                                {[
                                    "Full replacement cost of plastic, rubber and fibre parts",
                                    "Paint and respray charges (no 50% deduction)",
                                    "Glass replacement at actual cost",
                                    "Metal parts always at 100% (unchanged)",
                                    ...(includeConsumables ? ["Consumables: nuts, bolts, engine oil, coolant, brake fluid"] : []),
                                ].map(item => <li key={item} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-rose-500 mb-3 flex items-center gap-1.5"><XCircle className="h-4 w-4" /> Excluded</p>
                            <ul className="space-y-2 text-sm text-slate-600">
                                {[
                                    "Engine damage due to waterlogging (needs Engine Protect cover)",
                                    "Mechanical or electrical breakdown",
                                    "Wear and tear over the policy period",
                                    "Claims beyond the selected slot limit",
                                    "Vehicles used for commercial purposes",
                                    ...(!includeConsumables ? ["Consumables — add Consumables Cover above to include"] : []),
                                ].map(item => <li key={item} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Terms + CTA */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    {!isEligible && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>Your current configuration does not meet eligibility criteria. Adjust the vehicle type, manufacturing year, or base policy above.</span>
                        </div>
                    )}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={acceptedTerms}
                            onChange={e => setAcceptedTerms(e.target.checked)} disabled={!isEligible}
                            className="mt-0.5 h-4 w-4 rounded accent-[#234A73] disabled:opacity-40" />
                        <span className="text-sm text-slate-600 leading-relaxed">
                            I confirm my vehicle is a private car under 5 years old with a comprehensive base policy. I understand Zero Dep is valid only for the selected claim slot(s) and depreciation tables follow IRDAI guidelines.
                        </span>
                    </label>
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs text-slate-400">Total add-on with GST</p>
                            <p className="text-xl font-black text-[#234A73]">&#x20B9;{addonTotal.toLocaleString()}</p>
                        </div>
                        <button onClick={handleContinue} disabled={!acceptedTerms || !isEligible || !selected}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#234A73] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1b365e] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 shadow-[0_8px_24px_-6px_rgba(35,74,115,0.4)] disabled:shadow-none">
                            <Zap className="h-4 w-4" />
                            Add and proceed to quotation
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-400">
                        Clicking above carries your Zero Dep selection into the quotation form automatically.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ZeroDep;
