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
import { styles } from "./stylesindex";
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
  buttonText: string;
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
    district: "Ruelle Eliaka Catherine",
  });
  const [loadingLocation, setLoadingLocation] = useState(true);
  const bannerScrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Récupere la localisation de l'utilisateur
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoadingLocation(true);

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

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];

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

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserLocation();
    setTimeout(() => {
      console.log("Données rafraîchies !");
      setRefreshing(false);
    }, 1500);
  };

  const handleSeeMorePress = () => {
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
      buttonText: "Voir les offres",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    },
    {
      id: "2",
      title: "Nouveauté",
      subtitle: "Soins dermatologiques",
      buttonText: "Découvrir",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    },
    {
      id: "3",
      title: "Livraison rapide",
      subtitle: "Médicaments essentiels",
      buttonText: "Commander",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    },
  ];

  // Données de test
  const pharmacies: Pharmacy[] = [
    {
      id: "1",
      name: "Pharmacie de la Riviera Palmeraie",
      address: "Boulevard Mitterrand, Cocody, Abidjan",
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
  ];

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

      {/* Header Section avec gradient */}
      <LinearGradient
        colors={["#00A8E8", "#9D8FE8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {/* Top bar avec logo et notifications */}
        <View style={styles.topBar}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/nlogo2.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Delymed</Text>
          </View>
          <View style={styles.notificationsContainer}>
            <TouchableOpacity style={styles.notificationBadge}>
              <Ionicons name="notifications" size={24} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationBadge}>
              <Ionicons name="chatbubble-ellipses" size={24} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Action Banner */}
        <TouchableOpacity style={styles.actionBanner} activeOpacity={0.8}>
          <Text style={styles.actionText}>
            Besoin d&apos;un médicament ? Trouvez-le facilement ici
          </Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher un produit (nom, code-barres)"
          showBarcode
          onBarcodeScanned={handleBarcodeScanned}
        />
      </LinearGradient>

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
        {/* Banner Carousel */}
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
                    {/* Bouton d'action de la bannière
                    <TouchableOpacity style={styles.bannerButton}>
                      <Text style={styles.bannerButtonText}>
                        {banner.buttonText}
                      </Text>
                    </TouchableOpacity>  */}
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
