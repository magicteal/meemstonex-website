"use client";
import React, { useEffect, useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import { getHomepageSettings } from "../services/api";

const Team = () => {
  const [visible, setVisible] = useState(false);
  const [subtitle, setSubtitle] = useState("The Minds Behind the Craft");
  const [title, setTitle] = useState("MEET THE TEAM");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.team) {
          setVisible(data.team.visible);
          if (data.team.subtitle) setSubtitle(data.team.subtitle);
          if (data.team.title) setTitle(data.team.title);
          if (Array.isArray(data.team.members)) setMembers(data.team.members);
        }
      } catch (err) {
        console.error("Failed to load team settings:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !visible || members.length === 0) {
    return null;
  }

  return (
    <section id="team" className="w-screen bg-black text-blue-50 py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col items-center">
        <p className="font-general text-xs uppercase tracking-[0.25em] text-blue-400 opacity-80 mb-4 text-center">
          {subtitle}
        </p>

        <div className="relative w-full mb-12">
          <AnimatedTitle
            title={title}
            sectionId="#team"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10 text-center"
          />
        </div>

        {/* Premium Grid layout for Team Members */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full justify-center">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center border border-white/10 bg-neutral-950/40 backdrop-blur-md rounded-3xl p-5 transition-all duration-500 hover:border-white/20 hover:bg-neutral-900/60 hover:-translate-y-2 shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Member Photo Container with premium borders */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 mb-5 transition-all duration-500 group-hover:border-white/15">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600 font-bold uppercase tracking-wider text-xs">
                    No Photo
                  </div>
                )}
                {/* Subtle luxury shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-all duration-500" />
              </div>

              {/* Member Details */}
              <div className="text-center w-full">
                <h3 className="font-general text-base font-bold tracking-wider text-white transition-all duration-300 group-hover:text-blue-200">
                  {member.name}
                </h3>
                <p className="mt-1.5 font-circular-web text-[10px] font-semibold uppercase tracking-widest text-blue-400/80">
                  {member.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
