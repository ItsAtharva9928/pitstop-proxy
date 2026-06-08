import { useRaceStore } from '../raceStore';

describe('RaceStore', () => {
  const initialState = useRaceStore.getState();

  beforeEach(() => {
    useRaceStore.setState(initialState, true);
  });

  it('should initialize with default state', () => {
    const state = useRaceStore.getState();
    expect(state.leaderboard).toEqual([]);
    expect(state.connectionStatus).toBe('disconnected');
  });

  it('should update leaderboard correctly on state mutation', () => {
    const mockData = [
      { position: 1, driverNumber: 1, driverName: 'VER', teamColor: '#3671C6', interval: 'Leader', isPits: false },
      { position: 2, driverNumber: 4, driverName: 'NOR', teamColor: '#FF8000', interval: '+1.234', isPits: false }
    ];
    
    useRaceStore.getState().setLeaderboard(mockData);
    
    expect(useRaceStore.getState().leaderboard).toEqual(mockData);
  });

  it('should handle connection status changes, including disconnection edge cases', () => {
    // Test transition to connecting
    useRaceStore.getState().setConnectionStatus('connecting');
    expect(useRaceStore.getState().connectionStatus).toBe('connecting');
    
    // Test transition to connected
    useRaceStore.getState().setConnectionStatus('connected');
    expect(useRaceStore.getState().connectionStatus).toBe('connected');
    
    // Test disconnection
    useRaceStore.getState().setConnectionStatus('disconnected');
    expect(useRaceStore.getState().connectionStatus).toBe('disconnected');
  });

  it('should allow clearing leaderboard upon disconnection if required', () => {
    // Populate
    const mockData = [
      { position: 1, driverNumber: 1, driverName: 'VER', teamColor: '#3671C6', interval: 'Leader', isPits: false }
    ];
    useRaceStore.getState().setLeaderboard(mockData);
    useRaceStore.getState().setConnectionStatus('connected');
    
    // Disconnect and manually clear leaderboard
    useRaceStore.getState().setConnectionStatus('disconnected');
    useRaceStore.getState().setLeaderboard([]);
    
    expect(useRaceStore.getState().connectionStatus).toBe('disconnected');
    expect(useRaceStore.getState().leaderboard).toEqual([]);
  });
});
