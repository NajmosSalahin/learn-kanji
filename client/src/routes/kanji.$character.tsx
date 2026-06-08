import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { useKanjiDetail, useAddToDeck } from "@/hooks/use-kanji";
import { JlptBadge, StageBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { SpeakButton } from "@/components/ui/speak-button";
import { BookOpen, Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/kanji/$character")({
  component: KanjiDetailPage,
});

function KanjiDetailPage() {
  const { character } = Route.useParams();
  const { data, isLoading } = useKanjiDetail(character);
  const addToDeck = useAddToDeck();
  const kanji = data?.data;

  const primaryReading = kanji?.character || "";

  function handleAdd() {
    if (!kanji) return;
    addToDeck.mutate(kanji.character, {
      onSuccess: () => toast.success(`Added ${kanji.character} to your deck`),
      onError: (err) => toast.error(err.message),
    });
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-20 w-20" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (!kanji) {
    return (
      <AuthGuard>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-text-secondary">Kanji not found.</p>
              <Link to="/explore" className="mt-4 text-sm text-accent hover:underline">
                Back to explore
              </Link>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to explore
            </Link>

            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="font-kanji text-8xl text-text-primary">{kanji.character}</span>
                  {primaryReading && (
                    <SpeakButton text={primaryReading} size="lg" tooltip="Play pronunciation" />
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <JlptBadge level={kanji.jlpt_new} />
                    {kanji.progress && <StageBadge stage={kanji.progress.stage} />}
                    <span className="rounded-md bg-border/50 px-2 py-0.5 text-xs text-text-secondary">
                      {kanji.strokes} strokes
                    </span>
                    {kanji.freq && (
                      <span className="rounded-md bg-border/50 px-2 py-0.5 text-xs text-text-secondary">
                        #{kanji.freq}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Meanings
                  </h3>
                  <p className="mt-1 text-lg text-text-primary">{kanji.meanings.join(", ")}</p>
                </div>
                {kanji.grade && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      School Grade
                    </h3>
                    <p className="mt-1 text-lg text-text-primary">Grade {kanji.grade}</p>
                  </div>
                )}
                {kanji.readings_on.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      ON Readings
                    </h3>
                    <p className="mt-1 text-lg text-text-primary">
                      {kanji.readings_on.map((r, i) => (
                        <span key={r} className="inline-flex items-center gap-1">
                          {i > 0 && "、"}{r}
                          <SpeakButton text={r} size="sm" />
                          <span className="ml-1 text-sm text-text-secondary/60">
                            ({kanji.readings_on_romaji[i]})
                          </span>
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                {kanji.readings_kun.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      KUN Readings
                    </h3>
                    <p className="mt-1 text-lg text-text-primary">
                      {kanji.readings_kun.map((r, i) => (
                        <span key={r} className="inline-flex items-center gap-1">
                          {i > 0 && "、"}{r}
                          <SpeakButton text={r} size="sm" />
                          <span className="ml-1 text-sm text-text-secondary/60">
                            ({kanji.readings_kun_romaji[i]})
                          </span>
                        </span>
                      ))}
                    </p>
                  </div>
                )}
                {kanji.name_readings.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Name Readings
                    </h3>
                    <p className="mt-1 text-lg text-text-primary">
                      {kanji.name_readings.map((r, i) => (
                        <span key={r} className="inline-flex items-center gap-1">
                          {i > 0 && "、"}{r}
                          <SpeakButton text={r} size="sm" />
                          <span className="ml-1 text-sm text-text-secondary/60">
                            ({kanji.name_readings_romaji[i]})
                          </span>
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>

              {!kanji.progress && (
                <Button onClick={handleAdd} disabled={addToDeck.isPending} className="mt-6 w-full">
                  {addToDeck.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="mr-2 h-4 w-4" />
                  )}
                  Add to study deck
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
