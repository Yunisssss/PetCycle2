"use client";
import React, { useState } from "react";
import {
  Bell,
  Utensils,
  BarChart3,
  Recycle,
  Trash2,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

type FeatureId = "alerts" | "dispensing" | "analytics" | "recycling" | "storage" | null;

interface FeatureData {
  id: "alerts" | "dispensing" | "analytics" | "recycling" | "storage";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  angle: number; // Angle in degrees along the arc
}

const featuresList: FeatureData[] = [
  {
    id: "alerts",
    title: "Alerts & Notifications",
    description:
      "Sends instant automated alerts when food inventory is low or recycling bins are full, ensuring smooth, continuous operations.",
    icon: Bell,
    angle: -60,
  },
  {
    id: "dispensing",
    title: "Automated Pet Food Dispensing",
    description:
      "Automatically dispenses measured pet treats every accepted recyclable item, helping feed community animals.",
    icon: Utensils,
    angle: -30,
  },
  {
    id: "analytics",
    title: "Data Analytics & Reporting",
    description:
      "Live tracking of recycling metrics, inventory consumption rates, and feeding impact through comprehensive dashboards.",
    icon: BarChart3,
    angle: 0,
  },
  {
    id: "recycling",
    title: "Smart Recycling & Validation",
    description:
      "Intelligent sensor array accurately validates and sorts plastic bottles and cans to prevent system contamination.",
    icon: Recycle,
    angle: 30,
  },
  {
    id: "storage",
    title: "Storage Management",
    description:
      "Secure, high-capacity, climate-protected storage holds both compressed recyclables and fresh pet treats supplies safely.",
    icon: Trash2,
    angle: 60,
  },
];

const howItWorksSteps = [
  {
    id: "recycle",
    title: "Recycle",
    description: "Deposit plastic bottles and cans into the PetCycle machine.",
    icon: Recycle,
  },
  {
    id: "reward",
    title: "Earn a Reward",
    description: "Each validated item redeems a point redeemable for treats.",
    icon: null, // Custom Bowl icon with heart
  },
  {
    id: "impact",
    title: "Make an Impact",
    description:
      "Your action supports responsible waste management and helps feed animals in need by supporting PetCycle.",
    icon: TrendingUp,
  },
];

export default function FeaturesAndWorkflow() {
  // Default state: NO selected dropdown yet (null)
  const [activeFeature, setActiveFeature] = useState<FeatureId>(null);

  const toggleFeature = (id: FeatureData["id"]) => {
    setActiveFeature((prev) => (prev === id ? null : id));
  };

  return (
    <section id="features" className="py-14 sm:py-20 bg-white w-full">
      {/* Balanced layout maximizing space and centering section elements */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 2xl:gap-36 items-start w-full">

          {/* ================= LEFT COLUMN: KEY FEATURES ================= */}
          <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10 tracking-tight">
              <span className="text-gradient-brand">Key Features</span>
            </h2>

            <div className="w-full max-w-xl lg:max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 md:gap-8 lg:gap-10">

              {/* Left Orbit & Central Dynamic Icon */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0 flex items-center justify-center mx-auto sm:mx-0">

                {/* Fixed Arc Path on the Left */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Dashed circular orbit line */}
                  <div className="w-[230px] h-[230px] sm:w-[260px] sm:h-[260px] rounded-full border border-dashed border-emerald-300" />
                </div>

                {/* 5 Fixed Upright Satellites Along Left Arc */}
                {/* Satellite 1: Bell (Alerts & Notifications) - Top Left (-60°) */}
                <button
                  type="button"
                  onClick={() => toggleFeature("alerts")}
                  className={`absolute top-2 left-10 sm:left-12 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer shadow-sm ${activeFeature === "alerts"
                    ? "bg-[#A32801] text-white ring-4 ring-[#A32801]/25 scale-110 shadow-md"
                    : "bg-[#dcf3eb] text-[#164e3f] hover:scale-105 hover:bg-emerald-100"
                    }`}
                  title="Alerts & Notifications"
                  aria-label="Alerts & Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>

                {/* Satellite 2: Dispenser (Automated Pet Food Dispensing) - Upper Left (-30°) */}
                <button
                  type="button"
                  onClick={() => toggleFeature("dispensing")}
                  className={`absolute top-14 left-2 sm:left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer shadow-sm ${activeFeature === "dispensing"
                    ? "bg-[#A32801] text-white ring-4 ring-[#A32801]/25 scale-110 shadow-md"
                    : "bg-[#dcf3eb] text-[#164e3f] hover:scale-105 hover:bg-emerald-100"
                    }`}
                  title="Automated Pet Treat Dispensing"
                  aria-label="Automated Pet Treat Dispensing"
                >
                  <Utensils className="w-5 h-5" />
                </button>

                {/* Satellite 3: Chart (Data Analytics & Reporting) - Direct Left (0°) */}
                <button
                  type="button"
                  onClick={() => toggleFeature("analytics")}
                  className={`absolute top-1/2 -left-2 sm:-left-3 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer shadow-sm ${activeFeature === "analytics"
                    ? "bg-[#A32801] text-white ring-4 ring-[#A32801]/25 scale-110 shadow-md"
                    : "bg-[#dcf3eb] text-[#164e3f] hover:scale-105 hover:bg-emerald-100"
                    }`}
                  title="Data Analytics & Reporting"
                  aria-label="Data Analytics & Reporting"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>

                {/* Satellite 4: Recycle (Smart Recycling & Validation) - Lower Left (30°) */}
                <button
                  type="button"
                  onClick={() => toggleFeature("recycling")}
                  className={`absolute bottom-14 left-2 sm:left-3 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer shadow-sm ${activeFeature === "recycling"
                    ? "bg-[#A32801] text-white ring-4 ring-[#A32801]/25 scale-110 shadow-md"
                    : "bg-[#dcf3eb] text-[#164e3f] hover:scale-105 hover:bg-emerald-100"
                    }`}
                  title="Smart Recycling & Validation"
                  aria-label="Smart Recycling & Validation"
                >
                  <Recycle className="w-5 h-5" />
                </button>

                {/* Satellite 5: Bin (Storage Management) - Bottom Left (60°) */}
                <button
                  type="button"
                  onClick={() => toggleFeature("storage")}
                  className={`absolute bottom-2 left-10 sm:left-12 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 z-20 cursor-pointer shadow-sm ${activeFeature === "storage"
                    ? "bg-[#A32801] text-white ring-4 ring-[#A32801]/25 scale-110 shadow-md"
                    : "bg-[#dcf3eb] text-[#164e3f] hover:scale-105 hover:bg-emerald-100"
                    }`}
                  title="Storage Management"
                  aria-label="Storage Management"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Center Circle: Shows default Paw when unselected, or active feature icon */}
                <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#dcf3eb] border-2 border-[#164e3f] flex items-center justify-center shadow-md transition-all duration-300">

                  {/* Default: Paw Icon (No Selection) */}
                  {activeFeature === null && (
                    <div className="animate-fadeIn flex items-center justify-center">
                      <svg
                        className="w-24 h-24 sm:w-28 sm:h-28"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M50 48C40 48 32 58 35 70C37 78 43 83 50 83C57 83 63 78 65 70C68 58 60 48 50 48Z"
                          fill="none"
                          stroke="#A32801"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />
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
                  )}

                  {/* Bell Icon (Alerts & Notifications) */}
                  {activeFeature === "alerts" && (
                    <div className="text-[#A32801] animate-fadeIn">
                      <Bell className="w-20 h-20 sm:w-24 sm:h-24 stroke-[2]" />
                    </div>
                  )}

                  {/* Dispenser Icon (Automated Pet Food Dispensing) */}
                  {activeFeature === "dispensing" && (
                    <div className="text-[#A32801] animate-fadeIn">
                      <Utensils className="w-20 h-20 sm:w-24 sm:h-24 stroke-[2]" />
                    </div>
                  )}

                  {/* Chart Icon (Data Analytics & Reporting) */}
                  {activeFeature === "analytics" && (
                    <div className="text-[#A32801] animate-fadeIn">
                      <BarChart3 className="w-20 h-20 sm:w-24 sm:h-24 stroke-[2]" />
                    </div>
                  )}

                  {/* Recycle Icon (Smart Recycling & Validation) */}
                  {activeFeature === "recycling" && (
                    <div className="text-[#A32801] animate-fadeIn">
                      <Recycle className="w-20 h-20 sm:w-24 sm:h-24 stroke-[2]" />
                    </div>
                  )}

                  {/* Storage Bin Icon (Storage Management) */}
                  {activeFeature === "storage" && (
                    <div className="text-[#A32801] animate-fadeIn">
                      <Trash2 className="w-20 h-20 sm:w-24 sm:h-24 stroke-[2]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Dropdowns / Accordion Pills */}
              <div className="flex-1 w-full max-w-md sm:max-w-none flex flex-col space-y-3">
                {featuresList.map((item) => {
                  const isOpen = activeFeature === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl transition-all duration-200 overflow-hidden"
                    >
                      {/* Accordion Trigger Pill */}
                      <button
                        type="button"
                        onClick={() => toggleFeature(item.id)}
                        className={`w-full py-3 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between border cursor-pointer ${isOpen
                          ? "bg-[#A32801] text-white border-[#A32801] shadow-md shadow-[#A32801]/25"
                          : "bg-white text-[#164e3f] border-[#164e3f] hover:bg-emerald-50/70"
                          }`}
                      >
                        <span className="truncate pr-3">{item.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-[#164e3f]"
                            }`}
                        />
                      </button>

                      {/* Dropdown Description Panel */}
                      {isOpen && (
                        <div className="mt-2 p-4 rounded-2xl bg-orange-50/70 border border-orange-100 text-left animate-fadeIn">
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: HOW PETCYCLE WORKS ================= */}
          <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10 tracking-tight">
              <span className="text-gradient-brand">How PetCycle Works</span>
            </h2>

            {/* Vertical Stack of Horizontal Step Cards (Centered to match Key Features width) */}
            <div className="w-full max-w-xl lg:max-w-2xl mx-auto flex flex-col space-y-4 sm:space-y-5">
              {howItWorksSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className="w-full bg-white rounded-2xl p-5 sm:p-7 border border-[#ecdcd3] shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-5 sm:gap-6"
                  >
                    {/* Left Circular Badge */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#dcf3eb] border border-[#00B46B]/40 flex items-center justify-center text-[#164e3f] shrink-0 shadow-sm">
                      {Icon ? (
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#164e3f]" />
                      ) : (
                        /* Pet Bowl with Heart */
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M12 7.5c-1.5-2-4-2-4 0 0 1.5 4 4.5 4 4.5s4-3 4-4.5c0-2-2.5-2-4 0z"
                            fill="#A32801"
                            stroke="none"
                          />
                          <path d="M4 14h16c0 4-3.5 6-8 6s-8-2-8-6z" />
                          <path d="M3 14h18" />
                        </svg>
                      )}
                    </div>

                    {/* Right Title & Description */}
                    <div className="flex flex-col text-left flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5 text-[#143b2f]">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
