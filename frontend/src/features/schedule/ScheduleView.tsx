import React from 'react';
import { View, ScrollView } from 'react-native';
import { Typography } from '../../components/common/Typography';

export const ScheduleView: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-background pt-12 px-4" contentContainerStyle={{ paddingBottom: 110 }}>
      <View className="mb-6">
        <Typography variant="headline" className="text-2xl text-on-surface">Monaco Grand Prix</Typography>
        <Typography variant="label" className="text-on-surface-variant mt-2">MONTE CARLO, MONACO</Typography>
      </View>

      <View className="bg-surface-container border border-outline-variant rounded p-4 mb-8">
        <Typography variant="label" className="text-on-surface-variant mb-1">NEXT EVENT: QUALIFYING</Typography>
        <Typography variant="data" className="text-2xl text-primary font-bold">02:14:38</Typography>
      </View>

      {/* Timeline Items */}
      <View className="pl-6 border-l-2 border-surface-variant ml-2 mb-4 space-y-6">
        
        {/* FP1 */}
        <View className="relative mb-6">
          <View className="absolute -left-[35px] w-4 h-4 bg-surface border-2 border-outline-variant rounded-full mt-1" />
          <View className="flex-row items-center gap-2 mb-1">
            <Typography variant="headline" className="text-on-surface text-lg">Practice 1</Typography>
            <View className="bg-surface-variant px-2 py-0.5 rounded">
              <Typography variant="label" className="text-[10px]">COMPLETED</Typography>
            </View>
          </View>
          <Typography variant="data" className="text-on-surface-variant mb-2">Fri, May 24 • 13:30 - 14:30</Typography>
        </View>

        {/* Quali (Live) */}
        <View className="relative mb-6">
          <View className="absolute -left-[35px] w-4 h-4 bg-primary rounded-full mt-1 border-2 border-[#121212]" />
          <View className="flex-row items-center gap-2 mb-1">
            <Typography variant="headline" className="text-primary text-lg font-bold">Qualifying</Typography>
            <View className="border border-primary px-2 py-0.5 rounded bg-primary/20">
              <Typography variant="label" className="text-[10px] text-primary">LIVE NOW</Typography>
            </View>
          </View>
          <Typography variant="data" className="text-primary font-bold mb-2">Sat, May 25 • 16:00 - 17:00</Typography>
          <View className="bg-surface-container-low border border-primary/30 rounded p-3">
             <Typography variant="label" className="text-on-surface mb-2">Q1 - 12:45 REMAINING</Typography>
             <View className="h-1.5 bg-[#121212] rounded-full overflow-hidden">
               <View className="bg-primary h-full w-[45%]" />
             </View>
          </View>
        </View>

        {/* Race */}
        <View className="relative">
          <View className="absolute -left-[35px] w-4 h-4 bg-surface border-2 border-outline-variant border-dashed rounded-full mt-1" />
          <View className="flex-row items-center gap-2 mb-1">
            <Typography variant="headline" className="text-on-surface text-lg">Race</Typography>
            <View className="border border-outline-variant px-2 py-0.5 rounded">
              <Typography variant="label" className="text-[10px] text-on-surface-variant">UPCOMING</Typography>
            </View>
          </View>
          <Typography variant="data" className="text-on-surface-variant">Sun, May 26 • 15:00</Typography>
        </View>

      </View>
    </ScrollView>
  );
};
