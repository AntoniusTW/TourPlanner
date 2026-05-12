import { Routes } from '@angular/router';
import { HealthCheckComponent } from './components/health-check/health-check.component';
import { TourCreateComponent } from './components/tour-create/tour-create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'health', pathMatch: 'full' },
  { path: 'health', component: HealthCheckComponent },
  { path: 'tours/create', component: TourCreateComponent }
];
