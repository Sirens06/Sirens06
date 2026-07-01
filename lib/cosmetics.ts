export interface Cosmetic {
  id: string;
  name: string;
  price: number;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const COSMETICS_CATALOG: Cosmetic[] = [
  { id: 'avatar-fox', name: 'Avatar Volpe', price: 150, emoji: '🦊', rarity: 'common' },
  { id: 'avatar-owl', name: 'Avatar Gufo', price: 150, emoji: '🦉', rarity: 'common' },
  { id: 'flame-blue', name: 'Streak Flame Blu', price: 300, emoji: '🔵🔥', rarity: 'rare' },
  { id: 'flame-purple', name: 'Streak Flame Viola', price: 300, emoji: '🟣🔥', rarity: 'rare' },
  { id: 'emote-trophy', name: 'Emote Trofeo', price: 200, emoji: '🏆', rarity: 'common' },
  { id: 'avatar-crown', name: 'Avatar Corona Leggendaria', price: 800, emoji: '👑', rarity: 'legendary' },
];
