import React from "react";
import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section id="mission" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-14 pt-8">
          {/* MISSION CARD */}
          <div className="relative bg-[#daf2ea] border-2 border-[#164e3f] rounded-3xl p-8 sm:p-12 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#164e3f] border-4 border-white text-white flex items-center justify-center shadow-md">
              <Target className="w-10 h-10" />
            </div>

            {/* Content */}
            <div className="pt-4">
              <h3 className="text-3xl font-extrabold text-[#164e3f] tracking-wider mb-6">
                MISSION
              </h3>
              <p className="text-sm sm:text-base text-[#1b3d32] font-normal leading-relaxed max-w-md mx-auto">
                To provide environmental sustainability through IoT-enabled recycling
                incentives while supporting animal welfare by providing food for
                stray cats and dogs, empowering communities with a secure,
                efficient, and data-driven solution for responsible waste
                management.
              </p>
            </div>
          </div>

          {/* VISION CARD */}
          <div className="relative bg-[#daf2ea] border-2 border-[#164e3f] rounded-3xl p-8 sm:p-12 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Top Floating Circular Badge */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#164e3f] border-4 border-white text-white flex items-center justify-center shadow-md">
              <Eye className="w-10 h-10" />
            </div>

            {/* Content */}
            <div className="pt-4">
              <h3 className="text-3xl font-extrabold text-[#A32801] tracking-wider mb-6">
                VISION
              </h3>
              <p className="text-sm sm:text-base text-[#1b3d32] font-normal leading-relaxed max-w-md mx-auto">
                To empower communities by leveraging smart recycling systems that
                enhance waste management efficiency, promote environmental
                responsibility, and support animal welfare through sustainable and
                data-driven solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
