import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Layers, Grid3X3 } from 'lucide-react';
import { getAllBrands } from '../../brand/api/brand.api';
import { getAllModels } from '../Api/cars.api';
import BrandCard from '../components/BrandCard';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { BrandCardSkeleton } from '../components/LoadingSkeleton';

const BRANDS_PER_PAGE = 18;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = 'All Car Brands — Defence Auto Hub';
    (async () => {
      setLoading(true);
      const [br, mo] = await Promise.all([getAllBrands(), getAllModels()]);
      if (br?.success) setBrands(br.brands || []);
      if (mo?.success) setModels(mo.models || []);
      setLoading(false);
    })();
  }, []);

  /* Count models per brand */
  const modelCountMap = useMemo(() => {
    const map = {};
    models.forEach((m) => {
      const key = m.brandId?._id || m.brandId || m.brandName;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [models]);

  /* Alphabet filter letters */
  const letters = useMemo(() => {
    const set = new Set(
      brands.map((b) => b.brandName?.charAt(0)?.toUpperCase()).filter(Boolean)
    );
    return ['All', ...Array.from(set).sort()];
  }, [brands]);

  /* Filtered + paginated */
  const filtered = useMemo(() => {
    let list = [...brands];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.brandName?.toLowerCase().includes(q) ||
          b.brandCountry?.toLowerCase().includes(q)
      );
    }
    if (activeLetter !== 'All') {
      list = list.filter((b) => b.brandName?.charAt(0)?.toUpperCase() === activeLetter);
    }
    return list;
  }, [brands, search, activeLetter]);

  const totalPages = Math.ceil(filtered.length / BRANDS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * BRANDS_PER_PAGE, page * BRANDS_PER_PAGE);

  const setFilter = (val, setter) => {
    setter(val);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* ── Hero ── */}
      <div className="relative bg-linear-to-br from-[#19456d] via-[#19456d] to-[#1a3a5c] pt-24 pb-20 px-4 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#b48001]/15 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-[#708ca4]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-[#b48001] text-xs font-bold uppercase tracking-[4px] mb-4">
            Defence Auto Hub
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Explore Car <span className="text-[#b48001]">Brands</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-[#708ca4] text-lg mb-10 max-w-lg mx-auto">
            {loading ? '…' : `${brands.length} brands with exclusive CSD pricing for defence personnel`}
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#708ca4]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setFilter(e.target.value, setSearch)}
              placeholder="Search brand name or country…"
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-0 text-[#19456d] font-medium focus:outline-none shadow-2xl focus:ring-2 focus:ring-[#b48001] text-base"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats bar */}
        {!loading && (
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total Brands', value: brands.length, icon: Globe },
              { label: 'Car Models', value: models.length, icon: Layers },
              { label: 'Showing', value: filtered.length, icon: Grid3X3 },
            ].map(({ label, value, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp}
                className="bg-white rounded-2xl border border-[#708ca4]/15 p-5 flex items-center gap-4 shadow-sm">
                <div className="w-11 h-11 bg-[#b48001]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#b48001]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#19456d]">{value}</p>
                  <p className="text-xs text-[#708ca4] font-medium">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Alphabet filter */}
        {!loading && letters.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {letters.map((l) => (
              <button
                key={l}
                onClick={() => setFilter(l, setActiveLetter)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${activeLetter === l
                    ? 'bg-[#b48001] text-white shadow-md'
                    : 'bg-white border border-[#708ca4]/20 text-[#19456d] hover:border-[#b48001] hover:text-[#b48001]'
                  } ${l === 'All' ? 'px-4 w-auto' : ''}`}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <BrandCardSkeleton key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No brands found"
            message="Try a different letter or clear your search."
            action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setActiveLetter('All'); setPage(1); } }}
          />
        ) : (
          <motion.div
            variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {paginated.map((brand) => (
              <motion.div key={brand._id} variants={fadeUp}>
                <BrandCard brand={brand} modelCount={modelCountMap[brand._id]} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default BrandsPage;
