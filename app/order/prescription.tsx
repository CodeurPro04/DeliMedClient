import { View, Text } from 'react-native';
import { Button } from '@/components/ui/Button';

export default function PrescriptionScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        Une ordonnance ?
      </Text>

      <Text style={{ marginVertical: 10 }}>
        Ajoutez votre ordonnance en PDF ou photo.
      </Text>

      <Button title="📄 Ajouter une ordonnance" onPress={() => {}} />
    </View>
  );
}
