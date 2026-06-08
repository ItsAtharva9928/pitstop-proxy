import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';

interface DataRowProps {
  label: string;
  value: string;
  valueClassName?: string;
  className?: string;
}

export const DataRow: React.FC<DataRowProps> = ({
  label,
  value,
  valueClassName = '',
  className = '',
}) => {
  return (
    <View className={`flex-row justify-between ${className}`}>
      <Typography variant="body" className="text-on-surface-variant">{label}</Typography>
      <Typography variant="data" className={valueClassName}>{value}</Typography>
    </View>
  );
};
