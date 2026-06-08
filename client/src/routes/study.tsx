import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useStudySession } from "@/hooks/use-study-session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Clock, Target, Layers, Info } from "lucide-react";
import type { StudyDeck } from "@/types/study";

export const Route = createFileRoute("/study")({
  component: StudyPage,
});

function StudyPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<StudyDeck>({
    queryKey: ["study-deck"],
    queryFn: async () => {
      const res = await fetch("/api/study/deck");
      if (!res.ok) throw new Error("Failed to load deck");
      return res.json();
    },
  });

  const { startSession } = useStudySession();

  function handleStart() {
    if (!data) return;
    const totalCards = data.newCards.length + data.dueCards.length;
    if (totalCards === 0) return;
    startSession(data);
    navigate({ to: "/study-session" });
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  const totalCards = (data?.newCards.length || 0) + (data?.dueCards.length || 0);
  const todayStats = data?.todayStats;

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Study</h1>
              <p className="mt-1 text-sm text-text-secondary">
                {todayStats?.studiedToday || 0} cards studied today
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{data?.dueCards.length || 0}</p>
                    <p className="text-xs text-text-secondary">Due for review</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Layers className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{data?.newCards.length || 0}</p>
                    <p className="text-xs text-text-secondary">New cards</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <Target className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">
                      {todayStats?.dailyGoal || 20}
                    </p>
                    <p className="text-xs text-text-secondary">Daily goal</p>
                  </div>
                </div>
              </Card>
            </div>

            {totalCards > 0 ? (
              <Card className="p-6 text-center">
                <Clock className="mx-auto h-8 w-8 text-accent" />
                <h2 className="mt-3 font-heading text-lg font-semibold text-text-primary">
                  {totalCards} cards ready
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {data?.newCards.length} new · {data?.dueCards.length} review
                </p>
                <Button onClick={handleStart} size="lg" className="mt-4">
                  Start session
                </Button>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <GraduationCap className="mx-auto h-8 w-8 text-text-secondary" />
                <h2 className="mt-3 font-heading text-lg font-semibold text-text-primary">
                  All caught up!
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  No cards due for review. Add more kanji from the explorer.
                </p>
              </Card>
            )}

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-secondary" />
                <div className="text-xs text-text-secondary leading-relaxed">
                  <p className="mb-1 font-medium text-text-primary">How SRS works</p>
                  <p className="mb-1">
                    Cards progress: <span className="text-yellow-400">New</span> →{" "}
                    <span className="text-blue-400">Learning</span> →{" "}
                    <span className="text-green-400">Reviewed</span> →{" "}
                    <span className="text-purple-400">Mastered</span>
                  </p>
                  <p>
                    <span className="text-red-400">Again</span> = forgot
                    · <span className="text-orange-400">Hard</span> = struggled
                    · <span className="text-green-400">Good</span> = correct
                    · <span className="text-accent">Easy</span> = perfect
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
