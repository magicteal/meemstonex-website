"use client";

import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
  {
    name: "Aarav Mehta",
    designation: "Homeowner, Jaipur",
    quote:
      "The craftsmanship is stunning. Our marble mandir feels sacred and timeless—exactly what we hoped for.",
    src: "/img/gallery-1.webp",
  },
  {
    name: "Riya Sharma",
    designation: "Architect, Mumbai",
    quote:
      "Premium material with flawless finishing. The team was responsive and the process felt effortless.",
    src: "/img/gallery-2.webp",
  },
  {
    name: "Kabir Patel",
    designation: "Interior Designer, Delhi",
    quote:
      "From samples to installation, everything was smooth. The counter-top instantly elevated the space.",
    src: "/img/gallery-3.webp",
  },
  {
    name: "Neha Gupta",
    designation: "Villa Owner, Pune",
    quote:
      "Impeccable service and beautiful stone. Delivery and fitting were right on schedule.",
    src: "/img/gallery-4.webp",
  },
  {
    name: "Advait Rao",
    designation: "Builder, Ahmedabad",
    quote:
      "Dependable quality and elegant designs. Meemstonex is now our go-to for premium marble needs.",
    src: "/img/gallery-5.webp",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-widest text-white sm:text-3xl md:text-4xl">
            What they Say
          </h2>
        </div>
      </div>

      <AnimatedTestimonials testimonials={testimonials} autoplay />
    </section>
  );
}
