export type TransportType = 'CAR' | 'BICYCLE' | 'WALKING' | 'RUNNING';

export interface Tour {
  id?: string;
  name: string;
  description?: string;
  fromLocation: string;
  toLocation: string;
  transportType: TransportType;
  distance?: number;
  estimatedTime?: number;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const TRANSPORT_TYPE_LABELS: Record<TransportType, string> = {
  CAR: 'Auto',
  BICYCLE: 'Fahrrad',
  WALKING: 'Zu Fuß',
  RUNNING: 'Laufen'
};
