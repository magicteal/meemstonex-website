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
        description: `₹${Number(p.price ?? 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} • ${(p.categories || []).join(", ") || "General"}`,
        src: (Array.isArray(p.photos) && p.photos.length) ? p.photos[0] : (p.photo || ""),
        photos: (Array.isArray(p.photos) && p.photos.length) ? p.photos : (p.photo ? [p.photo] : []),
        ctaText: "View",
        ctaLink: "#",
        content: () => (
          <div>
            <p className="text-sm md:text-base">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1 text-xs">
              {(p.categories || []).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700"
                >
                  {c}
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
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
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
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${keyOf(active)}-${id}`}
              ref={ref}
              className="w-[92vw] max-w-md h-[95vh] md:h-[95vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div className="relative">
                <motion.div layoutId={`image-${keyOf(active)}-${id}`} className="relative">
                  <Image
                    width={800}
                    height={1200}
                    src={active.photos && active.photos.length > 0 && active.photos[currentPhotoIndex] ? active.photos[currentPhotoIndex] : active.src}
                    alt={active.title}
                    className="w-full h-[70vh] sm:h-[70vh] md:h-[75vh] sm:rounded-tr-lg sm:rounded-tl-lg object-contain bg-neutral-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
                  />
                  {active.photos && active.photos.length > 1 && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : active.photos.length - 1);
                          }}
                          className="bg-black/50 hover:bg-black/70 text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm z-20 transition-colors"
                          aria-label="Previous photo"
                          type="button"
                        >
                          ‹
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPhotoIndex(prev => prev < active.photos.length - 1 ? prev + 1 : 0);
                          }}
                          className="bg-black/50 hover:bg-black/70 text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm z-20 transition-colors"
                          aria-label="Next photo"
                          type="button"
                        >
                          ›
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                        {active.photos.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentPhotoIndex(idx);
                            }}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            aria-label={`Go to photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex flex-col gap-3 p-4 flex-shrink-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <motion.h3
                        layoutId={`title-${keyOf(active)}-${id}`}
                        className="font-bold text-neutral-700 dark:text-neutral-200 text-xl"
                      >
                        {active.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${active.description}-${id}`}
                        className="text-neutral-600 dark:text-neutral-400 mt-1"
                      >
                        {active.description}
                      </motion.p>
                    </div>
                  </div>

                  <motion.a
                    layoutId={`button-${keyOf(active)}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="w-full text-center px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="px-4 pb-4 flex-1 overflow-y-auto">
                  <div className="text-neutral-700 dark:text-neutral-300 text-base leading-relaxed">
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </div>
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
            className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <motion.div
              layoutId={`image-${keyOf(card)}-${id}`}
              className="relative w-full h-48 overflow-hidden"
            >
              <Image
                width={400}
                height={300}
                src={card.src}
                alt={card.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </motion.div>
            <div className="p-4">
              <motion.h3
                layoutId={`title-${keyOf(card)}-${id}`}
                className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg mb-2 line-clamp-1"
              >
                {card.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${card.description}-${id}`}
                className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2"
              >
                {card.description}
              </motion.p>
              <motion.button
                layoutId={`button-${keyOf(card)}-${id}`}
                className="w-full px-4 py-2 text-sm rounded-lg font-semibold bg-gray-100 hover:bg-green-500 hover:text-white text-black transition-colors"
              >
                {card.ctaText}
              </motion.button>
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
