import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Car,
  Wallet,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";


const STEPS = ["Personal details", "Car details", "Income details", "Review"];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-600 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0E1A2B] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow";

function StepPersonal({ form, set }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label="Full name">
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="As per PAN card"
        />
      </Field>
      <Field label="Mobile number">
        <div className="relative">
          <Phone
            size={16}
            className="absolute left-3.5 top-3.5 text-slate-400"
          />
          <input
            className={inputCls + " pl-10"}
            value={form.phone}
            onChange={(e) =>
              set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="10-digit number"
          />
        </div>
      </Field>
      <Field label="Email address">
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-3.5 text-slate-400"
          />
          <input
            className={inputCls + " pl-10"}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </Field>
      <Field label="City">
        <input
          className={inputCls}
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
          placeholder="Where you'll take delivery"
        />
      </Field>
    </div>
  );
}

function StepCar({ form, set }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label="Car type">
        <div className="grid grid-cols-2 gap-3">
          {["New car", "Used car"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => set("carType", t)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${form.carType === t
                ? "border-gold bg-amber-50 text-[#0E1A2B]"
                : "border-slate-300 text-slate-500 hover:border-slate-400"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Car model">
        <input
          className={inputCls}
          value={form.carModel}
          onChange={(e) => set("carModel", e.target.value)}
          placeholder="e.g. Hyundai Creta"
        />
      </Field>
      <Field label="On-road price (₹)">
        <input
          className={inputCls}
          value={form.onRoadPrice}
          onChange={(e) =>
            set("onRoadPrice", e.target.value.replace(/\D/g, ""))
          }
          placeholder="e.g. 950000"
        />
      </Field>
    </div>
  );
}

function StepIncome({ form, set }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label="Employment type">
        <div className="grid grid-cols-2 gap-3">
          {["Salaried", "Self-employed"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => set("employment", t)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${form.employment === t
                ? "border-gold bg-amber-50 text-[#0E1A2B]"
                : "border-slate-300 text-slate-500 hover:border-slate-400"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Monthly income (₹)">
        <input
          className={inputCls}
          value={form.monthlyIncome}
          onChange={(e) =>
            set("monthlyIncome", e.target.value.replace(/\D/g, ""))
          }
          placeholder="Net monthly take-home"
        />
      </Field>
      <Field label="PAN number">
        <input
          className={inputCls + " uppercase"}
          value={form.pan}
          maxLength={10}
          onChange={(e) => set("pan", e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
        />
      </Field>
    </div>
  );
}

function StepReview({ form }) {
  const rows = [
    ["Name", form.name],
    ["Mobile", form.phone],
    ["Email", form.email],
    ["City", form.city],
    ["Car type", form.carType],
    ["Car model", form.carModel],
    [
      "On-road price",
      form.onRoadPrice &&
      `₹${Number(form.onRoadPrice).toLocaleString("en-IN")}`,
    ],
    ["Employment", form.employment],
    [
      "Monthly income",
      form.monthlyIncome &&
      `₹${Number(form.monthlyIncome).toLocaleString("en-IN")}`,
    ],
    ["PAN", form.pan],
  ];
  return (
    <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between px-5 py-3 text-sm">
          <span className="text-slate-500">{label}</span>
          <span className="font-medium text-[#0E1A2B]">{value || "—"}</span>
        </div>
      ))}
    </div>
  );
}

function isStepValid(step, form) {
  if (step === 0)
    return (
      form.name &&
      form.phone.length === 10 &&
      form.email.includes("@") &&
      form.city
    );
  if (step === 1) return form.carModel && form.onRoadPrice;
  if (step === 2) return form.monthlyIncome && form.pan.length === 10;
  return true;
}

export default function LoanEnquiryForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "",
    carType: "New car", carModel: "", onRoadPrice: "",
    employment: "Salaried", monthlyIncome: "", pan: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const icons = [User, Car, Wallet, CheckCircle2];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Enquiry Form Data:", form);
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center px-6 font-['Inter']">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h2 className="font-[Space_Grotesk] text-2xl font-semibold text-[#0E1A2B]">
            Application received
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Thanks, {form.name.split(" ")[0] || "there"}. Our lending partners
            are reviewing your details — expect a call or SMS on{" "}
            <span className="font-mono text-[#0E1A2B]">{form.phone}</span>{" "}
            within 15 minutes.
          </p>
          <div className="mt-6 font-mono text-xs text-slate-400">
            Reference ID: CH-{Math.floor(100000 + Math.random() * 900000)}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen font-['Inter']">
      <div className="bg-navyblue text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-14 pb-16">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-gold">
            Loan Enquiry
          </span>
          <h1 className="mt-3 font-[Space_Grotesk] text-3xl sm:text-4xl font-medium">
            Let's get your car loan started.
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-10 -mt-10 pb-24">
        {/* Stepper */}
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => {
            const Icon = icons[i];
            const active = i === step;
            const done = i < step;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-[#b48001] text-[#19456d]"
                        : "bg-white text-slate-300 border border-slate-200"
                      }`}
                  >
                    {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                  </div>
                  <span
                    className={`text-[11px] font-medium hidden sm:block ${active ? "text-[#19456d]" : "text-slate-400"
                      }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${i < step ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-7 sm:p-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-lg font-bold text-[#19456d] mb-6">
                {STEPS[step]}
              </h2>
              {step === 0 && <StepPersonal form={form} set={set} />}
              {step === 1 && <StepCar form={form} set={set} />}
              {step === 2 && <StepIncome form={form} set={set} />}
              {step === 3 && <StepReview form={form} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex justify-between">
            <button
              onClick={() => setStep(prev => Math.max(0, prev - 1))}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-colors ${step === 0
                ? "opacity-0 pointer-events-none"
                : "text-slate-500 hover:text-[#19456d]"
                }`}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                disabled={!isStepValid(step, form)}
                onClick={() => setStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                className="inline-flex items-center gap-2 bg-[#b48001] hover:bg-[#c99200] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                {isLoading ? "Submitting..." : "Submit application"}{" "}
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By submitting, you agree to be contacted by FoujiMart and its lending
          partners regarding this application.
        </p>
      </div>
    </div>
  );
}
