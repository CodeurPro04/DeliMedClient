import { useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SearchBar } from "@/components/ui/SearchBar";
import { PharmacyCard } from "@/components/pharmacy/PharmacyCard";

// Types
interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  closingTime: string;
  isOpen: boolean;
  deliveryTime: string;
  image?: string;
  city: string;
}

export default function PharmaciesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "open" | "nearby">(
    "all"
  );

  const handleBarcodeScanned = (barcode: string) => {
    console.log("Code-barres scanné:", barcode);
    setSearchQuery(barcode);
  };

  // Données de test
  const pharmacies: Pharmacy[] = [
    {
      id: "1",
      name: "Pharmacie de la Riviera Palmeraie",
      address: "Boulevard Mitterrand, Riviera Palmeraie, Cocody, Abidjan",
      city: "Cocody",
      distance: "2.3 km",
      closingTime: "22:00",
      isOpen: true,
      deliveryTime: "10-20 min",
      image:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80",
    },
    {
      id: "2",
      name: "Pharmacie du Plateau Indénié",
      address: "Avenue Delafosse, Plateau, Abidjan",
      city: "Plateau",
      distance: "4.8 km",
      closingTime: "20:30",
      isOpen: true,
      deliveryTime: "20-30 min",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    },
    {
      id: "3",
      name: "Pharmacie de Yopougon Niangon",
      address: "Niangon Sud, Yopougon, Abidjan",
      city: "Yopougon",
      distance: "7.6 km",
      closingTime: "21:00",
      isOpen: false,
      deliveryTime: "30-80 min",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    },
    {
      id: "4",
      name: "Pharmacie d'Angré Château",
      address: "Angré 8e Tranche, Cocody, Abidjan",
      city: "Cocody",
      distance: "3.1 km",
      closingTime: "23:00",
      isOpen: true,
      deliveryTime: "5-15 min",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    },
    {
      id: "5",
      name: "Pharmacie du Marché de Treichville",
      address: "Avenue 21, Treichville, Abidjan",
      city: "Treichville",
      distance: "6.9 km",
      closingTime: "20:00",
      isOpen: true,
      deliveryTime: "15-25 min",
      image:
        "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=800&q=80",
    },
    {
      id: "6",
      name: "Pharmacie de Marcory Zone 4",
      address: "Zone 4C, Marcory, Abidjan",
      city: "Marcory",
      distance: "5.4 km",
      closingTime: "22:30",
      isOpen: true,
      deliveryTime: "15-30 min",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
    },
  ];

  // Filtrage intelligent avec useMemo pour optimisation
  const filteredPharmacies = useMemo(() => {
    let result = pharmacies;

    // Filtre par recherche
    if (searchQuery) {
      result = result.filter(
        (pharmacy) =>
          pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pharmacy.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par type
    if (filterType === "open") {
      result = result.filter((p) => p.isOpen);
    } else if (filterType === "nearby") {
      result = result.filter((p) => parseFloat(p.distance) < 10);
    }

    return result;
  }, [searchQuery, filterType]);

  const openPharmaciesCount = pharmacies.filter((p) => p.isOpen).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Trouver une pharmacie</Text>
            <Text style={styles.headerSubtitle}>
              {openPharmaciesCount} pharmacies ouvertes près de vous
            </Text>
          </View>

          {/* Barre de recherche */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher par nom, ville ou adresse"
            showBarcode={true}
            onBarcodeScanned={handleBarcodeScanned}
          />

          {/* Filtres rapides */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "all" && styles.filterChipActive,
              ]}
              onPress={() => setFilterType("all")}
            >
              <Ionicons
                name="list"
                size={16}
                color={filterType === "all" ? "white" : "#00A8E8"}
              />
              <Text
                style={[
                  styles.filterText,
                  filterType === "all" && styles.filterTextActive,
                ]}
              >
                Toutes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "open" && styles.filterChipActive,
              ]}
              onPress={() => setFilterType("open")}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={filterType === "open" ? "white" : "#4CAF50"}
              />
              <Text
                style={[
                  styles.filterText,
                  filterType === "open" && styles.filterTextActive,
                ]}
              >
                Ouvertes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "nearby" && styles.filterChipActive,
              ]}
              onPress={() => setFilterType("nearby")}
            >
              <Ionicons
                name="location"
                size={16}
                color={filterType === "nearby" ? "white" : "#E91E63"}
              />
              <Text
                style={[
                  styles.filterText,
                  filterType === "nearby" && styles.filterTextActive,
                ]}
              >
                Proche
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Liste des pharmacies */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compteur de résultats */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredPharmacies.length}{" "}
            {filteredPharmacies.length > 1 ? "résultats" : "résultat"}
          </Text>
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearText}>Effacer</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* État vide élégant */}
        {filteredPharmacies.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="search-outline" size={64} color="#00A8E8" />
            </View>
            <Text style={styles.emptyTitle}>Aucune pharmacie trouvée</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Essayez de modifier votre recherche ou vos filtres"
                : "Aucune pharmacie disponible pour le moment"}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
              >
                <Text style={styles.resetButtonText}>
                  Réinitialiser la recherche
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {filteredPharmacies.map((pharmacy, index) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                onPress={() => router.push(`/pharmacy/${pharmacy.id}`)}
              />
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton */}
      <TouchableOpacity
        style={styles.mapFloatingButton}
        activeOpacity={0.8}
        onPress={() => router.push("/map")}
      >
        <LinearGradient
          colors={["#E91E63", "#C2185B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mapButtonGradient}
        >
          <Ionicons name="map" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A8E8",
  },
  header: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  titleContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: "#1A237E",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#00A8E8",
  },
  filterTextActive: {
    color: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    padding: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  clearText: {
    fontSize: 14,
    color: "#00A8E8",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  mapFloatingButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mapButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  mapButtonContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  mapIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  mapButtonText: {
    display: "none",
  },
});