import React from "react";

export default function MissionVision() {
  return (
    <section id="mission" className="py-20 sm:py-28 bg-[#f8faf9] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 lg:gap-12 pt-8">
          {/* =============================================================== */}
          {/* MISSION CARD                                                    */}
          {/* =============================================================== */}
          <div className="relative bg-[#daf2ea] border-[2.5px] border-[#164e3f] rounded-[30px] px-8 sm:px-10 pt-20 pb-10 sm:pt-22 sm:pb-12 shadow-[0_10px_25px_-5px_rgba(20,59,47,0.1)] flex flex-col items-center">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-14 sm:-top-16 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#daf2ea] border-[6px] border-white flex items-center justify-center shadow-md">
              {/* Target with Arrow SVG */}
              <svg
                viewBox="0 0 54 54"
                fill="none"
                className="w-16 h-16 sm:w-18 sm:h-18"
              >
                {/* Target Outer Ring */}
                <circle
                  cx="23"
                  cy="31"
                  r="15"
                  stroke="#143b2f"
                  strokeWidth="3.6"
                />
                {/* Target Middle Ring */}
                <circle
                  cx="23"
                  cy="31"
                  r="9.5"
                  stroke="#143b2f"
                  strokeWidth="3.4"
                />
                {/* Target Bullseye Dot */}
                <circle cx="23" cy="31" r="3.8" fill="#143b2f" />
                {/* Arrow Shaft piercing toward center */}
                <line
                  x1="26"
                  y1="28"
                  x2="42"
                  y2="12"
                  stroke="#143b2f"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />
                {/* Arrow Fletching / Wings */}
                <path
                  d="M34 10 L44 10 L44 20"
                  stroke="#143b2f"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="39"
                  y1="15"
                  x2="46"
                  y2="8"
                  stroke="#143b2f"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Mission Title (Solid Deep Green) */}
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#143b2f] tracking-wide mb-5 sm:mb-6 text-center">
              MISSION
            </h3>

            {/* Left-Aligned Mission Description */}
            <p className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed text-left w-full">
              To provide environmental sustainability through IoT-enabled recycling
              incentives while supporting animal welfare by providing treats for
              animals in need, empowering communities with a secure,
              efficient, and data-driven solution for responsible waste
              management.
            </p>
          </div>

          {/* =============================================================== */}
          {/* VISION CARD                                                     */}
          {/* =============================================================== */}
          <div className="relative bg-[#daf2ea] border-[2.5px] border-[#164e3f] rounded-[30px] px-8 sm:px-10 pt-20 pb-10 sm:pt-22 sm:pb-12 shadow-[0_10px_25px_-5px_rgba(20,59,47,0.1)] flex flex-col items-center">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-14 sm:-top-16 left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#daf2ea] border-[6px] border-white flex items-center justify-center shadow-md">
              {/* Eye SVG */}
              <svg
                viewBox="0 0 54 54"
                fill="none"
                className="w-18 h-18 sm:w-20 sm:h-20"
              >
                {/* Almond eye shape */}
                <path
                  d="M6 27C12 16.5 20 11 27 11C34 11 42 16.5 48 27C42 37.5 34 43 27 43C20 43 12 37.5 6 27Z"
                  fill="#143b2f"
                />
                {/* White iris */}
                <circle cx="27" cy="27" r="8.2" fill="white" />
                {/* Dark Pupil */}
                <circle cx="27" cy="27" r="4.2" fill="#143b2f" />
              </svg>
            </div>

            {/* Vision Title (Solid Brand Rust Orange) */}
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#A32801] tracking-wide mb-5 sm:mb-6 text-center">
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
