import React from "react";
import { FaDiscord, FaGithub, FaTwitch, FaTwitter } from "react-icons/fa";

const links = [
  { href: "https://discord.com", icon: <FaDiscord /> },
  { href: "https://twitter.com", icon: <FaTwitter /> },
  { href: "https://github.com", icon: <FaGithub /> },
  { href: "https://twitch.com", icon: <FaTwitch /> },
];

const Footer = () => {
  return (
    <footer className="w-screen bg-black py-4 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          &copy; Meemstonex 2025, All rights reserved
        </p>

        <div className="flex justify-center gap-4 md:justify-start">
          {links.map((link) => (
            <a
              href={link.href}
              key={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors duration-500 ease-in-out hover:text-blue-950"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <a
          href="#privacy-policy"
          className="text-center text-sm hover:underline md:text-right"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
