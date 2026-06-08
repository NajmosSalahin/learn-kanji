import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { AchievementGrid } from "@/components/achievements/achievement-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AchievementsResponse } from "@/types/achievement";

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const { data, isLoading } = useQuery<AchievementsResponse>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements");
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    },
  });

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Achievements</h1>
              <p className="mt-1 text-sm text-text-secondary">Badges and milestones from your study journey</p>
            </div>

            {isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : data ? (
              <AchievementGrid achievements={data.achievements} />
            ) : (
              <p className="text-text-secondary">Failed to load achievements.</p>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
