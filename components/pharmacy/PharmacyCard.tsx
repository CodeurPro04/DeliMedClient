import { View, Text, Pressable } from 'react-native';
import { Pharmacy } from '@/types/pharmacy';
import { COLORS } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export function PharmacyCard({
  pharmacy,
}: {
  pharmacy: Pharmacy;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/pharmacy/${pharmacy.id}`)}
      style={{
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>
        {pharmacy.name}
      </Text>

      <Text style={{ color: COLORS.gray }}>
        {pharmacy.address}
      </Text>

      <Text
        style={{
          marginTop: 4,
          color:
            pharmacy.status === 'open'
              ? COLORS.success
              : 'red',
        }}
      >
        {pharmacy.status === 'open'
          ? 'Ouverte'
          : 'Fermée'}{' '}
        • {pharmacy.distance}
      </Text>
    </Pressable>
  );
}
