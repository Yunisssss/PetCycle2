import React from "react";
import Image from "next/image";

interface CardItem {
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
}

const cards: CardItem[] = [
  {
    title: "Collect Recyclable Waste",
    description:
      "Sends instant alerts when food inventory is low or recycling bins are full, ensuring smooth and continuous operations.",
    imageSrc: "/images/collect-waste.jpg",
    altText: "Volunteer holding a container filled with recyclable plastic bottles",
  },
  {
    title: "Feed Stray Animals",
    description:
      "Sends instant alerts when food inventory is low or recycling bins are full, ensuring smooth and continuous operations.",
    imageSrc: "/images/feed-strays.jpg",
    altText: "Stray cats and dog eating nutritious food outdoors from clean bowls",
  },
  {
    title: "Strengthening The Community",
    description:
      "Sends instant alerts when food inventory is low or recycling bins are full, ensuring smooth and continuous operations.",
    imageSrc: "/images/community.jpg",
    altText: "Community volunteers smiling together after sustainability event",
  },
];

export default function WhyChoose() {
  return (
    <section id="community" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-[#143b2f]">Why Choose </span>
            <span className="text-[#A32801]">Pet</span>
            <span className="text-[#00B46B]">Cycle</span>
          </h2>
        </div>

        {/* 3 Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Card Image */}
              <div className="w-full h-52 sm:h-56 overflow-hidden bg-slate-100">
                <img
                  src={card.imageSrc}
                  alt={card.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-start">
                <h3 className="text-xl font-bold text-[#A32801] tracking-tight mb-2.5">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
