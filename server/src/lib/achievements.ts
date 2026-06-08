import type { CardStage } from "./srs.js";

export interface AchievementCriteria {
  type:
    | "total_reviews"
    | "kanji_mastered"
    | "streak"
    | "accuracy"
    | "perfect_session"
    | "session_cards"
    | "goal_streak"
    | "flag"
    | "time_of_day"
    | "speed"
    | "reading_collection"
    | "feature_discovery"
    | "comeback"
    | "perfect_streak";
  threshold?: number;
  flag?: string;
  startHour?: number;
  endHour?: number;
  timeLimit?: number;
  subtype?: "on" | "kun";
  keywords?: string[];
}

export interface AchievementDef {
  id: string;
  icon: string;
  name: string;
  nameRomaji: string | null;
  desc: string;
  pun: string;
  criteria: AchievementCriteria;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ── Instant (first session, near-zero effort) ──
  {
    id: "ippo", icon: "👣", name: "一歩", nameRomaji: "Ippo",
    desc: "First Step — review your first card ever",
    pun: `"Ippo" means "one step." The first step of a thousand-mile journey... of kanji! Also a nod to the anime "Hajime no Ippo" (Fighting Spirit)!`,
    criteria: { type: "total_reviews", threshold: 1 },
  },
  {
    id: "seikai", icon: "✅", name: "正解", nameRomaji: "Seikai",
    desc: "Correct! — get your first answer right",
    pun: `"Seikai" means "correct answer." Simple and honest — you got it right on the first try!`,
    criteria: { type: "total_reviews", threshold: 1 },
  },
  {
    id: "gokan", icon: "🌱", name: "五感", nameRomaji: "Gokan",
    desc: "Five Senses — review 5 cards in a session",
    pun: `"Gokan" means "five senses." You've reviewed 5 cards — using at least your sense of sight... and maybe sound if you used the speaker!`,
    criteria: { type: "session_cards", threshold: 5 },
  },
  {
    id: "sakura", icon: "🌸", name: "桜", nameRomaji: "Sakura",
    desc: "First Bloom — get every card right in a session",
    pun: `"Sakura" (cherry blossom) represents beauty and impermanence in Japanese culture. Your first perfect session — fleeting but memorable, like cherry blossoms in spring.`,
    criteria: { type: "perfect_session", threshold: 1 },
  },
  {
    id: "hayai", icon: "⚡", name: "矢", nameRomaji: "Ya",
    desc: "Arrow — review 10 cards in a session",
    pun: `"Ya" means "arrow." You shot through 10 cards like an arrow from a bow — straight and fast!`,
    criteria: { type: "session_cards", threshold: 10 },
  },

  // ── Flag-based (interaction discovery) ──
  {
    id: "tanken", icon: "🧭", name: "探検", nameRomaji: "Tanken",
    desc: "Explorer — visit the Explore page",
    pun: `"Tanken" means "exploration." You ventured beyond the dashboard into the wild world of kanji!`,
    criteria: { type: "flag", flag: "visitedExplore" },
  },
  {
    id: "hatsune", icon: "🔊", name: "初音", nameRomaji: "Hatsune",
    desc: "First Sound — click the speaker button",
    pun: `"Hatsune" means "first sound." Your first click of the speaker! Also a homage to Hatsune Miku, Japan's virtual pop star.`,
    criteria: { type: "flag", flag: "usedAudio" },
  },
  {
    id: "toshokan", icon: "📚", name: "図書館", nameRomaji: "Toshokan",
    desc: "Bookworm — add your first kanji to your deck",
    pun: `"Toshokan" means "library." You added your first kanji — the first book in your personal kanji library!`,
    criteria: { type: "flag", flag: "addedToDeck" },
  },
  {
    id: "sekai", icon: "🌍", name: "世界", nameRomaji: "Sekai",
    desc: "The World — open a kanji detail page",
    pun: `"Sekai" means "world." You opened a kanji detail page — a whole world of meaning in a single character.`,
    criteria: { type: "flag", flag: "openedKanjiDetail" },
  },
  {
    id: "kadode", icon: "🎯", name: "門出", nameRomaji: "Kadode",
    desc: "Departure — set your daily goal",
    pun: `"Kadode" means "departure." You set your first daily goal. Every great journey begins with a clear destination.`,
    criteria: { type: "flag", flag: "setGoal" },
  },

  // ── Cumulative ──
  {
    id: "first_steps", icon: "🎯", name: "First Steps", nameRomaji: null,
    desc: "Review 10 cards total",
    pun: `Ten cards in! In Japan, the "first step" ceremony is called "ippo" — a celebration of beginnings. This is yours!`,
    criteria: { type: "total_reviews", threshold: 10 },
  },
  {
    id: "doryoku", icon: "💪", name: "努力", nameRomaji: "Doryoku",
    desc: "Effort — review 500 cards total",
    pun: `"Doryoku" means "effort" — the Japanese concept of persistent hard work (ganbaru). 500 reviews proves you've got it!`,
    criteria: { type: "total_reviews", threshold: 500 },
  },
  {
    id: "kyuchi", icon: "📖", name: "求知", nameRomaji: "Kyūchi",
    desc: "Knowledge Seeker — review 2,000 cards total",
    pun: `"Kyūchi" means "seeking knowledge." 2,000 reviews deep — you're not just studying, you're on a quest!`,
    criteria: { type: "total_reviews", threshold: 2000 },
  },
  {
    id: "kyudoka", icon: "🏹", name: "弓道家", nameRomaji: "Kyūdōka",
    desc: "Master Archer — review 5,000 cards total",
    pun: `"Kyūdōka" is a master archer — one who follows the way of the bow. 5,000 reviews — your aim is true!`,
    criteria: { type: "total_reviews", threshold: 5000 },
  },

  // ── Mastery ──
  {
    id: "kanji_scholar", icon: "⭐", name: "First Mastery", nameRomaji: null,
    desc: "Master your first kanji",
    pun: `Your first kanji reached master! In Japanese, mastering any skill is called "shu" — the first stage of learning. You've taken your first step on the path.`,
    criteria: { type: "kanji_mastered", threshold: 1 },
  },
  {
    id: "jukketsu", icon: "💎", name: "十傑", nameRomaji: "Jukketsu",
    desc: "Top Ten — master 10 kanji",
    pun: `"Jukketsu" means "top ten" or "ten outstanding people." In Japanese schools, the top 10 students are called jukketsu. You're in the elite!`,
    criteria: { type: "kanji_mastered", threshold: 10 },
  },
  {
    id: "gojuon", icon: "👑", name: "五十音", nameRomaji: "Gojūon",
    desc: "Gojūon — master 50 kanji",
    pun: `"Gojūon" is the 50-sound hiragana chart every Japanese child learns. You've mastered 50 kanji — more characters than the entire hiragana syllabary!`,
    criteria: { type: "kanji_mastered", threshold: 50 },
  },
  {
    id: "hyakunin", icon: "🌟", name: "百人一首", nameRomaji: "Hyakunin Isshu",
    desc: "100 Poets — master 100 kanji",
    pun: `"Hyakunin Isshu" is a famous anthology of 100 poems by 100 poets — a national literary treasure. You've mastered 100 kanji — your own literary collection!`,
    criteria: { type: "kanji_mastered", threshold: 100 },
  },

  // ── Streak ──
  {
    id: "mikkabouzu", icon: "🪦", name: "三日坊主", nameRomaji: "Mikkabōzu",
    desc: "Three-Day Monk — 3-day study streak",
    pun: `"Mikkabōzu" is a Japanese idiom: a "three-day monk" — someone who starts something with passion but quits quickly. But YOU made it to day 3 and kept going!`,
    criteria: { type: "streak", threshold: 3 },
  },
  {
    id: "isshukan", icon: "🔥", name: "一週間", nameRomaji: "Isshūkan",
    desc: "One Week — 7-day study streak",
    pun: `"Isshūkan" means "one week." Seven days of daily study — you've formed a habit! In Japan, "isshūkan" is the first milestone of consistency.`,
    criteria: { type: "streak", threshold: 7 },
  },
  {
    id: "ikkagetsu", icon: "⚡", name: "一ヶ月", nameRomaji: "Ikkagetsu",
    desc: "One Month — 30-day study streak",
    pun: `"Ikkagetsu" means "one month." A full lunar cycle of dedication! In Japanese tradition, the 30th day marks the completion of a full month.`,
    criteria: { type: "streak", threshold: 30 },
  },
  {
    id: "hyakunichi", icon: "💪", name: "百日", nameRomaji: "Hyakunichi",
    desc: "100 Days — 100-day study streak",
    pun: `"Hyakunichi" means "100 days." In Japan, the 100th day (hyakunichi-me) is a celebration for babies and new beginnings. Your study habit is now a tradition!`,
    criteria: { type: "streak", threshold: 100 },
  },
  {
    id: "ichinen", icon: "🗓️", name: "一年", nameRomaji: "Ichinen",
    desc: "One Year — 365-day study streak",
    pun: `"Ichinen" means "one year." 365 days of kanji! In Japan, the new year (ichinen no hajime) is a time for reflection — look how far you've come!`,
    criteria: { type: "streak", threshold: 365 },
  },

  // ── Quality ──
  {
    id: "muketsu", icon: "🎯", name: "無欠", nameRomaji: "Muketsu",
    desc: "Flawless — complete a perfect session",
    pun: `"Muketsu" means "flawless" — like a perfectly forged katana with zero imperfections. A perfect session, sharp and clean!`,
    criteria: { type: "perfect_session", threshold: 1 },
  },
  {
    id: "mangan", icon: "✨", name: "満貫", nameRomaji: "Mangan",
    desc: "Grand Slam — 10+ cards with 100% accuracy",
    pun: `"Mangan" is a mahjong term for a hand worth maximum points — the grand slam! 10+ cards with 100% accuracy — a perfect winning streak!`,
    criteria: { type: "perfect_session", threshold: 10 },
  },
  {
    id: "kanpeki", icon: "💯", name: "完璧", nameRomaji: "Kanpeki",
    desc: "Perfection — reach 100% accuracy over 50+ reviews",
    pun: `"Kanpeki" means "perfect" or "complete" — often used in "kanpeki desu!" ("It's perfect!"). 50+ reviews at 100% accuracy is truly... kanpeki!`,
    criteria: { type: "accuracy", threshold: 100 },
  },

  // ── Session ──
  {
    id: "hyakuri", icon: "🏃", name: "百里", nameRomaji: "Hyakuri",
    desc: "100 Leagues — study 100 cards in one session",
    pun: `"Hyakuri" means "100 leagues" — an old Japanese unit of distance. 100 cards in one session is a marathon of focus!`,
    criteria: { type: "session_cards", threshold: 100 },
  },

  // ── Daily Goal ──
  {
    id: "shichiyo", icon: "✅", name: "七曜", nameRomaji: "Shichiyō",
    desc: "Seven Days — hit daily goal 7 days in a row",
    pun: `"Shichiyō" means "seven days" — the days of the week in old Japanese (nichiyō, getsuyō, kayō...). Seven consecutive daily goals — every day of the week!`,
    criteria: { type: "goal_streak", threshold: 7 },
  },
  {
    id: "sanjunichi", icon: "🏅", name: "三十日", nameRomaji: "Sanjūnichi",
    desc: "30 Days — hit daily goal 30 days in a row",
    pun: `"Sanjūnichi" means "30 days." A full month of hitting your daily goal — discipline worthy of a Zen monk!`,
    criteria: { type: "goal_streak", threshold: 30 },
  },

  // ── Behavioral ──
  {
    id: "yofukashi", icon: "🦉", name: "夜更かし", nameRomaji: "Yōfukashi",
    desc: "Night Owl — study after midnight",
    pun: `"Yōfukashi" means "staying up late" — burning the midnight oil. While Japan sleeps, you study kanji! The night is quiet, the characters are clear.`,
    criteria: { type: "time_of_day", threshold: 1, startHour: 0, endHour: 5 },
  },
  {
    id: "asakatsu", icon: "🌅", name: "朝活", nameRomaji: "Asakatsu",
    desc: "Morning Activity — study before 7 AM",
    pun: `"Asakatsu" means "morning activity" — a popular Japanese lifestyle trend of being productive before sunrise. You're an early bird catching the kanji worm!`,
    criteria: { type: "time_of_day", threshold: 1, startHour: 5, endHour: 7 },
  },
  {
    id: "shinkansen", icon: "🚄", name: "新幹線", nameRomaji: "Shinkansen",
    desc: "Bullet Train — study 20 cards in under 3 minutes",
    pun: `"Shinkansen" — the Japanese bullet train, famous for speed and punctuality. 20 cards in 3 minutes? You're on the fast track to fluency!`,
    criteria: { type: "speed", threshold: 20, timeLimit: 180 },
  },

  // ── Reading ──
  {
    id: "ondoku", icon: "🔊", name: "音読", nameRomaji: "Ondoku",
    desc: "ON Reading — review ON readings 50 times",
    pun: `"Ondoku" means "reading aloud" — the Chinese-style ON reading. 50 ON readings! Every kanji has two souls, and you've met the Chinese side.`,
    criteria: { type: "reading_collection", threshold: 50, subtype: "on" },
  },
  {
    id: "kundoku", icon: "📖", name: "訓読", nameRomaji: "Kundoku",
    desc: "KUN Reading — review KUN readings 50 times",
    pun: `"Kundoku" means "reading by meaning" — the Japanese-style KUN reading. 50 KUN readings! You've connected with the native Japanese spirit of each character.`,
    criteria: { type: "reading_collection", threshold: 50, subtype: "kun" },
  },

  // ── Easter egg ──
  {
    id: "nihon", icon: "🇯🇵", name: "日本", nameRomaji: "Nihon",
    desc: "Japan — study both 日 and 本",
    pun: `"Nihon" (日本) is the Japanese name for Japan — written with 日 (sun) and 本 (origin), meaning "land of the rising sun." You've studied both halves of Japan's heart!`,
    criteria: { type: "feature_discovery", keywords: ["日", "本"] },
  },
  {
    id: "tatsu", icon: "🐉", name: "龍", nameRomaji: "Ryū",
    desc: "Dragon — master a kanji from every JLPT level",
    pun: `"Ryū" or "Tatsu" — the dragon, one of the 12 zodiac animals. The dragon is the most powerful mythical creature, and mastering all JLPT levels makes YOU the dragon of kanji!`,
    criteria: { type: "feature_discovery", keywords: ["N5", "N4", "N3", "N2", "N1"] },
  },

  // ── Comeback ──
  {
    id: "ronin", icon: "⛩️", name: "浪人", nameRomaji: "Rōnin",
    desc: "Masterless Samurai — return after 14+ days away",
    pun: `"Rōnin" — a masterless samurai, wandering without a lord. Like a warrior returning from exile, you came back after 14+ days. The rōnin finds a new purpose!`,
    criteria: { type: "comeback", threshold: 14 },
  },

  // ── Perfect streak ──
  {
    id: "ogonshukan", icon: "🗓️", name: "黄金週間", nameRomaji: "Ōgonshūkan",
    desc: "Golden Week — 7 consecutive perfect days",
    pun: `"Ōgonshūkan" — Golden Week, Japan's most cherished holiday stretch (April 29 to May 5). 7 consecutive perfect days is your personal Golden Week of achievement!`,
    criteria: { type: "perfect_streak", threshold: 7 },
  },
];

export interface UnlockedEntry {
  achievementId: string;
  unlockedAt: Date;
}

interface UserStats {
  totalCardsStudied: number;
  kanjiMastered: number;
  currentStreak: number;
  totalCorrect: number;
  totalIncorrect: number;
}

interface SessionInfo {
  perfectSession: boolean;
  sessionCards: number;
  sessionDuration: number;
  sessionStartHour: number;
  goalStreak: number;
  readingOnCount: number;
  readingKunCount: number;
  studiedCharacters: string[];
  perfectDaysStreak: number;
  daysSinceLastStudy: number;
  firstCorrect: boolean;
  jlptLevelsMastered: string[];
}

interface UserFlags {
  visitedExplore: boolean;
  usedAudio: boolean;
  addedToDeck: boolean;
  openedKanjiDetail: boolean;
  setGoal: boolean;
}

export function checkAchievements(
  unlocked: UnlockedEntry[],
  stats: UserStats,
  session: SessionInfo,
  flags: UserFlags,
): AchievementDef[] {
  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));
  const total = stats.totalCorrect + stats.totalIncorrect;
  const accuracy = total > 0 ? Math.round((stats.totalCorrect / total) * 100) : 0;
  const newAchievements: AchievementDef[] = [];

  for (const def of ACHIEVEMENT_DEFS) {
    if (unlockedIds.has(def.id)) continue;

    let earned = false;

    switch (def.criteria.type) {
      case "total_reviews":
        if (def.id === "seikai") {
          earned = stats.totalCorrect >= 1;
        } else {
          earned = stats.totalCardsStudied >= (def.criteria.threshold ?? 1);
        }
        break;
      case "kanji_mastered":
        earned = stats.kanjiMastered >= (def.criteria.threshold ?? 1);
        break;
      case "streak":
        earned = stats.currentStreak >= (def.criteria.threshold ?? 1);
        break;
      case "accuracy":
        earned = total >= 50 && accuracy >= (def.criteria.threshold ?? 100);
        break;
      case "perfect_session":
        if (def.id === "mangan") {
          earned = session.perfectSession && session.sessionCards >= 10;
        } else {
          earned = session.perfectSession;
        }
        break;
      case "session_cards":
        earned = session.sessionCards >= (def.criteria.threshold ?? 1);
        break;
      case "goal_streak":
        earned = session.goalStreak >= (def.criteria.threshold ?? 1);
        break;
      case "flag":
        earned = !!(def.criteria.flag && (flags as any)[def.criteria.flag]);
        break;
      case "time_of_day": {
        const { startHour = 0, endHour = 23 } = def.criteria;
        earned = session.sessionStartHour >= startHour && session.sessionStartHour < endHour;
        break;
      }
      case "speed":
        earned = session.sessionCards >= (def.criteria.threshold ?? 20)
          && session.sessionDuration <= (def.criteria.timeLimit ?? 180);
        break;
      case "reading_collection": {
        const count = def.criteria.subtype === "kun" ? session.readingKunCount : session.readingOnCount;
        earned = count >= (def.criteria.threshold ?? 50);
        break;
      }
      case "feature_discovery": {
        if (def.id === "nihon") {
          earned = session.studiedCharacters.includes("日") && session.studiedCharacters.includes("本");
        }
        if (def.id === "tatsu") {
          earned = session.jlptLevelsMastered.length >= 5;
        }
        break;
      }
      case "comeback":
        earned = session.daysSinceLastStudy >= (def.criteria.threshold ?? 14);
        break;
      case "perfect_streak":
        earned = session.perfectDaysStreak >= (def.criteria.threshold ?? 7);
        break;
    }

    if (earned) newAchievements.push(def);
  }

  return newAchievements;
}
