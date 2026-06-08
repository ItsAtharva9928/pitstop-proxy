import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { useWebSocketProvider } from '../WebSocketProvider';
import { useRaceStore } from '../../raceStore';

// Mock Expo Constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    hostUri: '192.168.1.50:8081'
  }
}));

// Mock WebSocket class
class MockWebSocket {
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onclose: (() => void) | null = null;
  close = jest.fn();

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  static instances: MockWebSocket[] = [];
  static reset() {
    MockWebSocket.instances = [];
  }
}

// Attach MockWebSocket to global
const originalWebSocket = global.WebSocket;
beforeAll(() => {
  global.WebSocket = MockWebSocket as any;
});

afterAll(() => {
  global.WebSocket = originalWebSocket;
});

const TestComponent = () => {
  useWebSocketProvider();
  return null;
};

describe('useWebSocketProvider', () => {
  const initialStoreState = useRaceStore.getState();
  let activeRenderers: renderer.ReactTestRenderer[] = [];

  beforeEach(() => {
    useRaceStore.setState(initialStoreState, true);
    MockWebSocket.reset();
    jest.clearAllMocks();
    activeRenderers = [];
  });

  afterEach(() => {
    // Unmount all active renderers inside act to trigger useEffect cleanup
    activeRenderers.forEach(r => {
      try {
        act(() => {
          r.unmount();
        });
      } catch (e) {
        // ignore
      }
    });
  });

  const renderComponent = () => {
    let r: any;
    act(() => {
      r = renderer.create(<TestComponent />);
    });
    activeRenderers.push(r);
    return r;
  };

  it('should initialize connection, set connecting status, and resolve default URL from hostUri', () => {
    renderComponent();

    expect(MockWebSocket.instances.length).toBe(1);
    expect(MockWebSocket.instances[0].url).toBe('ws://192.168.1.50:3000/ws/telemetry?token=dev-token');
    expect(useRaceStore.getState().connectionStatus).toBe('connecting');
  });

  it('should update connection status and session status on connection open', () => {
    renderComponent();
    const wsInstance = MockWebSocket.instances[0];

    // Trigger open inside act
    act(() => {
      if (wsInstance.onopen) wsInstance.onopen();
    });

    expect(useRaceStore.getState().connectionStatus).toBe('connected');
    expect(useRaceStore.getState().sessionStatus).toBe('ended');
  });

  it('should update leaderboard on telemetry_update messages', () => {
    renderComponent();
    const wsInstance = MockWebSocket.instances[0];

    const mockData = [
      { position: 1, driverNumber: 1, driverName: 'VER', teamColor: '#3671C6', interval: 'Leader', isPits: false }
    ];

    act(() => {
      if (wsInstance.onmessage) {
        wsInstance.onmessage({
          data: JSON.stringify({
            type: 'telemetry_update',
            data: mockData
          })
        });
      }
    });

    expect(useRaceStore.getState().leaderboard).toEqual(mockData);
  });

  it('should update session status on session_ended messages', () => {
    renderComponent();
    const wsInstance = MockWebSocket.instances[0];

    act(() => {
      if (wsInstance.onmessage) {
        wsInstance.onmessage({
          data: JSON.stringify({
            type: 'session_ended'
          })
        });
      }
    });

    expect(useRaceStore.getState().sessionStatus).toBe('ended');
  });

  it('should set disconnected state on close', () => {
    renderComponent();
    const wsInstance = MockWebSocket.instances[0];

    act(() => {
      if (wsInstance.onclose) wsInstance.onclose();
    });

    expect(useRaceStore.getState().connectionStatus).toBe('disconnected');
    expect(useRaceStore.getState().sessionStatus).toBe('ended');
  });

  it('should close socket on unmount', () => {
    const r = renderComponent();
    const wsInstance = MockWebSocket.instances[0];

    act(() => {
      r.unmount();
    });

    expect(wsInstance.close).toHaveBeenCalledTimes(1);
  });
});
