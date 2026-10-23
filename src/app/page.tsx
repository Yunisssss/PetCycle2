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
  const [authInitialView, setAuthInitialView] = useState<"login" | "signup-step1">("login");
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleOpenLogin = () => {
    setAuthInitialView("login");
    setIsLoginOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthInitialView("signup-step1");
    setIsLoginOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar onOpenLogin={handleOpenLogin} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onGetStarted={handleOpenSignUp}
          onOpenDemo={() => setIsDemoOpen(true)}
        />

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
        initialView={authInitialView}
      />

      <DepositSimulatorModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </div>
  );
}
