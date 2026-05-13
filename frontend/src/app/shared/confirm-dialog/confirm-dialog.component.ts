import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() title = 'Bestätigen';
  @Input() message = 'Bist du sicher?';
  @Input() confirmLabel = 'Bestätigen';
  @Input() cancelLabel = 'Abbrechen';
  @Input() dangerous = false;
  @Input() loading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
