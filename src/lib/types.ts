export type UserRole = "superadmin" | "shelter" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  shelterId?: string;
  shelterName?: string;
  agency?: string;
}

export interface MachineData {
  id: string;
  name: string;
  code: string;
  shelterId: string;
  shelterName: string;
  location: string;
  address: string;
  distanceKm?: number;
  status: "online" | "warning" | "offline" | "maintenance";
  lastSync: string;
  ipAddress: string;
  wifiSignal: string;
  bottlesCurrent: number;
  bottlesCapacity: number;
  cansCurrent: number;
  cansCapacity: number;
  catFoodCurrentGrams: number;
  catFoodCapacityGrams: number;
  dogFoodCurrentGrams: number;
  dogFoodCapacityGrams: number;
  catFoodExpiryDate: string;
  dogFoodExpiryDate: string;
  sensors: {
    ultrasonic: "healthy" | "check";
    camera: "healthy" | "check";
    loadCell: "healthy" | "check";
    dispenserMotor: "healthy" | "check";
  };
}

export interface TransactionItem {
  id: string;
  machineId: string;
  machineCode: string;
  shelterId: string;
  shelterName: string;
  userDisplayName: string;
  itemType: "bottle" | "can";
  status: "accepted" | "rejected";
  foodDispensedGrams: number;
  foodType: "cat" | "dog";
  timestamp: string;
}

export interface ShelterData {
  id: string;
  name: string;
  location: string;
  contact: string;
  email: string;
  animalCount: {
    cats: number;
    dogs: number;
  };
  urgentNeeds: string[];
  totalFoodReceivedGrams: number;
  totalRecycledItems: number;
  image: string;
  about: string;
}

export interface SystemAlert {
  id: string;
  machineId: string;
  machineCode: string;
  shelterName: string;
  type: "low_food" | "bin_full" | "expiring_stock" | "offline";
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  resolved: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  itemsRecycled: number;
  foodDonatedGrams: number;
  shelterSupported: string;
  isCurrentUser?: boolean;
}
