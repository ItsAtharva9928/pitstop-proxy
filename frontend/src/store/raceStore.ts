import { create } from 'zustand';

export interface DriverData {
  position: number;
  driverNumber: number;
  driverName: string;
  teamColor: string;
  interval: string;
  isPits: boolean;
}

export interface WeatherData {
  AirTemp: string;
  TrackTemp: string;
  Rainfall: string;
}

export interface TrackStatusData {
  Status: string;
  Message: string;
}

interface RaceState {
  leaderboard: DriverData[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  sessionStatus: 'active' | 'ended';
  wsUrl: string | null;
  reconnectTrigger: number;
  weatherData: WeatherData | null;
  trackStatus: TrackStatusData | null;
  setLeaderboard: (data: DriverData[]) => void;
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
  setSessionStatus: (status: 'active' | 'ended') => void;
  setWsUrl: (url: string | null) => void;
  setWeatherData: (data: WeatherData) => void;
  setTrackStatus: (status: TrackStatusData | null) => void;
  triggerReconnect: () => void;
}

export const useRaceStore = create<RaceState>((set) => ({
  leaderboard: [],
  connectionStatus: 'disconnected',
  sessionStatus: 'ended',
  wsUrl: null,
  reconnectTrigger: 0,
  weatherData: null,
  trackStatus: null,
  setLeaderboard: (data) => set({ leaderboard: data }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setSessionStatus: (status) => set({ sessionStatus: status }),
  setWsUrl: (url) => set({ wsUrl: url }),
  setWeatherData: (data) => set({ weatherData: data }),
  setTrackStatus: (status) => set({ trackStatus: status }),
  triggerReconnect: () => set((state) => ({ reconnectTrigger: state.reconnectTrigger + 1 })),
}));

