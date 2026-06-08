import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Typography } from '../../components/common/Typography';
import { DataRow } from '../../components/common/DataRow';
import { useCircuitStore } from '../../store/circuitStore';
import { useRaceStore } from '../../store/raceStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getCircuitDetails } from './circuitDetails';

export const CircuitView: React.FC = () => {
  const { currentRace, isLoading, fetchCurrentRace } = useCircuitStore();
  const weatherData = useRaceStore(state => state.weatherData);
  const temperatureUnit = useSettingsStore((state) => state.temperatureUnit);

  useEffect(() => {
    fetchCurrentRace();
  }, [fetchCurrentRace]);

  if (isLoading || !currentRace) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#FF1801" />
      </View>
    );
  }

  const circuitFacts = getCircuitDetails(currentRace.Circuit.circuitId);

  const formatTemp = (tempC: string | undefined) => {
    if (!tempC) return 'N/A';
    if (temperatureUnit === 'F') {
      const c = parseFloat(tempC);
      if (isNaN(c)) return `${tempC}°C`;
      const f = Math.round((c * 9) / 5 + 32);
      return `${f}°F`;
    }
    return `${tempC}°C`;
  };

  const trackTemp = formatTemp(weatherData?.TrackTemp);
  const airTemp = formatTemp(weatherData?.AirTemp);
  const rainProb = weatherData?.Rainfall ? `${weatherData.Rainfall}%` : 'N/A';
  const rainProbNum = parseInt(weatherData?.Rainfall || '0', 10);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 110 }}>
      {/* Hero Section */}
      <View className="h-64 bg-surface border-b border-outline-variant justify-end p-4 pb-6">
        <Typography variant="label" className="text-primary mb-1">ROUND {currentRace.round}</Typography>
        <Typography variant="display" className="text-4xl text-on-surface uppercase">{currentRace.Circuit.circuitName}</Typography>
        <Typography variant="headline" className="text-on-surface-variant text-lg mt-1">{currentRace.Circuit.Location.locality}, {currentRace.Circuit.Location.country}</Typography>
        
        <View className="bg-surface-container border border-outline-variant rounded-lg p-2 mt-4 self-start flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-primary" />
          <Typography variant="label" className="text-on-surface">{circuitFacts.drsZones} DRS Zone{circuitFacts.drsZones !== 1 ? 's' : ''} Active</Typography>
        </View>
      </View>

      {/* Bento Grid */}
      <View className="p-4 pb-4 space-y-4">
        <View className="flex-row gap-4">
          <View className="flex-1 bg-surface-container border border-outline-variant p-3 rounded-lg h-28 justify-between">
            <Typography variant="label" className="text-on-surface-variant text-[10px]">CIRCUIT LENGTH</Typography>
            <Typography variant="data" className="text-xl">{circuitFacts.length}</Typography>
          </View>
          <View className="flex-1 bg-surface-container border border-outline-variant p-3 rounded-lg h-28 justify-between">
            <Typography variant="label" className="text-on-surface-variant text-[10px]">NUMBER OF LAPS</Typography>
            <Typography variant="data" className="text-xl">{circuitFacts.laps}</Typography>
          </View>
        </View>

        <View className="bg-surface-container border border-outline-variant p-4 rounded-lg border-l-2 border-l-primary">
          <Typography variant="label" className="text-on-surface-variant mb-2">LAP RECORD</Typography>
          <Typography variant="data" className="text-2xl">{circuitFacts.lapRecord.time}</Typography>
          <Typography variant="body" className="text-on-surface-variant text-sm mt-1">{circuitFacts.lapRecord.driver} ({circuitFacts.lapRecord.year})</Typography>
        </View>

        {/* Live Conditions */}
        <View className="bg-surface-container border border-outline-variant rounded-lg p-4 mt-2">
          <Typography variant="headline" className="text-lg mb-4 border-b border-outline-variant pb-2">Live Conditions</Typography>
          
          <DataRow label="Track Temp" value={trackTemp} className="mb-2" />
          <DataRow label="Air Temp" value={airTemp} className="mb-2" />
          <DataRow label="Rain Prob." value={rainProb} valueClassName="text-tertiary" />
          
          <View className="w-full bg-surface-container-highest rounded-full h-1.5 mt-4">
             <View className="bg-tertiary h-1.5 rounded-full" style={{ width: `${Math.min(rainProbNum, 100)}%` }} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
