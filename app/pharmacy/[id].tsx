import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function PharmacyDetail() {
  const router = useRouter();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>
        Pharmacie sélectionnée
      </Text>

      <Button
        title="Ajouter une ordonnance"
        onPress={() => router.push('/order/prescription')}
      />

      <Button
        title="Ajouter des produits"
        variant="secondary"
        onPress={() => router.push('/order/products')}
      />
    </View>
  );
}
