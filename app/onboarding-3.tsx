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

export default function Onboarding3() {
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
      
      {/* Button RETOUR */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <LottieView
          ref={animationRef}
          source={require("@/assets/lottie/coeur.json")}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Ordonnances numérisées en un instant
        </Text>
        <Text style={styles.description}>
          Envoyez simplement une photo de votre ordonnance, notre pharmacien prépare tout pour vous.
        </Text>

        {/* ETAPE  */}
        <View style={styles.process}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Prenez en photo</Text>
              <Text style={styles.stepDescription}>
                Photographiez votre ordonnance
              </Text>
            </View>
          </View>
          
          <View style={styles.stepDivider}>
            <Ionicons name="arrow-down" size={20} color="#00A8E8" />
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Pharmacien vérifie</Text>
              <Text style={styles.stepDescription}>
                Validation et préparation
              </Text>
            </View>
          </View>
          
          <View style={styles.stepDivider}>
            <Ionicons name="arrow-down" size={20} color="#00A8E8" />
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Livraison express</Text>
              <Text style={styles.stepDescription}>
                Chez vous en 30 minutes
              </Text>
            </View>
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
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
            style={styles.getStartedButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.getStartedText}>Commencer</Text>
            <Ionicons name="checkmark-circle" size={20} color="white" />
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
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  lottieAnimation: {
    width: width * 0.5,
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
  process: {
    marginBottom: 40,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00A8E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
  },
  stepDivider: {
    alignItems: "center",
    marginVertical: 8,
    marginLeft: 20,
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
  getStartedButton: {
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
  getStartedText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});