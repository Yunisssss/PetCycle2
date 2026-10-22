"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesAndWorkflow from "@/components/FeaturesAndWorkflow";
import BannerStrip from "@/components/BannerStrip";
import MissionVision from "@/components/MissionVision";
import WhyChoose from "@/components/WhyChoose";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import DepositSimulatorModal from "@/components/DepositSimulatorModal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenDemo={() => setIsDemoOpen(true)} />

        {/* Combined Side-by-Side: Key Features & How PetCycle Works */}
        <FeaturesAndWorkflow />

        {/* Collect • Recycle • Dispense / Feed • Store • Repeat Banner */}
        <BannerStrip />

        {/* Mission & Vision */}
        <MissionVision />

        {/* Why Choose PetCycle with Real Photography */}
        <WhyChoose />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <DepositSimulatorModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </div>
  );
}
