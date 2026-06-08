import { useStreak } from "@/hooks/use-streak";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakWidget() {
  const { data, isLoading } = useStreak();

  if (isLoading) {
    return <Skeleton className="h-24 rounded-xl" />;
  }

  const studiedToday = data?.studiedToday ?? false;

  return (
    <div className={cn(
      "rounded-xl border p-4",
      studiedToday ? "border-green-500/30 bg-green-500/5" : "border-border bg-surface"
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">
            {!data?.lastStudyDate ? "No activity yet" : "Current streak"}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Flame className={cn(
              "h-6 w-6",
              studiedToday ? "text-accent animate-streak-fire" : "text-text-secondary"
            )} />
            <span className="text-3xl font-bold text-text-primary">
              {!data?.lastStudyDate ? "—" : Math.max(data.currentStreak, 1)}
            </span>
            {data?.lastStudyDate && (
              <span className="text-sm text-text-secondary">days</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary">Longest</p>
          <p className="text-lg font-bold text-text-primary">{data?.longestStreak || 0}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-1">
        {data?.weeklyActivity.map((active, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              active ? "bg-accent" : "bg-border"
            )}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-text-secondary/60">
        <span>7 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
