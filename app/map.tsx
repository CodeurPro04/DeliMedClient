import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;
const BOTTOM_SHEET_MIN_HEIGHT = height * 0.25;
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.85;

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  closingTime: string;
  isOpen: boolean;
  deliveryTime: string;
  image: string;
  city: string;
  rating: string;
  isGuard: boolean;
  latitude: number;
  longitude: number;
}

type FilterType = "all" | "open" | "guard" | "nearby";

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<ScrollView>(null);
  const bottomSheetHeight = useRef(
    new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)
  ).current;

  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const pharmacies: Pharmacy[] = [
    {
      id: "1",
      name: "Pharmacie de la Riviera Palmeraie",
      address: "Boulevard Mitterrand, Riviera Palmeraie, Cocody",
      distance: "2.3",
      closingTime: "22:00",
      isOpen: true,
      deliveryTime: "10-20 min",
      image:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&q=80",
      city: "Cocody",
      rating: "4.8",
      isGuard: false,
      latitude: 5.3599,
      longitude: -3.987,
    },
    {
      id: "2",
      name: "Pharmacie du Plateau Indénié",
      address: "Avenue Delafosse, Plateau",
      distance: "4.8",
      closingTime: "20:30",
      isOpen: true,
      deliveryTime: "20-30 min",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
      city: "Plateau",
      rating: "4.6",
      isGuard: true,
      latitude: 5.327,
      longitude: -4.017,
    },
    {
      id: "3",
      name: "Pharmacie de Yopougon Niangon",
      address: "Niangon Sud, Yopougon",
      distance: "7.6",
      closingTime: "21:00",
      isOpen: false,
      deliveryTime: "—",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
      city: "Yopougon",
      rating: "4.3",
      isGuard: false,
      latitude: 5.345,
      longitude: -4.082,
    },
    {
      id: "4",
      name: "Pharmacie d'Angré Château",
      address: "Angré 8e Tranche, Cocody",
      distance: "3.1",
      closingTime: "23:00",
      isOpen: true,
      deliveryTime: "5-15 min",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
      city: "Cocody",
      rating: "4.9",
      isGuard: false,
      latitude: 5.375,
      longitude: -3.975,
    },
    {
      id: "5",
      name: "Pharmacie du Marché de Treichville",
      address: "Avenue 21, Treichville",
      distance: "6.9",
      closingTime: "20:00",
      isOpen: true,
      deliveryTime: "15-25 min",
      image:
        "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=400&q=80",
      city: "Treichville",
      rating: "4.5",
      isGuard: true,
      latitude: 5.308,
      longitude: -4.005,
    },
    {
      id: "6",
      name: "Pharmacie de Marcory Zone 4",
      address: "Zone 4C, Marcory",
      distance: "5.4",
      closingTime: "22:30",
      isOpen: true,
      deliveryTime: "15-30 min",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
      city: "Marcory",
      rating: "4.7",
      isGuard: false,
      latitude: 5.295,
      longitude: -3.992,
    },
  ];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = isExpanded
          ? BOTTOM_SHEET_MAX_HEIGHT - gestureState.dy
          : BOTTOM_SHEET_MIN_HEIGHT - gestureState.dy;

        if (
          newHeight >= BOTTOM_SHEET_MIN_HEIGHT &&
          newHeight <= BOTTOM_SHEET_MAX_HEIGHT
        ) {
          bottomSheetHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          expandBottomSheet();
        } else if (gestureState.dy > 50) {
          collapseBottomSheet();
        } else {
          Animated.spring(bottomSheetHeight, {
            toValue: isExpanded
              ? BOTTOM_SHEET_MAX_HEIGHT
              : BOTTOM_SHEET_MIN_HEIGHT,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const expandBottomSheet = () => {
    setIsExpanded(true);
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  };

  const collapseBottomSheet = () => {
    setIsExpanded(false);
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MIN_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  };

  const getFilteredPharmacies = () => {
    switch (filterType) {
      case "open":
        return pharmacies.filter((p) => p.isOpen);
      case "guard":
        return pharmacies.filter((p) => p.isGuard);
      case "nearby":
        return pharmacies.filter((p) => parseFloat(p.distance) < 5);
      default:
        return pharmacies;
    }
  };

  const filteredPharmacies = getFilteredPharmacies();

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (filteredPharmacies.length > 0 && mapRef.current) {
      setTimeout(() => {
        showAllPharmacies();
      }, 300);
    }
  }, [filterType]);

  const getUserLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setUserLocation({
          latitude: 5.3364,
          longitude: -4.0267,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        });
      } else {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        });
      }
    } catch (error) {
      console.error("Erreur de localisation:", error);
      setUserLocation({
        latitude: 5.3364,
        longitude: -4.0267,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      });
    } finally {
      setLoading(false);
    }
  };

  const focusOnPharmacy = (pharmacy: Pharmacy, index: number) => {
    setActiveCardIndex(index);

    mapRef.current?.animateToRegion(
      {
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500
    );

    if (!isExpanded) {
      collapseBottomSheet();
    }
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 500);
    }
  };

  const showAllPharmacies = () => {
    if (mapRef.current && filteredPharmacies.length > 0) {
      const coordinates = filteredPharmacies.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 150,
          right: 50,
          bottom: isExpanded ? 600 : 300,
          left: 50,
        },
        animated: true,
      });
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilterType(newFilter);
    setActiveCardIndex(0);
  };

  const handleViewDetails = (pharmacy: Pharmacy) => {
    // Navigue vers la page des détails de la pharmacie
    router.push({
      pathname: "/pharmacy/[id]",
      params: {
        id: pharmacy.id,
        name: pharmacy.name,
        address: pharmacy.address,
        distance: pharmacy.distance,
        closingTime: pharmacy.closingTime,
        isOpen: pharmacy.isOpen,
        deliveryTime: pharmacy.deliveryTime,
        image: pharmacy.image,
        city: pharmacy.city,
        rating: pharmacy.rating,
        isGuard: pharmacy.isGuard,
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A8E8" />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {userLocation && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={userLocation}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          rotateEnabled={true}
        >
          {filteredPharmacies.map((pharmacy, index) => (
            <Marker
              key={pharmacy.id}
              coordinate={{
                latitude: pharmacy.latitude,
                longitude: pharmacy.longitude,
              }}
              onPress={() => focusOnPharmacy(pharmacy, index)}
            >
              <View style={styles.markerWrapper}>
                <LinearGradient
                  colors={
                    pharmacy.isGuard
                      ? ["#FF9800", "#F57C00"]
                      : pharmacy.isOpen
                      ? ["#00A8E8", "#0288D1"]
                      : ["#BDBDBD", "#9E9E9E"]
                  }
                  style={[
                    styles.marker,
                    index === activeCardIndex && styles.markerActive,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={pharmacy.isGuard ? "shield-checkmark" : "medkit"}
                    size={20}
                    color="white"
                  />
                </LinearGradient>
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#00A8E8" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Carte des pharmacies</Text>
            <Text style={styles.headerSubtitle}>
              {filteredPharmacies.length}{" "}
              {filteredPharmacies.length > 1 ? "trouvées" : "trouvée"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.listButton}
            onPress={centerOnUser}
            activeOpacity={0.8}
          >
            <Ionicons name="locate" size={24} color="#00A8E8" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Animated.View
        style={[styles.bottomSheet, { height: bottomSheetHeight }]}
      >
        <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.bottomSheetHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.bottomSheetTitle}>Pharmacies disponibles</Text>
            {/* Bouton d'expansion/réduction 
            <TouchableOpacity
              onPress={() =>
                isExpanded ? collapseBottomSheet() : expandBottomSheet()
              }
              style={styles.expandButton}
            >
              <Ionicons
                name={isExpanded ? "chevron-down" : "chevron-up"}
                size={24}
                color="#00A8E8"
              />
            </TouchableOpacity> */}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "all" && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange("all")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="apps"
                size={16}
                color={filterType === "all" ? "white" : "#00A8E8"}
              />
              <Text
                style={[
                  styles.filterText,
                  filterType === "all" && styles.filterTextActive,
                ]}
              >
                Toutes ({pharmacies.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "open" && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange("open")}
              activeOpacity={0.7}
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
                Ouvertes ({pharmacies.filter((p) => p.isOpen).length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "guard" && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange("guard")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={filterType === "guard" ? "white" : "#FF9800"}
              />
              <Text
                style={[
                  styles.filterText,
                  filterType === "guard" && styles.filterTextActive,
                ]}
              >
                De garde ({pharmacies.filter((p) => p.isGuard).length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === "nearby" && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange("nearby")}
              activeOpacity={0.7}
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
                À proximité (
                {pharmacies.filter((p) => parseFloat(p.distance) < 5).length})
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {filteredPharmacies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>Aucune pharmacie trouvée</Text>
            <Text style={styles.emptySubtext}>Essayez un autre filtre</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.pharmaciesScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pharmaciesGrid}
          >
            {filteredPharmacies.map((pharmacy, index) => (
              <TouchableOpacity
                key={pharmacy.id}
                style={[
                  styles.pharmacyCard,
                  index === activeCardIndex && styles.pharmacyCardActive,
                ]}
                activeOpacity={0.9}
                onPress={() => focusOnPharmacy(pharmacy, index)}
              >
                <Image
                  source={{ uri: pharmacy.image }}
                  style={styles.pharmacyImage}
                  resizeMode="cover"
                />

                {pharmacy.isGuard && (
                  <View style={styles.guardBadgeTop}>
                    <Ionicons name="shield-checkmark" size={12} color="white" />
                    <Text style={styles.guardBadgeTopText}>GARDE</Text>
                  </View>
                )}

                <View style={styles.cardContent}>
                  <Text style={styles.pharmacyName} numberOfLines={2}>
                    {pharmacy.name}
                  </Text>

                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{pharmacy.rating}</Text>
                  </View>

                  <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={12} color="#666" />
                    <Text style={styles.pharmacyAddress} numberOfLines={1}>
                      {pharmacy.city}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.statusBadge}>
                      <View
                        style={[
                          styles.statusDot,
                          pharmacy.isOpen
                            ? styles.statusOpen
                            : styles.statusClosed,
                        ]}
                      />
                      <Text style={styles.statusText}>
                        {pharmacy.isOpen ? pharmacy.closingTime : "Fermée"}
                      </Text>
                    </View>

                    <View style={styles.distanceBadge}>
                      <Ionicons name="navigate" size={12} color="#00A8E8" />
                      <Text style={styles.distanceText}>
                        {pharmacy.distance} km
                      </Text>
                    </View>
                  </View>

                  {/* Bouton détails */}
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleViewDetails(pharmacy)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.detailsButtonText}>
                      Voir les détails
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#00A8E8" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#00A8E8",
    fontWeight: "600",
  },
  headerSafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: Platform.OS === "ios" ? 8 : StatusBar.currentHeight,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A237E",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  listButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  markerActive: {
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  controlsContainer: {
    position: "absolute",
    right: 16,
    top: Platform.OS === "ios" ? 120 : 140,
    gap: 12,
    zIndex: 999,
    paddingTop: 18,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  dragHandleArea: {
    paddingVertical: 12,
    alignItems: "center",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  bottomSheetHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A237E",
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  filtersScroll: {
    marginHorizontal: -16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipActive: {
    backgroundColor: "#00A8E8",
    borderColor: "#00A8E8",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "white",
  },
  pharmaciesScrollView: {
    flex: 1,
  },
  pharmaciesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    gap: 16,
  },
  pharmacyCard: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pharmacyCardActive: {
    borderColor: "#00A8E8",
    shadowColor: "#00A8E8",
    shadowOpacity: 0.3,
  },
  pharmacyImage: {
    width: "100%",
    height: 100,
  },
  guardBadgeTop: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FF9800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guardBadgeTopText: {
    fontSize: 9,
    fontWeight: "800",
    color: "white",
  },
  cardContent: {
    padding: 12,
  },
  pharmacyName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A237E",
    marginBottom: 6,
    minHeight: 32,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  pharmacyAddress: {
    fontSize: 11,
    color: "#666",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusOpen: {
    backgroundColor: "#4CAF50",
  },
  statusClosed: {
    backgroundColor: "#F44336",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666",
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#00A8E8",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00A8E8",
    marginTop: 4,
  },
  detailsButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#00A8E8",
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
});
