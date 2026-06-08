import { create } from 'zustand';

export interface JolpicaCircuit {
  circuitId: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

export interface JolpicaRace {
  season: string;
  round: string;
  raceName: string;
  Circuit: JolpicaCircuit;
  date: string;
  time: string;
}

interface CircuitState {
  currentRace: JolpicaRace | null;
  isLoading: boolean;
  fetchCurrentRace: () => Promise<void>;
}

export const useCircuitStore = create<CircuitState>((set) => ({
  currentRace: null,
  isLoading: false,
  fetchCurrentRace: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('https://api.jolpi.ca/ergast/f1/current/next.json');
      const data = await response.json();
      
      let race = null;
      if (data.MRData.RaceTable.Races && data.MRData.RaceTable.Races.length > 0) {
        race = data.MRData.RaceTable.Races[0];
      }
      
      if (race) {
        set({ currentRace: race, isLoading: false });
      } else {
        throw new Error("No next race found");
      }
    } catch (err) {
      console.warn('Failed to fetch next race, trying last.json...', err);
      try {
        const fallbackRes = await fetch('https://api.jolpi.ca/ergast/f1/current/last.json');
        const fallbackData = await fallbackRes.json();
        const fallbackRace = fallbackData.MRData.RaceTable.Races[0];
        set({ currentRace: fallbackRace, isLoading: false });
      } catch (fallbackErr) {
        console.error('Failed to fetch last race either', fallbackErr);
        set({ isLoading: false });
      }
    }
  }
}));
