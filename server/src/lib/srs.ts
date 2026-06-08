export type CardStage = "new" | "learning" | "review" | "mastered";

export interface SRSCard {
  interval: number;
  repetitions: number;
  easeFactor: number;
}

export interface ReviewResult {
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueDate: Date;
  stage: CardStage;
}

export function calculateNextReview(card: SRSCard, quality: 1 | 2 | 3 | 5): ReviewResult {
  let { interval, repetitions, easeFactor } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = quality === 1 ? 0 : 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);
    repetitions++;
  }

  const stage: CardStage =
    interval === 0 ? "learning" :
    interval < 2 ? "learning" :
    repetitions >= 5 && interval >= 21 ? "mastered" : "review";

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return { interval, repetitions, easeFactor, dueDate, stage };
}
