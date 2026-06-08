import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { ActivityHeatmap } from "@/components/progress/activity-heatmap";
import { LevelRing } from "@/components/progress/level-ring";
import { MasteryChart } from "@/components/progress/mastery-chart";
import { AccuracyTrend } from "@/components/progress/accuracy-trend";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Progress</h1>
              <p className="mt-1 text-sm text-text-secondary">Your learning journey visualized</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <LevelRing />
              <AccuracyTrend />
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <ActivityHeatmap />
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <MasteryChart />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
