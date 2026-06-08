export interface IKanji {
  character: string;
  strokes: number;
  grade: number | null;
  freq: number | null;
  jlpt_new: number | null;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  name_readings: string[];
  readings_on_romaji: string[];
  readings_kun_romaji: string[];
  name_readings_romaji: string[];
}

export interface KanjiProgressData {
  stage: CardStage;
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueDate: Date;
  totalReviews: number;
  correctReviews: number;
  lapses: number;
  xpEarned: number;
  lastReviewDate: Date | null;
  firstReviewDate: Date | null;
}

export interface KanjiWithProgress extends IKanji {
  progress?: KanjiProgressData | null;
}

export type CardStage = "new" | "learning" | "review" | "mastered";

export type Quality = 1 | 2 | 3 | 5;
