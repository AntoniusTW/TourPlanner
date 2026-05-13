import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour, TRANSPORT_TYPE_LABELS } from '../../models/tour.model';
import { TourDetailComponent } from '../tour-detail/tour-detail.component';

@Component({
  selector: 'app-tour-list',
  imports: [CommonModule, RouterLink, TourDetailComponent],
  templateUrl: './tour-list.component.html',
  styleUrl: './tour-list.component.scss'
})
export class TourListComponent implements OnInit {

  readonly transportLabels = TRANSPORT_TYPE_LABELS;

  constructor(public vm: TourService) {}

  ngOnInit(): void {
    this.vm.loadAll();
  }

  select(tour: Tour): void {
    this.vm.selectTour(tour);
  }

  isSelected(tour: Tour): boolean {
    return this.vm.selectedTour()?.id === tour.id;
  }

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

  transportIcon(type: string): string {
    const icons: Record<string, string> = {
      CAR: '🚗', BICYCLE: '🚴', WALKING: '🚶', RUNNING: '🏃'
    };
    return icons[type] ?? '🗺';
  }
}
