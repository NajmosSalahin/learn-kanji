import { useState, useEffect, useRef } from "react";
import type { KanjiProgress } from "@/types/study";
import { SpeakButton } from "@/components/ui/speak-button";
import { useTts } from "@/hooks/use-tts";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardProps {
  card: KanjiProgress;
  onFlip?: () => void;
}

export function Flashcard({ card, onFlip }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const { speak, isReady } = useTts();
  const autoPlayedRef = useRef(false);

  const primaryReading = card.character;

  function handleFlip() {
    setFlipped(true);
    onFlip?.();
  }

  useEffect(() => {
    if (flipped && primaryReading && isReady && !autoPlayedRef.current) {
      autoPlayedRef.current = true;
      speak(primaryReading);
    }
  }, [flipped, primaryReading, isReady, speak]);

  const readingsOn = card.kanjiData?.readings_on || [];
  const readingsKun = card.kanjiData?.readings_kun || [];
  const nameReadings = card.kanjiData?.name_readings || [];
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
              {readingsOn.length > 0 && (
                <p className="text-sm text-text-secondary inline-flex items-center gap-1">
                  ON: {readingsOn.map((r, i) => (
                    <span key={r} className="inline-flex items-center gap-0.5">
                      {i > 0 && "、"}{r}
                      <SpeakButton text={r} size="sm" />
                    </span>
                  ))}
                </p>
              )}
              {readingsKun.length > 0 && (
                <p className="text-sm text-text-secondary inline-flex items-center gap-1">
                  KUN: {readingsKun.map((r, i) => (
                    <span key={r} className="inline-flex items-center gap-0.5">
                      {i > 0 && "、"}{r}
                      <SpeakButton text={r} size="sm" />
                    </span>
                  ))}
                </p>
              )}
              {nameReadings.length > 0 && (
                <p className="text-sm text-text-secondary inline-flex items-center gap-1">
                  NAME: {nameReadings.map((r, i) => (
                    <span key={r} className="inline-flex items-center gap-0.5">
                      {i > 0 && "、"}{r}
                      <SpeakButton text={r} size="sm" />
                    </span>
                  ))}
                </p>
              )}
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
