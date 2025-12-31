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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [secureText, setSecureText] = useState(true);
  const [confirmSecureText, setConfirmSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
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

  const updateFormData = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Calculer la force du mot de passe
    if (field === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
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
    updateFormData("phone", formatted);
  };

  const handleSignup = async () => {
    const { fullName, phone, email, password, confirmPassword } = formData;

    // Validation
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    if (!acceptedTerms) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Conditions requises", "Veuillez accepter les conditions d'utilisation");
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
      Alert.alert(
        "🎉 Inscription réussie !",
        "Votre compte a été créé avec succès. Un email de confirmation vous a été envoyé.",
        [
          {
            text: "Commencer",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    }, 2000);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#FF4444";
    if (passwordStrength < 70) return "#FF9800";
    return "#4CAF50";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Faible";
    if (passwordStrength < 70) return "Moyen";
    return "Fort";
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
              <Text style={styles.headerTitle}>Inscription</Text>
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
                <Ionicons name="person-add" size={32} color="white" />
              </LinearGradient>
            </View>
            
            <Text style={styles.welcomeTitle}>Rejoignez DelyMed</Text>
            <Text style={styles.welcomeSubtitle}>
              Créez votre compte pour commencer votre expérience santé
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
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.label}>Nom complet</Text>
              </View>
              
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === "fullName" && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#A0A0A0"
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData("fullName", value)}
                  autoCapitalize="words"
                  onFocus={() => setFocusedInput("fullName")}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor="#00A8E8"
                />
                {formData.fullName.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => updateFormData("fullName", "")}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Phone */}
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
                  value={formData.phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={14}
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor="#00A8E8"
                />
                {formData.phone.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => updateFormData("phone", "")}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="mail-outline" size={16} color="#666" />
                <Text style={styles.label}>Adresse email</Text>
              </View>
              
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === "email" && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="john.doe@example.com"
                  placeholderTextColor="#A0A0A0"
                  value={formData.email}
                  onChangeText={(value) => updateFormData("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor="#00A8E8"
                />
                {formData.email.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => updateFormData("email", "")}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="lock-closed-outline" size={16} color="#666" />
                <Text style={styles.label}>Mot de passe</Text>
                {formData.password.length > 0 && (
                  <Text style={[styles.strengthLabel, { color: getStrengthColor() }]}>
                    {getStrengthLabel()}
                  </Text>
                )}
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
                  value={formData.password}
                  onChangeText={(value) => updateFormData("password", value)}
                  secureTextEntry={secureText}
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor="#00A8E8"
                />
                
                <View style={styles.passwordActions}>
                  {formData.password.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => updateFormData("password", "")}
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
              
              {/* Password indication */}
              {formData.password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <LinearGradient
                      colors={["#FF4444", getStrengthColor()]}
                      style={[
                        styles.strengthProgress,
                        { width: `${passwordStrength}%` },
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                  <Text style={styles.strengthHint}>
                    Minimum 8 caractères avec majuscules, minuscules et chiffres
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#666" />
                <Text style={styles.label}>Confirmer le mot de passe</Text>
              </View>
              
              <View
                style={[
                  styles.inputContainer,
                  focusedInput === "confirmPassword" && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Répétez votre mot de passe"
                  placeholderTextColor="#A0A0A0"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData("confirmPassword", value)}
                  secureTextEntry={confirmSecureText}
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor="#00A8E8"
                />
                
                <View style={styles.passwordActions}>
                  {formData.confirmPassword.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => updateFormData("confirmPassword", "")}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle" size={20} color="#A0A0A0" />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setConfirmSecureText(!confirmSecureText);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={confirmSecureText ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Password verification */}
              {formData.confirmPassword.length > 0 && (
                <View style={styles.matchContainer}>
                  {formData.password === formData.confirmPassword ? (
                    <View style={styles.matchSuccess}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.matchSuccessText}>Les mots de passe correspondent</Text>
                    </View>
                  ) : (
                    <View style={styles.matchError}>
                      <Ionicons name="close-circle" size={16} color="#F44336" />
                      <Text style={styles.matchErrorText}>Les mots de passe ne correspondent pas</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAcceptedTerms(!acceptedTerms);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  J&apos;accepte les{" "}
                  <Text style={styles.termsLink}>conditions d&apos;utilisation</Text>{" "}
                  et la{" "}
                  <Text style={styles.termsLink}>politique de confidentialité</Text>
                </Text>
                <Text style={styles.termsSubtext}>
                  En créant un compte, vous acceptez nos conditions générales
                </Text>
              </View>
            </TouchableOpacity>

            {/* Signup Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  isLoading && styles.signupButtonLoading,
                  (!formData.fullName || !formData.phone || !formData.email || 
                   !formData.password || !formData.confirmPassword || !acceptedTerms) && 
                  styles.signupButtonDisabled,
                ]}
                onPress={handleSignup}
                disabled={isLoading || !formData.fullName || !formData.phone || 
                         !formData.email || !formData.password || 
                         !formData.confirmPassword || !acceptedTerms}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={
                    (!formData.fullName || !formData.phone || !formData.email || 
                     !formData.password || !formData.confirmPassword || !acceptedTerms)
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
                      <Text style={styles.signupButtonText}>Créer mon compte</Text>
                      <Ionicons name="checkmark-circle" size={22} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>
                Vous avez déjà un compte ?
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/login");
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.loginButtonText}>Se connecter</Text>
                <Ionicons name="chevron-forward" size={18} color="#00A8E8" />
              </TouchableOpacity>
            </View>

            {/* Signup Options */}
            <View style={styles.quickSignupSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Inscription rapide</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => Alert.alert("Google", "Inscription Google")}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={() => Alert.alert("Apple", "Inscription Apple")}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-apple" size={24} color="#000000" />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* securiter */}
            <View style={styles.securityAssurance}>
              <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
              <View style={styles.securityTextContainer}>
                <Text style={styles.securityTitle}>Sécurité garantie</Text>
                <Text style={styles.securityDescription}>
                  Vos données personnelles sont cryptées et protégées
                </Text>
              </View>
            </View>
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
    marginBottom: 30,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
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
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    letterSpacing: -0.2,
    flex: 1,
    marginLeft: 8,
  },
  strengthLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
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
  strengthContainer: {
    marginTop: 12,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  strengthProgress: {
    height: "100%",
    borderRadius: 2,
  },
  strengthHint: {
    fontSize: 12,
    color: "#999",
  },
  matchContainer: {
    marginTop: 8,
  },
  matchSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  matchSuccessText: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "500",
  },
  matchError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  matchErrorText: {
    fontSize: 13,
    color: "#F44336",
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    gap: 12,
    backgroundColor: "#F8F9FF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#00A8E8",
    borderColor: "#00A8E8",
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 4,
  },
  termsSubtext: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  termsLink: {
    color: "#00A8E8",
    fontWeight: "700",
  },
  signupButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  signupButtonLoading: {
    opacity: 0.9,
  },
  signupButtonDisabled: {
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
  signupButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.2,
  },
  loginSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  loginText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#00A8E8",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  quickSignupSection: {
    marginBottom: 32,
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
  securityAssurance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    backgroundColor: "#F8FFFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 2,
  },
  securityDescription: {
    fontSize: 13,
    color: "#666",
  },
});