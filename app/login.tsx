import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!phone || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs");
      return;
    }

    // Animation du bouton
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    }, 2000);
  };

  const handleSocialLogin = async (provider: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      `Connexion ${provider}`,
      `Fonctionnalité ${provider} à venir`,
      [{ text: "OK", style: "default" }]
    );
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/forgot-password");
  };

  const handleSignUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/signup");
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    
    return text;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFF"]}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header avec animation */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          > 
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Connexion</Text>
              <View style={styles.headerIndicator} />
            </View>
            
            <View style={styles.headerPlaceholder} />
          </Animated.View>

          {/* Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["#00A8E8", "#0097D7"]}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="medical" size={32} color="white" />
              </LinearGradient>
            </View>
            
            <Text style={styles.welcomeTitle}>Content de vous revoir !</Text>
            <Text style={styles.welcomeSubtitle}>
              Connectez-vous pour accéder à vos services de santé
            </Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.label}>Numéro de téléphone</Text>
              </View>
              
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === "phone" && styles.inputContainerFocused,
                ]}
              >
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+225</Text>
                  <View style={styles.countryCodeDivider} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="01 23 45 67 89"
                  placeholderTextColor="#A0A0A0"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={14}
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor="#00A8E8"
                />
                {phone.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setPhone("")}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="lock-closed-outline" size={16} color="#666" />
                <Text style={styles.label}>Mot de passe</Text>
              </View>
              
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === "password" && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Votre mot de passe"
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureText}
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor="#00A8E8"
                />
                
                <View style={styles.passwordActions}>
                  {password.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setPassword("")}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSecureText(!secureText);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={secureText ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>
                  Mot de passe oublié ?
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#00A8E8" />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonLoading,
                  (!phone || !password) && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading || !phone || !password}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={
                    !phone || !password
                      ? ["#E0E0E0", "#D0D0D0"]
                      : ["#00A8E8", "#0097D7"]
                  }
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Se connecter</Text>
                      <Ionicons name="arrow-forward" size={22} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* option connexion */}
            <View style={styles.quickLoginSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Connexion rapide</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin("Google")}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={() => handleSocialLogin("Apple")}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-apple" size={24} color="#000000" />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up */}
            <View style={styles.signupSection}>
              <Text style={styles.signupText}>
                Vous n&apos;avez pas encore de compte ?
              </Text>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignUp}
                activeOpacity={0.7}
              >
                <Text style={styles.signupButtonText}>Créer un compte</Text>
                <Ionicons name="chevron-forward" size={18} color="#00A8E8" />
              </TouchableOpacity>
            </View>

            {/* note de securiter
            <View style={styles.securityNote}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={styles.securityNoteText}>
                Vos données sont sécurisées et cryptées
              </Text>
            </View> */}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  headerIndicator: {
    width: 24,
    height: 3,
    backgroundColor: "#00A8E8",
    borderRadius: 2,
    marginTop: 4,
  },
  headerPlaceholder: {
    width: 44,
  },
  heroSection: {
    paddingHorizontal: 32,
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formSection: {
    paddingHorizontal: 32,
  },
  inputGroup: {
    marginBottom: 28,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: "#00A8E8",
    shadowColor: "#00A8E8",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 12,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  countryCodeDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  clearButton: {
    padding: 4,
  },
  passwordActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 12,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#00A8E8",
    fontWeight: "600",
  },
  loginButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 32,
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonLoading: {
    opacity: 0.9,
  },
  loginButtonDisabled: {
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.2,
  },
  quickLoginSection: {
    marginBottom: 40,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  googleButton: {
    borderColor: "#FFE5E5",
    backgroundColor: "#FFF",
  },
  appleButton: {
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  signupSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  signupText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  signupButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  signupButtonText: {
    fontSize: 16,
    color: "#00A8E8",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: "#F8FFFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  securityNoteText: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "500",
  },
});