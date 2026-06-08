import { useProgress } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";

export function AccuracyTrend() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  const stats = data?.stats;
  const accuracy = stats && stats.totalCardsStudied > 0
    ? Math.round((stats.totalCorrect / stats.totalCardsStudied) * 100)
    : 0;

  const trend = stats && stats.totalCardsStudied > 0
    ? stats.totalCorrect / stats.totalCardsStudied >= 0.7 ? "up" : "down"
    : "neutral";

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-text-primary">Overall accuracy</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-text-primary">{accuracy}%</span>
        <span className={`text-sm ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-text-secondary"}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
        </span>
      </div>
      <div className="mt-1 flex gap-4 text-xs text-text-secondary">
        <span>{stats?.totalCorrect || 0} correct</span>
        <span>{stats?.totalIncorrect || 0} incorrect</span>
      </div>
    </div>
  );
}
