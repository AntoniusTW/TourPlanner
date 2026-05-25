export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface TourLog {
  id?: string;
  tourId?: string;
  date: string;           // ISO-8601 date string (LocalDate → JSON)
  duration: number;       // Minuten
  distance?: number;      // km
  rating: number;         // 1–5
  comment?: string;
  difficulty: DifficultyLevel;
  createdAt?: string;
}

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  EASY:   'Leicht',
  MEDIUM: 'Mittel',
  HARD:   'Schwer'
};
