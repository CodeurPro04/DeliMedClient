import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";

/* 📦 Catalogue produits (mock) avec images */
const productsCatalog = [
  {
    id: "1",
    name: "Paracétamol 500mg",
    price: 2500,
    image: "https://via.placeholder.com/100x100.png?text=Para",
  },
  {
    id: "2",
    name: "Vitamine C 1000mg",
    price: 1500,
    image: "https://via.placeholder.com/100x100.png?text=Vit+C",
  },
  {
    id: "3",
    name: "Gel hydroalcoolique",
    price: 700,
    image: "https://via.placeholder.com/100x100.png?text=Gel",
  },
  {
    id: "4",
    name: "Masques FFP2",
    price: 12900,
    image: "https://via.placeholder.com/100x100.png?text=FFP2",
  },
  {
    id: "5",
    name: "Doliprane 1000mg",
    price: 3200,
    image: "https://via.placeholder.com/100x100.png?text=Doli",
  },
];

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const productIds =
    typeof params.products === "string" ? params.products.split(",") : [];

  const initialCart = useMemo(() => {
    return productIds.map((id) => ({
      ...productsCatalog.find((p) => p.id === id)!,
      quantity: 1,
    }));
  }, []);

  const [cartItems, setCartItems] = useState(initialCart);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* 🛒 Panier vide */
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Votre panier est vide</Text>
        <Text style={styles.emptyText}>
          Ajoutez des produits depuis une pharmacie
        </Text>
        {/* Bouton Retour aux pharmacies 
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Votre panier</Text>

        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            {/* Image produit */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
            </View>

            {/* Infos */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {item.price.toFixed(2)} FCFA / unité
              </Text>
            </View>

            {/* Quantité */}
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Ionicons name="remove" size={16} color="white" />
              </TouchableOpacity>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{total.toFixed(2)} FCFA</Text>
        </View>

        <TouchableOpacity style={styles.validateButton}>
          <Text style={styles.validateText}>Valider la commande</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* 🎨 Styles UX améliorés */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 20,
    color: Colors.text,
  },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#F5F5F5",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  validateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  validateText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: "white",
    fontWeight: "700",
  },
});
