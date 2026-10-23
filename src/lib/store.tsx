"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthUser,
  UserRole,
  MachineData,
  ShelterData,
  SystemAlert,
  TransactionItem,
  LeaderboardEntry,
} from "./types";
import {
  DEMO_USERS,
  INITIAL_MACHINES,
  INITIAL_SHELTERS,
  INITIAL_ALERTS,
  INITIAL_TRANSACTIONS,
  INITIAL_LEADERBOARD,
} from "./mock-data";

interface PetCycleStoreContextType {
  currentUser: AuthUser | null;
  currentRole: UserRole | null;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  // Data
  machines: MachineData[];
  shelters: ShelterData[];
  alerts: SystemAlert[];
  transactions: TransactionItem[];
  leaderboard: LeaderboardEntry[];
  // Actions
  refillFood: (
    machineId: string,
    foodType: "cat" | "dog",
    gramsAdded: number,
    expiryDate: string
  ) => void;
  collectBin: (machineId: string, binType: "bottles" | "cans" | "both") => void;
  resolveAlert: (alertId: string) => void;
  depositItem: (
    machineId: string,
    itemType: "bottle" | "can",
    foodType: "cat" | "dog"
  ) => void;
}

const PetCycleStoreContext = createContext<PetCycleStoreContextType | undefined>(
  undefined
);

const STORAGE_KEY_AUTH = "petcycle_auth_user_v1";

export function PetCycleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [machines, setMachines] = useState<MachineData[]>(INITIAL_MACHINES);
  const [shelters, setShelters] = useState<ShelterData[]>(INITIAL_SHELTERS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [transactions, setTransactions] = useState<TransactionItem[]>(
    INITIAL_TRANSACTIONS
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(
    INITIAL_LEADERBOARD
  );

  // Restore stored session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        setCurrentUser(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const loginAs = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      } catch {}
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
  };

  // Operational Action 1: Refill Pet Food
  const refillFood = (
    machineId: string,
    foodType: "cat" | "dog",
    gramsAdded: number,
    expiryDate: string
  ) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;
        if (foodType === "cat") {
          const newAmount = Math.min(
            m.catFoodCapacityGrams,
            m.catFoodCurrentGrams + gramsAdded
          );
          return {
            ...m,
            catFoodCurrentGrams: newAmount,
            catFoodExpiryDate: expiryDate || m.catFoodExpiryDate,
            lastSync: "Just now",
            status:
              newAmount / m.catFoodCapacityGrams > 0.3
                ? m.bottlesCurrent / m.bottlesCapacity < 0.9
                  ? "online"
                  : "warning"
                : "warning",
          };
        } else {
          const newAmount = Math.min(
            m.dogFoodCapacityGrams,
            m.dogFoodCurrentGrams + gramsAdded
          );
          return {
            ...m,
            dogFoodCurrentGrams: newAmount,
            dogFoodExpiryDate: expiryDate || m.dogFoodExpiryDate,
            lastSync: "Just now",
          };
        }
      })
    );

    // Auto-resolve corresponding alert if any
    setAlerts((prev) =>
      prev.map((a) =>
        a.machineId === machineId && a.type === "low_food"
          ? { ...a, resolved: true }
          : a
      )
    );
  };

  // Operational Action 2: Collect Recyclable Bins
  const collectBin = (
    machineId: string,
    binType: "bottles" | "cans" | "both"
  ) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;
        return {
          ...m,
          bottlesCurrent:
            binType === "bottles" || binType === "both" ? 0 : m.bottlesCurrent,
          cansCurrent:
            binType === "cans" || binType === "both" ? 0 : m.cansCurrent,
          lastSync: "Just now",
          status:
            m.catFoodCurrentGrams / m.catFoodCapacityGrams > 0.2
              ? "online"
              : "warning",
        };
      })
    );

    // Auto-resolve bin_full alert
    setAlerts((prev) =>
      prev.map((a) =>
        a.machineId === machineId && a.type === "bin_full"
          ? { ...a, resolved: true }
          : a
      )
    );
  };

  // Operational Action 3: Resolve Alert
  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  // Operational Action 4: Real-time Deposit
  const depositItem = (
    machineId: string,
    itemType: "bottle" | "can",
    foodType: "cat" | "dog"
  ) => {
    const dispensedGrams = itemType === "bottle" ? 20 : 30;

    // 1. Update Machine state
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== machineId) return m;
        const newBottles =
          itemType === "bottle" ? m.bottlesCurrent + 1 : m.bottlesCurrent;
        const newCans =
          itemType === "can" ? m.cansCurrent + 1 : m.cansCurrent;
        const newCatFood =
          foodType === "cat"
            ? Math.max(0, m.catFoodCurrentGrams - dispensedGrams)
            : m.catFoodCurrentGrams;
        const newDogFood =
          foodType === "dog"
            ? Math.max(0, m.dogFoodCurrentGrams - dispensedGrams)
            : m.dogFoodCurrentGrams;

        return {
          ...m,
          bottlesCurrent: newBottles,
          cansCurrent: newCans,
          catFoodCurrentGrams: newCatFood,
          dogFoodCurrentGrams: newDogFood,
          lastSync: "Just now",
        };
      })
    );

    // 2. Add Transaction
    const machine = machines.find((m) => m.id === machineId);
    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      machineId,
      machineCode: machine?.code || "PC-DEV",
      shelterId: machine?.shelterId || "shelter-paws",
      shelterName: machine?.shelterName || "PAWS Animal Rehabilitation",
      userDisplayName: currentUser?.name || "Juan D.",
      itemType,
      status: "accepted",
      foodDispensedGrams: dispensedGrams,
      foodType,
      timestamp: "Just now",
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 3. Update User on Leaderboard
    setLeaderboard((prev) =>
      prev.map((entry) =>
        entry.isCurrentUser
          ? {
              ...entry,
              itemsRecycled: entry.itemsRecycled + 1,
              foodDonatedGrams: entry.foodDonatedGrams + dispensedGrams,
            }
          : entry
      )
    );
  };

  return (
    <PetCycleStoreContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        loginAs,
        logout,
        machines,
        shelters,
        alerts,
        transactions,
        leaderboard,
        refillFood,
        collectBin,
        resolveAlert,
        depositItem,
      }}
    >
      {children}
    </PetCycleStoreContext.Provider>
  );
}

export function usePetCycleStore() {
  const context = useContext(PetCycleStoreContext);
  if (!context) {
    throw new Error(
      "usePetCycleStore must be used within a PetCycleProvider"
    );
  }
  return context;
}
