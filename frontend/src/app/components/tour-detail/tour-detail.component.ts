import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { TRANSPORT_TYPE_LABELS } from '../../models/tour.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tour-detail',
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss'
})
export class TourDetailComponent {

  readonly transportLabels = TRANSPORT_TYPE_LABELS;

  constructor(public vm: TourService) {}

  formatDistance(km: number | undefined): string {
    if (km == null) return '—';
    return km >= 1 ? `${km.toFixed(1)} km` : `${(km * 1000).toFixed(0)} m`;
  }

  formatTime(min: number | undefined): string {
    if (min == null) return '—';
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h} h` : `${h} h ${m} m`;
  }

  imageUrl(path: string | undefined): string | null {
    return path ? `${environment.serverUrl}${path}` : null;
  }

  close(): void {
    this.vm.selectTour(null);
  }
}
