"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { usePetCycleStore } from "@/lib/store";
import { MachineData } from "@/lib/types";
import {
  Building2,
  Cpu,
  Boxes,
  BarChart3,
  Bell,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  Search,
  MapPin,
  ChevronRight,
  X,
  FileSpreadsheet,
} from "lucide-react";

export default function SuperadminDashboardPage() {
  const {
    currentUser,
    machines,
    shelters,
    alerts,
    transactions,
    leaderboard,
    resolveAlert,
  } = usePetCycleStore();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);

  // Filters
  const [shelterFilter, setShelterFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Aggregate stats across all machines
  const totalBottles = machines.reduce((acc, m) => acc + m.bottlesCurrent, 0);
  const totalCans = machines.reduce((acc, m) => acc + m.cansCurrent, 0);
  const totalCatFoodDispensed = machines.reduce(
    (acc, m) => acc + (m.catFoodCapacityGrams - m.catFoodCurrentGrams),
    0
  );
  const totalDogFoodDispensed = machines.reduce(
    (acc, m) => acc + (m.dogFoodCapacityGrams - m.dogFoodCurrentGrams),
    0
  );

  const activeMachinesCount = machines.filter((m) => m.status === "online").length;
  const warningMachinesCount = machines.filter((m) => m.status === "warning").length;
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  // Metadata per tab
  const tabMetadata: Record<string, { title: string; desc: string }> = {
    dashboard: {
      title: "Network Operational Summary",
      desc: "Real-time telemetry, recycling totals, and food bank levels across all PetCycle machines.",
    },
    machines: {
      title: "Machine Status Overview",
      desc: "Live status, connectivity, and activity of every PetCycle reverse vending machine, by shelter and location.",
    },
    inventory: {
      title: "Inventory and Storage Levels",
      desc: "Bin capacity and pet food stock across all machines, with alerts for full bins and low or expiring food.",
    },
    analytics: {
      title: "Analytics and Reports",
      desc: "Recycling trends, donation leaderboards, and predictions, with exportable reports for LGUs and partners.",
    },
    notifications: {
      title: "System Notifications",
      desc: "Alerts on low food, expiring stock, full bins, and offline machines across the network.",
    },
    profile: {
      title: "Account Profile",
      desc: "View and manage your account details and preferences.",
    },
  };

  const currentMeta = tabMetadata[activeTab] || tabMetadata.dashboard;

  // Filter machines
  const filteredMachines = machines.filter((m) => {
    if (shelterFilter !== "all" && m.shelterId !== shelterFilter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (
      searchQuery &&
      !m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout
      role="superadmin"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      headerTitle={currentMeta.title}
      headerDescription={currentMeta.desc}
    >
      {/* ===================================================================== */}
      {/* TAB 1: DASHBOARD (Network Operational Summary)                         */}
      {/* ===================================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-fadeIn">
          {/* LGU Fleet Status Strip */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-800">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Metro Manila Eco-Network • LGU Central Dashboard
                </div>
                <div className="text-[11px] text-slate-500">
                  {machines.length} Units Active across Quezon City, Makati, Pasig, and Tarlac Sanctuaries
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● {activeMachinesCount} Online
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                ▲ {warningMachinesCount} Maintenance / Refill
              </span>
            </div>
          </div>

          {/* 4 Network KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Network Bottles
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1">
                {totalBottles.toLocaleString()}{" "}
                <span className="text-sm font-semibold text-slate-400">pcs</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Across {machines.length} RVM Units
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Network Cans
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#EC4899] mt-1">
                {totalCans.toLocaleString()}{" "}
                <span className="text-sm font-semibold text-slate-400">pcs</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                100% Sorted by Inductive Sensors
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Cat Food Dispensed
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F97316] mt-1">
                {(totalCatFoodDispensed / 1000).toFixed(1)}{" "}
                <span className="text-sm font-semibold text-slate-400">kg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Donated to Partner Shelters
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Dog Food Dispensed
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] mt-1">
                {(totalDogFoodDispensed / 1000).toFixed(1)}{" "}
                <span className="text-sm font-semibold text-slate-400">kg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Supporting Stray Feeding Programs
              </div>
            </div>
          </div>

          {/* Network Alerts & Recent Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Alerts Across Network */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#143b2f]">
                  Open Alerts Across Network
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {unresolvedAlerts.length} Action Needed
                </span>
              </div>

              <div className="space-y-3">
                {unresolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{alert.title}</div>
                      <div className="text-slate-600 text-[11px] mt-0.5">{alert.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        {alert.machineCode} • {alert.shelterName} • {alert.timestamp}
                      </div>
                    </div>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-[11px] font-semibold shrink-0 cursor-pointer"
                    >
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* City-Wide Recent Activity Feed */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#143b2f]">
                  Recent Activity Feed
                </h3>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className="text-xs text-[#00B46B] font-semibold hover:underline"
                >
                  View All Logs →
                </button>
              </div>

              <div className="space-y-2.5">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${tx.itemType === "bottle" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                          }`}
                      >
                        {tx.itemType === "bottle" ? "PET" : "CAN"}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {tx.userDisplayName} @ {tx.machineCode}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {tx.shelterName} • {tx.timestamp}
                        </div>
                      </div>
                    </div>

                    <span className="font-bold text-emerald-700 text-xs">
                      +{tx.foodDispensedGrams}g food
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: MACHINE MONITORING (List, Filter, Detail Drawer)                */}
      {/* ===================================================================== */}
      {activeTab === "machines" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machine by code, location, or shelter..."
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={shelterFilter}
                onChange={(e) => setShelterFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">All Shelters</option>
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="online">Online</option>
                <option value="warning">Warning / Refill</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Machines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMachines.map((m) => {
              const bottlePct = Math.round((m.bottlesCurrent / m.bottlesCapacity) * 100);
              const canPct = Math.round((m.cansCurrent / m.cansCapacity) * 100);
              const catFoodPct = Math.round((m.catFoodCurrentGrams / m.catFoodCapacityGrams) * 100);
              const dogFoodPct = Math.round((m.dogFoodCurrentGrams / m.dogFoodCapacityGrams) * 100);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMachine(m)}
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#143b2f]">{m.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {m.code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.location}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${m.status === "online"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      ● {m.status}
                    </span>
                  </div>

                  {/* Micro Progress Bars */}
                  <div className="grid grid-cols-4 gap-2 mt-4 text-[10px] text-slate-500">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>PET</span>
                        <span className="font-semibold">{bottlePct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${bottlePct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>CAN</span>
                        <span className="font-semibold">{canPct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-600" style={{ width: `${canPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>CAT</span>
                        <span className="font-semibold">{catFoodPct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${catFoodPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>DOG</span>
                        <span className="font-semibold">{dogFoodPct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600" style={{ width: `${dogFoodPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Host: {m.shelterName}</span>
                    <span className="text-[#00B46B] font-semibold group-hover:underline flex items-center">
                      View Detail <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Machine Detail Side Drawer */}
          {selectedMachine && (
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
              onClick={() => setSelectedMachine(null)}
            >
              <div
                className="w-full max-w-md bg-white h-full p-6 shadow-2xl overflow-y-auto space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{selectedMachine.code}</span>
                    <h3 className="text-lg font-bold text-[#143b2f]">{selectedMachine.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedMachine(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <div><strong>Shelter Host:</strong> {selectedMachine.shelterName}</div>
                  <div><strong>Location:</strong> {selectedMachine.address}</div>
                  <div><strong>IP Address:</strong> {selectedMachine.ipAddress}</div>
                  <div><strong>Wi-Fi Signal:</strong> {selectedMachine.wifiSignal}</div>
                  <div><strong>Status:</strong> <span className="capitalize font-semibold text-emerald-700">{selectedMachine.status}</span></div>
                </div>

                {/* Sensors */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-800">Hardware Sensor Array (ESP32)</div>
                  <div className="flex justify-between"><span>Ultrasonic Sensor:</span> <span className="text-emerald-700 font-semibold">Healthy</span></div>
                  <div className="flex justify-between"><span>AI Classification Camera:</span> <span className="text-emerald-700 font-semibold">Healthy</span></div>
                  <div className="flex justify-between"><span>Load Cell:</span> <span className="text-emerald-700 font-semibold">Calibrated</span></div>
                  <div className="flex justify-between"><span>Servo Dispenser:</span> <span className="text-emerald-700 font-semibold">Normal</span></div>
                </div>

                {/* Storage Levels */}
                <div className="space-y-3 text-xs">
                  <div className="font-bold text-slate-800">Compartment Fill Levels</div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Plastic Bottles</span>
                      <span>{selectedMachine.bottlesCurrent} / {selectedMachine.bottlesCapacity} pcs</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${(selectedMachine.bottlesCurrent / selectedMachine.bottlesCapacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Aluminum Cans</span>
                      <span>{selectedMachine.cansCurrent} / {selectedMachine.cansCapacity} pcs</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-600"
                        style={{ width: `${(selectedMachine.cansCurrent / selectedMachine.cansCapacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Cat Food Hopper</span>
                      <span>{selectedMachine.catFoodCurrentGrams} / {selectedMachine.catFoodCapacityGrams} g</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: `${(selectedMachine.catFoodCurrentGrams / selectedMachine.catFoodCapacityGrams) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Dog Food Hopper</span>
                      <span>{selectedMachine.dogFoodCurrentGrams} / {selectedMachine.dogFoodCapacityGrams} g</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{ width: `${(selectedMachine.dogFoodCurrentGrams / selectedMachine.dogFoodCapacityGrams) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-500 text-center">
                  Read-Only Network Mode. Maintenance actions are handled by assigned Shelter Staff.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: INVENTORY AND STORAGE (Multi-machine inventory levels)          */}
      {/* ===================================================================== */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-[#143b2f] mb-1">Fleet Inventory & Storage Capacity</h2>
            <p className="text-xs text-slate-500 mb-5">
              Live capacity and food inventory across all reverse vending machines in Metro Manila
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-700 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Machine Code</th>
                    <th className="py-3 px-4">Shelter Host</th>
                    <th className="py-3 px-4">Bottle Bin (Blue)</th>
                    <th className="py-3 px-4">Can Bin (Pink)</th>
                    <th className="py-3 px-4">Cat Food (Orange)</th>
                    <th className="py-3 px-4">Dog Food (Purple)</th>
                    <th className="py-3 px-4">Alert Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {machines.map((m) => {
                    const bottlePct = Math.round((m.bottlesCurrent / m.bottlesCapacity) * 100);
                    const canPct = Math.round((m.cansCurrent / m.cansCapacity) * 100);
                    const catPct = Math.round((m.catFoodCurrentGrams / m.catFoodCapacityGrams) * 100);
                    const dogPct = Math.round((m.dogFoodCurrentGrams / m.dogFoodCapacityGrams) * 100);

                    return (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800">{m.code}</td>
                        <td className="py-3 px-4 font-sans">{m.shelterName}</td>
                        <td className="py-3 px-4">
                          <span className={bottlePct > 90 ? "text-rose-600 font-bold" : ""}>
                            {m.bottlesCurrent}/{m.bottlesCapacity} ({bottlePct}%)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={canPct > 90 ? "text-rose-600 font-bold" : ""}>
                            {m.cansCurrent}/{m.cansCapacity} ({canPct}%)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={catPct < 25 ? "text-amber-600 font-bold" : ""}>
                            {m.catFoodCurrentGrams}g ({catPct}%)
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span>{m.dogFoodCurrentGrams}g ({dogPct}%)</span>
                        </td>
                        <td className="py-3 px-4 font-sans">
                          {catPct < 25 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Low Cat Food
                            </span>
                          ) : bottlePct > 90 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              Bin Near Full
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Healthy
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: ANALYTICS AND REPORTS (Predictions, Leaderboard, Export)        */}
      {/* ===================================================================== */}
      {activeTab === "analytics" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Export Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#143b2f]">LGU & Partner Report Generation</h3>
              <p className="text-xs text-slate-500">Download formatted sustainability records for environmental compliance</p>
            </div>
            <button
              onClick={() => alert("Downloaded: Metro_Manila_PetCycle_Consolidated_Report.csv")}
              className="px-4 py-2 rounded-xl bg-[#00B46B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV (All Transactions)</span>
            </button>
          </div>

          {/* AI Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recycling Bin Fill Forecast
              </span>
              <div className="text-xl font-bold text-slate-800">
                Machine PC-TRL-04 reaches 100% capacity in ~14 hours
              </div>
              <p className="text-xs text-slate-500">
                Prediction model trained on hourly deposit frequency. Collection truck dispatch recommended for tomorrow morning.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pet Food Depletion Forecast
              </span>
              <div className="text-xl font-bold text-slate-800">
                Machine PC-QC-01 Cat Food Hopper empty in ~22 hours
              </div>
              <p className="text-xs text-slate-500">
                Current burn rate: 42g/hour. Shelter alert has been dispatched to PAWS caretakers.
              </p>
            </div>
          </div>

          {/* Network-wide Leaderboard */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#143b2f]">
              Metro Manila Community Donation Leaderboard
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-700 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Rank</th>
                    <th className="py-2.5 px-4">Contributor</th>
                    <th className="py-2.5 px-4">Items Recycled</th>
                    <th className="py-2.5 px-4">Pet Food Donated</th>
                    <th className="py-2.5 px-4">Supported Shelter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">#{entry.rank}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{entry.displayName}</td>
                      <td className="py-2.5 px-4">{entry.itemsRecycled} pcs</td>
                      <td className="py-2.5 px-4 font-bold text-emerald-700">{entry.foodDonatedGrams}g</td>
                      <td className="py-2.5 px-4">{entry.shelterSupported}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: NOTIFICATIONS                                                  */}
      {/* ===================================================================== */}
      {activeTab === "notifications" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn">
          <h2 className="text-lg font-bold text-[#143b2f]">Network System Notifications</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{alert.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Unit: {alert.machineCode} • Shelter: {alert.shelterName}
                  </div>
                </div>

                {!alert.resolved ? (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 cursor-pointer shrink-0"
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resolved
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: PROFILE                                                        */}
      {/* ===================================================================== */}
      {activeTab === "profile" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn max-w-xl">
          <h2 className="text-lg font-bold text-[#143b2f]">Account Profile & LGU Preferences</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Official Name</label>
              <input
                type="text"
                readOnly
                defaultValue="Dir. Elena Ramos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Department</label>
              <input
                type="text"
                readOnly
                defaultValue="LGU Environmental Management Bureau (EMB)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Email</label>
              <input
                type="email"
                readOnly
                defaultValue="superadmin@petcycle.gov.ph"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
