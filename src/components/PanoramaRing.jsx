import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Panorama3DRing = ({ items = [] }) => {
  const ringRef = useRef(null);
  const xPos = useRef(0);
  const ringItems = Array.isArray(items) ? items : [];

  const getBgPos = (i) => {
    const rotationY = gsap.getProperty(ringRef.current, "rotationY") || 0;
    return (
      100 - ((rotationY - 180 - i * (360 / ringItems.length)) % 360) / 360 * 500
    ) + "px 0px";
  };

  useEffect(() => {
    if (!ringItems.length) return;

    const ring = ringRef.current;
    const images = ring.querySelectorAll(".img");

    const itemWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : 450;
    const gap = typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 140;
    const chord = itemWidth + gap;
    const angle = (Math.PI * 2) / Math.max(ringItems.length, 1);
    const radius = Math.max(1200, Math.abs(chord / (2 * Math.sin(angle / 2))));

    gsap.set(ring, { rotationY: 180, cursor: "grab" });
    gsap.set(images, {
      rotateY: (i) => i * -(360 / ringItems.length),
      transformOrigin: `50% 50% ${radius}px`,
      z: -radius,
      backfaceVisibility: "hidden",
    });

    gsap.fromTo(
      images,
      { y: 200, opacity: 0 },
      {
        duration: 1.5,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "expo",
      }
    );

    // Hover glow + scale transition
    const hoverHandlers = [];
    images.forEach((img) => {
      const onMouseEnter = () => {
        gsap.to(images, {
          opacity: (i, t) => (t === img ? 1 : 0.5),
          ease: "power3",
          duration: 0.25,
        });
        gsap.to(img, {
          scale: 1.06,
          duration: 0.25,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(images, { opacity: 1, ease: "power2.inOut", duration: 0.25 });
        gsap.to(img, {
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      };

      img.addEventListener("mouseenter", onMouseEnter);
      img.addEventListener("mouseleave", onMouseLeave);
      hoverHandlers.push({ img, onMouseEnter, onMouseLeave });
    });

    // Drag control
    const dragStart = (e) => {
      if (e.touches) e.clientX = e.touches[0].clientX;
      xPos.current = Math.round(e.clientX);
      gsap.set(ring, { cursor: "grabbing" });
      window.addEventListener("mousemove", drag);
      window.addEventListener("touchmove", drag);
    };

    const drag = (e) => {
      if (e.touches) e.clientX = e.touches[0].clientX;
      gsap.to(ring, {
        rotationY: "-=" + ((Math.round(e.clientX) - xPos.current) % 360),
        onUpdate: () =>
          gsap.set(images, { backgroundPosition: (i) => getBgPos(i) }),
      });
      xPos.current = Math.round(e.clientX);
    };

    const dragEnd = () => {
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("touchmove", drag);
      gsap.set(ring, { cursor: "grab" });
    };

    window.addEventListener("mousedown", dragStart);
    window.addEventListener("touchstart", dragStart);
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("touchend", dragEnd);

    return () => {
      hoverHandlers.forEach(({ img, onMouseEnter, onMouseLeave }) => {
        img.removeEventListener("mouseenter", onMouseEnter);
        img.removeEventListener("mouseleave", onMouseLeave);
      });
      window.removeEventListener("mousedown", dragStart);
      window.removeEventListener("touchstart", dragStart);
      window.removeEventListener("mouseup", dragEnd);
      window.removeEventListener("touchend", dragEnd);
    };
  }, [ringItems.length]);

  return (
    <div className="w-full h-screen flex items-center justify-center  bg-black overflow-hidden">
      <div className="relative perspective-[2000px] w-[280px] md:w-[450px] lg:w-[450px] h-[380px] md:h-[550px] lg:h-[550px]">
        {/* The transparent ring container */}
        <div
          ref={ringRef}
          className="w-full h-full  relative preserve-3d pointer-events-none"
          style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
        >
          {ringItems.map((item) => (
            <div
              key={item.id}
              className="img absolute w-full h-full bg-center bg-cover rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
              style={{
                backgroundImage: `url(${item.imageUrl})`,
              }}
            >
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 text-center">
                <div className="text-white text-xl font-black uppercase tracking-widest special-font">
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>
        {!ringItems.length && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
            No featured products
          </div>
        )}
      </div>
    </div>
  );
};

export default Panorama3DRing;
