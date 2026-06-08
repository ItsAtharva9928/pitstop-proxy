import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Typography } from './Typography';
import { DriverData } from '../../store/raceStore';

interface BattleModeCardProps {
  driver1: DriverData;
  driver2: DriverData;
  gap: string;
}

export const BattleModeCard: React.FC<BattleModeCardProps> = ({ driver1, driver2, gap }) => {
  return (
    <View className="bg-surface border border-border p-4 rounded-md relative overflow-hidden">
      {/* Red accent edge strip */}
      <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

      <View className="flex-row justify-between items-center border-b border-border pb-2 mb-3">
        <Typography variant="label" className="text-text-secondary">TRACK BATTLE</Typography>
        <Typography variant="data" className="text-primary font-bold">GAP {gap}</Typography>
      </View>

      <View className="flex-row justify-between gap-4">
        {/* Driver 1 Card */}
        <View className="flex-1 bg-background border border-border p-3 rounded-md">
          <View className="flex-row items-center mb-2">
            <View className="w-1 h-6 mr-2" style={{ backgroundColor: driver1.teamColor }} />
            <Typography variant="headline" className="text-lg font-bold">{driver1.driverName}</Typography>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1.5">
              <View className="w-3 h-3 rounded-full bg-tertiary" />
              <Typography variant="data" className="text-tertiary text-xs">M</Typography>
            </View>
            <Typography variant="label" className="text-xs text-text-secondary">12 LAPS</Typography>
          </View>
        </View>

        {/* Driver 2 Card */}
        <View className="flex-1 bg-background border border-border p-3 rounded-md">
          <View className="flex-row items-center mb-2">
            <View className="w-1 h-6 mr-2" style={{ backgroundColor: driver2.teamColor }} />
            <Typography variant="headline" className="text-lg font-bold">{driver2.driverName}</Typography>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1.5">
              <View className="w-3 h-3 rounded-full bg-primary" />
              <Typography variant="data" className="text-primary text-xs">S</Typography>
            </View>
            <Typography variant="label" className="text-xs text-text-secondary">4 LAPS</Typography>
          </View>
        </View>
      </View>

      {/* Sparks/Telemetry Lines */}
      <View className="h-10 flex-row gap-2 pt-3">
        <View className="flex-1 bg-background border-b-2 border-b-[#0600EF] h-full relative opacity-80">
          <Svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <Polyline
              fill="none"
              points="0,40 20,16 40,24 60,8 80,20 100,4"
              stroke="#0600EF"
              strokeWidth="2"
            />
          </Svg>
        </View>
        <View className="flex-1 bg-background border-b-2 border-b-[#00D2BE] h-full relative opacity-80">
          <Svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <Polyline
              fill="none"
              points="0,40 20,12 40,20 60,4 80,16 100,2"
              stroke="#00D2BE"
              strokeWidth="2"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};
