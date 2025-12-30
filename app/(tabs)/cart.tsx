import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

// Données de test plus réalistes
const productsCatalog = [
  {
    id: "1",
    name: "Paracétamol 500mg",
    price: 2000,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    category: "Douleurs",
    description: "Boîte de 16 comprimés",
    requiresPrescription: false,
    pharmacyStock: 15,
    categoryId: "douleurs",
    stock: "En stock",
  },
  {
    id: "2",
    name: "Vitamine C 1000mg",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1550572017-4e6c5b0c3b3c?w=400&q=80",
    category: "Vitamines",
    description: "Comprimés effervescents, boîte de 20",
    requiresPrescription: false,
    pharmacyStock: 25,
    categoryId: "immunite",
    stock: "En stock",
  },
  {
    id: "3",
    name: "Gel hydroalcoolique",
    price: 700,
    image:
      "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&q=80",
    category: "Hygiène",
    description: "Flacon 500ml",
    requiresPrescription: false,
    pharmacyStock: 40,
    categoryId: "hygiene",
    stock: "En stock",
  },
  {
    id: "4",
    name: "Masques FFP2",
    price: 12900,
    image:
      "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
    category: "Protection",
    description: "Paquet de 20 masques",
    requiresPrescription: false,
    pharmacyStock: 8,
    categoryId: "protection",
    stock: "Stock limité",
  },
  {
    id: "5",
    name: "Doliprane 1000mg",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
    category: "Douleurs",
    description: "Boîte de 8 comprimés",
    requiresPrescription: false,
    pharmacyStock: 12,
    categoryId: "douleurs",
    stock: "En stock",
  },
  {
    id: "6",
    name: "Crème hydratante Nivea",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    category: "Dermatologie",
    description: "Soin hydratant visage et corps",
    requiresPrescription: false,
    pharmacyStock: 20,
    categoryId: "dermato",
    stock: "En stock",
  },
  {
    id: "7",
    name: "Spray nasal",
    price: 5800,
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
    category: "ORL",
    description: "Décongestion nasale",
    requiresPrescription: false,
    pharmacyStock: 15,
    categoryId: "orl",
    stock: "En stock",
  },
  {
    id: "8",
    name: "Compresses stériles",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400&q=80",
    category: "Premiers secours",
    description: "Boîte de 50 compresses",
    requiresPrescription: false,
    pharmacyStock: 30,
    categoryId: "secours",
    stock: "En stock",
  },
  {
    id: "9",
    name: "Thermomètre digital",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80",
    category: "Matériel médical",
    description: "Thermomètre frontal infrarouge",
    requiresPrescription: false,
    pharmacyStock: 5,
    categoryId: "secours",
    stock: "En stock",
  },
  {
    id: "10",
    name: "Collyre yeux secs",
    price: 7500,
    image:
      "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=400&q=80",
    category: "Ophtalmologie",
    description: "Flacon 10ml",
    requiresPrescription: false,
    pharmacyStock: 18,
    categoryId: "orl",
    stock: "En stock",
  },
  {
    id: "11",
    name: "Pansements assortis",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    category: "Premiers secours",
    description: "Différentes tailles",
    requiresPrescription: false,
    pharmacyStock: 25,
    categoryId: "secours",
    stock: "En stock",
  },
  {
    id: "12",
    name: "Spray gorge irritée",
    price: 6200,
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
    category: "ORL",
    description: "Effet apaisant immédiat",
    requiresPrescription: false,
    pharmacyStock: 7,
    categoryId: "orl",
    stock: "Stock limité",
  },
  {
    id: "13",
    name: "Ibuprofène 400mg",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    category: "Douleurs",
    description: "Anti-inflammatoire",
    requiresPrescription: true,
    pharmacyStock: 10,
    categoryId: "douleurs",
    stock: "En stock",
  },
  {
    id: "14",
    name: "Sérum physiologique",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
    category: "Hygiène",
    description: "Boîte de 40 unidoses",
    requiresPrescription: false,
    pharmacyStock: 35,
    categoryId: "hygiene",
    stock: "En stock",
  },
   {
    id: "15",
    name: "Crème cicatrisante",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    category: "Dermatologie",
    description: "Réparation cutanée",
    requiresPrescription: false,
    pharmacyStock: 12,
    categoryId: "dermato",
    stock: "En stock",
  },
  {
    id: "16",
    name: "Vitamine D3",
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1550572017-4e6c5b0c3b3c?w=400&q=80",
    category: "Vitamines",
    description: "Renforce les os",
    requiresPrescription: false,
    pharmacyStock: 18,
    categoryId: "immunite",
    stock: "En stock",
  }, 
];
 
// Informations de la pharmacie
const pharmaciesData = {
  "1": {
    id: "1",
    name: "Pharmacie de la Riviera Palmeraie",
    address: "Boulevard Mitterrand, Riviera Palmeraie, Cocody, Abidjan",
    deliveryFee: 0,
    deliveryTime: "10-20 min",
    minOrder: 5000,
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80",
    city: "Cocody",
    distance: "2.3 km",
    closingTime: "22:00",
    isOpen: true,
    phone: "+225 27 21 25 30 40",
    rating: 4.5,
    reviews: 128,
  },
  "2": {
    id: "2",
    name: "Pharmacie du Plateau Indénié",
    address: "Avenue Delafosse, Plateau, Abidjan",
    deliveryFee: 0,
    deliveryTime: "20-30 min",
    minOrder: 7000,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    city: "Plateau",
    distance: "4.8 km",
    closingTime: "20:30",
    isOpen: true,
    phone: "+225 27 22 33 44 55",
    rating: 4.2,
    reviews: 89,
  },
  "3": {
    id: "3",
    name: "Pharmacie de Yopougon Niangon",
    address: "Niangon Sud, Yopougon, Abidjan",
    deliveryFee: 0,
    deliveryTime: "30-80 min",
    minOrder: 10000,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    city: "Yopougon",
    distance: "7.6 km",
    closingTime: "21:00",
    isOpen: false,
    phone: "+225 27 33 44 55 66",
    rating: 4.0,
    reviews: 56,
  },
  "4": {
    id: "4",
    name: "Pharmacie d'Angré Château",
    address: "Angré 8e Tranche, Cocody, Abidjan",
    deliveryFee: 0,
    deliveryTime: "5-15 min",
    minOrder: 3000,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    city: "Cocody",
    distance: "3.1 km",
    closingTime: "23:00",
    isOpen: true,
    phone: "+225 27 44 55 66 77",
    rating: 4.8,
    reviews: 203,
  },
  "5": {
    id: "5",
    name: "Pharmacie du Marché de Treichville",
    address: "Avenue 21, Treichville, Abidjan",
    deliveryFee: 0,
    deliveryTime: "15-25 min",
    minOrder: 6000,
    image: "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=800&q=80",
    city: "Treichville",
    distance: "6.9 km",
    closingTime: "20:00",
    isOpen: true,
    phone: "+225 27 55 66 77 88",
    rating: 4.3,
    reviews: 112,
  },
};

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Récupérer l'ID de la pharmacie
  const pharmacyId = Array.isArray(params.pharmacyId)
    ? params.pharmacyId[0]
    : params.pharmacyId || "1";

  const productIds =
    typeof params.products === "string" ? params.products.split(",") : [];

  const initialCart = useMemo(() => {
    return productIds
      .map((id) => {
        const product = productsCatalog.find((p) => p.id === id);
        return product ? { ...product, quantity: 1 } : null;
      })
      .filter((item) => item !== null);
  }, [productIds]);

  const [cartItems, setCartItems] = useState(initialCart);
  const [pharmacy, setPharmacy] = useState(
    pharmaciesData[pharmacyId] || pharmaciesData["1"]
  );

  // Calculer les totaux
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = pharmacy.deliveryFee;
  const total = subtotal + deliveryFee;

  const isMinimumOrderReached = subtotal;
  const hasPrescriptionItems = cartItems.some(
    (item) => item.requiresPrescription
  );

  // Mettre à jour la quantité
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            // Vérifier le stock
            if (newQuantity > item.pharmacyStock) {
              Alert.alert(
                "Stock limité",
                `Seulement ${item.pharmacyStock} unités disponibles en stock`,
                [{ text: "OK" }]
              );
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Supprimer un article
  const removeItem = (id: string) => {
    Alert.alert(
      "Supprimer l'article",
      "Êtes-vous sûr de vouloir retirer cet article de votre panier ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setCartItems((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  // Valider la commande
  const validateOrder = () => {
    if (!isMinimumOrderReached) {
      Alert.alert(
        "Commande minimale non atteinte",
        `Le montant minimum pour cette pharmacie est de ${pharmacy.minOrder.toLocaleString()} FCFA`,
        [{ text: "OK" }]
      );
      return;
    }

    if (hasPrescriptionItems) {
      Alert.alert(
        "Ordonnance requise",
        "Certains produits nécessitent une ordonnance. Souhaitez-vous ajouter une ordonnance maintenant ?",
        [
          { text: "Plus tard", style: "cancel" },
          {
            text: "Ajouter une ordonnance",
            onPress: () => {
              // Naviguer vers l'écran d'ajout d'ordonnance
              router.push("/add-prescription");
            },
          },
          {
            text: "Continuer sans",
            onPress: () => proceedToCheckout(),
          },
        ]
      );
    } else {
      proceedToCheckout();
    }
  };

  const proceedToCheckout = () => {
    const orderItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    router.push({
      pathname: "/order/checkout",
      params: {
        pharmacyId: pharmacy.id,
        items: JSON.stringify(orderItems),
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        total: total.toString(),
      },
    });
  };

  // Panier vide
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />

        {/* Zone bleue pour l'encoché */}
        <View style={styles.statusBarBackground} />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mon panier</Text>
            <View style={styles.headerPlaceholder} />
          </View>
        </SafeAreaView>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color="#DDD" />
          </View>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptyText}>
            Ajoutez des produits depuis une pharmacie pour commencer vos achats
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/pharmacies")}
          >
            <Text style={styles.exploreButtonText}>
              Explorer les pharmacies
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />

      {/* Zone bleue pour l'encoché */}
      <View style={styles.statusBarBackground} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon panier</Text>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Pharmacie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pharmacie sélectionnée</Text>
          <View style={styles.pharmacyCard}>
            <Image
              source={{ uri: pharmacy.image }}
              style={styles.pharmacyImage}
              resizeMode="cover"
            />
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
              <View style={styles.pharmacyDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>{pharmacy.deliveryTime}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="car-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>
                    {pharmacy.deliveryFee.toLocaleString()} FCFA
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section Produits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Vos articles ({cartItems.length})
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editText}>Modifier</Text>
            </TouchableOpacity>
          </View>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              {/* Image produit */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                {item.requiresPrescription && (
                  <View style={styles.prescriptionBadge}>
                    <Ionicons name="document-text" size={10} color="white" />
                  </View>
                )}
              </View>

              {/* Informations produit */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>

                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </Text>
                  {item.pharmacyStock < 5 && (
                    <Text style={styles.lowStock}>
                      Stock limité ({item.pharmacyStock})
                    </Text>
                  )}
                </View>
              </View>

              {/* Contrôles quantité */}
              <View style={styles.quantitySection}>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Ionicons name="remove" size={16} color="white" />
                  </TouchableOpacity>

                  <Text style={styles.quantity}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={[
                      styles.qtyButton,
                      item.quantity >= item.pharmacyStock &&
                        styles.qtyButtonDisabled,
                    ]}
                    onPress={() => updateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.pharmacyStock}
                  >
                    <Ionicons
                      name="add"
                      size={16}
                      color={
                        item.quantity >= item.pharmacyStock ? "#999" : "white"
                      }
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Section Récapitulatif */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>
                {subtotal.toLocaleString()} FCFA
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de livraison</Text>
              <Text style={styles.summaryValue}>
                {deliveryFee.toLocaleString()} FCFA
              </Text>
            </View>

            {!isMinimumOrderReached && (
              <View style={styles.warningRow}>
                <Ionicons name="alert-circle" size={16} color="#FF9800" />
                <Text style={styles.warningText}>
                  Ajoutez {(pharmacy.minOrder - subtotal).toLocaleString()} FCFA
                  pour atteindre le minimum de commande
                </Text>
              </View>
            )}

            <View style={styles.summaryDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>
                {total.toLocaleString()} FCFA
              </Text>
            </View>

            {hasPrescriptionItems && (
              <View style={styles.prescriptionNotice}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="#00A8E8"
                />
                <Text style={styles.prescriptionText}>
                  Ordonnance requise pour certains produits
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer fixe */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.totalContainer}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalPrice}>
              {total.toLocaleString()} FCFA
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.validateButton,
              !isMinimumOrderReached && styles.validateButtonDisabled,
            ]}
            onPress={validateOrder}
            disabled={!isMinimumOrderReached}
          >
            <Text style={styles.validateText}>Valider la commande</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  // Zone bleue pour l'encoché
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 50 : StatusBar.currentHeight,
    backgroundColor: "#00A8E8",
    zIndex: 999,
  },
  safeArea: {
    backgroundColor: "#00A8E8",
    zIndex: 1000,
  },
  header: {
    backgroundColor: "#00A8E8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 0 : 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  headerPlaceholder: {
    width: 40,
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  editText: {
    fontSize: 14,
    color: "#00A8E8",
    fontWeight: "600",
  },
  pharmacyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pharmacyImage: {
    width: "100%",
    height: 120,
  },
  pharmacyInfo: {
    padding: 16,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  pharmacyDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  prescriptionBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "#00A8E8",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#00A8E8",
  },
  lowStock: {
    fontSize: 10,
    color: "#FF9800",
    fontWeight: "600",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quantitySection: {
    alignItems: "flex-end",
    gap: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00A8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
    color: "#333",
  },
  deleteButton: {
    padding: 4,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "500",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#00A8E8",
  },
  prescriptionNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  prescriptionText: {
    flex: 1,
    fontSize: 12,
    color: "#00A8E8",
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  totalContainer: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  footerTotalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#00A8E8",
  },
  validateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00A8E8",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  validateButtonDisabled: {
    backgroundColor: "#BBDEFB",
    shadowColor: "#BBDEFB",
  },
  validateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  exploreButton: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
