type TtsStatus = "uninitialized" | "loading" | "ready" | "error";

interface TtsState {
  status: TtsStatus;
  progress: null;
  error: string | null;
}

type Listener = (state: TtsState) => void;

function cleanText(text: string): string {
  return text.replace(/[。、．]/g, "").replace(/\./g, "").trim();
}

interface QueueItem {
  text: string;
  resolve: () => void;
  reject: (err: unknown) => void;
}

class TtsManager {
  private listeners = new Set<Listener>();
  private _state: TtsState = { status: "ready", progress: null, error: null };
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;

  private queue: QueueItem[] = [];
  private processing = false;

  constructor() {
    this.loadVoices();
  }

  private loadVoices() {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voices = voices;
      this.voicesLoaded = true;
    }
    speechSynthesis.addEventListener("voiceschanged", () => {
      this.voices = speechSynthesis.getVoices();
      this.voicesLoaded = true;
    }, { once: false });
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    const haruka = this.voices.find(
      (v) => v.lang.startsWith("ja") && (v.name.includes("Haruka") || v.name.includes("haruka") || v.name.includes("Microsoft"))
    );
    if (haruka) return haruka;

    const jaVoice = this.voices.find((v) => v.lang.startsWith("ja"));
    if (jaVoice) return jaVoice;

    return this.voices.find((v) => v.lang.startsWith("ja-JP")) || null;
  }

  get state() {
    return this._state;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this._state));
  }

  private setState(partial: Partial<TtsState>) {
    this._state = { ...this._state, ...partial };
    this.notify();
  }

  async speak(text: string): Promise<void> {
    const cleaned = cleanText(text);
    if (!cleaned) return;

    return new Promise<void>((resolve, reject) => {
      this.queue.push({ text: cleaned, resolve, reject });
      this.drain();
    });
  }

  private async drain() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const item = this.queue.shift()!;
    try {
      await this.speakNative(item.text);
    } catch (err) {
      console.error("speechSynthesis failed:", err);
    }
    item.resolve();
    this.processing = false;
    this.drain();
  }

  private speakNative(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.7;
      utterance.pitch = 1.0;

      const voice = this.getBestVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);
      speechSynthesis.speak(utterance);
    });
  }

  retry() {
    this.queue = [];
    this.processing = false;
    this.loadVoices();
    this.setState({ status: "ready", error: null });
  }
}

export const ttsManager = new TtsManager();
