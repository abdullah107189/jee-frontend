"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Maximize2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

const FALLBACK_IMAGE = "/images/product-placeholder.png";

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const safeImages = images?.length ? images : [FALLBACK_IMAGE];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentImage = safeImages[currentIndex] ?? safeImages[0];
  const hasMultipleImages = safeImages.length > 1;

  const [thumbnailStart, setThumbnailStart] = useState(0);

  // Show a maximum of 6 thumbnails on desktop.
  const DESKTOP_VISIBLE_THUMBS = 6;

  const canScrollUp = thumbnailStart > 0;
  const canScrollDown =
    thumbnailStart + DESKTOP_VISIBLE_THUMBS < safeImages.length;

  const showPreviousThumbs = () => {
    setThumbnailStart((prev) => Math.max(0, prev - 1));
  };

  const showNextThumbs = () => {
    setThumbnailStart((prev) =>
      Math.min(
        Math.max(0, safeImages.length - DESKTOP_VISIBLE_THUMBS),
        prev + 1,
      ),
    );
  };

  const visibleDesktopImages = safeImages.slice(
    thumbnailStart,
    thumbnailStart + DESKTOP_VISIBLE_THUMBS,
  );

  const selectImage = (index: number) => {
    setCurrentIndex(index);

    // Keep selected image visible in desktop thumbnail list.
    if (index < thumbnailStart) {
      setThumbnailStart(index);
    } else if (index >= thumbnailStart + DESKTOP_VISIBLE_THUMBS) {
      setThumbnailStart(index - DESKTOP_VISIBLE_THUMBS + 1);
    }
  };

  return (
    <>
      <div className="w-full min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Desktop thumbnails */}
          {hasMultipleImages && (
            <div className="order-2 hidden w-16 shrink-0 sm:order-1 sm:block lg:w-[72px]">
              <div className="relative h-full min-h-0">
                {/* Top arrow */}
                {canScrollUp && (
                  <button
                    type="button"
                    onClick={showPreviousThumbs}
                    aria-label="Show previous thumbnails"
                    className="
                      absolute left-1/2 top-1 z-20
                      flex h-7 w-7 -translate-x-1/2 items-center justify-center
                      rounded-full border border-border
                      bg-white/95 shadow-sm backdrop-blur
                      transition hover:bg-white
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-primary/30
                    "
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                )}

                {/* Thumbnail viewport */}
                <div
                  className="
    flex h-full flex-col gap-2
    overflow-hidden
    overscroll-contain
  "
                  onWheel={(event) => {
                    if (safeImages.length <= DESKTOP_VISIBLE_THUMBS) return;

                    event.preventDefault();
                    event.stopPropagation();

                    if (event.deltaY > 0) {
                      showNextThumbs();
                    } else if (event.deltaY < 0) {
                      showPreviousThumbs();
                    }
                  }}
                >
                  {visibleDesktopImages.map((image, visibleIndex) => {
                    const index = thumbnailStart + visibleIndex;

                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => selectImage(index)}
                        aria-label={`View image ${index + 1}`}
                        aria-current={currentIndex === index}
                        className={cn(
                          "relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border bg-white transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                          currentIndex === index
                            ? "border-primary ring-1 ring-primary/20"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        <Image
                          src={image}
                          alt={`${productName} thumbnail ${index + 1}`}
                          fill
                          sizes="72px"
                          className="object-contain"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Bottom arrow */}
                {canScrollDown && (
                  <button
                    type="button"
                    onClick={showNextThumbs}
                    aria-label="Show more thumbnails"
                    className="
                      absolute bottom-1 left-1/2 z-20
                      flex h-7 w-7 -translate-x-1/2 items-center justify-center
                      rounded-full border border-border
                      bg-white/95 shadow-sm backdrop-blur
                      transition hover:bg-white
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-primary/30
                    "
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main image */}
          <div className="order-1 min-w-0 flex-1 sm:order-2">
            <div
              className="
                group relative aspect-square w-full
                overflow-hidden rounded-xl border bg-white
                sm:rounded-2xl
              "
            >
              <Image
                src={currentImage}
                alt={productName}
                fill
                priority
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 55vw, 600px"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Fullscreen */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                aria-label="View image fullscreen"
                className="
                  absolute right-3 top-3 z-10
                  flex h-9 w-9 items-center justify-center
                  rounded-full border border-black/5
                  bg-white/90 text-muted-foreground
                  opacity-0 shadow-sm backdrop-blur-sm
                  transition-all
                  hover:bg-white hover:text-foreground
                  focus-visible:opacity-100
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary/30
                  group-hover:opacity-100
                  sm:right-4 sm:top-4
                "
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile thumbnails */}
        {hasMultipleImages && (
          <div className="relative mt-3 sm:hidden">
            {/* Left arrow */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={() => selectImage(currentIndex - 1)}
                aria-label="Previous image"
                className="
                  absolute left-1 top-1/2 z-10
                  flex h-7 w-7 -translate-y-1/2 items-center justify-center
                  rounded-full border border-border
                  bg-white/95 shadow-sm backdrop-blur
                "
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div className="flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {safeImages.map((image, index) => (
                <button
                  key={`${image}-mobile-${index}`}
                  type="button"
                  onClick={() => selectImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={currentIndex === index}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition-all",
                    currentIndex === index
                      ? "border-primary ring-1 ring-primary/20"
                      : "border-border",
                  )}
                >
                  <Image
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Right arrow */}
            {currentIndex < safeImages.length - 1 && (
              <button
                type="button"
                onClick={() => selectImage(currentIndex + 1)}
                aria-label="Next image"
                className="
                  absolute right-1 top-1/2 z-10
                  flex h-7 w-7 -translate-y-1/2 items-center justify-center
                  rounded-full border border-border
                  bg-white/95 shadow-sm backdrop-blur
                "
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative h-full w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={currentImage}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain"
            />

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
              className="
                absolute right-2 top-2 z-10
                flex h-10 w-10 items-center justify-center
                rounded-full bg-white/95 shadow-sm
                transition hover:bg-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white/50
                sm:right-4 sm:top-4
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
