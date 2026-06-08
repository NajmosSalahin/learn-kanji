import { useProgress } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";

export function MasteryChart() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  const byJlpt = data?.breakdown.byJlpt;
  if (!byJlpt) return null;

  const levels = ["N5", "N4", "N3", "N2", "N1", "Other"] as const;
  const maxTotal = Math.max(...levels.map((l) => byJlpt[l]?.total || 0), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">Mastery by JLPT level</h3>
      <div className="space-y-3">
        {levels.map((key) => {
          const data2 = byJlpt[key];
          if (!data2 || data2.total === 0) return null;

          const learnedPct = (data2.learned / maxTotal) * 100;
          const masteredPct = (data2.mastered / maxTotal) * 100;

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-text-primary">{key}</span>
                <span className="text-text-secondary">
                  {data2.learned}/{data2.total}
                </span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-blue-500/50 transition-all"
                  style={{ width: `${learnedPct}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-purple-500 transition-all"
                  style={{ width: `${masteredPct}%` }}
                />
              </div>
              <div className="flex gap-3 text-[10px] text-text-secondary">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500/50" /> Learning
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Mastered
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
