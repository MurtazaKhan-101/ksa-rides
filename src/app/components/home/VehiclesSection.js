"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Users, Briefcase } from 'lucide-react';
import { VEHICLES as vehicles } from '../../lib/vehicles';

export default function VehiclesSection({ passengers = 0, setPassengers }) {
  const scrollRef = useRef(null);

  const filteredVehicles = vehicles.filter(v => passengers === 0 || v.passengers >= passengers);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section className="py-12 lg:py-20 bg-[#F5E6A3] overflow-x-hidden w-full">

      {/* Header — constrained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Maximum comfort and safety for your trip
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Licensed vehicles, professional drivers
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group max-w-7xl mx-auto w-full overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 px-4 sm:px-6 lg:px-4">
          <p className="text-sm font-medium text-gray-500">
            {passengers > 0 ? (
              <span>Showing vehicles for <span className="text-[#B8960C] font-bold">{passengers}</span> passengers</span>
            ) : (
              <span>Showing our entire fleet</span>
            )}
          </p>
          <div className="flex items-center gap-4">
            {passengers > 0 && (
              <button
                onClick={() => setPassengers(0)}
                className="text-xs text-[#B8960C] font-bold hover:underline"
              >
                Reset Filter
              </button>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => scroll(-1)}
                className="w-9 h-9 rounded-full bg-[#B8960C] flex items-center justify-center text-white hover:bg-[#B8960C] transition-all shadow-md"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll(1)}
                className="w-9 h-9 rounded-full bg-[#B8960C] flex items-center justify-center text-white hover:bg-[#B8960C] transition-all shadow-md"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>



        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-4 sm:px-6 lg:px-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map(({ name, passengers, luggage, description, image }) => (
              <div
                key={name}
                className="flex-none w-72 sm:w-80 bg-white rounded-3xl p-6 flex flex-col border border-[#B8960C]/20 hover:border-[#B8960C]/50 hover:shadow-xl transition-all duration-300"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="h-40 flex items-center justify-center mb-6">
                  <Image
                    src={image}
                    alt={name}
                    width={260}
                    height={160}
                    className="mx-auto object-contain drop-shadow-xl"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{name}</h3>
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
                    <Users className="h-4 w-4 text-[#B8960C]" />
                    <span className="font-semibold">{passengers}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
                    <Briefcase className="h-4 w-4 text-[#B8960C]" />
                    <span className="font-semibold">{luggage}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{description}</p>

              </div>
            ))
          ) : (
            <div className="w-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium italic">No vehicles available for {passengers} passengers.</p>
              <button onClick={() => setPassengers(0)} className="mt-4 text-[#B8960C] font-bold hover:underline">Show all vehicles</button>
            </div>
          )}
        </div>

        {/* Mini Navigation Dots (Mobile only fallback) */}
        <div className="flex justify-center gap-2 mt-2 md:hidden">
          {[...Array(Math.min(filteredVehicles.length, 5))].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
          ))}
        </div>
      </div>

      {/* Reviews row — constrained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mt-10 py-5 border-t border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
            <span className="text-gray-600 font-medium">Our customers say</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-gray-800 uppercase tracking-wide text-xs">Excellent</span>
              <span className="text-gray-500">Rated <strong>4.8 / 5</strong> based on <strong>34,188 reviews</strong></span>
            </div>
            <span className="text-gray-400 font-semibold text-sm">✦ Trustpilot</span>
          </div>
        </div>
      </div>

    </section>
  );
}
