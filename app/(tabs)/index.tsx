import { ScrollView, Text } from 'react-native';
import { SearchBar } from '@/components/ui/SearchBar';
import { PharmacyCard } from '@/components/pharmacy/PharmacyCard';
import { usePharmacies } from '@/hooks/usePharmacies';

export default function HomeScreen() {
  const { pharmacies } = usePharmacies();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >
      <SearchBar placeholder="Rechercher un médicament" />

      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          marginVertical: 12,
        }}
      >
        Pharmacies à proximité
      </Text>

      {pharmacies.length === 0 ? (
        <Text>Aucune pharmacie trouvée</Text>
      ) : (
        pharmacies.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy.id}
            pharmacy={pharmacy}
          />
        ))
      )}
    </ScrollView>
  );
}
