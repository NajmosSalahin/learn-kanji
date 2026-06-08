export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.8));
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) level++;
  return level;
}

export function getProgressToNextLevel(totalXP: number): {
  current: number;
  required: number;
  percentage: number;
  level: number;
} {
  const level = getLevelFromXP(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  return {
    level,
    current: totalXP - currentLevelXP,
    required: nextLevelXP - currentLevelXP,
    percentage: ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100,
  };
}

export const XP_AWARDS = {
  REVIEW_CORRECT: 5,
  REVIEW_INCORRECT: 1,
  NEW_CARD_CORRECT: 10,
  CARD_MASTERED: 50,
  PERFECT_SESSION: 75,
  DAILY_GOAL_MET: 100,
  STREAK_7: 200,
  STREAK_30: 500,
  STREAK_100: 1000,
  FIRST_REVIEW_DAY: 10,
} as const;
