"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { usePetCycleStore } from "@/lib/store";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Trash2,
  Cpu,
  Layers,
  Heart,
  Calendar,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
} from "lucide-react";

export default function ShelterDashboardPage() {
  const {
    currentUser,
    machines,
    transactions,
    alerts,
    leaderboard,
    refillFood,
    collectBin,
    resolveAlert,
  } = usePetCycleStore();

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Operational Modals
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  // Refill Form
  const [refillFoodType, setRefillFoodType] = useState<"cat" | "dog">("cat");
  const [refillGrams, setRefillGrams] = useState<number>(3000);
  const [refillExpiry, setRefillExpiry] = useState<string>("2027-04-15");

  // Collect Form
  const [collectBinType, setCollectBinType] = useState<"bottles" | "cans" | "both">("both");

  // Filter state for transactions
  const [txFilter, setTxFilter] = useState<"all" | "bottle" | "can">("all");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"month" | "week" | "all">("month");

  // Shelter's primary assigned machine
  const myMachine =
    machines.find((m) => m.shelterId === "shelter-paws") || machines[0];

  // Dynamic header meta
  const tabMetadata: Record<string, { title: string; desc: string }> = {
    dashboard: {
      title: "Today's Operational Summary",
      desc: `Real-time telemetry and food bank levels for ${myMachine?.shelterName || "PAWS Rehabilitation Center"} reverse vending machine.`,
    },
    machine: {
      title: "Machine Status",
      desc: "Live status, connectivity, and compartment levels of your reverse vending machine.",
    },
    inventory: {
      title: "Pet Food Inventory",
      desc: "Cat and dog food stock, expiry dates, and restocking history.",
    },
    collection: {
      title: "Bin Collection",
      desc: "Track which bins are full or nearly full and log each collection.",
    },
    transactions: {
      title: "Transaction History",
      desc: "Every deposit and food dispense at your machine.",
    },
    notifications: {
      title: "Notifications",
      desc: "Alerts for low food, food nearing expiry, and bins that need collection.",
    },
    reports: {
      title: "Reports and Analytics",
      desc: "Recycling trends, predictions for your next refill and collection, and downloadable reports.",
    },
    "shelter-profile": {
      title: "Shelter Profile",
      desc: "Your shelter's details as shown to partners and the community.",
    },
  };

  const currentMeta = tabMetadata[activeTab] || tabMetadata.dashboard;

  // Compartment Percentages
  const bottlePercent = Math.round(
    (myMachine.bottlesCurrent / myMachine.bottlesCapacity) * 100
  );
  const canPercent = Math.round(
    (myMachine.cansCurrent / myMachine.cansCapacity) * 100
  );
  const catFoodPercent = Math.round(
    (myMachine.catFoodCurrentGrams / myMachine.catFoodCapacityGrams) * 100
  );
  const dogFoodPercent = Math.round(
    (myMachine.dogFoodCurrentGrams / myMachine.dogFoodCapacityGrams) * 100
  );

  const shelterTransactions = transactions.filter(
    (t) => t.machineId === myMachine.id
  );

  const filteredTransactions = shelterTransactions.filter((t) => {
    if (txFilter === "all") return true;
    return t.itemType === txFilter;
  });

  const handleRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refillFood(myMachine.id, refillFoodType, refillGrams, refillExpiry);
    setIsRefillModalOpen(false);
  };

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    collectBin(myMachine.id, collectBinType);
    setIsCollectModalOpen(false);
  };

  return (
    <DashboardLayout
      role="shelter"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerTitle={currentMeta.title}
      headerDescription={currentMeta.desc}
    >
      {/* ===================================================================== */}
      {/* TAB 1: DASHBOARD (Today's Operational Summary)                         */}
      {/* ===================================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Action Callout Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span>Assigned Hardware: {myMachine.name} ({myMachine.code})</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Online & Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Located at: {myMachine.location} • Last Sync: {myMachine.lastSync}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRefillModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#00B46B] hover:bg-[#009e5e] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Refill Food</span>
              </button>
              <button
                onClick={() => setIsCollectModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Collect Bins</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Bottles */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Bottles Recycled
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1">
                {myMachine.bottlesCurrent}{" "}
                <span className="text-sm font-semibold text-slate-400">pcs</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-emerald-600 font-semibold">+18 today</span>
                <span>• Blue PET Bin</span>
              </div>
            </div>

            {/* Card 2: Cans */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Cans Recycled
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#EC4899] mt-1">
                {myMachine.cansCurrent}{" "}
                <span className="text-sm font-semibold text-slate-400">pcs</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-emerald-600 font-semibold">+12 today</span>
                <span>• Pink Can Bin</span>
              </div>
            </div>

            {/* Card 3: Cat Food Dispensed */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Cat Food Dispensed
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F97316] mt-1">
                {(5000 - myMachine.catFoodCurrentGrams).toLocaleString()}{" "}
                <span className="text-sm font-semibold text-slate-400">g</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-orange-600 font-semibold">Feed Strays</span>
                <span>• Orange Hopper</span>
              </div>
            </div>

            {/* Card 4: Dog Food Dispensed */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Dog Food Dispensed
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] mt-1">
                {(8000 - myMachine.dogFoodCurrentGrams).toLocaleString()}{" "}
                <span className="text-sm font-semibold text-slate-400">g</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-purple-600 font-semibold">Feed Strays</span>
                <span>• Purple Hopper</span>
              </div>
            </div>
          </div>

          {/* Storage Compartment Fill Levels with Warning Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#143b2f]">
                  Storage Compartment Fill Levels
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time ultrasonic & weight sensor feedback from reverse vending machine
                </p>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Live ESP32 telemetry
              </span>
            </div>

            {/* Warning Box */}
            {catFoodPercent < 25 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">
                    Cat Food Hopper is below {catFoodPercent}% capacity!
                  </div>
                  <div className="text-amber-800 text-[11px] mt-0.5">
                    Current stock is {myMachine.catFoodCurrentGrams}g. Restock suggested within 24 hours to avoid dispensing interruptions.
                  </div>
                </div>
                <button
                  onClick={() => {
                    setRefillFoodType("cat");
                    setIsRefillModalOpen(true);
                  }}
                  className="ml-auto px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 cursor-pointer"
                >
                  Restock Now
                </button>
              </div>
            )}

            {/* 4 Storage Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* 1. Bottle Bin */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                    Plastic Bottle Bin (Blue)
                  </span>
                  <span className="text-slate-600 font-mono">
                    {myMachine.bottlesCurrent} / {myMachine.bottlesCapacity} pcs ({bottlePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${bottlePercent > 90 ? "bg-rose-500" : "bg-[#2563EB]"
                      }`}
                    style={{ width: `${bottlePercent}%` }}
                  />
                </div>
              </div>

              {/* 2. Can Bin */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#EC4899]" />
                    Aluminum Can Bin (Pink)
                  </span>
                  <span className="text-slate-600 font-mono">
                    {myMachine.cansCurrent} / {myMachine.cansCapacity} pcs ({canPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${canPercent > 90 ? "bg-rose-500" : "bg-[#EC4899]"
                      }`}
                    style={{ width: `${canPercent}%` }}
                  />
                </div>
              </div>

              {/* 3. Cat Food Hopper */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#F97316]" />
                    Cat Food Hopper (Orange)
                  </span>
                  <span className="text-slate-600 font-mono">
                    {myMachine.catFoodCurrentGrams} / {myMachine.catFoodCapacityGrams} g ({catFoodPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${catFoodPercent < 25 ? "bg-amber-500" : "bg-[#F97316]"
                      }`}
                    style={{ width: `${catFoodPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
                  <span>Batch Expiry: {myMachine.catFoodExpiryDate}</span>
                  <span>{catFoodPercent < 25 ? "⚠️ Low Stock" : "Normal Level"}</span>
                </div>
              </div>

              {/* 4. Dog Food Hopper */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                    Dog Food Hopper (Purple)
                  </span>
                  <span className="text-slate-600 font-mono">
                    {myMachine.dogFoodCurrentGrams} / {myMachine.dogFoodCapacityGrams} g ({dogFoodPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8B5CF6] transition-all duration-500"
                    style={{ width: `${dogFoodPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
                  <span>Batch Expiry: {myMachine.dogFoodExpiryDate}</span>
                  <span>Normal Level</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side by Side: Recent Feed Activity Log & Leaderboard Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed Activity Log (2 cols) */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#143b2f]">
                    Recent Feed Activity Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Latest community deposits and food dispensed for shelter animals
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="text-xs text-[#00B46B] font-semibold hover:underline"
                >
                  View All Transactions →
                </button>
              </div>

              <div className="space-y-3">
                {shelterTransactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] ${tx.itemType === "bottle"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-100 text-pink-700"
                          }`}
                      >
                        {tx.itemType === "bottle" ? "PET" : "CAN"}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {tx.userDisplayName} deposited 1 {tx.itemType === "bottle" ? "Plastic Bottle" : "Aluminum Can"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {tx.timestamp} • Dispensed to {tx.foodType === "cat" ? "Cat Food Bowl" : "Dog Food Bowl"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-700">
                        +{tx.foodDispensedGrams}g food
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Table Widget (1 col) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[#143b2f]">
                    Top Contributors
                  </h3>
                  <div className="flex rounded-lg bg-slate-100 p-0.5 text-[10px]">
                    <button
                      onClick={() => setLeaderboardFilter("month")}
                      className={`px-2 py-0.5 rounded-md ${leaderboardFilter === "month" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setLeaderboardFilter("week")}
                      className={`px-2 py-0.5 rounded-md ${leaderboardFilter === "week" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                    >
                      Week
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  Ranked by recycled items and food donated to this shelter.
                </p>

                <div className="space-y-2.5">
                  {leaderboard.slice(0, 5).map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${entry.rank === 1
                              ? "bg-amber-400 text-slate-900"
                              : entry.rank === 2
                                ? "bg-slate-300 text-slate-800"
                                : entry.rank === 3
                                  ? "bg-amber-700 text-white"
                                  : "text-slate-400"
                            }`}
                        >
                          {entry.rank}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {entry.displayName}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-700">
                          {entry.itemsRecycled} pcs
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({entry.foodDonatedGrams}g)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
                Privacy Protected: Names masked to First Name + Initial
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: MY MACHINE (Machine Status & Hardware Telemetry)                */}
      {/* ===================================================================== */}
      {activeTab === "machine" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Machine Header */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Unit: {myMachine.code}
              </div>
              <h2 className="text-xl font-bold text-[#143b2f]">
                {myMachine.name} - Reverse Vending Unit
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Firmware C23/ESP32 v2.4.1 • Assigned to {myMachine.shelterName}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsRefillModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#00B46B] text-white text-xs font-semibold cursor-pointer"
              >
                Refill Hoppers
              </button>
              <button
                onClick={() => setIsCollectModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Empty Bins
              </button>
            </div>
          </div>

          {/* Sensor Health Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Ultrasonic Fill Sensor
              </div>
              <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Healthy</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Accurate within ±1cm</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                AI Optical Camera
              </div>
              <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Operational</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Classification 99.4%</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Load Cell Weight
              </div>
              <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Calibrated</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Tolerance ±2g</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">
                Dispenser Servo Motor
              </div>
              <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Responsive</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Cycle time 1.2s</div>
            </div>
          </div>

          {/* Telemetry Details */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-[#143b2f]">Network & Hardware Telemetry</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">IP Address</span>
                <span className="font-mono font-semibold text-slate-700">{myMachine.ipAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Wi-Fi Signal</span>
                <span className="font-mono font-semibold text-emerald-700">{myMachine.wifiSignal}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Physical Location</span>
                <span className="font-semibold text-slate-700">{myMachine.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Plastic Capacity</span>
                <span className="font-semibold text-slate-700">{myMachine.bottlesCapacity} bottles max</span>
              </div>
              <div>
                <span className="text-slate-400 block">Can Capacity</span>
                <span className="font-semibold text-slate-700">{myMachine.cansCapacity} cans max</span>
              </div>
              <div>
                <span className="text-slate-400 block">Food Hopper Limits</span>
                <span className="font-semibold text-slate-700">Cat: 5kg • Dog: 8kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: PET FOOD INVENTORY                                             */}
      {/* ===================================================================== */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#143b2f]">Hopper Stock Levels</h2>
              <p className="text-xs text-slate-500">Monitor current weight and recorded expiry dates</p>
            </div>
            <button
              onClick={() => setIsRefillModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#00B46B] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Mark as Refilled</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cat Food Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                  Cat Food Hopper
                </span>
                <span className="text-xs text-slate-400">Capacity: 5,000g</span>
              </div>
              <div className="text-3xl font-extrabold text-[#F97316]">
                {myMachine.catFoodCurrentGrams}g{" "}
                <span className="text-xs font-normal text-slate-400">remaining</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Batch Expiry Date: <strong className="text-slate-800">{myMachine.catFoodExpiryDate}</strong></div>
                <div>Status: {catFoodPercent < 25 ? <span className="text-amber-600 font-bold">Needs Refill Soon</span> : <span className="text-emerald-600 font-bold">Sufficient</span>}</div>
              </div>
            </div>

            {/* Dog Food Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                  Dog Food Hopper
                </span>
                <span className="text-xs text-slate-400">Capacity: 8,000g</span>
              </div>
              <div className="text-3xl font-extrabold text-[#8B5CF6]">
                {myMachine.dogFoodCurrentGrams}g{" "}
                <span className="text-xs font-normal text-slate-400">remaining</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Batch Expiry Date: <strong className="text-slate-800">{myMachine.dogFoodExpiryDate}</strong></div>
                <div>Status: <span className="text-emerald-600 font-bold">Sufficient Stock</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: BIN COLLECTION                                                 */}
      {/* ===================================================================== */}
      {activeTab === "collection" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#143b2f]">Recyclable Bin Management</h2>
              <p className="text-xs text-slate-500">Track fill capacity and log collections by recycling partners</p>
            </div>
            <button
              onClick={() => setIsCollectModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Mark as Collected</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Plastic Bottles Bin
                </span>
                <span className="text-xs font-semibold text-slate-600">{bottlePercent}% Full</span>
              </div>
              <div className="text-3xl font-extrabold text-[#2563EB]">
                {myMachine.bottlesCurrent}{" "}
                <span className="text-sm font-normal text-slate-400">/ {myMachine.bottlesCapacity} pcs</span>
              </div>
              <p className="text-xs text-slate-500">
                Sorted by AI computer vision. Compressed internally to optimize space.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-800">
                  Aluminum Cans Bin
                </span>
                <span className="text-xs font-semibold text-slate-600">{canPercent}% Full</span>
              </div>
              <div className="text-3xl font-extrabold text-[#EC4899]">
                {myMachine.cansCurrent}{" "}
                <span className="text-sm font-normal text-slate-400">/ {myMachine.cansCapacity} pcs</span>
              </div>
              <p className="text-xs text-slate-500">
                Verified with inductive sensor. Clean sorting prevents contamination.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: TRANSACTIONS (Transaction History)                              */}
      {/* ===================================================================== */}
      {activeTab === "transactions" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#143b2f]">Transaction History</h2>
              <p className="text-xs text-slate-500">
                Every deposit and pet food dispense at your reverse vending machine
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter by Item:</span>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
                <button
                  onClick={() => setTxFilter("all")}
                  className={`px-3 py-1 rounded-md ${txFilter === "all" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-600"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setTxFilter("bottle")}
                  className={`px-3 py-1 rounded-md ${txFilter === "bottle" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-600"}`}
                >
                  Bottles
                </button>
                <button
                  onClick={() => setTxFilter("can")}
                  className={`px-3 py-1 rounded-md ${txFilter === "can" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-600"}`}
                >
                  Cans
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Depositor</th>
                  <th className="py-3 px-4">Item Type</th>
                  <th className="py-3 px-4">Validation</th>
                  <th className="py-3 px-4">Food Dispensed</th>
                  <th className="py-3 px-4">Target Animal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono">{tx.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.userDisplayName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.itemType === "bottle" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                          }`}
                      >
                        {tx.itemType === "bottle" ? "Plastic Bottle" : "Aluminum Can"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${tx.status === "accepted" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {tx.foodDispensedGrams > 0 ? `+${tx.foodDispensedGrams}g` : "0g"}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {tx.foodType} Food Bowl
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: NOTIFICATIONS                                                  */}
      {/* ===================================================================== */}
      {activeTab === "notifications" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn">
          <h2 className="text-lg font-bold text-[#143b2f]">Shelter Notifications & Machine Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${alert.resolved
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : alert.severity === "critical"
                      ? "bg-rose-50/70 border-rose-200"
                      : "bg-amber-50/70 border-amber-200"
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{alert.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                </div>

                {!alert.resolved ? (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs shrink-0 cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Resolved
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 7: REPORTS AND ANALYTICS                                          */}
      {/* ===================================================================== */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#143b2f]">Reports & Operational Forecasts</h2>
              <p className="text-xs text-slate-500">Predictions and environmental impact summaries for your shelter</p>
            </div>
            <button
              onClick={() => alert("Report downloaded: PAWS_PetCycle_Monthly_Report.pdf")}
              className="px-4 py-2 rounded-xl bg-[#00B46B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Summary</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Next Refill</span>
              <div className="text-2xl font-bold text-slate-800">In 2.4 Days</div>
              <p className="text-xs text-slate-500">
                Based on current consumption of 420g cat food and 610g dog food per day.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Next Collection</span>
              <div className="text-2xl font-bold text-slate-800">In 1.8 Days</div>
              <p className="text-xs text-slate-500">
                Plastic bottles bin is currently at 85% capacity. Scheduled pickup advised.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 8: SHELTER PROFILE                                                */}
      {/* ===================================================================== */}
      {activeTab === "shelter-profile" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-[#143b2f]">Shelter Profile Information</h2>
            <p className="text-xs text-slate-500">Public information displayed to community recyclers in the mobile app</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shelter Name</label>
              <input
                type="text"
                readOnly
                defaultValue="PAWS Animal Rehabilitation Center"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                defaultValue="(02) 8475-1688"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cared For Cats</label>
              <input
                type="number"
                defaultValue={142}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cared For Dogs</label>
              <input
                type="number"
                defaultValue={198}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1">Current Urgent Needs</label>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold">
                Kitten Wet & Dry Food
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold">
                Adult Dog Maintenance Kibble
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold">
                Clean Towels & Disinfectant
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: Mark as Refilled                                             */}
      {/* ===================================================================== */}
      {isRefillModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsRefillModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#143b2f]">Restock Pet Food Hopper</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record fresh dry kibble batch for machine {myMachine.code}
            </p>

            <form onSubmit={handleRefillSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Food Hopper</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRefillFoodType("cat")}
                    className={`py-2 rounded-xl font-bold border transition-all ${refillFoodType === "cat"
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                  >
                    Cat Food (Orange)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefillFoodType("dog")}
                    className={`py-2 rounded-xl font-bold border transition-all ${refillFoodType === "dog"
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                  >
                    Dog Food (Purple)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Added (Grams)</label>
                <input
                  type="number"
                  min="500"
                  max="8000"
                  step="100"
                  value={refillGrams}
                  onChange={(e) => setRefillGrams(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Expiry Date</label>
                <input
                  type="date"
                  value={refillExpiry}
                  onChange={(e) => setRefillExpiry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRefillModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00B46B] text-white font-semibold shadow-xs"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: Mark as Collected                                            */}
      {/* ===================================================================== */}
      {isCollectModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsCollectModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#143b2f]">Confirm Bin Collection</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Empty recyclable bins and reset capacity sensors
            </p>

            <form onSubmit={handleCollectSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Bins Cleared</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCollectBinType("bottles")}
                    className={`py-2 rounded-xl font-bold border ${collectBinType === "bottles"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                  >
                    Bottles
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollectBinType("cans")}
                    className={`py-2 rounded-xl font-bold border ${collectBinType === "cans"
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                  >
                    Cans
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollectBinType("both")}
                    className={`py-2 rounded-xl font-bold border ${collectBinType === "both"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                Resetting capacity to 0 pcs. Collection entry will be logged into shelter recycling records.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold shadow-xs"
                >
                  Complete Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
