import { create } from "zustand";

interface SearchStore {
  toggledSearch: boolean;
  toggleSearch: () => void;
  closeSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  toggledSearch: false,
  toggleSearch: () => set({ toggledSearch: true }),
  closeSearch: () => set({ toggledSearch: false }),
}));
