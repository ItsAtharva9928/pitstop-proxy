import { useSettingsStore } from '../settingsStore';

describe('SettingsStore', () => {
  const initialState = useSettingsStore.getState();

  beforeEach(() => {
    useSettingsStore.setState(initialState, true);
  });

  it('should initialize with default settings', () => {
    const state = useSettingsStore.getState();
    expect(state.favoriteDriver).toBe('');
    expect(state.gapDisplayMode).toBe('INTERVAL');
    expect(state.alertOnFlags).toBe(true);
    expect(state.temperatureUnit).toBe('C');
  });

  it('should update favoriteDriver correctly', () => {
    useSettingsStore.getState().setFavoriteDriver('HAM');
    expect(useSettingsStore.getState().favoriteDriver).toBe('HAM');
  });

  it('should update gapDisplayMode correctly', () => {
    useSettingsStore.getState().setGapDisplayMode('LEADER');
    expect(useSettingsStore.getState().gapDisplayMode).toBe('LEADER');
  });

  it('should update alertOnFlags correctly', () => {
    useSettingsStore.getState().setAlertOnFlags(false);
    expect(useSettingsStore.getState().alertOnFlags).toBe(false);
  });

  it('should update temperatureUnit correctly', () => {
    useSettingsStore.getState().setTemperatureUnit('F');
    expect(useSettingsStore.getState().temperatureUnit).toBe('F');
  });
});
