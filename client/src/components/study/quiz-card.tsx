import { useState, useEffect } from "react";
import type { KanjiProgress } from "@/types/study";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  card: KanjiProgress;
  options: { character: string; meaning: string }[];
  correctMeaning: string;
  onAnswer: (correct: boolean) => void;
}

export function QuizCard({ card, options, correctMeaning, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
  }, [card.character]);

  function handleSelect(meaning: string) {
    if (showResult) return;
    setSelected(meaning);
    setShowResult(true);
    setTimeout(() => {
      onAnswer(meaning === correctMeaning);
    }, 1000);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={card.character}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.2 }}
        className="mx-auto w-full max-w-sm space-y-6"
      >
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-8">
          <span className="font-kanji text-7xl text-text-primary">{card.character}</span>
          <p className="mt-2 text-sm text-text-secondary">What is the meaning?</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <button
              key={option.character}
              onClick={() => handleSelect(option.meaning)}
              className={cn(
                "rounded-lg border p-4 text-center text-sm font-medium transition-all",
                showResult && option.meaning === correctMeaning
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : showResult && selected === option.meaning
                  ? "border-red-500 bg-red-500/10 text-red-400"
                  : "border-border bg-surface text-text-primary hover:border-accent/50"
              )}
            >
              {option.meaning}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
