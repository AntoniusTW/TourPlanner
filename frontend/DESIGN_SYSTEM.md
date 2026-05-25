# Frontend Design System — Tour Planner

> Referenz für alle neuen Features. Immer zuerst hier nachschlagen, bevor neue Klassen oder Styles erfunden werden.

---

## 1. Architektur-Muster (MVVM)

| Schicht | Angular | Aufgabe |
|---------|---------|---------|
| **Model** | `src/app/models/*.model.ts` | TypeScript-Interfaces & Enums (kein Logic) |
| **ViewModel** | `src/app/services/*.service.ts` | Signals, HTTP-Calls, State-Mutations |
| **View** | `src/app/components/**/*.ts/html` | Nur binden & Events weiterleiten — kein Fetch, kein State |

### Goldene Regeln
- Komponenten haben **keinen eigenen State** — alles lebt im Service als Signal.
- Services werden mit `public vm: XyzService` injiziert (dann `vm.foo()` im Template).
- Neue HTTP-Calls → im Service mit `Observable` + `tap()` für Signal-Update.
- `signal()` für lokalen UI-State (z. B. `submitting`, `success`) ist OK in Komponenten.

### Neue Feature hinzufügen — Checkliste
1. `src/app/models/feature.model.ts` — Interface erstellen
2. `src/app/services/feature.service.ts` — Signals + HTTP-Methoden
3. `src/app/components/feature/feature.component.ts` — nur `public vm: FeatureService`
4. Route in `app.routes.ts` eintragen
5. Sidebar-Link in `sidebar.component.html` eintragen (falls Top-Level)

---

## 2. App-Shell Layout

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (248 px fix)  │  .main (scrollbar hier)     │
│  app-sidebar           │  <router-outlet>             │
│                        │                              │
└──────────────────────────────────────────────────────┘
```

```scss
// app.component.scss
.app { display: grid; grid-template-columns: 248px 1fr; height: 100vh; overflow: hidden; }
.main { overflow-y: auto; min-height: 0; }
```

Jede Route rendert eine **Page-Komponente** die mit `.page` beginnt — niemals den Shell-Container anfassen.

---

## 3. Design Tokens (`src/styles.scss`)

### Farben
| Variable | Wert | Bedeutung |
|----------|------|-----------|
| `--bg` | `oklch(0.985 0.004 95)` | Seiten-Hintergrund |
| `--bg-elev` | `#ffffff` | Cards, erhöhte Flächen |
| `--bg-muted` | `oklch(0.965 0.006 95)` | Input-BG, Hover |
| `--bg-sunken` | `oklch(0.955 0.008 95)` | Vertieft (Tables) |
| `--ink` | `oklch(0.22 0.012 60)` | Primärtext |
| `--ink-2` | `oklch(0.42 0.012 60)` | Sekundärtext |
| `--ink-3` | `oklch(0.58 0.010 60)` | Labels, Placeholder |
| `--ink-4` | `oklch(0.72 0.008 60)` | Disabled |
| `--border` | `oklch(0.91 0.006 90)` | Standard-Rahmen |
| `--border-2` | `oklch(0.85 0.008 90)` | Betonter Rahmen |
| `--accent` | `oklch(0.48 0.12 152)` | Grün, Primary-Aktionen |
| `--accent-soft` | `oklch(0.95 0.04 152)` | Grün-Highlight (BG) |
| `--accent-ink` | `oklch(0.32 0.10 152)` | Grün-Text |
| `--warn` | `oklch(0.72 0.15 70)` | Gelb/Orange |
| `--danger` | `oklch(0.58 0.18 25)` | Rot/Fehler |

### Radien
```
--r-1: 6px   (klein, z.B. Badges)
--r-2: 10px  (Buttons, Inputs)
--r-3: 14px  (Cards)
--r-4: 20px  (Modals, große Panels)
```

### Typografie
```
--sans: "Geist", system-ui
--mono: "Geist Mono", ui-monospace    ← für Zahlen, Labels, Codes
```

---

## 4. Globale Utility-Klassen

Alle in `src/styles.scss` definiert — **nicht in Komponenten-SCSS nachbauen**.

### Seiten-Layout
```html
<div class="page">
  <div class="page__header">
    <div>
      <h1 class="page__title">Titel</h1>
      <p class="page__lede">Untertitel / Beschreibung</p>
    </div>
    <div class="page__actions">
      <!-- Buttons rechts oben -->
    </div>
  </div>
  <!-- Inhalt -->
</div>
```

### Cards
```html
<div class="card">
  <div class="card__head">
    <h3>Titel</h3>
    <span class="spacer"></span>          <!-- drückt Rest nach rechts -->
    <!-- optionale Aktionen -->
  </div>
  <div class="card__body">
    <!-- Inhalt -->
  </div>
</div>
```

### Stat-Grid (4 Spalten)
```html
<div class="statgrid">
  <div class="stat">
    <div class="stat__l">Label</div>
    <div class="stat__v">42</div>
    <div class="stat__sub">optional</div>
  </div>
  <!-- × 4 -->
</div>
```

### Tour-Grid + Cards
```html
<div class="tourgrid">                        <!-- auto-fill, min 320px -->
  <div class="tourcard">
    <div class="tourcard__map">
      <span class="tourcard__map-placeholder">🚗</span>
      <span class="tourcard__transport">Auto</span>
    </div>
    <div class="tourcard__body">
      <div class="tourcard__name">Name</div>
      <div class="tourcard__route">Von → Nach</div>
      <div class="tourcard__stats">
        <div class="tourcard__stat"><span class="v">12 km</span><span class="l">Distanz</span></div>
        <!-- × 3 -->
      </div>
    </div>
  </div>
</div>
```

### Buttons
```html
<button class="btn btn--primary">Primär</button>
<button class="btn">Standard</button>
<button class="btn btn--ghost">Ghost</button>
<button class="btn btn--danger">Gefährlich</button>
<button class="btn btn--sm">Klein</button>
<button class="iconbtn"><!-- nur Icon --></button>
```

### Pills & Chips
```html
<span class="pill">Neutral</span>
<span class="pill pill--accent">Grün</span>
<span class="pill pill--warn">Warn</span>

<span class="chip">Filter</span>
<span class="chip is-on">Aktiv</span>
```

### Formular-Felder
```html
<div class="fieldgrid fieldgrid--2">     <!-- 1, 2 oder 3 Spalten -->
  <div class="field">
    <label class="field__label">Name *</label>
    <input class="input" type="text" />
    <span class="field__hint">Hinweistext oder Fehlermeldung</span>
  </div>
  <div class="field">
    <textarea class="textarea"></textarea>
  </div>
  <div class="field">
    <select class="select"></select>
  </div>
</div>
```

### Tabellen (Tour-Logs)
```html
<table class="logtable">
  <thead>
    <tr><th>Datum</th><th>Distanz</th><th>Bewertung</th></tr>
  </thead>
  <tbody>
    <tr class="logrow"><td class="mono">2024-01-01</td><td>12 km</td><td>4/5</td></tr>
  </tbody>
</table>
```

### Leerzustand
```html
<div class="empty">
  <!-- optional: SVG Icon -->
  <h3>Kein Inhalt</h3>
  <p>Beschreibung was fehlt.</p>
</div>
```

### Segment-Control (Tabs)
```html
<div class="segment">
  <button [class.is-on]="tab === 'a'" (click)="tab = 'a'">Tab A</button>
  <button [class.is-on]="tab === 'b'" (click)="tab = 'b'">Tab B</button>
</div>
```

### Hilfsklassen
```
.row         → flex row, gap 10px
.between     → justify-content: space-between
.muted       → color: var(--ink-3)
.mono        → font-family: var(--mono)
.text-sm     → font-size: 12.5px
.mt-8        → margin-top: 8px
.divider     → 1px horizontale Linie
.prose       → formatierter Fließtext
.mapbox      → Karten-Placeholder (340px Höhe)
```

---

## 5. Angular-Patterns

### Signals im Template
```typescript
// Service
readonly items = signal<Item[]>([]);
readonly loading = signal(false);
readonly selected = signal<Item | null>(null);

// Computed
readonly count = computed(() => this.items().length);
```

```html
<!-- Template -->
@if (vm.loading()) { <p>Laden…</p> }
@for (item of vm.items(); track item.id) { ... }
@if (vm.selected(); as item) { {{ item.name }} }
```

### HTTP + Signal-Update
```typescript
create(data: Omit<Item, 'id'>): Observable<Item> {
  return this.http.post<Item>(this.url, data).pipe(
    tap(created => this.items.update(list => [...list, created]))
  );
}
```

### Komponenten-Template-Struktur (Reihenfolge)
1. `@if (vm.loading())` — Ladezustand
2. `@if (vm.error())` — Fehlerzustand
3. `@if (!vm.loading() && vm.items().length === 0)` — Leerzustand
4. Hauptinhalt

---

## 6. Sidebar erweitern

`sidebar.component.html` — neuen NavItem-Link hinzufügen:

```html
<a class="navitem" routerLink="/new-feature" routerLinkActive="is-active">
  <svg width="15" height="15" ...><!-- Icon --></svg>
  <span>Feature Name</span>
  <!-- optional: -->
  <span class="count">{{ vm.someSignal().length }}</span>
</a>
```

Icons: einfache 15×15 SVG Outlines, `stroke="currentColor"`, `stroke-width="1.3"`.

---

## 7. Neue Komponente — Boilerplate

```typescript
// feature.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeatureService } from '../../services/feature.service';

@Component({
  selector: 'app-feature',
  imports: [CommonModule, RouterLink],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss'
})
export class FeatureComponent implements OnInit {
  constructor(public vm: FeatureService) {}
  ngOnInit(): void { this.vm.loadAll(); }
}
```

```html
<!-- feature.component.html -->
<div class="page">
  <div class="page__header">
    <div>
      <h1 class="page__title">Feature</h1>
      <p class="page__lede">Beschreibung</p>
    </div>
    <div class="page__actions">
      <button class="btn btn--primary">+ Neu</button>
    </div>
  </div>

  @if (vm.loading()) { <div class="empty"><p>Laden…</p></div> }
  @if (vm.error())   { <div class="empty"><h3>Fehler</h3><p>{{ vm.error() }}</p></div> }

  @if (!vm.loading() && vm.items().length === 0) {
    <div class="empty"><h3>Noch nichts hier</h3></div>
  }

  @if (!vm.loading() && vm.items().length > 0) {
    <!-- Inhalt -->
  }
</div>
```

```scss
/* feature.component.scss — meist leer, alles global */
```

---

## 8. Dos & Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Globale Klassen aus `styles.scss` nutzen | Neue generische Klassen in Komponenten-SCSS schreiben |
| `oklch()` Farben über CSS-Variablen nutzen | Hardcoded Hex-Farben wie `#0066cc` |
| Signals für State | `@Input`/`@Output` für Service-State |
| `var(--r-2)` für border-radius | Feste `px`-Werte für Radien |
| `--mono` Schrift für Zahlen & Labels | System-Monospace hardcoded |
| Geist-Font über `--sans` | Google Font direkt im SCSS importieren |
| Icons als inline SVG (15×15, stroke) | Icon-Libraries (zu viel Bundle-Größe) |
