import React from 'react';

/* ── Base skeleton box ─────────────────────────────── */
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#708ca4]/15 rounded-xl ${className}`} />
);

/* ── Brand card skeleton ───────────────────────────── */
export const BrandCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#708ca4]/10 p-6 flex flex-col items-center gap-4">
    <SkeletonBox className="w-20 h-20 rounded-2xl" />
    <SkeletonBox className="h-5 w-28" />
    <SkeletonBox className="h-4 w-20" />
    <SkeletonBox className="h-6 w-24 rounded-full" />
  </div>
);

/* ── Car / Model card skeleton ─────────────────────── */
export const CarCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#708ca4]/10 overflow-hidden">
    <SkeletonBox className="h-52 rounded-none" />
    <div className="p-5 space-y-3">
      <SkeletonBox className="h-3 w-20 rounded-full" />
      <SkeletonBox className="h-5 w-3/4" />
      <div className="flex gap-2">
        <SkeletonBox className="h-7 w-20 rounded-full" />
        <SkeletonBox className="h-7 w-24 rounded-full" />
      </div>
      <SkeletonBox className="h-5 w-1/3" />
    </div>
  </div>
);

/* ── Hero / banner skeleton ────────────────────────── */
export const HeroSkeleton = () => (
  <SkeletonBox className="h-[70vh] w-full rounded-3xl" />
);

/* ── Specification table skeleton ──────────────────── */
export const TableSkeleton = ({ rows = 8 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <SkeletonBox className="h-12 w-1/3" />
        <SkeletonBox className="h-12 flex-1" />
      </div>
    ))}
  </div>
);

/* ── Blog card skeleton ────────────────────────────── */
export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#708ca4]/10 overflow-hidden">
    <SkeletonBox className="h-48 rounded-none" />
    <div className="p-5 space-y-3">
      <SkeletonBox className="h-5 w-20 rounded-full" />
      <SkeletonBox className="h-6 w-full" />
      <SkeletonBox className="h-4 w-3/4" />
      <div className="flex gap-2">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-4 w-16" />
      </div>
    </div>
  </div>
);

/* ── Variant list item skeleton ────────────────────── */
export const VariantListSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-[#708ca4]/10">
        <SkeletonBox className="w-24 h-20 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-5 w-1/2" />
          <div className="flex gap-2">
            <SkeletonBox className="h-5 w-16 rounded-full" />
            <SkeletonBox className="h-5 w-16 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonBox;
