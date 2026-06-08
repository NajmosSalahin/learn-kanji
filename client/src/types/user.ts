export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: Date;
}

export interface UserPreferences {
  dailyGoal: number;
  newCardsPerDay: number;
  studyMode: "flashcard" | "quiz" | "mixed";
  jlptTarget: 1 | 2 | 3 | 4 | 5;
  timezone: string;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalCardsStudied: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalTimeStudied: number;
  kanjiLearned: number;
  kanjiMastered: number;
}
