import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TeamReadDTO } from "@/types/team";

interface TeamState {
  selectedTeam: TeamReadDTO | null;
  selectedTeamId: string | null;
  
  // Akcje
  setSelectedTeam: (team: TeamReadDTO) => void;
  clearSelectedTeam: () => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      selectedTeam: null,
      selectedTeamId: null,

      setSelectedTeam: (team) => 
        set({ 
          selectedTeam: team, 
          selectedTeamId: team.id 
        }),

      clearSelectedTeam: () => 
        set({ 
          selectedTeam: null, 
          selectedTeamId: null 
        }),
    }),
    {
      name: "ctx-team-storage", // unikalny klucz w localStorage
    }
  )
);