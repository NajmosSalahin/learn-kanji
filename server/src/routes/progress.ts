import { Router, type Request, type Response } from "express";
import { connectDB } from "../lib/db.js";
import { User } from "../models/user.model.js";
import { KanjiProgress } from "../models/kanji-progress.model.js";
import { StreakRecord } from "../models/streak-record.model.js";
import { getProgressToNextLevel } from "../lib/xp.js";
import { getTodayString, getDateDaysAgo } from "../lib/streak.js";
import type { CardStage } from "../lib/srs.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const xpProgress = getProgressToNextLevel(user.stats.totalXP);

    const stages = await KanjiProgress.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
    ]);

    const byStage: Record<CardStage, number> = {
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
    };

    for (const s of stages) {
      byStage[s._id as CardStage] = s.count;
    }

    const jlptBreakdown = await KanjiProgress.aggregate([
      { $match: { userId: user._id } },
      {
        $lookup: {
          from: "kanjis",
          localField: "character",
          foreignField: "character",
          as: "kanji",
        },
      },
      { $unwind: { path: "$kanji", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$kanji.jlpt_new", 0] },
          total: { $sum: 1 },
          learned: {
            $sum: { $cond: [{ $in: ["$stage", ["review", "mastered"]] }, 1, 0] },
          },
          mastered: {
            $sum: { $cond: [{ $eq: ["$stage", "mastered"] }, 1, 0] },
          },
        },
      },
    ]);

    const byJlpt: Record<string, { total: number; learned: number; mastered: number }> = {
      N1: { total: 0, learned: 0, mastered: 0 },
      N2: { total: 0, learned: 0, mastered: 0 },
      N3: { total: 0, learned: 0, mastered: 0 },
      N4: { total: 0, learned: 0, mastered: 0 },
      N5: { total: 0, learned: 0, mastered: 0 },
      Other: { total: 0, learned: 0, mastered: 0 },
    };

    for (const j of jlptBreakdown) {
      const key = j._id === 0 ? "Other" : `N${j._id}`;
      if (byJlpt[key]) {
        byJlpt[key] = { total: j.total, learned: j.learned, mastered: j.mastered };
      }
    }

    res.json({
      user: {
        displayName: user.displayName,
        level: user.stats.level,
        totalXP: user.stats.totalXP,
        xpToNextLevel: xpProgress.required,
        xpProgress: xpProgress.percentage,
      },
      stats: user.stats,
      breakdown: { byJlpt, byStage },
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/heatmap", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const today = getTodayString(user.timezone);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const startDate = oneYearAgo.toISOString().split("T")[0];

    const records = await StreakRecord.find({
      userId,
      date: { $gte: startDate, $lte: today },
    })
      .sort({ date: 1 })
      .lean();

    const recordMap = new Map(records.map((r) => [r.date, r]));

    const result = [];
    const start = new Date(startDate);
    const end = new Date(today);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const record = recordMap.get(dateStr);
      result.push({
        date: dateStr,
        count: record?.cardsStudied || 0,
        goalMet: record?.goalMet || false,
      });
    }

    res.json(result);
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/streak", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const today = getTodayString(user.timezone);

    const weeklyRecords = await StreakRecord.find({
      userId,
      date: { $gte: getDateDaysAgo(6) },
    })
      .sort({ date: -1 })
      .lean();

    const dateSet = new Set(weeklyRecords.map((r) => r.date));
    const weeklyActivity: boolean[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = getDateDaysAgo(i);
      weeklyActivity.push(dateSet.has(d));
    }

    res.json({
      currentStreak: user.stats.currentStreak,
      longestStreak: user.stats.longestStreak,
      lastStudyDate: user.stats.lastStudyDate,
      studiedToday: user.stats.lastStudyDate === today,
      weeklyActivity,
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
