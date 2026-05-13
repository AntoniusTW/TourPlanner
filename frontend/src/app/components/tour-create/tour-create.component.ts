import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { TourService } from '../../services/tour.service';
import { TRANSPORT_TYPE_LABELS, TransportType, Tour } from '../../models/tour.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tour-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ConfirmDialogComponent, AlertComponent, FormFieldComponent],
  templateUrl: './tour-create.component.html',
  styleUrl: './tour-create.component.scss'
})
export class TourCreateComponent implements OnInit {

  readonly transportTypes = Object.entries(TRANSPORT_TYPE_LABELS) as [TransportType, string][];
  readonly serverUrl = environment.serverUrl;

  readonly form: FormGroup;
  readonly success        = signal(false);
  readonly serverError    = signal<string | null>(null);
  readonly submitting     = signal(false);
  readonly isEditMode     = signal(false);
  readonly loadingTour    = signal(false);
  readonly selectedFile      = signal<File | null>(null);
  readonly previewUrl        = signal<string | null>(null);
  readonly existingImage     = signal<string | null>(null);
  readonly showAbortConfirm  = signal(false);

  private tourId: string | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    public router: Router,
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

    const cached = this.tourService.tours().find(t => t.id === this.tourId)
                ?? (this.tourService.selectedTour()?.id === this.tourId
                    ? this.tourService.selectedTour()
                    : null);

    if (cached) {
      this.patchForm(cached);
      this.loadingTour.set(false);
    } else {
      this.tourService.getById(this.tourId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (tour) => {
            this.patchForm(tour);
            this.loadingTour.set(false);
          },
          error: () => {
            this.serverError.set('Tour konnte nicht geladen werden.');
            this.loadingTour.set(false);
          }
        });
    }
  }

  private patchForm(tour: Tour): void {
    this.form.patchValue(tour);
    if (tour.imagePath) this.existingImage.set(tour.imagePath);
  }

  field(name: string) { return this.form.get(name)!; }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.serverError.set('Nur Bilddateien (JPEG, PNG, GIF, WebP) sind erlaubt.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.serverError.set('Datei darf maximal 10 MB groß sein.');
      return;
    }

    this.serverError.set(null);
    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  tryAbort(): void {
    if (this.form.dirty || this.selectedFile()) {
      this.showAbortConfirm.set(true);
    } else {
      this.router.navigate(['/tours']);
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    this.serverError.set(null);

    if (this.isEditMode() && this.tourId) {
      this.tourService.update(this.tourId, { id: this.tourId, ...this.form.value })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          switchMap(updated => this.selectedFile()
            ? this.tourService.uploadImage(updated.id!, this.selectedFile()!)
            : of(updated)
          )
        )
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
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          switchMap(created => this.selectedFile() && created.id
            ? this.tourService.uploadImage(created.id, this.selectedFile()!)
            : of(created)
          )
        )
        .subscribe({
          next: () => {
            this.success.set(true);
            this.form.reset();
            this.selectedFile.set(null);
            this.previewUrl.set(null);
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
