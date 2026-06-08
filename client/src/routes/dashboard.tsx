import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { StreakWidget } from "@/components/dashboard/streak-widget";
import { XPBar } from "@/components/dashboard/xp-bar";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DueTodayCard } from "@/components/dashboard/due-today-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getGreeting } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">
                {getGreeting()}, {user?.displayName || "learner"}
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Here&apos;s your study overview
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StreakWidget />
              <div className="space-y-4">
                <DueTodayCard />
                <XPBar />
              </div>
              <StatsGrid />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-4">
                <RecentActivity />
              </div>

              <div className="rounded-xl border border-border bg-surface p-4">
                <h3 className="text-sm font-semibold text-text-primary">Quick actions</h3>
                <div className="mt-3 space-y-2">
                  <Link
                    to="/study"
                    className="flex items-center justify-between rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent transition-colors hover:bg-accent/20"
                  >
                    <span>Start study session</span>
                    <span>→</span>
                  </Link>
                  <Link
                    to="/explore"
                    className="flex items-center justify-between rounded-lg bg-surface/50 px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-surface"
                  >
                    <span>Browse kanji</span>
                    <span>→</span>
                  </Link>
                  <Link
                    to="/progress"
                    className="flex items-center justify-between rounded-lg bg-surface/50 px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-surface"
                  >
                    <span>View progress</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
