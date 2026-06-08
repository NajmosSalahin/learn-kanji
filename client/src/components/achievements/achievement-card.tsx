import { useState } from "react";
import type { AchievementWithStatus } from "@/types/achievement";

interface AchievementCardProps {
  achievement: AchievementWithStatus;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const displayName = achievement.nameRomaji
    ? `${achievement.name} (${achievement.nameRomaji})`
    : achievement.name;

  const punPreview = achievement.pun.split(/[.!?]\s/)[0] + ".";

  const hoverTitle = achievement.unlocked
    ? punPreview + " Click to read more."
    : "🔒 Unlock to discover the story.";

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        title={hoverTitle}
        className={`relative cursor-pointer rounded-xl border p-4 transition-all hover:-translate-y-1 hover:shadow-md ${
          achievement.unlocked
            ? "border-accent/40 bg-accent/5 shadow-sm shadow-accent/10"
            : "border-border bg-surface/50 opacity-50 grayscale hover:opacity-80 hover:border-accent/20"
        }`}
      >
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-text-secondary/10 text-[10px] text-text-secondary/60">
          ?
        </div>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{achievement.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-text-primary truncate">{displayName}</h3>
            <p className="text-xs text-text-secondary mt-0.5">{achievement.desc}</p>
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-[10px] text-text-secondary/50 mt-1">
                Earned {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {achievement.unlocked && (
            <span className="shrink-0 text-xs text-accent font-medium">✓</span>
          )}
        </div>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="text-5xl">{achievement.icon}</span>
              <h2 className="mt-3 font-heading text-xl font-bold text-text-primary">
                {displayName}
              </h2>
              {achievement.nameRomaji && (
                <p className="text-sm text-text-secondary/60 mt-0.5">
                  {achievement.name} · {achievement.nameRomaji}
                </p>
              )}
              <p className="mt-2 text-sm text-text-secondary">{achievement.desc}</p>
              <div className="mt-4 rounded-xl bg-accent/5 border border-accent/20 p-4 text-left relative overflow-hidden">
                {achievement.unlocked ? (
                  <p className="text-sm text-text-primary leading-relaxed">
                    {achievement.pun}
                  </p>
                ) : (
                  <div className="relative">
                    <p className="text-sm text-text-primary leading-relaxed blur-sm select-none">
                      {achievement.pun}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1 rounded-lg bg-background/80 px-4 py-2 text-xs text-text-secondary">
                        <span>🔒</span>
                        <span>Unlock this achievement to discover the story</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="mt-4 text-xs text-accent font-medium">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
              {!achievement.unlocked && (
                <p className="mt-4 text-xs text-text-secondary/50">Locked</p>
              )}
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="mt-5 w-full rounded-lg border border-border py-2 text-sm text-text-primary transition-colors hover:bg-surface/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function AchievementGrid({ achievements }: { achievements: AchievementWithStatus[] }) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-6">
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-3">
            Unlocked ({unlocked.length}/{achievements.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}
      {locked.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
            Locked ({locked.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
