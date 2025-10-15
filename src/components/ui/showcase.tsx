import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const Showcase = () => {
  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-8 my-28">
        {/* Text Section */}
        <div className="text-left mb-12 flex flex-row">
          <h2 className={`${poppins.variable} text-5xl md:text-9xl font-bold`}>
            Showreel
          </h2>
          <p className={`${poppins.variable} font-bold text-neutral-400 mt-2`}>
            (2025)
          </p>
        </div>

        {/* Video Section */}
        <div className="relative">
          <video
            className="w-full rounded-none shadow-sm border border-neutral-800"
            src="/videos/dummyVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          >
            Your browser does not support the video tag.
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Showcase;
