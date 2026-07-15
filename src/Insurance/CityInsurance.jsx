import React, { useState, useMemo } from "react";
import { MapPin, Shield, Zap, Wrench, Search, ArrowRight, ShieldAlert, CheckCircle2, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* --- Regional Data based on IRDAI Zones --- */
// Zone A: Higher traffic density & risk (Delhi, Mumbai, Kolkata, Chennai, Bangalore, Hyderabad, Pune, Ahmedabad)
// Zone B: Rest of India
const CITIES_DATABASE = [
    {
        name: "Delhi",
        code: "DL",
        state: "Delhi NCR",
        zone: "Zone A",
        riskLevel: "High",
        garages: 142,
        theftRisk: "Elevated",
        desc: "High traffic density. Premium loading applies due to Zone A classification."
    },
    {
        name: "Mumbai",
        code: "MH-01",
        state: "Maharashtra",
        zone: "Zone A",
        riskLevel: "High",
        garages: 185,
        theftRisk: "Moderate",
        desc: "Coastal climate & high density. Special engine protection recommended."
    },
    {
        name: "Bangalore",
        code: "KA-01",
        state: "Karnataka",
        zone: "Zone A",
        riskLevel: "High",
        garages: 156,
        theftRisk: "Moderate",
        desc: "Heavy traffic zone. High network of cashless EV-ready garages."
    },
    {
        name: "Ghaziabad",
        code: "UP-14",
        state: "Uttar Pradesh",
        zone: "Zone B",
        riskLevel: "Moderate",
        garages: 45,
        theftRisk: "Elevated",
        desc: "Zone B classification offers lower base premium than Delhi NCR."
    },
    {
        name: "Noida",
        code: "UP-16",
        state: "Uttar Pradesh",
        zone: "Zone B",
        riskLevel: "Moderate",
        garages: 62,
        theftRisk: "Moderate",
        desc: "Rapidly growing network. Standard Zone B premium rates apply."
    },
    {
        name: "Gurgaon",
        code: "HR-26",
        state: "Haryana",
        zone: "Zone B",
        riskLevel: "Moderate",
        garages: 58,
        theftRisk: "Moderate",
        desc: "High concentration of premium vehicle cashless workshops."
    },
    {
        name: "Lucknow",
        code: "UP-32",
        state: "Uttar Pradesh",
        zone: "Zone B",
        riskLevel: "Low",
        garages: 34,
        theftRisk: "Low",
        desc: "Standard risk profile. Favorable claim settlement ratios."
    },
    {
        name: "Pune",
        code: "MH-12",
        state: "Maharashtra",
        zone: "Zone A",
        riskLevel: "High",
        garages: 92,
        theftRisk: "Moderate",
        desc: "Zone A premium rates. Dense network of authorized service centers."
    },
    {
        name: "Other / Rest of India",
        code: "IND",
        state: "Any State",
        zone: "Zone B",
        riskLevel: "Standard",
        garages: "Pan-India",
        theftRisk: "Standard",
        desc: "Standard base premium applies. Enter exact RTO in the next step."
    }
];

const CityInsurance = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState(CITIES_DATABASE[0]);

    // Filter cities based on search
    const filteredCities = useMemo(() => {
        if (!searchQuery) return CITIES_DATABASE;
        const q = searchQuery.toLowerCase();
        return CITIES_DATABASE.filter(
            (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    const handleContinue = () => {
        // Pass selected city info to quotation form
        navigate(`/quotation-form?city=${encodeURIComponent(selectedCity.name)}&rto=${encodeURIComponent(selectedCity.code)}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* --- Hero Section --- */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#234A73]">Location-Based Pricing</p>
                            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">City & RTO Specific Insurance</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-500 leading-relaxed">
                                Premiums are directly impacted by your registration city. IRDAI divides India into Risk Zones (Zone A & B)
                                which dictates your Own Damage premium. Explore your local risk profile and cashless garage network below.
                            </p>
                        </div>
                        <div className="shrink-0 rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4 text-right">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-semibold">Selected RTO</p>
                            <p className="text-3xl font-black text-[#234A73] mt-1">{selectedCity.code}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{selectedCity.name}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">

                    {/* --- Left Column: Selection --- */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                Select Registration City
                            </label>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search city or RTO code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#234A73] focus:bg-white focus:ring-2 focus:ring-[#234A73]/10 transition"
                                />
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredCities.length > 0 ? (
                                    filteredCities.map((city) => (
                                        <div
                                            key={city.code}
                                            onClick={() => setSelectedCity(city)}
                                            className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedCity.code === city.code
                                                    ? "border-[#234A73] bg-[#234A73]/5 ring-1 ring-[#234A73]"
                                                    : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{city.name}</p>
                                                    <p className="text-[10px] text-slate-500">{city.state}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-mono font-bold text-[#234A73]">{city.code}</p>
                                                    <p className={`text-[9px] font-bold uppercase mt-0.5 ${city.zone === "Zone A" ? "text-rose-500" : "text-emerald-600"}`}>
                                                        {city.zone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center border rounded-xl border-dashed border-slate-300 bg-slate-50">
                                        <p className="text-sm text-slate-500 mb-3">No cities found matching "{searchQuery}"</p>
                                        <button 
                                            onClick={() => {
                                                setSearchQuery("");
                                                setSelectedCity(CITIES_DATABASE.find(c => c.code === "IND"));
                                            }}
                                            className="text-xs font-bold text-[#234A73] bg-white border border-[#234A73]/20 px-4 py-2 rounded-lg hover:bg-[#234A73]/5 transition"
                                        >
                                            Proceed with "Other / Rest of India"
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column: Insights --- */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Zone Insight Card */}
                        <div className={`rounded-3xl border p-6 shadow-sm transition-colors ${selectedCity.zone === "Zone A" ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
                            }`}>
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl shrink-0 ${selectedCity.zone === "Zone A" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold ${selectedCity.zone === "Zone A" ? "text-rose-900" : "text-emerald-900"}`}>
                                        {selectedCity.zone} Classification
                                    </h3>
                                    <p className={`mt-1 text-sm ${selectedCity.zone === "Zone A" ? "text-rose-700" : "text-emerald-700"}`}>
                                        {selectedCity.desc}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selectedCity.zone === "Zone A" ? "bg-rose-200/50 text-rose-800" : "bg-emerald-200/50 text-emerald-800"
                                            }`}>
                                            {selectedCity.zone === "Zone A" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            Base Premium: {selectedCity.zone === "Zone A" ? "Higher" : "Standard"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cashless Network</p>
                                    <Wrench className="h-4 w-4 text-amber-500" />
                                </div>
                                <p className="text-3xl font-black text-slate-900">{selectedCity.garages}</p>
                                <p className="text-xs text-slate-500 mt-1">Authorized workshops in {selectedCity.name}</p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Theft Risk Profile</p>
                                    <ShieldAlert className={`h-4 w-4 ${selectedCity.theftRisk === "Elevated" ? "text-rose-500" : "text-blue-500"}`} />
                                </div>
                                <p className="text-3xl font-black text-slate-900">{selectedCity.theftRisk}</p>
                                <p className="text-xs text-slate-500 mt-1">Based on regional claims data</p>
                            </div>
                        </div>

                        {/* Info list */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Why City Matters</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <Building2 className="h-4 w-4 text-[#234A73] shrink-0 mt-0.5" />
                                    <div className="text-sm text-slate-600">
                                        <span className="font-semibold text-slate-800">Zone-Based Own Damage Rate: </span>
                                        IRDAI mandates higher Own Damage rates for Zone A (Major Metros) due to traffic density. Zone B enjoys relatively lower rates.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Shield className="h-4 w-4 text-[#234A73] shrink-0 mt-0.5" />
                                    <div className="text-sm text-slate-600">
                                        <span className="font-semibold text-slate-800">Add-on Recommendations: </span>
                                        Cities prone to waterlogging (e.g., Mumbai) highly require Engine Protection cover. High-density cities benefit from Zero Dep.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-[#234A73] shrink-0 mt-0.5" />
                                    <div className="text-sm text-slate-600">
                                        <span className="font-semibold text-slate-800">Seamless Claims: </span>
                                        Selecting the correct RTO ensures faster surveyor assignment and access to local cashless networks.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-slate-900">Ready to calculate your premium?</p>
                                <p className="text-xs text-slate-500 mt-1">We will fetch the best rates for {selectedCity.name}.</p>
                            </div>
                            <button
                                onClick={handleContinue}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#234A73] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1b365e] shadow-[0_8px_24px_-6px_rgba(35,74,115,0.4)] shrink-0"
                            >
                                <Zap className="h-4 w-4" />
                                Proceed to Quote
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

// SVG Icon Helpers
function TrendingDown(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
            <polyline points="16 17 22 17 22 11" />
        </svg>
    );
}

export default CityInsurance;
