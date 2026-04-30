# 🎨 Wireframe-Plan: Tour Planner

**Team:** Milutin Kojic & Antonius Said | **Tool:** Draw.io (diagrams.net)
**Datei:** `TourPlanner_Wireframes.drawio` (im selben Ordner)

---

## 📋 Anforderungen aus der Specification (Zitat)

> *"Define your own UI-Design which is capable of providing all required functionality."*
> *"Create a wiremock of your design and add it to the documentation (mandatory)."*

### Funktionale Anforderungen an die UI:
1. **User Registration & Login** mit Credentials
2. **Tour-Liste** (CRUD) mit Name, Description, From, To, Transport Type
3. **Tour-Karte** via Leaflet/OpenRouteService
4. **Tour-Logs** (CRUD) pro Tour: Date/Time, Comment, Difficulty, Distance, Time, Rating
5. **Volltextsuche** ueber Touren & Logs (inkl. computed values)
6. **Computed Attributes:** Popularity, Child-Friendliness
7. **Import/Export** von Tour-Daten
8. **Unique Feature** (unsere Wahl)

---

## 🖥️ Screen-Uebersicht (6 Screens)

| # | Screen | Zweck | Draw.io Page |
|---|--------|-------|--------------|
| 1 | Login / Register | Authentifizierung | Page 1 |
| 2 | Main Dashboard | Tour-Liste + Karte + Suche | Page 2 |
| 3 | Tour Detail | Tour-Info + Karte + Logs-Liste | Page 3 |
| 4 | Add/Edit Tour | Formular fuer Tour-CRUD | Page 4 |
| 5 | Add/Edit Tour Log | Formular fuer Log-CRUD | Page 5 |
| 6 | UI Flow Diagram | Navigation zwischen Screens | Page 6 |

---

## Screen 1: Login / Register

```
+--------------------------------------------------+
|              TOUR PLANNER                        |
|                                                  |
|  +------------------------------------------+   |
|  |  [Tab: Login]  [Tab: Register]            |   |
|  |                                           |   |
|  |  Username:  [__________________________]  |   |
|  |  Password:  [__________________________]  |   |
|  |                                           |   |
|  |  [ ] Remember me                          |   |
|  |                                           |   |
|  |  [========= LOGIN BUTTON =========]       |   |
|  |                                           |   |
|  |  Forgot password?                         |   |
|  +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
```

**Register-Tab zusaetzlich:** Email, Confirm Password

---

## Screen 2: Main Dashboard (Kernscreen)

```
+------------------------------------------------------------------+
| HEADER: [Logo] Tour Planner    [____Search____] [User] [Logout]  |
+----------------+-------------------------------------------------+
|                |                                                  |
| SIDEBAR        |  MAP AREA (Leaflet)                             |
|                |                                                  |
| [+ New Tour]   |  +------------------------------------------+  |
|                |  |                                          |  |
| Filter:        |  |    [Interactive Map]                     |  |
| [All Types v]  |  |    - Shows selected tour route           |  |
|                |  |    - OpenStreetMap tiles                  |  |
| Tour List:     |  |                                          |  |
| +------------+ |  +------------------------------------------+  |
| | Tour 1     | |                                                  |
| | Wien->Graz | |  TOUR INFO PANEL                                |
| | [Bike] 5*  | |  +------------------------------------------+  |
| +------------+ |  | Name: [Tour Name]                        |  |
| | Tour 2     | |  | From: Wien  | To: Graz                  |  |
| | Linz->Salz | |  | Type: Bike  | Distance: 200km           |  |
| | [Hike] 3*  | |  | Est. Time: 8h | Popularity: ***         |  |
| +------------+ |  | Child-Friendly: Yes                      |  |
| | Tour 3     | |  | [Edit] [Delete] [Export]                  |  |
| | ...        | |  +------------------------------------------+  |
| +------------+ |                                                  |
|                |                                                  |
+----------------+-------------------------------------------------+
| FOOTER: Status | Tours: 12 | Logs: 47                            |
+------------------------------------------------------------------+
```

**Design-Entscheidungen:**
- **Master-Detail Layout:** Links Tour-Liste, rechts Karte + Details
- **Search Bar:** Global im Header (durchsucht Touren UND Logs)
- **Filter:** Transport Type Dropdown in der Sidebar

---

## Screen 3: Tour Detail + Tour Logs

```
+------------------------------------------------------------------+
| HEADER: [<- Back] Tour: "Wien nach Graz"   [User] [Logout]      |
+------------------------------------------------------------------+
|                                                                   |
|  MAP (Full Width, Leaflet)                                       |
|  +-------------------------------------------------------------+ |
|  |                                                             | |
|  |    [Route auf der Karte angezeigt]                          | |
|  |                                                             | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  TOUR INFO                                                        |
|  +-------------------------------------------------------------+ |
|  | From: Wien | To: Graz | Type: Bike                         | |
|  | Distance: 200km | Est. Time: 8h | Popularity: *****         | |
|  | Child-Friendly: Yes | Description: "Schoene Radtour..."     | |
|  | [Edit Tour] [Delete Tour] [Export Tour]                      | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  TOUR LOGS [+ Add Log]                                           |
|  +-------+------------+--------+-------+-------+-------+------+ |
|  | Date  | Comment    | Diff.  | Dist. | Time  | Rating| Act. | |
|  +-------+------------+--------+-------+-------+-------+------+ |
|  | 15.04 | Sonnig,... | Medium | 195km | 7:30h | ****  | [ED] | |
|  | 22.04 | Regen,...  | Hard   | 202km | 9:00h | ***   | [ED] | |
|  +-------+------------+--------+-------+-------+-------+------+ |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Screen 4: Add/Edit Tour (Modal/Dialog)

```
+------------------------------------------+
|  [x] Create New Tour                     |
|                                          |
|  Name:          [______________________] |
|  Description:   [______________________] |
|                 [______________________] |
|  From:          [______________________] |
|  To:            [______________________] |
|  Transport:     [Bike / Hike / Run / V ] |
|                                          |
|  --- Auto-computed (read-only) ---       |
|  Distance:      [retrieved via API]      |
|  Est. Time:     [retrieved via API]      |
|  Route Preview: [Map Preview]            |
|                                          |
|  [Cancel]              [Save Tour]       |
+------------------------------------------+
```

---

## Screen 5: Add/Edit Tour Log (Modal/Dialog)

```
+------------------------------------------+
|  [x] Add Tour Log                        |
|                                          |
|  Date/Time:    [29.04.2026] [14:30]      |
|  Comment:      [______________________]  |
|                [______________________]  |
|  Difficulty:   [Easy / Medium / Hard  v] |
|  Total Dist:   [___________] km          |
|  Total Time:   [___________] h           |
|  Rating:       [* * * * *]               |
|                                          |
|  [Cancel]            [Save Log]          |
+------------------------------------------+
```

---

## Screen 6: UI Flow Diagram

```
                    +----------+
                    |  Login/  |
                    | Register |
                    +----+-----+
                         |
                         v
                  +--------------+
           +----->|   Dashboard  |<------+
           |      | (Tour List)  |       |
           |      +------+-------+       |
           |             |               |
           |    +--------+--------+      |
           |    v                 v      |
      +---------+         +----------+  |
      | Add/Edit|         |  Tour    |  |
      |  Tour   |         |  Detail  |--+
      +---------+         +----+-----+
                               |
                       +-------+-------+
                       v               v
                 +---------+    +----------+
                 | Add/Edit|    | Import/  |
                 | Tour Log|    | Export   |
                 +---------+    +----------+
```

---

## 🔧 Vorgehen mit Draw.io

### Schritt 1: Datei oeffnen
- Oeffne `TourPlanner_Wireframes.drawio` in Draw.io (Desktop oder online)
- Die Datei enthaelt bereits alle 6 Pages als Grundgeruest

### Schritt 2: Verfeinern
- Nutze die **Mockup**-Shape-Library (Extras > Shape Libraries > Software > Mockups)
- Verwende graue Toene fuer Low-Fidelity Look
- Fuege Annotations hinzu (kurze Erklaerungen an den Raendern)

### Schritt 3: Export
- Exportiere als PNG fuer das Protokoll
- Die `.drawio`-Datei selbst kommt ins Git-Repo

---
*Erstellt: 29.04.2026 | Quelle: Tour Planner Specification (Moodle)*
