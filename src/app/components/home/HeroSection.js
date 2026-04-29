"use client";

import { useEffect, useMemo, useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "../../../lib/i18n";
import { SERVICE_CITIES, SERVICE_CITY_LIST } from "../../lib/constants";
import { VEHICLES } from "../../lib/vehicles";

const DURATION_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 10, 12];
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

  if (!isInitialized) return <div className="min-h-screen bg-white" />;

  return (
    <section id="home" className="relative bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="space-y-7 min-w-0">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold text-[#005F56] leading-tight break-words">
              {heading}
            </h1>

            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-full">
              <div className="flex border-b border-gray-100">
                {[{ id: "transfer", Icon: Plane, label: "Transfer" }].map(
                  ({ id, Icon, label }) => (
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
                  ),
                )}
              </div>

              <div className="p-3 sm:p-4 space-y-3">
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
                      setFromLandmarkMode("airport");
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
                    <>
                      {fromLandmarkMode === "airport" ? (
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
                          className="w-full bg-white text-gray-700 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                        >
                          <option value="">Select airport</option>
                          {fromLandmarkOptions.map((airport) => (
                            <option key={airport} value={airport}>
                              {airport}
                            </option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Enter pickup landmark"
                            value={fromLandmark}
                            onChange={(e) => setFromLandmark(e.target.value)}
                            className="w-full bg-white text-gray-700 placeholder-gray-400 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFromLandmarkMode("airport");
                              setFromLandmark("");
                            }}
                            className="text-xs font-semibold text-[#005F56] hover:text-[#00B1C5]"
                          >
                            Choose an airport instead
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

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
                        setToLandmarkMode("airport");
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
                      <>
                        {toLandmarkMode === "airport" ? (
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
                            className="w-full bg-white text-gray-700 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                          >
                            <option value="">Select airport</option>
                            {toLandmarkOptions.map((airport) => (
                              <option key={airport} value={airport}>
                                {airport}
                              </option>
                            ))}
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Enter dropoff landmark"
                              value={toLandmark}
                              onChange={(e) => setToLandmark(e.target.value)}
                              className="w-full bg-white text-gray-700 placeholder-gray-400 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setToLandmarkMode("airport");
                                setToLandmark("");
                              }}
                              className="text-xs font-semibold text-[#005F56] hover:text-[#00B1C5]"
                            >
                              Choose an airport instead
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

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

                {serviceType === "transfer" && !showReturn && (
                  <button
                    onClick={() => setShowReturn(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[#005F56] hover:border-[#00B1C5] hover:text-[#00B1C5] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    ADD RETURN
                  </button>
                )}

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
                      onClick={() =>
                        setPassengers((p) => (p === 0 ? 1 : p + 1))
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00B1C5] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>

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

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs text-gray-400 font-medium leading-relaxed">
                      Recommended vehicles for your passengers and baggages
                    </div>
                  </div>

                  {!selectedVehicleCategory ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {categoryOptions.map((category) => {
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
                            className={`text-left p-3 rounded-xl border-2 transition-colors ${
                              active
                                ? "border-[#00B1C5] bg-[#00B1C5]/5"
                                : category.fitsCurrentTrip
                                  ? "border-gray-200 bg-white hover:border-[#00B1C5]/60"
                                  : "border-gray-200 bg-white opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div className="min-w-0">
                                <p className="text-base font-semibold text-gray-800">
                                  {category.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {category.fitsCurrentTrip
                                    ? "Recommended for your search"
                                    : "Does not fit the current passenger or baggage count"}
                                </p>
                              </div>
                              {category.vehicle && (
                                <Image
                                  src={category.vehicle.image}
                                  alt={category.label}
                                  width={64}
                                  height={40}
                                  className="h-10 w-auto object-contain flex-shrink-0"
                                />
                              )}
                            </div>
                            <div className="space-y-1 text-xs text-gray-500">
                              <p>Seating: {category.seatsLabel} passengers</p>
                              <p>Baggage: {category.bagsLabel} bags</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVehicleCategory("");
                            setSelectedVehicle("");
                          }}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#005F56] hover:text-[#00B1C5]"
                        >
                          <ChevronLeftIcon className="h-4 w-4" />
                          Back to categories
                        </button>
                        <div className="text-xs text-gray-400 font-medium text-right">
                          Choose a{" "}
                          {selectedCategory?.label?.toLowerCase() || "vehicle"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categoryVehicles.map((vehicle) => {
                          const active = selectedVehicle === vehicle.id;

                          return (
                            <button
                              key={vehicle.id}
                              type="button"
                              onClick={() => setSelectedVehicle(vehicle.id)}
                              className={`text-left p-3 rounded-xl border-2 transition-colors ${
                                active
                                  ? "border-[#00B1C5] bg-[#00B1C5]/5"
                                  : "border-gray-200 bg-white hover:border-[#00B1C5]/60"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Image
                                  src={vehicle.image}
                                  alt={vehicle.name}
                                  width={52}
                                  height={34}
                                  className="h-8 w-auto object-contain"
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
                              <p className="text-xs text-gray-500 mb-1.5">
                                {vehicle.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                Seating: {vehicle.passengers} passengers ·
                                Baggage: {vehicle.luggage} bags
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

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
