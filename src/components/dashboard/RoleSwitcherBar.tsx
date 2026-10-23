"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { usePetCycleStore } from "@/lib/store";
import { Building2, ShieldCheck, User, LogOut, Home, RefreshCw } from "lucide-react";
import { UserRole } from "@/lib/types";

export default function RoleSwitcherBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, currentRole, loginAs, logout } = usePetCycleStore();

  const handleSwitch = (role: UserRole) => {
    loginAs(role);
    if (role === "superadmin") {
      router.push("/dashboard/superadmin");
    } else if (role === "shelter") {
      router.push("/dashboard/shelter");
    } else {
      router.push("/app");
    }
  };

  const routeRole: UserRole | null = pathname.includes("/dashboard/superadmin")
    ? "superadmin"
    : pathname.includes("/dashboard/shelter")
    ? "shelter"
    : pathname.startsWith("/app")
    ? "user"
    : currentRole;

  React.useEffect(() => {
    if (routeRole && routeRole !== currentRole) {
      loginAs(routeRole);
    }
  }, [routeRole, currentRole, loginAs]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="bg-slate-900 text-white text-xs px-3 sm:px-6 py-2 border-b border-slate-800 sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2 shadow-sm">
      {/* Current Role Identity */}
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-300">Active View:</span>
        <span
          className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] ${currentRole === "superadmin"
              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
              : currentRole === "shelter"
                ? "bg-amber-950 text-amber-300 border border-amber-800"
                : "bg-blue-950 text-blue-300 border border-blue-800"
            }`}
        >
          {currentRole === "superadmin"
            ? "Superadmin (LGU)"
            : currentRole === "shelter"
              ? "Shelter Admin (PAWS)"
              : "Community User (Mobile)"}
        </span>
        <span className="hidden sm:inline text-slate-400">
          • {currentUser?.name || "Demo User"}
        </span>
      </div>

      {/* Role Switcher Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="hidden md:inline text-[11px] text-slate-400 mr-1">Switch Role:</span>

        <button
          onClick={() => handleSwitch("superadmin")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${pathname.includes("/dashboard/superadmin")
              ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Superadmin</span>
        </button>

        <button
          onClick={() => handleSwitch("shelter")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${pathname.includes("/dashboard/shelter")
              ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Shelter Admin</span>
        </button>

        <button
          onClick={() => handleSwitch("user")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${pathname.startsWith("/app")
              ? "bg-blue-500 text-slate-950 font-bold shadow-sm"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Community App</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <Link
          href="/"
          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
          title="Return to Public Website"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing</span>
        </Link>

        <button
          onClick={handleLogout}
          className="px-2 py-1 rounded-lg hover:bg-red-950/80 hover:text-red-300 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
