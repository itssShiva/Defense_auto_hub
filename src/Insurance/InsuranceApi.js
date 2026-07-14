// InsuranceApi.js — Static data for the Insurance Home page

import hdfcergo from "./images/hdfcergo.webp";
import icicLombard from "./images/icic.webp";
import bajaj from "./images/Bajaj-general-logo.webp";
import tataAig from "./images/tataaig.webp";
import reliance from "./images/reliance.webp";
import sbi from "./images/sbi.webp";
import acko from "./images/acko.webp";

// SVG icons for WHY_CHOOSE (using local svgs)
import inTime from "./images/in-time.svg";
import manSack from "./images/man-sack.svg";
import shieldReliable from "./images/shield-reliable.svg";
import policyPapers from "./images/policy-papers.svg";

export const RATING = {
  score: 4.8,
  count: "2,400+",
  label: "Reviews",
};

export const FAQS = [
  {
    q: "What is the difference between third-party and comprehensive car insurance?",
    a: "Third-party insurance covers only damages caused to another person's vehicle or property. Comprehensive insurance additionally covers your own vehicle for damages due to accidents, theft, natural disasters, and more.",
  },
  {
    q: "How is the IDV (Insured Declared Value) calculated?",
    a: "IDV is the current market value of your vehicle after accounting for depreciation. It is the maximum sum the insurer pays in case of total loss or theft. IDV = Manufacturer's listed selling price − depreciation as per age of vehicle.",
  },
  {
    q: "What is a No Claim Bonus (NCB)?",
    a: "NCB is a discount given on your own-damage premium at the time of renewal if you have not made any claims during the previous policy year. It ranges from 20% after one claim-free year to 50% after five consecutive claim-free years.",
  },
  {
    q: "Can I transfer my existing insurance policy to a new car?",
    a: "No, an insurance policy is specific to a vehicle. When you buy a new car, you need to buy a new insurance policy for it. However, you can transfer your accumulated NCB to your new car's policy.",
  },
  {
    q: "What is Zero Depreciation cover and do I need it?",
    a: "Zero Depreciation (also called Nil Depreciation or Bumper-to-Bumper) cover ensures you get the full cost of replaced parts without any depreciation deduction. It is highly recommended for new or nearly new cars (up to 5 years old).",
  },
  {
    q: "How do I file a car insurance claim?",
    a: "1) Inform your insurer immediately after an incident. 2) File an FIR if required. 3) Submit the claim form with supporting documents (driving licence, RC, FIR copy). 4) Get the vehicle inspected by a surveyor. 5) Repair at a network garage for cashless settlement, or at any garage for reimbursement.",
  },
];

export const WHY_CHOOSE = [
  {
    icon: "Scale",
    title: "Unbiased Comparison",
    desc: "Compare quotes from 15+ leading insurers side-by-side with zero hidden charges.",
    img: inTime,
  },
  {
    icon: "Zap",
    title: "Instant Renewal",
    desc: "Renew your policy in under 2 minutes — no paperwork, no inspection for active policies.",
    img: manSack,
  },
  {
    icon: "ShieldCheck",
    title: "98.6% Claim Settlement",
    desc: "Industry-leading claim settlement ratio backed by our dedicated claims support team.",
    img: shieldReliable,
  },
  {
    icon: "Wrench",
    title: "6,000+ Network Garages",
    desc: "Cashless repairs at authorized workshops across India, including Tier-2 and Tier-3 cities.",
    img: policyPapers,
  },
];

export const INSURANCE_PARTNERS = [
  { name: "HDFC ERGO", logo: hdfcergo },
  { name: "ICICI Lombard", logo: icicLombard },
  { name: "Bajaj Allianz", logo: bajaj },
  { name: "Tata AIG", logo: tataAig },
  { name: "Reliance General", logo: reliance },
  { name: "SBI General", logo: sbi },
  { name: "Acko", logo: acko },
];
