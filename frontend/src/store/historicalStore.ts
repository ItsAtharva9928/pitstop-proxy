import { create } from 'zustand';

export interface StandingData {
  position: string;
  points: string;
  Driver: {
    givenName: string;
    familyName: string;
  };
  Constructors: {
    name: string;
  }[];
}

interface HistoricalState {
  standings: StandingData[];
  isLoading: boolean;
  fetchStandings: () => Promise<void>;
}

export const useHistoricalStore = create<HistoricalState>((set) => ({
  standings: [],
  isLoading: false,
  fetchStandings: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
      const data = await response.json();
      const list = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      set({ standings: list, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch Jolpica standings', err);
      set({ isLoading: false });
    }
  }
}));
