import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStreakRecordDocument extends Document {
  userId: Types.ObjectId;
  date: string;
  studied: boolean;
  cardsStudied: number;
  goalMet: boolean;
}

const streakRecordSchema = new Schema<IStreakRecordDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    studied: { type: Boolean, default: false },
    cardsStudied: { type: Number, default: 0 },
    goalMet: { type: Boolean, default: false },
  },
  { timestamps: false }
);

streakRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

export const StreakRecord: Model<IStreakRecordDocument> =
  mongoose.models.StreakRecord ||
  mongoose.model<IStreakRecordDocument>("StreakRecord", streakRecordSchema);
