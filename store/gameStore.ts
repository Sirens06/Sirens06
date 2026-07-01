import { create } from 'zustand';
import axios from 'axios';

export interface Profile {
  id: string;
  totalScore: number;
  gamesPlayed: number;
  streak: number;
  currency: number;
  cosmetics: string[];
}

interface GameStore {
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set) => ({
  profile: null,
  refreshProfile: async () => {
    try {
      const response = await axios.get<Profile>('/api/users/me');
      set({ profile: response.data });
    } catch (error) {
      console.warn('Failed to load profile:', error);
    }
  },
}));
