"use client";

import React from "react";


import Panorama3DSlider from "./PanoramaRing";

// Local demo items (replace with props/data source if desired)
const demoItems = [
  { id: 1, title: "Nature's Gift", imageUrl: "/products/P1.jpg" },
  { id: 2, title: "Pro Crunch", imageUrl: "/products/P2.jpg" },
  { id: 3, title: "Milkshake Hairspa", imageUrl: "/products/P3.jpg" },
  { id: 4, title: "Skin Wellness", imageUrl: "/products/P4.jpg" },
  { id: 5, title: "Collectivo Lux", imageUrl: "/products/P5.jpg" },
];



// Section wrapper placed after Our Process with proper padding to match theme
export default function CoverFlowCarousel({ items = demoItems }) {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className=" text-center">
          <h2 className="text-2xl font-semibold tracking-widest text-white sm:text-3xl md:text-4xl">
            Our Products
          </h2>
        </div>
 
        <Panorama3DSlider />
      </div>
    </section>
  );
}
