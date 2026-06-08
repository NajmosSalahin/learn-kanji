import { createFileRoute, Link } from "@tanstack/react-router";

const SHOWCASE = [
  { icon: "👣", name: "一歩", romaji: "Ippo" },
  { icon: "✅", name: "正解", romaji: "Seikai" },
  { icon: "🌸", name: "桜", romaji: "Sakura" },
  { icon: "🔊", name: "初音", romaji: "Hatsune" },
  { icon: "📚", name: "図書館", romaji: "Toshokan" },
  { icon: "🌍", name: "世界", romaji: "Sekai" },
  { icon: "🔥", name: "一週間", romaji: "Isshūkan" },
  { icon: "💪", name: "百日", romaji: "Hyakunichi" },
  { icon: "💯", name: "完璧", romaji: "Kanpeki" },
  { icon: "🚄", name: "新幹線", romaji: "Shinkansen" },
  { icon: "🐉", name: "龍", romaji: "Ryū" },
  { icon: "⛩️", name: "浪人", romaji: "Rōnin" },
];

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <div className="text-center">
        <span className="font-kanji text-7xl text-accent">学</span>
        <h1 className="mt-4 font-heading text-4xl font-bold text-text-primary sm:text-5xl">
          Learn Kanji
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-text-secondary">
          Master Japanese characters with smart flashcards and spaced repetition.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-6 sm:grid-cols-3">
        {[
          { title: "Smart SRS", desc: "Spaced repetition optimizes your review schedule for maximum retention." },
          { title: "13,000+ Kanji", desc: "Complete dataset with readings, meanings, stroke counts, and JLPT levels." },
          { title: "Track Progress", desc: "XP, levels, streaks, and detailed analytics to keep you motivated." },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-surface p-6 text-left"
          >
            <h3 className="font-heading font-semibold text-text-primary">{feature.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 w-full max-w-3xl text-center">
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          39 Achievements to Unlock
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          From your first review to year-long streaks — every milestone celebrated.
          Each achievement has a hidden story waiting to be discovered.
        </p>
        <p className="mt-1 text-xs text-accent font-medium">
          5 unlock in your first 5 minutes
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {SHOWCASE.map((a) => (
            <div
              key={a.name}
              className="flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-2 text-sm text-text-secondary grayscale opacity-60"
            >
              <span>{a.icon}</span>
              <span>
                {a.name}
                <span className="text-text-secondary/50 ml-1">({a.romaji})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
