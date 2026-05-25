import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() type: AlertType = 'error';
  @Input() message = '';
  @Output() dismissed = new EventEmitter<void>();
}
