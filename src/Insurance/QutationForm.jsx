import React, { useState, useEffect } from "react";
import {
    Shield, Check, FileText, Sparkles, Car, MapPin, Clock, ShieldCheck,
    CreditCard, ChevronRight, User, Phone, Mail, AlertCircle, TrendingUp, Download, Zap, Loader2
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInsuranceWizard } from "./hooks/useInsuranceWizard";

export default function QutationForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialTab = new URLSearchParams(location.search).get("tab") === "thirdparty" ? "thirdparty" : "comprehensive";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    // Form states
    const [compData, setCompData] = useState({
        year: "", fullName: "", phone: "", city: "", ncb: "", zeroDep: false, rsa: false,
        engineProtect: false, email: "", aadhaar: "", address: "", nomineeName: "",
        relationship: "", nomineeAge: "", vehicleType: "", registrationNumber: "",
        registrationDate: "", rtoLocation: "", vehicleUsage: "", odometerReading: "",
        antiTheftDevice: "", previousPolicyNumber: "", claimHistory: "",
        reasonForSwitching: "", manualIdvOverride: "", policyTenure: "",
        personalAccident: false, returnToInvoice: false, ncbProtection: false,
        keyReplacement: false, tyreProtection: false, personalBelongings: false,
        dailyAllowance: false, declaration: false, consentInspection: false,
    });

    const [tpData, setTpData] = useState({
        year: "", fullName: "", phone: "", city: "", engineCapacity: "", paCover: false,
        email: "", nomineeName: "", address: "", aadhar: "", chassisNumber: "", policyTenure: "",
    });

    // DB Hook integration
    const {
        brands, brandsLoading,
        vehicles, vehiclesLoading, fetchVehicles,
        variantsLoading, fetchVariants,
        fuelTypes, variantsByFuel,
    } = useInsuranceWizard();

    // Vehicle selection state
    const [step, setStep] = useState("brand");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const [manualVehicle, setManualVehicle] = useState({
        brand: "", model: "", fuel: "", variant: "", exShowroomPrice: "", engineCc: ""
    });

    useEffect(() => {
        const tabParam = new URLSearchParams(location.search).get("tab");
        if (tabParam === "thirdparty" || tabParam === "comprehensive") {
            setActiveTab(tabParam);
        }
    }, [location.search]);

    // Pre-populate from Zero Dep or City Insurance pages
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        
        // Zero Dep Params
        const zeroDep     = params.get("zeroDep") === "true";
        const idv         = params.get("idv");
        const consumables = params.get("consumables") === "true";
        
        // City Insurance Params
        const city        = params.get("city");
        const rto         = params.get("rto");

        if (zeroDep) {
            setCompData((prev) => ({
                ...prev,
                zeroDep: true,
                ...(idv ? { manualIdvOverride: idv } : {}),
            }));
            if (consumables) {
                console.info("[ZeroDep] Consumables cover bundled — remind agent/insurer on submit.");
            }
        }

        if (city || rto) {
            setCompData((prev) => ({
                ...prev,
                ...(city ? { city } : {}),
                ...(rto ? { rtoLocation: rto } : {})
            }));
            setTpData((prev) => ({
                ...prev,
                ...(city ? { city } : {})
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const params = new URLSearchParams(location.search);
        params.set("tab", tab);
        navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
    };

    const handleCompChange = (field, value) => setCompData((prev) => ({ ...prev, [field]: value }));
    const handleTpChange = (field, value) => setTpData((prev) => ({ ...prev, [field]: value }));
    const handleManualChange = (field, value) => setManualVehicle((prev) => ({ ...prev, [field]: value }));

    // Vehicle DB selection flow
    const onBrandSelect = (brand) => {
        setSelectedBrand(brand); setSelectedVehicle(null); setSelectedFuel(null); setSelectedVariant(null);
        fetchVehicles(brand._id); setStep("vehicle");
    };
    const onVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle); setSelectedFuel(null); setSelectedVariant(null);
        fetchVariants(vehicle._id); setStep("fuel");
    };
    const onFuelSelect = (fuel) => { setSelectedFuel(fuel); setSelectedVariant(null); setStep("variant"); };
    const onVariantSelect = (variant) => { setSelectedVariant(variant); setStep("form"); };

    const parseSafeNum = (val, fallback = 0) => {
        if (!val) return fallback;
        const cleaned = String(val).replace(/[^\d.]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? fallback : num;
    };

    // Unified pricing
    const calculateComprehensive = () => {
        if (step !== "form" && step !== "manual_entry") {
            return { idv: 0, ownDamage: 0, ncbDiscount: 0, netOwnDamage: 0, thirdPartyBase: 0, addons: 0, gst: 0, totalPremium: 0 };
        }

        let baseIDV = 600000; // fallback default

        // Use exact Ex-Showroom if variant selected, or manual entry if provided
        if (selectedVariant?.ExShowroomPrice) {
            baseIDV = parseSafeNum(selectedVariant.ExShowroomPrice, 600000);
        } else if (step === "manual_entry" && manualVehicle.exShowroomPrice) {
            baseIDV = parseSafeNum(manualVehicle.exShowroomPrice, 600000);
        }

        const age = 2026 - parseSafeNum(compData.year, 2026);
        let depFactor = 0.9;
        if (age === 1) depFactor = 0.8;
        if (age === 2) depFactor = 0.7;
        if (age >= 3) depFactor = 0.5;

        const finalIDV = Math.round(baseIDV * depFactor);
        let ownDamage = Math.round(finalIDV * 0.02);

        const ncbPercent = parseSafeNum(compData.ncb, 0);
        const ncbDiscount = Math.round(ownDamage * (ncbPercent / 100));
        const netOwnDamage = Math.max(0, ownDamage - ncbDiscount);

        let thirdPartyBase = 3416; // default middle bucket
        let engineStr = "";
        if (selectedVariant?.Engine) engineStr = String(selectedVariant.Engine);
        else if (step === "manual_entry" && manualVehicle.engineCc) engineStr = manualVehicle.engineCc;

        const ccMatch = engineStr.match(/\d+/);
        const cc = ccMatch ? parseInt(ccMatch[0]) : 1200;

        if (cc < 1000) thirdPartyBase = 2094;
        else if (cc >= 1000 && cc <= 1500) thirdPartyBase = 3416;
        else if (cc > 1500) thirdPartyBase = 7890;

        let addons = 0;
        if (compData.zeroDep) addons += Math.round(finalIDV * 0.003);
        if (compData.rsa) addons += 450;
        if (compData.engineProtect) addons += Math.round(finalIDV * 0.0015);
        if (compData.returnToInvoice) addons += Math.round(finalIDV * 0.002);
        if (compData.ncbProtection) addons += Math.round(finalIDV * 0.001);

        const netPremium = netOwnDamage + thirdPartyBase + addons;
        const gst = Math.round(netPremium * 0.18);
        const totalPremium = netPremium + gst;

        return { idv: finalIDV, ownDamage, ncbDiscount, netOwnDamage, thirdPartyBase, addons, gst, totalPremium };
    };

    const calculateThirdParty = () => {
        if (step !== "form" && step !== "manual_entry") {
            return { baseTp: 0, paCoverCost: 0, gst: 0, totalPremium: 0 };
        }

        let baseTp = 3416; // default middle bucket

        // Derive CC from DB Engine field or manual entry
        let engineStr = "";
        if (selectedVariant?.Engine) engineStr = String(selectedVariant.Engine);
        else if (step === "manual_entry" && manualVehicle.engineCc) engineStr = manualVehicle.engineCc;

        const ccMatch = engineStr.match(/\d+/);
        const cc = ccMatch ? parseInt(ccMatch[0]) : (tpData.engineCapacity === "above-1500" ? 1600 : 1200);

        if (cc < 1000) baseTp = 2094;
        else if (cc >= 1000 && cc <= 1500) baseTp = 3416;
        else if (cc > 1500) baseTp = 7890;

        let paCoverCost = tpData.paCover ? 325 : 0;
        const netPremium = baseTp + paCoverCost;
        const gst = Math.round(netPremium * 0.18);
        const totalPremium = netPremium + gst;

        return { baseTp, paCoverCost, gst, totalPremium };
    };

    const compCalculation = calculateComprehensive();
    const tpCalculation = calculateThirdParty();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (step !== "form" && step !== "manual_entry") {
            alert("Please select or manually enter a vehicle first.");
            return;
        }

        const vehicleStr = step === "manual_entry"
            ? `${manualVehicle.brand} ${manualVehicle.model}`
            : `${selectedBrand?.brandName} ${selectedVehicle?.vehicleName}`;

        let payload = {};
        if (activeTab === "comprehensive") {
            payload = {
                formType: "comprehensive", ...compData, vehicle: vehicleStr,
                registration: `XX-XX-XXXX`,
                premium: compCalculation.totalPremium,
            };
            setSubmittedData({
                type: "Comprehensive Cover", vehicle: payload.vehicle,
                registration: payload.registration, premium: compCalculation.totalPremium,
                name: compData.fullName, email: compData.email,
            });
        } else {
            payload = {
                formType: "thirdParty", ...tpData, vehicle: vehicleStr,
                registration: `XX-XX-XXXX`,
                premium: tpCalculation.totalPremium,
            };
            setSubmittedData({
                type: "Third Party Liability", vehicle: payload.vehicle,
                registration: payload.registration, premium: tpCalculation.totalPremium,
                name: tpData.fullName, email: tpData.email,
            });
        }
        setIsSuccessModalOpen(true);
    };

    // ── Helper Sub-Components ──────────────────────────────────────────
    function Spinner() {
        return <div className="flex items-center justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-[#b48001]" /></div>;
    }

    function EmptyState({ message }) {
        return <div className="text-center py-6 text-slate-500 text-sm">{message}</div>;
    }

    return (
        <div className="min-h-screen bg-[#fafbf8] text-slate-800 flex flex-col font-sans">
            {/* HEADER SECTION */}
            <header className="bg-[#19456d] text-white shadow-md z-40 relative">
                <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#b48001] p-2.5 rounded-xl text-white">
                            <Shield className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl tracking-wide">Defense Auto Hub</h1>
                            <p className="text-[10px] text-slate-300 tracking-wider font-mono uppercase">Premium Car Insurance Desk</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-200">
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#b48001]" /> Instant Processing</span>
                        <span className="hidden sm:inline text-[#708ca4]">|</span>
                        <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#b48001]" /> IRDAI Compliant</span>
                    </div>
                </div>
            </header>

            <main className="grow max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
                {/* TABS */}
                <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl w-full max-w-lg mx-auto text-sm font-bold shadow-sm">
                    <button type="button" onClick={() => handleTabChange("comprehensive")}
                        className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "comprehensive" ? "bg-[#19456d] text-white shadow-md" : "text-[#708ca4] hover:text-[#19456d]"}`}
                    >
                        <Sparkles className="h-4 w-4" /> Comprehensive Cover
                    </button>
                    <button type="button" onClick={() => handleTabChange("thirdparty")}
                        className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "thirdparty" ? "bg-[#19456d] text-white shadow-md" : "text-[#708ca4] hover:text-[#19456d]"}`}
                    >
                        <FileText className="h-4 w-4" /> Third Party Only
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT COLUMN: FORM DETAILS */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-7 border border-[#708ca4]/15 shadow-sm space-y-6">

                        {/* 1. VEHICLE SELECTION (DYNAMIC OR MANUAL) */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-[#708ca4]/15 pb-3">
                                <h3 className="font-extrabold text-[#19456d] text-sm uppercase tracking-wider">1. Vehicle Specification</h3>
                                {step !== "brand" && step !== "form" && step !== "manual_entry" && (
                                    <button type="button" onClick={() => setStep("brand")} className="text-xs text-[#b48001] font-bold">Restart Selection</button>
                                )}
                            </div>

                            {step === "brand" && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-600">Choose Brand</p>

                                    {brandsLoading ? <Spinner /> : brands.length === 0 ? <EmptyState message="No brands found." /> : (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {brands.map((b) => (
                                                <button key={b._id} type="button" onClick={() => onBrandSelect(b)}
                                                    className="group relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden border-transparent bg-white shadow-[0_4px_20px_-8px_rgba(25,69,109,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(25,69,109,0.15)] hover:-translate-y-0.5 focus:border-[#b48001]"
                                                >
                                                    <p className="text-xs font-bold text-[#19456d]">{b.brandName}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-2 text-center border-t border-[#708ca4]/10 mt-6">
                                        <button type="button" onClick={() => setStep("manual_entry")} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Can't find your brand? Enter manually →</button>
                                    </div>
                                </div>
                            )}

                            {step === "vehicle" && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-600">Choose Model ({selectedBrand?.brandName})</p>
                                    {vehiclesLoading ? <Spinner /> : vehicles.length === 0 ? <EmptyState message="No models found." /> : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {vehicles.map((v) => (
                                                <button key={v._id} type="button" onClick={() => onVehicleSelect(v)}
                                                    className="group relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden border-transparent bg-white shadow-[0_4px_20px_-8px_rgba(25,69,109,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(25,69,109,0.15)] hover:-translate-y-0.5 focus:border-[#b48001]"
                                                >
                                                    <p className="text-xs font-bold text-[#19456d]">{v.vehicleName}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-2 text-center border-t border-[#708ca4]/10 mt-6">
                                        <button type="button" onClick={() => { handleManualChange("brand", selectedBrand?.brandName); setStep("manual_entry"); }} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Model missing? Enter manually →</button>
                                    </div>
                                </div>
                            )}

                            {step === "fuel" && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-600">Choose Fuel ({selectedVehicle?.vehicleName})</p>
                                    {variantsLoading ? <Spinner /> : fuelTypes.length === 0 ? <EmptyState message="No fuels found." /> : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {fuelTypes.map((f) => (
                                                <button key={f} type="button" onClick={() => onFuelSelect(f)}
                                                    className="group relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden border-transparent bg-white shadow-[0_4px_20px_-8px_rgba(25,69,109,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(25,69,109,0.15)] hover:-translate-y-0.5 focus:border-[#b48001]"
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-2 text-center border-t border-[#708ca4]/10 mt-6">
                                        <button type="button" onClick={() => { handleManualChange("brand", selectedBrand?.brandName); handleManualChange("model", selectedVehicle?.vehicleName); setStep("manual_entry"); }} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Fuel missing? Enter manually →</button>
                                    </div>
                                </div>
                            )}

                            {step === "variant" && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-600">Choose Variant ({selectedFuel})</p>
                                    {variantsLoading ? <Spinner /> : variantsByFuel(selectedFuel).length === 0 ? <EmptyState message="No variants found." /> : (
                                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
                                            {variantsByFuel(selectedFuel).map((v) => (
                                                <button key={v._id} type="button" onClick={() => onVariantSelect(v)}
                                                    className="group relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden border-transparent bg-white shadow-[0_4px_20px_-8px_rgba(25,69,109,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(25,69,109,0.15)] hover:-translate-y-0.5 focus:border-[#b48001]"
                                                >
                                                    <span className="text-xs font-bold text-[#19456d]">{v.variantName}</span>
                                                    <span className="text-[10px] text-slate-500">₹{parseSafeNum(v.ExShowroomPrice, 0).toLocaleString()}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-2 text-center border-t border-[#708ca4]/10 mt-6">
                                        <button type="button" onClick={() => { handleManualChange("brand", selectedBrand?.brandName); handleManualChange("model", selectedVehicle?.vehicleName); handleManualChange("fuel", selectedFuel); setStep("manual_entry"); }} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Variant missing? Enter manually →</button>
                                    </div>
                                </div>
                            )}

                            {step === "manual_entry" && (
                                <div className="space-y-4">
                                    <div className="bg-[#b48001]/10 border border-[#b48001]/30 p-4 rounded-xl">
                                        <p className="text-xs text-[#19456d] font-semibold mb-3">Please provide vehicle details manually for accurate IDV calculation.</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Brand (e.g. Ford)" value={manualVehicle.brand} onChange={(e) => handleManualChange("brand", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                            <input type="text" placeholder="Model (e.g. EcoSport)" value={manualVehicle.model} onChange={(e) => handleManualChange("model", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                            <input type="text" placeholder="Fuel (e.g. Petrol)" value={manualVehicle.fuel} onChange={(e) => handleManualChange("fuel", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                            <input type="text" placeholder="Variant (e.g. Titanium)" value={manualVehicle.variant} onChange={(e) => handleManualChange("variant", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                            <input type="number" placeholder="Est. Ex-Showroom Price (₹)" value={manualVehicle.exShowroomPrice} onChange={(e) => handleManualChange("exShowroomPrice", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                            <input type="text" placeholder="Engine Capacity (e.g. 1498)" value={manualVehicle.engineCc} onChange={(e) => handleManualChange("engineCc", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setStep("form")} className="w-full py-3 bg-[#19456d] text-white rounded-xl text-sm font-bold">Confirm Manual Details</button>
                                </div>
                            )}

                            {step === "form" && (
                                <div className="bg-[#fafbf8] border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Vehicle Selected</p>
                                        <h4 className="text-sm font-bold text-[#19456d]">
                                            {selectedVariant ? `${selectedBrand?.brandName} ${selectedVehicle?.vehicleName} - ${selectedVariant.variantName}` : `${manualVehicle.brand} ${manualVehicle.model} - ${manualVehicle.variant}`}
                                        </h4>
                                    </div>
                                    <button type="button" onClick={() => setStep("brand")} className="text-xs text-[#b48001] font-bold hover:underline">Change</button>
                                </div>
                            )}
                        </div>

                        {/* ONLY SHOW REST OF FORM IF VEHICLE IS SELECTED */}
                        {(step === "form" || step === "manual_entry") && (
                            <>
                                {/* 2. PERSONAL DETAILS */}
                                <div className="border-t border-slate-100 pt-5 space-y-4">
                                    <h3 className="font-extrabold text-[#19456d] text-sm uppercase tracking-wider">2. Proposer Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input type="text" required placeholder="Full Name (as per RC)"
                                            value={activeTab === "comprehensive" ? compData.fullName : tpData.fullName}
                                            onChange={(e) => activeTab === "comprehensive" ? handleCompChange("fullName", e.target.value) : handleTpChange("fullName", e.target.value)}
                                            className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                        
                                        <div className="relative mt-1">
                                            <input type="tel" required placeholder="Mobile Number"
                                                value={activeTab === "comprehensive" ? compData.phone : tpData.phone}
                                                onChange={(e) => activeTab === "comprehensive" ? handleCompChange("phone", e.target.value) : handleTpChange("phone", e.target.value)}
                                                className="w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                            <button 
                                                type="button" 
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white bg-[#19456d] hover:bg-[#b48001] px-2.5 py-1.5 rounded-lg transition"
                                            >
                                                Send OTP
                                            </button>
                                        </div>

                                        <input type="email" required placeholder="Email Address"
                                            value={activeTab === "comprehensive" ? compData.email : tpData.email}
                                            onChange={(e) => activeTab === "comprehensive" ? handleCompChange("email", e.target.value) : handleTpChange("email", e.target.value)}
                                            className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                        <input type="text" required placeholder="Registration City (e.g. Delhi)"
                                            value={activeTab === "comprehensive" ? compData.city : tpData.city}
                                            onChange={(e) => activeTab === "comprehensive" ? handleCompChange("city", e.target.value) : handleTpChange("city", e.target.value)}
                                            className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                    </div>

                                    {activeTab === "comprehensive" && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                            <input type="number" required placeholder="Mfg Year (e.g. 2024)" value={compData.year} onChange={(e) => handleCompChange("year", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                            <input type="number" placeholder="NCB % (0/20/25/35/45/50)" value={compData.ncb} onChange={(e) => handleCompChange("ncb", e.target.value)} className="mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]" />
                                        </div>
                                    )}
                                </div>

                                {/* 3. ADDONS (COMPREHENSIVE ONLY) */}
                                {activeTab === "comprehensive" && (
                                    <div className="border-t border-slate-100 pt-5 space-y-4">
                                        <h3 className="font-extrabold text-[#19456d] text-sm uppercase tracking-wider">3. Add-on Covers</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { id: "zeroDep", label: "Zero Depreciation Cover" },
                                                { id: "rsa", label: "Roadside Assistance (RSA)" },
                                                { id: "engineProtect", label: "Engine Protection Cover" },
                                                { id: "returnToInvoice", label: "Return to Invoice (RTI)" },
                                                { id: "ncbProtection", label: "NCB Protection Cover" }
                                            ].map((addon) => (
                                                <label key={addon.id} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs cursor-pointer transition ${compData[addon.id] ? "border-[#b48001] bg-[#b48001]/5" : "border-slate-200 bg-slate-50"}`}>
                                                    <input type="checkbox" checked={compData[addon.id]} onChange={(e) => handleCompChange(addon.id, e.target.checked)} className="rounded text-[#b48001] focus:ring-[#b48001]" />
                                                    <span className="font-semibold text-slate-700">{addon.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PA COVER (THIRD PARTY) */}
                                {activeTab === "thirdparty" && (
                                    <div className="border-t border-slate-100 pt-5 space-y-4">
                                        <div className="flex justify-between items-center bg-[#fafbf8] p-4 rounded-xl border border-slate-200">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold text-slate-900">Mandatory Owner-Driver PA Cover</p>
                                                <p className="text-[10px] text-slate-500">Required by law. Offers ₹15 Lakhs sum assured.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={tpData.paCover} onChange={(e) => handleTpChange("paCover", e.target.checked)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-[#b48001] peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* RIGHT COLUMN: LIVE QUOTE CARD */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#19456d] text-white rounded-3xl p-7 shadow-[0_20px_50px_-12px_rgba(25,69,109,0.3)] sticky top-32">
                            <div className="border-b border-white/15 pb-5">
                                <p className="text-[10px] text-slate-300 font-bold tracking-wider uppercase mb-1">Live Premium Calculation</p>
                                <h4 className="text-lg font-bold text-[#b48001]">
                                    {step === "form" || step === "manual_entry"
                                        ? (selectedBrand ? `${selectedBrand.brandName} ${selectedVehicle?.vehicleName}` : `${manualVehicle.brand} ${manualVehicle.model}`)
                                        : "Select a Vehicle"}
                                </h4>
                                <p className="text-xs text-slate-300 mt-1 font-medium">
                                    {activeTab === "comprehensive"
                                        ? `IDV: ₹${compCalculation.idv.toLocaleString()}`
                                        : `Base Rate Category: Third Party`}
                                </p>
                            </div>

                            <div className="space-y-4 text-xs border-b border-white/15 py-5">
                                {activeTab === "comprehensive" ? (
                                    <>
                                        <div className="flex justify-between text-slate-300">
                                            <span>Basic Own Damage:</span>
                                            <span className="font-semibold text-white">₹{compCalculation.ownDamage.toLocaleString()}</span>
                                        </div>
                                        {parseInt(compData.ncb) > 0 && (
                                            <div className="flex justify-between text-emerald-400 font-bold">
                                                <span>No Claim Bonus (-{compData.ncb}%):</span>
                                                <span>-₹{compCalculation.ncbDiscount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-slate-300">
                                            <span>Third Party Base Cover:</span>
                                            <span className="font-semibold text-white">₹{compCalculation.thirdPartyBase.toLocaleString()}</span>
                                        </div>
                                        {compCalculation.addons > 0 && (
                                            <div className="flex justify-between text-slate-300">
                                                <span>Add-ons Surcharge:</span>
                                                <span className="font-semibold text-white">₹{compCalculation.addons.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-slate-300">
                                            <span>GST (18%):</span>
                                            <span className="font-semibold text-white">₹{compCalculation.gst.toLocaleString()}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-slate-300">
                                            <span>Third Party Base Rate:</span>
                                            <span className="font-semibold text-white">₹{tpCalculation.baseTp.toLocaleString()}</span>
                                        </div>
                                        {tpData.paCover && (
                                            <div className="flex justify-between text-slate-300">
                                                <span>PA Cover (Owner-Driver):</span>
                                                <span className="font-semibold text-white">₹{tpCalculation.paCoverCost.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-slate-300">
                                            <span>GST (18%):</span>
                                            <span className="font-semibold text-white">₹{tpCalculation.gst.toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="py-5 flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-300 font-bold tracking-wider">Total Payable</p>
                                    <p className="text-[9px] text-slate-400">Inclusive of all taxes</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-[#b48001]">
                                        ₹{activeTab === "comprehensive" ? compCalculation.totalPremium.toLocaleString() : tpCalculation.totalPremium.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button type="submit" disabled={step !== "form" && step !== "manual_entry"}
                                className={`w-full font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${step === "form" || step === "manual_entry" ? "bg-[#b48001] text-white hover:bg-[#c99200] shadow-[0_8px_30px_-8px_rgba(180,128,1,0.6)]" : "bg-white/10 text-white/40 cursor-not-allowed"}`}
                            >
                                <CreditCard className="h-5 w-5" /> Secure Checkout
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span>Instant Cashless Sync across Network</span>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {/* SUCCESS MODAL */}
            {isSuccessModalOpen && submittedData && (
                <div className="fixed inset-0 bg-[#19456d]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-4">
                            <Check className="h-8 w-8 stroke-3" />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#19456d] mb-2">Policy Initiated!</h3>
                        <p className="text-xs text-[#708ca4] mb-6">
                            Thanks <strong>{submittedData.name}</strong>. Your {submittedData.type} application for <strong>{submittedData.vehicle}</strong> is being processed.
                        </p>
                        <button onClick={() => navigate("/insurance")} className="w-full py-3 bg-[#b48001] text-white font-bold rounded-xl hover:bg-[#19456d] transition">
                            Return Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


