# Claude Code Prompt — `learn-kanji` Full-Stack Application (v2 — Complete)

---

## Project Overview

Build a full-stack, production-grade web application called **learn-kanji** — a Japanese Kanji learning platform with a comprehensive explorer, a spaced-repetition study engine, full user authentication, gamified progress tracking, and daily streaks. The app covers 13,000+ Kanji characters sourced from the [KanjiAPI / KANJIDIC2](https://kanjiapi.dev/) public dataset.

This is not a simple CRUD app. Every system must be engineered for performance, security, and a polished user experience.

---

## Complete Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | Full-stack framework, SSR, API routes |
| Language | **TypeScript (strict mode)** | No `any`, no exceptions |
| Database | **MongoDB Atlas** (cloud) | Primary data store |
| ODM | **Mongoose** | Typed schemas, connection pooling |
| Auth | **Custom JWT** (via `jose`) | Stateless auth, httpOnly cookies |
| Password Hashing | **bcryptjs** (12 rounds) | Secure password storage |
| Password Strength | **zxcvbn** | Client-side password strength meter |
| Breached Password Check | **HIBP API** (k-anonymity) | Check if password appears in data breaches |
| Email | **Resend** | Transactional email (verification, reset) |
| Rate Limiting | **@upstash/ratelimit** + **@upstash/redis** | Protect auth endpoints, Redis-backed |
| Caching | **Upstash Redis** | Session cache, streak calculations |
| Styling | **Tailwind CSS v3** | Utility-first CSS |
| UI Components | **shadcn/ui** (Radix UI) | Accessible headless components |
| Icons | **Lucide React** | Icon library |
| Forms | **React Hook Form** + **@hookform/resolvers/zod** | Form state + Zod validation |
| Client State | **Zustand** | Auth store, streak UI state, study session state |
| Server State | **TanStack Query v5** | Caching, background refetch, optimistic updates |
| Validation | **Zod** | All schemas: API params, form inputs, env vars |
| Animation | **Framer Motion** | Page transitions, card animations, confetti |
| Confetti | **canvas-confetti** | Milestone celebrations |
| Date Utils | **date-fns** | Streak calculations, due-date formatting |
| Charts | **Recharts** | Progress graphs, heatmap, study stats |
| Toasts | **Sonner** | Elegant toast notifications |
| Fonts | **next/font** | No layout shift, preloaded |
| Env Validation | **@t3-oss/env-nextjs** | Type-safe env vars, build-time check |
| Linting | **ESLint + Prettier** | Code quality |
| Deployment | **Vercel** | Edge network, serverless functions |

---

## Project Directory Structure

```
learn-kanji/
├── app/
│   ├── layout.tsx                        # Root layout — providers, fonts, Sonner
│   ├── page.tsx                          # Landing / marketing page (unauthenticated)
│   ├── globals.css
│   │
│   ├── (auth)/                           # Auth route group — no sidebar
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-email/page.tsx         # ?token=... page
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx       # ?token=... page
│   │
│   ├── (app)/                            # Protected route group — with sidebar/nav
│   │   ├── layout.tsx                    # App shell: sidebar, top nav, auth guard
│   │   ├── dashboard/page.tsx            # Overview: streak, XP, recent activity
│   │   ├── explore/page.tsx              # Kanji explorer (search, filter, grid)
│   │   ├── kanji/[character]/page.tsx    # Kanji detail page
│   │   ├── study/page.tsx                # Study session launcher
│   │   ├── study/session/page.tsx        # Active SRS session (flashcards/quiz)
│   │   ├── progress/page.tsx             # Full stats, charts, heatmap
│   │   └── settings/page.tsx             # Profile, preferences, change password
│   │
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── me/route.ts               # GET current user (validates JWT)
│       │   ├── verify-email/route.ts     # POST { token }
│       │   ├── resend-verification/route.ts
│       │   ├── forgot-password/route.ts  # POST { email }
│       │   ├── reset-password/route.ts   # POST { token, newPassword }
│       │   └── change-password/route.ts  # POST { currentPassword, newPassword }
│       │
│       ├── kanji/
│       │   ├── route.ts                  # GET — list, paginated, filtered
│       │   └── [character]/route.ts      # GET — single kanji detail
│       │
│       ├── study/
│       │   ├── deck/route.ts             # GET — cards due + new cards for session
│       │   ├── review/route.ts           # POST — submit review result (SM-2)
│       │   └── add/route.ts              # POST — add kanji to user's deck
│       │
│       └── progress/
│           ├── route.ts                  # GET — full stats summary
│           ├── streak/route.ts           # GET — streak data
│           └── heatmap/route.ts          # GET — 365-day activity heatmap
│
├── components/
│   ├── ui/                               # shadcn/ui generated components
│   ├── auth/
│   │   ├── register-form.tsx
│   │   ├── login-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   ├── reset-password-form.tsx
│   │   └── password-strength-meter.tsx   # zxcvbn visual meter
│   ├── kanji/
│   │   ├── kanji-card.tsx
│   │   ├── kanji-grid.tsx
│   │   ├── kanji-detail-modal.tsx
│   │   ├── search-bar.tsx
│   │   └── filter-bar.tsx
│   ├── study/
│   │   ├── flashcard.tsx                 # Flip animation card
│   │   ├── quiz-card.tsx                 # Multiple choice card
│   │   ├── difficulty-buttons.tsx        # Again / Hard / Good / Easy
│   │   ├── session-progress-bar.tsx
│   │   └── session-summary.tsx           # End-of-session results + confetti
│   ├── dashboard/
│   │   ├── streak-widget.tsx
│   │   ├── xp-bar.tsx
│   │   ├── stats-grid.tsx
│   │   ├── due-today-card.tsx
│   │   └── recent-activity.tsx
│   ├── progress/
│   │   ├── activity-heatmap.tsx          # GitHub-style calendar heatmap
│   │   ├── level-ring.tsx                # Circular progress for XP level
│   │   ├── mastery-chart.tsx             # Recharts bar chart by JLPT level
│   │   └── accuracy-trend.tsx            # Line chart of review accuracy
│   └── layout/
│       ├── sidebar.tsx
│       ├── top-nav.tsx
│       └── auth-guard.tsx                # Client component — redirect if no session
│
├── lib/
│   ├── db.ts                             # Mongoose singleton connection
│   ├── env.ts                            # @t3-oss/env-nextjs schema
│   ├── jwt.ts                            # jose sign/verify helpers
│   ├── auth.ts                           # Password hash/verify, token generation
│   ├── email.ts                          # Resend email helpers
│   ├── redis.ts                          # Upstash Redis client singleton
│   ├── rate-limit.ts                     # @upstash/ratelimit helpers
│   ├── srs.ts                            # SM-2 spaced repetition algorithm
│   ├── xp.ts                             # XP calculation, level formulas
│   ├── streak.ts                         # Streak calculation utilities
│   ├── validations.ts                    # All Zod schemas
│   ├── api.ts                            # Client-side fetch helpers
│   ├── utils.ts                          # cn(), formatters
│   └── models/
│       ├── user.model.ts
│       ├── kanji.model.ts
│       ├── kanji-progress.model.ts       # Per-user SRS card state
│       ├── study-session.model.ts        # Session history records
│       └── streak-record.model.ts        # Daily activity log
│
├── hooks/
│   ├── use-auth.ts                       # Zustand auth store
│   ├── use-study-session.ts              # Zustand session state machine
│   ├── use-streak.ts                     # TanStack Query streak hook
│   ├── use-kanji.ts                      # TanStack Query kanji hooks
│   ├── use-progress.ts                   # TanStack Query progress hooks
│   └── use-debounce.ts
│
├── stores/
│   ├── auth.store.ts                     # Zustand: user, isLoading, login/logout
│   └── session.store.ts                  # Zustand: active study session state
│
├── types/
│   ├── kanji.ts
│   ├── user.ts
│   ├── study.ts
│   └── api.ts                            # All API response types
│
├── scripts/
│   └── seed.ts                           # Kanji DB seed script
│
├── emails/                               # React Email templates (optional)
│   ├── verification.tsx
│   └── reset-password.tsx
│
├── middleware.ts                          # Next.js middleware — JWT auth check
├── .env.local
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Database Models

### 1. User Model (`lib/models/user.model.ts`)

```typescript
interface IUser {
  // Identity
  email: string;              // unique, lowercase, indexed
  passwordHash: string;       // bcryptjs, 12 rounds

  // Email verification
  emailVerified: boolean;     // default: false
  emailVerificationToken: string | null;
  emailVerificationExpiry: Date | null;

  // Password reset
  passwordResetToken: string | null;   // SHA-256 hashed token
  passwordResetExpiry: Date | null;

  // Profile
  displayName: string;
  avatarUrl: string | null;
  timezone: string;            // IANA tz string, default 'UTC'

  // Preferences
  preferences: {
    dailyGoal: number;         // cards per day, default 20
    newCardsPerDay: number;    // max new cards, default 10
    studyMode: 'flashcard' | 'quiz' | 'mixed';
    jlptTarget: 1 | 2 | 3 | 4 | 5;  // target JLPT level
  };

  // Aggregate stats (denormalized for dashboard speed)
  stats: {
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;   // 'YYYY-MM-DD' in user's timezone
    totalCardsStudied: number;
    totalCorrect: number;
    totalIncorrect: number;
    totalTimeStudied: number;       // seconds
    kanjiLearned: number;           // cards that reached 'review' stage
    kanjiMastered: number;          // cards that reached 'mastered' stage
  };

  createdAt: Date;
  updatedAt: Date;
}
```

Indexes: `email` (unique), `passwordResetToken`, `emailVerificationToken`

### 2. Kanji Model (`lib/models/kanji.model.ts`)

```typescript
interface IKanji {
  character: string;           // unique, indexed
  strokes: number;             // indexed
  grade: number | null;        // school grade, indexed
  freq: number | null;         // frequency rank, indexed
  jlpt_new: number | null;     // 1–5 (N1–N5), indexed
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  name_readings: string[];
}
```

Indexes: compound text on `meanings + readings_on + readings_kun`, single on `jlpt_new`, `strokes`, `grade`, `freq`

### 3. KanjiProgress Model (`lib/models/kanji-progress.model.ts`)

This is the SRS card state — one document per (user × kanji) pair.

```typescript
interface IKanjiProgress {
  userId: ObjectId;            // ref: User, indexed
  character: string;           // indexed
  
  // SM-2 Algorithm Fields
  interval: number;            // days until next review (starts at 0)
  repetitions: number;         // consecutive successful reviews
  easeFactor: number;          // difficulty multiplier, starts at 2.5, min 1.3
  dueDate: Date;               // when next review is scheduled, indexed

  // Stage
  stage: 'new' | 'learning' | 'review' | 'mastered';
  // new = just added, learning = interval < 1 day, review = scheduled,
  // mastered = interval > 21 days + repetitions > 5

  // Stats
  totalReviews: number;
  correctReviews: number;
  lapses: number;              // times card went from review back to learning
  xpEarned: number;
  lastReviewDate: Date | null;
  firstReviewDate: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
```

Compound unique index: `{ userId, character }`. Index on `{ userId, dueDate }`, `{ userId, stage }`.

### 4. StudySession Model (`lib/models/study-session.model.ts`)

```typescript
interface IStudySession {
  userId: ObjectId;
  date: string;                // 'YYYY-MM-DD'
  cardsStudied: number;
  newCards: number;
  reviewCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  xpEarned: number;
  durationSeconds: number;
  dailyGoalMet: boolean;
  createdAt: Date;
}
```

Index: `{ userId, date }` (compound)

### 5. StreakRecord Model (`lib/models/streak-record.model.ts`)

```typescript
interface IStreakRecord {
  userId: ObjectId;
  date: string;                // 'YYYY-MM-DD'
  studied: boolean;
  cardsStudied: number;
  goalMet: boolean;
}
```

Compound unique index: `{ userId, date }`

---

## Authentication System

### Architecture

Use **stateless JWT auth** stored in **httpOnly, Secure, SameSite=Strict cookies**. No session stored server-side. JWTs expire in 7 days. On every protected API request, middleware validates the JWT and injects `userId` into request headers.

### JWT (`lib/jwt.ts`)

Use the **`jose`** library (Web Crypto API — works in Vercel Edge).

```typescript
// Sign
const token = await new SignJWT({ userId: user._id.toString() })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(new TextEncoder().encode(process.env.JWT_SECRET));

// Verify
const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
```

### Next.js Middleware (`middleware.ts`)

Protect all `(app)` routes and API routes under `/api/study`, `/api/progress`. Redirect unauthenticated users to `/login`. Inject `x-user-id` header to API routes so route handlers don't re-verify.

```typescript
// Protected path patterns:
const PROTECTED = ['/dashboard', '/explore', '/study', '/progress', '/settings',
                   '/api/study', '/api/progress', '/api/auth/me', '/api/auth/change-password'];
```

### Password Security (`lib/auth.ts`)

```typescript
// Hashing: bcryptjs with 12 salt rounds
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, hash);

// Token generation (for email verification and password reset)
const rawToken = crypto.randomBytes(32).toString('hex');
const hashedToken = createHash('sha256').update(rawToken).digest('hex');
// Store hashedToken in DB, send rawToken in email link
```

### HIBP (Have I Been Pwned) Check (`lib/auth.ts`)

On registration AND password change, check the password against the HIBP API using k-anonymity (only send first 5 chars of SHA-1 hash):

```typescript
async function isPasswordBreached(password: string): Promise<boolean> {
  const sha1 = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await res.text();
  return text.split('\n').some(line => line.startsWith(suffix));
}
```

Return a 400 error if breached: `"This password has appeared in a known data breach. Please choose a different password."`

### Password Validation Rules

Enforce server-side (Zod) and show client-side (zxcvbn):
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (`!@#$%^&*`)
- zxcvbn score must be >= 3 (out of 4)
- Not in HIBP breach database

### Password Strength Meter (`components/auth/password-strength-meter.tsx`)

Client-side component using `zxcvbn`. Show a 4-segment bar that fills and color-shifts:
- Score 0–1: Red "Too weak"
- Score 2: Orange "Weak"
- Score 3: Yellow "Fair"
- Score 4: Green "Strong"

Show specific feedback from `zxcvbn().feedback.suggestions`.

### Rate Limiting (`lib/rate-limit.ts`)

Use `@upstash/ratelimit` with `@upstash/redis`. Apply per IP and per email:

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/auth/login` | 10 attempts | 15 minutes |
| `POST /api/auth/register` | 5 attempts | 1 hour |
| `POST /api/auth/forgot-password` | 3 attempts | 1 hour |
| `POST /api/auth/resend-verification` | 3 attempts | 1 hour |
| `POST /api/auth/reset-password` | 5 attempts | 1 hour |

Return `429 Too Many Requests` with `{ error: "Too many attempts. Try again in X minutes.", retryAfter: seconds }`.

### Auth API Routes

#### `POST /api/auth/register`
1. Validate body with Zod: `{ email, password, displayName }`
2. Rate limit check (IP)
3. Check email not already registered (send generic "check your email" response even if exists — prevents email enumeration)
4. Validate password (rules + HIBP check)
5. Hash password with bcryptjs
6. Generate email verification token (raw + hashed)
7. Create user in DB with `emailVerified: false`
8. Send verification email via Resend
9. Return `201 { message: "Check your email to verify your account." }`

#### `POST /api/auth/login`
1. Rate limit (IP + email)
2. Find user by email
3. If user not found: `401 { error: "Invalid email or password." }` (identical message — no enumeration)
4. Compare password with bcryptjs
5. If no match: `401` same message, also record failed attempt
6. If `emailVerified === false`: `403 { error: "Please verify your email before logging in.", code: "EMAIL_NOT_VERIFIED" }`
7. Sign JWT, set cookie: `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/`
8. Return `200 { user: { id, email, displayName, stats, preferences } }`

#### `POST /api/auth/logout`
Clear the cookie. Return `200`.

#### `POST /api/auth/verify-email`
1. Accept `{ token }` in body
2. SHA-256 hash the token, find user by `emailVerificationToken` where expiry > now
3. If not found: `400 { error: "Invalid or expired verification link." }`
4. Set `emailVerified: true`, clear token fields
5. Auto-login: sign JWT and set cookie
6. Return `200 { message: "Email verified!", user: {...} }`

#### `POST /api/auth/forgot-password`
1. Rate limit (IP + email)
2. Find user by email
3. **Always return `200 { message: "If that email exists, a reset link has been sent." }` regardless** (no enumeration)
4. If user exists: generate reset token, set expiry (1 hour), send email via Resend

#### `POST /api/auth/reset-password`
1. Accept `{ token, newPassword }`
2. Validate new password (all rules + HIBP)
3. Hash token, find user by `passwordResetToken` where expiry > now
4. If not found: `400 { error: "Invalid or expired reset link." }`
5. Hash new password, update user, clear token fields
6. Invalidate all existing sessions (optional: add `passwordChangedAt` field to JWT validation)
7. Return `200 { message: "Password reset successfully. Please log in." }`

#### `POST /api/auth/change-password`
Requires auth middleware. Accept `{ currentPassword, newPassword }`. Verify current, validate new (rules + HIBP), update.

---

## Email System (Resend)

Install: `resend`

Create `lib/email.ts` with two functions:

```typescript
sendVerificationEmail(to: string, displayName: string, token: string): Promise<void>
sendPasswordResetEmail(to: string, displayName: string, token: string): Promise<void>
```

Email templates (write inline or use React Email):
- **Verification email**: Subject: "Verify your Learn Kanji account", body includes a large button "Verify Email" linking to `${APP_URL}/verify-email?token=${rawToken}`
- **Reset email**: Subject: "Reset your Learn Kanji password", link to `${APP_URL}/reset-password?token=${rawToken}`, "This link expires in 1 hour."

Both emails should have a clean, minimal HTML design consistent with the app's dark/Japanese aesthetic (use inline styles for email compatibility).

---

## Spaced Repetition System (SRS)

### Algorithm: SM-2 (`lib/srs.ts`)

Implement the SM-2 algorithm. After each card review, the user rates difficulty on a 4-point scale:

| Button | Quality Value | Meaning |
|---|---|---|
| **Again** | 1 | Complete blackout — forgot |
| **Hard** | 2 | Remembered with significant difficulty |
| **Good** | 3 | Remembered correctly with some effort |
| **Easy** | 5 | Perfect recall instantly |

```typescript
interface ReviewResult {
  interval: number;       // days until next review
  repetitions: number;
  easeFactor: number;     // min 1.3
  dueDate: Date;
  stage: CardStage;
}

function calculateNextReview(card: SRSCard, quality: 1 | 2 | 3 | 5): ReviewResult {
  let { interval, repetitions, easeFactor } = card;

  if (quality < 3) {
    // Incorrect — reset
    repetitions = 0;
    interval = quality === 1 ? 0 : 1;  // Again: same day. Hard: next day.
  } else {
    // Correct
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);
    repetitions++;
  }

  // Determine stage
  const stage: CardStage =
    interval === 0 ? 'learning' :
    interval < 2 ? 'learning' :
    repetitions >= 5 && interval >= 21 ? 'mastered' : 'review';

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return { interval, repetitions, easeFactor, dueDate, stage };
}
```

### Study Session Flow

1. **Session Start**: Call `GET /api/study/deck`
   - Returns up to `newCardsPerDay` new cards (stage: 'new', not yet in user's deck → auto-create KanjiProgress on first review)
   - Returns all cards where `dueDate <= now` and `stage !== 'new'`
   - Shuffle the deck
   - Return max 50 cards per session

2. **During Session**: Client-side state (Zustand `session.store.ts`) manages:
   - Queue of remaining cards
   - Cards answered incorrectly go back into queue (shown again before session ends)
   - Track: correct count, incorrect count, XP earned so far, time elapsed

3. **Each Card**: 
   - `POST /api/study/review` body: `{ character, quality: 1 | 2 | 3 | 5 }`
   - Server updates `KanjiProgress`, awards XP, updates user stats
   - Returns: `{ nextCard: KanjiProgress, xpAwarded, levelUp: boolean }`

4. **Session End**: 
   - Create `StudySession` record
   - Update streak record for today
   - Recalculate and update streak on User
   - If `levelUp`: return level-up data for celebration

### Study Modes (`components/study/`)

**Mode 1 — Flashcard**
- Show kanji character on front
- User taps to flip and reveal: meanings, readings, stroke count
- Then user rates: Again / Hard / Good / Easy
- Flip animation using Framer Motion (rotateY 0° → 180°)

**Mode 2 — Multiple Choice Quiz**
- Show kanji, ask for the meaning
- 4 options: 1 correct meaning + 3 random meanings from other kanji (same JLPT level)
- Correct → auto-mark "Good"; Wrong → auto-mark "Again"
- Color flash feedback (green/red)

**Mode 3 — Mixed** (default): Alternate between modes based on user preference.

---

## XP & Level System (`lib/xp.ts`)

### XP Awards

| Action | XP |
|---|---|
| Review card (correct) | +5 |
| Review card (incorrect) | +1 |
| New card learned correctly | +10 |
| Card reaches "mastered" stage | +50 |
| Perfect session (100% correct, ≥10 cards) | +75 bonus |
| Daily goal met | +100 |
| Streak milestone: 7 days | +200 |
| Streak milestone: 30 days | +500 |
| Streak milestone: 100 days | +1000 |
| First review of the day | +10 |

### Level Formula

```typescript
// XP required to REACH level N (total cumulative XP):
function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.8));
}
// Level 1: 100 XP, Level 2: 287 XP, Level 5: 2,870 XP, Level 10: 15,848 XP, Level 50: ~1.7M XP

function getLevelFromXP(totalXP: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) level++;
  return level;
}

function getProgressToNextLevel(totalXP: number): { current: number; required: number; percentage: number } {
  const level = getLevelFromXP(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  return {
    current: totalXP - currentLevelXP,
    required: nextLevelXP - currentLevelXP,
    percentage: ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100,
  };
}
```

---

## Daily Streak System (`lib/streak.ts`)

### Rules
- A streak counts if the user studies **at least once** on a calendar day (in their timezone)
- A streak is broken if they miss a full calendar day
- Users set a timezone in preferences; all streak calculations use that timezone
- Check and update streak on every `POST /api/study/review`

### Calculation

```typescript
function calculateStreak(user: IUser, today: string): { current: number; broken: boolean } {
  const last = user.stats.lastStudyDate;
  if (!last) return { current: 1, broken: false };

  const diff = differenceInCalendarDays(parseISO(today), parseISO(last));

  if (diff === 0) return { current: user.stats.currentStreak, broken: false }; // already studied today
  if (diff === 1) return { current: user.stats.currentStreak + 1, broken: false }; // consecutive day
  return { current: 1, broken: true }; // missed days — reset
}
```

### Streak Freeze (optional premium feature — scaffold but mark as TODO)
Allow users to "freeze" a streak to protect it for one missed day.

---

## API Routes — Complete Spec

### Study Routes (all require auth)

#### `GET /api/study/deck`
Returns the user's study queue for a session.

```typescript
// Response:
{
  newCards: KanjiProgress[];        // stage='new', up to newCardsPerDay limit
  dueCards: KanjiProgress[];        // dueDate <= now, stage='learning'|'review'
  todayStats: {
    studiedToday: number;
    goalMet: boolean;
    dailyGoal: number;
    newCardsTodayCount: number;
  };
}
```

#### `POST /api/study/review`
Body: `{ character: string, quality: 1 | 2 | 3 | 5, sessionStartTime: string }`

1. Find or create `KanjiProgress` for `{ userId, character }`
2. Run SM-2 calculation
3. Update KanjiProgress
4. Award XP, check for level-up, check for milestone
5. Update `user.stats` (denormalized)
6. Update today's `StreakRecord`
7. Recalculate streak on user

Response:
```typescript
{
  progress: KanjiProgress;
  xpAwarded: number;
  totalXP: number;
  levelUp: { from: number; to: number } | null;
  streakMilestone: number | null;  // e.g., 7, 30, 100
}
```

#### `POST /api/study/add`
Body: `{ character: string }` — Adds a kanji to user's deck (creates KanjiProgress with stage='new', dueDate=now)

### Progress Routes (all require auth)

#### `GET /api/progress`
```typescript
{
  user: { displayName, level, totalXP, xpToNextLevel, xpProgress },
  stats: IUser['stats'],
  breakdown: {
    byJlpt: Record<'N1'|'N2'|'N3'|'N4'|'N5', { total: number; learned: number; mastered: number }>;
    byStage: Record<CardStage, number>;
  }
}
```

#### `GET /api/progress/streak`
```typescript
{
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  studiedToday: boolean;
  weeklyActivity: boolean[];  // last 7 days
}
```

#### `GET /api/progress/heatmap`
Returns 365 days of activity data:
```typescript
{ date: string; count: number; goalMet: boolean }[]
```

---

## Dashboard Page (`(app)/dashboard/page.tsx`)

Server-rendered with RSC. Must show:

1. **Welcome Header** — "おはよう, {displayName}" (use appropriate greeting by time of day)
2. **Streak Widget** — Current streak with fire icon, last 7 days dots, longest streak. If studied today: green glow. If not yet: amber pulse.
3. **XP Level Bar** — Circular level ring + linear progress bar to next level. Show XP earned today.
4. **Today's Goal** — Ring chart showing X/Y cards studied today. "Study Now" button if goal not met.
5. **Due Today** — Count of cards due for review. Card with "Start Review" CTA.
6. **Stats Grid** — 4 stat boxes: Total Learned, Total Mastered, Accuracy %, Total Time
7. **Recent Activity** — Last 5 study sessions with date, cards, accuracy, XP

---

## Study Session Page (`(app)/study/session/page.tsx`)

This is the most important interactive page. Architecture:

- Pure client component — all state in Zustand `session.store.ts`
- Load deck from `GET /api/study/deck` on mount
- Session states: `loading → ready → studying → reviewing → complete`
- Show top progress bar: cards remaining / total in session
- Show timer (stopwatch, per-session total)
- Cards animate in/out with Framer Motion (slide left on next card)
- On session complete: show `SessionSummary` with:
  - Accuracy percentage (big number)
  - XP earned
  - Cards reviewed breakdown (new vs review, correct vs incorrect)
  - If level up: animated level-up banner
  - If streak milestone: confetti via `canvas-confetti`
  - "Study More" / "Back to Dashboard" buttons

---

## Progress Page (`(app)/progress/page.tsx`)

Full analytics dashboard with:

1. **Activity Heatmap** — GitHub-style 52-week calendar. Recharts custom or SVG. Color intensity by cards studied. Tooltip on hover.
2. **Mastery Chart** — Stacked bar chart (Recharts) showing New/Learning/Review/Mastered by JLPT level
3. **Accuracy Trend** — Line chart: last 30 days rolling accuracy %
4. **SRS Stage Breakdown** — Donut chart of cards by stage
5. **Study Time** — Total time studied, average session length

---

## Settings Page (`(app)/settings/page.tsx`)

Tabs using shadcn/ui `Tabs`:

1. **Profile** — Change displayName, timezone (select from IANA list), avatar upload (future)
2. **Study Preferences** — Daily goal slider (5–100), new cards/day slider, study mode radio, JLPT target
3. **Account** — Change password form (current + new + confirm, with strength meter), delete account (requires password confirmation)

---

## Kanji Explorer Page (`(app)/explore/page.tsx`)

Same as original explorer but now with:
- Auth required
- "Add to Deck" button on each KanjiCard (only shown if not already in deck)
- If card is in deck: show stage badge ("Learning" / "Review" / "Mastered") with JLPT color
- Optimistic update on "Add to Deck" via TanStack Query `useMutation`
- Load user's deck status alongside kanji list: `GET /api/kanji?includeProgress=true`

---

## Forms — React Hook Form + Zod

All auth forms use React Hook Form with Zod resolvers. Example structure:

```typescript
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' },
});
```

Show inline field errors from React Hook Form. Show server errors as a toast (Sonner) and/or an error banner above the form.

### Email Validation (Client-Side Extra)

On the register form, after the email field blurs, validate the email format locally AND also check for obviously fake domains (disposable email providers). Maintain a short blocklist of common disposable domains: `mailinator.com`, `tempmail.com`, `throwaway.email`, `guerrillamail.com`, `10minutemail.com`, etc. Show a warning if detected but don't block server-side (let the verification email do that naturally).

---

## Zustand Stores

### `stores/auth.store.ts`

```typescript
interface AuthStore {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: PublicUser | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

Initialize by calling `GET /api/auth/me` on app load (in the root layout or a Provider component).

### `stores/session.store.ts`

```typescript
interface SessionStore {
  status: 'idle' | 'loading' | 'active' | 'complete';
  queue: KanjiProgress[];
  currentCard: KanjiProgress | null;
  reviewedCards: ReviewedCard[];
  sessionStartTime: Date | null;
  xpEarnedThisSession: number;
  levelUpEvent: { from: number; to: number } | null;
  
  startSession: (deck: StudyDeck) => void;
  submitReview: (character: string, quality: Quality) => Promise<void>;
  nextCard: () => void;
  endSession: () => void;
}
```

---

## Design System & UI

### Theme

Dark mode by default. Japanese ink and paper aesthetic with modern data-app feel.

- **Background**: `#080c14` (near-black navy)
- **Surface**: `#0f1724` (card backgrounds)
- **Border**: `#1e2d44` (subtle borders)
- **Accent**: `#e8a045` (warm gold — Japanese lantern)
- **Text Primary**: `#f0f4ff`
- **Text Secondary**: `#8fa3be`

### Fonts (via `next/font`)

- **Kanji display**: `Noto Serif JP` — weight 400, 700 — makes glyphs beautiful
- **UI headings**: `Bricolage Grotesque` — distinctive, modern, a bit editorial
- **UI body**: `Inter` — readable body text (exception to the "no Inter" rule because it's paired with a strong display font)

### JLPT Color System

```typescript
const JLPT_COLORS = {
  5: { bg: '#064e3b', text: '#34d399', border: '#10b981' }, // Emerald
  4: { bg: '#0c4a6e', text: '#38bdf8', border: '#0ea5e9' }, // Sky
  3: { bg: '#2e1065', text: '#c084fc', border: '#8b5cf6' }, // Violet
  2: { bg: '#451a03', text: '#fcd34d', border: '#f59e0b' }, // Amber
  1: { bg: '#4c0519', text: '#fb7185', border: '#f43f5e' }, // Rose
} as const;
```

### Animations

- **Page transitions**: Framer Motion `AnimatePresence` with subtle fade + slide
- **Card flip** (flashcard): `rotateY` 0° → 180° — use `backfaceVisibility: hidden` on front/back
- **Card entrance**: Staggered `opacity + translateY` on grid load
- **XP bar fill**: Framer Motion animated width on level/XP change
- **Confetti**: `canvas-confetti` with Japanese red and gold colors on milestone events
- **Streak fire**: CSS pulse animation when streak is active and hasn't been continued today

---

## Environment Variables

Create `.env.local`:

```bash
# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/learn-kanji?retryWrites=true&w=majority

# Auth
JWT_SECRET=<at-least-64-char-random-hex-string>  # openssl rand -hex 64

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=noreply@yourdomain.com

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

All validated at build time by `@t3-oss/env-nextjs` in `lib/env.ts`.

---

## Package Installation Commands

```bash
# Create project
npx create-next-app@latest learn-kanji --typescript --tailwind --eslint --app

# Core
npm install mongoose zod @t3-oss/env-nextjs

# Auth
npm install jose bcryptjs zxcvbn
npm install -D @types/bcryptjs @types/zxcvbn

# Email
npm install resend

# Rate limiting / Redis
npm install @upstash/redis @upstash/ratelimit

# Forms
npm install react-hook-form @hookform/resolvers

# State management
npm install zustand @tanstack/react-query

# UI
npm install framer-motion lucide-react sonner canvas-confetti recharts date-fns
npm install -D @types/canvas-confetti

# Seed script
npm install -D tsx p-limit @types/node

# Init shadcn/ui
npx shadcn@latest init

# Add shadcn components:
npx shadcn@latest add button input badge dialog drawer skeleton tooltip
npx shadcn@latest add tabs progress avatar dropdown-menu alert separator
npx shadcn@latest add popover card label select slider switch
```

---

## Step-by-Step Build Order

Build in this exact order to avoid circular dependency issues:

### Phase 1 — Foundation
1. Init Next.js project, configure `tsconfig.json` (`strict: true`), set up ESLint + Prettier
2. Configure Tailwind with custom theme colors and JLPT palette
3. Set up env validation in `lib/env.ts`
4. Set up Mongoose singleton in `lib/db.ts`
5. Create all Mongoose models with indexes

### Phase 2 — Kanji Data
6. Write and run the seed script `scripts/seed.ts` — populate MongoDB Atlas
7. Build `GET /api/kanji` and `GET /api/kanji/[character]` API routes
8. Verify data with a quick test (curl or Postman)

### Phase 3 — Authentication
9. Implement `lib/jwt.ts`, `lib/auth.ts` (hashing, token generation, HIBP check)
10. Implement `lib/email.ts` (Resend integration + email templates)
11. Implement `lib/redis.ts` + `lib/rate-limit.ts`
12. Build all auth API routes (register → login → logout → verify → forgot → reset → change)
13. Write `middleware.ts` for route protection
14. Build auth pages: register, login, forgot-password, reset-password, verify-email
15. Build auth form components with React Hook Form + Zod + password strength meter
16. Set up Zustand auth store and `GET /api/auth/me` polling on app load

### Phase 4 — Kanji Explorer
17. Build KanjiCard, KanjiGrid, SearchBar, FilterBar components
18. Build the Explorer page with SSR + TanStack Query for filter updates
19. Build KanjiDetail modal and page
20. Add "Add to Deck" functionality with optimistic updates

### Phase 5 — Study System
21. Implement SM-2 algorithm in `lib/srs.ts`
22. Implement XP system in `lib/xp.ts`
23. Implement streak system in `lib/streak.ts`
24. Build `GET /api/study/deck` and `POST /api/study/review` routes
25. Build Zustand session store
26. Build Flashcard component (with flip animation)
27. Build Quiz card component (with multiple choice)
28. Build the Study Session page (state machine: loading → active → complete)
29. Build Session Summary with confetti for milestones

### Phase 6 — Progress & Dashboard
30. Build `GET /api/progress`, `/streak`, `/heatmap` routes
31. Build Dashboard page with all widgets
32. Build Progress page with Recharts charts and heatmap
33. Build Settings page

### Phase 7 — Polish & Performance
34. Add Framer Motion animations everywhere (page transitions, cards, XP bar)
35. Add Sonner toasts for all user actions
36. Add `loading.tsx` files for all route segments
37. Add `error.tsx` files with retry UI
38. Verify all MongoDB indexes are created
39. Run `tsc --noEmit` — fix all TypeScript errors
40. Run `next build` — fix all build errors
41. Final responsive check (mobile, tablet, desktop)

---

## Critical Rules

- **Zero `any` in TypeScript** — use `unknown` and type-narrow properly
- **No `pages/` router** — App Router only, everywhere
- **All auth errors must be generic** — never reveal whether email exists
- **Tokens in DB must be SHA-256 hashed** — only raw token goes in email
- **httpOnly cookies only** — no JWT in localStorage
- **Rate limit before any DB query** on auth endpoints
- **Validate all API inputs with Zod** before they touch the database
- **SM-2 algorithm runs server-side** — never trust client to calculate next interval
- **User stats are denormalized on the User doc** — update on every review for fast dashboard reads
- **Streak uses user's timezone** — always, never UTC
- **All API errors**: `{ error: string }` JSON + appropriate HTTP status
- **Return 503 gracefully** if MongoDB connection fails
- **Use `export const dynamic = 'force-dynamic'`** on API routes with query params
- **One Mongoose connection per serverless instance** — cache on `global` in dev
