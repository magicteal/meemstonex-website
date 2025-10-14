import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import ScrollEffects from "@/components/ScrollEffects";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const script = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Meemstonex",
  description: "Meemstonex - The Ultimate Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${script.variable}
          antialiased
          relative
          min-h-screen
          bg-[#0f0e0e]
        `}
      >
        {/* Navbar aur Footer yahan se hata diye gaye hain */}
        <ScrollEffects />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
