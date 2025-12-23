import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { COLORS, spacing } from '../constants/defaultConfigs';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  style,
  ...props
}) => {
  const variantStyles = {
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.secondary },
    danger: { backgroundColor: COLORS.danger },
  };

  return (
    <PaperButton
      mode="contained"
      style={[styles.button, variantStyles[variant], style]}
      labelStyle={styles.label}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

