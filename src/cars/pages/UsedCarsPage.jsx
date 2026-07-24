import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Grid3X3, List, Fuel, Settings2, Calendar, MapPin,
  CheckCircle, ChevronRight, SlidersHorizontal, X, IndianRupee, MessageCircle
} from 'lucide-react';
import { getAllUsedCars } from '../Api/cars.api';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { CarCardSkeleton } from '../components/LoadingSkeleton';
import { getImageUrl, formatCompactPrice, FALLBACK_IMAGE } from '../utils/helpers';
import DealerModal from '../components/DealerModal';
import ContactDealerModal from '../components/ContactDealerModal';

const PER_PAGE = 12;

const UsedCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const urlBrand = searchParams.get('brand') || 'All';
  const urlBudgetMin = searchParams.get('budgetMin') || '';
  const urlBudgetMax = searchParams.get('budgetMax') || '';
  const urlFuelType = searchParams.get('fuelType') || '';
  const urlModelId = searchParams.get('modelId') || '';

  const [filters, setFilters] = useState({
    brand: urlBrand,
    budgetMin: urlBudgetMin,
    budgetMax: urlBudgetMax,
    fuelType: urlFuelType,
    modelId: urlModelId,
    vehicleType: 'All',
    category: 'All',
    state: 'All',
    city: 'All',
    priceSort: 'none'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [dealerModalOpen, setDealerModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactCar, setContactCar] = useState(null);

  useEffect(() => {
    document.title = 'Used Vehicles — Defence Auto Hub';
    (async () => {
      setLoading(true);
      const res = await getAllUsedCars();
      if (res?.success) {
        // Only show approved/verified cars
        const approved = (res.usedCars || res.cars || []).filter(
          (c) => c.status === 'approved' ||
            c.isVerified === 'Approved' ||
            c.isVerified === 'approved' ||
            c.isVerified === 'Verified' ||
            c.isVerified === 'verified' ||
            c.isApproved === true ||
            c.approved === true
        );
        setCars(approved);
      }
      setLoading(false);
    })();
  }, []);

  const brands = useMemo(() => ['All', ...new Set(cars.map((c) => c.brandName).filter(Boolean))], [cars]);
  const vehicleTypes = useMemo(() => ['All', ...new Set(cars.map((c) => c.vehicleType).filter(Boolean))], [cars]);
  const categories = useMemo(() => ['All', ...new Set(cars.map((c) => c.category).filter(Boolean))], [cars]);
  const states = useMemo(() => ['All', ...new Set(cars.map((c) => c.state || c.State).filter(Boolean))], [cars]);
  const cities = useMemo(() => {
    if (filters.state === 'All') return ['All'];
    return ['All', ...new Set(cars.filter((c) => (c.state || c.State) === filters.state).map((c) => c.city || c.City).filter(Boolean))];
  }, [cars, filters.state]);

  const filtered = useMemo(() => {
    let list = [...cars];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.modelName || c.Model || '').toLowerCase().includes(q) ||
        (c.brandName || '').toLowerCase().includes(q)
      );
    }
    if (filters.brand !== 'All') {
      list = list.filter((c) => c.brandName === filters.brand);
    }
    if (filters.vehicleType !== 'All') {
      list = list.filter((c) => c.vehicleType === filters.vehicleType);
    }
    if (filters.category !== 'All') {
      list = list.filter((c) => c.category === filters.category);
    }
    if (filters.state !== 'All') {
      list = list.filter((c) => (c.state || c.State) === filters.state);
    }
    if (filters.city !== 'All') {
      list = list.filter((c) => (c.city || c.City) === filters.city);
    }
    if (filters.budgetMin) {
      list = list.filter(c => Number(c.price || c.askingPrice || c.CSDPrice || 0) >= Number(filters.budgetMin));
    }
    if (filters.budgetMax) {
      list = list.filter(c => Number(c.price || c.askingPrice || c.CSDPrice || 0) <= Number(filters.budgetMax));
    }
    if (filters.fuelType) {
      list = list.filter(c => (c.fuelType || '').toLowerCase() === filters.fuelType.toLowerCase());
    }
    if (filters.modelId) {
      list = list.filter(c => c.modelId === filters.modelId || c.model === filters.modelId);
    }

    // Sorting
    if (filters.priceSort === 'low-high') {
      list.sort((a, b) => (Number(a.price || a.askingPrice || a.CSDPrice) || 0) - (Number(b.price || b.askingPrice || b.CSDPrice) || 0));
    } else if (filters.priceSort === 'high-low') {
      list.sort((a, b) => (Number(b.price || b.askingPrice || b.CSDPrice) || 0) - (Number(a.price || a.askingPrice || a.CSDPrice) || 0));
    } else if (filters.priceSort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [cars, search, filters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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

  const UsedCarCard = ({ car, list }) => {
    const img = getImageUrl(car.carImages?.[0]) || FALLBACK_IMAGE;
    const price = car.price || car.askingPrice || car.CSDPrice;
    const name = car.modelName || car.Model || 'Used Vehicle';

    if (list) {
      return (
        <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.18 }}
          className="flex gap-5 bg-white rounded-2xl border border-[#708ca4]/15 p-4 shadow-sm hover:shadow-md hover:border-[#b48001]/30 transition-all">
          <div className="w-44 h-32 shrink-0 rounded-xl overflow-hidden bg-[#fafbf8]">
            <img src={img} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold text-[#b48001] uppercase tracking-widest">{car.brandName}</p>
                <h3 className="text-lg font-extrabold text-[#19456d] leading-tight">{name}</h3>
              </div>
              {(car.status === 'approved' || car.isApproved || car.isVerified === 'Approved' || car.isVerified === 'approved' || car.isVerified === 'Verified' || car.isVerified === 'verified') && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full shrink-0">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 my-2">
              {car.fuelType && <span className="flex items-center gap-1 text-xs text-[#708ca4]"><Fuel className="w-3 h-3 text-[#b48001]" />{car.fuelType}</span>}
              {car.transmissionType && <span className="flex items-center gap-1 text-xs text-[#708ca4]"><Settings2 className="w-3 h-3 text-[#b48001]" />{car.transmissionType}</span>}
              {car.year && <span className="flex items-center gap-1 text-xs text-[#708ca4]"><Calendar className="w-3 h-3 text-[#b48001]" />{car.year}</span>}
              {(car.location || car.Address || car.city || car.City) && <span className="flex items-center gap-1 text-xs text-[#708ca4]"><MapPin className="w-3 h-3 text-[#b48001]" />{car.location || car.Address || car.city || car.City}</span>}
            </div>
            {price && <p className="text-xl font-extrabold text-[#19456d]">{formatCompactPrice(price)}</p>}
            {(car.kmDriven || car.kmTravelled) && <p className="text-xs text-[#708ca4] mt-1">{(car.kmDriven || car.kmTravelled)?.toLocaleString('en-IN')} km driven</p>}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Link to={`/used-cars/${car._id}`} className="px-4 py-2 bg-white border-2 border-[#19456d] text-[#19456d] font-bold text-xs rounded-xl hover:bg-[#19456d] hover:text-white transition-colors">
                View Details
              </Link>
              <button onClick={(e) => { e.preventDefault(); setSelectedDealer(car.postedBy); setDealerModalOpen(true); }} className="px-4 py-2 bg-white border border-[#708ca4]/30 text-[#19456d] font-bold text-xs rounded-xl hover:bg-[#19456d] hover:text-white transition-colors">
                View Dealer
              </button>
              <button onClick={(e) => { e.preventDefault(); setContactCar(car); setContactModalOpen(true); }} className="px-4 py-2 bg-[#b48001] text-white font-bold text-xs rounded-xl hover:bg-[#19456d] transition-colors flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Contact
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.22 }}
        className="bg-white rounded-2xl border border-[#708ca4]/15 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#b48001]/30 transition-all">
        <div className="relative h-48 overflow-hidden bg-[#fafbf8]">
          <img src={img} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }} />
          {(car.status === 'approved' || car.isApproved || car.isVerified === 'Approved' || car.isVerified === 'approved' || car.isVerified === 'Verified' || car.isVerified === 'verified') && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
              <CheckCircle className="w-3 h-3" /> Verified
            </div>
          )}
          {car.year && <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/55 text-white text-[10px] font-bold rounded-full">{car.year}</div>}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-bold text-[#b48001] uppercase tracking-widest mb-0.5">{car.brandName}</p>
          <h3 className="text-base font-extrabold text-[#19456d] mb-2">{name}</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {car.fuelType && <span className="flex items-center gap-1 text-[11px] text-[#708ca4]"><Fuel className="w-3 h-3 text-[#b48001]" />{car.fuelType}</span>}
            {car.transmissionType && <span className="flex items-center gap-1 text-[11px] text-[#708ca4]"><Settings2 className="w-3 h-3 text-[#b48001]" />{car.transmissionType}</span>}
            {(car.location || car.Address || car.city || car.City) && <span className="flex items-center gap-1 text-[11px] text-[#708ca4]"><MapPin className="w-3 h-3 text-[#b48001]" />{car.location || car.Address || car.city || car.City}</span>}
          </div>
          {price && <p className="text-xl font-extrabold text-[#19456d] mb-1">{formatCompactPrice(price)}</p>}
          {(car.kmDriven || car.kmTravelled) && <p className="text-xs text-[#708ca4]">{(car.kmDriven || car.kmTravelled)?.toLocaleString('en-IN')} km</p>}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Link to={`/used-cars/${car._id}`} className="flex items-center justify-center py-2.5 bg-white border-2 border-[#19456d] text-[#19456d] font-bold text-xs rounded-xl hover:bg-[#19456d] hover:text-white transition-colors">
              View Details
            </Link>
            <button onClick={(e) => { e.preventDefault(); setSelectedDealer(car.postedBy); setDealerModalOpen(true); }} className="flex items-center justify-center py-2.5 bg-white border border-[#708ca4]/30 text-[#19456d] font-bold text-xs rounded-xl hover:bg-[#19456d] hover:text-white transition-colors">
              View Dealer
            </button>
            <button onClick={(e) => { e.preventDefault(); setContactCar(car); setContactModalOpen(true); }} className="flex items-center justify-center gap-1 py-2.5 bg-[#b48001] text-white font-bold text-xs rounded-xl hover:bg-[#19456d] transition-colors">
              <MessageCircle className="w-3.5 h-3.5" /> Contact
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      <DealerModal isOpen={dealerModalOpen} onClose={() => { setDealerModalOpen(false); setSelectedDealer(null); }} dealer={selectedDealer} />
      <ContactDealerModal
        isOpen={contactModalOpen}
        onClose={() => { setContactModalOpen(false); setContactCar(null); }}
        carName={contactCar ? `${contactCar.brandName || ''} ${contactCar.modelName || contactCar.Model || ''}`.trim() : ''}
        carId={contactCar?._id}
        dealer={contactCar?.postedBy}
      />
      {/* Hero */}
      <div className="bg-linear-to-br from-[#19456d] to-[#1a3a5c] pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#b48001] text-xs font-bold uppercase tracking-[4px] mb-3">
            Defence Auto Hub
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Used <span className="text-[#b48001]">Vehicles</span>
          </motion.h1>
          <p className="text-[#708ca4] text-base mb-8">
            {loading ? '…' : `${cars.length} verified used vehicles available`}
          </p>
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#708ca4]" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search brand or model…"
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white text-[#19456d] font-medium focus:outline-none shadow-2xl text-base" />
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
                  Showing {filtered.length} results
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

            {/* Grid / List */}
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : paged.length === 0 ? (
              <EmptyState title="No used vehicles found" message="Try adjusting your filters." action={{ label: 'Clear Filters', onClick: clearFilters }} />
            ) : viewMode === 'grid' ? (
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paged.map((car) => (
                  <motion.div key={car._id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <UsedCarCard car={car} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {paged.map((car) => <UsedCarCard key={car._id} car={car} list />)}
              </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsedCarsPage;
