import { useTts } from "@/hooks/use-tts";
import { Volume2, Loader2, VolumeX, RefreshCw } from "lucide-react";

interface SpeakButtonProps {
  text: string;
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}

export function SpeakButton({ text, size = "sm", tooltip = "Play pronunciation" }: SpeakButtonProps) {
  const { speak, retry, isReady, isLoading, error, status } = useTts();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!text) return;

    if (status === "error") {
      retry();
      return;
    }

    try {
      await speak(text);
    } catch (err) {
      console.error("Speak failed:", err);
    }
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSize = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
  };

  const iconSize = sizeClasses[size];

  return (
    <button
      onClick={handleClick}
      disabled={(status === "loading") || !text}
      className={`${buttonSize[size]} rounded-full transition-all ${
        status === "loading" || !text
          ? "text-text-secondary/30 cursor-not-allowed"
          : status === "error"
            ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
            : "text-text-secondary/50 hover:text-accent hover:bg-accent/10"
      }`}
      title={
        isLoading
          ? "Loading voice model…"
          : error
            ? "Click to retry"
            : tooltip
      }
      type="button"
    >
      {isLoading ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : error ? (
        <RefreshCw className={`${iconSize}`} />
      ) : (
        <Volume2 className={`${iconSize}`} />
      )}
    </button>
  );
}
