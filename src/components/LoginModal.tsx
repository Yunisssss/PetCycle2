"use client";
import React, { useState } from "react";
import { X, Lock, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import PetCycleLogo from "./PetCycleLogo";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [role, setRole] = useState<"admin" | "volunteer">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <PetCycleLogo size="md" />
          <h3 className="text-xl font-bold text-[#143b2f] mt-3">
            System Portal Login
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access IoT machine analytics, inventory levels, & dispensing logs
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-10 flex flex-col items-center text-center animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-slate-800">
              Authenticated Successfully!
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              Redirecting to PetCycle Admin Console...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  role === "admin"
                    ? "bg-white text-[#A32801] shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Admin / Supervisor
              </button>
              <button
                type="button"
                onClick={() => setRole("volunteer")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  role === "volunteer"
                    ? "bg-white text-[#164e3f] shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Field Caretaker
              </button>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "admin"
                      ? "admin@petcycle.org"
                      : "volunteer@petcycle.org"
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A32801]/20 focus:border-[#A32801]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-[#A32801] hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#A32801]/20 focus:border-[#A32801]"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Fill */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmail(
                    role === "admin"
                      ? "admin@petcycle.io"
                      : "caretaker@petcycle.io"
                  );
                  setPassword("PetCycle2026!");
                }}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium underline inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Fill Demo Credentials
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-[#A32801] hover:bg-[#852309] shadow-lg shadow-[#A32801]/25 transition-all transform active:scale-[0.99] text-sm"
            >
              Sign In to Dashboard
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Protected by Supabase Auth & PostgreSQL Row-Level Security
        </div>
      </div>
    </div>
  );
}
