import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const demoItems = [
  { id: 1, title: "Nature's Gift", imageUrl: "/products/P1.jpg" },
  { id: 2, title: "Pro Crunch", imageUrl: "/products/P2.jpg" },
  { id: 3, title: "Milkshake Hairspa", imageUrl: "/products/P3.jpg" },
  { id: 4, title: "Skin Wellness", imageUrl: "/products/P4.jpg" },
  { id: 5, title: "Collectivo Lux", imageUrl: "/products/P5.jpg" },
  { id: 6, title: "Nature's Gift", imageUrl: "/products/P1.jpg" },
  { id: 7, title: "Pro Crunch", imageUrl: "/products/P2.jpg" },
  { id: 8, title: "Milkshake Hairspa", imageUrl: "/products/P3.jpg" },
  { id: 9, title: "Skin Wellness", imageUrl: "/products/P4.jpg" },
  { id: 10, title: "Collectivo Lux", imageUrl: "/products/P5.jpg" },
];

const Panorama3DRing = () => {
  const ringRef = useRef(null);
  const xPos = useRef(0);

  const getBgPos = (i) => {
    const rotationY = gsap.getProperty(ringRef.current, "rotationY") || 0;
    return (
      100 - ((rotationY - 180 - i * (360 / demoItems.length)) % 360) / 360 * 500
    ) + "px 0px";
  };

  useEffect(() => {
    const ring = ringRef.current;
    const images = ring.querySelectorAll(".img");

    gsap.set(ring, { rotationY: 180, cursor: "grab" });
    gsap.set(images, {
      rotateY: (i) => i * -(360 / demoItems.length),
      transformOrigin: "50% 50% 500px",
      z: -500,
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

    // Hover glow
    images.forEach((img) => {
      img.addEventListener("mouseenter", () => {
        gsap.to(images, {
          opacity: (i, t) => (t === img ? 1 : 0.5),
          ease: "power3",
        });
      });
      img.addEventListener("mouseleave", () => {
        gsap.to(images, { opacity: 1, ease: "power2.inOut" });
      });
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
      window.removeEventListener("mousedown", dragStart);
      window.removeEventListener("touchstart", dragStart);
      window.removeEventListener("mouseup", dragEnd);
      window.removeEventListener("touchend", dragEnd);
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="relative perspective-[2000px] w-[300px] h-[400px]">
        {/* The transparent ring container */}
        <div
          ref={ringRef}
          className="w-full h-full relative preserve-3d pointer-events-none"
          style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
        >
          {demoItems.map((item) => (
            <div
              key={item.id}
              className="img absolute w-full h-full bg-center bg-cover rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
              style={{
                backgroundImage: `url(${item.imageUrl})`,
              }}
            >
              <div className="absolute bottom-0 w-full text-center text-white text-lg font-semibold bg-black/60 py-2 backdrop-blur-sm">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panorama3DRing;
