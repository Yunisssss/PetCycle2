"use client";
import React, { useState } from "react";
import { X, Sparkles, Check, Heart, RefreshCw, Cpu } from "lucide-react";

interface DepositSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositSimulatorModal({
  isOpen,
  onClose,
}: DepositSimulatorModalProps) {
  const [itemsRecycled, setItemsRecycled] = useState(3);
  const [foodDispensedGrams, setFoodDispensedGrams] = useState(60);
  const [status, setStatus] = useState<"idle" | "scanning" | "dispensing" | "success">("idle");
  const [lastItem, setLastItem] = useState<string>("Plastic PET Bottle (500ml)");

  if (!isOpen) return null;

  const handleDeposit = (itemName: string) => {
    setLastItem(itemName);
    setStatus("scanning");

    setTimeout(() => {
      setStatus("dispensing");
      setTimeout(() => {
        setItemsRecycled((prev) => prev + 1);
        setFoodDispensedGrams((prev) => prev + 20);
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
        }, 2200);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            Live IoT Hardware Simulation (ESP32 / C++ Firmware)
          </div>
          <h3 className="text-2xl font-bold text-[#143b2f]">
            PetCycle Machine Simulator
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Experience how inserting a recyclable bottle dispenses food for stray pets
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
            <div className="text-3xl font-extrabold text-[#143b2f]">
              {itemsRecycled}
            </div>
            <div className="text-xs font-medium text-emerald-800 mt-1">
              Items Recycled
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 text-center">
            <div className="text-3xl font-extrabold text-[#A32801]">
              {foodDispensedGrams}g
            </div>
            <div className="text-xs font-medium text-amber-900 mt-1">
              Pet Food Dispensed
            </div>
          </div>
        </div>

        {/* Interactive Device Viewport */}
        <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-6 bg-slate-50/70 text-center relative overflow-hidden mb-6">
          {status === "idle" && (
            <div>
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-inner">
                <Sparkles className="w-9 h-9" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Machine Ready for Deposit
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Select an item below to simulate insertion into the sensor chamber
              </p>
            </div>
          )}

          {status === "scanning" && (
            <div className="animate-pulse">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-amber-900">
                AI Vision & Load Cell Validating: {lastItem}...
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Checking material barcode, shape, and weight...
              </p>
            </div>
          )}

          {status === "dispensing" && (
            <div>
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center mb-3 animate-bounce">
                <Heart className="w-9 h-9 fill-current" />
              </div>
              <p className="text-sm font-bold text-emerald-800">
                Dispensing 20g Pet Food...
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Servo motor active • Food tray opened for community animals!
              </p>
            </div>
          )}

          {status === "success" && (
            <div>
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3">
                <Check className="w-10 h-10" />
              </div>
              <p className="text-sm font-bold text-emerald-900">
                Deposit Confirmed & Rewarded!
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Thank you for reducing plastic waste and feeding our furry friends!
              </p>
            </div>
          )}
        </div>

        {/* Deposit Trigger Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Try Depositing An Item:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={status !== "idle"}
              onClick={() => handleDeposit("Plastic Water Bottle (500ml)")}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 hover:border-emerald-400 transition-all disabled:opacity-50 text-left flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              PET Water Bottle
            </button>
            <button
              disabled={status !== "idle"}
              onClick={() => handleDeposit("Aluminum Soda Can (330ml)")}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 hover:border-emerald-400 transition-all disabled:opacity-50 text-left flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0"></span>
              Aluminum Can
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
