# PetCycle: System Reference

An IoT-enabled, reward-based recycling system for urban waste management and pet food dispensing.

> **Tagline:** Recycle waste → pet food reward → animal welfare

This document is a working reference for building the PetCycle web dashboards and mobile app. It covers why the project exists, what it must do, and what each user role sees and does.

---

## 1. Project Description

PetCycle is a reverse vending machine. A person inserts a plastic bottle or a tin can, and the machine checks it with a camera and sensors. If the item is valid, the machine dispenses cat or dog food as a reward. That food goes to animal shelters.

Every transaction is recorded and sent to the cloud. Shelter staff and system monitors then follow recycling activity, pet food levels, and bin capacity through a web dashboard. Community users follow machine locations, shelters, and the leaderboard through a mobile app.

### The problem it addresses

| Problem | Details |
|---|---|
| **Plastic and can waste** | Only about 9% of plastic is formally recycled in the Philippines. Much of the rest ends up on streets, in landfills, and in waterways. |
| **Animal shelter shortages** | Shelters face food shortages (especially cat food), cannot take in more strays, and care for malnourished animals. |
| **Two separate problems** | Waste management and animal welfare are usually handled separately. PetCycle links them. |

### Who benefits

Sheltered and pet animals, the community, animal welfare and environmental organizations, LGUs, and researchers.

---

## 2. Project Objectives

### General objective

Develop PetCycle to motivate responsible disposal of recyclable plastic bottles and tin cans, using pet food as a reward, while providing data through web and mobile applications.

### Specific objectives

1. Build an automated recycling machine using cameras and sensors.
2. Monitor machine activity and status in real time.
3. Develop a web dashboard for recycling, pet food, and bin monitoring.
4. Generate reports and predictions from collected data.
5. Implement automated notifications for important machine conditions.

---

## 3. How the System Works

```
1. INSERT      User inserts a plastic bottle or tin can
2. VALIDATE    AI camera and sensors check the item
3. ACCEPT or REJECT   Valid items continue, invalid items are rejected
4. GAIN POINTS Accepted items earn points (handled inside the machine)
5. REDEEM      Points are exchanged for cat or dog food
6. RECORD      Transaction and machine data are stored
7. MONITOR     The dashboard receives updated information
8. ANALYZE     The system generates statistics, predictions, and notifications
```

### System layers

| Layer | Parts | Role |
|---|---|---|
| **Machine and IoT** | Raspberry Pi, ESP32, camera, ultrasonic, infrared and inductive proximity sensors, servo and stepper motors, LCD | Validates items, sorts them, dispenses food, sends logs over Wi-Fi |
| **Data and cloud** | Supabase (Auth and API), PostgreSQL | Stores transactions and telemetry, handles login |
| **Presentation** | Next.js web dashboard, mobile app, machine LCD | Where people view data and status |

---

## 4. User Roles at a Glance

| Role | Who | Platform | Main purpose |
|---|---|---|---|
| **Superadmin** | System owner and LGU-level overseer | Web dashboard | Monitor the whole network (read-only) |
| **Admin** | Animal shelter staff | Web dashboard | Run day-to-day operations for their own shelter and machine |
| **User** | Community member who recycles | Mobile app | Find machines, see shelters, view the leaderboard and their own contributions |

### Feature access matrix

| Feature | Superadmin | Admin (shelter) | User |
|---|:---:|:---:|:---:|
| Overall dashboard | All machines | Own machine | Home summary |
| Machine status | All machines | Own machine | Nearby machines (public view) |
| Bin and food inventory | All machines | Own machine (can mark refilled or collected) | - |
| Transactions | All (read-only) | Own machine | Own history only |
| Analytics and predictions | Network-wide | Own machine | - |
| Reports (export) | Yes | Yes | - |
| Notifications and alerts | Network-wide | Own machine | Basic updates |
| Leaderboard | Network-wide | Widget on dashboard | Full leaderboard |
| Shelter information | View all | Edit own shelter profile | Browse partner shelters |
| Points earned | Not shown | Transactions only (see Open Decisions) | Not shown |

---

## 5. Shared Rules

These apply across all three roles so the screens stay consistent.

- **Points are not shown to users.** Points still exist inside the machine's logic (they decide how much food is dispensed), but the user-facing app never displays them. Show items and grams of food instead.
- **Leaderboard ranking is by shelter donation.** Rank contributors by total items recycled and food donated to a shelter, never by points.
- **Privacy on the leaderboard.** Show a first name with a last initial or a nickname, never a full name.
- **Units.** Items as `pcs`, food as `g`, bin and hopper levels as `current / capacity`.
- **Status colors.** Green for healthy or online, amber for low or nearly full, red for offline or critical.
- **Item colors (from the dashboard design).** Bottles are blue, cans are pink, cat food is orange, and dog food is purple.
- **Alerts raised by the system.** Pet food is low, pet food is nearing expiration, a bin needs collection, and a machine is offline.

---

## 6. Superadmin

**Purpose:** Monitoring only. The superadmin sees every machine and shelter across the network but does not run operations. The pages are read-only views.

### Sidebar menu

#### 1. Dashboard
- **Header:** Network Operational Summary
- **Description:** Real-time telemetry, recycling totals, and food bank levels across all PetCycle machines.
- **What it shows:**
  - Summary cards: total bottles recycled, cans recycled, cat food dispensed, dog food dispensed
  - Count of active versus offline machines
  - Open alerts across the network
  - Recent activity feed

#### 2. Machine Monitoring
- **Header:** Machine Status Overview
- **Description:** Live status, connectivity, and activity of every PetCycle reverse vending machine, by shelter and location.
- **What it shows:**
  - List and map of all machines with status (online, offline, fault) and last sync time
  - Shelter or location of each machine (filter by shelter)
  - Machine detail view with its own bin levels, food levels, and recent transactions (read-only)

#### 3. Inventory and Storage
- **Header:** Inventory and Storage Levels
- **Description:** Bin capacity and pet food stock across all machines, with alerts for full bins and low or expiring food.
- **What it shows:**
  - Fill level of the plastic bottle bin, aluminum can bin, cat food hopper, and dog food hopper for each machine
  - Machines with low food, full bins, or food nearing expiry highlighted

#### 4. Analytics and Reports
- **Header:** Analytics and Reports
- **Description:** Recycling trends, donation leaderboards, and predictions, with exportable reports for LGUs and partners.
- **What it shows:**
  - Trends by machine and location over time
  - Predictions: when bins will fill and when pet food will run low
  - Network-wide leaderboard (top contributors and top locations)
  - System-wide transactions log (every deposit and dispense)
  - Export of reports for LGUs, researchers, and environmental organizations

#### 5. Notifications
- **Header:** System Notifications
- **Description:** Alerts on low food, expiring stock, full bins, and offline machines across the network.
- **What it shows:**
  - Alert list with type, machine, shelter, time, and read or resolved state
  - Filters by alert type and shelter

#### 6. Profile
- **Header:** Account Profile
- **Description:** View and manage your account details and preferences.
- **What it shows:** Account info, password, and notification preferences.

---

## 7. Admin (Animal Shelter)

**Purpose:** Operations for one shelter and its own machine. This is the person who refills food, collects bins, and watches activity day to day.

### Sidebar menu

#### 1. Dashboard
- **Header:** Today's Operational Summary
- **Description:** Real-time telemetry and food bank levels for [Shelter Name] reverse vending machine.
- **What it shows:**
  - Four summary cards: bottles recycled, cans recycled, cat food dispensed, dog food dispensed
  - **Storage Compartment Fill Levels:** progress bars for the bottle bin, can bin, cat food hopper, and dog food hopper, plus a warning box (for example, "Dog Food Hopper is below 40% capacity. Restock suggested soon.")
  - **Recent Feed Activity Log:** latest deposits and dispenses, with time and machine ID
  - **Leaderboard** (table): top contributors by shelter donation, with a This month / This week / All time filter

#### 2. My Machine
- **Header:** Machine Status
- **Description:** Live status, connectivity, and compartment levels of your reverse vending machine.
- **What it shows:** Machine ID, online status, last sync, per-compartment fill levels, sensor health, and recent activity.

#### 3. Inventory
- **Header:** Pet Food Inventory
- **Description:** Cat and dog food stock, expiry dates, and restocking history.
- **What it shows:**
  - Current cat food and dog food levels
  - Expiry dates of the stock
  - Restock log
  - **Action:** Mark as refilled

#### 4. Bin Collection
- **Header:** Bin Collection
- **Description:** Track which bins are full or nearly full and log each collection.
- **What it shows:**
  - Bottle and can bin levels
  - Bins that need collection
  - Collection history
  - Recycling revenue log (optional)
  - **Action:** Mark as collected

#### 5. Transactions
- **Header:** Transaction History
- **Description:** Every deposit and food dispense at your machine.
- **What it shows:**
  - Date and time, item type, accepted or rejected, food dispensed (in grams)
  - Filters by date and item type
  - A **Points earned** column (see Open Decisions)

#### 6. Notifications
- **Header:** Notifications
- **Description:** Alerts for low food, food nearing expiry, and bins that need collection.
- **What it shows:** Alert list with read and resolved states.

#### 7. Reports and Analytics
- **Header:** Reports and Analytics
- **Description:** Recycling trends, predictions for your next refill and collection, and downloadable reports.
- **What it shows:**
  - Recycling and donation trends
  - Predictions for the next food refill and the next bin collection
  - Summary cards, for example total points issued next to total food dispensed (see Open Decisions)
  - Downloadable reports

#### 8. Shelter Profile
- **Header:** Shelter Profile
- **Description:** Your shelter's details as shown to partners and the community.
- **What it shows:** Shelter name, contact details, animal count, and current needs.

#### Log Out
At the bottom of the sidebar.

---

## 8. User (Mobile App)

**Purpose:** Help community members find machines, see where their donations go, and feel part of the effort. The app focuses on items, food donated, and shelters, never on points.

### Bottom tab bar (5 tabs)

#### 1. Home (house icon)
- Greeting and a short impact summary, for example the total food the shelter received this month
- Nearest machine card with its status and distance
- "Your contribution" card showing bottles, cans, and grams of food donated
- Latest shelter needs or announcements
- Bell icon in the top right that opens notifications

#### 2. Machines (map pin icon)
- Map with pins colored by status (online, bin full, out of service), with a toggle to switch to a list view
- Tapping a pin opens a card with the machine name, location, status, accepted items, whether cat and dog food are available, and a Get directions button

#### 3. Leaderboard (trophy icon)
- Filters for This month, This week, and All time
- Ranked contributors by shelter donation, with display name, total items, and food donated
- The user's own rank pinned at the bottom
- Optional filter by shelter

#### 4. Shelters (paw icon)
- List of partner shelters with photos and animal counts
- Shelter detail page with an About section, current needs (cat food, dog food), how much has been donated through PetCycle, and the machines placed there

#### 5. Profile (user icon)
- Account info and a nickname for the leaderboard
- Personal contribution history (date, item, machine)
- Notification settings
- Help and Learn section: what the machine accepts, how to use it, and recycling tips
- Log out

> If some deposits are allowed without logging in, keep Machines, Shelters, and Leaderboard public. Put "Your contribution" and history behind login.

---

## 9. Open Decisions

Confirm these with your consultants before finalizing screens.

1. **Who can see points?** The consultants said not to show earned points. The assumption here is that this applies to users. If admins should not see points either, remove the **Points earned** column from the shelter Transactions page and the points summary card from Reports.
2. **Leaderboard scope.** This document ranks individuals by shelter donation. Confirm whether it should rank individuals or locations (village, school, barangay).
3. **Anonymous versus account-based users.** The deck's flow shows "anonymous" depositors. If users can deposit without an account, the leaderboard and "Your contribution" only work for logged-in users.
4. **Account management.** The superadmin is read-only. Decide who creates shelter admin accounts. If it is the superadmin, add a single Accounts page.
5. **Activity log wording.** The current dashboard log says "earned 3 pts". Reword to "User deposited 3 Plastic Bottles" if points should stay hidden.
