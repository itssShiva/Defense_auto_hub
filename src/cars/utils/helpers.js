/* ─── Image URL resolver ──────────────────────────── */
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${import.meta.env.VITE_BACKEND_URL}${path}`;
};

export const FALLBACK_IMAGE =
  'https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png';

/* ─── Indian price formatter ──────────────────────── */
export const formatIndianPrice = (price) => {
  if (price === null || price === undefined || price === '') return null;
  const num = Number(price);
  if (isNaN(num)) return null;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/* ─── Compact price (₹X.XX L / Cr) ───────────────── */
export const formatCompactPrice = (price) => {
  if (price === null || price === undefined || price === '') return null;
  const num = Number(price);
  if (isNaN(num)) return null;
  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(2)} Cr`;
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(2)} L`;
  return formatIndianPrice(num);
};

/* ─── EMI calculator ──────────────────────────────── */
export const calculateEMI = (principal, years = 5, rate = 8.5) => {
  if (!principal) return null;
  const monthlyRate = rate / 12 / 100;
  const n = years * 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);
  return Math.round(emi);
};

/* ─── Text utils ──────────────────────────────────── */
export const truncateText = (text = '', max = 120) =>
  text.length <= max ? text : text.slice(0, max).trimEnd() + '…';

export const getReadingTime = (text = '') => {
  const words = text.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
};

/* ─── Slug fallback ───────────────────────────────── */
export const getRouteId = (item) => item?.slug || item?._id || '';
