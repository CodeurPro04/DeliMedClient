import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from "react-native";

export default function OrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.id;

  // Simulation des données de commande
  const getOrderDetails = (id) => {
   const orders = {
      "ORD-001": {
        id: "ORD-001",
        date: "15 décembre 2025",
        time: "14:32",
        status: "Livré",
        statusColor: "#4CAF50",
        deliveryDate: "15 décembre 2025",
        deliveryTime: "15:30",
        items: [
          {
            name: "Paracétamol 500mg",
            quantity: 2,
            price: "1,500 FCFA",
            total: "3,000 FCFA",
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
          },
          {
            name: "Vitamine C 1000mg",
            quantity: 1,
            price: "2,500 FCFA",
            total: "2,500 FCFA",
            image: "https://images.unsplash.com/photo-1550572017-4e6c5b0c3b3c?w=400&q=80",
          },
        ],
        pharmacy: {
          name: "Pharmacie du Centre",
          address: "Avenue 12, Marcory Zone 4",
          phone: "+225 27 21 25 30 40",
        },
        deliveryAddress: {
          name: "Domicile",
          address: "Marcory, Zone 4, Rue des Jardins",
          phone: "+225 07 08 09 10 11",
        },
        paymentMethod: "Carte bancaire •••• 4242",
        subtotal: "5,500 FCFA",
        deliveryFee: "1,000 FCFA",
        total: "6,500 FCFA",
      },
      "ORD-002": {
        id: "ORD-002",
        date: "10 décembre 2025",
        time: "11:15",
        status: "En cours",
        statusColor: "#FF9800",
        estimatedDelivery: "Aujourd'hui, 12h-13h",
        items: [
          {
            name: "Masques FFP2",
            quantity: 1,
            price: "8,000 FCFA",
            total: "8,000 FCFA",
            image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
          },
          {
            name: "Gel hydroalcoolique 500ml",
            quantity: 2,
            price: "2,500 FCFA",
            total: "5,000 FCFA",
            image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&q=80",
          },
        ],
        pharmacy: {
          name: "Pharmacie Moderne",
          address: "Rue du Commerce, Plateau",
          phone: "+225 27 22 33 44 55",
        },
        deliveryAddress: {
          name: "Bureau",
          address: "Plateau, Tour B, 5ème étage",
          phone: "+225 07 77 88 99 00",
        },
        paymentMethod: "Mobile Money (Wave)",
        subtotal: "13,000 FCFA",
        deliveryFee: "1,000 FCFA",
        total: "14,000 FCFA",
      },
      "ORD-003": {
        id: "ORD-003",
        date: "5 décembre 2025",
        time: "09:45",
        status: "Annulé",
        statusColor: "#F44336",
        cancellationReason: "Pharmacie indisponible",
        items: [
          {
            name: "Thermomètre digital",
            quantity: 1,
            price: "12,000 FCFA",
            total: "12,000 FCFA",
            image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80",
          },
        ],
        pharmacy: {
          name: "Pharmacie Express",
          address: "Boulevard de Marseille, Treichville",
          phone: "+225 27 11 22 33 44",
        },
        deliveryAddress: {
          name: "Domicile",
          address: "Treichville, Rue 12",
          phone: "+225 07 55 66 77 88",
        },
        paymentMethod: "Carte bancaire •••• 1234",
        subtotal: "12,000 FCFA",
        deliveryFee: "1,000 FCFA",
        total: "13,000 FCFA",
      },
      "ORD-004": {
        id: "ORD-004",
        date: "28 novembre 2025",
        time: "16:20",
        status: "Livré",
        statusColor: "#4CAF50",
        deliveryDate: "28 novembre 2025",
        deliveryTime: "17:45",
        items: [
          {
            name: "Doliprane 1g",
            quantity: 1,
            price: "5,000 FCFA",
            total: "5,000 FCFA",
            image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
          },
          {
            name: "Sirop toux",
            quantity: 1,
            price: "8,000 FCFA",
            total: "8,000 FCFA",
            image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
          },
          {
            name: "Collyre",
            quantity: 1,
            price: "2,500 FCFA",
            total: "2,500 FCFA",
            image: "https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=400&q=80",
          },
        ],
        pharmacy: {
          name: "Pharmacie de la Paix",
          address: "Yopougon, Niangon, Rue du Marché",
          phone: "+225 27 33 44 55 66",
        },
        deliveryAddress: {
          name: "Domicile",
          address: "Yopougon, Niangon, Cité 225 Logements",
          phone: "+225 07 22 33 44 55",
        },
        paymentMethod: "Mobile Money",
        subtotal: "15,500 FCFA",
        deliveryFee: "1,000 FCFA",
        total: "15,500 FCFA",
      },
      "ORD-005": {
        id: "ORD-005",
        date: "20 novembre 2025",
        time: "10:05",
        status: "Livré",
        statusColor: "#4CAF50",
        deliveryDate: "20 novembre 2025",
        deliveryTime: "11:30",
        items: [
          {
            name: "Antibiotique",
            quantity: 1,
            price: "15,000 FCFA",
            total: "15,000 FCFA",
            image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80",
          },
          {
            name: "Probiotiques",
            quantity: 1,
            price: "3,000 FCFA",
            total: "3,000 FCFA",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
          },
        ],
        pharmacy: {
          name: "Pharmacie du Centre",
          address: "Avenue 12, Marcory Zone 4",
          phone: "+225 27 21 25 30 40",
        },
        deliveryAddress: {
          name: "Domicile",
          address: "Marcory, Zone 4, Rue des Cocotiers",
          phone: "+225 07 01 02 03 04",
        },
        paymentMethod: "Carte bancaire •••• 5678",
        subtotal: "18,000 FCFA",
        deliveryFee: "1,000 FCFA",
        total: "18,000 FCFA",
      },
    };

    // Retourne la commande correspondante ou une par défaut
    return orders[id] || orders["ORD-001"];
  };

  // Récupérer les détails de la commande selon l'ID
  const orderDetails = getOrderDetails(orderId);

  // Fonction pour générer les étapes de suivi selon le statut
  const getTrackingSteps = () => {
    const baseSteps = [
      {
        title: "Commande passée",
        time: orderDetails.date.includes("déc") 
          ? `${orderDetails.date.split(" ")[0]} déc. ${orderDetails.time}`
          : orderDetails.time,
        completed: true,
        icon: "checkmark-circle",
      },
      {
        title: "Commande confirmée",
        time: orderDetails.date.includes("déc")
          ? `${orderDetails.date.split(" ")[0]} déc. ${orderDetails.time.split(":")[0]}:${parseInt(orderDetails.time.split(":")[1]) + 6}`
          : `${orderDetails.time.split(":")[0]}:${parseInt(orderDetails.time.split(":")[1]) + 6}`,
        completed: true,
        icon: "checkmark-circle",
      },
      {
        title: "En préparation",
        time: orderDetails.date.includes("déc")
          ? `${orderDetails.date.split(" ")[0]} déc. ${orderDetails.time.split(":")[0]}:${parseInt(orderDetails.time.split(":")[1]) + 18}`
          : `${orderDetails.time.split(":")[0]}:${parseInt(orderDetails.time.split(":")[1]) + 18}`,
        completed: orderDetails.status !== "Annulé",
        icon: "cube",
      },
    ];

    if (orderDetails.status === "Livré") {
      return [
        ...baseSteps,
        {
          title: "En livraison",
          time: orderDetails.deliveryTime 
            ? orderDetails.deliveryTime.split(" ")[0]
            : "15:00",
          completed: true,
          icon: "bicycle",
        },
        {
          title: "Livrée",
          time: orderDetails.deliveryTime || "15:30",
          completed: true,
          icon: "home",
        },
      ];
    }

    if (orderDetails.status === "En cours") {
      return [
        ...baseSteps,
        {
          title: "En livraison",
          time: "Bientôt",
          completed: false,
          icon: "bicycle",
        },
        {
          title: "Livrée",
          time: orderDetails.estimatedDelivery || "—",
          completed: false,
          icon: "home",
        },
      ];
    }

    if (orderDetails.status === "Annulé") {
      return [
        ...baseSteps.slice(0, 2),
        {
          title: "Commande annulée",
          time: `${orderDetails.date.split(" ")[0]} déc. 10:30`,
          completed: true,
          icon: "close-circle",
        },
      ];
    }

    return baseSteps;
  };

  const trackingSteps = getTrackingSteps();

  const getStatusIcon = () => {
    switch (orderDetails.status) {
      case "Livré":
        return "checkmark-circle";
      case "En cours":
        return "time";
      case "Annulé":
        return "close-circle";
      default:
        return "receipt";
    }
  };

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
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{orderDetails.id}</Text>
            <Text style={styles.headerSubtitle}>
              {orderDetails.date} à {orderDetails.time}
            </Text>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusIconContainer,
                { backgroundColor: `${orderDetails.statusColor}15` },
              ]}
            >
              <Ionicons
                name={getStatusIcon()}
                size={32}
                color={orderDetails.statusColor}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{orderDetails.status}</Text>
              
              {orderDetails.status === "Livré" && orderDetails.deliveryDate && (
                <Text style={styles.statusDate}>
                  Le {orderDetails.deliveryDate} à {orderDetails.deliveryTime}
                </Text>
              )}
              
              {orderDetails.status === "En cours" && orderDetails.estimatedDelivery && (
                <Text style={styles.statusDate}>
                  Livraison estimée: {orderDetails.estimatedDelivery}
                </Text>
              )}
              
              {orderDetails.status === "Annulé" && orderDetails.cancellationReason && (
                <Text style={[styles.statusDate, { color: "#F44336" }]}>
                  Raison: {orderDetails.cancellationReason}
                </Text>
              )}
            </View>
          </View>

          {/* Message pour les commmandes annulées */}
          {orderDetails.status === "Annulé" && (
            <View style={styles.cancellationMessage}>
              <Ionicons name="information-circle" size={20} color="#F44336" />
              <Text style={styles.cancellationMessageText}>
                Votre commande a été annulée. Si vous avez été débité, le remboursement sera effectué sous 3-5 jours ouvrés.
              </Text>
            </View>
          )}
        </View>

        {/* Tracking */}
        {(orderDetails.status === "Livré" || orderDetails.status === "En cours") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suivi de commande</Text>
            <View style={styles.timelineCard}>
              {trackingSteps.map((step, index) => (
                <View key={index} style={styles.timelineStep}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineIcon,
                        step.completed && styles.timelineIconCompleted,
                        step.icon === "close-circle" && styles.timelineIconCancelled,
                      ]}
                    >
                      <Ionicons
                        name={step.icon}
                        size={16}
                        color={step.completed ? "white" : "#CCC"}
                      />
                    </View>
                    {index < trackingSteps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          step.completed && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        step.completed && styles.timelineTitleCompleted,
                        step.icon === "close-circle" && styles.timelineTitleCancelled,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.timelineTime}>{step.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles commandés</Text>
          <View style={styles.itemsCard}>
            {orderDetails.items.map((item, index) => (
              <View key={index}>
                <View style={styles.itemRow}>
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {item.price} × {item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>{item.total}</Text>
                </View>
                {index < orderDetails.items.length - 1 && (
                  <View style={styles.itemDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Pharmacie Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {orderDetails.status === "Annulé" ? "Pharmacie (annulée)" : "Pharmacie"}
          </Text>
          <View style={[
            styles.infoCard,
            orderDetails.status === "Annulé" && styles.cancelledCard
          ]}>
            <View style={styles.infoRow}>
              <View style={[
                styles.infoIconContainer,
                orderDetails.status === "Annulé" && styles.cancelledIcon
              ]}>
                <Ionicons 
                  name="medical" 
                  size={20} 
                  color={orderDetails.status === "Annulé" ? "#999" : "#00A8E8"} 
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={[
                  styles.infoTitle,
                  orderDetails.status === "Annulé" && styles.cancelledText
                ]}>
                  {orderDetails.pharmacy.name}
                </Text>
                <Text style={[
                  styles.infoText,
                  orderDetails.status === "Annulé" && styles.cancelledText
                ]}>
                  {orderDetails.pharmacy.address}
                </Text>
              </View>
            </View>
            {orderDetails.status !== "Annulé" && (
              <View style={styles.infoActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call-outline" size={18} color="#00A8E8" />
                  <Text style={styles.actionButtonText}>Appeler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="location-outline" size={18} color="#00A8E8" />
                  <Text style={styles.actionButtonText}>Itinéraire</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <View style={[
            styles.infoCard,
            orderDetails.status === "Annulé" && styles.cancelledCard
          ]}>
            <View style={styles.infoRow}>
              <View style={[
                styles.infoIconContainer,
                orderDetails.status === "Annulé" && styles.cancelledIcon
              ]}>
                <Ionicons 
                  name="location" 
                  size={20} 
                  color={orderDetails.status === "Annulé" ? "#999" : "#4CAF50"} 
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={[
                  styles.infoTitle,
                  orderDetails.status === "Annulé" && styles.cancelledText
                ]}>
                  {orderDetails.deliveryAddress.name}
                </Text>
                <Text style={[
                  styles.infoText,
                  orderDetails.status === "Annulé" && styles.cancelledText
                ]}>
                  {orderDetails.deliveryAddress.address}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif du paiement</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{orderDetails.subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de livraison</Text>
              <Text style={styles.summaryValue}>
                {orderDetails.deliveryFee}
              </Text>
            </View>
            {orderDetails.status === "Annulé" && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: "#F44336" }]}>
                  Montant remboursé
                </Text>
                <Text style={[styles.summaryValue, { color: "#F44336", fontWeight: "700" }]}>
                  -{orderDetails.total}
                </Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={[
                styles.summaryTotalLabel,
                orderDetails.status === "Annulé" && styles.cancelledText
              ]}>
                {orderDetails.status === "Annulé" ? "Total remboursé" : "Total"}
              </Text>
              <Text style={[
                styles.summaryTotalValue,
                orderDetails.status === "Annulé" && { color: "#F44336" }
              ]}>
                {orderDetails.status === "Annulé" ? `-${orderDetails.total}` : orderDetails.total}
              </Text>
            </View>
            <View style={styles.paymentMethodRow}>
              <Ionicons 
                name="card-outline" 
                size={16} 
                color={orderDetails.status === "Annulé" ? "#999" : "#666"} 
              />
              <Text style={[
                styles.paymentMethodText,
                orderDetails.status === "Annulé" && styles.cancelledText
              ]}>
                {orderDetails.paymentMethod}
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.actionButtons}>
          {orderDetails.status === "Livré" && (
            <>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => router.push(`/pharmacies`)}
              >
                <Ionicons name="refresh-outline" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Commander à nouveau</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="document-text-outline" size={20} color="#00A8E8" />
                <Text style={styles.secondaryButtonText}>Télécharger la facture</Text>
              </TouchableOpacity>
            </>
          )}
          
          {orderDetails.status === "En cours" && (
            <>
              <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="chatbubble-outline" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Contacter le livreur</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dangerButton}
                onPress={() => Alert.alert(
                  "Annuler la commande",
                  "Êtes-vous sûr de vouloir annuler cette commande ?",
                  [
                    { text: "Non", style: "cancel" },
                    { text: "Oui, annuler", style: "destructive", onPress: () => {
                      router.back();
                    }}
                  ]
                )}
              >
                <Ionicons name="close-circle-outline" size={20} color="#F44336" />
                <Text style={styles.dangerButtonText}>Annuler la commande</Text>
              </TouchableOpacity>
            </>
          )}
          
          {orderDetails.status === "Annulé" && (
            <>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: "#666" }]}
                onPress={() => router.push("/pharmacies")}
              >
                <Ionicons name="search-outline" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Chercher une autre pharmacie</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => router.push("/")}
              >
                <Ionicons name="help-circle-outline" size={20} color="#00A8E8" />
                <Text style={styles.secondaryButtonText}>Contacter le support</Text>
              </TouchableOpacity>
            </>
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
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    marginTop: 2,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    marginBottom: 4,
  },
  statusDate: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  cancellationMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  cancellationMessageText: {
    flex: 1,
    fontSize: 13,
    color: "#D32F2F",
    lineHeight: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineStep: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  timelineIconCompleted: {
    backgroundColor: "#4CAF50",
  },
  timelineIconCancelled: {
    backgroundColor: "#F44336",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999",
    marginBottom: 2,
  },
  timelineTitleCompleted: {
    color: "#333",
  },
  timelineTitleCancelled: {
    color: "#F44336",
  },
  timelineTime: {
    fontSize: 12,
    color: "#999",
  },
  itemsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: "#666",
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelledCard: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cancelledIcon: {
    backgroundColor: "#F0F0F0",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  cancelledText: {
    color: "#999",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  infoActions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00A8E8",
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00A8E8",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
  summaryDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#00A8E8",
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  paymentMethodText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00A8E8",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00A8E8",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00A8E8",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F44336",
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F44336",
  },
  helpSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#666",
  },
  helpLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00A8E8",
  },
});