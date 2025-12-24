import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  RefreshControl,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SearchBar } from "@/components/ui/SearchBar";

export default function AllProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pharmacyId = Array.isArray(params.pharmacyId)
    ? params.pharmacyId[0]
    : params.pharmacyId;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Options de tri
  const sortOptions = [
    { id: "default", name: "Par défaut", icon: "apps-outline" },
    { id: "price-asc", name: "Prix croissant", icon: "arrow-up-outline" },
    { id: "price-desc", name: "Prix décroissant", icon: "arrow-down-outline" },
    { id: "name", name: "Nom A-Z", icon: "text-outline" },
  ];

  // Options de stock
  const stockOptions = [
    { id: "all", name: "Tous les produits" },
    { id: "in-stock", name: "En stock uniquement" },
    { id: "limited", name: "Stock limité" },
  ];

  // Catégories de filtrage
  const categories = [
    { id: "all", name: "Tous", icon: "apps-outline" },
    { id: "douleurs", name: "Douleurs", icon: "fitness-outline" },
    { id: "immunite", name: "Immunité", icon: "shield-outline" },
    { id: "hygiene", name: "Hygiène", icon: "water-outline" },
    { id: "protection", name: "Protection", icon: "medkit-outline" },
    { id: "dermato", name: "Dermatologie", icon: "body-outline" },
    { id: "orl", name: "ORL", icon: "ear-outline" },
    { id: "secours", name: "Premiers secours", icon: "bandage-outline" },
  ];

  // Liste complète des médicaments
  const allProducts = [
    {
      id: "1",
      name: "Paracétamol 500mg",
      category: "Douleurs",
      categoryId: "douleurs",
      price: "2,000 FCFA",
      priceValue: 2000,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
      stock: "En stock",
      description: "Antalgique et antipyrétique",
    },
    {
      id: "2",
      name: "Vitamine C 1000mg",
      category: "Immunité",
      categoryId: "immunite",
      price: "2,500 FCFA",
      priceValue: 2500,
      image:
        "https://images.unsplash.com/photo-1550572017-4e6c5b0c3b3c?w=400&q=80",
      stock: "En stock",
      description: "Renforce le système immunitaire",
    },
    {
      id: "3",
      name: "Gel hydroalcoolique",
      category: "Hygiène",
      categoryId: "hygiene",
      price: "700 FCFA",
      priceValue: 700,
      image:
        "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&q=80",
      stock: "En stock",
      description: "Désinfectant mains 500ml",
    },
    {
      id: "4",
      name: "Masques FFP2",
      category: "Protection",
      categoryId: "protection",
      price: "12,900 FCFA",
      priceValue: 12900,
      image:
        "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
      stock: "Stock limité",
      description: "Boîte de 50 masques",
    },
    {
      id: "5",
      name: "Doliprane 1000mg",
      category: "Douleurs",
      categoryId: "douleurs",
      price: "3,200 FCFA",
      priceValue: 3200,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
      stock: "En stock",
      description: "Antalgique puissant",
    },
    {
      id: "6",
      name: "Crème hydratante Nivea",
      category: "Dermatologie",
      categoryId: "dermato",
      price: "2,500 FCFA",
      priceValue: 2500,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
      stock: "En stock",
      description: "Soin hydratant visage et corps",
    },
    {
      id: "7",
      name: "Spray nasal",
      category: "ORL",
      categoryId: "orl",
      price: "5,800 FCFA",
      priceValue: 5800,
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
      stock: "En stock",
      description: "Décongestion nasale",
    },
    {
      id: "8",
      name: "Compresses stériles",
      category: "Premiers secours",
      categoryId: "secours",
      price: "2,500 FCFA",
      priceValue: 2500,
      image:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400&q=80",
      stock: "En stock",
      description: "Boîte de 50 compresses",
    },
    {
      id: "9",
      name: "Thermomètre digital",
      category: "Premiers secours",
      categoryId: "secours",
      price: "2,500 FCFA",
      priceValue: 2500,
      image:
        "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80",
      stock: "En stock",
      description: "Mesure précise en 10 secondes",
    },
    {
      id: "10",
      name: "Collyre yeux secs",
      category: "ORL",
      categoryId: "orl",
      price: "7,500 FCFA",
      priceValue: 7500,
      image:
        "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=400&q=80",
      stock: "En stock",
      description: "Hydratation oculaire",
    },
    {
      id: "11",
      name: "Pansements assortis",
      category: "Premiers secours",
      categoryId: "secours",
      price: "2,500 FCFA",
      priceValue: 2500,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
      stock: "En stock",
      description: "Différentes tailles",
    },
    {
      id: "12",
      name: "Spray gorge irritée",
      category: "ORL",
      categoryId: "orl",
      price: "6,200 FCFA",
      priceValue: 6200,
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
      stock: "Stock limité",
      description: "Effet apaisant immédiat",
    },
    {
      id: "13",
      name: "Ibuprofène 400mg",
      category: "Douleurs",
      categoryId: "douleurs",
      price: "3,500 FCFA",
      priceValue: 3500,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
      stock: "En stock",
      description: "Anti-inflammatoire",
    },
    {
      id: "14",
      name: "Sérum physiologique",
      category: "Hygiène",
      categoryId: "hygiene",
      price: "1,500 FCFA",
      priceValue: 1500,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
      stock: "En stock",
      description: "Boîte de 40 unidoses",
    },
    {
      id: "15",
      name: "Crème cicatrisante",
      category: "Dermatologie",
      categoryId: "dermato",
      price: "4,200 FCFA",
      priceValue: 4200,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
      stock: "En stock",
      description: "Réparation cutanée",
    },
    {
      id: "16",
      name: "Vitamine D3",
      category: "Immunité",
      categoryId: "immunite",
      price: "3,800 FCFA",
      priceValue: 3800,
      image:
        "https://images.unsplash.com/photo-1550572017-4e6c5b0c3b3c?w=400&q=80",
      stock: "En stock",
      description: "Renforce les os",
    },
  ];

  // Filtrage et tri des produits
  const getFilteredAndSortedProducts = () => {
    let products = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stock === "En stock") ||
        (stockFilter === "limited" && product.stock === "Stock limité");
      return matchesSearch && matchesCategory && matchesStock;
    });

    // Tri
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-desc":
        products.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return products;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleOrder = () => {
    if (selectedProducts.length === 0) return;
    router.push({
      pathname: "/cart",
      params: { pharmacyId, products: selectedProducts.join(",") },
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("default");
    setStockFilter("all");
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />

      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Tous les médicaments</Text>
            <Text style={styles.headerSubtitle}>
              {filteredProducts.length} produits disponibles
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter-outline" size={22} color="white" />
            {(selectedCategory !== "all" ||
              sortBy !== "default" ||
              stockFilter !== "all") && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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
        {/* Barre de recherche */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un médicament..."
            showBarcode={true}
            onBarcodeScanned={(barcode) => setSearchQuery(barcode)}
          />
        </View>

        {/* Filtres par catégorie */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={selectedCategory === category.id ? "white" : "#00A8E8"}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Grille de produits */}
        <View style={styles.productsSection}>
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  selectedProducts.includes(product.id) &&
                    styles.productCardSelected,
                ]}
                onPress={() => handleSelectProduct(product.id)}
                activeOpacity={0.9}
              >
                {/* Image */}
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />

                  <View style={styles.imageOverlayGradient} />

                  {/* Badge de stock */}
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

                  {/* Checkbox */}
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

                  <Text style={styles.productDescription} numberOfLines={1}>
                    {product.description}
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

                {/* Effet de sélection */}
                {selectedProducts.includes(product.id) && (
                  <View style={styles.selectionGlow} />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de filtres */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres et tri</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Tri */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Trier par</Text>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.filterOption}
                    onPress={() => setSortBy(option.id)}
                  >
                    <View style={styles.filterOptionLeft}>
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color="#00A8E8"
                      />
                      <Text style={styles.filterOptionText}>{option.name}</Text>
                    </View>
                    {sortBy === option.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#00A8E8"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Disponibilité */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Disponibilité</Text>
                {stockOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.filterOption}
                    onPress={() => setStockFilter(option.id)}
                  >
                    <Text style={styles.filterOptionText}>{option.name}</Text>
                    {stockFilter === option.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#00A8E8"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Boutons d'action */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Réinitialiser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A8E8",
  },
  headerSafeArea: {
    backgroundColor: "#00A8E8",
  },
  header: {
    backgroundColor: "#00A8E8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E91E63",
    borderWidth: 1,
    borderColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  searchSection: {
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoriesSection: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#00A8E8",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#00A8E8",
  },
  categoryChipTextActive: {
    color: "white",
  },
  productsSection: {
    padding: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  productCardSelected: {
    borderColor: "#00A8E8",
    shadowColor: "#00A8E8",
    shadowOpacity: 0.3,
    elevation: 6,
  },
  productImageContainer: {
    width: "100%",
    height: 140,
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
  stockBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stockBadgeLimited: {
    backgroundColor: "rgba(255, 152, 0, 0.9)",
  },
  stockText: {
    fontSize: 9,
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
  },
  checkboxContainer: {
    position: "absolute",
    top: 8,
    right: 8,
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
  productInfo: {
    padding: 12,
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
    fontSize: 9,
    fontWeight: "700",
    color: "#00A8E8",
    textTransform: "uppercase",
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    lineHeight: 18,
  },
  productDescription: {
    fontSize: 11,
    color: "#999",
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 9,
    color: "#999",
    marginBottom: 2,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00A8E8",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#00A8E8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#00A8E8",
    opacity: 0.2,
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
    gap: 12,
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
  },
  // Styles du modal de filtres
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  filterOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterOptionText: {
    fontSize: 15,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#00A8E8",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});