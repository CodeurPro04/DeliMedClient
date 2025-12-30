import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SearchBar } from "@/components/ui/SearchBar";

const pharmaciesData = {
  "1": {
    id: "1",
    name: "Pharmacie de la Riviera Palmeraie",
    address: "Boulevard Mitterrand, Riviera Palmeraie, Cocody, Abidjan",
    city: "Cocody",
    distance: "2.3 km",
    closingTime: "22:00",
    isOpen: true,
    deliveryTime: "10-20 min",
    phone: "+225 01 23 45 67 89",
    reviews : 4.5,
    image:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80",
  },
  "2": {
    id: "2",
    name: "Pharmacie du Plateau Indénié",
    address: "Avenue Delafosse, Plateau, Abidjan",
    city: "Plateau",
    distance: "4.8 km",
    closingTime: "20:30",
    isOpen: true,
    deliveryTime: "20-30 min",
    phone: "+225 01 23 45 67 89",
    reviews : 4.5,
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
  },
  "3": {
    id: "3",
    name: "Pharmacie de Yopougon Niangon",
    address: "Niangon Sud, Yopougon, Abidjan",
    city: "Yopougon",
    distance: "7.6 km",
    closingTime: "21:00",
    isOpen: false,
    deliveryTime: "—",
    phone: "+225 01 23 45 67 89",
    reviews : 4.0,
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
  },
  "4": {
    id: "4",
    name: "Pharmacie d’Angré Château",
    address: "Angré 8e Tranche, Cocody, Abidjan",
    city: "Cocody",
    distance: "3.1 km",
    closingTime: "23:00",
    isOpen: true,
    deliveryTime: "5-15 min",
    phone: "+225 01 23 45 67 89",
    reviews : 4.8,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
  },
  "5": {
    id: "5",
    name: "Pharmacie du Marché de Treichville",
    address: "Avenue 21, Treichville, Abidjan",
    city: "Treichville",
    distance: "6.9 km",
    closingTime: "20:00",
    isOpen: true,
    deliveryTime: "15-25 min",
    phone: "+225 01 23 45 67 89",
    reviews : 4.2,
    image:
      "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=800&q=80",
  },
  "6":{
      id: "6",
      name: "Pharmacie de Marcory Zone 4",
      address: "Zone 4C, Marcory, Abidjan",
      city: "Marcory",
      distance: "5.4 km",
      closingTime: "22:30",
      isOpen: true,
      deliveryTime: "15-30 min",
      phone: "+225 01 23 45 67 89",
      reviews : 4.2,
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
  },
};

export default function PharmacyDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<any>(null);

  // Récupere l'ID depuis l'URL
  const pharmacyId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    // Simulation d'une requête API
    setTimeout(() => {
      const foundPharmacy =
        pharmaciesData[pharmacyId as keyof typeof pharmaciesData] ||
        pharmaciesData["1"];
      setPharmacy(foundPharmacy);
      setLoading(false);
    }, 500);
  }, [pharmacyId]);

  // Catégories de produits sans ordonnance
  const productCategories = [
    {
      id: "1",
      name: "Appareil digestif",
      icon: "medical-outline",
      color: "#4CAF50",
    },
    { id: "2", name: "Dermatologie", icon: "body-outline", color: "#2196F3" },
    {
      id: "3",
      name: "Douleurs",
      icon: "fitness-outline",
      color: "#FF9800",
    },
    { id: "4", name: "Soins des yeux", icon: "eye-outline", color: "#9C27B0" },
    { id: "5", name: "Santé ORL", icon: "ear-outline", color: "#00BCD4" },
    
    { id: "7", name: "Soins bébé", icon: "happy-outline", color: "#FF4081" },
    {
      id: "8",
      name: "Hygiène bucco-dentaire",
      icon: "sparkles-outline",
      color: "#795548",
    },
    {
      id: "6",
      name: "Premiers secours",
      icon: "medkit-outline",
      color: "#F44336",
    },
  ];

  // Produits populaires
  const popularProducts = [
    {
      id: "1",
      name: "Paracétamol 500mg",
      category: "Douleurs",
      price: "2,000 FCFA",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "2",
      name: "Vitamine C 1000mg",
      category: "Immunité",
      price: "2,500 FCFA",
      image:
        "https://images.unsplash.com/photo-1550572017-4e6c5b0c3b3c?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "3",
      name: "Gel hydroalcoolique",
      category: "Hygiène",
      price: "700 FCFA",
      image:
        "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "4",
      name: "Masques FFP2",
      category: "Protection",
      price: "12,900 FCFA",
      image:
        "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
      stock: "Stock limité",
    },
    {
      id: "5",
      name: "Doliprane 1000mg",
      category: "Douleurs",
      price: "3,200 FCFA",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "6",
      name: "Crème hydratante Nivea",
      category: "Dermatologie",
      price: "2,500 FCFA",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "7",
      name: "Spray nasal",
      category: "ORL",
      price: "5,800 FCFA",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "8",
      name: "Compresses stériles",
      category: "Premiers secours",
      price: "2,500 FCFA",
      image:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "9",
      name: "Thermomètre digital",
      category: "Matériel médical",
      price: "2,500 FCFA",
      image:
        "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "10",
      name: "Collyre yeux secs",
      category: "Ophtalmologie",
      price: "7,500 FCFA",
      image:
        "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "11",
      name: "Pansements assortis",
      category: "Premiers secours",
      price: "2,500 FCFA",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
      stock: "En stock",
    },
    {
      id: "12",
      name: "Spray gorge irritée",
      category: "ORL",
      price: "6,200 FCFA",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
      stock: "Stock limité",
    },
  ];

  const handleAddPrescription = () => {
    setPrescriptionModalVisible(true);
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleOrder = () => {
    if (selectedProducts.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des produits avant de commander");
      return;
    }
    router.push({
      pathname: "/cart",
      params: { pharmacyId: pharmacy.id, products: selectedProducts.join(",") },
    });
  };

  if (loading || !pharmacy) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#00A8E8" />
          <Text style={styles.loadingText}>Chargement de la pharmacie...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />

      {/* Header*/}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {pharmacy.name}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="share-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image de la pharmacie */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: pharmacy.image }}
            style={styles.pharmacyImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          <View style={styles.pharmacyInfoOverlay}>
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
            <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>

            <View style={styles.pharmacyStats}>
              <View style={styles.statItem}>
                <Ionicons name="location" size={16} color="white" />
                <Text style={styles.statText}>{pharmacy.distance}</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="white" />
                <Text style={styles.statText}>
                  Ferme à {pharmacy.closingTime}
                </Text>
              </View>

              <TouchableOpacity style={styles.statItem}>
                <Ionicons name="call-outline" size={16} color="white" />
                <Text style={styles.statText}>{pharmacy.phone}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>
                {pharmacy.rating} ({pharmacy.reviews} avis)
              </Text>
            </View>
          </View>
        </View>

        {/* Section Ordonnance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Une ordonnance ?</Text>
          <Text style={styles.sectionDescription}>
            Ajoutez votre ordonnance au format PDF ou photo. Le pharmacien va
            préparer votre commande. Vous n'avez pas besoin de sélectionner le
            contenu de votre ordonnance depuis le catalogue des produits.
          </Text>

          <TouchableOpacity
            style={styles.addPrescriptionButton}
            onPress={handleAddPrescription}
            activeOpacity={0.8}
          >
            <View style={styles.addButtonContent}>
              <Ionicons name="add-circle-outline" size={24} color="#00A8E8" />
              <Text style={styles.addButtonText}>Ajouter une ordonnance</Text>
            </View>
            <Text style={styles.addButtonSubtext}>
              PDF, JPG, PNG jusqu'à 5MB
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Recherche de produits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rechercher un produit</Text>

          <View style={styles.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Nom du produit, marque, catégorie..."
              showBarcode={true}
              onBarcodeScanned={(barcode) => {
                console.log("Code-barres scanné:", barcode);
                setSearchQuery(barcode);
              }}
            />
          </View>
        </View>

        {/* Section Produits sans ordonnance */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Ajouter des produits sans ordonnance
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <View style={styles.categoriesContainer}>
              {productCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/all-products`)}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: `${category.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={category.icon}
                      size={24}
                      color={category.color}
                    />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Section Médicaments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Médicaments</Text>
              <Text style={styles.sectionSubtitle}>
                {popularProducts.length} produits disponibles
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() =>
                router.push({
                  pathname: "/all-products",
                  params: { pharmacyId: pharmacy.id },
                })
              }
            >
              <Text style={styles.viewAllText}>Tout voir</Text>
              <Ionicons name="arrow-forward" size={16} color="#00A8E8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScroll}
            snapToInterval={180}
            decelerationRate="fast"
          >
            {popularProducts.map((product, index) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  selectedProducts.includes(product.id) &&
                    styles.productCardSelected,
                  { marginLeft: index === 0 ? 0 : 12 },
                ]}
                onPress={() => handleSelectProduct(product.id)}
                activeOpacity={0.9}
              >
                {/* Image*/}
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />

                  {/* Overlay*/}
                  <View style={styles.imageOverlayGradient} />

                  {/* Badge de stock*/}
                  <View
                    style={[
                      styles.stockBadge,
                      product.stock === "Stock limité" &&
                        styles.stockBadgeLimited,
                    ]}
                  >
                    <Ionicons
                      name={
                        product.stock === "Stock limité"
                          ? "warning"
                          : "checkmark-circle"
                      }
                      size={12}
                      color="white"
                    />
                    <Text style={styles.stockText}>{product.stock}</Text>
                  </View>

                  {/* Checkbox*/}
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        selectedProducts.includes(product.id) &&
                          styles.checkboxSelected,
                      ]}
                    >
                      {selectedProducts.includes(product.id) ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="#00A8E8"
                        />
                      ) : (
                        <Ionicons
                          name="ellipse-outline"
                          size={24}
                          color="rgba(255,255,255,0.8)"
                        />
                      )}
                    </View>
                  </View>
                </View>

                {/* Informations du produit */}
                <View style={styles.productInfo}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{product.category}</Text>
                  </View>

                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>

                  <View style={styles.productFooter}>
                    <View>
                      <Text style={styles.priceLabel}>Prix</Text>
                      <Text style={styles.productPrice}>{product.price}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.addButton,
                        selectedProducts.includes(product.id) &&
                          styles.addButtonSelected,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleSelectProduct(product.id);
                      }}
                    >
                      <Ionicons
                        name={
                          selectedProducts.includes(product.id)
                            ? "checkmark"
                            : "add"
                        }
                        size={20}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Effet de sélection*/}
                {selectedProducts.includes(product.id) && (
                  <View style={styles.selectionGlow} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton Commander */}
      {selectedProducts.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleOrder}
            activeOpacity={0.8}
          >
            <View style={styles.cartIndicator}>
              <Text style={styles.cartCount}>{selectedProducts.length}</Text>
            </View>
            <Text style={styles.floatingButtonText}>Commander</Text>
            <Text style={styles.deliveryTime}>
              Livraison: {pharmacy.deliveryTime}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal pour ajouter une ordonnance */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={prescriptionModalVisible}
        onRequestClose={() => setPrescriptionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter une ordonnance</Text>
              <TouchableOpacity
                onPress={() => setPrescriptionModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptions}>
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="camera" size={32} color="#00A8E8" />
                <Text style={styles.modalOptionText}>Prendre une photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="images" size={32} color="#00A8E8" />
                <Text style={styles.modalOptionText}>
                  Choisir depuis la galerie
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="document" size={32} color="#00A8E8" />
                <Text style={styles.modalOptionText}>Importer un PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#00A8E8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 70,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    flex: 1,
    marginHorizontal: 12,
    textAlign: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  pharmacyImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  pharmacyInfoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
  },
  pharmacyName: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
  },
  pharmacyStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: "white",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "white",
    fontWeight: "500",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#00A8E8",
    fontWeight: "600",
  },
  addPrescriptionButton: {
    borderWidth: 2,
    borderColor: "#00A8E8",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: "#00A8E8",
    fontWeight: "600",
  },
  addButtonSubtext: {
    fontSize: 12,
    color: "#999",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  categoriesScroll: {
    marginHorizontal: -20,
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  categoryCard: {
    width: 100,
    marginRight: 16,
    alignItems: "center",
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  productCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00A8E8",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: "#00A8E8",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartIndicator: {
    position: "absolute",
    top: -8,
    left: -8,
    backgroundColor: "#E91E63",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  cartCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  floatingButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginHorizontal: 12,
  },
  deliveryTime: {
    position: "absolute",
    top: -20,
    fontSize: 12,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  modalOptions: {
    gap: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  searchWrapper: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  productCardSelected: {
    borderColor: "#00A8E8",
    shadowColor: "#00A8E8",
    shadowOpacity: 0.3,
    elevation: 6,
  },
  productImageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  imageOverlayGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  checkboxContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  stockBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  stockBadgeLimited: {
    backgroundColor: "rgba(255, 152, 0, 0.9)",
  },
  stockText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productInfo: {
    padding: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addToCartIcon: {
    padding: 4,
  },
  section: {
    backgroundColor: "transparent",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    paddingBottom: 6,
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#00A8E8",
  },
  productsScroll: {
    paddingRight: 20,
  },
  productCard: {
    width: 160,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "white",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F4FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00A8E8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 10,
    color: "#999",
    marginBottom: 2,
    fontWeight: "600",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00A8E8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonSelected: {
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
  },
  selectionGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#00A8E8",
    opacity: 0.2,
  },
});
