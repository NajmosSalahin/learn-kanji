import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStudySession } from "@/hooks/use-study-session";
import { Flashcard } from "@/components/study/flashcard";
import { QuizCard } from "@/components/study/quiz-card";
import { DifficultyButtons } from "@/components/study/difficulty-buttons";
import { SessionProgressBar } from "@/components/study/session-progress-bar";
import { SessionSummary } from "@/components/study/session-summary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { StudyDeck, KanjiProgress, Distractor } from "@/types/study";

export const Route = createFileRoute("/study-session")({
  component: StudySessionPage,
});

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuizOptions(card: KanjiProgress, distractors: Distractor[]): { character: string; meaning: string }[] {
  const correctMeaning = card.kanjiData?.meanings?.[0] || card.character;
  const wrongMeanings = distractors
    .filter((d) => d.character !== card.character)
    .map((d) => d.meanings?.[0])
    .filter(Boolean) as string[];

  const uniqueWrong = [...new Set(wrongMeanings)].filter((m) => m !== correctMeaning);
  const selectedWrong = shuffleArray(uniqueWrong).slice(0, 3);

  const allOptions = shuffleArray([
    { character: card.character, meaning: correctMeaning },
    ...selectedWrong.map((m) => ({ character: card.character, meaning: m })),
  ]);

  return allOptions;
}

function StudySessionPage() {
  const navigate = useNavigate();
  const {
    status, currentCard, queue, reviewedCards,
    xpEarnedThisSession, levelUpEvent, streakMilestone,
    totalCards, startSession, submitReview, endSession,
    newAchievements,
  } = useStudySession();

  const [showBack, setShowBack] = useState(false);
  const [quizMode, setQuizMode] = useState(false);

  const { data: deckData } = useQuery<StudyDeck>({
    queryKey: ["study-deck"],
    enabled: status === "idle",
  });

  useEffect(() => {
    if (deckData && status === "idle") {
      const allCards = [...deckData.newCards, ...deckData.dueCards].sort(() => Math.random() - 0.5);
      if (allCards.length > 0) {
        startSession(deckData);
      }
    }
  }, [deckData, status, startSession]);

  const distractors = deckData?.distractors ?? [];

  const quizOptions = useMemo(() => {
    if (!currentCard || distractors.length === 0) return [];
    return buildQuizOptions(currentCard, distractors);
  }, [currentCard, distractors]);

  const correctMeaning = currentCard?.kanjiData?.meanings?.[0] || currentCard?.character || "";

  if (status === "idle") {
    return (
      <AuthGuard>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center py-16">
              <p className="text-text-secondary">Loading deck...</p>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (status === "complete") {
    const correctCount = reviewedCards.filter((r) => r.correct).length;
    const incorrectCount = reviewedCards.filter((r) => !r.correct).length;

    return (
      <AuthGuard>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="py-8">
              <SessionSummary
                totalCards={reviewedCards.length}
                correctCount={correctCount}
                incorrectCount={incorrectCount}
                xpEarned={xpEarnedThisSession}
                levelUp={levelUpEvent}
                streakMilestone={streakMilestone}
                newAchievements={newAchievements}
              />
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (!currentCard) return null;

  const correctCount = reviewedCards.filter((r) => r.correct).length;
  const incorrectCount = reviewedCards.filter((r) => !r.correct).length;

  function handleRate(quality: 1 | 2 | 3 | 5) {
    setShowBack(false);
    submitReview(currentCard!.character, quality);
  }

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => { endSession(); navigate({ to: "/study" }); }}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Exit
              </Button>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span>{reviewedCards.length} done</span>
                <span className="text-green-400">{correctCount}✓</span>
                <span className="text-red-400">{incorrectCount}✗</span>
              </div>
            </div>

            <SessionProgressBar
              current={queue.length}
              total={totalCards}
              xpEarned={xpEarnedThisSession}
            />

            <div className="flex justify-center gap-2">
              <Button
                variant={quizMode ? "primary" : "ghost"}
                size="sm"
                onClick={() => setQuizMode(true)}
              >
                Quiz
              </Button>
              <Button
                variant={!quizMode ? "primary" : "ghost"}
                size="sm"
                onClick={() => setQuizMode(false)}
              >
                Flashcard
              </Button>
            </div>

            {quizMode ? (
              <QuizCard
                card={currentCard}
                options={quizOptions}
                correctMeaning={correctMeaning}
                onAnswer={(correct) => {
                  submitReview(currentCard.character, correct ? 3 : 1);
                }}
              />
            ) : (
              <>
                <Flashcard card={currentCard} onFlip={() => setShowBack(true)} />
                {showBack && (
                  <DifficultyButtons onRate={handleRate} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
