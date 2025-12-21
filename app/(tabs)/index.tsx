import { useState, useRef, useEffect } from "react";
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
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SearchBar } from "@/components/ui/SearchBar";
import { PharmacyCard } from "@/components/pharmacy/PharmacyCard";
import { styles } from "./styles";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

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

interface UserLocation {
  city: string;
  district: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation>({
    city: "Abidjan",
    district: "Marcory",
  });
  const [loadingLocation, setLoadingLocation] = useState(true);
  const bannerScrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Animation scale pour l'effet de press
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Récupérer la localisation de l'utilisateur
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoadingLocation(true);

      // Demander les permissions de localisation
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission de localisation refusée");
        setUserLocation({
          city: "Abidjan",
          district: "Localisation désactivée",
        });
        setLoadingLocation(false);
        return;
      }

      // Obtenir la position actuelle avec haute précision
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Géocodage inverse pour obtenir l'adresse
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];

        // Construire l'adresse de manière intelligente
        const district =
          address.district ||
          address.subregion ||
          address.street ||
          address.name ||
          "Zone inconnue";

        const city = address.city || address.region || "Abidjan";

        setUserLocation({
          city,
          district,
        });
      } else {
        setUserLocation({
          city: "Abidjan",
          district: "Position détectée",
        });
      }

      setLoadingLocation(false);
    } catch (error) {
      console.error("Erreur de localisation:", error);
      setUserLocation({
        city: "Abidjan",
        district: "Erreur de localisation",
      });
      setLoadingLocation(false);
    }
  };

  // Fonction de rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);

    // Recharger la localisation et les données
    await getUserLocation();

    setTimeout(() => {
      console.log("Données rafraîchies !");
      setRefreshing(false);
    }, 1500);
  };

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
      name: "Pharmacie d'Angré Château",
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
        {/* Localisation de l'utilisateur */}
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={getUserLocation}
          activeOpacity={0.7}
        >
          <Ionicons name="location-sharp" size={20} color="white" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Votre position</Text>
            {loadingLocation ? (
              <Text style={styles.locationText}>Chargement...</Text>
            ) : (
              <Text style={styles.locationText}>
                {userLocation.district}, {userLocation.city}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.actionBanner}>
          <Text style={styles.actionText}>
            Besoin d'un médicament ? Trouvez-le facilement ici ↓
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00A8E8"]}
            tintColor="#00A8E8"
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        {/* Navigation Icons - 3 éléments avec belle disposition */}
        <View style={styles.navContainer}>
          {/* Pharmacies - Bleu clair en haut, rose/violet en bas */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/pharmacies")}>
            <LinearGradient
              colors={["#5DC8F3", "#E8A0D8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.navIcon}
            >
              <Ionicons name="medkit" size={36} color="white" />
            </LinearGradient>
            <Text style={styles.navLabel}>Pharmacies</Text>
          </TouchableOpacity>

          {/* Carte - Bleu en haut, rose en bas */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/map")}
          >
            <LinearGradient
              colors={["#5DC8F3", "#E8A0D8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.navIcon}
            >
              <Ionicons name="map" size={36} color="white" />
            </LinearGradient>
            <Text style={styles.navLabel}>Carte</Text>
          </TouchableOpacity>

          {/* Service - Violet en haut, rose en bas */}
          <TouchableOpacity style={styles.navItem}>
            <LinearGradient
              colors={["#9D8FE8", "#E8A0D8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.navIcon}
            >
              <Ionicons name="call" size={36} color="white" />
            </LinearGradient>
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
