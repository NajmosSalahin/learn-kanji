import type { KanjiWithProgress } from "@/types/kanji";
import { KanjiCard } from "./kanji-card";
import { Skeleton } from "@/components/ui/skeleton";

interface KanjiGridProps {
  kanjiList: KanjiWithProgress[];
  isLoading: boolean;
  searchQuery?: string;
}

export function KanjiGrid({ kanjiList, isLoading, searchQuery }: KanjiGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-1 h-3 w-1/2" />
            <Skeleton className="mt-3 h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (kanjiList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-text-secondary">No kanji found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {kanjiList.map((kanji) => (
        <KanjiCard key={kanji.character} kanji={kanji} searchQuery={searchQuery} />
      ))}
    </div>
  );
}
