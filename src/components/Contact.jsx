"use client";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import ContactFormModal from "./ContactFormModal";
import { getHomepageSettings } from "../services/api";

const Contact = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("/img/abdul.jpg");
  const [subtitle, setSubtitle] = useState("Contact Meemstonex");
  const [title, setTitle] = useState(
    "Let's b<b>u</b>ild the <br /> new e<b>r</b>a of <br /> ma<b>r</b>bles toge<b>t</b>her"
  );
  const [buttonTitle, setButtonTitle] = useState("contact us");

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.contact) {
          if (data.contact.imageUrl) setImageUrl(data.contact.imageUrl);
          if (data.contact.subtitle) setSubtitle(data.contact.subtitle);
          if (data.contact.title) setTitle(data.contact.title);
          if (data.contact.buttonTitle) setButtonTitle(data.contact.buttonTitle);
        }
      } catch (err) {
        console.error("Failed to load contact settings:", err);
      }
    }
    loadSettings();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <div id="contact" className="my-20 w-screen sm:px-10">
        {/*
          Outer wrapper: relative, so the image can be absolute on desktop.
          min-height ensures the card is tall enough to show the person on desktop.
        */}
        <div
          className="relative bg-black text-blue-50 overflow-hidden rounded-none sm:rounded-2xl"
          style={{ minHeight: "420px" }}
        >
          {/* ── IMAGE ──
              Mobile  : full-width block, shows from top, half the person visible (max-height 260px)
              Desktop : absolute right panel, full height, anchored to top-right
          */}
          <div
            className="w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[48%]"
            style={{ overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Contact visual"
              style={{
                display: "block",
                width: "100%",
                height: "260px",
                objectFit: "cover",
                objectPosition: "center 40%",
              }}
              className="md:!h-full"
            />

            {/* Fade into black — bottom on mobile, left on desktop */}
            <div
              className="absolute bottom-0 left-0 w-full md:hidden"
              style={{
                height: "40%",
                background: "linear-gradient(to top, #000 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              className="absolute inset-y-0 left-0 hidden md:block"
              style={{
                width: "60%",
                background: "linear-gradient(to right, #000 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* ── TEXT ──
              Sits below image on mobile, left-half on desktop.
              z-10 so it overlaps the desktop gradient.
          */}
          <div className="relative z-10 flex flex-col items-center text-center px-8 py-12 sm:px-12
                          md:w-1/2 md:items-start md:text-left md:py-24 md:pl-16">

            {/* Eyebrow */}
            <p className="font-general text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">
              {subtitle}
            </p>

            {/* Title */}
            <p
              className="special-font font-zentry leading-[0.9] text-white"
              style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)" }}
              dangerouslySetInnerHTML={{ __html: title }}
            />

            {/* Thin divider */}
            <div
              className="my-7 w-10"
              style={{ height: "1px", background: "rgba(255,255,255,0.15)" }}
            />

            {/* CTA */}
            <Button
              title={buttonTitle}
              containerClass="cursor-pointer !bg-white !text-black"
              onClick={() => setContactOpen(true)}
            />
          </div>
        </div>
      </div>

      <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Contact;
