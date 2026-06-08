import { Progress } from "@/components/ui/progress";

interface SessionProgressBarProps {
  current: number;
  total: number;
  xpEarned: number;
}

export function SessionProgressBar({ current, total, xpEarned }: SessionProgressBarProps) {
  const percentage = total > 0 ? ((total - current) / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          {total - current} / {total} cards
        </span>
        <span className="text-accent">+{xpEarned} XP</span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
