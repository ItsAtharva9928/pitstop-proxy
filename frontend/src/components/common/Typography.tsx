import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  variant?: 'display' | 'headline' | 'body' | 'label' | 'data';
}

export const Typography: React.FC<TypographyProps> = ({ children, variant = 'body', className = '', ...props }) => {
  let textClass = "";
  
  switch(variant) {
    case 'display':
      textClass = "font-display text-5xl font-bold tracking-tight text-text-primary";
      break;
    case 'headline':
      textClass = "font-display text-2xl font-semibold text-text-primary";
      break;
    case 'body':
      textClass = "font-sans text-base text-text-secondary";
      break;
    case 'label':
      textClass = "font-display text-xs font-bold tracking-widest uppercase text-text-secondary";
      break;
    case 'data':
      textClass = "font-mono text-sm font-medium text-text-primary";
      break;
  }

  return (
    <Text className={`${textClass} ${className}`} {...props}>
      {children}
    </Text>
  );
};
