"use client";
import React from "react";
import dynamic from "next/dynamic";

import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Footer from "./Footer";

const OurProcess = dynamic(() => import("./OurProcess"), {
  loading: () => <div className="h-96" />,
});
const CoverFlowCarousel = dynamic(() => import("./CoverFlowCarousel"), {
  loading: () => <div className="h-80" />,
});
const Features = dynamic(() => import("./Features"), {
  loading: () => <div className="h-96" />,
});

const Stats = dynamic(() => import("./Stats"), {
  loading: () => <div className="h-48" />,
});
const Story = dynamic(() => import("./Story"), {
  loading: () => <div className="h-72" />,
});
const Team = dynamic(() => import("./Team"), {
  loading: () => <div className="h-48" />,
});
const Contact = dynamic(() => import("./Contact"), {
  loading: () => <div className="h-48" />,
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

      <Stats />
      <Story />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}

