import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStudySessionDocument extends Document {
  userId: Types.ObjectId;
  date: string;
  cardsStudied: number;
  newCards: number;
  reviewCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  xpEarned: number;
  durationSeconds: number;
  dailyGoalMet: boolean;
  createdAt: Date;
}

const studySessionSchema = new Schema<IStudySessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    cardsStudied: { type: Number, default: 0 },
    newCards: { type: Number, default: 0 },
    reviewCards: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    durationSeconds: { type: Number, default: 0 },
    dailyGoalMet: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studySessionSchema.index({ userId: 1, date: 1 });

export const StudySession: Model<IStudySessionDocument> =
  mongoose.models.StudySession ||
  mongoose.model<IStudySessionDocument>("StudySession", studySessionSchema);
