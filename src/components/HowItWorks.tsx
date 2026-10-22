"use client";
import React from "react";
import { Recycle, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#143b2f] tracking-tight">
            How PetCycle Works
          </h2>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Recycle */}
          <div className="group bg-white rounded-2xl p-8 sm:p-10 text-center border border-[#ecdcd3] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#dcf3eb] border border-[#22c55e]/40 flex items-center justify-center text-[#164e3f] mb-6 group-hover:scale-105 transition-transform">
              <Recycle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#143b2f] tracking-tight mb-3">
              Recycle
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Deposit plastic bottles and cans into the PetCycle machine.
            </p>
          </div>

          {/* Card 2: Earn a Reward */}
          <div className="group bg-white rounded-2xl p-8 sm:p-10 text-center border border-[#ecdcd3] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#dcf3eb] border border-[#22c55e]/40 flex items-center justify-center text-[#164e3f] mb-6 group-hover:scale-105 transition-transform">
              {/* Pet Bowl with heart icon */}
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 7.5c-1.5-2-4-2-4 0 0 1.5 4 4.5 4 4.5s4-3 4-4.5c0-2-2.5-2-4 0z" fill="#a13215" stroke="none" />
                <path d="M4 14h16c0 4-3.5 6-8 6s-8-2-8-6z" />
                <path d="M3 14h18" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#143b2f] tracking-tight mb-3">
              Earn a Reward
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Each validated item dispenses a 2-gram portion of cat or dog food.
            </p>
          </div>

          {/* Card 3: Make an Impact */}
          <div className="group bg-white rounded-2xl p-8 sm:p-10 text-center border border-[#ecdcd3] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#dcf3eb] border border-[#22c55e]/40 flex items-center justify-center text-[#164e3f] mb-6 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#143b2f] tracking-tight mb-3">
              Make an Impact
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Your action supports responsible waste management and helps feed stray animals by supporting PetCycle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
