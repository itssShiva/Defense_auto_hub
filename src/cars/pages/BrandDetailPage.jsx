import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Layers, Car, Search } from 'lucide-react';
import { getAllBrands } from '../../brand/api/brand.api';
import { getAllCars, getAllModels } from '../Api/cars.api';
import CarCard from '../components/CarCard';
import ModelCard from '../components/ModelCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { CarCardSkeleton } from '../components/LoadingSkeleton';
import { getImageUrl } from '../utils/helpers';

const ITEMS_PER_PAGE = 12;

const BrandDetailPage = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [brandsRes, carsRes, modelsRes] = await Promise.all([
        getAllBrands(), getAllCars(), getAllModels(),
      ]);

      if (brandsRes?.success) {
        const found = (brandsRes.brands || []).find(
          (b) => b.slug === slug || b._id === slug
        );
        setBrand(found || null);

        if (found) {
          document.title = `${found.brandName} Cars — Defence Auto Hub`;
          const match = (item) =>
            item.brandId?._id === found._id ||
            item.brandId === found._id ||
            item.brandName?.toLowerCase() === found.brandName?.toLowerCase();

          if (carsRes?.success) setCars((carsRes.cars || []).filter(match));
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  const fuelTypes = useMemo(() => {
    const set = new Set(cars.map((i) => i.fuelType).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [cars]);

  const filtered = useMemo(() => {
    let list = [...cars];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        (i.modelName || i.Model || '').toLowerCase().includes(q)
      );
    }
    if (fuelFilter !== 'All') list = list.filter((i) => i.fuelType === fuelFilter);
    return list;
  }, [cars, search, fuelFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const switchTab = (tab) => { setActiveTab(tab); setPage(1); setSearch(''); setFuelFilter('All'); };
  const logoSrc = getImageUrl(brand?.logo);

  if (!loading && !brand) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState
          title="Brand not found"
          message="This brand doesn't exist or may have been removed."
          action={{ label: 'Browse All Brands', onClick: () => (window.location.href = '/brands') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* ── Hero ── */}
      <div className="relative bg-linear-to-br from-[#19456d] via-[#19456d] to-[#1a3a5c] pt-10 pb-24 px-4 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 16, repeat: Infinity }}
          className="absolute -top-28 -right-28 w-[450px] h-[450px] bg-[#b48001]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <Link to="/brands" className="inline-flex items-center gap-2 text-white/65 hover:text-white text-sm font-semibold mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Brands
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Logo */}
            <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
              className="w-28 h-28 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center shrink-0">
              {loading ? (
                <div className="w-full h-full bg-[#708ca4]/15 rounded-2xl animate-pulse" />
              ) : logoSrc ? (
                <img src={logoSrc} alt={brand?.brandName} className="w-full h-full object-contain" />
              ) : (
                <span className="text-4xl font-extrabold text-[#708ca4]/40 select-none">
                  {brand?.brandName?.charAt(0)}
                </span>
              )}
            </motion.div>

            {/* Text */}
            <div className="text-center sm:text-left">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-9 w-56 bg-white/15 rounded-xl animate-pulse mx-auto sm:mx-0" />
                  <div className="h-5 w-36 bg-white/10 rounded-xl animate-pulse mx-auto sm:mx-0" />
                </div>
              ) : (
                <>
                  <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold text-white mb-2">{brand?.brandName}</motion.h1>
                  {brand?.brandCountry && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-white/65 text-sm mb-5">
                      <Globe className="w-4 h-4" /> {brand.brandCountry}
                    </div>
                  )}
                  <div className="flex items-center justify-center sm:justify-start gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-[#b48001]">{cars.length}</p>
                      <p className="text-white/55 text-xs font-medium mt-0.5">Vehicles Available</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-16">
        {/* Header Tab */}
        <div className="inline-flex bg-white rounded-2xl border border-[#708ca4]/15 shadow-sm p-1.5 mb-8 gap-1">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-[#19456d] text-white shadow-md cursor-default">
            <Car className="w-4 h-4" /> Vehicles
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">{cars.length}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={`Search vehicles…`}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#708ca4]/25 bg-white text-[#19456d] font-medium text-sm focus:outline-none focus:ring-1 focus:ring-[#b48001]"
            />
          </div>
          {fuelTypes.length > 2 && (
            <div className="flex gap-2 flex-wrap">
              {fuelTypes.map((f) => (
                <button key={f} onClick={() => { setFuelFilter(f); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${fuelFilter === f ? 'bg-[#b48001] text-white border-transparent' : 'bg-white border-[#708ca4]/20 text-[#19456d] hover:border-[#b48001]'
                    }`}>{f}</button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState title="No results" message="Try a different filter or search term." />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {paginated.map((item) => (
              <motion.div key={item._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <CarCard car={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default BrandDetailPage;
