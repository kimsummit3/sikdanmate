import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/theme';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function AppHeader({ eyebrow, title, subtitle, actionLabel, onPressAction }: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {actionLabel && onPressAction ? (
        <TouchableOpacity style={styles.badge} onPress={onPressAction}>
          <Text style={styles.badgeText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.greenDeep,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    maxWidth: 320,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.greenLight,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#335339',
    fontWeight: '700',
  },
});
