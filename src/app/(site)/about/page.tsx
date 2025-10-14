import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/section-header";

const AboutPage = () => {
  return (
    <div className="text-white">
      <SectionHeader
        title="Our"
        highlight="Story"
        subtitle="Crafting legacies in stone since our inception."
      />

      <div className="container mx-auto px-8 py-16">
        {/* Section 1: Vision */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter">
              A Vision Carved in Stone
            </h2>
            <p className="text-neutral-300 leading-relaxed">
              Founded with the vision to create products that inspire,
              Meemstonex is dedicated to the art of stonework. We are driven by
              a passion for perfection and an unwavering commitment to
              delivering exceptional quality. Our creations are not just
              objects, but experiences that elevate everyday life.
            </p>
          </div>
          <div className="h-96 relative rounded-lg overflow-hidden">
            <Image
              src="/images/one.jpg"
              alt="Illuminated Counter"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Section 2: Craftsmanship */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="h-96 relative rounded-lg overflow-hidden md:order-last">
            <Image
              src="/images/two.png"
              alt="Marble Fountain"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter">
              Unmatched Craftsmanship
            </h2>
            <p className="text-neutral-300 leading-relaxed">
              Our master artisans combine timeless techniques with modern
              innovation to shape raw stone into breathtaking forms. Every
              curve, every polish, and every detail is a testament to our
              dedication to the craft. We source the finest materials from
              around the globe to ensure each piece is a masterpiece of
              durability and beauty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
