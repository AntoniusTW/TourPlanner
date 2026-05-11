# TourPlanner — Intermediate Hand-In Issues

21 Issues für GitHub Project. Reihenfolge entspricht Empfehlung zur Bearbeitung.

---

## #1 Repo, Branching-Strategie, README

**Labels:** `setup`, `pair-task`, `size/S`

### Beschreibung

Mono-Repo mit `/backend` (Spring Boot) und `/frontend` (Angular).

**Branching:**
- `main` (geschützt, nur für Submissions)
- `develop` (Integration)
- Feature-Branches: `feature/<issue-nr>-<kurz>`
- PRs gehen in `develop`, immer mit Review durch den anderen

**README erklärt:**
- Setup für Backend und Frontend
- Commands zum Starten
- Voraussetzungen (Java-Version, Node-Version, Postgres)

**.gitignore für:**
- Java/Maven (target/, *.class)
- Node/Angular (node_modules/, dist/)
- IDE-Files (.idea/, .vscode/)
- `application-local.properties`

### Akzeptanzkriterien
- [ ] Beide können auschecken und lokal bauen
- [ ] README erklärt Onboarding nachvollziehbar
- [ ] Branch Protection auf main aktiv

**Pair-Task:** Gemeinsam machen, danach kennen beide das Setup.

---

## #2 API-Contract als OpenAPI-Spec

**Labels:** `setup`, `pair-task`, `size/M`

### Beschreibung

Gemeinsam die REST-Endpoints für Intermediate festlegen, **bevor** parallel implementiert wird.

**Endpoints:**
- `GET /api/tours`
- `POST /api/tours`
- `GET /api/tours/{id}`
- `PUT /api/tours/{id}`
- `DELETE /api/tours/{id}`
- `POST /api/tours/{id}/image`

**Tour-DTO Felder:**
- name, description
- fromLocation, toLocation
- transportType (Enum)
- distance, estimatedTime
- imagePath

### Umsetzung
- Als `openapi.yaml` ins Repo
- Optional via Springdoc-OpenAPI generieren lassen, sobald Backend-Skeleton steht
- Frontend kann mit `openapi-generator-cli` daraus TypeScript-Models und Services generieren

### Warum kritisch
Ihr arbeitet ab jetzt parallel. Ohne festen Contract baut einer was, das nicht passt.

### Akzeptanzkriterien
- [ ] openapi.yaml liegt im Repo
- [ ] Beide haben Spec gereviewt und committed
- [ ] Felder und Typen sind eindeutig

---

## #3 PostgreSQL via Docker-Compose + externe Konfiguration

**Labels:** `setup`, `backend`, `must-have`, `size/S`

### Beschreibung

**Docker-Compose:**
- `docker-compose.yml` ins Repo
- Postgres-Container mit Volume für Persistenz

**Konfiguration ausgelagert:**
- DB-Credentials, Connection-String, Image-Storage-Pfad in `application.properties`
- Committet wird nur `application.properties.example`
- Lokal: `application-local.properties` (gitignored)
- Spring Profiles: `local` und `dev`

### Bezug Checkliste
**Must-Have:** "Konfiguration separat, nicht im Source"

### Akzeptanzkriterien
- [ ] `docker-compose up` startet Postgres lokal
- [ ] Backend verbindet sich mit Profile `local`
- [ ] Keine Credentials im committed Code

---

## #4 Backend-Skeleton: Layer-basierte Architektur + Logging

**Labels:** `backend`, `must-have`, `architecture`, `size/S`

### Beschreibung

**Spring-Boot-Projekt mit Packages:**
- `controller` (Presentation Layer)
- `service` (Business Layer)
- `repository` (Data Access Layer)
- `model` (Entities)
- `dto` (Data Transfer Objects)
- `mapper` (Entity ↔ DTO)
- `config`
- `exception`

Leere Skeleton-Klassen anlegen, damit die Struktur sichtbar ist.

**Logging:**
- SLF4J + Logback (Spring Boot default)
- File-Output mit Rotation
- Log-Levels konfigurierbar via application.properties

**Health-Endpoint** zum Testen, dass alles läuft.

### Bezug Checkliste
- "Layer-based architecture" (Must-Have)
- "Logging framework" (Must-Have)

### Akzeptanzkriterien
- [ ] Alle Layer-Packages existieren
- [ ] Health-Endpoint antwortet
- [ ] Logger schreibt in File mit Rotation
- [ ] Im Protokoll: Logback statt log4j (mit Begründung)

---

## #5 Frontend-Skeleton: Angular-Projekt mit MVVM-Struktur

**Labels:** `frontend`, `must-have`, `architecture`, `size/M`

### Beschreibung

**Angular CLI-Projekt mit Ordnerstruktur:**
- `models/` (TypeScript-Interfaces)
- `services/` (= ViewModels in MVVM-Sinne)
- `components/` (= Views)
- `shared/` (Reusable Stuff)

**Setup:**
- Routing-Modul
- Environment-Files für Backend-URL
- Erste Dummy-Component, die per HTTP den Backend-Health-Endpoint anpingt

### MVVM-Verständnis
- Components rufen **keine** HTTP-Services direkt
- Components abonnieren Observables aus dedizierten ViewModel-Services
- Im Protokoll dokumentieren, wie MVVM gemappt wurde

### Achtung
MVVM in Angular ist Auslegungssache. Der Prüfer muss das nachvollziehen können.

### Bezug Checkliste
- "Uses MVVM for UI" (Must-Have)
- "Correct data binding" (4 Punkte)

### Akzeptanzkriterien
- [ ] Ordnerstruktur etabliert
- [ ] Dummy-Component zeigt Health-Status vom Backend
- [ ] Environment-Files für dev/prod

---

## #6 CORS-Konfiguration & E2E-Verbindung verifizieren

**Labels:** `setup`, `pair-task`, `size/S`

### Beschreibung

- Backend erlaubt CORS für Angular-Dev-Port (4200)
- Dummy-Component aus #5 ruft Health-Endpoint
- Response wird in der UI angezeigt

### Warum
Sobald das funktioniert, ist die End-to-End-Pipeline bewiesen. Alle weiteren vertikalen Stories können darauf aufbauen.

### Akzeptanzkriterien
- [ ] Frontend kann Backend erreichen ohne CORS-Fehler
- [ ] Health-Status wird in der UI angezeigt
- [ ] Beide haben es lokal getestet

**Abhängigkeit:** #4, #5

**Pair-Task:** Ja, kurz gemeinsam testen.

---

## #7 Story: Als User kann ich eine Tour anlegen (Pair Programming)

**Labels:** `feature`, `vertical-slice`, `pair-task`, `size/L`

### Beschreibung

**KOMPLETT VERTIKALER SCHNITT — als Pair Programming**

#### Backend
- `Tour`-JPA-Entity (id UUID, name, description, fromLocation, toLocation, transportType-Enum, distance, estimatedTime, imagePath, createdAt, updatedAt)
- Flyway-Migration `V1__create_tour_table.sql`
- `TourRepository extends JpaRepository<Tour, UUID>`
- `TourService.createTour(dto)` mit Mapping (MapStruct oder manuell)
- `TourController` mit `POST /api/tours` und `@Valid`
- Globaler `@ControllerAdvice` für Validation-Errors → 400 mit Feldfehlern
- Bean-Validation: `@NotBlank`, `@Positive`, etc.

#### Frontend
- `Tour`-Model (TypeScript-Interface)
- `TourService` mit `createTour(dto)` Methode
- `TourCreateComponent` mit Reactive Form
- Validators (required, min/max length)
- Inline-Fehleranzeige
- Submit-Button disabled wenn invalid

#### Integration
- Form abschicken → Backend speichert → Response zurück → Erfolgsmeldung

### Warum als Pair
Ihr lernt zusammen den kompletten Flow kennen. Alle weiteren Stories werden danach klar einfacher.

### Bezug Checkliste
- "Create tour" (Teil von 2 P)
- "Validates user-input" (1 P)
- "Correct data binding" (Teil von 4 P)

### Akzeptanzkriterien
- [ ] Tour wird in DB gespeichert
- [ ] Validation-Errors werden inline angezeigt
- [ ] Erfolg führt zu User-Feedback

**Abhängigkeit:** #6

---

## #8 Story: Als User sehe ich alle Touren in einer Liste

**Labels:** `feature`, `vertical-slice`, `size/M`

### Beschreibung

#### Backend
- `GET /api/tours` mit Service-Methode
- Gibt Liste aller Touren zurück

#### Frontend
- `TourListComponent` mit Liste aller Touren
- Klickbare Items
- Ausgewählte Tour wird im State markiert (z.B. via Service mit BehaviorSubject)
- Routing oder Master-Detail-Layout

### Bezug Checkliste
"Tours managed in a list view" (2 P)

### Akzeptanzkriterien
- [ ] Liste zeigt alle Touren
- [ ] Click selektiert Tour
- [ ] Selektion ist visuell sichtbar

**Abhängigkeit:** #7

---

## #9 Story: Als User sehe ich Details einer Tour inkl. Map-Placeholder

**Labels:** `feature`, `vertical-slice`, `size/S`

### Beschreibung

#### Backend
- `GET /api/tours/{id}`
- `TourNotFoundException` → 404

#### Frontend
- `TourDetailComponent` zeigt alle Attribute der selektierten Tour
- Map-Placeholder als `<div>` mit Hinweistext: "Map wird in Final-Version integriert"

### Wichtig
Map-Placeholder ist explizit so erlaubt laut Checkliste. Leaflet/OpenRouteService sind erst für Final relevant.

### Bezug Checkliste
"Tour Details show all attributes and map-placeholder" (1 P)

### Akzeptanzkriterien
- [ ] Alle Tour-Attribute werden angezeigt
- [ ] Map-Placeholder ist sichtbar
- [ ] 404 bei nicht-existierender ID

**Abhängigkeit:** #8

---

## #10 Story: Als User kann ich eine Tour bearbeiten

**Labels:** `feature`, `vertical-slice`, `size/M`

### Beschreibung

#### Backend
- `PUT /api/tours/{id}`
- Validation und Mapping wie bei Create
- 404 wenn nicht gefunden

#### Frontend
- Edit-Form (idealerweise dieselbe Component wie Create, im Edit-Modus mit vorgefüllten Werten)
- Selbe Validators wie Create
- Edit-Modus vs Create-Modus über Route-Parameter erkennen

### Bezug Checkliste
"Modify tour" (Teil der 2 P)

### Akzeptanzkriterien
- [ ] Form ist mit aktuellen Werten vorbefüllt
- [ ] Update wird persistiert
- [ ] Validation-Errors werden angezeigt

**Abhängigkeit:** #7, #8

---

## #11 Story: Als User kann ich eine Tour löschen

**Labels:** `feature`, `vertical-slice`, `size/S`

### Beschreibung

#### Backend
- `DELETE /api/tours/{id}`
- 204 No Content bei Erfolg
- 404 wenn nicht gefunden

#### Frontend
- Delete-Button in List- oder Detail-View
- **Confirm-Dialog vor Delete** (siehe #13 für Reusable Component)
- Nach Erfolg: Liste neu laden

### Bezug Checkliste
"Delete tour" (Teil der 2 P)

### Akzeptanzkriterien
- [ ] Confirm-Dialog erscheint vor Delete
- [ ] Delete wird persistiert
- [ ] UI aktualisiert sich nach Delete

**Abhängigkeit:** #8

---

## #12 Story: Als User kann ich ein Bild zur Tour hinzufügen

**Labels:** `feature`, `vertical-slice`, `size/M`

### Beschreibung

#### Backend
- `POST /api/tours/{id}/image` (multipart/form-data)
- Datei wird im konfigurierten Verzeichnis abgelegt (Pfad aus application.properties!)
- Filename: UUID-basiert
- `imagePath` in Tour aktualisiert
- `GET /api/tours/{id}/image` liefert die Datei aus
- Validation: Max-Größe, erlaubte MIME-Types (jpeg, png)

#### Frontend
- File-Input in Create/Edit-Form
- Image-Preview vor Upload
- Anzeige des Bildes in Detail-View

### Wichtig
Pfad muss konfigurierbar sein, nicht hardcoded. Bezug zur PDF: "images stored externally on filesystem"

### Bezug Checkliste
"Tours have required attributes (incl. Image)" (2 P)

### Akzeptanzkriterien
- [ ] Bild wird im Filesystem abgelegt
- [ ] Pfad ist über application.properties konfigurierbar
- [ ] Bild wird in Detail-View angezeigt
- [ ] Validation für Größe und MIME-Type

**Abhängigkeit:** #7, #10

---

## #13 Reusable UI-Komponente

**Labels:** `frontend`, `feature`, `size/M`

### Beschreibung

Mindestens eine Component, die an mehreren Stellen verwendet wird.

**Beste Kandidaten:**
- `<app-confirm-dialog>` für Delete-Bestätigungen
- `<app-form-field>` mit einheitlichem Label + Input + Error-Display
- `<app-data-card>` für List-Items

### Im Protokoll dokumentieren
- Wo wird die Component genutzt?
- Warum wurde sie wiederverwendbar designed?
- Welche Inputs/Outputs hat sie?

### Bezug Checkliste
"Defines reusable UI Component" (2 P)

### Akzeptanzkriterien
- [ ] Component wird an mind. 2 Stellen verwendet
- [ ] Component hat klare Inputs/Outputs
- [ ] Im Protokoll dokumentiert

**Abhängigkeit:** mind. #11

---

## #14 Responsive Layout

**Labels:** `frontend`, `size/S`

### Beschreibung

Layout funktioniert auf verschiedenen Fenstergrößen.

**Optionen:**
- Plain Flexbox/Grid
- Angular Material
- Tailwind CSS

**Mindestens:**
- Master-Detail-Layout kollabiert auf schmalen Screens
- List-View bleibt nutzbar
- Forms sind auf Mobile bedienbar

### Bezug Checkliste
"UI responds to window size changes" (1 P)

### Akzeptanzkriterien
- [ ] Bei < 768px: Layout passt sich an
- [ ] Keine horizontale Scrollbar
- [ ] Forms funktionieren auf Mobile

**Abhängigkeit:** #8, #9

---

## #15 Design Pattern bewusst einbauen und dokumentieren

**Labels:** `must-have`, `architecture`, `documentation`, `size/S`

### Beschreibung

Mindestens ein Pattern explizit umsetzen und im Protokoll dokumentieren.

**Vorschläge:**
- **Strategy** im Backend für unterschiedliche Berechnungen pro `TransportType`
- **Factory** für DTO-Erstellung
- **Observer** im Frontend (Angular Observables)
- **Repository Pattern** durch Spring Data JPA

### Im Protokoll
- Welches Pattern?
- Wo eingesetzt?
- Warum gerade das?

### Bezug Checkliste
"At least one design pattern" (Must-Have)

### Akzeptanzkriterien
- [ ] Pattern ist im Code erkennbar
- [ ] Pattern ist im Protokoll dokumentiert
- [ ] Begründung ist nachvollziehbar

---

## #16 Backend Unit-Tests (Service-Layer)

**Labels:** `backend`, `testing`, `size/M`

### Beschreibung

JUnit 5 + Mockito. `TourServiceTest` mit gemocktem Repository.

**Test-Cases (mind. 8-10 für Intermediate):**
- [ ] Tour erstellen (happy path)
- [ ] Tour erstellen mit ungültigen Daten
- [ ] Tour finden (existiert)
- [ ] Tour finden (existiert nicht → Exception)
- [ ] Tour updaten (happy path)
- [ ] Tour updaten (nicht gefunden)
- [ ] Tour löschen (happy path)
- [ ] Tour löschen (nicht gefunden)
- [ ] Liste leer
- [ ] Liste mit mehreren Einträgen

### Wichtig
Final braucht 20+ Tests gesamt. Fang früh an.

### Im Protokoll begründen
Warum gerade Service-Layer-Tests am wertvollsten sind (Business Logic isoliert, ohne DB).

### Akzeptanzkriterien
- [ ] Mind. 8 Tests grün
- [ ] Coverage in Service-Layer > 70%

**Abhängigkeit:** #7

---

## #17 Backend Controller-Tests mit MockMvc

**Labels:** `backend`, `testing`, `size/M`

### Beschreibung

`@WebMvcTest(TourController.class)` mit MockMvc.

**Tests pro Endpoint:**
- Status-Codes (200, 201, 204, 400, 404)
- JSON-Response-Struktur
- Validation-Errors → 400 mit Feldfehlern
- 404 wenn nicht gefunden

### Komplementär zu #16
- #16 testet Business Logic isoliert
- #17 testet HTTP-Layer und Serialisierung

### Akzeptanzkriterien
- [ ] Test pro Endpoint
- [ ] Validation-Tests vorhanden
- [ ] Error-Cases abgedeckt

**Abhängigkeit:** #7

---

## #18 Frontend Unit-Tests (Karma/Jasmine)

**Labels:** `frontend`, `testing`, `size/M`

### Beschreibung

**Tests für:**
- `TourService` (HTTP-Calls mit `HttpClientTestingModule`)
- Mind. 1 Component (Form-Validation, Submit-Verhalten)

### Hinweis
Im Intermediate nicht zwingend benotet, aber sinnvoll als Vorbereitung für Final.

### Akzeptanzkriterien
- [ ] TourService-Tests grün
- [ ] Mind. 1 Component-Test grün

---

## #19 Wireframes für alle Views

**Labels:** `documentation`, `must-have`, `pair-task`, `size/S`

### Beschreibung

Wireframes für alle Views erstellen.

**Tools:**
- Excalidraw (kostenlos, schnell)
- Figma (mehr Features)
- draw.io / diagrams.net

**Views abdecken:**
- List-View (mit ausgewählter Tour)
- Detail-View (mit Map-Placeholder)
- Create/Edit-Form
- Edge-Cases: leere Liste, Validation-Errors, Loading-State

**Output:** PDF-Export ins Repo

### Bezug Checkliste
- "Describes UX (include wireframes)" (1 P)
- In der PDF als "mandatory" markiert

### Akzeptanzkriterien
- [ ] Alle Hauptviews als Wireframes
- [ ] Edge-Cases skizziert
- [ ] PDF im Repo

**Pair-Task:** Ja, gemeinsam.

---

## #20 End-to-End-Integrationstest (manuell)

**Labels:** `integration`, `pair-task`, `size/M`

### Beschreibung

Beide setzen sich zusammen, starten:
- PostgreSQL via Docker-Compose
- Backend lokal
- Frontend Dev-Server

Alle CRUD-Flows manuell durchklicken:
- Tour anlegen (mit/ohne Bild)
- Tour in Liste sehen
- Tour-Details anschauen
- Tour bearbeiten
- Tour löschen
- Validation-Errors auslösen
- Edge-Cases testen

### Bug-Workflow
1. Bug entdecken → GitHub Issue anlegen
2. Issue an verantwortliche Person
3. Fix + PR
4. Re-Test

### Wichtig
**Mindestens 1 Woche vor Abgabe.**

### Akzeptanzkriterien
- [ ] Alle Flows funktionieren end-to-end
- [ ] Alle gefundenen Bugs sind gefixt oder dokumentiert
- [ ] Beide haben es unabhängig getestet

**Abhängigkeit:** Alle #7-#14

---

## #21 Intermediate-Protokoll als PDF

**Labels:** `documentation`, `size/M`

### Beschreibung

**Inhalt:**
1. Technische Schritte und Entscheidungen (Spring Boot, PostgreSQL, Flyway, Logback)
2. Architektur-Übersicht (Layer-Diagramm reicht für Intermediate)
3. Wireframes (aus #19)
4. Liste der eingesetzten Design-Patterns mit Begründung
5. Time-Tracking-Tabelle (wer, wann, was)
6. Begründung der gewählten Unit-Tests

### Wichtig: Time-Tracking
Führt das **während** des Projekts, nicht rückwirkend rekonstruiert. Toggl, Clockify, oder Spreadsheet.

### Bezug Checkliste
"Describes UX" (1 P), aber Protokoll ist insgesamt Voraussetzung.

### Akzeptanzkriterien
- [ ] Alle Punkte abgedeckt
- [ ] PDF-Export
- [ ] Beide haben gegengelesen

**Abhängigkeit:** Alle anderen
