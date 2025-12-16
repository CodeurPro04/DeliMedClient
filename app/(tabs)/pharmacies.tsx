import { PharmacyCard } from '@/components/pharmacy/PharmacyCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/Colors';
import { mockPharmacies } from '@/utils/mockData';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function PharmaciesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Pharmacies</Text>
        <SearchBar
          placeholder="Rechercher par nom ou ville"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.result}>
          {mockPharmacies.length} pharmacies à proximité
        </Text>

        {mockPharmacies.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy.id}
            pharmacy={pharmacy}
            onPress={() => router.push(`/pharmacy/${pharmacy.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    color: COLORS.text,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  result: {
    marginBottom: 16,
    color: COLORS.gray,
  },
});
