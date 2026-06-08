import { useMemo } from "react";
import { useHeatmap } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ActivityHeatmap() {
  const { data, isLoading } = useHeatmap();

  const weeks = useMemo(() => {
    if (!data) return [];
    const result: { date: string; count: number; goalMet: boolean }[][] = [];
    let currentWeek: { date: string; count: number; goalMet: boolean }[] = [];

    for (const entry of data) {
      const day = new Date(entry.date + "T00:00:00").getDay();
      if (day === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(entry);
    }
    if (currentWeek.length > 0) result.push(currentWeek);
    return result;
  }, [data]);

  if (isLoading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-primary">Activity (last year)</h3>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, di) => {
              const entry = week[di];
              if (!entry) return <div key={di} className="h-3 w-3 rounded-sm bg-background" />;
              return (
                <div
                  key={entry.date}
                  className={cn(
                    "h-3 w-3 rounded-sm",
                    entry.count === 0 ? "bg-border/30" :
                    entry.count <= 5 ? "bg-accent/20" :
                    entry.count <= 15 ? "bg-accent/40" :
                    entry.count <= 30 ? "bg-accent/60" :
                    "bg-accent"
                  )}
                  title={`${entry.date}: ${entry.count} cards`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
