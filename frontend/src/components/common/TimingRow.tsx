import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import { useSettingsStore } from '../../store/settingsStore';

interface TimingRowProps {
  position: number;
  driverNumber: number;
  driverName: string;
  teamColor: string;
  interval: string;
  isPits?: boolean;
}

export const TimingRow: React.FC<TimingRowProps> = React.memo(({ position, driverNumber, driverName, teamColor, interval, isPits = false }) => {
  const favoriteDriver = useSettingsStore((state) => state.favoriteDriver);
  const isFavorite = favoriteDriver !== '' && driverName.toUpperCase() === favoriteDriver.toUpperCase();

  return (
    <View 
      className={`flex-row items-center py-2 border-b border-border ${isFavorite ? 'bg-primary/10 border-l-4' : 'bg-surface'}`}
      style={isFavorite ? { borderLeftColor: teamColor } : undefined}
    >

      {/* Position */}
      <View className="w-8 items-center">
        <Typography variant="data">{position}</Typography>
      </View>
      
      {/* Team Color Indicator */}
      <View className="w-1 h-8 rounded-full mr-2" style={{ backgroundColor: teamColor }} />
      
      {/* Driver Info */}
      <View className="flex-1 flex-row items-center">
        <Typography variant="data" className="w-8 text-text-secondary">{driverNumber}</Typography>
        <Typography variant="headline" className="text-xl uppercase">{driverName}</Typography>
      </View>
      
      {/* Interval / Pits */}
      <View className="w-20 items-end pr-4">
        {isPits ? (
          <Typography variant="label" className="text-primary">IN PIT</Typography>
        ) : (
          <Typography variant="data">{interval}</Typography>
        )}
      </View>
    </View>
  );
});
