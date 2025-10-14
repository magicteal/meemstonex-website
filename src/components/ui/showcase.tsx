import React from "react";

const Showcase = () => {
  return (
    <section className="py-20 text-white">
      <div className="container mx-auto px-8">
        {/* Text Section */}
        <div className="text-left mb-12">
          <h2 className="text-5xl md:text-7xl font-bold">Showreel</h2>
          <p className="text-neutral-400 mt-2">(2025)</p>
        </div>

        {/* Video Section */}
        <div>
          <video
            className="w-full rounded-xl shadow-2xl"
            src="/videos/dummyVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
