"use client";

import { useState } from "react";
import Image from "next/image";

// Swiper.js imports for the carousel functionality
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles for core, coverflow effect, pagination, and navigation
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Define the type for a single carousel item
export type CarouselItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

// Define the props for the CoverflowCarousel component
interface CoverflowCarouselProps {
  items: CarouselItem[];
}

export default function CoverflowCarousel({ items }: CoverflowCarouselProps) {
  return (
    <div className="w-full">
      {/* The perspective property is crucial for creating the 3D space */}
      <div style={{ perspective: 1200 }}>
        <Swiper
          // Main configuration for the Coverflow effect
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          // **KEY CHANGE**: Set slidesPerView to control how many slides are visible.
          // '5' will show one in the center and two on each side.
          slidesPerView={5}
          // Configuration specific to the Coverflow effect
          coverflowEffect={{
            rotate: 25, // Adjust rotation for a more subtle angle with more slides
            stretch: -20, // Negative stretch brings slides closer
            depth: 100, // Depth of the 3D effect
            modifier: 1, // Effect multiplier
            slideShadows: false, // Disable default slide shadows
          }}
          // Autoplay configuration
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            stopOnLastSlide: false,
          }}
          // Navigation buttons (arrows)
          navigation={true}
          // Pagination dots
          pagination={{
            clickable: true,
          }}
          // Required Swiper modules
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          // Apply padding to the Swiper container
          className="py-12"
        >
          {items.map((item) => (
            <SwiperSlide
              key={item.id}
              // The width is now determined by slidesPerView, so we don't need a specific class here.
            >
              {({ isActive }) => (
                <div
                  className="relative overflow-visible rounded-xl transition-all duration-500 ease-in-out"
                  style={{
                    // Swiper's coverflow effect handles transformations, but we can add opacity
                    opacity: isActive ? 1 : 0.5,
                    transform: isActive ? "scale(1.1)" : "scale(0.85)",
                  }}
                >
                  {/* Main image container */}
                  <div className="relative overflow-hidden rounded-xl shadow-2xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="block w-full aspect-square object-cover"
                    />
                  </div>

                  {/* Floor reflection effect */}
                  <div className="pointer-events-none" aria-hidden="true">
                    <Image
                      src={item.imageUrl}
                      alt="" // Alt text is empty for decorative images
                      width={500}
                      height={500}
                      className="block w-full aspect-square object-cover"
                      style={{
                        transform: "scaleY(-1)", // Flip the image vertically
                        WebkitMaskImage:
                          "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 70%)",
                        maskImage:
                          "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 70%)",
                        opacity: 0.2,
                        borderRadius: "0.75rem",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
