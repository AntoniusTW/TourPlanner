import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TourLogService } from '../../services/tour-log.service';
import { TourLog, DifficultyLevel, DIFFICULTY_LABELS } from '../../models/tour-log.model';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-tour-log-form',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, AlertComponent],
  templateUrl: './tour-log-form.component.html',
  styleUrl: './tour-log-form.component.scss'
})
export class TourLogFormComponent implements OnInit {

  @Input() tourId!: string;
  @Input() log: TourLog | null = null;

  @Output() saved     = new EventEmitter<TourLog>();
  @Output() cancelled = new EventEmitter<void>();

  readonly difficulties = Object.entries(DIFFICULTY_LABELS) as [DifficultyLevel, string][];
  readonly submitting   = signal(false);
  readonly serverError  = signal<string | null>(null);
  readonly form: FormGroup;

  get isEditMode(): boolean { return !!this.log?.id; }

  constructor(private fb: FormBuilder, private logService: TourLogService) {
    this.form = this.fb.group({
      date:       ['', Validators.required],
      duration:   [null, [Validators.required, Validators.min(1)]],
      distance:   [null, Validators.min(0)],
      rating:     [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment:    [''],
      difficulty: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.log) {
      this.form.patchValue(this.log);
    }
  }

  field(name: string) { return this.form.get(name)!; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    this.serverError.set(null);
    const value = this.form.value;

    if (this.isEditMode) {
      this.logService.update(this.tourId, this.log!.id!, value).subscribe({
        next: (updated) => { this.submitting.set(false); this.saved.emit(updated); },
        error: () => { this.serverError.set('Log konnte nicht gespeichert werden.'); this.submitting.set(false); }
      });
    } else {
      this.logService.create(this.tourId, value).subscribe({
        next: (created) => { this.submitting.set(false); this.saved.emit(created); },
        error: () => { this.serverError.set('Log konnte nicht gespeichert werden.'); this.submitting.set(false); }
      });
    }
  }
}
