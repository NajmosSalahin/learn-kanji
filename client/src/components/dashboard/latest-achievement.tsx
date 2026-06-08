import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { AchievementsResponse } from "@/types/achievement";

const INSTANT_ACHIEVEMENTS = [
  { icon: "👣", name: "一歩" },
  { icon: "✅", name: "正解" },
  { icon: "🌸", name: "桜" },
  { icon: "🔊", name: "初音" },
  { icon: "📚", name: "図書館" },
];

export function LatestAchievement() {
  const { data } = useQuery<AchievementsResponse>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60000,
  });

  const unlocked = data?.achievements?.filter((a) => a.unlocked) ?? [];
  const total = data?.achievements?.length ?? 39;
  const latest = unlocked.length > 0
    ? unlocked.reduce((a, b) =>
        new Date(a.unlockedAt || 0) > new Date(b.unlockedAt || 0) ? a : b
      )
    : null;

  const displayName = latest?.nameRomaji
    ? `${latest.name} (${latest.nameRomaji})`
    : latest?.name;

  const punPreview = latest?.pun
    ? latest.pun.length > 80
      ? latest.pun.slice(0, 80) + "..."
      : latest.pun
    : null;

  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">🏆 Achievements</h3>
        {unlocked.length > 0 && (
          <Link to="/achievements" className="text-xs text-accent hover:underline">
            View all
          </Link>
        )}
      </div>

      {latest ? (
        <div className="flex-1">
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{latest.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-text-primary text-sm leading-tight">{displayName}</p>
                <p className="text-xs text-text-secondary mt-0.5">{latest.desc}</p>
                {latest.unlockedAt && (
                  <p className="text-[10px] text-text-secondary/50 mt-1">
                    Earned {new Date(latest.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {punPreview && (
              <p className="mt-2 text-xs text-text-secondary/70 leading-relaxed border-t border-accent/10 pt-2 italic">
                "{punPreview}"
              </p>
            )}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <span>Progress</span>
              <span>{unlocked.length}/{total} unlocked</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${(unlocked.length / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="flex gap-2 mb-3">
            {INSTANT_ACHIEVEMENTS.map((a) => (
              <span key={a.name} className="text-xl opacity-60 grayscale" title={a.name}>
                {a.icon}
              </span>
            ))}
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Complete your first review to start earning achievements
          </p>
          <p className="text-xs text-text-secondary/50 mt-1">
            {total} hidden gems waiting for you
          </p>
          <Link
            to="/study"
            className="mt-4 rounded-lg bg-accent px-5 py-2 text-xs font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Start studying →
          </Link>
        </div>
      )}
    </div>
  );
}
