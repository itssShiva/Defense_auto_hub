import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, SlidersHorizontal, MapPin, Phone, Building2 } from 'lucide-react';
import { getAllVehicles } from '../Api/cars.api';
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
    vehicleType: 'All',
    category: 'All',
    state: 'All',
    city: 'All',
    priceSort: 'none'
  });

  useEffect(() => {
    document.title = 'All Vehicles — Defence Auto Hub';
    (async () => {
      setLoading(true);
      const [vehiclesRes, dealersRes] = await Promise.all([getAllVehicles(), getAllDealers()]);
      if (vehiclesRes?.success) {
        setCars(vehiclesRes.vehicles || []);
      }
      if (dealersRes?.success) {
        setDealers(dealersRes.dealers || []);
      }
      setLoading(false);
    })();
  }, []);

  // Derived filter options
  const brands = useMemo(() => ['All', ...new Set(cars.map(c => c.brandId?.brandName || c.brandName).filter(Boolean))], [cars]);
  const vehicleTypes = useMemo(() => ['All', ...new Set(cars.map(c => c.vehicleType).filter(Boolean))], [cars]);
  const categories = useMemo(() => ['All', ...new Set(cars.map(c => c.category).filter(Boolean))], [cars]);

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

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        (c.vehicleName || c.modelName || c.Model || '').toLowerCase().includes(q) ||
        (c.brandId?.brandName || c.brandName || '').toLowerCase().includes(q) ||
        (c.IndexNo || '').toLowerCase().includes(q)
      );
    }

    // Exact Match Filters
    if (filters.brand !== 'All') {
      list = list.filter(c => (c.brandId?.brandName || c.brandName) === filters.brand);
    }
    if (filters.vehicleType !== 'All') list = list.filter(c => c.vehicleType === filters.vehicleType);
    if (filters.category !== 'All') list = list.filter(c => c.category === filters.category);

    // Note: State/City filters are applied to the Dealers section, not car cards.

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

  // Filtered dealers based on state/city selection
  const filteredDealers = useMemo(() => {
    if (filters.state === 'All' && filters.city === 'All') return [];
    return dealers.filter(d => {
      const matchState = filters.state === 'All' || d.state === filters.state;
      const matchCity = filters.city === 'All' || d.city === filters.city;
      return matchState && matchCity;
    });
  }, [dealers, filters.state, filters.city]);

  // Pagination
  const totalPages = Math.ceil(processedCars.length / PER_PAGE);
  const pagedCars = processedCars.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearFilters = () => {
    setFilters({ brand: 'All', vehicleType: 'All', category: 'All', state: 'All', city: 'All', priceSort: 'none' });
    setSearch('');
    setPage(1);
  };

  const activeFiltersCount = [
    filters.brand !== 'All',
    filters.vehicleType !== 'All',
    filters.category !== 'All',
    filters.state !== 'All',
    filters.city !== 'All',
    filters.priceSort !== 'none',
    search.trim() !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* Hero Header */}
      <div className="bg-linear-to-br from-[#19456d] to-[#1a3a5c] pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#b48001] text-xs font-bold uppercase tracking-[4px] mb-3">
            Explore Collection
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Find Your <span className="text-[#b48001]">Dream Vehicle</span>
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

                {/* Vehicle Type Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">Vehicle Type</label>
                  <select
                    value={filters.vehicleType}
                    onChange={(e) => { setFilters(p => ({ ...p, vehicleType: e.target.value })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                  >
                    {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => { setFilters(p => ({ ...p, category: e.target.value })); setPage(1); }}
                    className="w-full p-3 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
                title="No vehicles match your criteria"
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

            {/* Dealers Section — shown when state/city filter is active */}
            {filteredDealers.length > 0 && (
              <div className="mt-12 border-t border-[#708ca4]/20 pt-10">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-[#b48001]" />
                  <div>
                    <h2 className="text-xl font-extrabold text-[#19456d]">Dealers in {filters.city !== 'All' ? filters.city : filters.state}</h2>
                    <p className="text-xs text-[#708ca4]">{filteredDealers.length} dealer{filteredDealers.length !== 1 ? 's' : ''} found</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDealers.map(dealer => (
                    <div key={dealer._id}
                      className="bg-white rounded-2xl border border-[#708ca4]/15 p-5 shadow-sm hover:shadow-md hover:border-[#b48001]/30 transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {dealer.logo ? (
                          <img src={dealer.logo?.startsWith('http') ? dealer.logo : `${import.meta.env.VITE_BACKEND_URL}${dealer.logo}`}
                            alt={dealer.dealerName} className="w-12 h-12 rounded-xl object-contain border border-[#708ca4]/15 bg-[#fafbf8] p-1" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#19456d]/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6 text-[#19456d]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-[#19456d] leading-tight text-sm truncate">{dealer.dealerName || dealer.name}</h3>
                          <p className="text-[10px] text-[#b48001] font-bold uppercase tracking-wider mt-0.5">{dealer.dealerType || 'Dealer'}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-[#708ca4]">
                        {(dealer.city || dealer.state) && (
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#b48001] shrink-0" />
                            {[dealer.city, dealer.state].filter(Boolean).join(', ')}
                          </p>
                        )}
                        {dealer.phone && (
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#b48001] shrink-0" />
                            {dealer.phone}
                          </p>
                        )}
                      </div>
                      {dealer.brandsHandled?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {dealer.brandsHandled.slice(0, 4).map((b, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#19456d]/8 text-[#19456d] text-[10px] font-bold rounded-full">
                              {typeof b === 'object' ? b.brandName : b}
                            </span>
                          ))}
                          {dealer.brandsHandled.length > 4 && (
                            <span className="px-2 py-0.5 bg-[#708ca4]/10 text-[#708ca4] text-[10px] font-bold rounded-full">+{dealer.brandsHandled.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCarsPage;
