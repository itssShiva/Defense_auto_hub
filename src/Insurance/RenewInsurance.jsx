import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Shield, RefreshCw, ChevronRight, CheckCircle, Loader2,
    Car, AlertCircle, ShieldCheck, Clock, User
} from "lucide-react";
import { useInsuranceWizard } from "./hooks/useInsuranceWizard";

const INPUT_CLS = "mt-1 w-full p-2.5 sm:p-3 text-sm border-2 border-transparent bg-white shadow-[0_2px_10px_-3px_rgba(25,69,109,0.1)] rounded-xl outline-none focus:border-[#b48001] transition-all text-[#19456d] font-medium placeholder:text-[#708ca4]/50 hover:shadow-[0_4px_15px_-3px_rgba(25,69,109,0.15)]";

function Spinner() {
    return (
        <div className="flex items-center justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin text-[#b48001]" />
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-[#708ca4]">
            <AlertCircle className="h-7 w-7 mb-2 opacity-60" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

const STEPS = [
    { id: 1, label: "Identity", icon: User },
    { id: 2, label: "Vehicle", icon: Car },
    { id: 3, label: "Confirm", icon: CheckCircle },
];

const PAYMENT_OPTIONS = [
    { id: "upi", label: "UPI / QR Code", desc: "Pay instantly using any UPI app" },
    { id: "netbanking", label: "Net Banking", desc: "All major banks supported" },
    { id: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard, Rupay" },
    { id: "emi", label: "EMI Options", desc: "0% EMI on select cards" },
];

const RenewInsurance = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loginValue, setLoginValue] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const [vehicleStep, setVehicleStep] = useState("brand");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [regYear, setRegYear] = useState("");
    const [manualVehicle, setManualVehicle] = useState({ brand: "", model: "", fuel: "", variant: "" });

    const {
        brands, brandsLoading,
        vehicles, vehiclesLoading, fetchVehicles,
        variantsLoading, fetchVariants,
        fuelTypes, variantsByFuel,
    } = useInsuranceWizard();

    const onBrandSelect = (brand) => {
        setSelectedBrand(brand); setSelectedVehicle(null); setSelectedFuel(null); setSelectedVariant(null);
        fetchVehicles(brand._id); setVehicleStep("model");
    };
    const onVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle); setSelectedFuel(null); setSelectedVariant(null);
        fetchVariants(vehicle._id); setVehicleStep("fuel");
    };
    const onFuelSelect = (fuel) => { setSelectedFuel(fuel); setSelectedVariant(null); setVehicleStep("variant"); };
    const onVariantSelect = (variant) => { setSelectedVariant(variant); setVehicleStep("done"); };
    const handleManualChange = (field, value) => setManualVehicle(prev => ({ ...prev, [field]: value }));

    const vehicleLabel = vehicleStep === "done"
        ? (selectedVariant ? `${selectedBrand?.brandName} ${selectedVehicle?.vehicleName} - ${selectedFuel} - ${selectedVariant.variantName}` : "")
        : `${manualVehicle.brand} ${manualVehicle.model} ${manualVehicle.fuel} ${manualVehicle.variant}`.trim();

    const canProceedStep2 = (vehicleStep === "done" || vehicleStep === "manual") && regYear;

    return (
        <div className="min-h-screen bg-[#fafbf8] pt-20 pb-10">
            <header className="bg-[#19456d] text-white shadow-md">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#b48001] p-2.5 rounded-xl">
                            <RefreshCw className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-lg tracking-wide">Renew Your Policy</h1>
                            <p className="text-[10px] text-slate-300 font-mono uppercase tracking-wider">Defence Auto Hub Insurance Desk</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-200">
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#b48001]" />Instant Renewal</span>
                        <span className="text-[#708ca4]">|</span>
                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#b48001]" />IRDAI Compliant</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-[#708ca4]/10 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-[#708ca4] mb-1">Policy Renewal</p>
                            {carNumber
                                ? <h2 className="text-2xl font-extrabold text-[#19456d]">{carNumber}</h2>
                                : <h2 className="text-xl font-bold text-[#708ca4]">Complete the steps below</h2>
                            }
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-[#708ca4]">Progress</p>
                            <p className="text-lg font-extrabold text-[#19456d]">Step {step} of 3</p>
                        </div>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                        {STEPS.map((s) => {
                            const Icon = s.icon;
                            const isActive = s.id === step;
                            const isDone = s.id < step;
                            return (
                                <div key={s.id} className={`relative rounded-2xl border-2 p-4 text-center transition-all ${isDone ? "border-emerald-400 bg-emerald-50" : isActive ? "border-[#b48001] bg-[#b48001]/5" : "border-[#708ca4]/15 bg-white"}`}>
                                    {isDone
                                        ? <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto mb-1.5" />
                                        : <Icon className={`h-5 w-5 mx-auto mb-1.5 ${isActive ? "text-[#b48001]" : "text-[#708ca4]"}`} />
                                    }
                                    <p className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? "text-[#b48001]" : isDone ? "text-emerald-600" : "text-[#708ca4]"}`}>Step {s.id}</p>
                                    <p className={`text-xs font-semibold mt-0.5 ${isActive ? "text-[#19456d]" : isDone ? "text-emerald-700" : "text-[#708ca4]"}`}>{s.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-7 border border-[#708ca4]/10 shadow-sm space-y-6">

                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <h3 className="font-extrabold text-[#19456d] text-base mb-1">Verify Your Identity</h3>
                                <p className="text-sm text-[#708ca4]">Enter your phone number or previous policy number to start the renewal process.</p>
                            </div>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-xs font-bold text-[#19456d]/70 uppercase tracking-wider">Phone or Policy Number</span>
                                    <input value={loginValue} onChange={(e) => setLoginValue(e.target.value)} placeholder="e.g. +91 98765 43210 or POL-XXXXXXXX" className={INPUT_CLS} />
                                </label>
                                <label className="block">
                                    <span className="text-xs font-bold text-[#19456d]/70 uppercase tracking-wider">Vehicle Registration Number</span>
                                    <input value={carNumber} onChange={(e) => setCarNumber(e.target.value.toUpperCase())} placeholder="e.g. UP-14-BD-9081" className={INPUT_CLS} />
                                </label>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="button" disabled={!loginValue.trim()} onClick={() => setStep(2)} className="flex items-center gap-2 rounded-2xl bg-[#b48001] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-40 hover:bg-[#19456d] transition-all shadow-[0_4px_20px_-8px_rgba(180,128,1,0.5)]">
                                    Next <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-extrabold text-[#19456d] text-base mb-1">Identify Your Vehicle</h3>
                                <p className="text-sm text-[#708ca4]">Select from our database, or enter details manually if not found.</p>
                            </div>

                            <label className="block">
                                <span className="text-xs font-bold text-[#19456d]/70 uppercase tracking-wider">Registration Year</span>
                                <select value={regYear} onChange={(e) => setRegYear(e.target.value)} className={INPUT_CLS}>
                                    <option value="">Select year</option>
                                    {Array.from({ length: 18 }, (_, i) => 2026 - i).map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </label>

                            <div className="border border-[#708ca4]/15 rounded-2xl p-5 space-y-4 bg-[#fafbf8]">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-extrabold text-[#19456d] uppercase tracking-wider">Select Vehicle</p>
                                    {vehicleStep !== "brand" && vehicleStep !== "done" && vehicleStep !== "manual" && (
                                        <button type="button" onClick={() => { setVehicleStep("brand"); setSelectedBrand(null); setSelectedVehicle(null); setSelectedFuel(null); setSelectedVariant(null); }} className="text-xs font-bold text-[#b48001] hover:underline">Restart</button>
                                    )}
                                    {(vehicleStep === "done" || vehicleStep === "manual") && (
                                        <button type="button" onClick={() => setVehicleStep("brand")} className="text-xs font-bold text-[#b48001] hover:underline">Change</button>
                                    )}
                                </div>

                                {vehicleStep === "brand" && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-[#708ca4]">Choose Brand</p>
                                        {brandsLoading ? <Spinner /> : brands.length === 0 ? <EmptyState message="No brands found." /> : (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {brands.map((b) => (
                                                    <button key={b._id} type="button" onClick={() => onBrandSelect(b)} className="p-3 border-2 border-transparent bg-white rounded-xl text-center hover:border-[#b48001] hover:shadow-md transition-all font-bold text-sm text-[#19456d] shadow-sm">{b.brandName}</button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="pt-2 text-center border-t border-[#708ca4]/10">
                                            <button type="button" onClick={() => setVehicleStep("manual")} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Can't find your brand? Enter manually →</button>
                                        </div>
                                    </div>
                                )}

                                {vehicleStep === "model" && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-[#708ca4]">Choose Model for <span className="text-[#19456d]">{selectedBrand?.brandName}</span></p>
                                        {vehiclesLoading ? <Spinner /> : vehicles.length === 0 ? <EmptyState message="No models found." /> : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {vehicles.map((v) => (
                                                    <button key={v._id} type="button" onClick={() => onVehicleSelect(v)} className="p-3 border-2 border-transparent bg-white rounded-xl text-center hover:border-[#b48001] hover:shadow-md transition-all font-bold text-sm text-[#19456d] shadow-sm">{v.vehicleName}</button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="pt-2 text-center border-t border-[#708ca4]/10">
                                            <button type="button" onClick={() => { handleManualChange("brand", selectedBrand?.brandName); setVehicleStep("manual"); }} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Model missing? Enter manually →</button>
                                        </div>
                                    </div>
                                )}

                                {vehicleStep === "fuel" && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-[#708ca4]">Choose Fuel for <span className="text-[#19456d]">{selectedVehicle?.vehicleName}</span></p>
                                        {variantsLoading ? <Spinner /> : fuelTypes.length === 0 ? <EmptyState message="No fuel types found." /> : (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {fuelTypes.map((f) => (
                                                    <button key={f} type="button" onClick={() => onFuelSelect(f)} className="p-3 border-2 border-transparent bg-white rounded-xl text-center hover:border-[#b48001] hover:shadow-md transition-all font-bold text-sm text-[#19456d] shadow-sm">{f}</button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="pt-2 text-center border-t border-[#708ca4]/10">
                                            <button type="button" onClick={() => { handleManualChange("brand", selectedBrand?.brandName); handleManualChange("model", selectedVehicle?.vehicleName); setVehicleStep("manual"); }} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Fuel missing? Enter manually →</button>
                                        </div>
                                    </div>
                                )}

                                {vehicleStep === "variant" && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-[#708ca4]">Choose Variant ({selectedFuel})</p>
                                        {variantsLoading ? <Spinner /> : variantsByFuel(selectedFuel).length === 0 ? <EmptyState message="No variants found." /> : (
                                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                                                {variantsByFuel(selectedFuel).map((v) => (
                                                    <button key={v._id} type="button" onClick={() => onVariantSelect(v)} className="p-3 border-2 border-transparent bg-white rounded-xl text-left hover:border-[#b48001] hover:shadow-md transition-all flex justify-between shadow-sm">
                                                        <span className="text-sm font-bold text-[#19456d]">{v.variantName}</span>
                                                        <span className="text-xs text-[#708ca4]">Rs.{Number(v.ExShowroomPrice).toLocaleString()}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="pt-2 text-center border-t border-[#708ca4]/10">
                                            <button type="button" onClick={() => { handleManualChange("brand", selectedBrand?.brandName); handleManualChange("model", selectedVehicle?.vehicleName); handleManualChange("fuel", selectedFuel); setVehicleStep("manual"); }} className="text-xs font-bold text-[#b48001] hover:underline mt-2">Variant missing? Enter manually →</button>
                                        </div>
                                    </div>
                                )}

                                {vehicleStep === "manual" && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-[#708ca4]">Enter vehicle details manually</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Brand (e.g. Ford)" value={manualVehicle.brand} onChange={(e) => handleManualChange("brand", e.target.value)} className={INPUT_CLS} />
                                            <input type="text" placeholder="Model (e.g. EcoSport)" value={manualVehicle.model} onChange={(e) => handleManualChange("model", e.target.value)} className={INPUT_CLS} />
                                            <input type="text" placeholder="Fuel (e.g. Petrol)" value={manualVehicle.fuel} onChange={(e) => handleManualChange("fuel", e.target.value)} className={INPUT_CLS} />
                                            <input type="text" placeholder="Variant (e.g. Titanium)" value={manualVehicle.variant} onChange={(e) => handleManualChange("variant", e.target.value)} className={INPUT_CLS} />
                                        </div>
                                    </div>
                                )}

                                {vehicleStep === "done" && (
                                    <div className="bg-emerald-50 border border-emerald-400/40 rounded-xl px-4 py-3 flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-emerald-600">Vehicle Confirmed</p>
                                            <p className="text-sm font-bold text-[#19456d]">{vehicleLabel}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between gap-3 pt-2">
                                <button type="button" onClick={() => setStep(1)} className="rounded-2xl border-2 border-[#708ca4]/20 px-5 py-3 text-sm font-bold text-[#708ca4] hover:border-[#19456d] hover:text-[#19456d] transition">Previous</button>
                                <button type="button" disabled={!canProceedStep2} onClick={() => setStep(3)} className="flex items-center gap-2 rounded-2xl bg-[#b48001] px-6 py-3 text-sm font-extrabold text-white disabled:opacity-40 hover:bg-[#19456d] transition-all shadow-[0_4px_20px_-8px_rgba(180,128,1,0.5)]">
                                    Next <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 text-center py-4">
                            {/* Animated success icon */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-400/30 flex items-center justify-center mx-auto">
                                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-extrabold tracking-widest text-[#b48001] mb-1">Request Submitted</p>
                                    <h3 className="text-2xl font-extrabold text-[#19456d]">Thank You!</h3>
                                    <p className="text-sm text-[#708ca4] mt-2 max-w-sm mx-auto leading-relaxed">
                                        Your renewal request has been received. Our insurance desk team will contact you within <strong className="text-[#19456d]">24 hours</strong> to complete the process.
                                    </p>
                                </div>
                            </div>

                            {/* Submission summary */}
                            <div className="bg-[#fafbf8] border border-[#708ca4]/15 rounded-2xl p-5 text-left space-y-3 max-w-sm mx-auto">
                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-[#708ca4] mb-2">Submission Summary</p>
                                <div className="flex justify-between text-sm border-b border-[#708ca4]/10 pb-2">
                                    <span className="font-semibold text-[#708ca4]">Vehicle</span>
                                    <span className="font-extrabold text-[#19456d] text-right">{vehicleLabel || `${manualVehicle.brand} ${manualVehicle.model}`.trim() || "—"}</span>
                                </div>
                                {carNumber && (
                                    <div className="flex justify-between text-sm border-b border-[#708ca4]/10 pb-2">
                                        <span className="font-semibold text-[#708ca4]">Registration No.</span>
                                        <span className="font-extrabold text-[#19456d]">{carNumber}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm border-b border-[#708ca4]/10 pb-2">
                                    <span className="font-semibold text-[#708ca4]">Year</span>
                                    <span className="font-extrabold text-[#19456d]">{regYear}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-[#708ca4]">Type</span>
                                    <span className="font-extrabold text-emerald-600">Renewal</span>
                                </div>
                            </div>

                            {/* What happens next */}
                            <div className="bg-[#19456d]/5 border border-[#19456d]/10 rounded-2xl p-5 text-left space-y-3 max-w-sm mx-auto">
                                <p className="text-[10px] uppercase font-extrabold tracking-widest text-[#19456d] mb-1">What Happens Next?</p>
                                {[
                                    { step: "1", text: "Our team reviews your renewal request" },
                                    { step: "2", text: "We call you to confirm policy details & premium" },
                                    { step: "3", text: "Payment link sent securely to your phone/email" },
                                    { step: "4", text: "Renewed policy document dispatched instantly" },
                                ].map(({ step: s, text }) => (
                                    <div key={s} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#b48001] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">{s}</div>
                                        <p className="text-sm text-[#708ca4] font-medium">{text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                <button type="button" onClick={() => navigate("/insurance")}
                                    className="rounded-2xl border-2 border-[#708ca4]/20 px-6 py-3 text-sm font-bold text-[#708ca4] hover:border-[#19456d] hover:text-[#19456d] transition"
                                >
                                    Back to Insurance
                                </button>
                                <button type="button" onClick={() => navigate("/")}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#b48001] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#19456d] transition-all shadow-[0_4px_20px_-8px_rgba(180,128,1,0.5)]"
                                >
                                    Go to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RenewInsurance;