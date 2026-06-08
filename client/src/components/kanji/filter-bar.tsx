interface FilterBarProps {
  jlpt: string;
  grade: string;
  onJlptChange: (value: string) => void;
  onGradeChange: (value: string) => void;
}

const JLPT_LEVELS = [
  { value: "", label: "All JLPT" },
  { value: "5", label: "N5" },
  { value: "4", label: "N4" },
  { value: "3", label: "N3" },
  { value: "2", label: "N2" },
  { value: "1", label: "N1" },
  { value: "other", label: "Other" },
];

const GRADES = [
  { value: "", label: "All grades" },
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
  { value: "3", label: "Grade 3" },
  { value: "4", label: "Grade 4" },
  { value: "5", label: "Grade 5" },
  { value: "6", label: "Grade 6" },
  { value: "8", label: "Grade 8" },
  { value: "other", label: "Other" },
];

export function FilterBar({ jlpt, grade, onJlptChange, onGradeChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex gap-1 rounded-lg border border-border p-1">
        {JLPT_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onJlptChange(level.value)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              jlpt === level.value
                ? "bg-accent text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 rounded-lg border border-border p-1">
        {GRADES.map((g) => (
          <button
            key={g.value}
            onClick={() => onGradeChange(g.value)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              grade === g.value
                ? "bg-accent text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
