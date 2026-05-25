import { Routes } from '@angular/router';
import { HealthCheckComponent } from './components/health-check/health-check.component';
import { TourCreateComponent } from './components/tour-create/tour-create.component';
import { TourListComponent } from './components/tour-list/tour-list.component';

export const routes: Routes = [
  { path: '',              redirectTo: 'tours', pathMatch: 'full' },
  { path: 'tours',         component: TourListComponent },
  { path: 'tours/create',  component: TourCreateComponent },
  { path: 'tours/:id/edit', component: TourCreateComponent },   // Edit-Modus
  { path: 'health',        component: HealthCheckComponent }
];
