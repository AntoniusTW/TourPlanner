import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() required = false;
  @Input() hint?: string;
  @Input() errors: Record<string, string> = {};
  @Input() control!: AbstractControl;

  get showError(): boolean {
    return this.control?.invalid && (this.control.dirty || this.control.touched);
  }

  get activeError(): string | null {
    if (!this.showError) return null;
    for (const key of Object.keys(this.errors)) {
      if (this.control.hasError(key)) return this.errors[key];
    }
    return null;
  }
}
