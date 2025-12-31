import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

type PrescriptionFile = {
  id: string;
  uri: string;
  type: "image" | "pdf";
  name: string;
  size?: number;
};

export default function AddPrescriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Vérifier si on doit retourner au panier après l'ajout
  const returnToCart = params.returnToCart === "true";
  const pharmacyId = params.pharmacyId;
  const products = params.products;

  const [prescriptions, setPrescriptions] = useState<PrescriptionFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Prendre une photo
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la caméra est nécessaire pour prendre une photo de votre ordonnance.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        addPrescription({
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: "image",
          name: `Photo_${new Date().toLocaleDateString()}.jpg`,
        });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de prendre la photo");
    }
  };

  // Choisir depuis la galerie
  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la galerie est nécessaire pour sélectionner une photo.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        result.assets.forEach((asset) => {
          addPrescription({
            id: Date.now().toString() + Math.random(),
            uri: asset.uri,
            type: "image",
            name: asset.fileName || `Image_${new Date().toLocaleDateString()}.jpg`,
          });
        });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  // Choisir un PDF
  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        addPrescription({
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: "pdf",
          name: result.assets[0].name,
          size: result.assets[0].size,
        });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner le PDF");
    }
  };

  const addPrescription = (file: PrescriptionFile) => {
    setPrescriptions((prev) => [...prev, file]);
  };

  const removePrescription = (id: string) => {
    Alert.alert(
      "Supprimer le fichier",
      "Êtes-vous sûr de vouloir retirer cette ordonnance ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setPrescriptions((prev) => prev.filter((p) => p.id !== id));
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const submitPrescriptions = async () => {
    if (prescriptions.length === 0) {
      Alert.alert(
        "Aucune ordonnance",
        "Veuillez ajouter au moins une ordonnance avant de continuer.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsUploading(true);

    // Simuler l'upload
    setTimeout(() => {
      setIsUploading(false);

      if (returnToCart) {
        // Retourner au panier avec l'indication que l'ordonnance a été ajoutée
        router.push({
          pathname: "/cart",
          params: {
            pharmacyId: pharmacyId,
            products: products,
            prescriptionAdded: "true",
          },
        });
      } else {
        // Comportement par défaut
        Alert.alert(
          "Ordonnance(s) ajoutée(s) !",
          "Vos ordonnances ont été enregistrées avec succès.",
          [
            {
              text: "Continuer",
              onPress: () => router.back(),
            },
          ]
        );
      }
    }, 2000);
  };

  const handleBack = () => {
    if (prescriptions.length > 0) {
      Alert.alert(
        "Abandonner l'ajout ?",
        "Vous avez des ordonnances non enregistrées. Voulez-vous vraiment quitter ?",
        [
          { text: "Rester", style: "cancel" },
          {
            text: "Quitter",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
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
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajouter une ordonnance</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle" size={24} color="#00A8E8" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Pourquoi une ordonnance ?</Text>
            <Text style={styles.infoText}>
              Certains médicaments nécessitent une ordonnance médicale valide
              pour être délivrés. Ajoutez votre ordonnance pour valider votre
              commande.
            </Text>
          </View>
        </View>

        {returnToCart && (
          <View style={styles.contextCard}>
            <Ionicons name="cart" size={20} color="#00A8E8" />
            <Text style={styles.contextText}>
              Une fois l&apos;ordonnance ajoutée, vous pourrez finaliser votre commande
            </Text>
          </View>
        )}

        {/* Options d'ajout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisir une option</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={takePhoto}
            activeOpacity={0.7}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="camera" size={28} color="#00A8E8" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Prendre une photo</Text>
              <Text style={styles.optionDescription}>
                Photographiez votre ordonnance directement
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={pickFromGallery}
            activeOpacity={0.7}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="images" size={28} color="#4CAF50" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Galerie photo</Text>
              <Text style={styles.optionDescription}>
                Sélectionnez une ou plusieurs images
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={pickPDF}
            activeOpacity={0.7}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="document-text" size={28} color="#F44336" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Importer un PDF</Text>
              <Text style={styles.optionDescription}>
                Choisissez un fichier PDF depuis vos documents
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* Liste des ordonnances ajoutées */}
        {prescriptions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Ordonnances ajoutées ({prescriptions.length})
            </Text>

            {prescriptions.map((file) => (
              <View key={file.id} style={styles.fileCard}>
                {file.type === "image" ? (
                  <Image source={{ uri: file.uri }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.pdfThumbnail}>
                    <Ionicons name="document-text" size={32} color="#F44336" />
                  </View>
                )}

                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <View style={styles.fileMetadata}>
                    <View style={styles.fileTypeTag}>
                      <Text style={styles.fileTypeText}>
                        {file.type === "image" ? "IMAGE" : "PDF"}
                      </Text>
                    </View>
                    {file.size && (
                      <Text style={styles.fileSize}>
                        {formatFileSize(file.size)}
                      </Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePrescription(file.id)}
                >
                  <Ionicons name="close-circle" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Conseils */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>
            <Ionicons name="bulb-outline" size={16} color="#FF9800" /> Conseils
          </Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>
              • Assurez-vous que l&apos;ordonnance est lisible
            </Text>
            <Text style={styles.tipItem}>
              • La date de validité doit être visible
            </Text>
            <Text style={styles.tipItem}>
              • Le nom du médecin et du patient doivent apparaître
            </Text>
            <Text style={styles.tipItem}>
              • Évitez les reflets et les ombres lors de la photo
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer avec bouton de validation */}
      {prescriptions.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerInfo}>
              <Text style={styles.footerLabel}>
                {prescriptions.length} ordonnance(s)
              </Text>
              <Text style={styles.footerSubtext}>
                {returnToCart ? "Prête(s) pour votre commande" : "Prête(s) à être envoyée(s)"}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isUploading && styles.submitButtonDisabled,
              ]}
              onPress={submitPrescriptions}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.submitText}>
                    {returnToCart ? "Continuer" : "Valider"}
                  </Text>
                  <Ionicons 
                    name={returnToCart ? "arrow-forward" : "checkmark"} 
                    size={20} 
                    color="white" 
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#00A8E8",
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00A8E8",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#0277BD",
    lineHeight: 18,
  },
  contextCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#FFC107",
  },
  contextText: {
    flex: 1,
    fontSize: 13,
    color: "#F57F17",
    fontWeight: "500",
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: "#666",
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  pdfThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  fileMetadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileTypeTag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fileTypeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00A8E8",
  },
  fileSize: {
    fontSize: 12,
    color: "#999",
  },
  removeButton: {
    padding: 4,
  },
  tipsCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F57C00",
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 13,
    color: "#E65100",
    lineHeight: 18,
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
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#666",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});