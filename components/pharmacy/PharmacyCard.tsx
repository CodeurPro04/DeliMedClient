import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onPress?: () => void;
}

export const PharmacyCard = ({ pharmacy, onPress }: PharmacyCardProps) => (
  <TouchableOpacity
    style={cardStyles.card}
    activeOpacity={0.9}
    onPress={onPress}
  >
    {/* Image */}
    <View style={cardStyles.imageContainer}>
      {pharmacy.image ? (
        <Image
          source={{ uri: pharmacy.image }}
          style={cardStyles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={cardStyles.imagePlaceholder}>
          <Ionicons name="business" size={48} color="#00A8E8" />
        </View>
      )}

      {/* Badge statut sur l'image */}
      <View
        style={[
          cardStyles.statusBadgeOnImage,
          pharmacy.isOpen ? cardStyles.openBadge : cardStyles.closedBadge,
        ]}
      >
        <Text style={cardStyles.statusText}>
          {pharmacy.isOpen ? "Ouverte" : "Fermée"}
        </Text>
      </View>
    </View>

    {/* Informations */}
    <View style={cardStyles.info}>
      <Text style={cardStyles.name} numberOfLines={1}>
        {pharmacy.name}
      </Text>

      <Text style={cardStyles.address} numberOfLines={2}>
        {pharmacy.address}
      </Text>

      {/* Détails en ligne */}
      <View style={cardStyles.detailsRow}>
        <View style={cardStyles.detailItem}>
          <Ionicons name="location" size={16} color="#00A8E8" />
          <Text style={cardStyles.detailText}>{pharmacy.distance}</Text>
        </View>

        <View style={cardStyles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={cardStyles.detailText}>
            {pharmacy.isOpen ? `Ferme à ${pharmacy.closingTime}` : "Fermée"}
          </Text>
        </View>

        <View style={cardStyles.detailItem}>
          <Ionicons name="bicycle-outline" size={16} color="#4CAF50" />
          <Text style={cardStyles.detailText}>{pharmacy.deliveryTime}</Text>
        </View>
      </View>

      {/* Liens d'action 
      <View style={cardStyles.actions}>
        <TouchableOpacity style={cardStyles.linkButton}>
          <Text style={cardStyles.linkText}>Distance estimée</Text>
        </TouchableOpacity>

        <TouchableOpacity style={cardStyles.linkButton}>
          <Text style={cardStyles.linkText}>Voir les horaires</Text>
        </TouchableOpacity>

        <TouchableOpacity style={cardStyles.linkButton}>
          <Text style={cardStyles.linkText}>Délai de prise en charge</Text>
        </TouchableOpacity>
      </View> */}

      {/* Bouton Commander */}
      <TouchableOpacity style={cardStyles.orderButton}>
        <Text style={cardStyles.orderButtonText}>Commander</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeOnImage: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  openBadge: {
    backgroundColor: "#4CAF50",
  },
  closedBadge: {
    backgroundColor: "#F44336",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
  info: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A237E",
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  linkButton: {
    flex: 1,
    alignItems: "center",
  },
  linkText: {
    fontSize: 11,
    color: "#00A8E8",
    textAlign: "center",
  },
  orderButton: {
    backgroundColor: "#E91E63",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  orderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
