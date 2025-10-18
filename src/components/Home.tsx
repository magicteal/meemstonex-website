"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import HeroMain from "@/components/ui/hero-main";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Reveal } from "@/components/ui/reveal";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
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

      {/* Hero Section - Fade in with animated beams background */}
      <BackgroundBeamsWithCollision className="relative z-0 bg-[#0f0e0e]">
        <Reveal direction="fade">
          <HeroMain
            images={images}
            subtitle={<TextGenerateEffect words="Where magic meets creativity to craft extraordinary digital experiences" className="text-lg md:text-2xl text-white" duration={1.2} />}
          />
        </Reveal>
      </BackgroundBeamsWithCollision>

      {/* Company Section */}
      <Reveal direction="up">
        <CompanySection />
      </Reveal>

      {/* Showcase Section - Slide in from left */}
      <Reveal direction="left" className="relative z-0 bg-[#0f0e0e]">
        <Showcase />
      </Reveal>

      <Reveal direction="up">
        <ExoticGraniteCollection />
      </Reveal>

      {/* Text Reveal Section - Fade in up */}
      <Reveal direction="up" className="py-20 text-white bg-[#0f0e0e]">
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
      </Reveal>

      {/* Featured Products Section - Slide in from right */}
      <Reveal direction="right" className="bg-[#0f0e0e]">
        <FeaturedProducts />
      </Reveal>

      {/* Pricing Cards Section - Fade in up */}
      <Reveal direction="up" className="bg-[#0f0e0e]">
        <PricingCards />
      </Reveal>

      {/* Exotic Granite Collection Section */}
      <Reveal direction="up" className="py-20 bg-[#0f0e0e] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal direction="fade">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
                Exotic Granite Collection
              </h2>
            </Reveal>
            <div className="flex justify-center items-center gap-6 text-sm text-rose-400 mb-6">
              <button className="border-b border-rose-400 pb-1">
                Granite by Colour
              </button>
              <span className="h-4 border-l border-gray-500" aria-hidden />
              <button className="text-gray-300">Granite by Spaces</button>
            </div>

            <Reveal direction="fade">
              <p className="text-gray-300 max-w-2xl mx-auto mb-12">
                Bringing nature’s finest hues to your homes with our range of
                glorious, imported granite. These striking shades are surely going
                to leave you and your guests awestruck!
              </p>
            </Reveal>
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
              <Reveal direction="left">
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/five.jpg"
                    alt="White Granite"
                    width={400}
                    height={360}
                    className="w-full h-[360px] object-cover shadow-md"
                  />
                  <div className="mt-6 text-center text-lg text-gray-200">
                    White Granite
                  </div>
                </div>
              </Reveal>
              <Reveal direction="up">
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/four.jpeg"
                    alt="Yellow Granite"
                    width={400}
                    height={360}
                    className="w-full h-[360px] object-cover shadow-md"
                  />
                  <div className="mt-6 text-center text-lg text-gray-200">
                    Yellow Granite
                  </div>
                </div>
              </Reveal>
              <Reveal direction="right">
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/three.jpeg"
                    alt="Blue Granite"
                    width={400}
                    height={360}
                    className="w-full h-[360px] object-cover shadow-md"
                  />
                  <div className="mt-6 text-center text-lg text-gray-200">
                    Blue Granite
                  </div>
                </div>
              </Reveal>
              <Reveal direction="down">
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/two.png"
                    alt="Black Granite"
                    width={400}
                    height={360}
                    className="w-full h-[360px] object-cover shadow-md"
                  />
                  <div className="mt-6 text-center text-lg text-gray-200">
                    Black Granite
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal direction="fade" className="bg-[#0f0e0e]">
        <Testimonials />
        <Faq />
      </Reveal>

      <WhatsAppButton />
    </div>
  );
}
