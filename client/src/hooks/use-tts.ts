import { useSyncExternalStore, useCallback, useRef } from "react";
import { ttsManager } from "@/lib/tts";

function subscribe(cb: () => void) {
  return ttsManager.subscribe(() => cb());
}

function getSnapshot() {
  return ttsManager.state;
}

export function useTts() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const playingRef = useRef(false);

  const speak = useCallback(async (text: string) => {
    if (playingRef.current) return;
    playingRef.current = true;
    try {
      await ttsManager.speak(text);
    } finally {
      playingRef.current = false;
    }
  }, []);

  const retry = useCallback(() => {
    ttsManager.retry();
  }, []);

  return {
    speak,
    retry,
    status: state.status,
    isReady: state.status === "ready",
    isLoading: state.status === "loading",
    error: state.error,
    progress: state.progress,
  };
}
