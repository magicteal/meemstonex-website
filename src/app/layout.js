import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "../components/products/ToastProvider";
import WhatsAppFloating from "../components/WhatsAppFloating";
import { LanguageProvider } from "../lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const general = localFont({
  src: "./../../public/fonts/general.woff2",
  variable: "--font-general",
});

const circularWeb = localFont({
  src: "./../../public/fonts/circularweb-book.woff2",
  variable: "--font-circular-web",
});

const zentry = localFont({
  src: "./../../public/fonts/zentry-regular.woff2",
  variable: "--font-zentry",
});

const robertMedium = localFont({
  src: "./../../public/fonts/robert-medium.woff2",
  variable: "--font-robert-medium",
});

const robertRegular = localFont({
  src: "./../../public/fonts/robert-regular.woff2",
  variable: "--font-robert-regular",
});

export const metadata = {
  title: "Meemstonex | Premium Marble Collection",
  description: "Exquisite marble collection at Meemstonex. Premium quality stone for timeless beauty and strength.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          .goog-te-banner-frame { display: none !important; }
          body { top: 0 !important; }
          .goog-tooltip { display: none !important; }
          .goog-tooltip:hover { display: none !important; }
          .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
          #goog-gt-tt { display: none !important; }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${general.variable} ${circularWeb.variable} ${zentry.variable} ${robertMedium.variable} ${robertRegular.variable} antialiased`}
      >
        <div id="google_translate_element" style={{ display: "none" }}></div>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-config" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <LanguageProvider>
          <ToastProvider>
            {children}
            <WhatsAppFloating />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
