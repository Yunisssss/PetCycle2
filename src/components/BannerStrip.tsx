import React from "react";

export default function BannerStrip() {
  const items = ["Collect", "Recycle", "Dispense", "Feed", "Store", "Repeat"];

  return (
    <div
      className="w-full select-none shadow-inner"
      style={{
        background: "linear-gradient(90deg, #03352D 0%, #143b2f 30%, #7a1d01 70%, #862101 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-around sm:justify-between gap-4 text-white font-bold text-lg sm:text-xl md:text-2xl tracking-wider">
          {items.map((word) => (
            <span
              key={word}
              className="select-none pointer-events-none"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
