import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const IS_IOS = Platform.OS === "ios";
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const heartBeatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Vibration d'entrée douce
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animation du battement de cœur
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeatAnim, {
          toValue: 1.1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeatAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ])
    ).start();

    // Animation de pulsation subtile
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de progression
    Animated.timing(progressWidth, {
      toValue: width * 0.6,
      duration: 2500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    // Simulation de chargement
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 8;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);

    // Initialisation et navigation
    const initialize = async () => {
      // Simulation de tâches d'initialisation
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      // Vibration de succès
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Marquer l'onboarding comme vu
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      
      // Animation de sortie
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        clearInterval(interval);
        router.replace("/onboarding-1");
      });
    };

    initialize();

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fond médical avec dégradé professionnel */}
      <LinearGradient
        colors={["#0A2463", "#1E3A8A", "#3B82F6"]}
        style={styles.backgroundGradient}
      >
        {/* Overlay de texture médicale subtile */}
        <View style={styles.medicalPattern}>
          {[...Array(20)].map((_, i) => (
            <View key={i} style={[styles.crossShape, {
              top: Math.random() * height,
              left: Math.random() * width,
              transform: [{ rotate: `${Math.random() * 360}deg` }],
              opacity: 0.03 + Math.random() * 0.02,
            }]} />
          ))}
        </View>

        {/* Éléments médicaux flottants */}
        <Animated.View 
          style={[
            styles.floatingMedicalIcon,
            styles.pulseIcon1,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Ionicons name="pulse" size={32} color="rgba(255, 255, 255, 0.15)" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.floatingMedicalIcon,
            styles.pulseIcon2,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Ionicons name="fitness" size={28} color="rgba(255, 255, 255, 0.12)" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.floatingMedicalIcon,
            styles.pulseIcon3,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Ionicons name="heart" size={24} color="rgba(255, 255, 255, 0.1)" />
        </Animated.View>

        {/* Contenu principal */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo médical avec battement de cœur */}
          <View style={styles.logoWrapper}>
            <Animated.View
              style={[
                styles.logoPulse,
                {
                  transform: [{ scale: heartBeatAnim }],
                },
              ]}
            />
            
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              <LinearGradient
                colors={["#FFFFFF", "#F8FAFF", "#E8F4FF"]}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.logoInner}>
                  <Animated.View 
                    style={[
                      styles.heartIconContainer,
                      { transform: [{ scale: heartBeatAnim }] }
                    ]}
                  >
                    <Ionicons name="heart" size={48} color="#3B82F6" />
                  </Animated.View>
                  <View style={styles.medicalCross}>
                    <View style={styles.crossVertical} />
                    <View style={styles.crossHorizontal} />
                  </View>
                </View>
                
                {/* Effet de brillance */}
                <LinearGradient
                  colors={["rgba(255, 255, 255, 0.4)", "transparent"]}
                  style={styles.logoShine}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Nom de l'application */}
          <View style={styles.appNameContainer}>
            <Text style={styles.appName}>DelyMed</Text>
            <View style={styles.appNameSubtitleContainer}>
              <View style={styles.subtitleLine} />
              <Text style={styles.appSubtitle}>MEDICAL CARE</Text>
              <View style={styles.subtitleLine} />
            </View>
          </View>

          {/* Slogan */}
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>Soins médicaux</Text>
            <Text style={styles.taglineAccent}>Livrés à votre porte</Text>
          </View>

          {/* Indicateur de chargement médical */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Initialisation du système</Text>
              <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarTrack,
                  { width: progressWidth },
                ]}
              />
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressWidth.interpolate({
                        inputRange: [0, width * 0.6],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                >
                  <LinearGradient
                    colors={["#60A5FA", "#3B82F6", "#2563EB"]}
                    style={styles.progressGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                  <View style={styles.progressPulse} />
                </Animated.View>
              </View>
              
              {/* Marqueurs de progression */}
              <View style={styles.progressMarkers}>
                <View style={styles.markerContainer}>
                  <View style={[styles.marker, progress > 0 && styles.markerActive]} />
                  <Text style={styles.markerText}>Sécurité</Text>
                </View>
                <View style={styles.markerContainer}>
                  <View style={[styles.marker, progress > 33 && styles.markerActive]} />
                  <Text style={styles.markerText}>Services</Text>
                </View>
                <View style={styles.markerContainer}>
                  <View style={[styles.marker, progress > 66 && styles.markerActive]} />
                  <Text style={styles.markerText}>Prêt</Text>
                </View>
              </View>
            </View>

            {/* Message de statut médical */}
            <View style={styles.statusContainer}>
              <Ionicons 
                name="checkmark-circle" 
                size={16} 
                color={progress > 90 ? "#10B981" : "rgba(255, 255, 255, 0.5)"} 
              />
              <Text style={styles.statusText}>
                {progress < 30 && "Vérification des protocoles de sécurité..."}
                {progress >= 30 && progress < 60 && "Connexion aux services médicaux..."}
                {progress >= 60 && progress < 90 && "Préparation de votre espace patient..."}
                {progress >= 90 && "Système prêt à l'utilisation ✓"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Footer médical professionnel */}
        <View style={styles.footer}>
          <View style={styles.footerSecurity}>
            <Ionicons name="shield-checkmark" size={14} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.footerSecurityText}>HIPAA Compliant • Données cryptées</Text>
          </View>
          <Text style={styles.footerCopyright}>© 2024 DelyMed Health Technologies</Text>
          <Text style={styles.footerVersion}>v1.0 • Certified Medical App</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A2463",
  },
  backgroundGradient: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  medicalPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  crossShape: {
    position: "absolute",
    width: 40,
    height: 40,
  },
  crossShape: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  crossShape: {
    position: "absolute",
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  floatingMedicalIcon: {
    position: "absolute",
  },
  pulseIcon1: {
    top: "20%",
    left: "10%",
  },
  pulseIcon2: {
    top: "70%",
    right: "15%",
  },
  pulseIcon3: {
    bottom: "30%",
    left: "20%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoWrapper: {
    position: "relative",
    marginBottom: 40,
  },
  logoPulse: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    top: -20,
    left: -20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
  },
  logoGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heartIconContainer: {
    position: "absolute",
    zIndex: 2,
  },
  medicalCross: {
    position: "absolute",
    width: 30,
    height: 30,
    zIndex: 1,
  },
  crossVertical: {
    position: "absolute",
    width: 4,
    height: 30,
    backgroundColor: "#3B82F6",
    left: 13,
    borderRadius: 2,
  },
  crossHorizontal: {
    position: "absolute",
    width: 30,
    height: 4,
    backgroundColor: "#3B82F6",
    top: 13,
    borderRadius: 2,
  },
  logoShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  appNameContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  appName: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appNameSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subtitleLine: {
    width: 20,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 1,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 2,
  },
  taglineContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  taglineAccent: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.5,
  },
  progressSection: {
    width: "100%",
    alignItems: "center",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "700",
    color: "#60A5FA",
  },
  progressBarContainer: {
    width: "100%",
    marginBottom: 24,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  progressGradient: {
    width: "100%",
    height: "100%",
  },
  progressPulse: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  markerActive: {
    backgroundColor: "#3B82F6",
    borderColor: "white",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  markerText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
  },
  statusText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerSecurity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  footerSecurityText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  footerCopyright: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.4)",
    fontStyle: "italic",
  },
});