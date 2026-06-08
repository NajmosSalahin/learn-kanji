import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";

export function XPBar() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return <Skeleton className="h-24 rounded-xl" />;
  }

  const xpProgress = data?.user.xpProgress || 0;
  const level = data?.user.level || 1;
  const totalXP = data?.user.totalXP || 0;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">Level {level}</p>
          <p className="text-2xl font-bold text-text-primary">{totalXP.toLocaleString()} XP</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent">
          <span className="text-lg font-bold text-accent">{level}</span>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <Progress value={xpProgress} />
        <div className="flex justify-between text-xs text-text-secondary">
          <span>{Math.round(xpProgress)}% to next level</span>
          <span>+{data?.stats.totalXP || 0} total</span>
        </div>
      </div>
    </div>
  );
}
