import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "rounded-sm px-4 py-3 flex items-center justify-center";
  const variants = {
    primary: "bg-primary border border-primary",
    secondary: "bg-surface border border-border"
  };

  const textClasses = "font-display font-bold tracking-widest uppercase text-xs";
  const textVariants = {
    primary: "text-primary-foreground",
    secondary: "text-text-primary"
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <Text className={`${textClasses} ${textVariants[variant]}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
