import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `<div class="spinner">Laden...</div>`,
  styles: [`.spinner { font-style: italic; color: #666; }`]
})
export class LoadingSpinnerComponent {}
