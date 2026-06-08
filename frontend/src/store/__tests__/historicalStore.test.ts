import { useHistoricalStore } from '../historicalStore';

describe('HistoricalStore', () => {
  const initialState = useHistoricalStore.getState();

  beforeEach(() => {
    // Reset state before each test
    useHistoricalStore.setState(initialState, true);
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const state = useHistoricalStore.getState();
    expect(state.standings).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('should fetch driver standings and update state successfully', async () => {
    const mockDriverStandings = [
      {
        position: '1',
        points: '25',
        Driver: { givenName: 'Max', familyName: 'Verstappen' },
        Constructors: [{ name: 'Red Bull' }]
      }
    ];

    const mockResponse = {
      MRData: {
        StandingsTable: {
          StandingsLists: [
            {
              DriverStandings: mockDriverStandings
            }
          ]
        }
      }
    };

    // Mock global fetch
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    const promise = useHistoricalStore.getState().fetchStandings();
    
    // Check loading state immediately
    expect(useHistoricalStore.getState().isLoading).toBe(true);

    await promise;

    // Check updated state
    expect(useHistoricalStore.getState().isLoading).toBe(false);
    expect(useHistoricalStore.getState().standings).toEqual(mockDriverStandings);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
  });

  it('should handle fetch failures gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock global fetch rejection
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.reject(new Error('Network Error'))
    ) as jest.Mock;

    await useHistoricalStore.getState().fetchStandings();

    expect(useHistoricalStore.getState().isLoading).toBe(false);
    expect(useHistoricalStore.getState().standings).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});
