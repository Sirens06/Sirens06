# Multi-Game Platform

Piattaforma dove amici competono in mini-giochi diversi giorno per giorno, con leaderboard settimanale, streak system e cosmetics. Locale (Italiano), single-player in V1.

Tutti e 12 i giochi della spec sono implementati e giocabili end-to-end, con login reale, persistenza Postgres e fallback a dati mock quando le chiavi API di terze parti non sono configurate.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Next.js API Routes, Prisma ORM + PostgreSQL, NextAuth v5
- **External APIs**: Spotify Web API, TheSportsDB, jService.io (Jeopardy), TMDB, Wikipedia — tutte con fallback mock

## Getting Started

```bash
npm install
cp .env.example .env.local
```

Poi in `.env.local` imposta almeno:
- `DATABASE_URL` — vedi "Database" sotto per crearne uno locale
- `NEXTAUTH_SECRET` — genera con `openssl rand -base64 32`

```bash
npx prisma migrate dev
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) — verrai reindirizzato a `/login`. Nessuna chiave API di terze parti è necessaria: i giochi funzionano subito con dati mock (vedi sotto).

### Database

Serve un Postgres raggiungibile. In locale:

```bash
createuser -P multigame            # scegli una password, es. multigame_dev_pw
createdb -O multigame multigame
# .env.local
DATABASE_URL=postgresql://multigame:<password>@localhost:5432/multigame
```

Per la produzione: crea un database (Vercel Postgres, Railway, Neon, ecc.) e incolla la sua connection string come `DATABASE_URL` — lo schema è già pronto in `prisma/schema.prisma`, applica le migration con `npx prisma migrate deploy`.

### Login

- **Email + password funziona subito**: la pagina `/register` crea un account (password hashata con bcrypt), `/login` autentica via NextAuth (Credentials provider, sessioni JWT).
- **Google e Spotify OAuth**: i provider sono già cablati in `lib/auth.ts` ma si attivano solo se imposti `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (da Google Cloud Console) o riusi `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` aggiungendo `/api/auth/callback/spotify` come Redirect URI sulla stessa app Spotify. Senza queste variabili, i relativi pulsanti di login semplicemente non compaiono — non serve nessuna modifica al codice.

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
  (auth)/login/, (auth)/register/  # pagine di login/registrazione (pubbliche)
  (app)/layout.tsx        # protegge dashboard/game/leaderboard/shop: redirect a /login se non autenticato
  (app)/dashboard/        # hub principale dei giochi
  (app)/game/[gameId]/    # player del singolo gioco
  (app)/leaderboard/      # pagina classifica
  (app)/shop/             # pagina cosmetics shop
  api/auth/[...nextauth]/ # route NextAuth (login/logout/callback OAuth)
  api/auth/register/      # crea un nuovo utente (email + password hashata)
  api/games-data/         # route che interrogano le API esterne (con fallback mock)
  api/games/[gameId]/submit-score/  # invio punteggio round → streak + totale
  api/leaderboard/        # classifica settimanale / all-time
  api/users/me/           # profilo + streak dell'utente autenticato
  api/cosmetics/          # shop + acquisto cosmetics
  api/cron/               # endpoint per Vercel Cron (rotazione giornaliera, reset settimanale)
components/
  games/{music,sports,culture,independent}/  # UI di ogni mini-gioco
  layout/                 # navbar (login/logout), donation button
  leaderboard/, shop/, ui/ # componenti riusabili
hooks/
  useCountdown.ts          # timer di round condiviso
  useSubmitScore.ts         # invia il punteggio del round al backend
lib/
  auth.ts                  # configurazione NextAuth (Credentials + Google/Spotify opzionali)
  db.ts                    # Prisma Client singleton
  session.ts                # legge l'id utente dalla sessione NextAuth lato server
  mock-data.ts             # dataset mock condiviso (tracce, partite, console, film, loghi, trivia)
  services/                # wrapper delle API esterne, ognuno con fallback a mock-data.ts
  store.ts                 # query Prisma per punteggi/streak/cosmetics
  jobs/                    # daily-content-generator, weekly-reset (invocati da app/api/cron/*)
prisma/
  schema.prisma            # User, GameScore, Leaderboard, Streak, Cosmetic, JeopardyQuestion
  migrations/               # migration applicate
providers/
  AuthProvider.tsx          # SessionProvider di NextAuth
store/
  gameStore.ts              # store Zustand lato client per il profilo utente
types/                      # tipi condivisi
```

## Note importanti

- **Nessuna chiave API di terze parti richiesta per sviluppare i giochi**: ogni servizio esterno (Spotify, TheSportsDB, jService.io, TMDB, Wikipedia) prova prima la chiamata live e ricade su `lib/mock-data.ts` se la chiave manca o la rete non è raggiungibile. Le immagini mock sono SVG generati localmente (nessuna dipendenza di rete).
- **Persistenza reale**: punteggi, streak, cosmetics e classifiche sono salvati su Postgres via Prisma (`lib/store.ts`). Serve comunque una `DATABASE_URL` valida per avviare l'app.
- **Auth reale**: login con email/password funziona out-of-the-box (bcrypt + NextAuth Credentials provider, sessioni JWT). Google e Spotify OAuth sono pronti ma disattivi finché non fornisci le rispettive credenziali (vedi sopra) — non posso crearle per te, richiedono un account Google/Spotify tuo.
- **Anti-cheat**: i giochi con risposta a scelta multipla o testuale (Jeopardy, Game Console, Movie Scout, Brand Logo) non rivelano la risposta nella chiamata GET iniziale — la validazione avviene lato server tramite un endpoint `POST .../validate` separato. I giochi più semplici (Indovina Canzone, Video Clip, Highlight Prediction) seguono invece un modello "client-trust": sufficiente per un gioco casual single-player.
- **Cron jobs**: `app/api/cron/daily-content` e `app/api/cron/weekly-reset` sono pensati per essere invocati da Vercel Cron (vedi `vercel.json`); impostare `CRON_SECRET` in produzione per proteggerli.
- **Cosa manca ancora**: chiavi API reali per Spotify/TMDB/RapidAPI (servono i tuoi account developer), credenziali OAuth Google/Spotify per il login social, e un `DATABASE_URL` di produzione (Vercel Postgres/Railway/Neon). Tutto il resto è funzionante.
