import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, LayoutAnimation, Platform, UIManager, Modal } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LeaderboardView } from './src/features/leaderboard/LeaderboardView';
import { StandingsView } from './src/features/standings/StandingsView';
import { ScheduleView } from './src/features/schedule/ScheduleView';
import { CircuitView } from './src/features/circuits/CircuitView';
import { SettingsView } from './src/features/settings/SettingsView';
import { ToggleRow } from './src/components/common/ToggleRow';
import { useWebSocketProvider } from './src/store/providers/WebSocketProvider';
import { useSettingsStore } from './src/store/settingsStore';
import * as Notifications from 'expo-notifications';
import { usePushNotifications } from './src/hooks/usePushNotifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Enable layout animation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const AppContent = () => {
  usePushNotifications();
  useWebSocketProvider();
  const [currentTab, setCurrentTab] = useState<'live' | 'standings' | 'schedule' | 'circuits' | 'settings'>('live');
  const [previousTab, setPreviousTab] = useState<'live' | 'standings' | 'schedule' | 'circuits'>('live');
  const [quickSettingsVisible, setQuickSettingsVisible] = useState(false);

  // Real persisted quick-settings from store
  const gapDisplayMode      = useSettingsStore(s => s.gapDisplayMode);
  const alertOnFlags        = useSettingsStore(s => s.alertOnFlags);
  const temperatureUnit     = useSettingsStore(s => s.temperatureUnit);
  const pitLaneAlerts       = useSettingsStore(s => s.pitLaneAlerts);
  const favoriteDriver      = useSettingsStore(s => s.favoriteDriver);
  const favoriteTeam        = useSettingsStore(s => s.favoriteTeam);
  const setGapDisplayMode   = useSettingsStore(s => s.setGapDisplayMode);
  const setAlertOnFlags     = useSettingsStore(s => s.setAlertOnFlags);
  const setTemperatureUnit  = useSettingsStore(s => s.setTemperatureUnit);
  const setPitLaneAlerts    = useSettingsStore(s => s.setPitLaneAlerts);

  const insets = useSafeAreaInsets();

  const handleTabChange = (tab: 'live' | 'standings' | 'schedule' | 'circuits') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPreviousTab(tab);
    setCurrentTab(tab);
  };

  const handleOpenSettings = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentTab('settings');
  };

  const handleBackFromSettings = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentTab(previousTab);
  };

  return (
    <View className="flex-1 bg-background">
      {currentTab === 'live' && <LeaderboardView />}
      {currentTab === 'standings' && <StandingsView />}
      {currentTab === 'schedule' && <ScheduleView />}
      {currentTab === 'circuits' && <CircuitView />}
      {currentTab === 'settings' && <SettingsView onBack={handleBackFromSettings} />}

      {/* Bottom Floating Bar (Hidden in Full Settings View) */}
      {currentTab !== 'settings' && (
        <View 
          className="absolute w-full px-4 flex-row items-center justify-center"
          style={{ 
            bottom: Math.max(insets.bottom, 20),
            alignSelf: 'center',
            maxWidth: 400,
          }}
        >
          {/* Main Capsule Navigation Bar */}
          <View 
            className="flex-1 flex-row justify-around items-center h-16 rounded-full px-2 border border-[#2D332D]"
            style={{ 
              backgroundColor: 'rgba(28, 30, 28, 0.96)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <NavItem 
              label="Live"
              iconName="flash" 
              isActive={currentTab === 'live'} 
              onPress={() => handleTabChange('live')} 
            />
            <NavItem 
              label="Standings"
              iconName="trophy" 
              isActive={currentTab === 'standings'} 
              onPress={() => handleTabChange('standings')} 
            />
            <NavItem 
              label="Schedule"
              iconName="calendar" 
              isActive={currentTab === 'schedule'} 
              onPress={() => handleTabChange('schedule')} 
            />
            <NavItem 
              label="Circuits"
              iconName="map" 
              isActive={currentTab === 'circuits'} 
              onPress={() => handleTabChange('circuits')} 
            />
          </View>

          {/* 3-Dots FAB */}
          <TouchableOpacity 
            onPress={() => setQuickSettingsVisible(true)}
            activeOpacity={0.8}
            className="w-14 h-14 rounded-full items-center justify-center ml-3"
            style={{
              backgroundColor: '#FED695',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#1E221E" />
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Settings Slide-up Modal */}
      <Modal
        visible={quickSettingsVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setQuickSettingsVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setQuickSettingsVisible(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          {/* Bottom Sheet Modal Container */}
          <TouchableOpacity 
            activeOpacity={1}
            className="bg-surface border-t border-border rounded-t-3xl p-6 pb-8"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 20,
            }}
          >
            {/* Drag Handle */}
            <View 
              style={{
                alignSelf: 'center',
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#3E423A',
                marginBottom: 20,
              }}
            />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-lg font-bold uppercase tracking-widest font-display">
                Quick Settings
              </Text>
              <TouchableOpacity onPress={() => setQuickSettingsVisible(false)}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* Favourite pill — tap to open full settings */}
            {(favoriteDriver || favoriteTeam) ? (
              <TouchableOpacity
                onPress={() => { setQuickSettingsVisible(false); handleOpenSettings(); }}
                className="flex-row items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-2 rounded-full self-start mb-5"
              >
                <Ionicons name="heart" size={13} color="#FF1801" />
                <Text className="text-primary text-xs font-bold uppercase tracking-wide">
                  {[favoriteDriver, favoriteTeam].filter(Boolean).join(' · ')}
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Settings Toggles */}
            <View className="mb-5">
              <ToggleRow
                title="Leader Gap View"
                description="Show gap to P1 instead of car ahead"
                value={gapDisplayMode === 'LEADER'}
                onValueChange={v => setGapDisplayMode(v ? 'LEADER' : 'INTERVAL')}
              />
              <ToggleRow
                title="Flag Haptic Alerts"
                description="Vibrate on yellow / red / SC flags"
                value={alertOnFlags}
                onValueChange={setAlertOnFlags}
              />
              <ToggleRow
                title="Pit Lane Alerts"
                description="Notify when any driver enters pits"
                value={pitLaneAlerts}
                onValueChange={setPitLaneAlerts}
              />
              <ToggleRow
                title="Fahrenheit Temps"
                description="Show temps in °F on Circuit view"
                value={temperatureUnit === 'F'}
                onValueChange={v => setTemperatureUnit(v ? 'F' : 'C')}
              />
            </View>

            {/* Link to Full Settings */}
            <TouchableOpacity 
              onPress={() => {
                setQuickSettingsVisible(false);
                handleOpenSettings();
              }}
              className="w-full bg-overlay border border-border flex-row items-center justify-between p-4 rounded-xl"
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="settings-outline" size={20} color="#FF1801" />
                <Text className="text-white text-sm font-bold uppercase tracking-wide font-display">
                  Go to Full Settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#8E8E93" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const NavItem = ({ 
  label, 
  iconName, 
  isActive, 
  onPress 
}: { 
  label: string, 
  iconName: string, 
  isActive: boolean, 
  onPress: () => void 
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-row items-center justify-center h-11 rounded-full ${
        isActive 
          ? 'bg-[#323B30] px-4' 
          : 'w-11 items-center justify-center'
      }`}
    >
      <Ionicons 
        name={isActive ? (iconName as any) : (`${iconName}-outline` as any)} 
        size={22} 
        color={isActive ? '#FED695' : '#8A968A'} 
      />
      {isActive && (
        <Text className="text-[#FED695] text-[11px] font-bold ml-2 uppercase tracking-widest font-display">
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
