import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HealthStatus } from '../models/health.model';

/**
 * ViewModel for the health check view.
 * Holds state (signals) and exposes actions — the component only binds and calls.
 */
@Injectable({ providedIn: 'root' })
export class HealthService {

  private readonly url = `${environment.apiBaseUrl}/health`;

  readonly status = signal<HealthStatus | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ping(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<HealthStatus>(this.url).subscribe({
      next: (response) => {
        this.status.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Backend nicht erreichbar');
        this.status.set(null);
        this.loading.set(false);
      }
    });
  }
}
