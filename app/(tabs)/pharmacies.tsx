import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { SearchBar } from '@/components/ui/SearchBar';
import { PharmacyCard } from '@/components/pharmacy/PharmacyCard';
import { mockPharmacies } from '../../utils/mockData';
import { useState } from 'react';

export default function PharmaciesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Rechercher une pharmacie (ville, nom)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsText}>{mockPharmacies.length} pharmacies trouvées</Text>
        
        {mockPharmacies.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy.id}
            pharmacy={pharmacy}
            onPress={() => router.push(`/pharmacy/${pharmacy.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
});