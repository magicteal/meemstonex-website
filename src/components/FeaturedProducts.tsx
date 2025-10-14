import React from "react";
import { FocusCards } from "./ui/focus-cards";

const FeaturedProducts = () => {
  const cards = [
    {
      title: "Elegant Marble Fountain",
      src: "/images/two.png",
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
  ];

  return (
    <section className="py-20 text-white">
      <div className="container mx-auto px-8">
        <div className="text-left mb-12">
          <h2 className="text-5xl md:text-7xl font-bold">Featured Products</h2>
          <p className="text-neutral-400 mt-2">(New Collection)</p>
        </div>
        <FocusCards cards={cards} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
