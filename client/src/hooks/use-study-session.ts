import { useSessionStore } from "@/stores/session.store";

export function useStudySession() {
  const status = useSessionStore((s) => s.status);
  const currentCard = useSessionStore((s) => s.currentCard);
  const queue = useSessionStore((s) => s.queue);
  const reviewedCards = useSessionStore((s) => s.reviewedCards);
  const xpEarnedThisSession = useSessionStore((s) => s.xpEarnedThisSession);
  const levelUpEvent = useSessionStore((s) => s.levelUpEvent);
  const streakMilestone = useSessionStore((s) => s.streakMilestone);
  const newAchievements = useSessionStore((s) => s.newAchievements);
  const totalCards = useSessionStore((s) => s.totalCards);
  const startSession = useSessionStore((s) => s.startSession);
  const submitReview = useSessionStore((s) => s.submitReview);
  const endSession = useSessionStore((s) => s.endSession);

  return {
    status,
    currentCard,
    queue,
    reviewedCards,
    xpEarnedThisSession,
    levelUpEvent,
    streakMilestone,
    newAchievements,
    totalCards,
    startSession,
    submitReview,
    endSession,
  };
}
