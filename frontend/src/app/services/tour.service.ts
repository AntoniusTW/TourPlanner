import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Tour } from '../models/tour.model';

/**
 * ViewModel for tour views.
 * Holds tour state and exposes CRUD actions.
 */
@Injectable({ providedIn: 'root' })
export class TourService {

  private readonly url = `${environment.apiBaseUrl}/tours`;

  readonly tours = signal<Tour[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadAll(): void {
    this.loading.set(true);
    this.http.get<Tour[]>(this.url).subscribe({
      next: (data) => { this.tours.set(data); this.loading.set(false); },
      error: () => { this.error.set('Touren konnten nicht geladen werden'); this.loading.set(false); }
    });
  }

  create(tour: Tour): void {
    this.http.post<Tour>(this.url, tour).subscribe({
      next: (created) => this.tours.update(list => [...list, created]),
      error: () => this.error.set('Tour konnte nicht erstellt werden')
    });
  }

  update(id: number, tour: Tour): void {
    this.http.put<Tour>(`${this.url}/${id}`, tour).subscribe({
      next: (updated) => this.tours.update(list => list.map(t => t.id === id ? updated : t)),
      error: () => this.error.set('Tour konnte nicht aktualisiert werden')
    });
  }

  delete(id: number): void {
    this.http.delete(`${this.url}/${id}`).subscribe({
      next: () => this.tours.update(list => list.filter(t => t.id !== id)),
      error: () => this.error.set('Tour konnte nicht gelöscht werden')
    });
  }
}
