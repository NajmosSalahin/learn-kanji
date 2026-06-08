import { Router, type Request, type Response } from "express";
import { connectDB } from "../lib/db.js";
import { User } from "../models/user.model.js";
import { ACHIEVEMENT_DEFS, checkAchievements } from "../lib/achievements.js";

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

    const unlocked = (user.achievements?.unlocked ?? []).map((u) => ({
      achievementId: u.achievementId,
      unlockedAt: u.unlockedAt,
    }));

    const all = ACHIEVEMENT_DEFS.map((def) => {
      const entry = unlocked.find((u) => u.achievementId === def.id);
      return {
        ...def,
        unlocked: !!entry,
        unlockedAt: entry?.unlockedAt || null,
      };
    });

    res.json({
      achievements: all,
      totalXP: user.stats.totalXP,
      level: user.stats.level,
    });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/flag", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { flag } = req.body;
    const validFlags = ["visitedExplore", "usedAudio", "addedToDeck", "openedKanjiDetail", "setGoal"];
    if (!flag || !validFlags.includes(flag)) {
      res.status(400).json({ error: "Invalid flag." });
      return;
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if ((user.flags as any)?.[flag]) {
      res.json({ newAchievements: [] });
      return;
    }

    (user.flags as any)[flag] = true;
    await user.save();

    const newAchievements = checkAchievements(
      (user.achievements?.unlocked ?? []) as { achievementId: string; unlockedAt: Date }[],
      user.stats,
      {
        perfectSession: false,
        sessionCards: 0,
        sessionDuration: 0,
        sessionStartHour: 0,
        goalStreak: user.achievements?.goalStreak ?? 0,
        readingOnCount: user.readingOnReviews ?? 0,
        readingKunCount: user.readingKunReviews ?? 0,
        studiedCharacters: user.studiedCharacters ?? [],
        perfectDaysStreak: user.perfectDaysStreak ?? 0,
        daysSinceLastStudy: 0,
        firstCorrect: false,
        jlptLevelsMastered: user.jlptLevelsMastered ?? [],
      },
      user.flags as {
        visitedExplore: boolean;
        usedAudio: boolean;
        addedToDeck: boolean;
        openedKanjiDetail: boolean;
        setGoal: boolean;
      },
    );

    const newAchievementEvents: { id: string; name: string; icon: string; description: string }[] = [];
    if (newAchievements.length > 0) {
      if (!user.achievements) user.achievements = { unlocked: [], goalStreak: 0 };
      for (const a of newAchievements) {
        user.achievements.unlocked.push({ achievementId: a.id, unlockedAt: new Date() });
        newAchievementEvents.push({ id: a.id, name: a.name, icon: a.icon, description: a.desc });
      }
      await user.save();
    }

    res.json({ newAchievements: newAchievementEvents });
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
