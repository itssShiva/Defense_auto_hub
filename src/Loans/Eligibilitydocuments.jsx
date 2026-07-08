import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileText, ArrowRight, Briefcase, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ELIGIBILITY = {
  salaried: [
    { label: "Age", value: "21 – 60 years at loan maturity" },
    { label: "Minimum net income", value: "₹25,000 / month" },
    { label: "Employment", value: "Minimum 1 year, current job 6+ months" },
    { label: "Credit score", value: "700 or above (750+ for best rates)" },
    {
      label: "Residence",
      value: "Resident of serviceable city, 1+ year at current address",
    },
  ],
  selfEmployed: [
    { label: "Age", value: "23 – 65 years at loan maturity" },
    { label: "Minimum annual income", value: "₹3,00,000 (ITR)" },
    { label: "Business vintage", value: "Minimum 2 years in current business" },
    { label: "Credit score", value: "700 or above (750+ for best rates)" },
    { label: "ITR filing", value: "Last 2 years filed and available" },
  ],
};

const DOCUMENTS = {
  salaried: [
    {
      group: "Identity & Address",
      items: ["PAN card", "Aadhaar card", "Passport-size photograph"],
    },
    {
      group: "Income proof",
      items: [
        "Last 3 months' salary slips",
        "Last 6 months' bank statement",
        "Latest Form 16",
      ],
    },
    {
      group: "Car & loan",
      items: [
        "Car quotation / proforma invoice",
        "Signed loan application form",
      ],
    },
  ],
  selfEmployed: [
    {
      group: "Identity & Address",
      items: ["PAN card", "Aadhaar card", "Passport-size photograph"],
    },
    {
      group: "Income proof",
      items: [
        "Last 2 years' ITR with computation",
        "Last 12 months' bank statement",
        "Business proof (GST/Shop Act/Udyam)",
      ],
    },
    {
      group: "Car & loan",
      items: [
        "Car quotation / proforma invoice",
        "Signed loan application form",
      ],
    },
  ],
};


export default function EligibilityDocuments() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState("salaried");

  const eligibility = ELIGIBILITY[profile] || ELIGIBILITY.salaried;
  const documents = DOCUMENTS[profile] || DOCUMENTS.salaried;

  return (
    <div className="bg-[#fafbf8] min-h-screen font-sans">
      <div className="bg-[#19456d] text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-14 pb-16">
          <span className="font-mono text-lg tracking-[0.2em] uppercase text-[#b48001]">
            Eligibility & Documents
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold max-w-xl">
            Know exactly what you need before you apply.
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-8 pb-24">
        {/* Profile switch */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-2 inline-flex gap-1 mb-10"
        >
          {[
            { key: "salaried", label: "Salaried", icon: Briefcase },
            { key: "selfEmployed", label: "Self-employed", icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setProfile(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${profile === key
                  ? "bg-[#b48001] text-white"
                  : "text-slate-500 hover:text-[#19456d]"
                }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Eligibility */}
          <div>
            <h2 className="text-xl font-bold text-[#19456d] mb-5">
              Eligibility criteria
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={profile + "-elig"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {eligibility.map((e, i) => (
                  <motion.div
                    key={e.label}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    animate="show"
                    className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 px-5 py-4"
                  >
                    <span className="text-sm text-slate-500">{e.label}</span>
                    <span className="text-sm font-semibold text-[#19456d] text-right">
                      {e.value}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-xl font-bold text-[#19456d] mb-5">
              Documents required
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={profile + "-docs"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {documents.map((group, gi) => (
                  <motion.div
                    key={group.group}
                    variants={fadeUp}
                    custom={gi}
                    initial="hidden"
                    animate="show"
                    className="rounded-xl bg-[#F7F5F0] p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={16} className="text-amber-500" />
                      <span className="font-medium text-sm text-[#19456d]">
                        {group.group}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl bg-[#0E1A2B] text-white p-8 sm:p-10 flex flex-wrap items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-[Space_Grotesk] text-xl font-medium">
              Meet the criteria? You're minutes away from an offer.
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Keep your documents ready and apply — most applicants hear back the same day.
            </p>
          </div>
          <button
            onClick={() => navigate("/loan/enquiry-form")}
            className="group inline-flex items-center gap-2 bg-[#b48001] hover:bg-[#c99200] text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(180,128,1,0.5)] hover:shadow-[0_10px_36px_-6px_rgba(180,128,1,0.65)] shrink-0"
          >
            Start application <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}