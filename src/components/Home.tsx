"use client";
import { motion } from "framer-motion";
import HeroMain from "@/components/ui/hero-main";
import Showcase from "@/components/ui/showcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import PricingCards from "@/components/ui/pricing-cards";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import TextReveal from "@/components/ui/text-reveal";
import Faq from "@/components/ui/faq";

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

      {/* Showcase Section - Slide in from left */}
      <motion.section
        className="relative z-0 bg-gradient-to-r from-[#03121a] via-[#071428] to-[#0b0730]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInLeft}
      >
        <Showcase />
      </motion.section>

      {/* Text Reveal Section - Fade in up */}
      <motion.section
        className="py-20 text-white bg-gradient-to-t from-[#021318] via-[#041226] to-transparent"
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
        className="bg-gradient-to-b from-[#04131a] via-[#071428] to-[#03020a]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInRight}
      >
        <FeaturedProducts />
      </motion.section>

      {/* Pricing Cards Section - Fade in up */}
      <motion.section
        className="bg-gradient-to-r from-[#06121a] via-[#3a0b33] to-[#4f2870]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <PricingCards />
      </motion.section>

      {/* FAQ Section - Fade in */}
      <motion.section
        className="bg-gradient-to-b from-[#021014] via-[#03101a] to-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <Faq />
      </motion.section>

      <WhatsAppButton />
    </div>
  );
}
