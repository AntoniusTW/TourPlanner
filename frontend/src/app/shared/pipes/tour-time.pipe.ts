import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tourTime', standalone: true })
export class TourTimePipe implements PipeTransform {
  transform(min: number | undefined | null): string {
    if (min == null) return '—';
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h} h` : `${h} h ${m} m`;
  }
}
