export interface AchievementCriteria {
  type:
    | "total_reviews"
    | "kanji_mastered"
    | "streak"
    | "accuracy"
    | "perfect_session"
    | "session_cards"
    | "goal_streak"
    | "flag"
    | "time_of_day"
    | "speed"
    | "reading_collection"
    | "feature_discovery"
    | "comeback"
    | "perfect_streak";
  threshold?: number;
  flag?: string;
  startHour?: number;
  endHour?: number;
  timeLimit?: number;
  subtype?: "on" | "kun";
  keywords?: string[];
}

export interface AchievementDef {
  id: string;
  icon: string;
  name: string;
  nameRomaji: string | null;
  desc: string;
  pun: string;
  criteria: AchievementCriteria;
}

export interface AchievementEntry {
  achievementId: string;
  unlockedAt: string;
}

export interface AchievementWithStatus extends AchievementDef {
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface AchievementEvent {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface AchievementsResponse {
  achievements: AchievementWithStatus[];
  totalXP: number;
  level: number;
}
