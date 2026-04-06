"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "../lib/i18n";
import LayoutWrapper from "./components/layout/LayoutWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>KSA Rides - Private Transfers in Jeddah, Taif, Madinah & Riyadh</title>
        <meta name="description" content="Book private airport transfers, city rides, and hourly chauffeur services with KSA Rides. Fixed pricing, professional drivers, available 24/7." />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
