import React from "react";

export default function BannerStrip() {
  const leftItems = ["Collect", "Recycle", "Dispense"];
  const rightItems = ["Feed", "Store", "Repeat"];

  return (
    <div className="w-full overflow-hidden shadow-inner select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 text-white font-bold text-lg sm:text-xl md:text-2xl tracking-wider">
        {/* Left Side: Dark Forest Teal */}
        <div className="bg-[#143b2f] py-5 px-6 flex items-center justify-around md:justify-evenly">
          {leftItems.map((word) => (
            <span
              key={word}
              className="hover:text-emerald-300 transition-colors cursor-default"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Right Side: Rich Terracotta Red #A32801 */}
        <div className="bg-[#A32801] py-5 px-6 flex items-center justify-around md:justify-evenly">
          {rightItems.map((word) => (
            <span
              key={word}
              className="hover:text-amber-200 transition-colors cursor-default"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
