import { Router, type Request, type Response } from "express";
import { addToDeckSchema, reviewSchema } from "../lib/validations.js";
import { connectDB } from "../lib/db.js";
import { Kanji } from "../models/kanji.model.js";
import { KanjiProgress } from "../models/kanji-progress.model.js";
import { User } from "../models/user.model.js";
import { StudySession } from "../models/study-session.model.js";
import { StreakRecord } from "../models/streak-record.model.js";
import { calculateNextReview } from "../lib/srs.js";
import { getLevelFromXP, XP_AWARDS } from "../lib/xp.js";
import { calculateStreak, getTodayString } from "../lib/streak.js";
import { env } from "../env.js";

const router = Router();

router.post("/add", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = addToDeckSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { character } = parsed.data;

    await connectDB();

    const kanji = await Kanji.findOne({ character });
    if (!kanji) {
      res.status(404).json({ error: "Kanji not found in database." });
      return;
    }

    const existing = await KanjiProgress.findOne({ userId, character });
    if (existing) {
      res.status(409).json({ error: "Kanji already in your deck." });
      return;
    }

    const progress = await KanjiProgress.create({
      userId,
      character,
      stage: "new",
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: new Date(),
    });

    res.json({
      message: "Kanji added to your deck!",
      progress: {
        _id: progress._id.toString(),
        character: progress.character,
        stage: progress.stage,
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/remove", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { character } = req.body;
    if (!character) {
      res.status(400).json({ error: "Character is required." });
      return;
    }

    await connectDB();
    const result = await KanjiProgress.deleteOne({ userId, character });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Kanji not found in your deck." });
      return;
    }

    res.json({ message: "Removed from your deck." });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/review", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { character, quality, sessionStartTime } = parsed.data;

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const today = getTodayString(user.timezone);

    let progress = await KanjiProgress.findOne({ userId, character });
    const isNew = !progress || progress.stage === "new";

    if (!progress) {
      progress = new KanjiProgress({
        userId,
        character,
        stage: "new",
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: new Date(),
        firstReviewDate: new Date(),
      });
    }

    const before = progress.stage;
    const result = calculateNextReview(progress, quality);

    const correct = quality >= 3;
    const earnedLevel = before === "new" && correct ? XP_AWARDS.NEW_CARD_CORRECT
      : correct ? XP_AWARDS.REVIEW_CORRECT
      : XP_AWARDS.REVIEW_INCORRECT;

    const wasMastered = progress.stage !== "mastered" && result.stage === "mastered";
    const milestoneBonus = wasMastered ? XP_AWARDS.CARD_MASTERED : 0;

    let xpAwarded = earnedLevel + milestoneBonus;

    const isFirstToday = user.stats.lastStudyDate !== today;
    if (isFirstToday) {
      xpAwarded += XP_AWARDS.FIRST_REVIEW_DAY;
    }

    progress.interval = result.interval;
    progress.repetitions = result.repetitions;
    progress.easeFactor = result.easeFactor;
    progress.dueDate = result.dueDate;
    progress.stage = result.stage;
    progress.totalReviews += 1;
    if (correct) progress.correctReviews += 1;
    if (!correct && before !== "new") progress.lapses += 1;
    progress.xpEarned += xpAwarded;
    progress.lastReviewDate = new Date();
    await progress.save();

    const oldLevel = user.stats.level;
    user.stats.totalXP += xpAwarded;
    user.stats.totalCardsStudied += 1;
    if (correct) user.stats.totalCorrect += 1;
    else user.stats.totalIncorrect += 1;
    user.stats.level = getLevelFromXP(user.stats.totalXP);

    if (result.stage === "mastered" && before !== "mastered") {
      user.stats.kanjiMastered += 1;
    }
    if (result.stage === "review" && before === "learning") {
      user.stats.kanjiLearned += 1;
    }

    const levelUp = oldLevel !== user.stats.level
      ? { from: oldLevel, to: user.stats.level }
      : null;

    if (isFirstToday) {
      const streak = calculateStreak(user.stats.currentStreak, user.stats.lastStudyDate, today);
      user.stats.currentStreak = streak.current;
      if (streak.current > user.stats.longestStreak) {
        user.stats.longestStreak = streak.current;
      }

      await StreakRecord.findOneAndUpdate(
        { userId, date: today },
        { userId, date: today, studied: true, cardsStudied: 1, goalMet: false },
        { upsert: true }
      );
    } else {
      await StreakRecord.findOneAndUpdate(
        { userId, date: today },
        { $inc: { cardsStudied: 1 }, studied: true },
        { upsert: true }
      );
    }

    user.stats.lastStudyDate = today;

    let streakMilestone: number | null = null;
    if (user.stats.currentStreak === 7) streakMilestone = 7;
    else if (user.stats.currentStreak === 30) streakMilestone = 30;
    else if (user.stats.currentStreak === 100) streakMilestone = 100;

    await user.save();

    if (sessionStartTime) {
      const start = new Date(sessionStartTime);
      const duration = Math.floor((Date.now() - start.getTime()) / 1000);
      await StudySession.findOneAndUpdate(
        { userId, date: today },
        {
          $inc: {
            cardsStudied: 1,
            newCards: isNew ? 1 : 0,
            reviewCards: isNew ? 0 : 1,
            correctAnswers: correct ? 1 : 0,
            incorrectAnswers: correct ? 0 : 1,
            xpEarned: xpAwarded,
            durationSeconds: Math.min(duration, 3600),
          },
          $setOnInsert: { dailyGoalMet: false },
        },
        { upsert: true }
      );
    }

    res.json({
      progress: {
        _id: progress._id.toString(),
        userId: progress.userId.toString(),
        character: progress.character,
        interval: progress.interval,
        repetitions: progress.repetitions,
        easeFactor: progress.easeFactor,
        dueDate: progress.dueDate,
        stage: progress.stage,
        totalReviews: progress.totalReviews,
        correctReviews: progress.correctReviews,
        lapses: progress.lapses,
        xpEarned: progress.xpEarned,
        lastReviewDate: progress.lastReviewDate,
        firstReviewDate: progress.firstReviewDate,
      },
      xpAwarded,
      totalXP: user.stats.totalXP,
      levelUp,
      streakMilestone,
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/deck", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const newCardsPerDay = user.preferences.newCardsPerDay;
    const now = new Date();

    const [newCards, dueCards] = await Promise.all([
      KanjiProgress.find({ userId, stage: "new" })
        .limit(newCardsPerDay)
        .lean(),
      KanjiProgress.find({
        userId,
        stage: { $in: ["learning", "review"] },
        dueDate: { $lte: now },
      })
        .sort({ dueDate: 1 })
        .limit(50)
        .lean(),
    ]);

    const allCharacters = [...newCards, ...dueCards].map(c => c.character);
    const [kanjiDocs, distractors] = await Promise.all([
      allCharacters.length > 0
        ? Kanji.find({ character: { $in: allCharacters } }).lean()
        : Promise.resolve([]),
      Kanji.aggregate([
        { $match: allCharacters.length > 0 ? { character: { $nin: allCharacters } } : {} },
        { $sample: { size: 10 } },
        { $project: { character: 1, meanings: 1, readings_on: 1, readings_kun: 1, name_readings: 1 } },
      ]),
    ]);

    const kanjiMap = new Map(kanjiDocs.map(k => [k.character, k]));

    const enrichCard = (card: Record<string, any>) => {
      const kd = kanjiMap.get(card.character);
      return {
        ...card,
        _id: card._id?.toString(),
        userId: card.userId?.toString(),
        kanjiData: kd ? {
          meanings: kd.meanings,
          readings_on: kd.readings_on,
          readings_kun: kd.readings_kun,
          name_readings: kd.name_readings,
        } : null,
      };
    };

    const studiedToday = await KanjiProgress.countDocuments({
      userId,
      lastReviewDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    res.json({
      newCards: newCards.map(enrichCard),
      dueCards: dueCards.map(enrichCard),
      distractors,
      todayStats: {
        studiedToday,
        goalMet: studiedToday >= user.preferences.dailyGoal,
        dailyGoal: user.preferences.dailyGoal,
        newCardsTodayCount: newCards.length,
      },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
