import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import { getAllCars } from '../Api/cars.api';
import { getAllDealers } from '../../auth/Api/auth.api';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const PER_PAGE = 12;

const AllCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Filters State
  const [filters, setFilters] = useState({
    brand: 'All',
    fuel: 'All',
    transmission: 'All',
    bodyType: 'All',
    state: 'All',
    city: 'All',
    priceSort: 'none'
  });

  useEffect(() => {
    document.title = 'All Cars — Defence Auto Hub';
    (async () => {
      setLoading(true);
      const [carsRes, dealersRes] = await Promise.all([getAllCars(), getAllDealers()]);
      if (carsRes?.success) {
        setCars(carsRes.cars || []);
      }
      if (dealersRes?.success) {
        setDealers(dealersRes.dealers || []);
      }
      setLoading(false);
    })();
  }, []);

  // Derived filter options
  const brands = useMemo(() => ['All', ...new Set(cars.map(c => c.brand?.brandName || c.brandName).filter(Boolean))], [cars]);
  const fuels = useMemo(() => ['All', ...new Set(cars.map(c => c.fuelType).filter(Boolean))], [cars]);
  const transmissions = useMemo(() => ['All', ...new Set(cars.map(c => c.transmissionType).filter(Boolean))], [cars]);
  const bodyTypes = useMemo(() => ['All', ...new Set(cars.map(c => c.bodyType).filter(Boolean))], [cars]);

  // Derived location options from dealers
  const states = useMemo(() => {
    return ['All', ...new Set(dealers.map(d => d.state).filter(Boolean))];
  }, [dealers]);

  const cities = useMemo(() => {
    if (filters.state === 'All') return ['All'];
    return ['All', ...new Set(dealers.filter(d => d.state === filters.state).map(d => d.city).filter(Boolean))];
  }, [dealers, filters.state]);

  // Apply filters and sorting
  const processedCars = useMemo(() => {
    let list = [...cars];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.brand?.brandName || c.brandName || '').toLowerCase().includes(q) ||
        (c.modelName || '').toLowerCase().includes(q)
      );
    }

    // Exact Match Filters
    if (filters.brand !== 'All') {
      list = list.filter(c => (c.brand?.brandName || c.brandName) === filters.brand);
    }
    if (filters.fuel !== 'All') list = list.filter(c => c.fuelType === filters.fuel);
    if (filters.transmission !== 'All') list = list.filter(c => c.transmissionType === filters.transmission);
    if (filters.bodyType !== 'All') list = list.filter(c => c.bodyType === filters.bodyType);

    // Location (Dealer Mapping) Filter
    if (filters.state !== 'All' || filters.city !== 'All') {
      const validDealers = dealers.filter(d => {
        const matchState = filters.state === 'All' || d.state === filters.state;
        const matchCity = filters.city === 'All' || d.city === filters.city;
        return matchState && matchCity;
      });
      const validBrandIds = new Set(
        validDealers.flatMap(d => d.brandsHandled?.map(b => typeof b === 'object' ? b._id : b) || [])
      );
      list = list.filter(c => validBrandIds.has(c.brandId));
    }

    // Sorting
    if (filters.priceSort === 'low-high') {
      list.sort((a, b) => (Number(a.price || a.CSDPrice) || 0) - (Number(b.price || b.CSDPrice) || 0));
    } else if (filters.priceSort === 'high-low') {
      list.sort((a, b) => (Number(b.price || b.CSDPrice) || 0) - (Number(a.price || a.CSDPrice) || 0));
    } else if (filters.priceSort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [cars, search, filters]);

  // Pagination
  const totalPages = Math.ceil(processedCars.length / PER_PAGE);
  const pagedCars = processedCars.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearFilters = () => {
    setFilters({ brand: 'All', fuel: 'All', transmission: 'All', bodyType: 'All', state: 'All', city: 'All', priceSort: 'none' });
    setSearch('');
    setPage(1);
  };

  const activeFiltersCount = [
    filters.brand !== 'All',
    filters.fuel !== 'All',
    filters.transmission !== 'All',
    filters.bodyType !== 'All',
    filters.state !== 'All',
    filters.city !== 'All',
    filters.priceSort !== 'none',
    search.trim() !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#19456d] to-[#1a3a5c] pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#b48001] text-xs font-bold uppercase tracking-[4px] mb-3">
            Explore Collection
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Find Your <span className="text-[#b48001]">Dream Car</span>
          </motion.h1>
          <p className="text-[#708ca4] text-base mb-8">
            {loading ? 'Loading vehicles...' : `Browse ${cars.length} premium vehicles from top brands`}
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#708ca4]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by brand or model name..."
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white text-[#19456d] font-medium focus:outline-none shadow-2xl text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Sidebar (Filters on Desktop) */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-3xl border border-[#708ca4]/15 p-6 sticky top-28 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-[#19456d] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" /> Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600">
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => { setFilters(p => ({ ...p, brand: e.target.value })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Fuel Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">Fuel Type</label>
                  <select
                    value={filters.fuel}
                    onChange={(e) => { setFilters(p => ({ ...p, fuel: e.target.value })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                  >
                    {fuels.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Transmission Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => { setFilters(p => ({ ...p, transmission: e.target.value })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                  >
                    {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Body Type Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">Body Type</label>
                  <select
                    value={filters.bodyType}
                    onChange={(e) => { setFilters(p => ({ ...p, bodyType: e.target.value })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                  >
                    {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* State Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => { setFilters(p => ({ ...p, state: e.target.value, city: 'All' })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                  >
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => { setFilters(p => ({ ...p, city: e.target.value })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                    disabled={filters.state === 'All'}
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-3 rounded-2xl border border-[#708ca4]/15 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showFilters ? 'bg-[#19456d] text-white' : 'bg-[#fafbf8] text-[#19456d]'
                    }`}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-[#b48001] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">{activeFiltersCount}</span>
                  )}
                </button>
                <p className="text-sm font-bold text-[#708ca4]">
                  Showing {processedCars.length} results
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={filters.priceSort}
                  onChange={(e) => { setFilters(p => ({ ...p, priceSort: e.target.value })); setPage(1); }}
                  className="bg-transparent text-sm font-bold text-[#19456d] focus:outline-none pr-2 cursor-pointer"
                >
                  <option value="none">Sort By: Featured</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>

                <div className="hidden sm:flex items-center gap-1 bg-[#fafbf8] rounded-xl p-1 border border-[#708ca4]/15">
                  <button onClick={() => setViewMode('grid')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-[#19456d]' : 'text-[#708ca4]'}`}>
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-[#19456d]' : 'text-[#708ca4]'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : pagedCars.length === 0 ? (
              <EmptyState
                title="No cars match your criteria"
                message="Try adjusting your filters to find what you're looking for."
                action={{ label: 'Clear Filters', onClick: clearFilters }}
              />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"}
              >
                {pagedCars.map(car => (
                  <motion.div key={car._id} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                    <CarCard car={car} layout={viewMode} linkTo={`/cars/${car.slug || car._id}`} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCarsPage;
