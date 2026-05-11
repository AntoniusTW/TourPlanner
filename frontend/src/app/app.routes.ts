import { Routes } from '@angular/router';
import { HealthCheckComponent } from './components/health-check/health-check.component';

export const routes: Routes = [
  { path: '', redirectTo: 'health', pathMatch: 'full' },
  { path: 'health', component: HealthCheckComponent }
];
