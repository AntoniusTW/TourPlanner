import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { TRANSPORT_TYPE_LABELS, TransportType } from '../../models/tour.model';

@Component({
  selector: 'app-tour-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tour-create.component.html',
  styleUrl: './tour-create.component.scss'
})
export class TourCreateComponent implements OnInit {

  readonly transportTypes = Object.entries(TRANSPORT_TYPE_LABELS) as [TransportType, string][];

  readonly form: FormGroup;
  readonly success     = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitting  = signal(false);
  readonly isEditMode  = signal(false);
  readonly loadingTour = signal(false);

  private tourId: string | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name:          ['', [Validators.required, Validators.maxLength(100)]],
      description:   [''],
      fromLocation:  ['', Validators.required],
      toLocation:    ['', Validators.required],
      transportType: ['', Validators.required],
      distance:      [null],
      estimatedTime: [null]
    });
  }

  ngOnInit(): void {
    this.tourId = this.route.snapshot.paramMap.get('id');

    if (!this.tourId) return;

    this.isEditMode.set(true);
    this.loadingTour.set(true);

    // Erst im Cache suchen, dann fetch
    const cached = this.tourService.tours().find(t => t.id === this.tourId)
                ?? (this.tourService.selectedTour()?.id === this.tourId
                    ? this.tourService.selectedTour()
                    : null);

    if (cached) {
      this.form.patchValue(cached);
      this.loadingTour.set(false);
    } else {
      this.tourService.getById(this.tourId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (tour) => {
            this.form.patchValue(tour);
            this.loadingTour.set(false);
          },
          error: () => {
            this.serverError.set('Tour konnte nicht geladen werden.');
            this.loadingTour.set(false);
          }
        });
    }
  }

  field(name: string) { return this.form.get(name)!; }

  isInvalid(name: string): boolean {
    const f = this.field(name);
    return f.invalid && (f.dirty || f.touched);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    this.serverError.set(null);

    if (this.isEditMode() && this.tourId) {
      this.tourService.update(this.tourId, { id: this.tourId, ...this.form.value })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updated) => {
            this.tourService.selectTour(updated);
            this.submitting.set(false);
            this.router.navigate(['/tours']);
          },
          error: () => {
            this.serverError.set('Tour konnte nicht gespeichert werden. Bitte versuche es erneut.');
            this.submitting.set(false);
          }
        });
    } else {
      this.tourService.create(this.form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.success.set(true);
            this.form.reset();
            this.submitting.set(false);
          },
          error: () => {
            this.serverError.set('Tour konnte nicht gespeichert werden. Bitte versuche es erneut.');
            this.submitting.set(false);
          }
        });
    }
  }
}
