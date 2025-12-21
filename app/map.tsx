import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Image,
  ScrollView,
  Animated,
  Platform,
  Easing,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");
const SPACING = 16;
const CARD_WIDTH = width - SPACING * 2;
const CARD_HEIGHT = 140;

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

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  // Données fictives des pharmacies
  const pharmacies: Pharmacy[] = [
    {
      id: "1",
      name: "Pharmacie de la Riviera Palmeraie",
      address: "Boulevard Mitterrand, Riviera Palmeraie, Cocody",
      distance: "2.3 km",
      closingTime: "22:00",
      isOpen: true,
      deliveryTime: "10-20 min",
      image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&q=80",
      city: "Cocody",
      rating: "4.8",
      isGuard: false,
      latitude: 5.3599,
      longitude: -3.9870,
    },
    {
      id: "2",
      name: "Pharmacie du Plateau Indénié",
      address: "Avenue Delafosse, Plateau",
      distance: "4.8 km",
      closingTime: "20:30",
      isOpen: true,
      deliveryTime: "20-30 min",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
      city: "Plateau",
      rating: "4.6",
      isGuard: true,
      latitude: 5.3270,
      longitude: -4.0170,
    },
    {
      id: "3",
      name: "Pharmacie de Yopougon Niangon",
      address: "Niangon Sud, Yopougon",
      distance: "7.6 km",
      closingTime: "21:00",
      isOpen: false,
      deliveryTime: "30-80 min",
      image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
      city: "Yopougon",
      rating: "4.3",
      isGuard: false,
      latitude: 5.3450,
      longitude: -4.0820,
    },
    {
      id: "4",
      name: "Pharmacie d'Angré Château",
      address: "Angré 8e Tranche, Cocody",
      distance: "3.1 km",
      closingTime: "23:00",
      isOpen: true,
      deliveryTime: "5-15 min",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
      city: "Cocody",
      rating: "4.9",
      isGuard: false,
      latitude: 5.3750,
      longitude: -3.9750,
    },
    {
      id: "5",
      name: "Pharmacie du Marché de Treichville",
      address: "Avenue 21, Treichville",
      distance: "6.9 km",
      closingTime: "20:00",
      isOpen: true,
      deliveryTime: "15-25 min",
      image: "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=400&q=80",
      city: "Treichville",
      rating: "4.5",
      isGuard: true,
      latitude: 5.3080,
      longitude: -4.0050,
    },
  ];

  useEffect(() => {
    getUserLocation();
    
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        setUserLocation({
          latitude: 5.3364,
          longitude: -4.0267,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        });
      } else {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        });
      }
    } catch (error) {
      console.error("Erreur de localisation:", error);
      setUserLocation({
        latitude: 5.3364,
        longitude: -4.0267,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      });
    } finally {
      setLoading(false);
    }
  };

  const focusOnPharmacy = (pharmacy: Pharmacy) => {
    mapRef.current?.animateToRegion({
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    }, 400);
    setSelectedPharmacy(pharmacy);
  };

  const centerOnUser = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      }, 400);
    }
  };

  const showAllPharmacies = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        pharmacies.map(p => ({
          latitude: p.latitude,
          longitude: p.longitude,
        })),
        {
          edgePadding: { 
            top: Platform.OS === 'ios' ? 140 : 100, 
            right: 40, 
            bottom: 320, 
            left: 40 
          },
          animated: true,
        }
      );
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const getCardAnimation = (index: number) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });

    return { transform: [{ scale }] };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Carte en arrière-plan */}
      {userLocation && !loading ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={userLocation}
          mapType={mapType}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          rotateEnabled={true}
          pitchEnabled={false}
          customMapStyle={[
            {
              "elementType": "geometry",
              "stylers": [{"color": "#f5f5f5"}]
            },
            {
              "elementType": "labels.icon",
              "stylers": [{"visibility": "off"}]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#616161"}]
            },
            {
              "featureType": "poi",
              "stylers": [{"visibility": "off"}]
            },
            {
              "featureType": "transit",
              "stylers": [{"visibility": "off"}]
            },
          ]}
        >
          {/* Markers */}
          {pharmacies.map((pharmacy, index) => (
            <Marker
              key={pharmacy.id}
              coordinate={{
                latitude: pharmacy.latitude,
                longitude: pharmacy.longitude,
              }}
              onPress={() => {
                focusOnPharmacy(pharmacy);
                setActiveIndex(index);
              }}
            >
              <Animated.View style={styles.markerContainer}>
                <LinearGradient
                  colors={
                    pharmacy.isGuard 
                      ? ['#FF4081', '#F50057']
                      : pharmacy.isOpen
                      ? ['#4FC3F7', '#0288D1']
                      : ['#B0BEC5', '#78909C']
                  }
                  style={[
                    styles.marker,
                    index === activeIndex && styles.markerActive
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={pharmacy.isGuard ? "shield" : "medical"}
                    size={18}
                    color="white"
                  />
                </LinearGradient>
                {pharmacy.isGuard && (
                  <View style={styles.guardBadge}>
                    <MaterialIcons name="security" size={8} color="white" />
                  </View>
                )}
              </Animated.View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4FC3F7" />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      )}

      {/* Header avec gestion des encoches */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <BlurView intensity={90} tint="light" style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#0288D1" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Pharmacies à proximité</Text>
              <View style={styles.headerStats}>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={14} color="#0288D1" />
                  <Text style={styles.statText}>Abidjan</Text>
                </View>
                <View style={styles.statDot} />
                <View style={styles.statItem}>
                  <Ionicons name="medical" size={14} color="#0288D1" />
                  <Text style={styles.statText}>{pharmacies.length}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.mapTypeButton}
              onPress={() => setMapType(mapType === "standard" ? "satellite" : "standard")}
            >
              <Ionicons 
                name={mapType === "standard" ? "map" : "earth"} 
                size={20} 
                color="#0288D1" 
              />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Boutons de contrôle */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUser}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4FC3F7', '#0288D1']}
            style={styles.controlButtonInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="locate" size={22} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={showAllPharmacies}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4FC3F7', '#0288D1']}
            style={styles.controlButtonInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="expand" size={22} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Liste des pharmacies en bas */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>Pharmacies disponibles</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={18} color="#0288D1" />
          </TouchableOpacity>
        </View>
        
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pharmaciesList}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {pharmacies.map((pharmacy, index) => (
            <Animated.View
              key={pharmacy.id}
              style={[getCardAnimation(index), styles.cardWrapper]}
            >
              <TouchableOpacity
                style={styles.pharmacyCard}
                activeOpacity={0.9}
                onPress={() => focusOnPharmacy(pharmacy)}
              >
                {/* Image avec badges */}
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: pharmacy.image }}
                    style={styles.pharmacyImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageOverlay}
                  />
                  
                  {/* Badges sur l'image */}
                  <View style={styles.imageBadges}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.ratingText}>{pharmacy.rating}</Text>
                    </View>
                    {pharmacy.isGuard && (
                      <LinearGradient
                        colors={['#FF4081', '#F50057']}
                        style={styles.guardBadgeLarge}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <MaterialIcons name="security" size={12} color="white" />
                        <Text style={styles.guardBadgeText}>GARDE</Text>
                      </LinearGradient>
                    )}
                  </View>
                </View>

                {/* Contenu de la carte */}
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.pharmacyName} numberOfLines={2}>
                      {pharmacy.name}
                    </Text>
                    <View style={styles.cityContainer}>
                      <Ionicons name="pin" size={12} color="#0288D1" />
                      <Text style={styles.cityText}>{pharmacy.city}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.addressContainer}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.pharmacyAddress} numberOfLines={2}>
                      {pharmacy.address}
                    </Text>
                  </View>

                  {/* Informations principales */}
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <View style={[
                        styles.statusIndicator,
                        pharmacy.isOpen ? styles.statusOpen : styles.statusClosed
                      ]}>
                        <Ionicons 
                          name={pharmacy.isOpen ? "checkmark-circle" : "close-circle"} 
                          size={14} 
                          color="white" 
                        />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>Statut</Text>
                        <Text style={styles.infoValue}>
                          {pharmacy.isOpen ? `Ouvert · ${pharmacy.closingTime}` : "Fermé"}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.infoItem}>
                      <View style={styles.deliveryIcon}>
                        <Ionicons name="bicycle" size={16} color="#0288D1" />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>Livraison</Text>
                        <Text style={styles.infoValue}>{pharmacy.deliveryTime}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Footer avec distance et bouton */}
                  <View style={styles.cardFooter}>
                    <View style={styles.distanceBadge}>
                      <Ionicons name="navigate" size={14} color="#0288D1" />
                      <Text style={styles.distanceText}>{pharmacy.distance}</Text>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => router.push(`/pharmacy/${pharmacy.id}`)}
                    >
                      <LinearGradient
                        colors={['#4FC3F7', '#0288D1']}
                        style={styles.detailsButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.detailsButtonText}>Détails</Text>
                        <Ionicons name="arrow-forward" size={16} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.ScrollView>
      </Animated.View>

      {/* Modal de détails */}
      <Modal
        visible={selectedPharmacy !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedPharmacy(null)}
      >
        {selectedPharmacy && (
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setSelectedPharmacy(null)}
            />
            
            <View style={styles.modalContent}>
              {/* Header du modal */}
              <LinearGradient
                colors={['#4FC3F7', '#0288D1']}
                style={styles.modalHeader}
              >
                <View style={styles.modalHeaderContent}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedPharmacy.name}</Text>
                    <View style={styles.modalSubtitle}>
                      <View style={styles.modalRating}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.modalRatingText}>{selectedPharmacy.rating}</Text>
                      </View>
                      <View style={styles.modalCity}>
                        <Ionicons name="pin" size={14} color="white" />
                        <Text style={styles.modalCityText}>{selectedPharmacy.city}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setSelectedPharmacy(null)}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              {/* Body du modal */}
              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                {/* Image */}
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: selectedPharmacy.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.1)']}
                    style={styles.modalImageOverlay}
                  />
                </View>

                {/* Infos détaillées */}
                <View style={styles.modalDetails}>
                  <View style={styles.detailSection}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="information-circle-outline" size={22} color="#0288D1" />
                      <Text style={styles.sectionTitle}>Informations</Text>
                    </View>
                    
                    <View style={styles.detailItems}>
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="location" size={20} color="#4FC3F7" />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Adresse complète</Text>
                          <Text style={styles.detailValue}>{selectedPharmacy.address}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="time" size={20} color="#4FC3F7" />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Horaires d'ouverture</Text>
                          <Text style={styles.detailValue}>
                            {selectedPharmacy.isOpen 
                              ? `Ouvert jusqu'à ${selectedPharmacy.closingTime}` 
                              : "Fermé - Réouvre demain"}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="bicycle" size={20} color="#4FC3F7" />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Service de livraison</Text>
                          <Text style={styles.detailValue}>{selectedPharmacy.deliveryTime}</Text>
                        </View>
                      </View>
                      
                      {selectedPharmacy.isGuard && (
                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            <MaterialIcons name="security" size={20} color="#FF4081" />
                          </View>
                          <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Service de garde</Text>
                            <Text style={styles.detailValue}>Pharmacie de garde - Ouverte 24h/24</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Boutons d'action */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalActionButton}
                      onPress={() => {
                        // Ouvrir l'app de navigation
                        console.log("Ouvrir l'itinéraire vers:", selectedPharmacy.name);
                      }}
                    >
                      <View style={styles.actionButtonIcon}>
                        <Ionicons name="navigate" size={22} color="#0288D1" />
                      </View>
                      <Text style={styles.actionButtonText}>Itinéraire</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalActionButton}
                      onPress={() => {
                        // Ouvrir le téléphone
                        console.log("Appeler la pharmacie");
                      }}
                    >
                      <View style={styles.actionButtonIcon}>
                        <Ionicons name="call" size={22} color="#0288D1" />
                      </View>
                      <Text style={styles.actionButtonText}>Appeler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.primaryActionButton}
                      onPress={() => {
                        setSelectedPharmacy(null);
                        router.push(`/pharmacy/${selectedPharmacy.id}`);
                      }}
                    >
                      <LinearGradient
                        colors={['#FF4081', '#F50057']}
                        style={styles.primaryActionGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="cart" size={22} color="white" />
                        <Text style={styles.primaryActionText}>Commander</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0288D1',
    fontWeight: '500',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    paddingHorizontal: SPACING,
  },
  headerBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0288D1',
  },
  statDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0288D1',
    marginHorizontal: 8,
  },
  mapTypeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  markerActive: {
    transform: [{ scale: 1.15 }],
    shadowColor: '#0288D1',
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  guardBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4081',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  controlsContainer: {
    position: 'absolute',
    right: SPACING,
    bottom: 200,
    gap: 12,
  },
  controlButton: {
    shadowColor: '#0288D1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  controlButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
    maxHeight: height * 0.4,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING,
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A237E',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pharmaciesList: {
    paddingHorizontal: SPACING,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: SPACING,
  },
  pharmacyCard: {
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E8EAF6',
    shadowColor: '#0288D1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImageContainer: {
    width: 120,
    position: 'relative',
  },
  pharmacyImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imageBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  guardBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guardBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'white',
    marginLeft: 2,
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  cardHeader: {
    marginBottom: 8,
  },
  pharmacyName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
    lineHeight: 18,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0288D1',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  pharmacyAddress: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    lineHeight: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOpen: {
    backgroundColor: '#4CAF50',
  },
  statusClosed: {
    backgroundColor: '#F44336',
  },
  deliveryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0288D1',
  },
  detailsButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  detailsButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  modalSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalRatingText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  modalCity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalCityText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
  },
  modalImageContainer: {
    height: 180,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  modalDetails: {
    padding: 24,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A237E',
  },
  detailItems: {
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 195, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
  },
  actionButtonIcon: {
    marginBottom: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0288D1',
  },
  primaryActionButton: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: 'white',
  },
});