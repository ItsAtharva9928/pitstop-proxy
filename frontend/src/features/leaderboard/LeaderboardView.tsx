import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useRaceStore, DriverData } from '../../store/raceStore';
import { TimingRow } from '../../components/common/TimingRow';
import { Typography } from '../../components/common/Typography';
import { useSettingsStore } from '../../store/settingsStore';

import { BattleModeCard } from '../../components/common/BattleModeCard';
import { Button } from '../../components/common/Button';

const parseGap = (gapStr: string): number => {
  if (!gapStr || gapStr.toLowerCase() === 'leader') return 0;
  const cleaned = gapStr.replace('+', '').replace('s', '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const getIntervalData = (leaderboard: DriverData[], gapDisplayMode: 'INTERVAL' | 'LEADER') => {
  if (gapDisplayMode === 'LEADER') return leaderboard;
  
  return leaderboard.map((driver, index) => {
    if (index === 0) {
      return driver;
    }
    
    const prevDriver = leaderboard[index - 1];
    
    if (
      driver.interval.toLowerCase().includes('lap') || 
      prevDriver.interval.toLowerCase().includes('lap') ||
      driver.interval.toLowerCase() === 'dnf' ||
      prevDriver.interval.toLowerCase() === 'dnf'
    ) {
      return driver;
    }
    
    const currentLeaderGap = parseGap(driver.interval);
    const prevLeaderGap = parseGap(prevDriver.interval);
    const intervalGap = currentLeaderGap - prevLeaderGap;
    
    return {
      ...driver,
      interval: intervalGap <= 0 ? 'Leader' : `+${intervalGap.toFixed(3)}`
    };
  });
};

export const LeaderboardView: React.FC = () => {
  const leaderboard = useRaceStore((state) => state.leaderboard);
  const connectionStatus = useRaceStore((state) => state.connectionStatus);
  const sessionStatus = useRaceStore((state) => state.sessionStatus);
  const triggerReconnect = useRaceStore((state) => state.triggerReconnect);
  const trackStatus = useRaceStore((state) => state.trackStatus);

  const gapDisplayMode = useSettingsStore((state) => state.gapDisplayMode);
  const alertOnFlags = useSettingsStore((state) => state.alertOnFlags);

  const processedLeaderboard = React.useMemo(() => {
    return getIntervalData(leaderboard, gapDisplayMode);
  }, [leaderboard, gapDisplayMode]);

  const renderItem = React.useCallback(({ item }: { item: DriverData }) => (
    <TimingRow
      position={item.position}
      driverNumber={item.driverNumber}
      driverName={item.driverName}
      teamColor={item.teamColor}
      interval={item.interval}
      isPits={item.isPits}
    />
  ), []);

  const hasDrivers = processedLeaderboard.length >= 2;
  const isDisconnected = connectionStatus === 'disconnected';

  const renderTrackStatusBanner = () => {
    if (!alertOnFlags || !trackStatus || trackStatus.Status === '1' || trackStatus.Message === 'AllClear') {
      return null;
    }

    let bgColor = 'bg-yellow-500';
    let textColor = 'text-black';
    let title = `TRACK STATUS: ${trackStatus.Message.toUpperCase()}`;

    if (trackStatus.Status === '5' || trackStatus.Message.toLowerCase().includes('red')) {
      bgColor = 'bg-red-600';
      textColor = 'text-white';
    } else if (trackStatus.Status === '4' || trackStatus.Message.toLowerCase().includes('safetycar')) {
      bgColor = 'bg-orange-500';
      textColor = 'text-black';
    } else if (trackStatus.Status === '6' || trackStatus.Message.toLowerCase().includes('vsc')) {
      bgColor = 'bg-yellow-600';
      textColor = 'text-black';
    }

    return (
      <View className={`${bgColor} py-2.5 px-4 flex-row justify-center items-center`}>
        <Typography variant="label" className={`${textColor} font-bold tracking-widest text-center uppercase`}>
          ⚠️ {title}
        </Typography>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between border-b border-border bg-surface">
        <Typography variant="headline" className="text-primary font-bold">LIVE RACE</Typography>
        
        {connectionStatus === 'connecting' && (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#FF1801" />
            <Typography variant="label" className="text-text-secondary">CONNECTING</Typography>
          </View>
        )}
        
        {connectionStatus === 'connected' && sessionStatus === 'active' && (
          <View className="flex-row items-center gap-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-primary" />
            <Typography variant="label" className="text-primary font-bold">LIVE</Typography>
          </View>
        )}
        
        {isDisconnected && (
          <Typography variant="label" className="text-text-secondary">DISCONNECTED</Typography>
        )}
      </View>

      {/* Track Status Flag Alert Banner */}
      {renderTrackStatusBanner()}

      {/* Disconnected Notification & Reconnect Action */}
      {isDisconnected ? (
        <View className="flex-1 justify-center items-center p-6">
          <Typography variant="headline" className="text-text-primary text-center font-bold mb-2">
            TIMING STREAM OFFLINE
          </Typography>
          <Typography variant="body" className="text-text-secondary text-center mb-6">
            You are disconnected from the F1 timing stream. This happens if the backend is down or the session hasn't started.
          </Typography>
          <Button 
            onPress={triggerReconnect}
            label="RETRY CONNECTION"
            className="w-full max-w-[240px]"
          />
        </View>
      ) : connectionStatus === 'connected' && sessionStatus !== 'active' ? (
        <View className="flex-1 justify-center items-center p-6">
          <Typography variant="headline" className="text-text-primary text-center font-bold mb-2">
            SESSION NOT ACTIVE
          </Typography>
          <Typography variant="body" className="text-text-secondary text-center mb-6">
            Connected to F1 timing, but no cars are on track.
          </Typography>
          <Typography variant="headline" className="text-primary text-center font-bold text-xl">
            LIVE IN...
          </Typography>
        </View>
      ) : (
        <FlatList
          data={processedLeaderboard}
          keyExtractor={(item) => item.driverNumber.toString()}
          renderItem={renderItem}
          ListHeaderComponent={
            <View className="p-4 gap-4">

              {/* Battle Mode Card (if we have at least 2 drivers) */}
              {hasDrivers && (
                <BattleModeCard
                  driver1={processedLeaderboard[0]}
                  driver2={processedLeaderboard[1]}
                  gap={processedLeaderboard[1].interval}
                />
              )}
              
              <Typography variant="label" className="text-text-secondary mt-2">LEADERBOARD</Typography>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 110 }}
        />
      )}
    </View>
  );
};
