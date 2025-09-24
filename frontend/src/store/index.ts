import { create } from 'zustand';

interface AppState {
  searchQuery: string;
  selectedBreed: string | null;
  currentTab: 'browse' | 'favourites';
  setSearchQuery: (query: string) => void;
  setSelectedBreed: (breed: string | null) => void;
  setCurrentTab: (tab: 'browse' | 'favourites') => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  selectedBreed: null,
  currentTab: 'browse',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedBreed: (breed) => set({ selectedBreed: breed }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
}));