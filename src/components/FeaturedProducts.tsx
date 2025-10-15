import React from "react";
import CarouselRectangle from "./ui/carousel-rectangle";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const FeaturedProducts = () => {
  const cards = [
    {
      title: "Elegant Marble Fountain",
      src: "/images/one.jpg",
    },
    {
      title: "Modern Illuminated Counter",
      src: "/images/one.jpg",
    },
    {
      title: "Classic Garden Fountain",
      src: "/images/three.jpeg",
    },
    {
      title: "Fountain at Dusk",
      src: "/images/four.jpeg",
    },
    {
      title: "Courtyard Water Feature",
      src: "/images/five.jpg",
    },
    {
      title: "Courtyard Water Feature",
      src: "/images/five.jpg",
    },
  ];

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
          <CarouselRectangle cards={cards.slice(0, 5)} />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
