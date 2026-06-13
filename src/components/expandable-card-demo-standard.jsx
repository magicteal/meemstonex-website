"use client";

import React, { useEffect, useId, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";

/**
 * ExpandableCardDemo
 * - Now accepts `items` from the admin/mock API so UI is in sync with editor
 * - Widens modal and list to use more viewport width (no more narrow max-w)
 */
export default function ExpandableCardDemo({ items = [] }) {
  const [active, setActive] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
      setCurrentPhotoIndex(0); // reset carousel when opening
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Map incoming admin products to local card shape; fallback to demo cards
  const cardsData = useMemo(() => {
    if (Array.isArray(items) && items.length) {
      return items.map((p, idx) => ({
        
        // ensure uid is unique even if incoming ids collide by appending the index
        uid: p.id != null ? `${p.id}-${idx}` : `item-${idx}`,
        title: p.name,
        description: (p.categories || []).join(", ") || "General",
        customOptionText:
          typeof p.customization === "string" && p.customization.trim()
            ? p.customization.trim().toUpperCase() === "AVAILABLE"
              ? "Available"
              : "Not Available"
            : "Not Available",
        sizeText:
          (p.size_feet || "").trim() || (p.size_inches || "").trim()
            ? `${(p.size_feet || "").trim() || "N/A"}${
                (p.size_inches || "").trim()
                  ? ` / ${(p.size_inches || "").trim()}`
                  : ""
              }`
            : "N/A",
        src: (
          Array.isArray(p.photos)
            ? p.photos.find((photo) => typeof photo === "string" && photo.trim())
            : typeof p.photo === "string" && p.photo.trim()
            ? p.photo.trim()
            : null
        ) || null,
        photos: Array.isArray(p.photos)
          ? p.photos
              .filter((photo) => typeof photo === "string" && photo.trim())
              .map((photo) => photo.trim())
          : typeof p.photo === "string" && p.photo.trim()
          ? [p.photo.trim()]
          : [],
        ctaText: "View",
        ctaLink: "#",
        content: () => (
          <div className="space-y-3 sm:space-y-8">
            <p className="text-white/80 text-sm sm:text-lg leading-snug sm:leading-relaxed font-robert-regular">
              {p.description}
            </p>

            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-12 gap-y-3 sm:gap-y-6">
              {[
                { label: "Dimensions", value: `${(p.size_feet || "N/A")} / ${(p.size_inches || "N/A")}` },
                { label: "Material", value: p.material || "100% Natural Marble" },
                { label: "Customization", value: p.customization || "Available" },
                { label: "Services", value: p.service || "End to End Facility" }
              ].map((spec, i) => (
                <div key={i} className="group/spec flex flex-col gap-1 border-b border-white/5 pb-2 sm:pb-4 transition-colors hover:border-blue-500/30">
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 opacity-70">
                    {spec.label}
                  </span>
                  <span className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-wide font-general">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1 sm:pt-4">
              {(p.categories || []).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/5 border border-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 backdrop-blur-sm transition-all hover:bg-blue-600/20 hover:text-white hover:border-blue-500/50"
                >
                  # {c}
                </span>
              ))}
            </div>
          </div>
        ),
      }));
    }
    return cards; // fallback demo content when no items are provided
  }, [items]);

  const keyOf = (obj) => (obj && (obj.uid || obj.title)) ?? "item";

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-0 sm:p-2">
            <motion.div
              layoutId={`card-${keyOf(active)}-${id}`}
              ref={ref}
              className="w-full h-[100dvh] sm:h-auto sm:max-h-[96vh] max-w-4xl flex flex-col md:flex-row bg-black/80 backdrop-blur-3xl rounded-none sm:rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
            >
              {/* Image Section (Left on md+) */}
              <div className="relative w-full md:w-1/2 aspect-square sm:h-64 md:h-auto md:aspect-auto overflow-hidden bg-neutral-900 shrink-0">
                <motion.div layoutId={`image-${keyOf(active)}-${id}`} className="h-full w-full">
                  <Image
                    width={1000}
                    height={1000}
                    src={active.photos && active.photos.length > 0 && active.photos[currentPhotoIndex] ? active.photos[currentPhotoIndex] : active.src}
                    alt={active.title}
                    className="w-full h-full object-cover transition-transform duration-1000"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Image Navigation */}
                  {active.photos && active.photos.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : active.photos.length - 1);
                        }}
                        className="bg-black/40 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md transition-all"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPhotoIndex(prev => prev < active.photos.length - 1 ? prev + 1 : 0);
                        }}
                        className="bg-black/40 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md transition-all"
                      >
                        ›
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {(active.photos || []).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === currentPhotoIndex ? 'bg-blue-500 w-6' : 'bg-white/20 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
                
                {/* Close Button - Floats over image on mobile, stays consistent on md */}
                <motion.button
                  key={`button-${active.title}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center justify-center bg-black/40 hover:bg-red-500/80 backdrop-blur-xl text-white rounded-full h-9 w-9 sm:h-10 sm:w-10 transition-colors shadow-lg border border-white/10"
                  onClick={() => setActive(null)}
                >
                  <CloseIcon />
                </motion.button>
              </div>

              {/* Content Section (Right on md+) */}
              <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-3 sm:gap-6 p-4 sm:p-8 md:p-12">
                  <div className="space-y-2 sm:space-y-4">
                    <motion.h3
                      layoutId={`title-${keyOf(active)}-${id}`}
                      className="font-black text-white text-2xl sm:text-4xl md:text-6xl uppercase tracking-tighter special-font leading-tight"
                    >
                      {active.title}
                    </motion.h3>
                    <div className="flex flex-wrap gap-2">
                       {(active.description || "").split(",").map((tag) => (
                         <span key={tag} className="text-[10px] uppercase tracking-widest font-black text-blue-400 border border-blue-400/30 px-3 py-1 rounded-full bg-blue-400/5">
                           {tag.trim()}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="sm:px-8 pb-2 sm:pb-12">
                    <div className="text-white/70 text-base leading-relaxed font-robert-regular border-t border-white/10 pt-3 sm:pt-8">
                      {typeof active.content === "function"
                        ? active.content()
                        : active.content}
                    </div>
                  </div>

                  <motion.a
                    layoutId={`button-${keyOf(active)}-${id}`}
                    href={`https://wa.me/918302997877?text=Whatsapp%20enquiry%20me.%20I%20am%20interested%20in%20${encodeURIComponent(active.title || "")}`}
                    target="_blank"
                    className="group/btn w-full flex items-center justify-center gap-3 px-8 py-3 sm:py-5 text-[10px] tracking-[0.3em] uppercase rounded-full font-black bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.3)] mt-1 sm:mt-4"
                  >
                    <span>Whatsapp enquiry me</span>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover/btn:translate-x-1">
                        <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      {/* Grid Layout */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cardsData.map((card, index) => (
          <motion.div
            layoutId={`card-${keyOf(card)}-${id}`}
            key={
              card?.uid
                ? `card-${card.uid}`
                : `card-${keyOf(card)}-${index}-${id}`
            }
            onClick={() => setActive(card)}
            className="group relative cursor-pointer h-[480px] w-full overflow-hidden rounded-3xl bg-neutral-950 shadow-2xl transition-all duration-500 border border-white/5 hover:border-white/20 flex flex-col"
          >
            {/* Full Image */}
            <motion.div
              layoutId={`image-${keyOf(card)}-${id}`}
              className="absolute inset-0 w-full h-full"
            >
              {card.src ? (
                <Image
                  fill
                  src={card.src}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900" aria-hidden="true" />
              )}
            </motion.div>

            {/* Black Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col">
              <motion.h3
                layoutId={`title-${keyOf(card)}-${id}`}
                className="font-black text-white text-2xl mb-2 line-clamp-2 special-font uppercase tracking-tighter"
              >
                {card.title}
              </motion.h3>
              
              <div className="space-y-3">
                 <motion.p
                   layoutId={`description-${keyOf(card)}-${id}`}
                   className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-general line-clamp-2"
                 >
                   {card.description}
                 </motion.p>
                 
                 {card.sizeText && (
                   <p className="text-white/80 text-xs font-robert-regular border-l-2 border-blue-500/80 pl-3">
                     <span className="opacity-50">Size:</span> {card.sizeText}
                   </p>
                 )}

                 <motion.button
                   layoutId={`button-${keyOf(card)}-${id}`}
                   className="w-full mt-4 py-4 text-[10px] rounded-full font-black uppercase tracking-[0.3em] bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-500"
                 >
                   {card.ctaText}
                 </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Lana Del Rey",
    title: "Summertime Sadness",
    src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Lana Del Rey, an iconic American singer-songwriter, is celebrated for
          her melancholic and cinematic music style. Born Elizabeth Woolridge
          Grant in New York City, she has captivated audiences worldwide with
          her haunting voice and introspective lyrics. <br /> <br />
          Her songs often explore themes of tragic romance, glamour, and
          melancholia, drawing inspiration from both contemporary and vintage
          pop culture. With a career that has seen numerous critically acclaimed
          albums, Lana Del Rey has established herself as a unique and
          influential figure in the music industry, earning a dedicated fan base
          and numerous accolades.
        </p>
      );
    },
  },
  {
    description: "Babbu Maan",
    title: "Mitran Di Chhatri",
    src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Babu Maan, a legendary Punjabi singer, is renowned for his soulful
          voice and profound lyrics that resonate deeply with his audience. Born
          in the village of Khant Maanpur in Punjab, India, he has become a
          cultural icon in the Punjabi music industry. <br /> <br />
          His songs often reflect the struggles and triumphs of everyday life,
          capturing the essence of Punjabi culture and traditions. With a career
          spanning over two decades, Babu Maan has released numerous hit albums
          and singles that have garnered him a massive fan following both in
          India and abroad.
        </p>
      );
    },
  },

  {
    description: "Metallica",
    title: "For Whom The Bell Tolls",
    src: "https://assets.aceternity.com/demos/metallica.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Metallica, an iconic American heavy metal band, is renowned for their
          powerful sound and intense performances that resonate deeply with
          their audience. Formed in Los Angeles, California, they have become a
          cultural icon in the heavy metal music industry. <br /> <br />
          Their songs often reflect themes of aggression, social issues, and
          personal struggles, capturing the essence of the heavy metal genre.
          With a career spanning over four decades, Metallica has released
          numerous hit albums and singles that have garnered them a massive fan
          following both in the United States and abroad.
        </p>
      );
    },
  },
  {
    description: "Led Zeppelin",
    title: "Stairway To Heaven",
    src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Led Zeppelin, a legendary British rock band, is renowned for their
          innovative sound and profound impact on the music industry. Formed in
          London in 1968, they have become a cultural icon in the rock music
          world. <br /> <br />
          Their songs often reflect a blend of blues, hard rock, and folk music,
          capturing the essence of the 1970s rock era. With a career spanning
          over a decade, Led Zeppelin has released numerous hit albums and
          singles that have garnered them a massive fan following both in the
          United Kingdom and abroad.
        </p>
      );
    },
  },
  {
    description: "Mustafa Zahid",
    title: "Toh Phir Aao",
    src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          "Aawarapan", a Bollywood movie starring Emraan Hashmi, is renowned for
          its intense storyline and powerful performances. Directed by Mohit
          Suri, the film has become a significant work in the Indian film
          industry. <br /> <br />
          The movie explores themes of love, redemption, and sacrifice,
          capturing the essence of human emotions and relationships. With a
          gripping narrative and memorable music, "Aawarapan" has garnered a
          massive fan following both in India and abroad, solidifying Emraan
          Hashmi's status as a versatile actor.
        </p>
      );
    },
  },
];
