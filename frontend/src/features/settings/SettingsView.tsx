import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../store/settingsStore';
import { Typography } from '../../components/common/Typography';
import { ToggleRow } from '../../components/common/ToggleRow';
import { FavouriteView } from './FavouriteView';

interface SettingsViewProps {
  onBack: () => void;
}

// A navigation row that looks like iOS-style settings rows
const NavRow = ({
  icon, iconColor = '#FF1801', title, subtitle, onPress, badge,
}: {
  icon: string; iconColor?: string; title: string; subtitle?: string; onPress: () => void; badge?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="flex-row items-center py-3.5 px-1"
  >
    <View
      className="w-8 h-8 rounded-lg items-center justify-center mr-3"
      style={{ backgroundColor: iconColor + '22' }}
    >
      <Ionicons name={icon as any} size={17} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-on-surface font-bold text-sm">{title}</Text>
      {subtitle && <Text className="text-text-secondary text-[11px] mt-0.5">{subtitle}</Text>}
    </View>
    {badge ? (
      <View className="bg-primary/20 px-2 py-0.5 rounded-full mr-2">
        <Text className="text-primary text-[10px] font-bold">{badge}</Text>
      </View>
    ) : null}
    <Ionicons name="chevron-forward" size={16} color="#3E423A" />
  </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View className="flex-row items-center gap-2 mb-2 mt-2">
    <View className="w-1 h-4 rounded-full bg-primary" />
    <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">{title}</Text>
  </View>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [showFavourites, setShowFavourites] = useState(false);

  const favoriteDriver = useSettingsStore(s => s.favoriteDriver);
  const favoriteTeam   = useSettingsStore(s => s.favoriteTeam);

  const gapDisplayMode      = useSettingsStore(s => s.gapDisplayMode);
  const temperatureUnit     = useSettingsStore(s => s.temperatureUnit);
  const showDRSZones        = useSettingsStore(s => s.showDRSZones);
  const alertOnFlags        = useSettingsStore(s => s.alertOnFlags);
  const pitLaneAlerts       = useSettingsStore(s => s.pitLaneAlerts);
  const driverNotifications = useSettingsStore(s => s.driverNotifications);

  const setGapDisplayMode      = useSettingsStore(s => s.setGapDisplayMode);
  const setTemperatureUnit     = useSettingsStore(s => s.setTemperatureUnit);
  const setShowDRSZones        = useSettingsStore(s => s.setShowDRSZones);
  const setAlertOnFlags        = useSettingsStore(s => s.setAlertOnFlags);
  const setPitLaneAlerts       = useSettingsStore(s => s.setPitLaneAlerts);
  const setDriverNotifications = useSettingsStore(s => s.setDriverNotifications);

  if (showFavourites) {
    return <FavouriteView onBack={() => setShowFavourites(false)} />;
  }

  const favBadge = [favoriteDriver, favoriteTeam].filter(Boolean).join(' · ') || undefined;

  return (
    <ScrollView
      className="flex-1 bg-background pt-12"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center border-b border-border bg-surface">
        <TouchableOpacity onPress={onBack} className="mr-4 p-1 rounded-full bg-overlay">
          <Ionicons name="arrow-back" size={24} color="#FF1801" />
        </TouchableOpacity>
        <Typography variant="headline" className="text-on-surface uppercase">Settings</Typography>
      </View>

      <View className="p-4 gap-4">

        {/* ── PERSONALISATION ─────────────────────────────────── */}
        <View className="bg-surface border border-border rounded-xl px-3 pt-2 pb-1">
          <SectionHeader title="Personalisation" />

          <NavRow
            icon="heart"
            iconColor="#FF1801"
            title="Favourite Driver & Team"
            subtitle="Highlight rows and trigger alerts"
            badge={favBadge}
            onPress={() => setShowFavourites(true)}
          />
        </View>

        {/* ── TIMING DISPLAY ──────────────────────────────────── */}
        <View className="bg-surface border border-border rounded-xl px-3 pt-2 pb-1">
          <SectionHeader title="Timing Display" />

          <ToggleRow
            title="Leader Gap View"
            description="Show gap to P1 instead of car ahead"
            value={gapDisplayMode === 'LEADER'}
            onValueChange={v => setGapDisplayMode(v ? 'LEADER' : 'INTERVAL')}
            className="border-b border-border"
          />
          <ToggleRow
            title="Show DRS Zones"
            description="Overlay DRS activation on Circuit view"
            value={showDRSZones}
            onValueChange={setShowDRSZones}
          />
        </View>

        {/* ── UNITS ───────────────────────────────────────────── */}
        <View className="bg-surface border border-border rounded-xl px-3 pt-2 pb-1">
          <SectionHeader title="Units" />

          <ToggleRow
            title="Fahrenheit Temperatures"
            description="Display track & air temps in °F"
            value={temperatureUnit === 'F'}
            onValueChange={v => setTemperatureUnit(v ? 'F' : 'C')}
          />
        </View>

        {/* ── ALERTS & NOTIFICATIONS ──────────────────────────── */}
        <View className="bg-surface border border-border rounded-xl px-3 pt-2 pb-1">
          <SectionHeader title="Alerts & Notifications" />

          <ToggleRow
            title="Track Flag Haptics"
            description="Vibration & banner on yellow, red, SC flags"
            value={alertOnFlags}
            onValueChange={setAlertOnFlags}
            className="border-b border-border"
          />
          <ToggleRow
            title="Pit Lane Alerts"
            description="Notify when any driver enters or exits pits"
            value={pitLaneAlerts}
            onValueChange={setPitLaneAlerts}
            className="border-b border-border"
          />
          <ToggleRow
            title="Favourite Driver Alerts"
            description="Extra notifications for your favourite driver"
            value={driverNotifications}
            onValueChange={setDriverNotifications}
          />
        </View>

        {/* ── ABOUT ───────────────────────────────────────────── */}
        <View className="bg-surface border border-border p-4 rounded-xl items-center">
          <Ionicons name="flag-outline" size={32} color="#FF1801" />
          <Typography variant="headline" className="text-sm text-on-surface mt-2 uppercase tracking-widest">F1 Fan Companion</Typography>
          <Typography variant="data" className="text-xs text-text-secondary mt-1">Version 1.0.0 · Expo SDK 56</Typography>
          <Typography variant="body" className="text-[11px] text-text-secondary mt-3 text-center">
            Real-time F1 telemetry, powered by the official SignalR timing stream.
          </Typography>
        </View>

      </View>
    </ScrollView>
  );
};
