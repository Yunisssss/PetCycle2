"use client";
import React, { useState } from "react";
import { Bell, Utensils, BarChart3, Recycle, Archive } from "lucide-react";

interface FeatureItem {
  id: string;
  pillTitle: string;
  displayTitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: FeatureItem[] = [
  {
    id: "alerts",
    pillTitle: "Alerts & Notifications",
    displayTitle: "Alerts & Notifications",
    description:
      "Sends instant alerts when treat inventory is low or recycling bins are full, ensuring smooth and continuous operations.",
    icon: Bell,
  },
  {
    id: "dispensing",
    pillTitle: "Automated Pet Treats Dispensing",
    displayTitle: "Pet Treats Dispensing",
    description:
      "Automatically dispenses pet treats for every accepted recyclable item, helping provide accessible treats for animals.",
    icon: Utensils,
  },
  {
    id: "analytics",
    pillTitle: "Data Analytics & Reporting",
    displayTitle: "Data Analytics & Reporting",
    description:
      "Live tracking of recycling metrics, inventory consumption, and animal welfare impact via intuitive dashboards.",
    icon: BarChart3,
  },
  {
    id: "recycling",
    pillTitle: "Smart Recycling & Validation",
    displayTitle: "Smart Recycling & Validation",
    description:
      "Intelligent sensor array accurately identifies and sorts plastic bottles and cans to prevent system contamination.",
    icon: Recycle,
  },
  {
    id: "storage",
    pillTitle: "Storage Management",
    displayTitle: "Storage Management",
    description:
      "Secure, high-capacity, weather-resistant storage holds both compressed recyclables and fresh pet food supplies safely.",
    icon: Archive,
  },
];

export default function KeyFeatures() {
  const [activeFeatureId, setActiveFeatureId] = useState<string>("dispensing");

  const currentFeature =
    features.find((f) => f.id === activeFeatureId) || features[1];

  return (
    <section id="features" className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#143b2f] text-center mb-16 tracking-tight">
          Key Features
        </h2>

        {/* 3 Horizontal Columns: Pills | Orbit Graphic | Description */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: 5 Pill Buttons */}
          <div className="w-full md:w-[35%] flex flex-col space-y-3.5 max-w-sm">
            {features.map((feature) => {
              const isActive = feature.id === activeFeatureId;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeatureId(feature.id)}
                  className={`w-full py-3 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 text-center border shadow-sm ${isActive
                    ? "bg-[#A32801] text-white border-[#A32801] shadow-[#A32801]/30"
                    : "bg-white text-[#164e3f] border-[#164e3f] hover:bg-emerald-50/60"
                    }`}
                >
                  {feature.pillTitle}
                </button>
              );
            })}
          </div>

          {/* Center: Circular Graphic with Paw & Satellites */}
          <div className="w-full md:w-[35%] flex justify-center py-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer Circular Dashed Boundary */}
              <div className="absolute inset-1 rounded-full border border-dashed border-emerald-300 pointer-events-none" />

              {/* Main Green Center Circle with Paw */}
              <div className="relative z-10 w-44 h-44 rounded-full bg-[#dcf3eb] border-2 border-[#164e3f] flex items-center justify-center shadow-sm">
                <svg
                  className="w-24 h-24"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Palm pad */}
                  <path
                    d="M50 48C40 48 32 58 35 70C37 78 43 83 50 83C57 83 63 78 65 70C68 58 60 48 50 48Z"
                    fill="none"
                    stroke="#A32801"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  {/* Toes */}
                  <ellipse
                    cx="28"
                    cy="42"
                    rx="8"
                    ry="12"
                    transform="rotate(-20 28 42)"
                    fill="none"
                    stroke="#A32801"
                    strokeWidth="3.5"
                  />
                  <ellipse
                    cx="42"
                    cy="30"
                    rx="8.5"
                    ry="13"
                    transform="rotate(-7 42 30)"
                    fill="none"
                    stroke="#A32801"
                    strokeWidth="3.5"
                  />
                  <ellipse
                    cx="58"
                    cy="30"
                    rx="8.5"
                    ry="13"
                    transform="rotate(7 58 30)"
                    fill="none"
                    stroke="#A32801"
                    strokeWidth="3.5"
                  />
                  <ellipse
                    cx="72"
                    cy="42"
                    rx="8"
                    ry="12"
                    transform="rotate(20 72 42)"
                    fill="none"
                    stroke="#A32801"
                    strokeWidth="3.5"
                  />
                </svg>
              </div>

              {/* Satellite 1: Top (Bell) */}
              <button
                onClick={() => setActiveFeatureId("alerts")}
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${activeFeatureId === "alerts"
                  ? "bg-[#A32801] text-white shadow-md scale-110"
                  : "bg-[#dcf3eb] text-[#164e3f] border border-[#22c55e]/50 hover:scale-105"
                  }`}
                title="Alerts & Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Satellite 2: Top Right (Dispensing) */}
              <button
                onClick={() => setActiveFeatureId("dispensing")}
                className={`absolute top-10 right-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${activeFeatureId === "dispensing"
                  ? "bg-[#A32801] text-white shadow-md scale-110"
                  : "bg-[#dcf3eb] text-[#164e3f] border border-[#22c55e]/50 hover:scale-105"
                  }`}
                title="Automated Pet Food Dispensing"
              >
                <Utensils className="w-5 h-5" />
              </button>

              {/* Satellite 3: Bottom Right (Recycling) */}
              <button
                onClick={() => setActiveFeatureId("recycling")}
                className={`absolute bottom-2 right-8 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${activeFeatureId === "recycling"
                  ? "bg-[#A32801] text-white shadow-md scale-110"
                  : "bg-[#dcf3eb] text-[#164e3f] border border-[#22c55e]/50 hover:scale-105"
                  }`}
                title="Smart Recycling & Validation"
              >
                <Recycle className="w-5 h-5" />
              </button>

              {/* Satellite 4: Bottom Left (Analytics) */}
              <button
                onClick={() => setActiveFeatureId("analytics")}
                className={`absolute bottom-2 left-8 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${activeFeatureId === "analytics"
                  ? "bg-[#A32801] text-white shadow-md scale-110"
                  : "bg-[#dcf3eb] text-[#164e3f] border border-[#22c55e]/50 hover:scale-105"
                  }`}
                title="Data Analytics & Reporting"
              >
                <BarChart3 className="w-5 h-5" />
              </button>

              {/* Satellite 5: Left (Storage) */}
              <button
                onClick={() => setActiveFeatureId("storage")}
                className={`absolute top-10 left-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${activeFeatureId === "storage"
                  ? "bg-[#A32801] text-white shadow-md scale-110"
                  : "bg-[#dcf3eb] text-[#164e3f] border border-[#22c55e]/50 hover:scale-105"
                  }`}
                title="Storage Management"
              >
                <Archive className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Feature Title & Description */}
          <div className="w-full md:w-[30%] text-left max-w-sm">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#A32801] tracking-tight mb-4">
              {currentFeature.displayTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {currentFeature.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
