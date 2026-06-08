import { useEffect, useRef } from 'react';
import { Vibration } from 'react-native';
import * as signalR from '@microsoft/signalr';
import pako from 'pako';
import { useRaceStore } from '../raceStore';
import { useSettingsStore } from '../settingsStore';
import { scheduleF1Notification } from '../../hooks/usePushNotifications';

export const useWebSocketProvider = () => {
  const setLeaderboard = useRaceStore((state) => state.setLeaderboard);
  const setConnectionStatus = useRaceStore((state) => state.setConnectionStatus);
  const reconnectTrigger = useRaceStore((state) => state.reconnectTrigger);
  const setSessionStatus = useRaceStore((state) => state.setSessionStatus);
  const setWeatherData = useRaceStore((state) => state.setWeatherData);
  const setTrackStatus = useRaceStore((state) => state.setTrackStatus);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    let isMounted = true;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }

    const decodeBase64 = (base64: string): Uint8Array => {
      let bufferLength = base64.length * 0.75;
      if (base64[base64.length - 1] === '=') bufferLength--;
      if (base64[base64.length - 2] === '=') bufferLength--;

      const bytes = new Uint8Array(bufferLength);
      let p = 0;
      for (let i = 0; i < base64.length; i += 4) {
        const encoded1 = lookup[base64.charCodeAt(i)];
        const encoded2 = lookup[base64.charCodeAt(i + 1)];
        const encoded3 = lookup[base64.charCodeAt(i + 2)];
        const encoded4 = lookup[base64.charCodeAt(i + 3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
      }
      return bytes;
    };

    const decode = (val: string): any => {
      try {
        const bytes = decodeBase64(val);
        const decompressed = pako.inflateRaw(bytes, { to: 'string' });
        return JSON.parse(decompressed);
      } catch (e) {
        try {
          return JSON.parse(val);
        } catch {
          console.error("Failed to decode and parse telemetry data:", e, "val start:", val.substring(0, 50));
          return null; // Return null instead of the raw base64 string so we don't treat it as valid data
        }
      }
    };

    const processFeedMessage = (explicitType: string | null, data: any) => {
      if (!data) return;
      
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      if (explicitType) {
        // e.g. explicitType = "TimingData", parsedData = { "Lines": "base64..." }
        let decodedPayload: any = {};
        if (typeof parsedData === 'string') {
          decodedPayload = decode(parsedData);
        } else {
          for (const key of Object.keys(parsedData)) {
            const value = parsedData[key];
            if (typeof value === 'string') {
              decodedPayload[key] = decode(value);
            } else {
              decodedPayload[key] = value;
            }
          }
        }
        if (isMounted) {
          handleTelemetryMessage(explicitType, decodedPayload);
        }
      } else {
        // Fallback if F1 sends a single object { "TimingData": "base64..." }
        for (const key of Object.keys(parsedData)) {
          const value = parsedData[key];
          let decodedData = value;

          if (typeof value === 'string') {
            decodedData = decode(value);
          }

          if (decodedData && isMounted) {
            handleTelemetryMessage(key, decodedData);
          }
        }
      }
    };

    const handleTelemetryMessage = (type: string, data: any) => {
      setSessionStatus('active');

      if (type === 'WeatherData') {
        setWeatherData(data);
      } else if (type === 'TrackStatus') {
        setTrackStatus(data);
        
        const { alertOnFlags } = useSettingsStore.getState();
        if (alertOnFlags && data) {
          if (['3', '4', '5', '6'].includes(data.Status)) {
            Vibration.vibrate([0, 200, 100, 200]);
            scheduleF1Notification('Track Status Update', `Track flag changed to ${data.Message || 'Caution'}`);
          } else if (data.Status === '1') {
            Vibration.vibrate(100);
          }
        }
      } else if (type === 'TimingData') {
        console.log('Processing TimingData', data.Lines ? Object.keys(data.Lines).length + ' drivers' : 'No Lines');
        if (data && data.Lines) {
          const DRIVER_INFO: Record<string, { name: string; color: string }> = {
            '1': { name: 'NOR', color: '#FF8000' }, '81': { name: 'PIA', color: '#FF8000' },
            '33': { name: 'VER', color: '#3671C6' }, '11': { name: 'PER', color: '#3671C6' },
            '16': { name: 'LEC', color: '#E80020' }, '44': { name: 'HAM', color: '#E80020' },
            '63': { name: 'RUS', color: '#27F4D2' }, '12': { name: 'ANT', color: '#27F4D2' },
            '14': { name: 'ALO', color: '#229971' }, '18': { name: 'STR', color: '#229971' },
            '55': { name: 'SAI', color: '#005AFF' }, '23': { name: 'ALB', color: '#005AFF' }, '43': { name: 'COL', color: '#005AFF' },
            '10': { name: 'GAS', color: '#FF87BC' }, '41': { name: 'LIN', color: '#FF87BC' },
            '27': { name: 'HUL', color: '#00E701' }, '5': { name: 'BOR', color: '#00E701' }, '77': { name: 'BOT', color: '#00E701' },
            '31': { name: 'OCO', color: '#FFFFFF' }, '87': { name: 'BEA', color: '#FFFFFF' },
            '30': { name: 'LAW', color: '#6692FF' }, '6': { name: 'HAD', color: '#6692FF' }
          };

          const prevLeaderboard = useRaceStore.getState().leaderboard;
          const newLeaderboardMap = new Map(prevLeaderboard.map(d => [d.driverNumber, d]));

          // Pre-populate all drivers if leaderboard is empty
          if (newLeaderboardMap.size === 0) {
            console.log('Leaderboard is empty, pre-populating 20 drivers');
            Object.entries(DRIVER_INFO).forEach(([numStr, info]) => {
              newLeaderboardMap.set(parseInt(numStr, 10), {
                driverNumber: parseInt(numStr, 10),
                driverName: info.name,
                teamColor: info.color,
                position: 99,
                interval: '',
                isPits: false,
              });
            });
          }

          for (const [driverNumStr, lineData] of Object.entries(data.Lines)) {
            const driverData = lineData as any;
            const driverNum = parseInt(driverNumStr, 10);
            
            // Create or update driver
            const existing = newLeaderboardMap.get(driverNum) || {
              driverNumber: driverNum,
              driverName: DRIVER_INFO[driverNumStr]?.name || driverNumStr,
              teamColor: DRIVER_INFO[driverNumStr]?.color || '#8A968A',
              position: 99,
              interval: '',
              isPits: false,
            };

            if (driverData.Position) existing.position = parseInt(driverData.Position, 10);
            if (driverData.InPit !== undefined) existing.isPits = driverData.InPit;
            
            // Interval logic
            if (driverData.GapToLeader !== undefined) {
              existing.interval = driverData.GapToLeader === '' ? 'Leader' : driverData.GapToLeader;
            } else if (driverData.IntervalToPositionAhead && driverData.IntervalToPositionAhead.Value) {
               // Fallback interval if GapToLeader isn't sent in this delta
               if (existing.interval === '') {
                 existing.interval = driverData.IntervalToPositionAhead.Value;
               }
            }

            newLeaderboardMap.set(driverNum, existing);
          }

          // Dynamic sorting fallback using parsed gap times
          const parseSortGap = (gapStr: string): number => {
            if (!gapStr) return 999; // Drivers with no data go to the bottom
            if (gapStr.toLowerCase() === 'leader') return 0;
            if (gapStr.toUpperCase().includes('LAP')) return 1000 + parseInt(gapStr);
            if (gapStr.toUpperCase() === 'DNF' || gapStr.toUpperCase() === 'OUT') return 9999;
            if (gapStr.toUpperCase().includes('STOP')) return 9998;
            const val = parseFloat(gapStr.replace('+', '').trim());
            return isNaN(val) ? 999 : val;
          };

          const nextLeaderboard = Array.from(newLeaderboardMap.values()).sort((a, b) => {
            const posA = parseInt(a.position as any, 10);
            const posB = parseInt(b.position as any, 10);
            
            const validA = isNaN(posA) ? 99 : posA;
            const validB = isNaN(posB) ? 99 : posB;
            
            if (validA < 99 && validB < 99) {
                return validA - validB;
            }
            
            // Otherwise, sort by gap. If gap is the same, sort by valid position
            const gapDiff = parseSortGap(a.interval) - parseSortGap(b.interval);
            if (gapDiff === 0) return validA - validB;
            return gapDiff;
          });
          
          // Re-assign positions based on sorted order so UI shows 1, 2, 3...
          nextLeaderboard.forEach((driver, idx) => {
             driver.position = idx + 1;
          });

          console.log(`Updating leaderboard with ${nextLeaderboard.length} drivers, top 3:`, nextLeaderboard.slice(0,3).map(d => `${d.position} ${d.driverName} ${d.interval}`));
          
          setLeaderboard(nextLeaderboard);

          // Trigger alerts based on new data vs prev data
          const { alertOnFlags, favoriteDriver } = useSettingsStore.getState();
          if (alertOnFlags && prevLeaderboard.length > 0) {
            nextLeaderboard.forEach(driver => {
              const prevDriver = prevLeaderboard.find(d => d.driverNumber === driver.driverNumber);
              if (prevDriver) {
                if (favoriteDriver && (driver.driverName === favoriteDriver || driver.driverNumber.toString() === favoriteDriver)) {
                  if (!prevDriver.isPits && driver.isPits) {
                    scheduleF1Notification('Pit Stop Alert', `${driver.driverName} has entered the pits!`);
                  }
                }
                const isDnfOrOut = (interval: string) => interval?.toLowerCase() === 'dnf' || interval?.toLowerCase() === 'out';
                if (!isDnfOrOut(prevDriver.interval) && isDnfOrOut(driver.interval)) {
                  scheduleF1Notification('Session Alert', `${driver.driverName} is OUT of the session!`);
                }
              }
            });
          }
        }
        // Fallback for direct arrays (e.g., if any mock data or pre-mapped data is sent)
        if (Array.isArray(data)) {
          const prevLeaderboard = useRaceStore.getState().leaderboard;
          setLeaderboard(data);
          
          const { alertOnFlags, favoriteDriver } = useSettingsStore.getState();
          if (alertOnFlags && prevLeaderboard.length > 0) {
            data.forEach(driver => {
              const prevDriver = prevLeaderboard.find(d => d.driverNumber === driver.driverNumber);
              if (prevDriver) {
                if (favoriteDriver && (driver.driverName === favoriteDriver || driver.driverNumber.toString() === favoriteDriver)) {
                  if (!prevDriver.isPits && driver.isPits) {
                    scheduleF1Notification('Pit Stop Alert', `${driver.driverName} has entered the pits!`);
                  }
                }
                
                const isDnfOrOut = (interval: string) => interval?.toLowerCase() === 'dnf' || interval?.toLowerCase() === 'out';
                if (!isDnfOrOut(prevDriver.interval) && isDnfOrOut(driver.interval)) {
                  scheduleF1Notification('Session Alert', `${driver.driverName} is OUT of the session!`);
                }
              }
            });
          }
        }
      }
    };

    const startConnection = async () => {
      try {
        console.log("Initializing F1 telemetry connection sequence...");
        setConnectionStatus('connecting');

        // --- HYDRATION STEP ---
        try {
          console.log("Fetching base state hydration from proxy...");
          // Replace this URL with your deployed Cloudflare Worker URL
          const proxyUrl = 'http://127.0.0.1:8787/'; 
          
          const timingRes = await fetch(proxyUrl);
          
          if (timingRes.ok) {
            const baseTimingData = await timingRes.json();
            console.log("Hydrating store with base TimingData payload...");
            processFeedMessage('TimingData', baseTimingData);
          } else {
            console.warn("Failed to fetch base TimingData from proxy, status:", timingRes.status);
          }
        } catch (e) {
          console.error("Hydration failed, proceeding with delta-only connection:", e);
        }
        // --- END HYDRATION STEP ---
        
        console.log("Connecting to F1 SignalR Core Hub directly...");
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("https://livetiming.formula1.com/signalrcore", {
            // SignalR TS client might not allow custom User-Agent in browsers, but React Native should handle it fine
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
          })
          .withAutomaticReconnect()
          .build();
        
        connectionRef.current = connection;

        connection.on("feed", (hubName: any, data?: any) => {
          if (data !== undefined) {
            processFeedMessage(hubName, data);
          } else {
            processFeedMessage(null, hubName);
          }
        });

        connection.onreconnecting(() => {
          setConnectionStatus('connecting');
        });

        connection.onreconnected(() => {
          setConnectionStatus('connected');
        });

        connection.onclose(() => {
          if (isMounted) {
            setConnectionStatus('disconnected');
            setSessionStatus('ended');
          }
        });

        await connection.start();
        
        if (isMounted) {
          console.log("Connected to F1 SignalR Core!");
          setConnectionStatus('connected');

          const requestArgs = [
            "TimingData",
            "TimingAppData",
            "SessionInfo",
            "TrackStatus",
            "RaceControlMessages"
          ];
          
          await connection.invoke("Subscribe", requestArgs);
          console.log("Successfully subscribed to free timing streams.");
        }
      } catch (err) {
        console.error("Failed to connect or subscribe:", err);
        if (isMounted) {
          setConnectionStatus('disconnected');
          // Retry logic could go here if automatic reconnect isn't sufficient
        }
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [reconnectTrigger]);
};
