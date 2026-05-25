# TourPlanner — Projekt-Referenz

**Team:** Milutin Kojic & Antonius Said | **Stack:** Angular 19 + Spring Boot 4 + PostgreSQL

---

## Projekt starten

```bash
# PostgreSQL via Docker
docker-compose up -d

# Backend (Port 8081) — aktives Profil: dev
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend (Port 4200)
cd frontend && npm start
```

Swagger UI: http://localhost:8081/swagger-ui.html  
OpenAPI JSON: http://localhost:8081/v3/api-docs  
API Contract (statisch): `openapi.yaml` im Repo-Root

---

## Architektur-Überblick

```
TourPlanner/
├── backend/          Spring Boot 4, Java 21
│   └── src/main/
│       ├── java/at/fhtw/swen/tourplanner/
│       │   ├── controller/     REST-Layer (@RestController)
│       │   ├── service/        Business-Logik
│       │   ├── repository/     Spring Data JPA
│       │   ├── model/          JPA-Entities + TransportType-Enum
│       │   ├── dto/            TourDto (Lombok @Builder)
│       │   ├── mapper/         TourMapper (Entity ↔ DTO)
│       │   ├── config/         WebConfig (CORS, Static Resources)
│       │   └── exception/      GlobalExceptionHandler, TourNotFoundException
│       └── resources/
│           ├── application.properties          Basis-Config
│           └── application-dev.properties      DB-Credentials (dev)
│
├── frontend/         Angular 19 Standalone, Signal-based State
│   └── src/app/
│       ├── components/         Feature-Components
│       │   ├── tour-list/      Übersicht + Split-View
│       │   ├── tour-detail/    Detail-Panel (sticky, rechts)
│       │   ├── tour-create/    Erstellen + Bearbeiten (gleiche Component)
│       │   ├── sidebar/        Navigation
│       │   └── health-check/   Backend-Status
│       ├── shared/             Wiederverwendbare UI-Bausteine
│       │   ├── alert/          AlertComponent
│       │   ├── confirm-dialog/ ConfirmDialogComponent
│       │   ├── form-field/     FormFieldComponent
│       │   ├── loading-spinner/LoadingSpinnerComponent
│       │   └── pipes/          TourDistancePipe, TourTimePipe
│       ├── services/
│       │   └── tour.service.ts ViewModel (Signals + HTTP)
│       ├── models/
│       │   └── tour.model.ts   Tour-Interface, TransportType, Labels, Icons
│       └── environments/
│           ├── environment.ts              Prod
│           └── environment.development.ts  Dev (apiBaseUrl, serverUrl)
│
├── docs/
│   ├── Protokoll_Reusable_Components.md  Dokumentation shared Components
│   ├── 01_Wireframe_Plan.md
│   └── TourPlanner_Wireframes.drawio
├── admin/
│   ├── TASKS.md      Modul-Checkmarks (3×5 Punkte)
│   └── WORKFLOW.md
├── openapi.yaml      Statischer API-Contract
└── docker-compose.yml
```

---

## REST API

Basis: `http://localhost:8081/api`

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/tours` | Alle Touren |
| `POST` | `/tours` | Tour erstellen |
| `GET` | `/tours/{id}` | Tour nach ID |
| `PUT` | `/tours/{id}` | Tour aktualisieren |
| `DELETE` | `/tours/{id}` | Tour löschen (204 / 404) |
| `POST` | `/tours/{id}/image` | Bild hochladen (multipart/form-data) |
| `GET` | `/tours/{id}/image` | Bild abrufen |
| `GET` | `/health` | Health-Check |

Hochgeladene Bilder werden auch direkt als Static Resource serviert:  
`http://localhost:8081/uploads/images/{filename}`

---

## Backend — wichtige Konfiguration

```properties
# application.properties
server.port=8081
tour.images.upload-dir=./uploads/images
spring.servlet.multipart.max-file-size=10MB
springdoc.swagger-ui.path=/swagger-ui.html
```

```properties
# application-dev.properties (DB-Defaults)
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5433}/${DB_NAME:tourplanner}
spring.datasource.username=${DB_USER:tourplanner}
spring.datasource.password=${DB_PASSWORD:tourplanner}
```

**Aktives Profil setzen:** IntelliJ Run Config → Active profiles: `dev`  
**Oder:** `spring.profiles.active=dev` in `application.properties`

---

## Frontend — State Management

`TourService` ist der zentrale ViewModel-Service (`providedIn: 'root'`):

```typescript
readonly tours         = signal<Tour[]>([]);
readonly selectedTour  = signal<Tour | null>(null);
readonly loading       = signal(false);
readonly error         = signal<string | null>(null);
```

Alle Components lesen State direkt via Signals und rufen Actions auf dem Service auf. Kein separates State-Framework nötig.

---

## Shared Component Library

Vollständige Dokumentation: `docs/Protokoll_Reusable_Components.md`

### Schnellreferenz

**`<app-alert>`** — Fehlermeldungen / Erfolgsmeldungen
```html
<app-alert type="success" message="Gespeichert!">
  <button (click)="...">Action</button>   <!-- optional via ng-content -->
</app-alert>
<app-alert type="error" [message]="serverError()!" />
```

**`<app-confirm-dialog>`** — Bestätigungs-Modal
```html
<app-confirm-dialog title="Löschen?" message="Wirklich?"
  confirmLabel="Löschen" [dangerous]="true" [loading]="deleting()"
  (confirmed)="doDelete()" (cancelled)="showDialog.set(false)" />
```

**`<app-form-field>`** — Label + Validierung (Content Projection)
```html
<app-form-field label="Name" [required]="true" [control]="field('name')"
  [errors]="{ required: 'Pflichtfeld.', maxlength: 'Zu lang.' }">
  <input class="input" formControlName="name" />
</app-form-field>
```

**`| tourDistance`** und **`| tourTime`** — Pure Pipes
```html
{{ tour.distance | tourDistance }}    <!-- "18.5 km" | "500 m" | "—" -->
{{ tour.estimatedTime | tourTime }}   <!-- "45 min" | "2 h 30 m" | "—" -->
```

**`TRANSPORT_TYPE_ICONS`** — Konstante in `tour.model.ts`
```typescript
// { CAR: '🚗', BICYCLE: '🚴', WALKING: '🚶', RUNNING: '🏃' }
transportIcons[tour.transportType]
```

---

## Design System

Alle globalen Styles in `frontend/src/styles.scss`. Keine externe UI-Library.

**CSS Custom Properties (Auszug):**
```css
--accent / --accent-soft / --accent-ink   Primärfarbe (Teal)
--danger / --danger-soft                  Rot (Löschen, Fehler)
--ink / --ink-2 / --ink-3 / --ink-4       Textfarben (dunkel → hell)
--bg / --bg-elev / --bg-muted             Hintergründe
--shadow-pop                              Modal-Schatten
```

**Utility-Klassen:** `.btn`, `.btn--primary`, `.btn--danger`, `.btn--ghost`, `.iconbtn`, `.card`, `.card__head`, `.field`, `.input`, `.pill`, `.pill--accent`, `.tourgrid`, `.tourcard`, `.statgrid`

---

## Datenmodell

```typescript
// tour.model.ts
interface Tour {
  id?: string;
  name: string;
  description?: string;
  fromLocation: string;
  toLocation: string;
  transportType: 'CAR' | 'BICYCLE' | 'WALKING' | 'RUNNING';
  distance?: number;       // km
  estimatedTime?: number;  // Minuten
  imagePath?: string;      // /uploads/images/{uuid}.{ext}
  createdAt?: string;      // ISO-8601
  updatedAt?: string;
}
```

---

## Bekannte Abhängigkeiten / Stolperfallen

- **Datenbankprofil:** Backend startet ohne DB-URL wenn Profil `local` aktiv ist statt `dev`. Immer `dev`-Profil verwenden.
- **Node.js:** Projekt läuft mit Node v25 (odd-number, non-LTS) — funktioniert, aber nicht produktionsempfohlen.
- **Zwei Environment-Dateien:** Änderungen an `apiBaseUrl`/`serverUrl` müssen in **beiden** `environment.ts` und `environment.development.ts` gemacht werden.
- **Image Upload:** Bild wird erst **nach** dem Speichern der Tour hochgeladen (Tour-ID nötig). Bei Upload-Fehler bleibt die Tour trotzdem gespeichert.
