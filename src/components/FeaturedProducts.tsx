import React from "react";
import { FocusCards } from "./ui/focus-cards";
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
    <section className="py-20 text-white">
      <div className="container mx-auto px-8 my-24">
        <div className="text-left mb-12 flex flex-row">
          <h2 className={`${poppins.className} text-7xl md:text-8xl font-bold`}>
            Featured Products
          </h2>
          <p className="text-neutral-400 mt-2">(New Collection)</p>
        </div>
        <FocusCards cards={cards} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
