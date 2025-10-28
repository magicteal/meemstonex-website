"use client";
import React from "react";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false,
  loading: () => <div className="h-16" />,
});
const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50" />,
});
const About = dynamic(() => import("./About"), {
  ssr: false,
  loading: () => <div className="h-80" />,
});
const OurProcess = dynamic(() => import("./OurProcess"), {
  ssr: false,
  loading: () => <div className="h-96" />,
});
const CoverFlowCarousel = dynamic(() => import("./CoverFlowCarousel"), {
  ssr: false,
  loading: () => <div className="h-80" />,
});
const Features = dynamic(() => import("./Features"), {
  ssr: false,
  loading: () => <div className="h-96" />,
});
const Testimonials = dynamic(() => import("./Testimonials"), {
  ssr: false,
  loading: () => <div className="h-96" />,
});
const Stats = dynamic(() => import("./Stats"), {
  ssr: false,
  loading: () => <div className="h-48" />,
});
const Story = dynamic(() => import("./Story"), {
  ssr: false,
  loading: () => <div className="h-72" />,
});
const Contact = dynamic(() => import("./Contact"), {
  ssr: false,
  loading: () => <div className="h-48" />,
});
const Footer = dynamic(() => import("./Footer"), {
  ssr: false,
  loading: () => <div className="h-24" />,
});

export default function HomeClient() {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <OurProcess />
      <CoverFlowCarousel />
      <Features />
      {/* <Testimonials /> */}
      <Stats />
      <Story />
      <Contact />
      <Footer />
    </div>
  );
}
