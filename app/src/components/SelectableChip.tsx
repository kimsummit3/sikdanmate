import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../styles/theme';

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectableChip({ label, selected, onPress }: SelectableChipProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.chipIdle,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chipSelected: {
    backgroundColor: '#DFF0DC',
  },
  text: {
    color: '#445244',
    fontWeight: '600',
  },
  textSelected: {
    color: colors.greenStrong,
    fontWeight: '700',
  },
});
