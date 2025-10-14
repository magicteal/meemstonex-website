"use client";
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

  return (
    // NavbarDemo and Footer have been removed from here
    <div className=" relative z-0">
      <HeroMain
        images={images}
        subtitle="Where magic meets creativity to craft extraordinary digital experiences"
      />
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
      <PricingCards />
      <Faq />
      <WhatsAppButton />
    </div>
  );
}
