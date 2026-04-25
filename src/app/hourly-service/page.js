"use client";

import { useState, useCallback } from 'react';
import HeroSection           from '../components/home/HeroSection';
import ServiceCardsSection   from '../components/home/ServiceCardsSection';
import GlobalCoverageSection from '../components/home/GlobalCoverageSection';
import SeamlessSection       from '../components/home/SeamlessSection';
import FeaturesSection       from '../components/home/FeaturesSection';
import VehiclesSection       from '../components/home/VehiclesSection';
import DestinationsSection   from '../components/home/DestinationsSection';
import FAQSection            from '../components/home/FAQSection';
import NewsletterSection     from '../components/home/NewsletterSection';
import Footer                from '../components/home/Footer';

export default function HourlyServicePage() {
  const [passengers, setPassengers] = useState(0);

  const handleSetPassengers = useCallback((val) => {
    setPassengers((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      return Math.min(14, Math.max(0, next));
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        title={<>Your Reliable<br />Hourly Service</>}
        heroImage="/ksa-images/ksa-ride-5.png"
        heroImageAlt="KSA Rides – Hourly chauffeur service"
        defaultTab="hourly"
        passengers={passengers}
        setPassengers={handleSetPassengers}
      />
      <ServiceCardsSection />
      <GlobalCoverageSection />
      <SeamlessSection />
      <FeaturesSection />
      <VehiclesSection passengers={passengers} setPassengers={handleSetPassengers} />
      <DestinationsSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
