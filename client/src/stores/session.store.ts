import { create } from "zustand";
import type { KanjiProgress, StudyDeck, ReviewedCard, ReviewResponse } from "@/types/study";
import type { Quality } from "@/types/kanji";
import type { SessionStatus } from "@/types/study";

interface SessionStore {
  status: SessionStatus;
  queue: KanjiProgress[];
  currentCard: KanjiProgress | null;
  reviewedCards: ReviewedCard[];
  sessionStartTime: Date | null;
  xpEarnedThisSession: number;
  levelUpEvent: { from: number; to: number } | null;
  streakMilestone: number | null;
  totalCards: number;

  startSession: (deck: StudyDeck) => void;
  submitReview: (character: string, quality: Quality) => Promise<void>;
  nextCard: () => void;
  endSession: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  status: "idle",
  queue: [],
  currentCard: null,
  reviewedCards: [],
  sessionStartTime: null,
  xpEarnedThisSession: 0,
  levelUpEvent: null,
  streakMilestone: null,
  totalCards: 0,

  startSession: (deck) => {
    const allCards = [...deck.newCards, ...deck.dueCards].sort(() => Math.random() - 0.5);
    const currentCard = allCards.length > 0 ? allCards[0] : null;
    set({
      status: "active",
      queue: allCards,
      currentCard,
      reviewedCards: [],
      sessionStartTime: new Date(),
      xpEarnedThisSession: 0,
      levelUpEvent: null,
      streakMilestone: null,
      totalCards: allCards.length,
    });
  },

  submitReview: async (character, quality) => {
    const state = get();
    if (!state.currentCard || state.currentCard.character !== character) return;

    const correct = quality >= 3;

    try {
      const res = await fetch("/api/study/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character,
          quality,
          sessionStartTime: state.sessionStartTime?.toISOString(),
        }),
      });

      if (res.ok) {
        const data: ReviewResponse = await res.json();
        const reviewed: ReviewedCard = {
          character,
          quality,
          correct,
          xpEarned: data.xpAwarded,
          stage: data.progress.stage,
        };

        const newQueue = state.queue.filter((c) => c.character !== character);

        if (!correct) {
          const card = state.queue.find((c) => c.character === character);
          if (card) {
            newQueue.push({ ...card, stage: "learning" });
          }
        }

        const nextCard = newQueue.length > 0 ? newQueue[0] : null;

        set({
          reviewedCards: [...state.reviewedCards, reviewed],
          queue: newQueue,
          currentCard: nextCard,
          xpEarnedThisSession: state.xpEarnedThisSession + data.xpAwarded,
          levelUpEvent: data.levelUp || state.levelUpEvent,
          streakMilestone: data.streakMilestone || state.streakMilestone,
          status: nextCard ? "active" : "complete",
        });
      }
    } catch {
      const reviewed: ReviewedCard = {
        character,
        quality,
        correct,
        xpEarned: 0,
        stage: "learning",
      };

      const newQueue = state.queue.filter((c) => c.character !== character);
      if (!correct) {
        const card = state.queue.find((c) => c.character === character);
        if (card) newQueue.push(card);
      }

      const nextCard = newQueue.length > 0 ? newQueue[0] : null;
      set({
        reviewedCards: [...state.reviewedCards, reviewed],
        queue: newQueue,
        currentCard: nextCard,
        status: nextCard ? "active" : "complete",
      });
    }
  },

  nextCard: () => {
    const state = get();
    const newQueue = state.queue.slice(1);
    const nextCard = newQueue.length > 0 ? newQueue[0] : null;
    set({
      currentCard: nextCard,
      queue: newQueue,
      status: nextCard ? "active" : "complete",
    });
  },

  endSession: () => {
    set({
      status: "complete",
      currentCard: null,
      queue: [],
    });
  },
}));
