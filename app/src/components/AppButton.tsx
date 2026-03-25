import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../styles/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function AppButton({ label, onPress, disabled = false, variant = 'primary' }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.greenButton,
  },
  secondary: {
    backgroundColor: colors.white,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    color: '#17301B',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.greenStrong,
  },
});
