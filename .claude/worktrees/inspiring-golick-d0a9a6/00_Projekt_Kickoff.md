# 🚀 Semesterprojekt: Tour Planner
**Team:** Milutin Kojic & Antonius Said | **Status:** Kickoff (Class 1) 🛠️

---

## 📝 Projektübersicht
Der **Tour Planner** ist eine Fullstack-Applikation zur Planung und Verwaltung von Touren. Die Architektur basiert auf einem **Angular-Frontend** und einem **Java/Spring Boot Backend**.

### Anforderungen (Must-Haves für Intermediate):
- [ ] **Frontend:** Angular Projekt initialisiert.
- [ ] **Backend:** Spring Boot Projekt mit REST-Endpunkten.
- [ ] **Persistenz:** PostgreSQL Integration (via Docker).
- [ ] **Funktionalität:** Erstellen, Bearbeiten, Löschen von Touren (CRUD).
- [ ] **Dokumentation:** Wireframes & UML Klassendiagramm.

---

## 🏗️ Geplante Struktur

```text
/03_Semesterprojekt_TourPlanner
  ├── tour-planner-backend/   (Spring Boot Application)
  ├── tour-planner-frontend/  (Angular SPA)
  ├── docker-compose.yml      (DB: PostgreSQL)
  └── docs/                   (UML, Wireframes, Requirements)
```

---

## 📅 Nächste Meilensteine

1. **Repo Setup:** Gemeinsames GitHub/Azure Repository erstellen.
2. **Wireframing:** Entwurf der UI (Dashboard, Tour-Details, Add-Tour).
3. **UML:** Definition des Domain-Models (Tour, TourLog, etc.).

---

## 💡 Kontext aus SWEN1 (Relevant)
- Wir nutzen die **Layered Architecture** (Controller -> Service -> Repository).
- **SOLID Prinzipien:** Besonders *Dependency Injection* wird in Spring Boot durch Autowiring zentral.
- **REST-API Design:** Wir bauen auf den Erfahrungen aus dem MRP-Projekt auf (OpenAPI/Swagger).

---
> [!IMPORTANT]
> **Nächster Schritt:** Bestätige mir, ob wir die Ordner `tour-planner-backend` und `tour-planner-frontend` jetzt physisch initialisieren sollen.
