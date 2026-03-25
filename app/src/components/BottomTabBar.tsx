import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../styles/theme';

type TabKey = 'home' | 'summary' | 'settings';

type Props = {
  currentTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'home', label: '오늘 추천' },
  { key: 'summary', label: '주간 요약' },
  { key: 'settings', label: '설정' },
];

export function BottomTabBar({ currentTab, onChangeTab }: Props) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const active = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onChangeTab(tab.key)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 22,
    backgroundColor: colors.white,
    shadowColor: colors.greenDeep,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.greenSurface,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.greenStrong,
    fontWeight: '700',
  },
});
