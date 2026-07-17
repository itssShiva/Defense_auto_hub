import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Car, Search } from 'lucide-react';
import { getAllBrands } from '../../brand/api/brand.api';
import { getAllCars } from '../Api/cars.api';
import CarCard from '../components/CarCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { CarCardSkeleton } from '../components/LoadingSkeleton';
import { getImageUrl } from '../utils/helpers';

const ITEMS_PER_PAGE = 12;

const BrandDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setPage(1);
      setSearch('');
      setFuelFilter('All');
      const [brandsRes, carsRes] = await Promise.all([
        getAllBrands(), getAllCars(),
      ]);

      if (cancelled) return;

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

          if (carsRes?.success) {
            setCars((carsRes.cars || []).filter(match));
          } else {
            setCars([]);
          }
        } else {
          setCars([]);
        }
      } else {
        setBrand(null);
        setCars([]);
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const logoSrc = getImageUrl(brand?.logo);

  if (!loading && !brand) {
    return (
      <div className="min-h-screen bg-[#fafbf8] flex items-center justify-center">
        <EmptyState
          title="Brand not found"
          message="This brand doesn't exist or may have been removed."
          action={{ label: 'Browse All Brands', onClick: () => navigate('/brands') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbf8]">
      {/* ── Stunning Hero Section ── */}
      <div className="relative bg-[#19456d] pt-12 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-0">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-linear-to-bl from-[#1a3a5c] to-[#19456d] rounded-full opacity-50 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#b48001]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#2a6b9c]/20 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/brands" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Brands
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
            {/* Logo Wrapper with Glass Effect */}
            <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.15)] flex items-center justify-center shrink-0 z-20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-[#fafbf8] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {loading ? (
                <div className="w-full h-full bg-[#708ca4]/15 rounded-xl animate-pulse" />
              ) : logoSrc ? (
                <img src={logoSrc} alt={brand?.brandName} className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <span className="text-5xl font-extrabold text-[#708ca4]/40 select-none relative z-10">
                  {brand?.brandName?.charAt(0)}
                </span>
              )}
            </motion.div>

            {/* Brand Info */}
            <div className="text-center sm:text-left flex-1">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-10 w-64 bg-white/20 rounded-lg animate-pulse mx-auto sm:mx-0" />
                  <div className="h-6 w-40 bg-white/15 rounded-lg animate-pulse mx-auto sm:mx-0" />
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300 drop-shadow-lg tracking-tight">
                    {brand?.brandName}
                  </motion.h1>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/80 font-medium">
                    {brand?.brandCountry && (
                      <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5">
                        <Globe className="w-4 h-4 text-[#b48001]" /> {brand.brandCountry}
                      </span>
                    )}
                    <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5">
                      <Car className="w-4 h-4 text-[#b48001]" />
                      <span className="text-white font-bold">{cars.length}</span> Vehicles Available
                    </span>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-16">
        {/* Header Tab & Filters Bar */}
        <div className="bg-white rounded-3xl border border-[#708ca4]/15 shadow-lg p-4 sm:p-6 mb-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">

          <div className="inline-flex bg-[#fafbf8] rounded-2xl p-1.5 gap-1 border border-[#708ca4]/10 shrink-0">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all bg-[#19456d] text-white shadow-md">
              <Car className="w-4 h-4" /> Vehicles
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 ml-1">{cars.length}</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#708ca4]" />
              <input type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search models..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#708ca4]/20 bg-[#fafbf8] text-[#19456d] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#b48001] focus:bg-white transition-all shadow-sm"
              />
            </div>

            {fuelTypes.length > 2 && (
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                {fuelTypes.map((f) => (
                  <button key={f} onClick={() => { setFuelFilter(f); setPage(1); }}
                    className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border whitespace-nowrap shrink-0 shadow-sm
                      ${fuelFilter === f
                        ? 'bg-[#b48001] text-white border-transparent'
                        : 'bg-white border-[#708ca4]/20 text-[#708ca4] hover:text-[#19456d] hover:border-[#19456d]'
                      }`}>{f}</button>
                ))}
              </div>
            )}
          </div>
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
