import React from "react";
import CoverflowCarousel, {
  CarouselItem,
} from "@/components/CoverflowCarousel";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const FeaturedProducts = () => {
  // Show all available product images in /public/images (exclude background textures)
  const imageFiles = [
    "one.jpg",
    "two.png",
    "three.jpeg",
    "four.jpeg",
    "five.jpg",
  ];

  const cards: CarouselItem[] = imageFiles.map((file, idx) => ({
    id: idx + 1,
    title: file
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: "",
    imageUrl: `/images/${file}`,
  }));

  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-8 my-28">
        <div className="text-left mb-12 flex flex-row items-end gap-6">
          <h2
            className={`${poppins.className} text-7xl md:text-8xl font-bold drop-shadow-lg`}
          >
            Featured Products
          </h2>
          <p className={`${poppins.className} text-neutral-400 mt-2 font-bold`}>
            (New Collection)
          </p>
        </div>
        <div className="relative">
          <div
            className="absolute -inset-8 -z-10 rounded-lg"
            style={{ boxShadow: "0 30px 80px rgba(6,182,160,0.04)" }}
          />
          <CoverflowCarousel items={cards} />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
