import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors } from '../styles/theme';
import { ShoppingItem } from '../types/app';

type Props = {
  shoppingItems: ShoppingItem[];
  onBack: () => void;
};

export function ShoppingScreen({ shoppingItems, onBack }: Props) {
  const grouped = shoppingItems.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader
        eyebrow="장보기 모드"
        title={`이번 주 식단을\n장보기로 연결합니다.`}
        subtitle="주간 플랜 기준으로 필요한 품목을 묶고, 대체재와 보관 메모까지 붙입니다."
        actionLabel="뒤로"
        onPressAction={onBack}
      />

      {Object.entries(grouped).map(([category, items]) => (
        <SurfaceCard key={category} style={styles.cardSpacing}>
          <Text style={styles.cardLabel}>{category}</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemMain}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>수량: {item.quantity}</Text>
                {item.substitute ? <Text style={styles.itemSub}>대체재: {item.substitute}</Text> : null}
                {item.storageTip ? <Text style={styles.itemTip}>보관: {item.storageTip}</Text> : null}
              </View>
            </View>
          ))}
        </SurfaceCard>
      ))}

      <SurfaceCard tone="soft" style={styles.cardSpacing}>
        <Text style={styles.cardLabel}>장보기 원칙</Text>
        <Text style={styles.note}>한 달치가 아니라 주간 단위로 끊고, 신선식품은 2~3일 단위 리필이 더 현실적입니다.</Text>
      </SurfaceCard>

      <AppButton label="홈으로 돌아가기" onPress={onBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  cardSpacing: { marginBottom: 16 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.greenDeep, marginBottom: 10 },
  itemRow: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#EEF1EA' },
  itemMain: { gap: 4 },
  itemName: { fontSize: 16, fontWeight: '700', color: colors.text },
  itemMeta: { fontSize: 14, color: colors.textMuted },
  itemSub: { fontSize: 13, color: colors.greenStrong, fontWeight: '600' },
  itemTip: { fontSize: 13, color: colors.textSoft },
  note: { fontSize: 15, lineHeight: 22, color: '#4E6151' },
});
