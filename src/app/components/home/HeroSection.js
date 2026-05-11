"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Plus,
  Minus,
  Briefcase,
  ArrowLeftRight,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  Users,
} from "lucide-react";
import { useTranslation } from "../../../lib/i18n";
import { SERVICE_CITIES, SERVICE_CITY_LIST } from "../../lib/constants";
import { VEHICLES } from "../../lib/vehicles";

const CITY_OPTIONS = SERVICE_CITIES.map(({ city }) => city);
const CITY_LANDMARK_OPTIONS = {
  Jeddah: ["King Abdulaziz International Airport (JED)"],
  Taif: ["Taif Regional Airport (TIF)"],
  Madinah: ["Prince Mohammad bin Abdulaziz International Airport (MED)"],
  Riyadh: ["King Khalid International Airport (RUH)"],
};

function getCityLandmarkOptions(city) {
  return CITY_LANDMARK_OPTIONS[city] || [];
}

function getLandmarkMode(city, landmark) {
  if (!landmark) return "airport";
  return getCityLandmarkOptions(city).includes(landmark) ? "airport" : "other";
}

const VEHICLE_CATEGORIES = [
  {
    id: "sedan",
    label: "Sedan",
    seatsLabel: "4",
    bagsLabel: "4",
    vehicleIds: ["toyota-camry", "mercedes-s-class"],
    representativeVehicleId: "toyota-camry",
  },
  {
    id: "suv-mpv",
    label: "SUV / MPV",
    seatsLabel: "8",
    bagsLabel: "8",
    vehicleIds: ["gmc-yukon", "hyundai-staria"],
    representativeVehicleId: "gmc-yukon",
  },
  {
    id: "minivan",
    label: "Minivan",
    seatsLabel: "11–14",
    bagsLabel: "11–14",
    vehicleIds: ["hyundai-starex-star-x", "mercedes-sprinter"],
    representativeVehicleId: "hyundai-starex-star-x",
  },
];

function getVehicleCategory(categoryId) {
  return VEHICLE_CATEGORIES.find((category) => category.id === categoryId);
}

function getCategoryForVehicle(vehicleId) {
  return VEHICLE_CATEGORIES.find((category) =>
    category.vehicleIds.includes(vehicleId),
  );
}

function getVehicleById(vehicleId) {
  return VEHICLES.find((vehicle) => vehicle.id === vehicleId);
}

export default function HeroSection({
  title,
  heroImage = "/ksa-images/ksa-ride-5.png",
  heroImageAlt = "KSA Rides - Professional transfers",
  defaultTab = "transfer",
  passengers = 2,
  setPassengers,
}) {
  const { isInitialized } = useTranslation();

  const [fromCity, setFromCity] = useState("");
  const [fromLandmarkMode, setFromLandmarkMode] = useState("airport");
  const [fromLandmark, setFromLandmark] = useState("");
  const [toCity, setToCity] = useState("");
  const [toLandmarkMode, setToLandmarkMode] = useState("airport");
  const [toLandmark, setToLandmark] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [baggages, setBaggages] = useState(0);
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showReturn, setShowReturn] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const passengerDropdownRef = useRef(null);
  const miniScrollRef = useRef(null);

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
    if (fromLandmarkParam) {
      setFromLandmark(fromLandmarkParam);
      setFromLandmarkMode(getLandmarkMode(fromCityParam, fromLandmarkParam));
    }
    if (toCityParam) setToCity(toCityParam);
    if (toLandmarkParam) {
      setToLandmark(toLandmarkParam);
      setToLandmarkMode(getLandmarkMode(toCityParam, toLandmarkParam));
    }
    if (dateParam) setPickupDate(dateParam);
    if (timeParam) setPickupTime(timeParam);
    if (typeof setPassengers === "function") {
      if (!Number.isNaN(passengersParam))
        setPassengers(Math.max(0, passengersParam));
    }
    if (!Number.isNaN(baggagesParam))
      setBaggages(Math.min(14, Math.max(0, baggagesParam)));
    if (vehicleParam) {
      setSelectedVehicle(vehicleParam);
      const vehicleCategory = getCategoryForVehicle(vehicleParam);
      if (vehicleCategory) setSelectedVehicleCategory(vehicleCategory.id);
    }
  }, [setPassengers]);

  const fromLandmarkOptions = useMemo(
    () => getCityLandmarkOptions(fromCity),
    [fromCity],
  );

  const toLandmarkOptions = useMemo(
    () => getCityLandmarkOptions(toCity),
    [toCity],
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(e.target)) {
        setShowPassengerDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const from = fromCity
    ? fromLandmark.trim() ? `${fromCity}, ${fromLandmark.trim()}` : fromCity
    : "";
  const to = toCity
    ? toLandmark.trim() ? `${toCity}, ${toLandmark.trim()}` : toCity
    : "";

  const selectedCategory = useMemo(
    () => getVehicleCategory(selectedVehicleCategory),
    [selectedVehicleCategory],
  );

  const categoryVehicles = useMemo(() => {
    if (!selectedCategory) return [];

    return selectedCategory.vehicleIds
      .map((vehicleId) => getVehicleById(vehicleId))
      .filter(Boolean)
      .sort((a, b) => a.basePrice - b.basePrice);
  }, [selectedCategory]);

  const categoryOptions = useMemo(() => {
    const hasEligibleCategory = VEHICLE_CATEGORIES.some((category) => {
      const maxPassengers =
        category.id === "minivan" ? 14 : parseInt(category.seatsLabel, 10);
      const maxBaggages =
        category.id === "minivan" ? 14 : parseInt(category.bagsLabel, 10);
      return (
        passengers === 0 ||
        (passengers <= maxPassengers && baggages <= maxBaggages)
      );
    });

    return VEHICLE_CATEGORIES.map((category) => {
      const maxPassengers =
        category.id === "minivan" ? 14 : parseInt(category.seatsLabel, 10);
      const maxBaggages =
        category.id === "minivan" ? 14 : parseInt(category.bagsLabel, 10);
      const fitsCurrentTrip =
        passengers === 0 ||
        (passengers <= maxPassengers && baggages <= maxBaggages);

      return {
        ...category,
        vehicle: getVehicleById(category.representativeVehicleId),
        fitsCurrentTrip: hasEligibleCategory ? fitsCurrentTrip : true,
      };
    });
  }, [passengers, baggages]);

  useEffect(() => {
    if (!fromCity) {
      setFromLandmarkMode("airport");
      setFromLandmark("");
      return;
    }

    if (
      fromLandmarkMode === "airport" &&
      fromLandmark &&
      !fromLandmarkOptions.includes(fromLandmark)
    ) {
      setFromLandmark("");
    }
  }, [fromCity, fromLandmark, fromLandmarkMode, fromLandmarkOptions]);

  useEffect(() => {
    if (!toCity) {
      setToLandmarkMode("airport");
      setToLandmark("");
      return;
    }

    if (
      toLandmarkMode === "airport" &&
      toLandmark &&
      !toLandmarkOptions.includes(toLandmark)
    ) {
      setToLandmark("");
    }
  }, [toCity, toLandmark, toLandmarkMode, toLandmarkOptions]);

  useEffect(() => {
    if (!selectedVehicleCategory) return;

    const selectedCategoryData = getVehicleCategory(selectedVehicleCategory);
    if (!selectedCategoryData) {
      setSelectedVehicleCategory("");
      setSelectedVehicle("");
      return;
    }

    const maxPassengers =
      selectedCategoryData.id === "minivan"
        ? 14
        : parseInt(selectedCategoryData.seatsLabel, 10);
    const maxBaggages =
      selectedCategoryData.id === "minivan"
        ? 14
        : parseInt(selectedCategoryData.bagsLabel, 10);
    const categoryStillFits =
      passengers === 0 ||
      (passengers <= maxPassengers && baggages <= maxBaggages);

    if (!categoryStillFits) {
      setSelectedVehicleCategory("");
      setSelectedVehicle("");
      return;
    }

    if (
      selectedVehicle &&
      !selectedCategoryData.vehicleIds.includes(selectedVehicle)
    ) {
      setSelectedVehicle("");
    }
  }, [passengers, baggages, selectedVehicleCategory, selectedVehicle]);

  const canSearch =
    !!fromCity && !!fromLandmark.trim() && !!toCity && !!toLandmark.trim() &&
    !!pickupDate && !!pickupTime && !!selectedVehicle;

  const handleSeePrice = () => {
    if (!canSearch) return;
    const params = new URLSearchParams({
      from, to, fromCity,
      fromLandmark: fromLandmark.trim(),
      toCity, toLandmark: toLandmark.trim(),
      date: pickupDate, time: pickupTime,
      passengers: String(passengers), baggages: String(baggages),
      vehicle: selectedVehicle,
    });
    window.location.href = `/vehicles/extras?${params.toString()}`;
  };

  const miniScroll = (dir) => {
    if (!miniScrollRef.current) return;
    miniScrollRef.current.scrollBy({ left: dir * 210, behavior: "smooth" });
  };

  const heading = title ?? <>Private Transfers in {SERVICE_CITY_LIST}</>;

  if (!isInitialized) return <div className="min-h-screen bg-white" />;

  return (
    <section id="home" className="relative bg-white overflow-x-hidden">





      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-14 lg:py-16">

        {/* Heading + hero image row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6 lg:mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#B8960C] leading-tight">
            {heading}
          </h1>
          <div className="hidden lg:block flex-shrink-0">
            <div className="relative w-[460px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                width={460}
                height={340}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* One-way / Return radio toggle */}
        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 select-none">
            <input
              type="radio"
              name="tripType"
              checked={!showReturn}
              onChange={() => setShowReturn(false)}
              className="w-4 h-4 accent-[#B8960C]"
            />
            One-way
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 select-none">
            <input
              type="radio"
              name="tripType"
              checked={showReturn}
              onChange={() => setShowReturn(true)}
              className="w-4 h-4 accent-[#B8960C]"
            />
            Return
          </label>
        </div>

        {/* Full-width horizontal search bar */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#B8960C] overflow-visible w-full">

          {/* Desktop: single inline row */}
          <div className="hidden lg:flex items-stretch divide-x divide-gray-200 min-h-[72px]">

            {/* FROM */}
            <div className="flex flex-col justify-center px-4 py-3 min-w-[160px] flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-[#B8960C] flex-shrink-0" />
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">From</span>
              </div>
              <select
                value={fromCity}
                onChange={(e) => { setFromCity(e.target.value); setFromLandmark(""); }}
                className="w-full bg-transparent text-gray-800 text-sm font-medium outline-none cursor-pointer"
              >
                <option value="">Select city</option>
                {CITY_OPTIONS.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              {fromCity && (
                fromLandmarkMode === "airport" ? (
                  <select
                    value={fromLandmark}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setFromLandmarkMode("other");
                        setFromLandmark("");
                        return;
                      }
                      setFromLandmarkMode("airport");
                      setFromLandmark(e.target.value);
                    }}
                    className="mt-1.5 w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-[#B8960C] transition-colors"
                  >
                    <option value="">Select airport</option>
                    {fromLandmarkOptions.map((airport) => (
                      <option key={airport} value={airport}>{airport}</option>
                    ))}
                    <option value="Other">Other (free text)</option>
                  </select>
                ) : (
                  <div className="mt-1.5 space-y-1">
                    <input
                      type="text"
                      placeholder="Pickup landmark"
                      value={fromLandmark}
                      onChange={(e) => setFromLandmark(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-[#B8960C] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => { setFromLandmarkMode("airport"); setFromLandmark(""); }}
                      className="text-[10px] font-semibold text-[#B8960C] hover:underline"
                    >
                      Choose an airport instead
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Swap */}
            <button
              type="button"
              onClick={() => {
                const tc = fromCity; const tl = fromLandmark; const tm = fromLandmarkMode;
                setFromCity(toCity); setFromLandmark(toLandmark); setFromLandmarkMode(toLandmarkMode);
                setToCity(tc); setToLandmark(tl); setToLandmarkMode(tm);
              }}
              className="px-3 flex items-center justify-center text-[#B8960C] transition-colors flex-shrink-0"
              title="Swap locations"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            {/* TO */}
            <div className="flex flex-col justify-center px-4 py-3 min-w-[160px] flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-[#B8960C] flex-shrink-0" />
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">To</span>
              </div>
              <select
                value={toCity}
                onChange={(e) => { setToCity(e.target.value); setToLandmark(""); }}
                className="w-full bg-transparent text-gray-800 text-sm font-medium outline-none cursor-pointer"
              >
                <option value="">Select city</option>
                {CITY_OPTIONS.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              {toCity && (
                toLandmarkMode === "airport" ? (
                  <select
                    value={toLandmark}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setToLandmarkMode("other");
                        setToLandmark("");
                        return;
                      }
                      setToLandmarkMode("airport");
                      setToLandmark(e.target.value);
                    }}
                    className="mt-1.5 w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-[#B8960C] transition-colors"
                  >
                    <option value="">Select airport</option>
                    {toLandmarkOptions.map((airport) => (
                      <option key={airport} value={airport}>{airport}</option>
                    ))}
                    <option value="Other">Other (free text)</option>
                  </select>
                ) : (
                  <div className="mt-1.5 space-y-1">
                    <input
                      type="text"
                      placeholder="Dropoff landmark"
                      value={toLandmark}
                      onChange={(e) => setToLandmark(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-[#B8960C] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => { setToLandmarkMode("airport"); setToLandmark(""); }}
                      className="text-[10px] font-semibold text-[#B8960C] hover:underline"
                    >
                      Choose an airport instead
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Departure DATE */}
            <div className="flex flex-col justify-center px-4 py-3 min-w-[140px]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#B8960C] flex-shrink-0" />
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Date</span>
              </div>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent text-gray-800 text-sm font-semibold outline-none cursor-pointer"
              />
            </div>

            {/* Departure TIME */}
            <div className="flex flex-col justify-center px-4 py-3 min-w-[120px]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="h-3.5 w-3.5 text-[#B8960C] flex-shrink-0" />
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Time</span>
              </div>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-transparent text-gray-800 text-sm font-semibold outline-none cursor-pointer"
              />
            </div>

            {/* Return DATE + TIME (only when Return selected) */}
            {showReturn && (
              <>
                <div className="flex flex-col justify-center px-4 py-3 min-w-[140px]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#B8960C] flex-shrink-0" />
                    <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Return date</span>
                  </div>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-gray-800 text-sm font-semibold outline-none cursor-pointer"
                  />
                </div>
                <div className="flex flex-col justify-center px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#B8960C] flex-shrink-0" />
                    <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Return time</span>
                  </div>
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full bg-transparent text-gray-800 text-sm font-semibold outline-none cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* Passengers + Baggages dropdown */}
            <div className="relative flex flex-col justify-center px-4 py-3 min-w-[140px]" ref={passengerDropdownRef}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Users className="h-3.5 w-3.5 text-[#B8960C] flex-shrink-0" />
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">Passengers</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPassengerDropdown((v) => !v)}
                className="flex items-center gap-2 text-gray-800 hover:text-[#B8960C] transition-colors"
              >
                <span className="text-sm font-semibold">{passengers === 0 ? "Any" : `${passengers} Passenger${passengers > 1 ? "s" : ""}`}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              </button>

              {showPassengerDropdown && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-56">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">Passengers</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setPassengers((p) => Math.max(0, p - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                        <Minus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <span className="text-sm font-bold text-gray-800 w-6 text-center">
                        {passengers === 0 ? "All" : passengers}
                      </span>
                      <button type="button" onClick={() => setPassengers((p) => (p === 0 ? 1 : p + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                        <Plus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-[#B8960C]" />
                      <span className="text-sm font-semibold text-gray-700">Baggages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setBaggages((b) => Math.max(0, b - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                        <Minus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <span className="text-sm font-bold text-gray-800 w-6 text-center">{baggages}</span>
                      <button type="button" onClick={() => setBaggages((b) => Math.min(14, b + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                        <Plus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={handleSeePrice}
              disabled={!canSearch}
              className="flex items-center justify-center gap-2 px-7 text-white font-bold text-sm rounded-r-2xl transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0 min-w-[110px]"
              style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #B8960C 100%)" }}
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          {/* Mobile: stacked layout */}
          <div className="lg:hidden p-4 space-y-3">
            {/* From */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#B8960C] transition-colors p-3 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#B8960C] flex-shrink-0" />
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">From</span>
              </div>
              <select
                value={fromCity}
                onChange={(e) => { setFromCity(e.target.value); setFromLandmark(""); }}
                className="w-full bg-white text-gray-800 text-sm font-medium outline-none border border-gray-200 rounded-lg px-3 py-2.5"
              >
                <option value="">Select city</option>
                {CITY_OPTIONS.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              {fromCity && (
                fromLandmarkMode === "airport" ? (
                  <select
                    value={fromLandmark}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setFromLandmarkMode("other");
                        setFromLandmark("");
                        return;
                      }
                      setFromLandmarkMode("airport");
                      setFromLandmark(e.target.value);
                    }}
                    className="w-full bg-white text-gray-800 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2.5"
                  >
                    <option value="">Select airport</option>
                    {fromLandmarkOptions.map((airport) => (
                      <option key={airport} value={airport}>{airport}</option>
                    ))}
                    <option value="Other">Other (free text)</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter pickup landmark"
                      value={fromLandmark}
                      onChange={(e) => setFromLandmark(e.target.value)}
                      className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2.5"
                    />
                    <button
                      type="button"
                      onClick={() => { setFromLandmarkMode("airport"); setFromLandmark(""); }}
                      className="text-xs font-semibold text-[#B8960C] hover:underline"
                    >
                      Choose an airport instead
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Swap */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const tc = fromCity; const tl = fromLandmark; const tm = fromLandmarkMode;
                  setFromCity(toCity); setFromLandmark(toLandmark); setFromLandmarkMode(toLandmarkMode);
                  setToCity(tc); setToLandmark(tl); setToLandmarkMode(tm);
                }}
                className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-[#B8960C] hover:border-[#B8960C] transition-colors"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            {/* To */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#B8960C] transition-colors p-3 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#B8960C] flex-shrink-0" />
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">To</span>
              </div>
              <select
                value={toCity}
                onChange={(e) => { setToCity(e.target.value); setToLandmark(""); }}
                className="w-full bg-white text-gray-800 text-sm font-medium outline-none border border-gray-200 rounded-lg px-3 py-2.5"
              >
                <option value="">Select city</option>
                {CITY_OPTIONS.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              {toCity && (
                toLandmarkMode === "airport" ? (
                  <select
                    value={toLandmark}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setToLandmarkMode("other");
                        setToLandmark("");
                        return;
                      }
                      setToLandmarkMode("airport");
                      setToLandmark(e.target.value);
                    }}
                    className="w-full bg-white text-gray-800 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2.5"
                  >
                    <option value="">Select airport</option>
                    {toLandmarkOptions.map((airport) => (
                      <option key={airport} value={airport}>{airport}</option>
                    ))}
                    <option value="Other">Other (free text)</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter dropoff landmark"
                      value={toLandmark}
                      onChange={(e) => setToLandmark(e.target.value)}
                      className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2.5"
                    />
                    <button
                      type="button"
                      onClick={() => { setToLandmarkMode("airport"); setToLandmark(""); }}
                      className="text-xs font-semibold text-[#B8960C] hover:underline"
                    >
                      Choose an airport instead
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#B8960C] transition-colors p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="h-4 w-4 text-[#B8960C] flex-shrink-0" />
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date</span>
                </div>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent text-gray-800 text-sm font-medium outline-none cursor-pointer" />
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#B8960C] transition-colors p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock className="h-4 w-4 text-[#B8960C] flex-shrink-0" />
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Time</span>
                </div>
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-transparent text-gray-800 text-sm font-medium outline-none cursor-pointer" />
              </div>
            </div>

            {/* Return date + time (mobile) */}
            {showReturn && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar className="h-4 w-4 text-[#B8960C]" />
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Return date</span>
                  </div>
                  <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-gray-800 text-sm font-medium outline-none cursor-pointer" />
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="h-4 w-4 text-[#B8960C]" />
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Return time</span>
                  </div>
                  <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full bg-transparent text-gray-800 text-sm font-medium outline-none cursor-pointer" />
                </div>
              </div>
            )}

            {/* Passengers + Baggages (mobile) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Passengers</div>
                  <span className="text-sm font-bold text-gray-800">{passengers === 0 ? "All" : passengers}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => setPassengers((p) => (p === 0 ? 1 : p + 1))}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                    <Plus className="h-3 w-3 text-gray-600" />
                  </button>
                  <button type="button" onClick={() => setPassengers((p) => Math.max(0, p - 1))}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                    <Minus className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Briefcase className="h-3.5 w-3.5 text-[#B8960C]" />
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Bags</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{baggages}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => setBaggages((b) => Math.min(14, b + 1))}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                    <Plus className="h-3 w-3 text-gray-600" />
                  </button>
                  <button type="button" onClick={() => setBaggages((b) => Math.max(0, b - 1))}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#B8960C] transition-colors">
                    <Minus className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search CTA */}
            <button
              onClick={handleSeePrice}
              disabled={!canSearch}
              className="w-full py-4 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #B8960C 100%)" }}
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>

        {/* Vehicle selection carousel */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              {selectedVehicleCategory
                ? `Choose a ${selectedCategory?.label?.toLowerCase() || "vehicle"}`
                : "Recommended vehicles for your passengers and baggages"}
            </p>
            <div className="flex items-center gap-3">
              {selectedVehicleCategory && (
                <button
                  type="button"
                  onClick={() => { setSelectedVehicleCategory(""); setSelectedVehicle(""); }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8960C] hover:underline"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Back to categories
                </button>
              )}
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => miniScroll(-1)}
                  className="w-7 h-7 rounded-full bg-[#B8960C] flex items-center justify-center text-white hover:opacity-90 transition-all shadow-md">
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button onClick={() => miniScroll(1)}
                  className="w-7 h-7 rounded-full bg-[#B8960C] flex items-center justify-center text-white hover:opacity-90 transition-all shadow-md">
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={miniScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth"
          >
            {!selectedVehicleCategory
              ? categoryOptions.map((category) => {
                  const active = selectedVehicleCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        if (!category.fitsCurrentTrip) return;
                        setSelectedVehicleCategory(category.id);
                        setSelectedVehicle("");
                      }}
                      disabled={!category.fitsCurrentTrip}
                      className={`flex-none w-[200px] sm:w-[220px] text-left p-3 rounded-xl border-2 transition-colors snap-start ${
                        active
                          ? "border-[#B8960C] bg-[#B8960C]/5"
                          : category.fitsCurrentTrip
                            ? "border-gray-200 bg-white hover:border-[#B8960C]/60"
                            : "border-gray-200 bg-white opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {category.vehicle && (
                        <div className="flex items-center gap-2 mb-2">
                          <Image src={category.vehicle.image} alt={category.label} width={44} height={30}
                            className="h-7 w-auto object-contain flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{category.label}</p>
                            <p className="text-xs text-gray-500">Up to {category.seatsLabel} seats</p>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="rounded-lg bg-gray-50 px-2 py-1.5">
                          <p className="uppercase tracking-wide text-[10px] text-gray-400">Seats</p>
                          <p className="font-semibold text-gray-700">{category.seatsLabel}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 px-2 py-1.5">
                          <p className="uppercase tracking-wide text-[10px] text-gray-400">Bags</p>
                          <p className="font-semibold text-gray-700">{category.bagsLabel}</p>
                        </div>
                      </div>
                      {!category.fitsCurrentTrip && (
                        <p className="text-[10px] text-red-400 mt-1.5">Doesn&apos;t fit current search</p>
                      )}
                    </button>
                  );
                })
              : categoryVehicles.map((vehicle) => {
                  const selected = selectedVehicle === vehicle.id;
                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`flex-none w-[200px] sm:w-[220px] text-left p-3 rounded-xl border-2 transition-colors snap-start ${
                        selected ? "border-[#B8960C] bg-[#B8960C]/5" : "border-gray-200 bg-white hover:border-[#B8960C]/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Image src={vehicle.image} alt={vehicle.name} width={44} height={30}
                          className="h-7 w-auto object-contain flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{vehicle.name}</p>
                          <p className="text-xs text-gray-500">SAR {vehicle.basePrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Up to {vehicle.passengers} passengers &middot; {vehicle.luggage} bags
                      </p>
                    </button>
                  );
                })
            }
          </div>
        </div>

        {/* Trustpilot */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <span className="font-bold text-gray-800 tracking-widest text-xs uppercase">Excellent</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-[#00B67A]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 font-medium text-sm">Trustpilot</span>
        </div>

      </div>
    </section>
  );
}