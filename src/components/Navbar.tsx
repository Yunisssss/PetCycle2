"use client";
import React, { useState } from "react";
import PetCycleLogo from "./PetCycleLogo";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenLogin: () => void;
}

export default function Navbar({ onOpenLogin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Information", href: "#how-it-works" },
    { name: "About Us", href: "#mission" },
    { name: "Features", href: "#features" },
    { name: "Support", href: "#support" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Logo with 512 Paw & Atma Font PetCycle */}
          <a href="#" className="flex items-center py-2 shrink-0 group">
            <PetCycleLogo size="md" />
          </a>

          {/* Right Side: Navigation Links & Log In Button Grouped Together */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            <nav className="flex items-center space-x-8 lg:space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-normal text-slate-700 hover:text-[#143b2f] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Log In Button - #A32801 */}
            <button
              onClick={onOpenLogin}
              className="px-6 py-2 rounded-lg bg-[#A32801] hover:bg-[#882100] text-white text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Log In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-1.5 rounded-lg bg-[#A32801] text-white text-xs font-medium"
            >
              Log In
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fadeIn">
            <div className="flex flex-col space-y-3 pb-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-[#143b2f] hover:bg-slate-50"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
