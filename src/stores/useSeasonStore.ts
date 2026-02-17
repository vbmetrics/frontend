import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SeasonState {
  selectedSeasonIds: string[];
  toggleSeason: (id: string) => void;
  setSeasons: (ids: string[]) => void;
  clearSeasons: () => void;
}

export const useSeasonStore = create<SeasonState>()(
  persist(
    (set) => ({
      selectedSeasonIds: [],
      
      toggleSeason: (id) =>
        set((state) => {
          const isSelected = state.selectedSeasonIds.includes(id);
          return {
            selectedSeasonIds: isSelected
              ? state.selectedSeasonIds.filter((sid) => sid !== id)
              : [...state.selectedSeasonIds, id],
          };
        }),

      setSeasons: (ids) => set({ selectedSeasonIds: ids }),
      clearSeasons: () => set({ selectedSeasonIds: [] }),
    }),
    {
      name: "ctx-season-storage", // klucz w localStorage
    }
  )
);