import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

export default function OrdersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  // Données de test
  const allOrders = [
    {
      id: "ORD-001",
      date: "15 déc. 2025",
      status: "Livré",
      items: ["Paracétamol 500mg", "Vitamine C 1000mg"],
      total: "2,500 FCFA",
      statusColor: "#4CAF50",
      pharmacy: "Pharmacie du Centre",
      deliveryAddress: "Marcory, Zone 4",
      itemCount: 2,
    },
    {
      id: "ORD-002",
      date: "10 déc. 2025",
      status: "En cours",
      items: ["Masques FFP2 x20", "Gel hydroalcoolique 500ml"],
      total: "8,000 FCFA",
      statusColor: "#FF9800",
      pharmacy: "Pharmacie Moderne",
      deliveryAddress: "Cocody, Riviera",
      itemCount: 2,
      estimatedDelivery: "Aujourd'hui, 16h-18h",
    },
    {
      id: "ORD-003",
      date: "5 déc. 2025",
      status: "Annulé",
      items: ["Thermomètre digital"],
      total: "12,000 FCFA",
      statusColor: "#F44336",
      pharmacy: "Pharmacie Express",
      deliveryAddress: "Plateau, Centre-ville",
      itemCount: 1,
    },
    {
      id: "ORD-004",
      date: "28 nov. 2025",
      status: "Livré",
      items: ["Doliprane 1g", "Sirop toux", "Collyre"],
      total: "15,500 FCFA",
      statusColor: "#4CAF50",
      pharmacy: "Pharmacie de la Paix",
      deliveryAddress: "Yopougon, Niangon",
      itemCount: 3,
    },
    {
      id: "ORD-005",
      date: "20 nov. 2025",
      status: "Livré",
      items: ["Antibiotique", "Probiotiques"],
      total: "18,000 FCFA",
      statusColor: "#4CAF50",
      pharmacy: "Pharmacie du Centre",
      deliveryAddress: "Marcory, Zone 4",
      itemCount: 2,
    },
  ];

  const filters = [
    { id: "all", label: "Toutes", count: allOrders.length },
    {
      id: "pending",
      label: "En cours",
      count: allOrders.filter((o) => o.status === "En cours").length,
    },
    {
      id: "delivered",
      label: "Livrées",
      count: allOrders.filter((o) => o.status === "Livré").length,
    },
    {
      id: "cancelled",
      label: "Annulées",
      count: allOrders.filter((o) => o.status === "Annulé").length,
    },
  ];

  const getFilteredOrders = () => {
    switch (activeFilter) {
      case "pending":
        return allOrders.filter((o) => o.status === "En cours");
      case "delivered":
        return allOrders.filter((o) => o.status === "Livré");
      case "cancelled":
        return allOrders.filter((o) => o.status === "Annulé");
      default:
        return allOrders;
    }
  };

  const filteredOrders = getFilteredOrders();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      
      <View style={styles.statusBarBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Mes commandes</Text>
              <Text style={styles.headerSubtitle}>
                {allOrders.length} commande{allOrders.length > 1 ? "s" : ""} au
                total
              </Text>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}
            >
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    activeFilter === filter.id && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(filter.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === filter.id && styles.filterTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                  <View
                    style={[
                      styles.filterBadge,
                      activeFilter === filter.id && styles.filterBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        activeFilter === filter.id && styles.filterBadgeTextActive,
                      ]}
                    >
                      {filter.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>

      {/* Contenu principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Orders List */}
        <View style={styles.ordersContainer}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/order/${order.id}`)}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${order.statusColor}15` },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: order.statusColor },
                        ]}
                      />
                      <Text
                        style={[styles.orderStatus, { color: order.statusColor }]}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>

                <View style={styles.orderInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.infoText}>{order.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.infoText}>{order.pharmacy}</Text>
                  </View>
                  {order.estimatedDelivery && (
                    <View style={styles.estimatedDelivery}>
                      <Ionicons name="time-outline" size={14} color="#FF9800" />
                      <Text style={styles.estimatedDeliveryText}>
                        {order.estimatedDelivery}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.orderDivider} />

                <View style={styles.orderItems}>
                  <Text style={styles.itemsLabel}>Articles ({order.itemCount})</Text>
                  <Text style={styles.itemsList} numberOfLines={2}>
                    {order.items.join(" • ")}
                  </Text>
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>{order.total}</Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => router.push(`/order/${order.id}`)}
                  >
                    <Text style={styles.detailsButtonText}>Voir détails</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#DDD" />
              <Text style={styles.emptyStateTitle}>Aucune commande</Text>
              <Text style={styles.emptyStateText}>
                Vous n'avez pas encore de commandes dans cette catégorie
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  filtersContainer: {
    paddingBottom: 4,
  },
  filtersContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "white",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginRight: 6,
  },
  filterTextActive: {
    color: "#00A8E8",
  },
  filterBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  filterBadgeActive: {
    backgroundColor: "#00A8E8",
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "white",
  },
  filterBadgeTextActive: {
    color: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  ordersContainer: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  estimatedDelivery: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  estimatedDeliveryText: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "600",
  },
  orderDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  orderItems: {
    marginBottom: 16,
  },
  itemsLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 6,
  },
  itemsList: {
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#00A8E8",
  },
  detailsButton: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});