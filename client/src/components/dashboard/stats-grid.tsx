import { useProgress } from "@/hooks/use-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { BookOpen, Award, Target, Clock } from "lucide-react";

export function StatsGrid() {
  const { data, isLoading } = useProgress();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = data?.stats;
  const accuracy = stats
    ? stats.totalCardsStudied > 0
      ? Math.round((stats.totalCorrect / stats.totalCardsStudied) * 100)
      : 0
    : 0;

  const items = [
    { label: "Learned", value: stats?.kanjiLearned || 0, icon: BookOpen, color: "text-blue-400" },
    { label: "Mastered", value: stats?.kanjiMastered || 0, icon: Award, color: "text-purple-400" },
    { label: "Accuracy", value: `${accuracy}%`, icon: Target, color: "text-green-400" },
    { label: "Time", value: formatTime(stats?.totalTimeStudied || 0), icon: Clock, color: "text-accent" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="flex items-center gap-3">
            <item.icon className={`h-5 w-5 ${item.color}`} />
            <div>
              <p className="text-lg font-bold text-text-primary">{item.value}</p>
              <p className="text-xs text-text-secondary">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m`;
  return `${seconds}s`;
}
