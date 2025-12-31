import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Onboarding1() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Button PASSER */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('@/assets/images/logo.jpg')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Commandez vos médicaments en quelques clics
        </Text>
        <Text style={styles.description}>
          Accédez à des milliers de produits de santé et faites-vous livrer en moins de 30 minutes.
        </Text>

        {/* Pagination */}
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/onboarding-2")}
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
  illustration: {
    width: width * 0.8,
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
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: "#00A8E8",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    minWidth: 200,
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