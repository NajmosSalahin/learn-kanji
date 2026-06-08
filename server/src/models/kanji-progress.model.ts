import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type CardStage = "new" | "learning" | "review" | "mastered";

export interface IKanjiProgressDocument extends Document {
  userId: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const kanjiProgressSchema = new Schema<IKanjiProgressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    character: { type: String, required: true, index: true },
    interval: { type: Number, default: 0 },
    repetitions: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    dueDate: { type: Date, default: Date.now, index: true },
    stage: {
      type: String,
      enum: ["new", "learning", "review", "mastered"],
      default: "new",
    },
    totalReviews: { type: Number, default: 0 },
    correctReviews: { type: Number, default: 0 },
    lapses: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    lastReviewDate: { type: Date, default: null },
    firstReviewDate: { type: Date, default: null },
  },
  { timestamps: true }
);

kanjiProgressSchema.index({ userId: 1, character: 1 }, { unique: true });
kanjiProgressSchema.index({ userId: 1, dueDate: 1 });
kanjiProgressSchema.index({ userId: 1, stage: 1 });

export const KanjiProgress: Model<IKanjiProgressDocument> =
  mongoose.models.KanjiProgress ||
  mongoose.model<IKanjiProgressDocument>("KanjiProgress", kanjiProgressSchema);
