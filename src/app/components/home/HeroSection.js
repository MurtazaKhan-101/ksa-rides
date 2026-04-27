"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Plus,
  Minus,
  Briefcase,
  Timer,
  Plane,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "../../../lib/i18n";
import { SERVICE_CITY_LIST } from "../../lib/constants";

const DURATION_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 10, 12];
const CITY_OPTIONS = ["Jeddah", "Taif", "Madinah", "Riyadh"];
import { VEHICLES } from "../../lib/vehicles";

function getRecommendedVehicles(passengers, baggages) {
  // If passengers is 0 (All), return all vehicles sorted by price
  if (passengers === 0) {
    return [...VEHICLES].sort((a, b) => a.basePrice - b.basePrice);
  }

  // Filter eligible vehicles based on passengers and baggages
  const eligible = VEHICLES.filter(
    (v) => passengers <= v.passengers && (baggages <= v.luggage || !v.luggage)
  ).sort((a, b) => a.basePrice - b.basePrice);

  // If no vehicles perfectly match, show at least the two cheapest ones as fallback
  if (eligible.length === 0) {
    return [...VEHICLES].sort((a, b) => a.basePrice - b.basePrice).slice(0, 2);
  }

  return eligible;
}

/**
 * HeroSection — reusable across homepage, city-rides, and hourly-service.
 *
 * Props:
 *   title        – JSX or string for the hero heading
 *   heroImage    – path to the right-side image
 *   heroImageAlt – alt text for the image
 *   defaultTab   – 'transfer' | 'hourly'  (locks the default active tab)
 */
export default function HeroSection({
  title,
  heroImage = "/ksa-images/ksa-ride-5.png",
  heroImageAlt = "KSA Rides – Professional transfers",
  defaultTab = "transfer",
  passengers = 2,
  setPassengers,
}) {
  const { isInitialized } = useTranslation();

  const [serviceType, setServiceType] = useState(defaultTab);
  const [fromCity, setFromCity] = useState("");
  const [fromLandmark, setFromLandmark] = useState("");
  const [toCity, setToCity] = useState("");
  const [toLandmark, setToLandmark] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [baggages, setBaggages] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [duration, setDuration] = useState(2);
  const [showReturn, setShowReturn] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const fromCityParam = searchParams.get("fromCity") || "";
    const fromLandmarkParam = searchParams.get("fromLandmark") || "";
    const toCityParam = searchParams.get("toCity") || "";
    const toLandmarkParam = searchParams.get("toLandmark") || "";
    const dateParam = searchParams.get("date") || "";
    const timeParam = searchParams.get("time") || "";
    const passengersParam = parseInt(searchParams.get("passengers") || "0", 10);
    const baggagesParam = parseInt(searchParams.get("baggages") || "0", 10);
    const vehicleParam = searchParams.get("vehicle") || "";

    if (fromCityParam) setFromCity(fromCityParam);
    if (fromLandmarkParam) setFromLandmark(fromLandmarkParam);
    if (toCityParam) setToCity(toCityParam);
    if (toLandmarkParam) setToLandmark(toLandmarkParam);
    if (dateParam) setPickupDate(dateParam);
    if (timeParam) setPickupTime(timeParam);
    if (typeof setPassengers === 'function') {
      if (!Number.isNaN(passengersParam))
        setPassengers(Math.max(0, passengersParam));
    }
    if (!Number.isNaN(baggagesParam)) setBaggages(Math.min(14, Math.max(0, baggagesParam)));
    if (vehicleParam) setSelectedVehicle(vehicleParam);
  }, [setPassengers]);

  const from = fromCity
    ? fromLandmark.trim()
      ? `${fromCity}, ${fromLandmark.trim()}`
      : fromCity
    : "";

  const to = toCity
    ? toLandmark.trim()
      ? `${toCity}, ${toLandmark.trim()}`
      : toCity
    : "";

  const suggestedVehicles = useMemo(() => {
    return getRecommendedVehicles(passengers, baggages);
  }, [passengers, baggages]);

  useEffect(() => {
    if (!suggestedVehicles.some((v) => v.id === selectedVehicle)) {
      setSelectedVehicle(suggestedVehicles[0]?.id || "");
    }
  }, [selectedVehicle, suggestedVehicles]);

  const canSearch =
    !!fromCity &&
    !!fromLandmark.trim() &&
    !!toCity &&
    !!toLandmark.trim() &&
    !!pickupDate &&
    !!pickupTime &&
    !!selectedVehicle;

  const handleSeePrice = () => {
    if (!canSearch) return;

    const params = new URLSearchParams({
      from,
      to,
      fromCity,
      fromLandmark: fromLandmark.trim(),
      toCity,
      toLandmark: toLandmark.trim(),
      date: pickupDate,
      time: pickupTime,
      passengers: String(passengers),
      baggages: String(baggages),
      vehicle: selectedVehicle,
    });
    window.location.href = `/vehicles/extras?${params.toString()}`;
  };

  /* Default heading if none passed */
  const heading = title ?? <>Private Transfers in {SERVICE_CITY_LIST}</>;

  const miniScrollRef = useRef(null);

  const miniScroll = (dir) => {
    if (!miniScrollRef.current) return;
    miniScrollRef.current.scrollBy({ left: dir * 210, behavior: "smooth" });
  };

  if (!isInitialized) return <div className="min-h-screen bg-white" />;

  return (
    <section id="home" className="relative bg-white overflow-x-hidden">
      {/* ── Hero content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: heading + search widget */}
          <div className="space-y-7 min-w-0">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold text-[#005F56] leading-tight break-words">
              {heading}
            </h1>

            {/* ── Search widget card ── */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-full">
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {[
                  { id: "transfer", Icon: Plane, label: "Transfer" },
                  // { id: 'hourly',   Icon: Timer,   label: 'By the Hour' },
                ].map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setServiceType(id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all ${
                      serviceType === id
                        ? "text-white"
                        : "text-gray-500 hover:text-[#005F56] bg-white"
                    }`}
                    style={
                      serviceType === id
                        ? {
                            background:
                              "linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)",
                          }
                        : {}
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-3 sm:p-4 space-y-3">
                {/* From */}
                <div className="px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#00B1C5] flex-shrink-0" />
                    <div className="text-xs text-gray-400 font-medium">
                      From
                    </div>
                  </div>
                  <select
                    value={fromCity}
                    onChange={(e) => {
                      setFromCity(e.target.value);
                      setFromLandmark("");
                    }}
                    className="w-full bg-white text-gray-700 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <option value="">Select city</option>
                    {CITY_OPTIONS.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {fromCity && (
                    <input
                      type="text"
                      placeholder="Enter pickup landmark"
                      value={fromLandmark}
                      onChange={(e) => setFromLandmark(e.target.value)}
                      className="w-full bg-white text-gray-700 placeholder-gray-400 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                    />
                  )}
                </div>

                {/* To — transfer only */}
                {serviceType === "transfer" && (
                  <div className="px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#005F56] flex-shrink-0" />
                      <div className="text-xs text-gray-400 font-medium">
                        To
                      </div>
                    </div>
                    <select
                      value={toCity}
                      onChange={(e) => {
                        setToCity(e.target.value);
                        setToLandmark("");
                      }}
                      className="w-full bg-white text-gray-700 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <option value="">Select city</option>
                      {CITY_OPTIONS.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {toCity && (
                      <input
                        type="text"
                        placeholder="Enter dropoff landmark"
                        value={toLandmark}
                        onChange={(e) => setToLandmark(e.target.value)}
                        className="w-full bg-white text-gray-700 placeholder-gray-400 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                      />
                    )}
                  </div>
                )}

                {/* Date & Time row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer min-w-0">
                    <Calendar className="h-4 w-4 text-[#00B1C5] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400 font-medium">
                        Pickup date
                      </div>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                      />
                    </div>
                  </label>
                  <label className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer min-w-0">
                    <Clock className="h-4 w-4 text-[#00B1C5] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400 font-medium">
                        Pickup time
                      </div>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                      />
                    </div>
                  </label>
                </div>

                {/* Duration dropdown — hourly only */}
                {serviceType === "hourly" && (
                  <div className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors">
                    <Timer className="h-4 w-4 text-[#005F56] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 font-medium mb-0.5">
                        Duration
                      </div>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full bg-transparent text-gray-700 text-sm outline-none cursor-pointer"
                      >
                        {DURATION_OPTIONS.map((h) => (
                          <option key={h} value={h}>
                            {h} Hours
                          </option>
                        ))}
                      </select>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 pointer-events-none" />
                  </div>
                )}

                {/* ADD RETURN — transfer only */}
                {serviceType === "transfer" && !showReturn && (
                  <button
                    onClick={() => setShowReturn(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[#005F56] hover:border-[#00B1C5] hover:text-[#00B1C5] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    ADD RETURN
                  </button>
                )}

                {/* Return date/time — transfer + showReturn */}
                {serviceType === "transfer" && showReturn && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer min-w-0">
                      <Calendar className="h-4 w-4 text-[#005F56] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 font-medium">
                          Return date
                        </div>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                        />
                      </div>
                    </label>
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#00B1C5] transition-colors cursor-pointer min-w-0">
                      <Clock className="h-4 w-4 text-[#005F56] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-400 font-medium">
                          Return time
                        </div>
                        <input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="w-full bg-transparent text-gray-700 text-xs outline-none cursor-pointer"
                        />
                      </div>
                    </label>
                  </div>
                )}

                {/* Passengers */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">
                      Passengers
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {passengers === 0 ? "All" : passengers}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPassengers((p) => Math.max(0, p - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00B1C5] transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setPassengers((p) => (p === 0 ? 1 : p + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00B1C5] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Baggages */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#005F56]" />
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-0.5">
                        Baggages
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {baggages}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setBaggages((b) => Math.max(0, b - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00B1C5] transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setBaggages((b) => Math.min(14, b + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00B1C5] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Suggested vehicles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-gray-400 font-medium leading-relaxed">
                      Recommended vehicles for your passengers and baggages
                    </div>
                    {suggestedVehicles.length > 2 && (
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button 
                          onClick={(e) => { e.preventDefault(); miniScroll(-1); }}
                          className="w-7 h-7 rounded-full bg-[#00B1C5] flex items-center justify-center text-white hover:bg-[#005F56] transition-all shadow-md"
                        >
                          <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); miniScroll(1); }}
                          className="w-7 h-7 rounded-full bg-[#00B1C5] flex items-center justify-center text-white hover:bg-[#005F56] transition-all shadow-md"
                        >
                          <ChevronRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative group/mini">
                    <div 
                      ref={miniScrollRef}
                      className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-3 sm:-mx-1 px-3 sm:px-1 snap-x snap-mandatory scroll-smooth"
                    >
                      {suggestedVehicles.map((vehicle) => {
                        const selected = selectedVehicle === vehicle.id;
                        return (
                          <button
                            key={vehicle.id}
                            type="button"
                            onClick={() => setSelectedVehicle(vehicle.id)}
                            className={`flex-none w-[200px] text-left p-3 rounded-xl border-2 transition-colors snap-start ${
                              selected
                                ? "border-[#00B1C5] bg-[#00B1C5]/5"
                                : "border-gray-200 bg-white hover:border-[#00B1C5]/60"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Image
                                src={vehicle.image}
                                alt={vehicle.name}
                                width={42}
                                height={28}
                                className="h-7 w-auto object-contain"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {vehicle.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  SAR {vehicle.basePrice.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              Up to {vehicle.passengers} passengers ·{" "}
                              {vehicle.luggage} bags
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Scroll Indicator Dots */}
                    {suggestedVehicles.length > 2 && (
                      <div className="flex justify-center gap-1 mt-1">
                        {suggestedVehicles.map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1.5 h-1.5 rounded-full bg-gray-200"
                          />
                        ))}
                      </div>
                    )}


                  </div>
                </div>

                {/* See prices CTA */}
                <button
                  onClick={handleSeePrice}
                  disabled={!canSearch}
                  className="w-full py-3.5 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                  style={{
                    background:
                      "linear-gradient(296.47deg, #005F56 -2.82%, #00B1C5 97.17%)",
                  }}
                >
                  <Search className="h-4 w-4" />
                  See prices
                </button>
              </div>
            </div>

            {/* Trustpilot */}
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <span className="font-bold text-gray-800 tracking-widest text-xs uppercase">
                Excellent
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#00B67A]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 font-medium">Trustpilot</span>
            </div>
          </div>

          {/* Right: hero image */}
          <div className="hidden lg:flex justify-end items-start pt-2">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                width={600}
                height={520}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
