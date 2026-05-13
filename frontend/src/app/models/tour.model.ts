export type TransportType = 'CAR' | 'BICYCLE' | 'WALKING' | 'RUNNING';

export interface Tour {
  id?: string;          // optional beim Erstellen, vorhanden nach dem Speichern
  name: string;
  description?: string;
  fromLocation: string;
  toLocation: string;
  transportType: TransportType;
  distance?: number;
  estimatedTime?: number;
  imagePath?: string;
  createdAt?: string;   // ISO-8601 String aus dem Backend (Instant → JSON)
  updatedAt?: string;
}

export const TRANSPORT_TYPE_LABELS: Record<TransportType, string> = {
  CAR:      'Auto',
  BICYCLE:  'Fahrrad',
  WALKING:  'Zu Fuß',
  RUNNING:  'Laufen'
};

export const TRANSPORT_TYPE_ICONS: Record<TransportType, string> = {
  CAR:      '🚗',
  BICYCLE:  '🚴',
  WALKING:  '🚶',
  RUNNING:  '🏃'
};
