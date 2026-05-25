export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
  service: string;
}
