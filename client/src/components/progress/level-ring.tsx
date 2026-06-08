import { useProgress } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";

export function LevelRing() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  const level = data?.user.level || 1;
  const xpProgress = data?.user.xpProgress || 0;
  const totalXP = data?.user.totalXP || 0;
  const xpToNext = data?.user.xpToNextLevel || 100;

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (xpProgress / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e2d44" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="#e8a045"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-accent">{level}</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-text-secondary">Level {level}</p>
        <p className="text-lg font-bold text-text-primary">{totalXP.toLocaleString()} XP</p>
        <p className="text-xs text-text-secondary">
          {Math.round(xpProgress)}% to level {level + 1}
          <br />({Math.round(xpToNext - (totalXP % xpToNext))} XP needed)
        </p>
      </div>
    </div>
  );
}
