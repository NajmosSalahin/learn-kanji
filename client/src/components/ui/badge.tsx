import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "jlpt5" | "jlpt4" | "jlpt3" | "jlpt2" | "jlpt1" | "learning" | "review" | "mastered" | "new";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-accent/10 text-accent border border-accent/30",
  jlpt5: "bg-jlpt-5-bg text-jlpt-5-text border border-jlpt-5-border",
  jlpt4: "bg-jlpt-4-bg text-jlpt-4-text border border-jlpt-4-border",
  jlpt3: "bg-jlpt-3-bg text-jlpt-3-text border border-jlpt-3-border",
  jlpt2: "bg-jlpt-2-bg text-jlpt-2-text border border-jlpt-2-border",
  jlpt1: "bg-jlpt-1-bg text-jlpt-1-text border border-jlpt-1-border",
  learning: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  review: "bg-green-500/10 text-green-400 border border-green-500/30",
  mastered: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
  new: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function JlptBadge({ level }: { level: number | null }) {
  if (!level) return null;
  const variant = `jlpt${level}` as BadgeVariant;
  return <Badge variant={variant}>N{level}</Badge>;
}

export function StageBadge({ stage }: { stage: string }) {
  return <Badge variant={stage as BadgeVariant}>{stage}</Badge>;
}
