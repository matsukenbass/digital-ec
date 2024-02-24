'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import type SwiperType from 'swiper';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Pagination } from 'swiper/modules';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  urls: string[];
}

const ImageSlider = ({ urls }: ImageSliderProps) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slideConfig = useMemo(
    () => ({
      isBeginning: activeIndex === 0,
      isEnd: activeIndex === (urls.length ?? 0) - 1,
    }),
    [activeIndex, urls.length]
  );
  useEffect(() => {
    const changeHandler = (swiper: SwiperType) => {
      setActiveIndex(swiper.activeIndex);
    };

    swiper?.on('slideChange', changeHandler);
    return () => {
      swiper?.off('slideChange', changeHandler);
    };
  }, [swiper]);

  const nextImage = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      swiper?.slideNext();
    },
    [swiper]
  );

  const prevImage = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      swiper?.slidePrev();
    },
    [swiper]
  );

  const activeStyles =
    'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300';
  const inactiveStyles = 'hidden text-gray-400';

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
      <div className="absolute inset-0 z-10 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={nextImage}
          className={cn(activeStyles, 'right-3 transition', {
            [inactiveStyles]: slideConfig.isEnd,
            'hover:bg-primary-300 text-primary-800 opacity-100': !slideConfig.isEnd,
          })}
          aria-label="next image"
        >
          <ChevronRight className="h-4 w-4 text-zinc-700" />{' '}
        </button>
        <button
          onClick={prevImage}
          className={cn(activeStyles, 'left-3 transition', {
            [inactiveStyles]: slideConfig.isBeginning,
            'hover:bg-primary-300 text-primary-800 opacity-100': !slideConfig.isBeginning,
          })}
          aria-label="previous image"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />{' '}
        </button>
      </div>

      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        onSwiper={setSwiper}
        spaceBetween={50}
        modules={[Pagination]}
        slidesPerView={1}
        className="h-full w-full"
      >
        {urls.map((url, i) => (
          <SwiperSlide key={i} className="relative -z-10 h-full w-full">
            <Image
              fill
              sizes="100vw"
              loading="eager"
              className="-z-10 h-full w-full object-cover object-center"
              src={url}
              alt="Product image"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
