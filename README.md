# Multi-Game Platform

Piattaforma dove amici competono in mini-giochi diversi giorno per giorno, con leaderboard settimanale, streak system e cosmetics. Locale (Italiano), single-player in V1.

Tutti e 12 i giochi della spec sono implementati e giocabili end-to-end, con fallback a dati mock quando le chiavi API esterne non sono configurate.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Next.js API Routes, store in-memory (vedi sotto), Prisma schema pronto per Postgres
- **External APIs**: Spotify Web API, TheSportsDB, jService.io (Jeopardy), TMDB, Wikipedia — tutte con fallback mock

## Getting Started

```bash
npm install
cp .env.example .env.local   # opzionale: aggiungi le tue chiavi API, altrimenti i giochi usano dati mock
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) — funziona subito, senza chiavi API né database, grazie ai fallback mock descritti sotto.

## I 12 giochi

| Gioco | gameId | Categoria |
|---|---|---|
| Indovina Canzone | `guess-artist` | Musica |
| Emoji Guess | `emoji-guess` | Musica |
| Audio Mashup | `audio-mashup` | Musica |
| Music Stats Prediction | `music-stats` | Musica |
| Video Clip Challenge | `video-clip` | Calcio |
| Football Manager Speed Run | `football-manager` | Calcio (V1 single-player, squad-builder) |
| Highlight Reel Prediction | `highlight-prediction` | Calcio |
| Game Console Evolution | `game-console` | Culture |
| Movie Location Scout | `movie-scout` | Culture |
| Brand Logo Evolution | `brand-logo` | Culture |
| Higher/Lower | `higher-lower` | Indipendente |
| Jeopardy Trivia | `jeopardy` | Indipendente |

## Struttura del progetto

```
app/
  api/games-data/        # route che interrogano le API esterne (con fallback mock)
  api/games/[gameId]/submit-score/  # invio punteggio round → streak + totale
  api/leaderboard/        # classifica settimanale / all-time
  api/users/me/           # profilo + streak dell'utente guest corrente
  api/cosmetics/          # shop + acquisto cosmetics
  api/cron/                # endpoint per Vercel Cron (rotazione giornaliera, reset settimanale)
  (app)/dashboard/        # hub principale dei giochi
  (app)/game/[gameId]/    # player del singolo gioco
  (app)/leaderboard/      # pagina classifica
  (app)/shop/             # pagina cosmetics shop
components/
  games/{music,sports,culture,independent}/  # UI di ogni mini-gioco
  layout/                 # navbar, donation button
  leaderboard/, shop/, ui/ # componenti riusabili
hooks/
  useCountdown.ts          # timer di round condiviso
  useSubmitScore.ts         # invia il punteggio del round al backend
lib/
  mock-data.ts             # dataset mock condiviso (tracce, partite, console, film, loghi, trivia)
  services/                # wrapper delle API esterne, ognuno con fallback a mock-data.ts
  store.ts                 # store in-memory per punteggi/streak/cosmetics (vedi Note)
  session.ts, session-constants.ts  # sessione guest anonima via cookie
  jobs/                    # daily-content-generator, weekly-reset (invocati da app/api/cron/*)
prisma/
  schema.prisma            # schema di riferimento per la persistenza Postgres futura
store/
  gameStore.ts              # store Zustand lato client per il profilo utente
types/                      # tipi condivisi
middleware.ts                # assegna un guest_id anonimo ad ogni visitatore
```

## Note importanti

- **Nessuna chiave API richiesta per sviluppare**: ogni servizio esterno (Spotify, TheSportsDB, jService.io, TMDB, Wikipedia) prova prima la chiamata live e ricade su `lib/mock-data.ts` se la chiave manca o la rete non è raggiungibile. Le immagini mock sono SVG generati localmente (nessuna dipendenza di rete).
- **Persistenza in-memory**: `lib/store.ts` tiene punteggi/streak/cosmetics in memoria di processo — comodo per sviluppo locale, ma si resetta ad ogni riavvio e non è condiviso tra istanze serverless. Per la produzione, sostituire le funzioni in `lib/store.ts` con query Prisma verso `prisma/schema.prisma` (già pronto) una volta configurato `DATABASE_URL`.
- **Auth**: V1 non ha login reale — ogni visitatore riceve un `guest_id` anonimo via cookie httpOnly (`middleware.ts` + `lib/session.ts`). NextAuth con Google/Spotify OAuth è il passo successivo quando saranno disponibili le credenziali OAuth.
- **Anti-cheat**: i giochi con risposta a scelta multipla o testuale (Jeopardy, Game Console, Movie Scout, Brand Logo) non rivelano la risposta nella chiamata GET iniziale — la validazione avviene lato server tramite un endpoint `POST .../validate` separato. I giochi più semplici (Indovina Canzone, Video Clip, Highlight Prediction) seguono invece il modello "client-trust" della prima versione del prototipo: sufficiente per un gioco casual single-player.
- **Cron jobs**: `app/api/cron/daily-content` e `app/api/cron/weekly-reset` sono pensati per essere invocati da Vercel Cron (vedi `vercel.json`); impostare `CRON_SECRET` in produzione per proteggerli.
