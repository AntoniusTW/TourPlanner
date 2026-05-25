import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TourLog } from '../models/tour-log.model';

@Injectable({ providedIn: 'root' })
export class TourLogService {

  private logsUrl(tourId: string): string {
    return `${environment.apiBaseUrl}/tours/${tourId}/logs`;
  }

  readonly logs = signal<TourLog[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadAllForTour(tourId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<TourLog[]>(this.logsUrl(tourId)).subscribe({
      next: (data) => { this.logs.set(data); this.loading.set(false); },
      error: () => { this.error.set('Logs konnten nicht geladen werden'); this.loading.set(false); }
    });
  }

  create(tourId: string, dto: Omit<TourLog, 'id' | 'tourId' | 'createdAt'>): Observable<TourLog> {
    return this.http.post<TourLog>(this.logsUrl(tourId), dto).pipe(
      tap(created => this.logs.update(list => [created, ...list]))
    );
  }

  update(tourId: string, logId: string, dto: TourLog): Observable<TourLog> {
    return this.http.put<TourLog>(`${this.logsUrl(tourId)}/${logId}`, dto).pipe(
      tap(updated => this.logs.update(list => list.map(l => l.id === logId ? updated : l)))
    );
  }

  delete(tourId: string, logId: string): Observable<void> {
    return this.http.delete<void>(`${this.logsUrl(tourId)}/${logId}`).pipe(
      tap(() => this.logs.update(list => list.filter(l => l.id !== logId)))
    );
  }
}
