"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { HeroSlide } from "@/lib/types/hero.types";

interface HeroSliderProps {
  slides: HeroSlide[];
}

const AUTOPLAY_DELAY_MS = 5500;

export function HeroSlider({ slides }: HeroSliderProps) {
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // keyboard support: left/right arrows move the slider when it's focused
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") scrollPrev();
      if (event.key === "ArrowRight") scrollNext();
    },
    [scrollPrev, scrollNext],
  );

  return (
    <div
      className="group relative w-full h-full overflow-hidden rounded-xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured deals"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="overflow-hidden h-full " ref={emblaRef}>
        <div className="flex touch-pan-y h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative min-w-0 flex-[0_0_100%] "
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={selectedIndex === index ? undefined : true}
            >
              <div className="relative h-full">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 1200px, 100vw"
                  className="object-cover h-full"
                />
                {/* <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r",
                    slide.theme === "indigo"
                      ? "from-[#0A0D14]/95 via-[#0A0D14]/50 to-transparent sm:from-[#0A0D14]/90 sm:via-[#0A0D14]/40"
                      : "from-[#1A0E0A]/95 via-[#1A0E0A]/45 to-transparent sm:from-[#1A0E0A]/90 sm:via-[#1A0E0A]/35"
                  )}
                /> */}
              </div>

              {/* <div className="absolute inset-0 flex items-end sm:items-center">
                <div className="max-w-md px-5 pb-14 sm:px-10 sm:pb-0">
                  <h2 className="font-display text-2xl font-medium leading-tight text-white sm:text-4xl">
                    {slide.title}
                  </h2>
                  <p className="mt-2.5 max-w-sm text-sm text-white sm:mt-3 sm:text-base">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.ctaHref}
                    className={cn(
                      "mt-5 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03] sm:mt-6",
                      slide.theme === "indigo"
                        ? "bg-accent-signal"
                        : "bg-accent-deal"
                    )}
                  >
                    {slide.ctaLabel}
                  </Link>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* arrows: pointer devices only, hidden on touch/mobile where swipe is primary */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-background bg-background cursor-pointer p-2 text-text-primary opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border-background bg-background cursor-pointer p-2 text-text-primary opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* dots: primary nav on mobile, secondary confirmation on desktop */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={selectedIndex === index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              selectedIndex === index
                ? "w-6 bg-accent-signal"
                : "w-1.5 bg-white/30",
            )}
          />
        ))}
      </div>
    </div>
  );
}
