"use client";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

/**
 * Floating WhatsApp button (bottom-right)
 * Reads NEXT_PUBLIC_WHATSAPP_NUMBER and optional NEXT_PUBLIC_WHATSAPP_MESSAGE
 */
export default function WhatsAppFloating() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"; // TODO: replace with your number
  const defaultMsg = "Hello Meemstonex, I would like to know more.";
  const message = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || defaultMsg;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
