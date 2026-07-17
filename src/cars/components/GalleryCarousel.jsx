import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Expand } from 'lucide-react';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/helpers';

const GalleryCarousel = ({ images = [], onFullscreen, layout = 'horizontal' }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const imgs = images.length ? images : [null];

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col-reverse md:flex-row gap-3' : 'flex-col gap-3'}`}>
      {/* ── Thumbnails ── */}
      {imgs.length > 1 && (
        <div className={`${layout === 'vertical' ? 'md:w-24' : 'w-full'} shrink-0`}>
          <Swiper
            modules={[FreeMode, Thumbs]}
            onSwiper={setThumbsSwiper}
            freeMode
            watchSlidesProgress
            direction="horizontal"
            breakpoints={layout === 'vertical' ? {
              768: { direction: 'vertical', slidesPerView: 'auto', spaceBetween: 12 }
            } : undefined}
            slidesPerView={4.5}
            spaceBetween={8}
            className={`${layout === 'vertical' ? 'h-[72px] md:h-full md:max-h-[400px]' : 'h-[72px]'}`}
          >
            {imgs.map((img, i) => (
              <SwiperSlide key={i} className="cursor-pointer">
                <div
                  className={`h-full md:h-20 w-full rounded-xl overflow-hidden border-2 transition-all ${activeIndex === i
                    ? 'border-[#b48001] opacity-100'
                    : 'border-transparent opacity-55 hover:opacity-80'
                    }`}
                >
                  <img
                    src={getImageUrl(img) || FALLBACK_IMAGE}
                    alt={`Thumb ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* ── Main Swiper ── */}
      <div className={`relative rounded-2xl overflow-hidden bg-[#fafbf8] border border-[#708ca4]/10 ${layout === 'vertical' ? 'flex-1 min-w-0' : 'w-full'}`}>
        <Swiper
          modules={[Navigation, Thumbs, Pagination]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={(sw) => setActiveIndex(sw.activeIndex)}
          className="h-[300px] md:h-[400px] w-full"
        >
          {imgs.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={getImageUrl(img) || FALLBACK_IMAGE}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Fullscreen button */}
        {onFullscreen && imgs[0] && (
          <button
            onClick={() => onFullscreen(activeIndex)}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/50 backdrop-blur-sm text-white rounded-xl flex items-center justify-center hover:bg-black/70 transition-all"
            title="View fullscreen"
          >
            <Expand className="w-4 h-4" />
          </button>
        )}

        {/* Counter badge */}
        {imgs.length > 1 && (
          <div className="absolute bottom-10 right-3 z-10 px-2.5 py-0.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded-full">
            {activeIndex + 1}/{imgs.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryCarousel;
