import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import type { StudyDeck } from "@/types/study";

export function DueTodayCard() {
  const { data, isLoading } = useQuery<StudyDeck>({
    queryKey: ["study-deck"],
    queryFn: async () => {
      const res = await fetch("/api/study/deck");
      if (!res.ok) throw new Error("Failed to fetch deck");
      return res.json();
    },
  });

  if (isLoading) {
    return <Skeleton className="h-24 rounded-xl" />;
  }

  const dueCount = (data?.dueCards.length || 0) + (data?.newCards.length || 0);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{dueCount}</p>
            <p className="text-xs text-text-secondary">cards due today</p>
          </div>
        </div>
        {dueCount > 0 && (
          <Link to="/study">
            <Button size="sm">Study now</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
