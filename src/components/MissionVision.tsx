import React from "react";

export default function MissionVision() {
  return (
    <section id="mission" className="py-24 sm:py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 pt-6">
          {/* =============================================================== */}
          {/* MISSION CARD                                                    */}
          {/* =============================================================== */}
          <div className="relative bg-[#daf2ea] border-[2.5px] border-[#164e3f] rounded-[32px] p-8 sm:p-12 pt-16 sm:pt-20 shadow-sm transition-all duration-300 flex flex-col items-center">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-[#daf2ea] border-4 border-white flex items-center justify-center shadow-md">
              {/* Target with Arrow SVG */}
              <svg
                viewBox="0 0 48 48"
                fill="none"
                stroke="#143b2f"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-11 h-11 sm:w-12 sm:h-12"
              >
                {/* Outer ring */}
                <circle cx="21" cy="27" r="14" />
                {/* Middle ring */}
                <circle cx="21" cy="27" r="8.5" />
                {/* Bullseye center dot */}
                <circle cx="21" cy="27" r="3.2" fill="#143b2f" />
                {/* Arrow shaft */}
                <line x1="23.5" y1="24.5" x2="37" y2="11" />
                {/* Arrow head / fletching */}
                <path d="M31 9h8v8" />
                <path d="M36 12l4-4" />
              </svg>
            </div>

            {/* Mission Title (Solid Deep Green) */}
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#143b2f] tracking-wide mt-1 mb-5 sm:mb-6 text-center">
              MISSION
            </h3>

            {/* Left-Aligned Mission Description */}
            <p className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed text-left w-full">
              To provide environmental sustainability through IoT-enabled recycling
              incentives while supporting animal welfare by providing food for
              stray cats and dogs, empowering communities with a secure,
              efficient, and data-driven solution for responsible waste
              management.
            </p>
          </div>

          {/* =============================================================== */}
          {/* VISION CARD                                                     */}
          {/* =============================================================== */}
          <div className="relative bg-[#daf2ea] border-[2.5px] border-[#164e3f] rounded-[32px] p-8 sm:p-12 pt-16 sm:pt-20 shadow-sm transition-all duration-300 flex flex-col items-center">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-[#daf2ea] border-4 border-white flex items-center justify-center shadow-md">
              {/* Eye SVG */}
              <svg
                viewBox="0 0 48 48"
                fill="#143b2f"
                className="w-12 h-12 sm:w-14 sm:h-14"
              >
                <path d="M24 13C14.5 13 6.3 19 3 24c3.3 5 11.5 11 21 11s17.7-6 21-11c-3.3-5-11.5-11-21-11z" />
                <circle cx="24" cy="24" r="6.8" fill="white" />
                <circle cx="24" cy="24" r="3.4" fill="#143b2f" />
              </svg>
            </div>

            {/* Vision Title (Solid Brand Rust Orange) */}
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#A32801] tracking-wide mt-1 mb-5 sm:mb-6 text-center">
              VISION
            </h3>

            {/* Left-Aligned Vision Description */}
            <p className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed text-left w-full">
              To empower communities by leveraging smart recycling systems that
              enhance waste management efficiency, promote environmental
              responsibility, and support animal welfare through sustainable and
              data-driven solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
