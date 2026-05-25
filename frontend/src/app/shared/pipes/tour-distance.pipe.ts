import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tourDistance', standalone: true })
export class TourDistancePipe implements PipeTransform {
  transform(km: number | undefined | null): string {
    if (km == null) return '—';
    return km >= 1 ? `${km.toFixed(1)} km` : `${(km * 1000).toFixed(0)} m`;
  }
}
