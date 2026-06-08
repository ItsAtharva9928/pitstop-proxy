import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../components/common/Typography';
import { useSettingsStore } from '../../store/settingsStore';

interface FavouriteViewProps {
  onBack: () => void;
}

const DRIVERS = [
  { code: 'VER', fullName: 'Max Verstappen',     team: 'Red Bull',     teamColor: '#3671C6', number: 1  },
  { code: 'NOR', fullName: 'Lando Norris',        team: 'McLaren',      teamColor: '#FF8000', number: 4  },
  { code: 'LEC', fullName: 'Charles Leclerc',     team: 'Ferrari',      teamColor: '#E80020', number: 16 },
  { code: 'PIA', fullName: 'Oscar Piastri',       team: 'McLaren',      teamColor: '#FF8000', number: 81 },
  { code: 'SAI', fullName: 'Carlos Sainz',        team: 'Ferrari',      teamColor: '#E80020', number: 55 },
  { code: 'HAM', fullName: 'Lewis Hamilton',      team: 'Ferrari',      teamColor: '#E80020', number: 44 },
  { code: 'RUS', fullName: 'George Russell',      team: 'Mercedes',     teamColor: '#27F4D2', number: 63 },
  { code: 'ANT', fullName: 'Kimi Antonelli',      team: 'Mercedes',     teamColor: '#27F4D2', number: 12 },
  { code: 'PER', fullName: 'Sergio Perez',        team: 'Red Bull',     teamColor: '#3671C6', number: 11 },
  { code: 'ALO', fullName: 'Fernando Alonso',     team: 'Aston Martin', teamColor: '#229971', number: 14 },
  { code: 'STR', fullName: 'Lance Stroll',        team: 'Aston Martin', teamColor: '#229971', number: 18 },
  { code: 'TSU', fullName: 'Yuki Tsunoda',        team: 'Red Bull',     teamColor: '#3671C6', number: 22 },
  { code: 'GAS', fullName: 'Pierre Gasly',        team: 'Alpine',       teamColor: '#FF87BC', number: 10 },
  { code: 'OCO', fullName: 'Esteban Ocon',        team: 'Haas',         teamColor: '#B6BABD', number: 31 },
  { code: 'HUL', fullName: 'Nico Hulkenberg',     team: 'Sauber',       teamColor: '#52E252', number: 27 },
  { code: 'ALB', fullName: 'Alexander Albon',     team: 'Williams',     teamColor: '#64C4FF', number: 23 },
];

const TEAMS = [
  { name: 'Red Bull',      color: '#3671C6', alt: '#1E3A5F' },
  { name: 'Ferrari',       color: '#E80020', alt: '#8B0015' },
  { name: 'McLaren',       color: '#FF8000', alt: '#7A3D00' },
  { name: 'Mercedes',      color: '#27F4D2', alt: '#0A5C52' },
  { name: 'Aston Martin',  color: '#229971', alt: '#0D4030' },
  { name: 'Alpine',        color: '#FF87BC', alt: '#7A2B50' },
  { name: 'Williams',      color: '#64C4FF', alt: '#1A4D7A' },
  { name: 'Haas',          color: '#B6BABD', alt: '#3C3E40' },
  { name: 'Sauber',        color: '#52E252', alt: '#1A5C1A' },
  { name: 'Racing Bulls',  color: '#6692FF', alt: '#202B66' },
];

export const FavouriteView: React.FC<FavouriteViewProps> = ({ onBack }) => {
  const favoriteDriver = useSettingsStore(s => s.favoriteDriver);
  const favoriteTeam   = useSettingsStore(s => s.favoriteTeam);
  const setFavoriteDriver = useSettingsStore(s => s.setFavoriteDriver);
  const setFavoriteTeam   = useSettingsStore(s => s.setFavoriteTeam);

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
        <View>
          <Typography variant="headline" className="text-on-surface uppercase">Favourites</Typography>
          <Typography variant="label" className="text-text-secondary text-[10px] mt-0.5">Driver & Team highlight settings</Typography>
        </View>
      </View>

      <View className="p-4 gap-6">

        {/* ── FAVOURITE DRIVER ───────────────────────────────── */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-1 h-5 rounded-full bg-primary" />
            <Typography variant="headline" className="text-primary uppercase text-sm tracking-widest">Favourite Driver</Typography>
          </View>

          {/* Clear chip */}
          <TouchableOpacity
            onPress={() => setFavoriteDriver('')}
            className={`mb-3 flex-row items-center gap-2 px-4 py-3 rounded-xl border ${favoriteDriver === '' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
          >
            <Ionicons name="close-circle-outline" size={18} color={favoriteDriver === '' ? '#FF1801' : '#8E8E93'} />
            <Text className={`font-bold text-sm uppercase ${favoriteDriver === '' ? 'text-primary' : 'text-text-secondary'}`}>
              No favourite
            </Text>
          </TouchableOpacity>

          <View className="gap-2">
            {DRIVERS.map(d => {
              const isActive = favoriteDriver === d.code;
              return (
                <TouchableOpacity
                  key={d.code}
                  onPress={() => setFavoriteDriver(isActive ? '' : d.code)}
                  activeOpacity={0.7}
                  style={isActive ? { borderColor: d.teamColor } : undefined}
                  className={`flex-row items-center rounded-xl border overflow-hidden ${isActive ? 'border-2' : 'border border-border'}`}
                >
                  {/* Team colour stripe */}
                  <View style={{ width: 5, backgroundColor: d.teamColor, alignSelf: 'stretch' }} />

                  {/* Number badge */}
                  <View
                    className="w-12 h-12 items-center justify-center"
                    style={{ backgroundColor: d.teamColor + '22' }}
                  >
                    <Text style={{ color: d.teamColor }} className="font-bold text-base">{d.number}</Text>
                  </View>

                  {/* Name + Team */}
                  <View className="flex-1 px-3 py-3">
                    <Text className="text-on-surface font-bold text-sm uppercase tracking-wide">{d.code}</Text>
                    <Text className="text-text-secondary text-[11px] mt-0.5">{d.fullName}</Text>
                    <Text className="text-[10px] mt-0.5" style={{ color: d.teamColor }}>{d.team}</Text>
                  </View>

                  {/* Checkmark */}
                  {isActive && (
                    <View className="pr-4">
                      <Ionicons name="checkmark-circle" size={22} color={d.teamColor} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── FAVOURITE TEAM ─────────────────────────────────── */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-1 h-5 rounded-full bg-primary" />
            <Typography variant="headline" className="text-primary uppercase text-sm tracking-widest">Favourite Team</Typography>
          </View>

          {/* Clear chip */}
          <TouchableOpacity
            onPress={() => setFavoriteTeam('')}
            className={`mb-3 flex-row items-center gap-2 px-4 py-3 rounded-xl border ${favoriteTeam === '' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
          >
            <Ionicons name="close-circle-outline" size={18} color={favoriteTeam === '' ? '#FF1801' : '#8E8E93'} />
            <Text className={`font-bold text-sm uppercase ${favoriteTeam === '' ? 'text-primary' : 'text-text-secondary'}`}>
              No favourite
            </Text>
          </TouchableOpacity>

          <View className="flex-row flex-wrap gap-2">
            {TEAMS.map(t => {
              const isActive = favoriteTeam === t.name;
              return (
                <TouchableOpacity
                  key={t.name}
                  onPress={() => setFavoriteTeam(isActive ? '' : t.name)}
                  activeOpacity={0.75}
                  className="rounded-xl overflow-hidden"
                  style={{ width: '47%' }}
                >
                  {/* Card */}
                  <View
                    className={`p-3 rounded-xl border ${isActive ? 'border-2' : 'border'}`}
                    style={{
                      borderColor: isActive ? t.color : '#2D332D',
                      backgroundColor: isActive ? t.color + '1A' : '#1C1E1C',
                    }}
                  >
                    {/* Color bar */}
                    <View style={{ height: 3, backgroundColor: t.color, borderRadius: 2, marginBottom: 8 }} />
                    <Text
                      className="font-bold text-xs uppercase tracking-wide"
                      style={{ color: isActive ? t.color : '#8A968A' }}
                      numberOfLines={1}
                    >
                      {t.name}
                    </Text>
                    {isActive && (
                      <View className="absolute top-2 right-2">
                        <Ionicons name="checkmark-circle" size={16} color={t.color} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </View>
    </ScrollView>
  );
};
