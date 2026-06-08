import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { useState, useCallback } from "react";
import { useKanjiList, useRemoveFromDeck } from "@/hooks/use-kanji";
import { SearchBar } from "@/components/kanji/search-bar";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";

const STAGE_TABS = [
  { key: "", label: "All" },
  { key: "learning", label: "Learning" },
  { key: "review", label: "Reviewed" },
  { key: "mastered", label: "Mastered" },
];

function LibraryPage() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useKanjiList({ library: "true", stage, search, page, limit: 20 });
  const removeFromDeck = useRemoveFromDeck();
  const summary = data?.summary;

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  function handleStageChange(newStage: string) {
    setStage(newStage);
    setSearch("");
    setPage(1);
  }

  function handleRemove(character: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    removeFromDeck.mutate(character, {
      onSuccess: () => toast.success(`Removed ${character} from deck`),
      onError: (err) => toast.error(err.message),
    });
  }

  function formatDueDate(dueDate: Date | undefined | null) {
    if (!dueDate) return "—";
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Now";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays}d`;
  }

  const stageColors: Record<string, string | undefined> = {
    learning: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    review: "bg-green-500/10 text-green-400 border-green-500/30",
    mastered: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Library</h1>
              <p className="mt-1 text-sm text-text-secondary">
                {summary ? `${summary.total} kanji in your deck` : "Your personal kanji deck"}
              </p>
            </div>

            {summary && (
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-surface p-3 text-center">
                  <p className="text-2xl font-bold text-text-primary">{summary.total}</p>
                  <p className="text-xs text-text-secondary">Total</p>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">{summary.learning || 0}</p>
                  <p className="text-xs text-blue-400/70">Learning</p>
                </div>
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{summary.review || 0}</p>
                  <p className="text-xs text-green-400/70">Reviewed</p>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-center">
                  <p className="text-2xl font-bold text-purple-400">{summary.mastered || 0}</p>
                  <p className="text-xs text-purple-400/70">Mastered</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {STAGE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleStageChange(tab.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    stage === tab.key
                      ? tab.key
                        ? `font-medium ${stageColors[tab.key]}`
                        : "bg-accent/10 font-medium text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <SearchBar onSearch={handleSearch} />

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : data?.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-text-secondary">
                  {search ? "No kanji match your search." : "Your deck is empty."}
                </p>
                {!search && (
                  <Link to="/explore" className="mt-2 text-sm text-accent hover:underline">
                    Browse kanji to add
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {data?.data.map((kanji) => {
                  const p = kanji.progress;
                  const accuracy = p && p.totalReviews > 0
                    ? Math.round((p.correctReviews / p.totalReviews) * 100)
                    : null;
                  return (
                    <Link
                      key={kanji.character}
                      to="/kanji/$character"
                      params={{ character: kanji.character }}
                      className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3 transition-all hover:border-accent/50"
                    >
                      <span className="font-kanji text-2xl text-text-primary">
                        {kanji.character}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-text-secondary">
                          {kanji.meanings.slice(0, 3).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        {p && (
                          <>
                            <StageBadge stage={p.stage} />
                            <span>{p.repetitions} reps</span>
                            <span className="hidden sm:inline">
                              {accuracy !== null ? `${accuracy}%` : "—"}
                            </span>
                            <span className="hidden sm:inline">{formatDueDate(p.dueDate)}</span>
                          </>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleRemove(kanji.character, e)}
                        disabled={removeFromDeck.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        {removeFromDeck.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}

            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-text-secondary">
                  Page {page} of {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page >= data.pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});
