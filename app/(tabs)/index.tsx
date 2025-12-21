import { useState, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@/components/ui/SearchBar";
import { PharmacyCard } from "@/components/pharmacy/PharmacyCard";
import { styles } from "./styles";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = SCREEN_WIDTH - 32;

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
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Animation scale pour l'effet de press
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSeeMorePress = () => {
    // Animation de press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Délai pour laisser l'animation se terminer avant la navigation
    setTimeout(() => {
      router.push("/pharmacies");
    }, 150);
  };

  const handleBarcodeScanned = (barcode: string) => {
    console.log("Code-barres scanné:", barcode);
  };

  // Bannières avec images de médicaments
  const banners: Banner[] = [
    {
      id: "1",
      title: "Promo -30%",
      subtitle: "Vitamines & Compléments",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    },
    {
      id: "2",
      title: "Nouveauté",
      subtitle: "Soins dermatologiques",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    },
    {
      id: "3",
      title: "Livraison rapide",
      subtitle: "Médicaments essentiels",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    },
    {
      id: "4",
      title: "Bien-être",
      subtitle: "Produits naturels",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
    },
    {
      id: "5",
      title: "Santé familiale",
      subtitle: "Parapharmacie",
      image:
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80",
    },
  ];

  // Données de test avec pharmacies ivoiriennes
const pharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "Pharmacie de la Riviera Palmeraie",
    address: "Boulevard Mitterrand, Riviera Palmeraie, Cocody, Abidjan",
    distance: "2.3 km",
    closingTime: "22:00",
    isOpen: true,
    deliveryTime: "15-25 min",
    image:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&q=80",
  },
  {
    id: "2",
    name: "Pharmacie du Plateau Indénié",
    address: "Avenue Delafosse, Plateau, Abidjan",
    distance: "4.8 km",
    closingTime: "20:30",
    isOpen: true,
    deliveryTime: "20-35 min",
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
  },
  {
    id: "3",
    name: "Pharmacie de Yopougon Niangon",
    address: "Niangon Sud, Yopougon, Abidjan",
    distance: "7.6 km",
    closingTime: "21:00",
    isOpen: true,
    deliveryTime: "30-45 min",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
  },
  {
    id: "4",
    name: "Pharmacie d’Angré Château",
    address: "Angré 8e Tranche, Cocody, Abidjan",
    distance: "3.1 km",
    closingTime: "23:00",
    isOpen: true,
    deliveryTime: "10-20 min",
    image:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&q=80",
  },
  {
    id: "5",
    name: "Pharmacie du Marché de Treichville",
    address: "Avenue 21, Treichville, Abidjan",
    distance: "6.9 km",
    closingTime: "20:00",
    isOpen: false,
    deliveryTime: "—",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
  },
  {
    id: "6",
    name: "Pharmacie de Marcory Zone 4",
    address: "Zone 4C, Marcory, Abidjan",
    distance: "5.4 km",
    closingTime: "22:30",
    isOpen: true,
    deliveryTime: "15-30 min",
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
  },
];


  // Filtrer les pharmacies selon la recherche
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBannerScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveBannerIndex(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.actionBanner}>
          <Text style={styles.actionText}>
            Ne cherchez plus vos médicaments, localisez-les ici ↓
          </Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher un produit (nom, code-barres)"
          showBarcode
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Icons */}
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.navItem}>
            <View style={[styles.navIcon, { backgroundColor: "#00A8E8" }]}>
              <Ionicons name="medkit" size={28} color="white" />
            </View>
            <Text style={styles.navLabel}>Pharmacies</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={[styles.navIcon, { backgroundColor: "#00C8FF" }]}>
              <Ionicons name="videocam" size={28} color="white" />
            </View>
            <Text style={styles.navLabel}>Téléconsulter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={[styles.navIcon, { backgroundColor: "#00A8E8" }]}>
              <Ionicons name="map" size={28} color="white" />
            </View>
            <Text style={styles.navLabel}>Carte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={[styles.navIcon, { backgroundColor: "#00C8FF" }]}>
              <Ionicons name="call" size={28} color="white" />
            </View>
            <Text style={styles.navLabel}>Service</Text>
          </TouchableOpacity>
        </View>

        {/* Banner Carousel avec images */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerScroll}
            scrollEventThrottle={16}
            snapToInterval={BANNER_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {banners.map((banner) => (
              <TouchableOpacity
                key={banner.id}
                style={[styles.bannerCard, { width: BANNER_WIDTH }]}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: banner.image }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <View style={styles.bannerOverlay}>
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.carouselDots}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeBannerIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Pharmacies Section */}
        <View style={styles.pharmaciesHeader}>
          <Text style={styles.sectionTitle}>Pharmacies à proximité</Text>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.seeMoreContainer}
              onPress={handleSeeMorePress}
              activeOpacity={0.7}
            >
              <Text style={styles.seeMoreText}>Voir plus</Text>
              <Ionicons name="chevron-forward" size={16} color="#00A8E8" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Liste des pharmacies */}
        <View style={styles.pharmaciesList}>
          {filteredPharmacies.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Aucune pharmacie trouvée pour cette recherche"
                : "Aucune pharmacie trouvée"}
            </Text>
          ) : (
            filteredPharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
