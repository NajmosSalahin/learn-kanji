export interface APIError {
  error: string;
  code?: string;
  retryAfter?: number;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
}

export interface ProgressResponse {
  user: {
    displayName: string;
    level: number;
    totalXP: number;
    xpToNextLevel: number;
    xpProgress: number;
  };
  stats: import("./user").UserStats;
  breakdown: {
    byJlpt: Record<"N1" | "N2" | "N3" | "N4" | "N5" | "Other", { total: number; learned: number; mastered: number }>;
    byStage: Record<import("./kanji").CardStage, number>;
  };
}

export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  studiedToday: boolean;
  weeklyActivity: boolean[];
}

export interface HeatmapEntry {
  date: string;
  count: number;
  goalMet: boolean;
}
