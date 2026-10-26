import React from "react";
import PetCycleLogo from "./PetCycleLogo";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="support"
      className="relative text-white pt-16 pb-10 border-t border-white/10"
      style={{
        background: "linear-gradient(90deg, #02241E 0%, #140903 50%, #5A1601 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Large Stylized Logo */}
          <div className="mb-4">
            <PetCycleLogo variant="footer" size="lg" />
          </div>

          {/* Tagline */}
          <p className="max-w-lg text-xs sm:text-sm text-amber-100/80 leading-relaxed mb-6 font-normal">
            An IoT-Enabled Reward-Based Recycling System for Urban Waste Management and Pet Treat Dispensing
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 mb-10">
            {/* Facebook Icon */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Email Icon */}
            <a
              href="mailto:contact@petcycle.io"
              aria-label="Email"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Divider Line */}
          <div className="w-full max-w-2xl h-px bg-white/15 mb-6" />

          {/* Copyright */}
          <p className="text-xs text-amber-100/60 font-light tracking-wide">
            &copy; 2026 PetCycle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
