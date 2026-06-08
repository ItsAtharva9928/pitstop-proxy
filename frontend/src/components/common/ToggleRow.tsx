import React from 'react';
import { View, Switch } from 'react-native';
import { Typography } from './Typography';

interface ToggleRowProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({
  title,
  description,
  value,
  onValueChange,
  className = '',
}) => {
  return (
    <View className={`flex-row justify-between items-center py-3 ${className}`}>
      <View className="flex-1 pr-4">
        <Typography variant="headline" className="text-sm text-on-surface">{title}</Typography>
        <Typography variant="body" className="text-xs text-text-secondary mt-0.5">{description}</Typography>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#2C2C2C', true: '#FF1801' }}
        thumbColor={value ? '#FFFFFF' : '#8E8E93'}
      />
    </View>
  );
};
