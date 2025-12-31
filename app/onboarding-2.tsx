import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function Onboarding2() {
  const router = useRouter();
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Démarre l'animation
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Button RETOUR*/}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Button PASSER */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <LottieView
          ref={animationRef}
          source={require("@/assets/lottie/medical.json")}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>

      {/* CONTENU */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Pharmacies 24/7 près de chez vous
        </Text>
        <Text style={styles.description}>
          Trouvez les pharmacies les plus proches, ouvertes jusqu&apos;à tard, avec livraison express.
        </Text>

        {/* ELEMENTS */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="time" size={24} color="#00A8E8" />
            </View>
            <Text style={styles.featureText}>Ouvert 24h/24</Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="location" size={24} color="#00A8E8" />
            </View>
            <Text style={styles.featureText}>Géolocalisation</Text>
          </View>
          
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="rocket" size={24} color="#00A8E8" />
            </View>
            <Text style={styles.featureText}>Livraison rapide</Text>
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.prevButtonText}>Précédent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/onboarding-3")}
          >
            <Text style={styles.nextButtonText}>Suivant</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  lottieAnimation: {
    width: width * 0.7,
    height: height * 0.4,
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  feature: {
    alignItems: "center",
    gap: 8,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  activeDot: {
    width: 24,
    backgroundColor: "#00A8E8",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  prevButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#00A8E8",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    minWidth: 160,
    justifyContent: "center",
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});