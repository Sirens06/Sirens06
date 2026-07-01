# Multi-Game Platform

Piattaforma dove amici competono in mini-giochi diversi giorno per giorno, con leaderboard settimanale, streak system e cosmetics. Locale (Italiano), single-player in V1.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **External APIs**: Spotify Web API, TheSportsDB, jService.io (Jeopardy)

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in API keys and DATABASE_URL
npx prisma generate
npx prisma db push
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Struttura del progetto

```
app/
  api/games-data/        # route che interrogano le API esterne (Spotify, TheSportsDB, jService)
  (app)/dashboard/        # hub principale dei giochi
  (app)/game/[gameId]/    # player del singolo gioco
components/
  games/                  # componenti UI di ogni mini-gioco
  layout/                 # navbar, donation button, ecc.
lib/
  services/               # wrapper delle API esterne (uno per integrazione)
  constants.ts            # elenco giochi, regole di scoring
  fuzzy-match.ts           # validazione risposte aperte (Jeopardy)
prisma/
  schema.prisma           # User, GameScore, Leaderboard, Streak, Cosmetic, JeopardyQuestion
types/                     # tipi condivisi
```

## Giochi implementati in questo scaffold

- **Indovina Canzone** (`components/games/GuessTheArtist.tsx`) — componente completo e funzionante
- **Higher/Lower**, **Jeopardy Trivia**, **Sports Trivia** — servizi e API route pronti, UI da completare

Gli altri giochi descritti nella spec (Calcio, Culture, Emoji Guess, Audio Mashup, ecc.) non sono ancora implementati: questo repo è il punto di partenza per svilupparli in parallelo.

## Note

- `GET /api/games-data/jeopardy` non restituisce la risposta corretta al client; usa `POST /api/games-data/jeopardy/validate` per validarla.
- I servizi esterni richiedono chiavi API (vedi `.env.example`). TheSportsDB e jService.io funzionano senza autenticazione per l'uso base.
