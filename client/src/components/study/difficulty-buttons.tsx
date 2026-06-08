import { Button } from "@/components/ui/button";

const DIFFICULTY = [
  { quality: 1 as const, label: "Again", description: "Forgot", className: "bg-red-600 hover:bg-red-700 text-white" },
  { quality: 2 as const, label: "Hard", description: "Struggled", className: "bg-orange-600 hover:bg-orange-700 text-white" },
  { quality: 3 as const, label: "Good", description: "Correct", className: "bg-green-600 hover:bg-green-700 text-white" },
  { quality: 5 as const, label: "Easy", description: "Perfect", className: "bg-accent hover:bg-accent-hover text-background" },
];

interface DifficultyButtonsProps {
  onRate: (quality: 1 | 2 | 3 | 5) => void;
  disabled?: boolean;
}

export function DifficultyButtons({ onRate, disabled }: DifficultyButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DIFFICULTY.map((btn) => (
        <Button
          key={btn.quality}
          onClick={() => onRate(btn.quality)}
          disabled={disabled}
          className={`flex-col py-3 ${btn.className}`}
        >
          <span className="text-sm font-semibold">{btn.label}</span>
          <span className="text-xs opacity-70">{btn.description}</span>
        </Button>
      ))}
    </div>
  );
}
