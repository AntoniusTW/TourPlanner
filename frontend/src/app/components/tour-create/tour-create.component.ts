import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TourService } from '../../services/tour.service';
import { TRANSPORT_TYPE_LABELS, TransportType } from '../../models/tour.model';

@Component({
  selector: 'app-tour-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tour-create.component.html',
  styleUrl: './tour-create.component.scss'
})
export class TourCreateComponent {

  readonly transportTypes = Object.entries(TRANSPORT_TYPE_LABELS) as [TransportType, string][];

  readonly form: FormGroup;
  readonly success = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitting = signal(false);

  constructor(private fb: FormBuilder, private tourService: TourService) {
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

  field(name: string) {
    return this.form.get(name)!;
  }

  isInvalid(name: string): boolean {
    const f = this.field(name);
    return f.invalid && (f.dirty || f.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.serverError.set(null);

    this.tourService.create(this.form.value).subscribe({
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
