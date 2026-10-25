"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePetCycleStore } from "@/lib/store";
import PetCycleLogo from "@/components/PetCycleLogo";
import {
  Home,
  MapPin,
  Trophy,
  HeartHandshake,
  User,
  Bell,
  Navigation,
  Sparkles,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Smartphone,
  Maximize2,
  X,
  LogOut,
  Recycle,
} from "lucide-react";

type MobileTab = "home" | "machines" | "leaderboard" | "shelters" | "profile";

function getInitials(name?: string): string {
  if (!name) return "PC";
  const words = name
    .trim()
    .split(/\s+/)
    .filter((w) => !w.endsWith(".") && w.length > 0);
  if (words.length === 0) return "PC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export default function CommunityUserMobileApp() {
  const router = useRouter();
  const {
    currentUser,
    machines,
    shelters,
    leaderboard,
    transactions,
    alerts,
    depositItem,
    logout,
  } = usePetCycleStore();

  const [activeTab, setActiveTab] = useState<MobileTab>("home");

  // Ensure community user always lands on the "home" tab upon login
  useEffect(() => {
    setActiveTab("home");
  }, [currentUser?.id]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<"month" | "week" | "all">("month");
  const [shelterFilter, setShelterFilter] = useState<string>("all");
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [depositItemType, setDepositItemType] = useState<"bottle" | "can">("bottle");
  const [depositFoodChoice, setDepositFoodChoice] = useState<"cat" | "dog">("cat");
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string>("");

  // Nearest machine
  const nearestMachine = machines[0];

  // User personal contribution stats calculated from leaderboard / transactions
  const myLeaderboardEntry = leaderboard.find((l) => l.isCurrentUser) || {
    rank: 2,
    displayName: currentUser?.name || "Juan D.",
    itemsRecycled: 348,
    foodDonatedGrams: 7820,
    shelterSupported: "PAWS Rehabilitation Center",
  };

  const myTransactions = transactions.filter(
    (t) => t.userDisplayName.includes("Juan") || t.userDisplayName === currentUser?.name
  );

  const handleSimulatedDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    depositItem(nearestMachine.id, depositItemType, depositFoodChoice);
    const grams = depositItemType === "bottle" ? 20 : 30;
    setDepositSuccessMsg(
      `Deposited 1 ${depositItemType === "bottle" ? "Plastic Bottle" : "Aluminum Can"}! Dispensed ${grams}g to ${depositFoodChoice} food bowl!`
    );
    setTimeout(() => {
      setDepositSuccessMsg("");
      setIsDepositModalOpen(false);
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const selectedShelter = shelters.find((s) => s.id === selectedShelterId);
  const selectedMachine = machines.find((m) => m.id === selectedMachineId);
  const userInitials = getInitials(currentUser?.name || "Juan Dela Cruz");

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-slate-800">
      {/* Frame Mode Toggle Bar (Desktop only) */}
      <div className="hidden md:flex items-center justify-between px-6 py-2.5 bg-slate-800/90 text-slate-300 text-xs border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#00B46B]" />
          <span className="font-semibold text-white">PetCycle Mobile App Experience</span>
          <span className="text-slate-400">• Community Contributor Perspective</span>
        </div>
        <button
          onClick={() => setDeviceFrameMode(!deviceFrameMode)}
          className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
        >
          {deviceFrameMode ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Mockup Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container - Centered Mobile Frame on Desktop */}
      <div className="flex-1 flex items-center justify-center p-0 md:p-6 bg-slate-900/70 overflow-y-auto">
        <div
          className={`w-full bg-slate-50 flex flex-col relative transition-all overflow-hidden ${
            deviceFrameMode
              ? "max-w-[420px] h-[860px] md:rounded-[44px] shadow-2xl md:border-[10px] md:border-slate-800"
              : "max-w-2xl min-h-screen md:min-h-[850px] md:rounded-3xl shadow-xl"
          }`}
        >
          {/* Top Phone Speaker / Island (Phone frame only) */}
          {deviceFrameMode && (
            <div className="hidden md:flex justify-center pt-2.5 pb-1 bg-white shrink-0">
              <div className="w-24 h-4 bg-slate-800 rounded-full" />
            </div>
          )}

          {/* App Top Bar */}
          <div className="px-4 py-3 bg-white border-b border-slate-100 shrink-0 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 group">
              <PetCycleLogo size="sm" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-[#A32801] hover:bg-[#882100] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Recycle className="w-3.5 h-3.5" />
                <span>Recycle</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className="w-8 h-8 rounded-full bg-[#143b2f] text-[#daf2ea] font-extrabold text-[11px] flex items-center justify-center shadow-xs shrink-0 ring-2 ring-[#00B46B]/20 cursor-pointer overflow-hidden"
                title={`${currentUser?.name || "Juan Dela Cruz"} (Community Recycler)`}
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </button>
            </div>
          </div>

          {/* Scrollable Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
            {/* =============================================================== */}
            {/* TAB 1: HOME                                                     */}
            {/* =============================================================== */}
            {activeTab === "home" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Greeting & Impact Summary */}
                <div className="p-4 rounded-3xl bg-[#143b2f] text-white shadow-sm space-y-1">
                  <div className="text-xs text-emerald-300 font-semibold">
                    Hello, {currentUser?.name?.split(" ")[0] || "Juan"}! 👋
                  </div>
                  <h2 className="text-lg font-extrabold leading-snug">
                    Real change begins with every single bottle.
                  </h2>
                  <p className="text-xs text-emerald-100/90 pt-1">
                    Your community recycling helped feed{" "}
                    <strong className="text-white underline underline-offset-2">48 shelter pets</strong> this week!
                  </p>
                </div>

                {/* Nearest Machine Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Nearest Reverse Vending Machine
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Ready & Online
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#143b2f]">
                        {nearestMachine.name} ({nearestMachine.code})
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{nearestMachine.location} • {nearestMachine.distanceKm} km away</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("machines")}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="View on Map"
                    >
                      <Navigation className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Hoppers: Cat Kibble & Dog Food Available</span>
                    <button
                      onClick={() => setIsDepositModalOpen(true)}
                      className="text-[#00B46B] font-bold hover:underline cursor-pointer"
                    >
                      Deposit Here →
                    </button>
                  </div>
                </div>

                {/* Your Contribution Card (STRICTLY NO POINTS) */}
                <div className="p-4 rounded-2xl bg-[#daf2ea] border-2 border-[#164e3f]/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143b2f]">
                      Your Lifetime Contribution
                    </span>
                    <span className="text-[10px] font-bold text-[#A32801] bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      Rank #{myLeaderboardEntry.rank} on Leaderboard
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                      <div className="text-base font-extrabold text-[#2563EB]">
                        {Math.round(myLeaderboardEntry.itemsRecycled * 0.65)}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500">Bottles (pcs)</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                      <div className="text-base font-extrabold text-[#EC4899]">
                        {Math.round(myLeaderboardEntry.itemsRecycled * 0.35)}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500">Cans (pcs)</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                      <div className="text-base font-extrabold text-[#00B46B]">
                        {(myLeaderboardEntry.foodDonatedGrams / 1000).toFixed(1)}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500">Food (kg)</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 text-center font-medium">
                    Supporting: <strong className="text-[#143b2f]">{myLeaderboardEntry.shelterSupported}</strong>
                  </div>
                </div>

                {/* Shelter Needs Announcements */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="text-xs font-bold text-[#143b2f] flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-[#A32801]" />
                    <span>Shelter Urgent Needs</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>PAWS Rehabilitation Center</strong> is caring for 142 rescued kittens and urgently needs dry kitten kibble. Every recycled plastic bottle dispenses 20g of fresh food!
                  </p>
                  <button
                    onClick={() => setActiveTab("shelters")}
                    className="text-xs text-[#A32801] font-bold hover:underline block pt-1 cursor-pointer"
                  >
                    Browse All Partner Shelters →
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB 2: MACHINES                                                 */}
            {/* =============================================================== */}
            {activeTab === "machines" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#143b2f]">
                    Reverse Vending Machines
                  </h3>
                  <span className="text-xs text-slate-400">
                    {machines.length} active stations
                  </span>
                </div>

                {/* Simulated Map Visual */}
                <div className="relative w-full h-44 rounded-2xl bg-emerald-950 overflow-hidden border border-slate-200 flex items-center justify-center shadow-xs">
                  <Image
                    src="/images/hero.jpg"
                    alt="Map preview"
                    fill
                    className="object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                  
                  {/* Map Pin Overlays */}
                  <div className="relative z-10 flex flex-col items-center text-center p-3">
                    <MapPin className="w-8 h-8 text-emerald-400 animate-bounce" />
                    <span className="text-xs font-bold text-white mt-1">Metro Manila Network</span>
                    <span className="text-[10px] text-emerald-200">Tap below to view station capacity</span>
                  </div>
                </div>

                {/* Machine Cards List */}
                <div className="space-y-2.5">
                  {machines.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMachineId(m.id)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-800">
                            {m.name} ({m.code})
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{m.location} • {m.distanceKm} km</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === "online"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {m.status === "online" ? "Ready" : "Low Food"}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
                        <span>Host: {m.shelterName}</span>
                        <span className="text-[#00B46B] font-bold">Directions →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB 3: LEADERBOARD                                              */}
            {/* =============================================================== */}
            {activeTab === "leaderboard" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#143b2f]">
                    Community Leaderboard
                  </h3>
                  <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-[10px]">
                    <button
                      onClick={() => setLeaderboardFilter("month")}
                      className={`px-2 py-0.5 rounded-md ${
                        leaderboardFilter === "month" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setLeaderboardFilter("week")}
                      className={`px-2 py-0.5 rounded-md ${
                        leaderboardFilter === "week" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setLeaderboardFilter("all")}
                      className={`px-2 py-0.5 rounded-md ${
                        leaderboardFilter === "all" ? "bg-white font-bold text-slate-800 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      All Time
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Ranked by total items recycled and pet food donated to partner animal shelters.
                  </span>
                </div>

                {/* Ranked List */}
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                        entry.isCurrentUser
                          ? "bg-emerald-50 border-emerald-300 font-bold"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            entry.rank === 1
                              ? "bg-amber-400 text-slate-900 shadow-xs"
                              : entry.rank === 2
                              ? "bg-slate-300 text-slate-800"
                              : entry.rank === 3
                              ? "bg-amber-700 text-white"
                              : "text-slate-400"
                          }`}
                        >
                          {entry.rank}
                        </span>
                        <div>
                          <div className="text-slate-800">
                            {entry.displayName} {entry.isCurrentUser && <span className="text-emerald-700 font-bold">(You)</span>}
                          </div>
                          <div className="text-[10px] text-slate-400">{entry.shelterSupported}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-[#143b2f]">{entry.itemsRecycled} pcs</div>
                        <div className="text-[10px] text-emerald-700 font-semibold">{entry.foodDonatedGrams}g food</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Permanently Pinned User Rank Bar */}
                <div className="p-3 rounded-2xl bg-[#143b2f] text-white shadow-md flex items-center justify-between text-xs sticky bottom-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-[10px]">
                      #{myLeaderboardEntry.rank}
                    </span>
                    <div>
                      <div className="font-bold">Your Standing</div>
                      <div className="text-[10px] text-emerald-200">
                        {myLeaderboardEntry.itemsRecycled} pcs • {myLeaderboardEntry.foodDonatedGrams}g food
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-[#A32801] hover:bg-[#882100] text-white font-bold text-[10px] cursor-pointer shadow-xs"
                  >
                    + Recycle More
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB 4: SHELTERS                                                 */}
            {/* =============================================================== */}
            {activeTab === "shelters" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#143b2f]">
                    Partner Animal Shelters
                  </h3>
                  <span className="text-xs text-slate-400">
                    {shelters.length} partners
                  </span>
                </div>

                <div className="space-y-3">
                  {shelters.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedShelterId(s.id)}
                      className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-[#143b2f]">{s.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{s.location}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                          {s.animalCount.cats + s.animalCount.dogs} Strays Cared
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {s.about}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">
                          Donated through PetCycle: <strong className="text-emerald-700">{(s.totalFoodReceivedGrams / 1000).toFixed(0)} kg</strong>
                        </span>
                        <span className="text-[#00B46B] font-bold text-[11px]">View Shelter →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB 5: PROFILE                                                  */}
            {/* =============================================================== */}
            {activeTab === "profile" && (
              <div className="space-y-4 animate-fadeIn">
                {/* User Info Header */}
                <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#143b2f] text-[#daf2ea] flex items-center justify-center font-extrabold text-base ring-2 ring-[#00B46B]/20 overflow-hidden shrink-0">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#143b2f]">{currentUser?.name || "Juan Dela Cruz"}</h3>
                    <div className="text-xs text-[#A32801] font-semibold">Community Recycler</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentUser?.email || "juan.recycler@gmail.com"}
                    </div>
                  </div>
                </div>

                {/* Personal Contribution Timeline */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Your Recent Deposits</span>
                    <span className="text-[10px] text-slate-400">Chronological logs</span>
                  </div>

                  <div className="space-y-2">
                    {myTransactions.slice(0, 4).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-700">
                            1 {tx.itemType === "bottle" ? "Plastic Bottle" : "Aluminum Can"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {tx.timestamp} @ {tx.machineCode}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-emerald-700">+{tx.foodDispensedGrams}g</span>
                          <span className="block text-[9px] text-slate-400">to {tx.foodType} bowl</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recycling Tips & Guidelines */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>How to Use PetCycle</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>Remove liquid from plastic bottles before inserting.</li>
                    <li>Both plastic PET bottles (up to 1.5L) and aluminum cans are accepted.</li>
                    <li>Every accepted item automatically dispenses food to shelter bowls!</li>
                  </ul>
                </div>

                {/* Log Out */}
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-2xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of PetCycle</span>
                </button>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* BOTTOM TAB BAR (5 Tabs)                                         */}
          {/* =============================================================== */}
          <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shrink-0 z-20">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "home" ? "text-[#00B46B] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setActiveTab("machines")}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "machines" ? "text-[#00B46B] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px]">Machines</span>
            </button>

            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "leaderboard" ? "text-[#00B46B] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-[10px]">Ranks</span>
            </button>

            <button
              onClick={() => setActiveTab("shelters")}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "shelters" ? "text-[#00B46B] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <HeartHandshake className="w-5 h-5" />
              <span className="text-[10px]">Shelters</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "profile" ? "text-[#00B46B] font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </nav>

          {/* =============================================================== */}
          {/* MODAL: Interactive Recycle Deposit Simulator                     */}
          {/* =============================================================== */}
          {isDepositModalOpen && (
            <div
              className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setIsDepositModalOpen(false)}
            >
              <div
                className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-[#143b2f]">Deposit Recyclable Item</h3>
                  <button
                    onClick={() => setIsDepositModalOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {depositSuccessMsg ? (
                  <div className="py-6 text-center space-y-2 animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-[#00B46B] mx-auto animate-bounce" />
                    <p className="text-xs font-bold text-slate-800">{depositSuccessMsg}</p>
                    <p className="text-[11px] text-slate-500">Impact recorded on shelter telemetry.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSimulatedDeposit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Item to Deposit</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDepositItemType("bottle")}
                          className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                            depositItemType === "bottle"
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          Bottle (PET)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDepositItemType("can")}
                          className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                            depositItemType === "can"
                              ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          Aluminum Can
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Target Feeding Bowl</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDepositFoodChoice("cat")}
                          className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                            depositFoodChoice === "cat"
                              ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          Cat Food (20g)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDepositFoodChoice("dog")}
                          className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                            depositFoodChoice === "dog"
                              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          Dog Food (30g)
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#daf2ea] text-[11px] text-[#143b2f] border border-[#164e3f]/20">
                      Machine: <strong>{nearestMachine.name}</strong> • AI Optical camera validates sorting.
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[#A32801] hover:bg-[#882100] text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Confirm Drop Item
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
