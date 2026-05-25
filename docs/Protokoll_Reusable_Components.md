# Protokoll: Wiederverwendbare UI-Komponenten

**Projekt:** Tour Planner  
**Team:** Milutin Kojic & Antonius Said  
**Bezug Checkliste:** „Defines reusable UI Component" (2 P)

---

## Übersicht

Im Tour Planner Frontend wurde eine vollständige Bibliothek generischer UI-Komponenten und Pipes unter `src/app/shared/` aufgebaut. Alle Teile sind **standalone**, kennen keine fachliche Domäne und kommunizieren ausschließlich über `@Input`/`@Output` bzw. Angular Pipe-Interfaces.

```
src/app/shared/
├── alert/                  AlertComponent
├── confirm-dialog/         ConfirmDialogComponent
├── form-field/             FormFieldComponent
├── loading-spinner/        LoadingSpinnerComponent
└── pipes/
    ├── tour-distance.pipe  TourDistancePipe
    └── tour-time.pipe      TourTimePipe
```

---

## 1. ConfirmDialogComponent

**Pfad:** `src/app/shared/confirm-dialog/`

### API

| Input | Typ | Default | Beschreibung |
|---|---|---|---|
| `title` | `string` | `'Bestätigen'` | Überschrift |
| `message` | `string` | `'Bist du sicher?'` | Erklärungstext |
| `confirmLabel` | `string` | `'Bestätigen'` | Text des Bestätigungs-Buttons |
| `cancelLabel` | `string` | `'Abbrechen'` | Text des Abbrechen-Buttons |
| `dangerous` | `boolean` | `false` | Bestätigungs-Button rot (`.btn--danger`) |
| `loading` | `boolean` | `false` | Spinner im Button, deaktiviert Klicks |

| Output | Beschreibung |
|---|---|
| `confirmed` | User hat bestätigt |
| `cancelled` | User hat abgebrochen oder Overlay geklickt |

### Verwendungsstellen

**1. `TourDetailComponent` — Tour löschen** (`loading`-Input aktiv während DELETE-Request)
```html
<app-confirm-dialog title="Tour löschen"
  [message]="'Tour &quot;' + tour.name + '&quot; wirklich löschen?'"
  confirmLabel="Löschen" [dangerous]="true" [loading]="deleting()"
  (confirmed)="confirmDelete()" (cancelled)="showDeleteConfirm.set(false)" />
```

**2. `TourCreateComponent` — ungespeicherte Änderungen verwerfen**
```html
<app-confirm-dialog title="Änderungen verwerfen?"
  message="Du hast ungespeicherte Änderungen. Wenn du abbrichst, gehen diese verloren."
  confirmLabel="Verwerfen" [dangerous]="true"
  (confirmed)="router.navigate(['/tours'])" (cancelled)="showAbortConfirm.set(false)" />
```
Der „Abbrechen"-Button prüft via `form.dirty || selectedFile()` — ohne Änderungen wird direkt navigiert.

**Geplant:** Tour-Log löschen — identische Komponente mit angepasstem `title`/`message`.

---

## 2. AlertComponent

**Pfad:** `src/app/shared/alert/`

### API

| Input | Typ | Default | Beschreibung |
|---|---|---|---|
| `type` | `'success' \| 'error' \| 'warning'` | `'error'` | Visueller Stil + Icon |
| `message` | `string` | `''` | Anzuzeigender Text |

`ng-content` ermöglicht optionale Action-Buttons auf der rechten Seite.

### Verwendungsstellen

**1. `TourCreateComponent` — Erfolgsmeldung nach Speichern**
```html
<app-alert type="success" message="Tour wurde erfolgreich gespeichert!">
  <button class="btn btn--ghost btn--sm" (click)="success.set(false)">Weitere erstellen</button>
</app-alert>
```

**2. `TourCreateComponent` — Fehlermeldung vom Server**
```html
<app-alert type="error" [message]="serverError()!" />
```

**Geplant:** Überall wo Server-Fehler oder Erfolgsmeldungen angezeigt werden (Tour-Logs, Health-Check, zukünftige Formulare).

---

## 3. FormFieldComponent

**Pfad:** `src/app/shared/form-field/`

### API

| Input | Typ | Beschreibung |
|---|---|---|
| `label` | `string` | Feldbezeichnung |
| `required` | `boolean` | Zeigt roten `*` an |
| `control` | `AbstractControl` | Reactive Forms Control für Validierungszustand |
| `errors` | `Record<string, string>` | Map von Fehlerkey → Fehlermeldung |
| `hint` | `string?` | Grauer Hinweistext (nur wenn kein Fehler aktiv) |

Das eigentliche Input-Element wird per `ng-content` projiziert — die Komponente ist inputtyp-agnostisch (`<input>`, `<textarea>`, `<select>` funktionieren alle).

### Verwendungsstellen

**`TourCreateComponent` — alle 5 validierten Felder:**
```html
<app-form-field label="Name" [required]="true" [control]="field('name')"
  [errors]="{ required: 'Name ist erforderlich.', maxlength: 'Maximal 100 Zeichen.' }">
  <input class="input" formControlName="name" type="text" />
</app-form-field>
```

Ersetzt das 5× wiederholte Pattern:
```html
<!-- VORHER — 8 Zeilen pro Feld -->
<div class="field">
  <label class="field__label">Name <span style="color:var(--danger)">*</span></label>
  <input class="input" formControlName="name" />
  @if (isInvalid('name')) {
    <span class="field__hint" style="color:var(--danger);">
      @if (field('name').hasError('required')) { Name ist erforderlich. }
    </span>
  }
</div>
```

**Geplant:** Tour-Log-Formular, Suchformular.

---

## 4. TourDistancePipe & TourTimePipe

**Pfad:** `src/app/shared/pipes/`

### Warum Pipes statt Methoden

Methoden in Templates werden bei **jeder Change-Detection-Runde** neu aufgerufen. Pipes mit `pure: true` (Angular-Default) werden nur neu berechnet wenn sich der **Eingabewert ändert** — das ist effizienter und semantisch korrekter.

| Pipe | Syntax | Beispiele |
|---|---|---|
| `tourDistance` | `{{ distance \| tourDistance }}` | `18.5 km`, `500 m`, `—` |
| `tourTime` | `{{ time \| tourTime }}` | `45 min`, `2 h 30 m`, `3 h`, `—` |

### Entfernte Duplikate

Identische Methoden `formatDistance()` und `formatTime()` existierten in:
- `TourListComponent`
- `TourDetailComponent`

Beide wurden entfernt und durch die Pipes ersetzt.

### Verwendungsstellen

- `TourListComponent` — Tourcard-Stats
- `TourDetailComponent` — Stat-Grid und Detailfelder

---

## 5. TRANSPORT_TYPE_ICONS (Modell-Konstante)

**Pfad:** `src/app/models/tour.model.ts`

```typescript
export const TRANSPORT_TYPE_ICONS: Record<TransportType, string> = {
  CAR: '🚗', BICYCLE: '🚴', WALKING: '🚶', RUNNING: '🏃'
};
```

Ersetzt das hardcodierte `Record<string, string>`-Literal in `TourListComponent.transportIcon()`. Durch die Typisierung mit `TransportType` wird zur Compile-Zeit sichergestellt, dass alle Transportarten abgedeckt sind.

---

## Zusammenfassung: Design-Prinzipien

| Prinzip | Umsetzung |
|---|---|
| **Single Responsibility** | Jede shared Component hat genau eine Aufgabe |
| **Open/Closed** | Neue Nutzungen ohne Änderung der Komponente möglich (`ng-content`, flexible Inputs) |
| **Keine fachliche Kopplung** | Kein Import von `TourService` oder Tour-Modellen in shared Components |
| **Standalone** | Direkt per `imports: [...]` nutzbar, kein NgModule nötig |
| **Pure Pipes** | Effiziente Change-Detection durch referentielle Transparenz |
