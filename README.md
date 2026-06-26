# Lexika — 4000 Essential English Words

A full-stack vocabulary learning app built on the **4000 Essential English Words** dataset (30 units, ~600 words in the bundled CSV), with Uzbek translations, definitions, and example sentences for every word.

Tech stack: **Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma + NextAuth**.

---

## Features

- **Auto-import** of the bundled `vocabulary_units_1_30.csv` via the Prisma seed script.
- **Spaced repetition** on a fixed 1 → 3 → 7 → 15 → 30 day ladder (`src/lib/spaced-repetition.ts`), driven by Again/Hard/Good/Easy grading.
- **Five study modes**, all sharing the same progress/scheduling engine:
  - Flashcards (flip + grade)
  - Multiple-choice quiz (Uzbek translation)
  - Typing recall (type the English word)
  - Context learning (identify the word from its example sentence)
  - Image association (optional — only for words an admin has added a picture to)
- **Difficult words**: bookmark any card from any mode, review them as their own deck.
- **Progress tracking**: learned/mastered counts, accuracy, streaks, daily goal ring, 14-day activity chart, per-unit completion.
- **Auth**: email/password registration & login (NextAuth Credentials provider, JWT sessions, bcrypt hashing).
- **Admin panel** (`/admin`, role-gated): CSV import with flexible header mapping, word CRUD, image URLs.
- **Dark/light/system theme**, mobile-friendly layout with a bottom tab bar on small screens.

---

## Getting started

### 1. Prerequisites
- Node.js 18+
- A PostgreSQL database (local, Docker, or hosted — e.g. Supabase, Neon, Railway)

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
- `DATABASE_URL` — your Postgres connection string
- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — credentials for the admin account the seed script creates

### 4. Set up the database
```bash
npm run db:migrate   # creates tables from prisma/schema.prisma
npm run db:seed      # imports prisma/data/vocabulary.csv + creates the admin user
```

### 5. Run it
```bash
npm run dev
```
Visit `http://localhost:3000`. Sign in with the seed admin credentials to reach `/admin`, or register a normal account to start studying.

### Production build
```bash
npm run build
npm start
```

---

## Project structure

```
prisma/
  schema.prisma       Database models (User, Unit, Word, UserWordProgress, ReviewLog, Activity)
  seed.ts              Parses prisma/data/vocabulary.csv and loads it
src/
  app/
    page.tsx           Public landing page
    (auth)/            Login / register (no app shell)
    (app)/              Authenticated app shell (navbar + bottom tabs)
      dashboard/        Stats + daily goal + unit grid
      learn/            Mode picker + the 5 study-mode pages
      bookmarks/        Difficult words
      progress/         Detailed analytics
      settings/         Profile + theme
      admin/            CSV import, word CRUD (role: ADMIN only)
    api/                Route handlers for everything above
  components/           UI primitives + feature components
  lib/                  Prisma client, auth config, spaced-repetition engine,
                        review/queue/stats helpers
  middleware.ts         Route protection (auth + admin-only) at the edge
```

### How review scoring works
Every grading action (from any mode) calls `POST /api/review`, which:
1. Loads or creates a `UserWordProgress` row for that word.
2. Runs `computeNextReview()` to move the word along the 1/3/7/15/30-day ladder.
3. Logs a `ReviewLog` row and updates today's `Activity` row.
4. Updates the user's streak.

Quiz-style modes (multiple choice, typing, context, image) grade as **Good** on a correct answer and **Again** on an incorrect one; flashcards let the learner pick all four grades directly.

---

## Notes & known limitations

- This project was generated and reviewed for correctness in a sandboxed environment **without network or database access**, so it has not been run through `npm install` / `next build` / a live Postgres instance. The code follows standard, well-tested patterns (Next 14 App Router, Prisma, NextAuth Credentials + JWT), but please run `npm run build` after install and let me know if anything surfaces — happy to fix it.
- The CSV importer (both the seed script and the admin `/admin/import` page) expects columns it can map to Unit / English / Uzbek / Definition / Example by flexible name matching, so it should tolerate header variations, not just the exact bundled file.
- Image Association is intentionally empty until an admin adds `imageUrl` values via `/admin/words` — there are no images bundled with the dataset.
- Context-learning mode blanks out the headword in its example sentence when it (or a regular -s/-ed/-ing form of it) appears literally; for the few words whose example uses an irregular form (e.g. "arise" → "arose"), it gracefully falls back to showing the full sentence.
