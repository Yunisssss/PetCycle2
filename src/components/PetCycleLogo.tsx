import React from "react";
import Image from "next/image";
import { atma } from "@/app/fonts";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "footer";
  role?: string;
}

export default function PetCycleLogo({
  className = "",
  size = "md",
  variant = "light",
}: LogoProps) {
  const iconDimensions =
    size === "sm"
      ? { width: 34, height: 34, imgClass: "h-8 sm:h-9", textClass: "text-2xl" }
      : size === "lg"
      ? { width: 56, height: 56, imgClass: "h-14 sm:h-16", textClass: "text-4xl md:text-5xl" }
      : { width: 44, height: 44, imgClass: "h-11 sm:h-12", textClass: "text-3xl sm:text-[34px]" };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 512x512 Paw Logo Image */}
      <Image
        src="/images/petcycle-logo-512.png"
        alt="PetCycle Paw Logo"
        width={iconDimensions.width}
        height={iconDimensions.height}
        priority
        unoptimized
        className={`${iconDimensions.imgClass} w-auto object-contain transition-transform duration-200 group-hover:scale-105 shrink-0`}
      />

      {/* Brand Text in Atma Font with Horizontal Brand Gradient */}
      <span
        style={{ fontFamily: "'Atma', var(--font-atma), cursive, sans-serif" }}
        className={`${atma.className} font-atma font-bold tracking-tight leading-none text-gradient-brand ${iconDimensions.textClass} whitespace-nowrap`}
      >
        PetCycle
      </span>
    </div>
  );
}
