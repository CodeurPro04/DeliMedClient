import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '@/constants/Colors';

type Props = {
  pharmacy: any;
  onPress?: () => void;
};

export function PharmacyCard({ pharmacy, onPress }: Props) {
  const isOpen = pharmacy.status === 'open';

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{pharmacy.name}</Text>

        <View
          style={[
            styles.badge,
            { backgroundColor: isOpen ? '#DCFCE7' : '#FEE2E2' },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isOpen ? '#16A34A' : '#DC2626' },
            ]}
          >
            {isOpen ? 'Ouverte' : 'Fermée'}
          </Text>
        </View>
      </View>

      <Text style={styles.address}>{pharmacy.address}</Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>{pharmacy.distance}</Text>
        <Text style={styles.meta}>• {pharmacy.hours}</Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    paddingRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    marginTop: 8,
    color: COLORS.gray,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  meta: {
    fontSize: 13,
    color: COLORS.gray,
  },
});
