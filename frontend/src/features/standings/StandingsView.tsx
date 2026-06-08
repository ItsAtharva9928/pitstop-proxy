import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Typography } from '../../components/common/Typography';
import { useHistoricalStore } from '../../store/historicalStore';

export const StandingsView: React.FC = () => {
  const { standings, isLoading, fetchStandings } = useHistoricalStore();

  useEffect(() => {
    fetchStandings();
  }, []);

  // Extract top 3 for podium visualization if we have enough data
  const p1 = standings[0];
  const p2 = standings[1];
  const p3 = standings[2];

  return (
    <ScrollView className="flex-1 bg-surface pt-12" contentContainerStyle={{ paddingBottom: 110 }}>
      <View className="px-4 py-4 border-b border-surface-variant flex-row justify-between items-end">
        <View>
          <Typography variant="headline" className="uppercase text-on-surface font-bold">World Championship</Typography>
          <Typography variant="data" className="text-on-surface-variant text-xs mt-1">SEASON 2024 • LIVE STANDINGS</Typography>
        </View>
        <View className="flex-row bg-surface-container-low rounded-lg p-1 border border-surface-variant">
          <View className="bg-surface-container-highest px-4 py-1 rounded">
            <Typography variant="label" className="text-primary font-bold">Drivers</Typography>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#FF1801" />
        </View>
      ) : (
        <>
          {/* Podium Section */}
          {standings.length >= 3 && (
            <View className="flex-row justify-center items-end h-64 gap-4 px-2 mt-4">
              {/* P2 */}
              <View className="items-center w-1/3 mb-4">
                <View className="w-16 h-16 rounded-full bg-surface-variant border-2 border-[#47efda] shadow-lg items-center justify-center mb-[-10px] z-10">
                  <Typography variant="label" className="text-[#47efda] font-bold">P2</Typography>
                </View>
                <View className="bg-surface-container border-l-2 border-l-[#47efda] w-full rounded-t-lg pt-6 pb-2 items-center">
                  <Typography variant="headline" className="text-xs uppercase" numberOfLines={1}>{p2.Driver.familyName}</Typography>
                  <Typography variant="data" className="text-[#47efda] font-bold">{p2.points}</Typography>
                </View>
              </View>

              {/* P1 */}
              <View className="items-center w-1/3 z-20">
                <View className="w-20 h-20 rounded-full bg-surface-variant border-2 border-primary shadow-xl items-center justify-center mb-[-10px] z-10">
                  <Typography variant="label" className="text-primary font-bold">P1</Typography>
                </View>
                <View className="bg-surface-container-high border-t-2 border-t-primary w-full rounded-t-lg pt-6 pb-3 items-center">
                  <Typography variant="headline" className="text-sm font-bold uppercase" numberOfLines={1}>{p1.Driver.familyName}</Typography>
                  <Typography variant="data" className="text-primary font-bold">{p1.points}</Typography>
                </View>
              </View>

              {/* P3 */}
              <View className="items-center w-1/3 mb-8">
                <View className="w-14 h-14 rounded-full bg-surface-variant border-2 border-[#b08780] shadow-lg items-center justify-center mb-[-10px] z-10">
                  <Typography variant="label" className="text-[#b08780] font-bold">P3</Typography>
                </View>
                <View className="bg-surface-container border-l-2 border-l-[#b08780] w-full rounded-t-lg pt-6 pb-2 items-center">
                  <Typography variant="headline" className="text-xs uppercase" numberOfLines={1}>{p3.Driver.familyName}</Typography>
                  <Typography variant="data" className="text-[#b08780] font-bold">{p3.points}</Typography>
                </View>
              </View>
            </View>
          )}

          {/* Standings List */}
          <View className="bg-surface-container rounded-xl border border-surface-variant mx-4 mb-4 mt-6 overflow-hidden">
            <View className="flex-row p-3 border-b border-outline-variant bg-surface-container-low">
              <Typography variant="label" className="w-10">POS</Typography>
              <Typography variant="label" className="flex-1">DRIVER</Typography>
              <Typography variant="label" className="w-16 text-right">PTS</Typography>
            </View>

            {standings.map((driver, index) => (
              <View key={driver.Driver.familyName + index} className={`flex-row p-3 items-center border-b border-surface-variant ${index % 2 === 1 ? 'bg-[#1c1b1b]' : ''}`}>
                <Typography variant="data" className="w-10 text-on-surface-variant">{driver.position}</Typography>
                <View className="flex-1">
                  <Typography variant="headline" className="text-sm font-bold uppercase">{driver.Driver.givenName} {driver.Driver.familyName}</Typography>
                  <Typography variant="label" className="text-[10px] text-on-surface-variant uppercase">{driver.Constructors[0]?.name || 'UNKNOWN'}</Typography>
                </View>
                <Typography variant="data" className="w-16 text-right font-bold">{driver.points}</Typography>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};
