import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import confetti from "canvas-confetti";

import type { AchievementEvent } from "@/types/achievement";

interface SessionSummaryProps {
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  xpEarned: number;
  levelUp: { from: number; to: number } | null;
  streakMilestone: number | null;
  newAchievements?: AchievementEvent[];
}

export function SessionSummary({
  totalCards,
  correctCount,
  incorrectCount,
  xpEarned,
  levelUp,
  streakMilestone,
  newAchievements = [],
}: SessionSummaryProps) {
  const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  useEffect(() => {
    if (levelUp || streakMilestone) {
      const colors = ["#e8a045", "#f0f4ff", "#34d399"];
      confetti({
        particleCount: 100,
        spread: 70,
        colors,
        origin: { y: 0.6 },
      });
    }
  }, [levelUp, streakMilestone]);

  return (
    <div className="mx-auto max-w-md space-y-6">
      {levelUp && (
        <div className="animate-pulse-glow rounded-xl border border-accent/50 bg-accent/10 p-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-accent">Level Up!</h2>
          <p className="mt-1 text-text-primary">
            {levelUp.from} → {levelUp.to}
          </p>
        </div>
      )}

      {streakMilestone && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
          <p className="font-heading font-bold text-accent">
            {streakMilestone}-day streak milestone!
          </p>
        </div>
      )}

      {newAchievements.length > 0 && (
        <div className="rounded-xl border border-accent/40 bg-accent/5 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
            Achievements Unlocked
          </h3>
          <div className="space-y-2">
            {newAchievements.map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-sm text-text-primary">
                <span>{a.icon}</span>
                <span>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="font-kanji text-6xl text-accent">{accuracy}%</p>
        <p className="mt-2 text-sm text-text-secondary">accuracy</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-400">{correctCount}</p>
          <p className="text-xs text-text-secondary">Correct</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-red-400">{incorrectCount}</p>
          <p className="text-xs text-text-secondary">Incorrect</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent">{xpEarned}</p>
          <p className="text-xs text-text-secondary">XP earned</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-text-primary">{totalCards}</p>
          <p className="text-xs text-text-secondary">Total cards</p>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link to="/study" className="flex-1">
          <Button variant="secondary" className="w-full">
            Study more
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button className="w-full">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
