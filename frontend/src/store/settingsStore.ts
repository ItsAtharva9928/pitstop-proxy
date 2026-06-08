import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GapDisplayMode = 'INTERVAL' | 'LEADER';
export type TemperatureUnit = 'C' | 'F';

export interface SettingsState {
  // Favourite
  favoriteDriver: string;
  favoriteTeam: string;
  // Display
  gapDisplayMode: GapDisplayMode;
  temperatureUnit: TemperatureUnit;
  showDRSZones: boolean;
  // Alerts & Notifications
  alertOnFlags: boolean;
  pitLaneAlerts: boolean;
  driverNotifications: boolean;
  // Actions
  setFavoriteDriver: (driver: string) => void;
  setFavoriteTeam: (team: string) => void;
  setGapDisplayMode: (mode: GapDisplayMode) => void;
  setAlertOnFlags: (enabled: boolean) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setShowDRSZones: (show: boolean) => void;
  setPitLaneAlerts: (enabled: boolean) => void;
  setDriverNotifications: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      favoriteDriver: '',
      favoriteTeam: '',
      gapDisplayMode: 'INTERVAL',
      temperatureUnit: 'C',
      showDRSZones: true,
      alertOnFlags: true,
      pitLaneAlerts: true,
      driverNotifications: true,
      setFavoriteDriver: (driver) => set({ favoriteDriver: driver }),
      setFavoriteTeam: (team) => set({ favoriteTeam: team }),
      setGapDisplayMode: (mode) => set({ gapDisplayMode: mode }),
      setAlertOnFlags: (enabled) => set({ alertOnFlags: enabled }),
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setShowDRSZones: (show) => set({ showDRSZones: show }),
      setPitLaneAlerts: (enabled) => set({ pitLaneAlerts: enabled }),
      setDriverNotifications: (enabled) => set({ driverNotifications: enabled }),
    }),
    {
      name: 'pitstop-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
