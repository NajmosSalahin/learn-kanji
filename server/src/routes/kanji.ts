import { Router, type Request, type Response } from "express";
import { connectDB } from "../lib/db.js";
import { Kanji } from "../models/kanji.model.js";
import { KanjiProgress } from "../models/kanji-progress.model.js";
import { initKanjiSearch, searchKanji } from "../lib/kanji-search.js";
import { readingsToRomaji } from "../lib/romaji.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    await connectDB();

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 24));
    const search = (req.query.search as string) || "";
    const jlpt = req.query.jlpt as string;
    const grade = req.query.grade as string;
    const strokes = req.query.strokes as string;
    const includeProgress = req.query.includeProgress === "true";
    const userId = (req as any).userId;

    let kanjiList: Record<string, any>[];
    let total: number;

    if (search) {
      await initKanjiSearch();
      let results = searchKanji(search, { jlpt, grade, strokes });
      total = results.length;
      const skip = (page - 1) * limit;
      kanjiList = results.slice(skip, skip + limit).map((r) => r.item);
    } else {
      const filter: Record<string, unknown> = {};

      if (jlpt) {
        if (jlpt === "other") {
          filter.jlpt_new = { $in: [null, 0] };
        } else {
          const jlptNum = parseInt(jlpt);
          if (jlptNum >= 1 && jlptNum <= 5) filter.jlpt_new = jlptNum;
        }
      }

      if (grade) {
        if (grade === "other") {
          filter.grade = { $in: [null, 0] };
        } else {
          const gradeNum = parseInt(grade);
          if (gradeNum >= 1 && gradeNum <= 8) filter.grade = gradeNum;
        }
      }

      if (strokes) {
        const strokesNum = parseInt(strokes);
        if (strokesNum >= 1 && strokesNum <= 30) filter.strokes = strokesNum;
      }

      const skip = (page - 1) * limit;
      [total, kanjiList] = await Promise.all([
        Kanji.countDocuments(filter),
        Kanji.find(filter).skip(skip).limit(limit).lean(),
      ]);
    }

    const mapKanji = (k: Record<string, any>) => ({
      character: k.character,
      strokes: k.strokes,
      grade: k.grade,
      freq: k.freq,
      jlpt_new: k.jlpt_new,
      meanings: k.meanings,
      readings_on: k.readings_on,
      readings_kun: k.readings_kun,
      name_readings: k.name_readings,
      readings_on_romaji: readingsToRomaji(k.readings_on),
      readings_kun_romaji: readingsToRomaji(k.readings_kun),
      name_readings_romaji: readingsToRomaji(k.name_readings),
    });

    let results = kanjiList.map(mapKanji);

    if (includeProgress && userId) {
      const characters = kanjiList.map((k) => k.character);
      const progressDocs = await KanjiProgress.find({
        userId,
        character: { $in: characters },
      }).lean();

      const progressMap: Record<string, { stage: string; interval: number; dueDate: Date }> = {};
      for (const p of progressDocs) {
        progressMap[p.character] = {
          stage: p.stage,
          interval: p.interval,
          dueDate: p.dueDate,
        };
      }

      results = results.map((r) => ({
        ...r,
        progress: progressMap[r.character] || null,
      }));
    } else {
      results = results.map((r) => ({ ...r, progress: null }));
    }

    res.json({
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/:character", async (req: Request, res: Response) => {
  try {
    const { character } = req.params;
    await connectDB();

    const kanji = await Kanji.findOne({ character }).lean();
    if (!kanji) {
      res.status(404).json({ error: "Kanji not found." });
      return;
    }

    const userId = (req as any).userId;
    let progress = null;

    if (userId) {
      const p = await KanjiProgress.findOne({ userId, character }).lean();
      if (p) {
        progress = {
          stage: p.stage,
          interval: p.interval,
          repetitions: p.repetitions,
          easeFactor: p.easeFactor,
          dueDate: p.dueDate,
          totalReviews: p.totalReviews,
          correctReviews: p.correctReviews,
          lapses: p.lapses,
          xpEarned: p.xpEarned,
        };
      }
    }

    res.json({
      data: {
        character: kanji.character,
        strokes: kanji.strokes,
        grade: kanji.grade,
        freq: kanji.freq,
        jlpt_new: kanji.jlpt_new,
        meanings: kanji.meanings,
        readings_on: kanji.readings_on,
        readings_kun: kanji.readings_kun,
        name_readings: kanji.name_readings,
        readings_on_romaji: readingsToRomaji(kanji.readings_on),
        readings_kun_romaji: readingsToRomaji(kanji.readings_kun),
        name_readings_romaji: readingsToRomaji(kanji.name_readings),
        progress,
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
