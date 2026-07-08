import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, IndianRupee, Percent, CalendarClock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const fmt = (n) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// Animated count-up for the headline EMI number
function CountUp({ value }) {
  const [display, setDisplay] = useState(value);
  const prev = React.useRef(value);

  React.useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + (end - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{fmt(display)}</>;
}

function Slider({ label, value, min, max, step, unit, onChange, icon: Icon }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Icon size={16} className="text-amber-500" />
          {label}
        </label>
        <span className="font-mono text-sm font-semibold text-[#19456d] bg-slate-100 px-2.5 py-1 rounded-lg">
          {unit === "₹" ? fmt(value) : `${value}${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500"
        style={{
          background: `linear-gradient(to right, #b48001 ${pct}%, #E2E8F0 ${pct}%)`,
        }}
      />
      <div className="flex justify-between mt-1 text-[11px] font-mono text-slate-400">
        <span>{unit === "₹" ? fmt(min) : `${min}${unit}`}</span>
        <span>{unit === "₹" ? fmt(max) : `${max}${unit}`}</span>
      </div>
    </div>
  );
}

const COLORS = ["#b48001", "#19456d"];

export default function EmiCalculator() {
  const navigate = useNavigate();
  const [price, setPrice] = useState(950000);
  const [downPct, setDownPct] = useState(15);
  const [rate, setRate] = useState(8.75);
  const [tenure, setTenure] = useState(60); // months

  const downPayment = (price * downPct) / 100;
  const principal = price - downPayment;

  const { emi, totalInterest, totalPayment, schedule } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emiVal =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    let balance = principal;
    const rows = [];
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principalPaid = emiVal - interest;
      balance = Math.max(0, balance - principalPaid);
      if (m % Math.ceil(n / 12) === 0 || m === n) {
        rows.push({
          month: m,
          balance: Math.round(balance),
          paid: Math.round(principal - balance),
        });
      }
    }
    const totalPay = emiVal * n;
    return {
      emi: emiVal,
      totalInterest: totalPay - principal,
      totalPayment: totalPay,
      schedule: rows,
    };
  }, [principal, rate, tenure]);

  const pieData = [
    { name: "Principal", value: principal },
    { name: "Total interest", value: totalInterest },
  ];

  return (
    <div className="bg-[#fafbf8] min-h-screen">
      <div className="bg-[#19456d] text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-14 pb-16">
          <span className="font-mono text-lg tracking-[0.2em] uppercase text-[#b48001]">
            EMI Calculator
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-medium max-w-xl">
            Move the sliders. Watch your EMI change in real time.
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-10 pb-24">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-7 space-y-7"
          >
            <Slider
              label="On-road car price"
              value={price}
              min={200000}
              max={5000000}
              step={10000}
              unit="₹"
              onChange={setPrice}
              icon={IndianRupee}
            />
            <Slider
              label="Down payment"
              value={downPct}
              min={0}
              max={80}
              step={1}
              unit="%"
              onChange={setDownPct}
              icon={IndianRupee}
            />
            <Slider
              label="Interest rate (p.a.)"
              value={rate}
              min={7.5}
              max={14}
              step={0.05}
              unit="%"
              onChange={setRate}
              icon={Percent}
            />
            <Slider
              label="Loan tenure"
              value={tenure}
              min={12}
              max={84}
              step={6}
              unit=" mm"
              onChange={setTenure}
              icon={CalendarClock}
            />

            <div className="pt-2 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-slate-500">Loan amount</div>
                <div className="font-mono font-semibold text-[#19456d] mt-1">
                  {fmt(principal)}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-slate-500">Down payment</div>
                <div className="font-mono font-semibold text-[#19456d] mt-1">
                  {fmt(downPayment)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-7 flex flex-col"
          >
            <div className="text-center pb-6 border-b border-dashed border-slate-200">
              <div className="text-sm text-slate-500">Your monthly EMI</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={Math.round(emi)}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-4xl sm:text-5xl font-bold text-[#19456d] mt-1"
                >
                  <CountUp value={emi} />
                </motion.div>
              </AnimatePresence>
              <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                for {tenure} months at {rate}% p.a.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        innerRadius={20}
                        outerRadius={32}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => fmt(v)}
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Principal</div>
                  <div className="font-mono text-sm font-semibold text-[#19456d]">
                    {fmt(principal)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Interest</div>
                  <div className="font-mono text-sm font-semibold text-amber-600">
                    {fmt(totalInterest)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Total payment</div>
                <div className="font-mono text-lg font-semibold text-[#19456d]">
                  {fmt(totalPayment)}
                </div>
                <div className="text-xs text-slate-500 mt-3">
                  Interest as % of loan
                </div>
                <div className="font-mono text-lg font-semibold text-slate-600">
                  {((totalInterest / principal) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[160px]">
              <div className="text-xs text-slate-500 mb-2">
                Outstanding balance over time
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={schedule}>
                  <defs>
                    <linearGradient id="bal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#19456d" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#19456d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(m) => `${m}mo`} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} width={36} />
                  <Tooltip formatter={(v) => fmt(v)} labelFormatter={(m) => `Month ${m}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="balance" stroke="#19456d" fill="url(#bal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <button
              onClick={() => navigate("/loan/enquiry-form")}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#b48001] hover:bg-[#c99200] text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-[0_8px_30px_-8px_rgba(180,128,1,0.5)] hover:shadow-[0_10px_36px_-6px_rgba(180,128,1,0.65)]"
            >
              Apply with this EMI <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        <div className="mt-6 text-center">
          {/* <button
            onClick={() => navigate("/loan/eligibility-documents")}
            className="text-sm text-slate-500 hover:text-[#19456d] underline underline-offset-4"
          >
            Check eligibility & required documents →
          </button> */}
        </div>
      </div>
    </div>
  );
}