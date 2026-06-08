import { Link } from "@tanstack/react-router";
import type { KanjiWithProgress } from "@/types/kanji";
import { JlptBadge, StageBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddToDeck } from "@/hooks/use-kanji";
import { toast } from "sonner";
import { BookOpen, Loader2 } from "lucide-react";

interface KanjiCardProps {
  kanji: KanjiWithProgress;
  searchQuery?: string;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, query?: string) {
  if (!query) return text;
  const escaped = escapeRegex(query);
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="rounded bg-accent/20 px-0.5 text-accent">{part}</mark>
      : part,
  );
}

function joinHighlighted(items: string[], query?: string) {
  if (!query) return items.join(", ");
  return items
    .map((item) => highlight(item, query))
    .reduce<(React.ReactNode | string)[]>((acc, curr, i) => {
      if (i > 0) acc.push(", ");
      if (typeof curr === "string") acc.push(curr);
      else acc.push(curr);
      return acc;
    }, []);
}

export function KanjiCard({ kanji, searchQuery }: KanjiCardProps) {
  const addToDeck = useAddToDeck();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToDeck.mutate(kanji.character, {
      onSuccess: () => toast.success(`Added ${kanji.character} to your deck`),
      onError: (err) => toast.error(err.message),
    });
  }

  return (
    <Link
      to="/kanji/$character"
      params={{ character: kanji.character }}
      className="group block rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="flex items-start justify-between">
        <span className="font-kanji text-4xl text-text-primary transition-colors group-hover:text-accent">
          {kanji.character}
        </span>
        <JlptBadge level={kanji.jlpt_new} />
      </div>

      <div className="mt-2 space-y-1">
        <p className="text-sm text-text-secondary line-clamp-2">
          {joinHighlighted(kanji.meanings.slice(0, 3), searchQuery)}
        </p>
        {kanji.readings_on.length > 0 && (
          <p className="text-xs text-text-secondary/70">
            ON: {joinHighlighted(kanji.readings_on.slice(0, 2), searchQuery)}
          </p>
        )}
        {kanji.readings_kun.length > 0 && (
          <p className="text-xs text-text-secondary/70">
            KUN: {joinHighlighted(kanji.readings_kun.slice(0, 2), searchQuery)}
          </p>
        )}
        {kanji.name_readings.length > 0 && (
          <p className="text-xs text-text-secondary/70">
            NAME: {joinHighlighted(kanji.name_readings.slice(0, 2), searchQuery)}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary/60">{kanji.strokes} strokes</span>
          {kanji.grade && (
            <span className="text-xs text-text-secondary/60">Grade {kanji.grade}</span>
          )}
          {kanji.freq && (
            <span className="text-xs text-text-secondary/60">#{kanji.freq}</span>
          )}
          {kanji.progress && <StageBadge stage={kanji.progress.stage} />}
        </div>
        {!kanji.progress && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAdd}
            disabled={addToDeck.isPending}
            className="opacity-0 group-hover:opacity-100"
          >
            {addToDeck.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <BookOpen className="h-3 w-3" />
            )}
            <span className="ml-1">Add</span>
          </Button>
        )}
      </div>
    </Link>
  );
}
