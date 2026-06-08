import type { CardStage, Quality } from "./kanji";

export interface KanjiCardData {
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  name_readings: string[];
}

export interface KanjiProgress {
  _id: string;
  userId: string;
  character: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueDate: Date;
  stage: CardStage;
  totalReviews: number;
  correctReviews: number;
  lapses: number;
  xpEarned: number;
  lastReviewDate: Date | null;
  firstReviewDate: Date | null;
  kanjiData: KanjiCardData | null;
}

export interface Distractor {
  character: string;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  name_readings: string[];
}

export interface StudyDeck {
  newCards: KanjiProgress[];
  dueCards: KanjiProgress[];
  distractors: Distractor[];
  todayStats: TodayStats;
}

export interface TodayStats {
  studiedToday: number;
  goalMet: boolean;
  dailyGoal: number;
  newCardsTodayCount: number;
}

export interface ReviewResponse {
  progress: KanjiProgress;
  xpAwarded: number;
  totalXP: number;
  levelUp: { from: number; to: number } | null;
  streakMilestone: number | null;
}

export interface ReviewedCard {
  character: string;
  quality: Quality;
  correct: boolean;
  xpEarned: number;
  stage: CardStage;
}

export type SessionStatus = "idle" | "loading" | "active" | "complete";
