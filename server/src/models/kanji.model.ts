import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKanjiDocument extends Document {
  character: string;
  strokes: number;
  grade: number | null;
  freq: number | null;
  jlpt_new: number | null;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  name_readings: string[];
}

const kanjiSchema = new Schema<IKanjiDocument>(
  {
    character: { type: String, required: true, unique: true, index: true },
    strokes: { type: Number, index: true },
    grade: { type: Number, default: null, index: true },
    freq: { type: Number, default: null, index: true },
    jlpt_new: { type: Number, default: null, index: true },
    meanings: [String],
    readings_on: [String],
    readings_kun: [String],
    name_readings: [String],
  },
  { timestamps: false }
);

kanjiSchema.index(
  { meanings: "text", readings_on: "text", readings_kun: "text", name_readings: "text" },
  { name: "kanji_text_index" },
);

export const Kanji: Model<IKanjiDocument> =
  mongoose.models.Kanji || mongoose.model<IKanjiDocument>("Kanji", kanjiSchema);
