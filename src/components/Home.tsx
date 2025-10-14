"use client";
import { useRef } from "react";
import ImageTrailCursor from "@/components/ui/image-trail-cursor";
import { WavyBackground } from "@/components/ui/wavy-background";
import Showcase from "@/components/ui/showcase";
import FeaturedProducts from "@/components/FeaturedProducts";
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

  const heroRef = useRef<HTMLDivElement>(null);

  return (
    // NavbarDemo and Footer have been removed from here
    <div className="bg-black/50 relative z-0">
      <WavyBackground ref={heroRef} className="max-w-4xl mx-auto pb-40">
        <ImageTrailCursor
          images={images}
          maxPoints={5}
          containerRef={heroRef as React.RefObject<HTMLElement>}
        />
        <div className="relative z-10">
          <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
            Meemstonex
          </p>
          <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
            Leverage our expertise to build beautiful and functional websites.
          </p>
        </div>
      </WavyBackground>
      <Showcase />
      <section className="py-20 text-white">
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
      </section>
      <FeaturedProducts />
      <Faq />
      <WhatsAppButton />
    </div>
  );
}
