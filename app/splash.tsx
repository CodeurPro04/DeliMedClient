import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      // Attendre 3 secondes sur le splash
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Marquer l'onboarding comme vu
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      
      // Rediriger vers le premier onboarding
      router.replace("/onboarding-1");
    };

    initialize();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      <LinearGradient
        colors={["#00A8E8", "#0097D7"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="medical" size={80} color="white" />
            </View>
          </View>
          
          <Text style={styles.appName}>DelyMed</Text>
          <Text style={styles.tagline}>Votre santé, livrée à domicile</Text>
          
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <View style={styles.loadingProgress} />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 DelyMed Côte d&apos;Ivoire</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 50,
  },
  loadingContainer: {
    width: "80%",
    marginTop: 40,
  },
  loadingBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    width: "30%",
    backgroundColor: "white",
    borderRadius: 2,
  },
  footer: {
    position: "absolute",
    bottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
});