import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { getAllBrands } from '../../brand/api/brand.api';
import { getAllCars, getAllModels, getAllVariants } from '../Api/cars.api';
import BrandCard from '../components/BrandCard';
import CarCard from '../components/CarCard';
import ModelCard from '../components/ModelCard';
import VariantCard from '../components/VariantCard';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { BrandCardSkeleton, CarCardSkeleton } from '../components/LoadingSkeleton';

const TABS = ['All', 'Brands', 'Cars', 'Models', 'Variants'];
const PER_PAGE = 12;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);

  const [brands, setBrands] = useState([]);
  const [cars, setCars] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `Search — Defence Auto Hub`;
    (async () => {
      setLoading(true);
      const [br, ca, mo, va] = await Promise.all([
        getAllBrands(), getAllCars(), getAllModels(), getAllVariants()
      ]);
      if (br?.success) setBrands(br.brands || []);
      if (ca?.success) setCars(ca.cars || []);
      if (mo?.success) setModels(mo.models || []);
      if (va?.success) setVariants(va.variants || []);
      setLoading(false);
    })();
  }, []);

  /* Update URL param as user types */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) setSearchParams({ q: query });
      else setSearchParams({});
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const q = query.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!q) return { brands: [], cars: [], models: [], variants: [] };
    return {
      brands: brands.filter((b) => b.brandName?.toLowerCase().includes(q) || b.brandCountry?.toLowerCase().includes(q)),
      cars: cars.filter((c) => (c.Model || c.modelName || '').toLowerCase().includes(q) || c.brandName?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)),
      models: models.filter((m) => m.modelName?.toLowerCase().includes(q) || m.brandName?.toLowerCase().includes(q)),
      variants: variants.filter((v) => v.variantName?.toLowerCase().includes(q) || v.brandName?.toLowerCase().includes(q) || v.modelName?.toLowerCase().includes(q)),
    };
  }, [q, brands, cars, models, variants]);

  const counts = {
    All: filtered.brands.length + filtered.cars.length + filtered.models.length + filtered.variants.length,
    Brands: filtered.brands.length,
    Cars: filtered.cars.length,
    Models: filtered.models.length,
    Variants: filtered.variants.length,
  };

  const getItems = () => {
    switch (activeTab) {
      case 'Brands': return filtered.brands;
      case 'Cars': return filtered.cars;
      case 'Models': return filtered.models;
      case 'Variants': return filtered.variants;
      default: return [...filtered.brands, ...filtered.cars, ...filtered.models, ...filtered.variants];
    }
  };

  const allItems = getItems();
  const totalPages = Math.ceil(allItems.length / PER_PAGE);
  const paged = allItems.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const renderCard = (item) => {
    if (item.brandName !== undefined && item.slug !== undefined && !item.Model && !item.modelName && !item.variantName && !item.brandCountry) return <ModelCard key={item._id} model={item} />;
    if (item.variantName) return <div key={item._id} className="col-span-full"><VariantCard variant={item} /></div>;
    if (item.brandCountry !== undefined) return <BrandCard key={item._id} brand={item} />;
    if (item.Model || (item.modelName && item.carImages)) return <CarCard key={item._id} car={item} />;
    if (item.modelName) return <ModelCard key={item._id} model={item} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Search Hero */}
      <div className="bg-linear-to-br from-[#19456d] to-[#1a3a5c] pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Search <span className="text-[#b48001]">Defence Auto Hub</span>
          </motion.h1>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#708ca4]" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); setActiveTab('All'); }}
              placeholder="Search brands, cars, models, variants…"
              autoFocus
              className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white text-[#19456d] font-medium focus:outline-none shadow-2xl text-base"
            />
            {query && (
              <button onClick={() => { setQuery(''); setPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#708ca4]/15 hover:bg-red-100 text-[#708ca4] hover:text-red-500 transition-all">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category tabs */}
        {q && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all shrink-0 ${activeTab === tab ? 'bg-[#19456d] text-white shadow-md' : 'bg-white border border-[#708ca4]/20 text-[#19456d] hover:border-[#b48001]'
                  }`}>
                {tab}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-[#708ca4]/10'}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {!q ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-[#708ca4]/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#19456d] mb-2">Start typing to search</h3>
            <p className="text-[#708ca4]">Find brands, vehicles, models and variants across Defence Auto Hub</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)}
          </div>
        ) : paged.length === 0 ? (
          <EmptyState
            title={`No results for "${query}"`}
            message="Try a different keyword or browse categories."
            action={{ label: 'Browse All Brands', onClick: () => (window.location.href = '/brands') }}
          />
        ) : (
          <motion.div
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
          >
            {paged.map((item, i) => (
              <motion.div key={item._id || i}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                {renderCard(item)}
              </motion.div>
            ))}
          </motion.div>
        )}

        {q && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
};

export default SearchPage;
