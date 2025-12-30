import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get("window");

export default function OrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Récupérer les données de la commande
  const orderId = params.orderId || `ORD-${Date.now().toString().slice(-6)}`;
  const pharmacyName = params.pharmacyName || "Pharmacie du Centre";
  const deliveryTime = params.deliveryTime || "10-20 min";
  const total = params.total || "15,500";

  // Réf pour le cannon à confettis
  const confettiRef = useRef();

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const ringScale = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Compte à rebours
  const [countdown, setCountdown] = useState(8);

  // Lancer les animations au chargement
  useEffect(() => {
    // Animation en séquence
    Animated.sequence([
      // 1. Animation du checkmark
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      
      // 2. Animation de l'anneau
      Animated.timing(ringScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      
      // 4. Fade in du contenu
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Lancer les confettis après un court délai
    const confettiTimer = setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    }, 600);

    // Compte à rebours pour redirection
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          // Utiliser setTimeout pour éviter de mettre à jour pendant le rendu
          setTimeout(() => {
            router.replace("/profile");
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const handleViewOrder = () => {
    router.push({
      pathname: "/profile",
      params: { id: orderId },
    });
  };

  const handleBackHome = () => {
    router.replace("/");
  };

  const handleTrackOrder = () => {
    router.push({
      pathname: "/profile",
      params: { orderId },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      
      {/* Zone bleue pour l'encoché */}
      <View style={styles.statusBarBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header minimal */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackHome}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Commande confirmée</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>

      {/* Confettis */}
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: width / 2, y: 0 }}
        explosionSpeed={350}
        fallSpeed={2000}
        fadeOut={true}
        autoStart={false}
        colors={['#4CAF50', '#00A8E8', '#FF9800', '#E91E63', '#9C27B0']}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Animation principale */}
        <View style={styles.animationContainer}>
          {/* Anneau pulsant */}
          <Animated.View
            style={[
              styles.successRing,
              {
                transform: [
                  { scale: ringScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2]
                  })},
                ],
                opacity: ringScale.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0.3, 0]
                }),
              },
            ]}
          />
          
          {/* Anneau secondaire */}
          <Animated.View
            style={[
              styles.successRing,
              {
                borderWidth: 1,
                borderColor: '#4CAF50',
                transform: [
                  { scale: ringScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1.3]
                  })},
                ],
                opacity: ringScale.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [0, 0.2, 0]
                }),
              },
            ]}
          />

          {/* Icône de succès animée */}
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    rotate: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-180deg', '0deg']
                    })
                  }
                ],
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={140} color="#4CAF50" />
            
            {/* Points tournants */}
            <View style={styles.orbitingDots}>
              {[0, 1, 2].map((i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.orbitingDot,
                    {
                      transform: [
                        {
                          rotate: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [`${i * 120}deg`, `${i * 120 + 360}deg`]
                          })
                        }
                      ],
                    },
                  ]}
                >
                  <View style={styles.dot} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Contenu */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.successTitle}>Commande confirmée !</Text>
          <Text style={styles.successSubtitle}>
            Votre commande a été passée avec succès
          </Text>
          
          {/* Numéro de commande */}
          <View style={styles.orderNumberContainer}>
            <Text style={styles.orderNumberLabel}>N° de commande</Text>
            <Text style={styles.orderNumber}>{orderId}</Text>
          </View>

          {/* Infos rapides */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="time-outline" size={24} color="#00A8E8" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Livraison estimée</Text>
                <Text style={styles.infoValue}>{deliveryTime}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="medical-outline" size={24} color="#4CAF50" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Pharmacie</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{pharmacyName}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="cash-outline" size={24} color="#FF9800" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Montant total</Text>
                <Text style={styles.infoValue}>
                  {parseInt(total.replace(/,/g, '') || "15500").toLocaleString()} FCFA
                </Text>
              </View>
            </View>
          </View>

          {/* Barre de progression de suivi */}
          <View style={styles.trackingSection}>
            <Text style={styles.trackingTitle}>Suivi de commande</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      }),
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Commandé</Text>
                <Text style={styles.progressLabel}>En préparation</Text>
                <Text style={styles.progressLabel}>En livraison</Text>
                <Text style={styles.progressLabel}>Livré</Text>
              </View>
              <View style={styles.progressDots}>
                {[0, 1, 2, 3].map((dot) => (
                  <Animated.View
                    key={dot}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor: progressAnim.interpolate({
                          inputRange: [dot * 0.25, dot * 0.25 + 0.01],
                          outputRange: ['#E0E0E0', '#00A8E8']
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Message */}
          <View style={styles.messageBox}>
            <Ionicons name="information-circle" size={24} color="#00A8E8" />
            <View style={styles.messageContent}>
              <Text style={styles.messageTitle}>Suivez votre commande</Text>
              <Text style={styles.messageText}>
                Vous pouvez suivre l'avancement en temps réel de votre commande 
                dans votre espace "Mes commandes". Une notification vous sera 
                envoyée à chaque étape importante.
              </Text>
            </View>
          </View>

          {/* Numéro d'assistance */}
          <View style={styles.assistanceCard}>
            <Ionicons name="headset-outline" size={24} color="#00A8E8" />
            <View style={styles.assistanceContent}>
              <Text style={styles.assistanceTitle}>Besoin d'aide ?</Text>
              <Text style={styles.assistanceText}>
                Notre service client est disponible 7j/7 au
              </Text>
              <Text style={styles.assistancePhone}>+225 27 20 21 22 23</Text>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Boutons d'action */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <View style={styles.footerContent}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleTrackOrder}
          >
            <Ionicons name="navigate-outline" size={20} color="#00A8E8" />
            <Text style={styles.secondaryButtonText}>Suivre la commande</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewOrder}
          >
            <Ionicons name="document-text-outline" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Voir les détails</Text>
          </TouchableOpacity>
        </View>

        {/* Compte à rebours pour redirection */}
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            Redirection automatique vers vos commandes dans 
          </Text>
          <View style={styles.countdownCircle}>
            <Animated.Text style={styles.countdownNumber}>
              {countdown}
            </Animated.Text>
          </View>
        </View>
      </Animated.View>
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
    paddingBottom: 200,
  },
  animationContainer: {
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  checkmarkContainer: {
    position: "relative",
  },
  successRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  orbitingDots: {
    position: "absolute",
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
  },
  orbitingDot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -70,
    marginTop: -4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00A8E8",
  },
  textContainer: {
    padding: 20,
    alignItems: "center",
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  orderNumberContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderNumberLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#00A8E8",
    letterSpacing: 2,
  },
  infoCards: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  trackingSection: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00A8E8",
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: -7,
    left: 0,
    right: 0,
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "white",
  },
  messageBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: "100%",
    gap: 16,
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00A8E8",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 13,
    color: "#00A8E8",
    lineHeight: 18,
  },
  assistanceCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    gap: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  assistanceContent: {
    flex: 1,
  },
  assistanceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  assistanceText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  assistancePhone: {
    fontSize: 15,
    fontWeight: "800",
    color: "#00A8E8",
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00A8E8",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#00A8E8",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00A8E8",
  },
  countdownContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
    gap: 8,
  },
  countdownText: {
    fontSize: 12,
    color: "#666",
  },
  countdownCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00A8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  countdownNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "white",
  },
});