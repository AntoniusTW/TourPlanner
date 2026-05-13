import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tour } from '../models/tour.model';

/**
 * ViewModel für alle Tour-Views.
 * Hält State via Signals und stellt Actions bereit — Components binden nur.
 */
@Injectable({ providedIn: 'root' })
export class TourService {

  private readonly url = `${environment.apiBaseUrl}/tours`;

  readonly tours = signal<Tour[]>([]);
  readonly selectedTour = signal<Tour | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  selectTour(tour: Tour | null): void {
    this.selectedTour.set(tour);
  }

  /** Lädt eine einzelne Tour vom Backend und setzt sie als selectedTour. */
  loadById(id: string): void {
    this.http.get<Tour>(`${this.url}/${id}`).subscribe({
      next: (tour) => this.selectedTour.set(tour),
      error: () => this.error.set(`Tour ${id} nicht gefunden`)
    });
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Tour[]>(this.url).subscribe({
      next: (data) => { this.tours.set(data); this.loading.set(false); },
      error: () => { this.error.set('Touren konnten nicht geladen werden'); this.loading.set(false); }
    });
  }

  create(tour: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>): Observable<Tour> {
    return this.http.post<Tour>(this.url, tour).pipe(
      tap(created => this.tours.update(list => [...list, created]))
    );
  }

  update(id: string, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`${this.url}/${id}`, tour).pipe(
      tap(updated => this.tours.update(list => list.map(t => t.id === id ? updated : t)))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.tours.update(list => list.filter(t => t.id !== id));
        if (this.selectedTour()?.id === id) this.selectedTour.set(null);
      })
    );
  }
}
