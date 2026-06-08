import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
}

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiry: Date | null;
  passwordResetToken: string | null;
  passwordResetExpiry: Date | null;
  displayName: string;
  avatarUrl: string | null;
  timezone: string;
  preferences: {
    dailyGoal: number;
    newCardsPerDay: number;
    studyMode: "flashcard" | "quiz" | "mixed";
    jlptTarget: 1 | 2 | 3 | 4 | 5;
  };
  stats: {
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
  };
  achievements: {
    unlocked: IUnlockedAchievement[];
    goalStreak: number;
  };
  flags: {
    visitedExplore: boolean;
    usedAudio: boolean;
    addedToDeck: boolean;
    openedKanjiDetail: boolean;
    setGoal: boolean;
  };
  readingOnReviews: number;
  readingKunReviews: number;
  perfectDaysStreak: number;
  lastPerfectDay: string | null;
  studiedCharacters: string[];
  jlptLevelsMastered: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpiry: { type: Date, default: null },
    passwordResetToken: { type: String, default: null, index: true },
    passwordResetExpiry: { type: Date, default: null },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    timezone: { type: String, default: "UTC" },
    preferences: {
      dailyGoal: { type: Number, default: 20 },
      newCardsPerDay: { type: Number, default: 10 },
      studyMode: { type: String, enum: ["flashcard", "quiz", "mixed"], default: "mixed" },
      jlptTarget: { type: Number, enum: [1, 2, 3, 4, 5], default: 5 },
    },
    stats: {
      totalXP: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastStudyDate: { type: String, default: null },
      totalCardsStudied: { type: Number, default: 0 },
      totalCorrect: { type: Number, default: 0 },
      totalIncorrect: { type: Number, default: 0 },
      totalTimeStudied: { type: Number, default: 0 },
      kanjiLearned: { type: Number, default: 0 },
      kanjiMastered: { type: Number, default: 0 },
    },
    achievements: {
      unlocked: [{ achievementId: String, unlockedAt: { type: Date, default: Date.now } }],
      goalStreak: { type: Number, default: 0 },
    },
    flags: {
      visitedExplore: { type: Boolean, default: false },
      usedAudio: { type: Boolean, default: false },
      addedToDeck: { type: Boolean, default: false },
      openedKanjiDetail: { type: Boolean, default: false },
      setGoal: { type: Boolean, default: false },
    },
    readingOnReviews: { type: Number, default: 0 },
    readingKunReviews: { type: Number, default: 0 },
    perfectDaysStreak: { type: Number, default: 0 },
    lastPerfectDay: { type: String, default: null },
    studiedCharacters: [{ type: String }],
    jlptLevelsMastered: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.index({ emailVerificationToken: 1 });

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);
