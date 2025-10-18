"use client";
import { motion } from "framer-motion";
import HeroMain from "@/components/ui/hero-main";
import CompanySection from "@/components/CompanySection";
import Showcase from "@/components/ui/showcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import PricingCards from "@/components/ui/pricing-cards";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import TextReveal from "@/components/ui/text-reveal";
import Faq from "@/components/ui/faq";
import ExoticGraniteCollection from "@/components/ExoticGraniteCollection";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  const images = [
    "/images/one.jpg",
    "/images/two.png",
    "/images/three.jpeg",
    "/images/four.jpeg",
    "/images/five.jpg",
  ];

  // Animation variants for scroll reveal
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1 },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    // NavbarDemo and Footer have been removed from here
    <div className="relative z-0">
      {/* Page backdrop gradients for premium feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(800px 400px at 10% 10%, rgba(6,182,160,0.06), transparent 20%), radial-gradient(900px 500px at 90% 90%, rgba(128,65,255,0.06), transparent 25%)",
          filter: "blur(80px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,12,16,0.3), rgba(0,0,0,0.6))",
        }}
      />

      {/* Hero Section - Fade in */}
      <motion.section
        className="relative z-0 bg-[#0f0e0e]"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <HeroMain
          images={images}
          subtitle="Where magic meets creativity to craft extraordinary digital experiences"
        />
      </motion.section>

      {/* Company Section */}
      <CompanySection />

      {/* Showcase Section - Slide in from left */}
      <motion.section
        className="relative z-0 bg-[#0f0e0e]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInLeft}
      >
        <Showcase />
      </motion.section>

      <ExoticGraniteCollection />

      {/* Text Reveal Section - Fade in up */}
      <motion.section
        className="py-20 text-white bg-[#0f0e0e]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-8">
          <TextReveal>
            Specialized in translating brands into unique and immersive digital
            user experiences. We focus on web design, product interfaces, and
            visual systems. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.
          </TextReveal>
        </div>
      </motion.section>

      {/* Featured Products Section - Slide in from right */}
      <motion.section
        className="bg-[#0f0e0e]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInRight}
      >
        <FeaturedProducts />
      </motion.section>

      {/* Pricing Cards Section - Fade in up */}
      <motion.section
        className="bg-[#0f0e0e]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <PricingCards />
      </motion.section>

      {/* Exotic Granite Collection Section */}
      <motion.section
        className="py-20 bg-[#0f0e0e] text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
              Exotic Granite Collection
            </h2>
            <div className="flex justify-center items-center gap-6 text-sm text-rose-400 mb-6">
              <button className="border-b border-rose-400 pb-1">
                Granite by Colour
              </button>
              <span className="h-4 border-l border-gray-500" aria-hidden />
              <button className="text-gray-300">Granite by Spaces</button>
            </div>

            <p className="text-gray-300 max-w-2xl mx-auto mb-12">
              Bringing nature’s finest hues to your homes with our range of
              glorious, imported granite. These striking shades are surely going
              to leave you and your guests awestruck!
            </p>
          </div>

          <div className="relative">
            {/* Left arrow control similar to the design */}
            <button
              aria-label="previous"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 text-black rounded-full w-10 h-10 items-center justify-center shadow-md z-10"
            >
              ←
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              <div className="flex flex-col items-center">
                <img
                  src="/images/five.jpg"
                  alt="White Granite"
                  className="w-full h-[360px] object-cover shadow-md"
                />
                <div className="mt-6 text-center text-lg text-gray-200">
                  White Granite
                </div>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src="/images/four.jpeg"
                  alt="Yellow Granite"
                  className="w-full h-[360px] object-cover shadow-md"
                />
                <div className="mt-6 text-center text-lg text-gray-200">
                  Yellow Granite
                </div>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src="/images/three.jpeg"
                  alt="Blue Granite"
                  className="w-full h-[360px] object-cover shadow-md"
                />
                <div className="mt-6 text-center text-lg text-gray-200">
                  Blue Granite
                </div>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src="/images/two.png"
                  alt="Black Granite"
                  className="w-full h-[360px] object-cover shadow-md"
                />
                <div className="mt-6 text-center text-lg text-gray-200">
                  Black Granite
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="bg-[#0f0e0e]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <Testimonials />
        <Faq />
      </motion.section>

      <WhatsAppButton />
    </div>
  );
}
