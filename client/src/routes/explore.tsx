import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { useState, useCallback } from "react";
import { useKanjiList } from "@/hooks/use-kanji";
import { SearchBar } from "@/components/kanji/search-bar";
import { FilterBar } from "@/components/kanji/filter-bar";
import { KanjiGrid } from "@/components/kanji/kanji-grid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

function ExplorePage() {
  const [search, setSearch] = useState("");
  const [jlpt, setJlpt] = useState("");
  const [grade, setGrade] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useKanjiList({ search, jlpt, grade, page, limit: 24 });

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Explore Kanji</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Browse all {data?.pagination.total?.toLocaleString() || ""} kanji characters
              </p>
            </div>

            <SearchBar onSearch={handleSearch} />
            <FilterBar jlpt={jlpt} grade={grade} onJlptChange={setJlpt} onGradeChange={setGrade} />

            {search && data?.pagination && (
              <p className="text-sm text-text-secondary">
                Found {data.pagination.total} result{data.pagination.total !== 1 ? "s" : ""} for "{search}"
              </p>
            )}

            <KanjiGrid kanjiList={data?.data || []} isLoading={isLoading} searchQuery={search} />

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
