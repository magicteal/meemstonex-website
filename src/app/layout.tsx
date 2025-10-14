import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
          antialiased
          relative
          min-h-screen
          bg-[url('/images/bg-texture.jpg')]
          bg-cover
          bg-center
          bg-no-repeat
          bg-fixed
          before:absolute
          before:inset-0
          before:bg-black
          before:opacity-50
          before:z-0
        `}
      >
        {/* Content Wrapper */}
        <div className="relative z-10 backdrop-brightness-90">{children}</div>
      </body>
    </html>
  );
}
