/**
 * Fallback data used whenever an external API is unreachable or an API key
 * is missing (e.g. running locally without .env.local configured). Every
 * service should try the live API first and fall back to this module on
 * failure, so every game stays playable offline / without credentials.
 */

// Deterministic placeholder image (no network required) — a labelled SVG data URI.
export function placeholderImage(label: string, seed = label): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="100%" height="100%" fill="hsl(${hue},55%,25%)" />
    <text x="50%" y="50%" font-family="sans-serif" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle">${label.slice(0, 18)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface MockTrack {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  popularity: number;
  releaseYear: number;
  emojiHint: string;
  previewUrl: string | null;
}

export const MOCK_TRACKS: MockTrack[] = [
  { id: 't1', name: 'Blinding Lights', artist: 'The Weeknd', imageUrl: placeholderImage('Blinding Lights'), popularity: 94, releaseYear: 2019, emojiHint: '🌃🚗💡', previewUrl: null },
  { id: 't2', name: 'Shape of You', artist: 'Ed Sheeran', imageUrl: placeholderImage('Shape of You'), popularity: 90, releaseYear: 2017, emojiHint: '💃🔺❤️', previewUrl: null },
  { id: 't3', name: 'Bad Guy', artist: 'Billie Eilish', imageUrl: placeholderImage('Bad Guy'), popularity: 88, releaseYear: 2019, emojiHint: '😈🚶‍♀️👟', previewUrl: null },
  { id: 't4', name: 'Levitating', artist: 'Dua Lipa', imageUrl: placeholderImage('Levitating'), popularity: 87, releaseYear: 2020, emojiHint: '🚀🌙✨', previewUrl: null },
  { id: 't5', name: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', imageUrl: placeholderImage('Uptown Funk'), popularity: 89, releaseYear: 2014, emojiHint: '🕺🎩💰', previewUrl: null },
  { id: 't6', name: 'Rolling in the Deep', artist: 'Adele', imageUrl: placeholderImage('Rolling Deep'), popularity: 86, releaseYear: 2010, emojiHint: '🌊❤️‍🔥🎤', previewUrl: null },
  { id: 't7', name: 'Sweet Child O Mine', artist: "Guns N' Roses", imageUrl: placeholderImage("GnR"), popularity: 85, releaseYear: 1987, emojiHint: '🌹👶🎸', previewUrl: null },
  { id: 't8', name: 'Thunderstruck', artist: 'AC/DC', imageUrl: placeholderImage('Thunderstruck'), popularity: 84, releaseYear: 1990, emojiHint: '⚡🥁🤘', previewUrl: null },
  { id: 't9', name: 'Umbrella', artist: 'Rihanna ft. Jay-Z', imageUrl: placeholderImage('Umbrella'), popularity: 83, releaseYear: 2007, emojiHint: '☂️🌧️👑', previewUrl: null },
  { id: 't10', name: 'Viva la Vida', artist: 'Coldplay', imageUrl: placeholderImage('Viva la Vida'), popularity: 88, releaseYear: 2008, emojiHint: '👑⚔️🌍', previewUrl: null },
];

export interface MockVideo {
  id: string;
  title: string;
  channel: string;
  viewCount: number;
  thumbnailUrl: string;
}

export const MOCK_YOUTUBE_VIDEOS: MockVideo[] = [
  { id: 'v1', title: 'Top 10 gol della stagione', channel: 'Sport Channel', viewCount: 12_400_000, thumbnailUrl: placeholderImage('Top 10 Gol') },
  { id: 'v2', title: 'Highlights Finale Champions League', channel: 'UEFA', viewCount: 38_200_000, thumbnailUrl: placeholderImage('UCL Final') },
  { id: 'v3', title: 'Trailer ufficiale film blockbuster', channel: 'Movie Studio', viewCount: 21_000_000, thumbnailUrl: placeholderImage('Trailer') },
  { id: 'v4', title: 'Recensione console retro', channel: 'Retro Gaming', viewCount: 2_100_000, thumbnailUrl: placeholderImage('Retro Console') },
  { id: 'v5', title: 'Music Video ufficiale', channel: 'VEVO', viewCount: 890_000_000, thumbnailUrl: placeholderImage('Music Video') },
];

export interface MockGoal {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  scorer: string;
  minute: number;
  competition: string;
  season: string;
}

export const MOCK_GOALS: MockGoal[] = [
  { id: 'g1', homeTeam: 'Juventus', awayTeam: 'Inter', homeScore: 2, awayScore: 1, scorer: 'Vlahovic', minute: 78, competition: 'Serie A', season: '2023-2024' },
  { id: 'g2', homeTeam: 'Milan', awayTeam: 'Napoli', homeScore: 1, awayScore: 1, scorer: 'Osimhen', minute: 55, competition: 'Serie A', season: '2023-2024' },
  { id: 'g3', homeTeam: 'Roma', awayTeam: 'Lazio', homeScore: 3, awayScore: 2, scorer: 'Dybala', minute: 90, competition: 'Serie A', season: '2022-2023' },
  { id: 'g4', homeTeam: 'Barcellona', awayTeam: 'Real Madrid', homeScore: 2, awayScore: 3, scorer: 'Bellingham', minute: 35, competition: 'La Liga', season: '2023-2024' },
  { id: 'g5', homeTeam: 'Manchester City', awayTeam: 'Liverpool', homeScore: 1, awayScore: 0, scorer: 'Haaland', minute: 12, competition: 'Premier League', season: '2023-2024' },
  { id: 'g6', homeTeam: 'Atalanta', awayTeam: 'Fiorentina', homeScore: 4, awayScore: 1, scorer: 'Lookman', minute: 63, competition: 'Serie A', season: '2023-2024' },
];

export interface MockJeopardy {
  id: string;
  category: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  value: number;
}

export const MOCK_JEOPARDY_QUESTIONS: MockJeopardy[] = [
  { id: 'j1', category: 'Storia', question: "In che anno cadde il Muro di Berlino?", answer: '1989', difficulty: 'easy', value: 200 },
  { id: 'j2', category: 'Scienza', question: 'Qual è il simbolo chimico dell\'oro?', answer: 'Au', difficulty: 'easy', value: 200 },
  { id: 'j3', category: 'Calcio', question: 'Quale squadra ha vinto più Champions League?', answer: 'Real Madrid', difficulty: 'medium', value: 400 },
  { id: 'j4', category: 'Film', question: "Chi ha diretto 'Il Padrino'?", answer: 'Francis Ford Coppola', difficulty: 'medium', value: 400 },
  { id: 'j5', category: 'Geografia', question: 'Qual è il fiume più lungo del mondo?', answer: 'Nilo', difficulty: 'easy', value: 200 },
  { id: 'j6', category: 'Arte', question: "Chi ha dipinto 'La Notte Stellata'?", answer: 'Van Gogh', difficulty: 'medium', value: 400 },
  { id: 'j7', category: 'Musica', question: 'Quale band ha inciso l\'album "The Dark Side of the Moon"?', answer: 'Pink Floyd', difficulty: 'hard', value: 600 },
  { id: 'j8', category: 'Economia', question: 'Come si chiama la banca centrale europea?', answer: 'BCE', difficulty: 'easy', value: 200 },
];

export interface MockConsole {
  id: string;
  name: string;
  manufacturer: string;
  year: number;
  generation: number;
  unitsSoldMillions: number;
  imageUrl: string;
}

export const MOCK_CONSOLES: MockConsole[] = [
  { id: 'c1', name: 'NES', manufacturer: 'Nintendo', year: 1983, generation: 3, unitsSoldMillions: 61.9, imageUrl: placeholderImage('NES') },
  { id: 'c2', name: 'Sega Genesis', manufacturer: 'Sega', year: 1988, generation: 4, unitsSoldMillions: 30.75, imageUrl: placeholderImage('Genesis') },
  { id: 'c3', name: 'PlayStation', manufacturer: 'Sony', year: 1994, generation: 5, unitsSoldMillions: 102.49, imageUrl: placeholderImage('PS1') },
  { id: 'c4', name: 'Nintendo 64', manufacturer: 'Nintendo', year: 1996, generation: 5, unitsSoldMillions: 32.93, imageUrl: placeholderImage('N64') },
  { id: 'c5', name: 'PlayStation 2', manufacturer: 'Sony', year: 2000, generation: 6, unitsSoldMillions: 155, imageUrl: placeholderImage('PS2') },
  { id: 'c6', name: 'Xbox 360', manufacturer: 'Microsoft', year: 2005, generation: 7, unitsSoldMillions: 84, imageUrl: placeholderImage('Xbox 360') },
  { id: 'c7', name: 'Nintendo Switch', manufacturer: 'Nintendo', year: 2017, generation: 8, unitsSoldMillions: 132, imageUrl: placeholderImage('Switch') },
  { id: 'c8', name: 'PlayStation 5', manufacturer: 'Sony', year: 2020, generation: 9, unitsSoldMillions: 59, imageUrl: placeholderImage('PS5') },
];

export interface MockMovie {
  id: string;
  title: string;
  year: number;
  director: string;
  location: string;
  actor: string;
  imageUrl: string;
}

export const MOCK_MOVIES: MockMovie[] = [
  { id: 'm1', title: 'Inception', year: 2010, director: 'Christopher Nolan', location: 'Parigi (scena strade ripiegate)', actor: 'Leonardo DiCaprio', imageUrl: placeholderImage('Inception') },
  { id: 'm2', title: 'The Dark Knight', year: 2008, director: 'Christopher Nolan', location: 'Chicago', actor: 'Christian Bale', imageUrl: placeholderImage('Dark Knight') },
  { id: 'm3', title: 'La Grande Bellezza', year: 2013, director: 'Paolo Sorrentino', location: 'Roma', actor: 'Toni Servillo', imageUrl: placeholderImage('Grande Bellezza') },
  { id: 'm4', title: 'Jurassic Park', year: 1993, director: 'Steven Spielberg', location: 'Kauai, Hawaii', actor: 'Sam Neill', imageUrl: placeholderImage('Jurassic Park') },
  { id: 'm5', title: 'La La Land', year: 2016, director: 'Damien Chazelle', location: 'Los Angeles', actor: 'Ryan Gosling', imageUrl: placeholderImage('La La Land') },
  { id: 'm6', title: 'Skyfall', year: 2012, director: 'Sam Mendes', location: 'Shanghai', actor: 'Daniel Craig', imageUrl: placeholderImage('Skyfall') },
];

export interface MockBrandLogo {
  id: string;
  brand: string;
  year: number;
  logoDescription: string;
  order: number;
  imageUrl: string;
}

export const MOCK_BRAND_LOGOS: MockBrandLogo[] = [
  { id: 'b1', brand: 'Apple', year: 1977, logoDescription: 'Mela arcobaleno con morso', order: 1, imageUrl: placeholderImage('Apple 1977') },
  { id: 'b2', brand: 'Apple', year: 1998, logoDescription: 'Mela monocromatica blu/aqua', order: 2, imageUrl: placeholderImage('Apple 1998') },
  { id: 'b3', brand: 'Apple', year: 2007, logoDescription: 'Mela grigio metallizzato', order: 3, imageUrl: placeholderImage('Apple 2007') },
  { id: 'b4', brand: 'Nike', year: 1971, logoDescription: 'Swoosh originale disegnato da Carolyn Davidson', order: 1, imageUrl: placeholderImage('Nike 1971') },
  { id: 'b5', brand: 'Nike', year: 1995, logoDescription: 'Swoosh senza wordmark', order: 2, imageUrl: placeholderImage('Nike 1995') },
  { id: 'b6', brand: 'Pepsi', year: 1950, logoDescription: 'Cerchio rosso-bianco-blu piatto', order: 1, imageUrl: placeholderImage('Pepsi 1950') },
  { id: 'b7', brand: 'Pepsi', year: 2008, logoDescription: 'Cerchio con effetto sorriso 3D', order: 2, imageUrl: placeholderImage('Pepsi 2008') },
];

export interface MockPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  rating: number;
  goals: number;
  assists: number;
}

export const MOCK_PLAYERS: MockPlayer[] = [
  { id: 'p1', name: 'Lautaro Martinez', team: 'Inter', position: 'ATT', rating: 87, goals: 24, assists: 6 },
  { id: 'p2', name: 'Rafael Leao', team: 'Milan', position: 'ATT', rating: 85, goals: 13, assists: 10 },
  { id: 'p3', name: 'Nicolo Barella', team: 'Inter', position: 'CC', rating: 86, goals: 6, assists: 9 },
  { id: 'p4', name: 'Victor Osimhen', team: 'Napoli', position: 'ATT', rating: 88, goals: 26, assists: 4 },
  { id: 'p5', name: 'Paulo Dybala', team: 'Roma', position: 'ATT', rating: 84, goals: 12, assists: 8 },
  { id: 'p6', name: 'Theo Hernandez', team: 'Milan', position: 'DIF', rating: 85, goals: 5, assists: 7 },
];
