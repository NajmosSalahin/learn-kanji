import { useProgress } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentActivity() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  const stats = data?.stats;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">Study overview</h3>
      <div className="space-y-2">
        <div className="flex justify-between rounded-lg bg-surface/50 px-3 py-2 text-sm">
          <span className="text-text-secondary">Total studied</span>
          <span className="text-text-primary">{stats?.totalCardsStudied || 0} cards</span>
        </div>
        <div className="flex justify-between rounded-lg bg-surface/50 px-3 py-2 text-sm">
          <span className="text-text-secondary">Correct</span>
          <span className="text-green-400">{stats?.totalCorrect || 0}</span>
        </div>
        <div className="flex justify-between rounded-lg bg-surface/50 px-3 py-2 text-sm">
          <span className="text-text-secondary">Incorrect</span>
          <span className="text-red-400">{stats?.totalIncorrect || 0}</span>
        </div>
        <div className="flex justify-between rounded-lg bg-surface/50 px-3 py-2 text-sm">
          <span className="text-text-secondary">Last study</span>
          <span className="text-text-primary">
            {stats?.lastStudyDate ? formatDate(stats.lastStudyDate) : "Never"}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}
