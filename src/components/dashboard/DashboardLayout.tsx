"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Boxes,
  BarChart3,
  Bell,
  User,
  Trash2,
  Receipt,
  HeartHandshake,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  ChevronRight,
} from "lucide-react";
import PetCycleLogo from "@/components/PetCycleLogo";
import { usePetCycleStore } from "@/lib/store";

export interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface DashboardLayoutProps {
  role: "superadmin" | "shelter";
  activeTab: string;
  onTabChange: (tabId: string) => void;
  headerTitle: string;
  headerDescription: string;
  children: React.ReactNode;
}

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

export default function DashboardLayout({
  role,
  activeTab,
  onTabChange,
  headerTitle,
  headerDescription,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { currentUser, alerts, logout } = usePetCycleStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unresolvedAlertsCount = alerts.filter((a) => !a.resolved).length;
  const displayName =
    currentUser?.name || (role === "superadmin" ? "Dir. Elena Ramos" : "Sarah Jenkins");
  const displayRoleTitle =
    role === "superadmin"
      ? "LGU Network Overseer"
      : currentUser?.shelterName || "Shelter Admin";
  const userInitials = getInitials(displayName);

  const superadminNavItems: NavItem[] = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "machines", name: "Machine Monitoring", icon: Cpu },
    { id: "inventory", name: "Inventory & Storage", icon: Boxes },
    { id: "analytics", name: "Analytics & Reports", icon: BarChart3 },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : undefined,
    },
    { id: "profile", name: "Profile", icon: User },
  ];

  const shelterNavItems: NavItem[] = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "machine", name: "My Machine", icon: Cpu },
    { id: "inventory", name: "Pet Food Inventory", icon: Boxes },
    { id: "collection", name: "Bin Collection", icon: Trash2 },
    { id: "transactions", name: "Transactions", icon: Receipt },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : undefined,
    },
    { id: "reports", name: "Reports & Analytics", icon: BarChart3 },
    { id: "shelter-profile", name: "Shelter Profile", icon: HeartHandshake },
  ];

  const navItems = role === "superadmin" ? superadminNavItems : shelterNavItems;

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 w-full">
      <div className="flex-1 flex overflow-hidden w-full">
        {/* 2. Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 shrink-0">
          {/* Brand Header using exact PetCycleLogo with Atma font & brand gradient */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center">
            <Link href="/" className="group flex items-center">
              <PetCycleLogo size="md" />
            </Link>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#143b2f] text-white shadow-sm border-l-4 border-[#A32801]"
                      : "text-slate-600 hover:text-[#143b2f] hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#00B46B]" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-[#00B46B] text-[#143b2f]"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#A32801] hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Console</span>
            </button>
          </div>
        </aside>

        {/* 3. Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden backdrop-blur-xs flex"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-72 bg-white h-full p-4 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <PetCycleLogo size="sm" />
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                          isActive
                            ? "bg-[#143b2f] text-white border-l-4 border-[#A32801]"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isActive ? "text-[#00B46B]" : ""}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#A32801] hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Main Content Area - Maximized Full Width without artificial restrictions */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
          {/* Top Bar with Header */}
          <header className="bg-white border-b border-slate-200 px-5 sm:px-8 lg:px-12 py-5 shrink-0 flex items-center justify-between flex-wrap gap-4 w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="font-semibold text-[#143b2f]">PetCycle System</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="capitalize text-slate-600 font-semibold">{activeTab.replace("-", " ")}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#143b2f] tracking-tight mt-0.5">
                  {headerTitle}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {headerDescription}
                </p>
              </div>
            </div>

            {/* Quick Status Pill, Notifications & Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-[#daf2ea] border border-[#164e3f]/20 text-[#143b2f] px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#00B46B] animate-ping" />
                <span>Live IoT Cloud Stream</span>
              </div>

              {/* Notification Bell Icon */}
              <button
                onClick={() => onTabChange("notifications")}
                className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unresolvedAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A32801] text-white text-[9px] font-bold flex items-center justify-center">
                    {unresolvedAlertsCount}
                  </span>
                )}
              </button>

              {/* Profile Beside Notification Bell */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                {/* Circle Avatar with Initials */}
                <div className="w-9 h-9 rounded-full bg-[#143b2f] text-[#daf2ea] font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0 ring-2 ring-[#00B46B]/20">
                  {userInitials}
                </div>

                {/* Name & Role (replacing email) */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-semibold text-[#A32801] leading-tight">
                    {displayRoleTitle}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Children View Content - Maximized fluid width */}
          <main className="flex-1 p-5 sm:p-8 lg:p-10 w-full min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
