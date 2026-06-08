import { useState } from "react";
import type { KanjiProgress } from "@/types/study";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardProps {
  card: KanjiProgress;
  onFlip?: () => void;
}

export function Flashcard({ card, onFlip }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  function handleFlip() {
    setFlipped(true);
    onFlip?.();
  }

  const readingsOn = card.kanjiData?.readings_on?.join(", ") || "—";
  const readingsKun = card.kanjiData?.readings_kun?.join(", ") || "—";
  const nameReadings = card.kanjiData?.name_readings?.join(", ") || "—";
  const meanings = card.kanjiData?.meanings?.join(", ") || "—";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={card.character}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.2 }}
        className="card-flip-perspective mx-auto h-72 w-full max-w-sm cursor-pointer"
        onClick={() => !flipped && handleFlip()}
      >
        <motion.div
          className="card-flip-inner relative h-full w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <div className="card-front flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-8">
            <span className="font-kanji text-7xl text-text-primary">{card.character}</span>
            <p className="mt-4 text-sm text-text-secondary">Tap to reveal</p>
          </div>
          <div className="card-back flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-8">
            <span className="font-kanji text-5xl text-accent">{card.character}</span>
            <div className="mt-4 space-y-2 text-center">
              <p className="text-sm text-text-secondary">
                ON: <span className="text-text-primary">{readingsOn}</span>
              </p>
              <p className="text-sm text-text-secondary">
                KUN: <span className="text-text-primary">{readingsKun}</span>
              </p>
              <p className="text-sm text-text-secondary">
                NAME: <span className="text-text-primary">{nameReadings}</span>
              </p>
              <p className="text-sm text-text-secondary">
                <span className="text-text-primary">{meanings}</span>
              </p>
              <p className="text-xs text-text-secondary/60">
                Interval: {card.interval}d | EF: {card.easeFactor.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
