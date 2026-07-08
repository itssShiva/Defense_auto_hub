import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Grid3X3, List, Fuel, Settings2, Calendar, MapPin,
  CheckCircle, ChevronRight, SlidersHorizontal, X, IndianRupee
} from 'lucide-react';
import { getAllUsedCars } from '../Api/cars.api';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { CarCardSkeleton } from '../components/LoadingSkeleton';
import { getImageUrl, formatCompactPrice, FALLBACK_IMAGE } from '../utils/helpers';
import DealerModal from '../components/DealerModal';

const PER_PAGE = 12;

const UsedCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ fuel: 'All', transmission: 'All', priceMax: '', location: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [dealerModalOpen, setDealerModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);

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

  const fuels = useMemo(() => ['All', ...new Set(cars.map((c) => c.fuelType).filter(Boolean))], [cars]);
  const transmissions = useMemo(() => ['All', ...new Set(cars.map((c) => c.transmissionType).filter(Boolean))], [cars]);

  const filtered = useMemo(() => {
    let list = [...cars];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.modelName || c.Model || '').toLowerCase().includes(q) ||
        c.brandName?.toLowerCase().includes(q)
      );
    }
    if (filters.fuel !== 'All') list = list.filter((c) => c.fuelType === filters.fuel);
    if (filters.transmission !== 'All') list = list.filter((c) => c.transmissionType === filters.transmission);
    if (filters.priceMax) list = list.filter((c) => Number(c.price || c.askingPrice || c.CSDPrice || 0) <= Number(filters.priceMax));
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      list = list.filter((c) => (c.location || c.Address || '')?.toLowerCase().includes(loc) || (c.city || c.City || '')?.toLowerCase().includes(loc));
    }
    return list;
  }, [cars, search, filters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearFilters = () => {
    setFilters({ fuel: 'All', transmission: 'All', priceMax: '', location: '' });
    setSearch('');
    setPage(1);
  };

  const activeFiltersCount = [
    filters.fuel !== 'All',
    filters.transmission !== 'All',
    filters.priceMax,
    filters.location,
    search.trim(),
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
              <button onClick={(e) => { e.preventDefault(); setSelectedDealer(car.postedBy); setDealerModalOpen(true); }} className="px-4 py-2 bg-[#b48001] text-white font-bold text-xs rounded-xl hover:bg-[#19456d] transition-colors">
                View Dealer
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
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link to={`/used-cars/${car._id}`} className="flex items-center justify-center py-2.5 bg-white border-2 border-[#19456d] text-[#19456d] font-bold text-xs rounded-xl hover:bg-[#19456d] hover:text-white transition-colors">
              View Details
            </Link>
            <button onClick={(e) => { e.preventDefault(); setSelectedDealer(car.postedBy); setDealerModalOpen(true); }} className="flex items-center justify-center py-2.5 bg-[#b48001] text-white font-bold text-xs rounded-xl hover:bg-[#19456d] transition-colors">
              View Dealer
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      <DealerModal isOpen={dealerModalOpen} onClose={() => { setDealerModalOpen(false); setSelectedDealer(null); }} dealer={selectedDealer} />
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
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border transition-all ${showFilters ? 'bg-[#19456d] text-white border-transparent' : 'bg-white border-[#708ca4]/20 text-[#19456d] hover:border-[#b48001]'
                }`}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-[#b48001] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">{activeFiltersCount}</span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-[#708ca4] hover:text-red-500 font-medium flex items-center gap-1 transition-colors">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
            <p className="text-sm text-[#708ca4] font-medium">{filtered.length} results</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-[#708ca4]/20 p-1">
            <button onClick={() => setViewMode('grid')} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#19456d] text-white' : 'text-[#708ca4] hover:text-[#19456d]'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#19456d] text-white' : 'text-[#708ca4] hover:text-[#19456d]'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#708ca4]/15 p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-1.5">Fuel Type</label>
              <select value={filters.fuel} onChange={(e) => { setFilters((p) => ({ ...p, fuel: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white">
                {fuels.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-1.5">Transmission</label>
              <select value={filters.transmission} onChange={(e) => { setFilters((p) => ({ ...p, transmission: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white">
                {transmissions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-1.5">Max Price (₹)</label>
              <input type="number" value={filters.priceMax} onChange={(e) => { setFilters((p) => ({ ...p, priceMax: e.target.value })); setPage(1); }}
                placeholder="e.g. 500000"
                className="w-full px-3 py-2 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#708ca4] uppercase tracking-widest block mb-1.5">Location</label>
              <input type="text" value={filters.location} onChange={(e) => { setFilters((p) => ({ ...p, location: e.target.value })); setPage(1); }}
                placeholder="City or area"
                className="w-full px-3 py-2 rounded-xl border border-[#708ca4]/20 text-sm font-medium text-[#19456d] focus:outline-none focus:ring-1 focus:ring-[#b48001] bg-white" />
            </div>
          </motion.div>
        )}

        {/* Grid / List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5' : 'space-y-4'}>
            {Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)}
          </div>
        ) : paged.length === 0 ? (
          <EmptyState title="No used vehicles found" message="Try adjusting your filters." action={{ label: 'Clear Filters', onClick: clearFilters }} />
        ) : viewMode === 'grid' ? (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
  );
};

export default UsedCarsPage;
