"use client";
import React from "react";
import Image from "next/image";

interface HeroProps {
  onOpenDemo: () => void;
}

export default function Hero({ onOpenDemo }: HeroProps) {
  return (
    <section className="relative w-full h-[520px] md:h-[620px] lg:h-[680px] overflow-hidden bg-slate-900 flex items-center">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Hands depositing plastic bottle into PetCycle smart recycling machine"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Subtle Dark Moody Eco Gradient Overlay matching design */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-950/75 to-slate-900/40" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/40 to-black/80" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="max-w-xl md:max-w-2xl text-left">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            Real Change Begins <br className="hidden sm:inline" />
            With A Bottle
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-emerald-50/90 font-normal leading-relaxed max-w-lg drop-shadow">
            Track your pet&apos;s needs while reducing environmental impact. Recycle
            pet-related items and monitor your sustainability journey.
          </p>

          {/* Call to Action Button */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <button
              onClick={onOpenDemo}
              className="px-7 py-3 rounded-lg bg-[#A32801] hover:bg-[#882100] text-white text-sm sm:text-base font-semibold tracking-wide shadow-lg shadow-[#A32801]/40 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </button>

            <a
              href="#how-it-works"
              className="px-5 py-3 rounded-lg text-white/90 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm text-sm sm:text-base font-medium transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
