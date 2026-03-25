import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../styles/theme';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'soft';
}>;

export function SurfaceCard({ children, style, tone = 'default' }: Props) {
  return <View style={[styles.card, tone === 'soft' && styles.softCard, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: colors.greenDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  softCard: {
    backgroundColor: colors.greenSurface,
    shadowOpacity: 0,
    elevation: 0,
  },
});
