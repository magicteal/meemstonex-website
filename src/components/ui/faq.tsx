"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const faqData = [
  {
    question: "What services do you offer?",
    answer:
      "I focus on digital design and brand identity — including websites, apps, and visual systems. I also offer design direction and consulting when needed.",
  },
  {
    question: "Do you work with startups or only big brands?",
    answer:
      "I enjoy working with both! From early-stage startups to established global brands, I'm passionate about crafting experiences that resonate with users.",
  },
  {
    question: "What's your typical process like?",
    answer:
      "My process is collaborative and iterative. It starts with a discovery phase to understand your goals, followed by strategy, design, and implementation, with feedback loops at every stage.",
  },
  {
    question: "Do you also develop the websites you design?",
    answer:
      "Yes, I offer full-stack development services to bring my designs to life, ensuring a seamless transition from concept to a fully functional, production-ready website.",
  },
  {
    question: "How can we start working together?",
    answer:
      "The best way to start is by booking a call through the link on my website. We can discuss your project in detail and see if we're a good fit.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 text-white">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Left Column: Image and Title */}
          <div className="md:col-span-1">
            <p className="text-sm uppercase text-neutral-400 mb-4">FAQs</p>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
              Any questions?
            </h2>
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src="/images/one.jpg" // Using an existing image as a placeholder
                alt="Abstract texture"
                fill
                className="object-cover opacity-75"
              />
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b border-neutral-700 pb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center text-left py-4"
                  >
                    <span className="text-xl font-medium">{faq.question}</span>
                    {openIndex === index ? (
                      <IconMinus className="h-6 w-6" />
                    ) : (
                      <IconPlus className="h-6 w-6" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pt-2 pb-4 text-neutral-400">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
