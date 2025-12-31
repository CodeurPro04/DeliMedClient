import React, { useState, useRef, useEffect } from "react";
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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

// État du processus d'inscription
type SignupStep = 'form' | 'phoneVerification';

export default function SignupScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStep>('form');
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    secretCode: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPushNotification, setShowPushNotification] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const notificationSlideAnim = useRef(new Animated.Value(-100)).current;

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

  // Timer pour le renvoi de code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Animation pour la notification push
  const showNotificationAnimation = () => {
    notificationSlideAnim.setValue(-100);
    Animated.timing(notificationSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const hideNotificationAnimation = () => {
    Animated.timing(notificationSlideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPushNotification(false);
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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

  const handleSecretCodeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    updateFormData("secretCode", numericText);
  };

  const handleVerificationCodeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setVerificationCode(numericText);
  };

  const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    return code;
  };

  const simulatePushNotification = (phoneNumber: string, code: string) => {
    // Simuler l'arrivée d'une notification push
    setTimeout(() => {
      if (!showPushNotification) {
        showNotificationAnimation();
        setShowPushNotification(true);
        setNotificationVisible(true);
        
        // Simuler la vibration de la notification
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Auto-hide après 10 secondes
        setTimeout(() => {
          if (showPushNotification) {
            hideNotificationAnimation();
          }
        }, 10000);
      }
    }, 2000);
  };

  const sendVerificationCode = (phoneNumber: string, code: string) => {
    // Simulation d'envoi de code par multiple canaux
    console.log(`Code envoyé au ${phoneNumber}: ${code}`);
    
    // Option 1: SMS (comme avant)
    simulateSMSNotification(phoneNumber, code);
    
    // Option 2: Notification push fictive
    simulatePushNotification(phoneNumber, code);
    
    // Option 3: Email de confirmation
    simulateEmailConfirmation(code);
  };

  const simulateSMSNotification = (phoneNumber: string, code: string) => {
    Alert.alert(
      "Code de vérification envoyé",
      `Un SMS avec le code ${code} a été envoyé à votre numéro ${phoneNumber}.\n\nPour la démo, une notification push simulée apparaîtra également dans quelques secondes.`,
      [{ text: "OK" }]
    );
  };

  const simulateEmailConfirmation = (code: string) => {
    console.log(`Email de confirmation envoyé avec le code: ${code}`);
  };

  const requestNotificationPermission = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Notifications Push",
      "Pour une meilleure expérience, activez les notifications push pour recevoir vos codes de vérification instantanément.",
      [
        { text: "Plus tard", style: "cancel" },
        {
          text: "Activer",
          onPress: () => {
            setHasNotificationPermission(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
              "Notifications activées",
              "Vous recevrez maintenant des notifications push pour vos codes de vérification.",
              [{ text: "Parfait" }]
            );
          },
        },
      ]
    );
  };

  const validateForm = () => {
    const { fullName, phone, email, secretCode } = formData;

    if (!fullName || !phone || !email || !secretCode) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs");
      return false;
    }

    if (secretCode.length < 4) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Code invalide", "Le code secret doit contenir au moins 4 chiffres");
      return false;
    }

    const phoneDigits = phone.replace(/\s/g, '');
    if (phoneDigits.length !== 10) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Numéro invalide", "Le numéro de téléphone doit contenir 10 chiffres");
      return false;
    }

    if (!acceptedTerms) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Conditions requises", "Veuillez accepter les conditions d'utilisation");
      return false;
    }

    return true;
  };

  const handleSendVerificationCode = () => {
    if (!validateForm()) return;

    // Demander la permission pour les notifications
    if (!hasNotificationPermission) {
      requestNotificationPermission();
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

    setTimeout(() => {
      setIsLoading(false);
      const code = generateVerificationCode();
      sendVerificationCode(formData.phone, code);
      setCurrentStep('phoneVerification');
      setResendTimer(60);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const code = generateVerificationCode();
    sendVerificationCode(formData.phone, code);
    setResendTimer(60);
    
    Alert.alert(
      "Code renvoyé",
      "Un nouveau code de vérification a été envoyé sur tous vos canaux.",
      [{ text: "OK" }]
    );
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Code requis", "Veuillez entrer le code de vérification");
      return;
    }

    if (verificationCode.length !== 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Format invalide", "Le code de vérification doit contenir 6 chiffres");
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

    setTimeout(() => {
      setIsLoading(false);
      
      if (verificationCode === generatedCode) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        completeRegistration();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "Code incorrect",
          "Le code de vérification que vous avez entré est incorrect. Veuillez réessayer.",
          [{ text: "Réessayer" }]
        );
      }
    }, 1500);
  };

  const completeRegistration = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        "Inscription réussie !",
        `Bienvenue ${formData.fullName} !\n\nVotre compte a été créé avec succès et votre numéro de téléphone a été vérifié.`,
        [
          {
            text: "Commencer",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    }, 1000);
  };

  const handleNotificationPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVerificationCode(generatedCode);
    hideNotificationAnimation();
    
    Alert.alert(
      "Code automatiquement rempli",
      "Le code de vérification a été copié depuis la notification.",
      [{ text: "Merci" }]
    );
  };

  const handleDismissNotification = () => {
    hideNotificationAnimation();
  };

  const renderPushNotification = () => (
    <Animated.View
      style={[
        styles.pushNotificationContainer,
        {
          transform: [{ translateY: notificationSlideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.pushNotification}
        onPress={handleNotificationPress}
        activeOpacity={0.9}
      >
        <View style={styles.notificationIconContainer}>
          <Ionicons name="notifications" size={24} color="#00A8E8" />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>DelyMed - Vérification</Text>
          <Text style={styles.notificationMessage}>
            Votre code de vérification est : {generatedCode}
          </Text>
          <Text style={styles.notificationTime}>À l&apos;instant</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationClose}
          onPress={handleDismissNotification}
        >
          <Ionicons name="close" size={20} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFormStep = () => (
    <>
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

      {/* Code Secret */}
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <Ionicons name="key-outline" size={16} color="#666" />
          <Text style={styles.label}>Code secret</Text>
        </View>
        
        <View
          style={[
            styles.inputContainer,
            focusedInput === "secretCode" && styles.inputContainerFocused,
          ]}
        >
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="1234"
            placeholderTextColor="#A0A0A0"
            value={formData.secretCode}
            onChangeText={handleSecretCodeChange}
            keyboardType="numeric"
            maxLength={6}
            autoCapitalize="none"
            onFocus={() => setFocusedInput("secretCode")}
            onBlur={() => setFocusedInput(null)}
            selectionColor="#00A8E8"
            secureTextEntry={false}
          />
          
          <View style={styles.codeActions}>
            {formData.secretCode.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => updateFormData("secretCode", "")}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color="#A0A0A0" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {formData.secretCode.length > 0 && (
          <View style={styles.codeHintContainer}>
            <Text style={styles.codeHint}>
              {formData.secretCode.length < 4 ? (
                <Text style={styles.codeHintWarning}>
                  Le code secret doit contenir au moins 4 chiffres
                </Text>
              ) : (
                <Text style={styles.codeHintSuccess}>
                  Code secret valide
                </Text>
              )}
            </Text>
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

      {/* Notification Permission Info */}
      {!hasNotificationPermission && (
        <View style={styles.notificationPermissionCard}>
          <Ionicons name="notifications-outline" size={24} color="#00A8E8" />
          <View style={styles.notificationPermissionContent}>
            <Text style={styles.notificationPermissionTitle}>
              Recevez vos codes par notification push
            </Text>
            <Text style={styles.notificationPermissionText}>
              Activez les notifications pour une vérification plus rapide et sécurisée
            </Text>
          </View>
        </View>
      )}

      {/* Send Verification Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[
            styles.verificationButton,
            isLoading && styles.verificationButtonLoading,
            (!formData.fullName || !formData.phone || !formData.email || 
             !formData.secretCode || !acceptedTerms) && 
            styles.verificationButtonDisabled,
          ]}
          onPress={handleSendVerificationCode}
          disabled={isLoading || !formData.fullName || !formData.phone || 
                   !formData.email || !formData.secretCode || !acceptedTerms}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={
              (!formData.fullName || !formData.phone || !formData.email || 
               !formData.secretCode || !acceptedTerms)
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
                <Ionicons name="phone-portrait-outline" size={20} color="white" />
                <Text style={styles.verificationButtonText}>Vérifier mon numéro</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </>
  );

  const renderVerificationStep = () => (
    <>
      {/* Verification Header 
      <View style={styles.verificationHeader}>
        <TouchableOpacity
          style={styles.backToFormButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentStep('form');
            setShowPushNotification(false);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#00A8E8" />
          <Text style={styles.backToFormText}>Modifier les infos</Text>
        </TouchableOpacity>
      </View> */}

      {/* Verification Icon */}
      <View style={styles.verificationIconContainer}>
        <LinearGradient
          colors={["#00A8E8", "#0097D7"]}
          style={styles.verificationIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="phone-portrait" size={36} color="white" />
        </LinearGradient>
      </View>

      {/* Verification Title */}
      <Text style={styles.verificationTitle}>
        Vérification du numéro
      </Text>
      <Text style={styles.verificationSubtitle}>
        Nous avons envoyé un code à 6 chiffres au{"\n"}
        <Text style={styles.phoneHighlight}>{formData.phone}</Text>
      </Text>

      {/* Delivery Methods */}
      <View style={styles.deliveryMethodsContainer}>
        <View style={styles.deliveryMethod}>
          <View style={[styles.deliveryIcon, styles.smsIcon]}>
            <Ionicons name="chatbubble" size={20} color="#00A8E8" />
          </View>
          <Text style={styles.deliveryText}>SMS</Text>
        </View>
        <View style={styles.deliveryMethod}>
          <View style={[styles.deliveryIcon, styles.pushIcon]}>
            <Ionicons name="notifications" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.deliveryText}>Notification push</Text>
        </View>
        {hasNotificationPermission && (
          <View style={styles.deliveryMethod}>
            <View style={[styles.deliveryIcon, styles.emailIcon]}>
              <Ionicons name="mail" size={20} color="#FF9800" />
            </View>
            <Text style={styles.deliveryText}>Email</Text>
          </View>
        )}
      </View>

      {/* Verification Code Input */}
      <View style={styles.verificationInputGroup}>
        <Text style={styles.verificationLabel}>Code de vérification</Text>
        
        <View style={styles.verificationCodeContainer}>
          <TextInput
            style={styles.verificationCodeInput}
            placeholder="123456"
            placeholderTextColor="#A0A0A0"
            value={verificationCode}
            onChangeText={handleVerificationCodeChange}
            keyboardType="numeric"
            maxLength={6}
            autoFocus={true}
            selectionColor="#00A8E8"
            textAlign="center"
          />
          <View style={styles.verificationUnderline} />
        </View>
        
        <Text style={styles.codeHintText}>
          Entrez les 6 chiffres reçus
        </Text>
      </View>

      {/* Auto Fill from Notification */}
      {showPushNotification && (
        <TouchableOpacity
          style={styles.autoFillButton}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={16} color="#00A8E8" />
          <Text style={styles.autoFillText}>
            Remplir automatiquement depuis la notification
          </Text>
        </TouchableOpacity>
      )}

      {/* Resend Code */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Vous n&apos;avez pas reçu le code ?
        </Text>
        <TouchableOpacity
          onPress={handleResendCode}
          disabled={resendTimer > 0}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.resendButtonText,
            resendTimer > 0 && styles.resendButtonDisabled
          ]}>
            {resendTimer > 0 ? `Renvoyer (${resendTimer}s)` : "Renvoyer le code"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verify Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            isLoading && styles.verifyButtonLoading,
            !verificationCode && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerifyCode}
          disabled={isLoading || !verificationCode}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={
              !verificationCode
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
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.verifyButtonText}>Vérifier et créer le compte</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Demo Info */}
      <View style={styles.demoCodeContainer}>
        <Text style={styles.demoCodeTitle}>Pour la démo :</Text>
        <Text style={styles.demoCodeText}>
          Code généré : <Text style={styles.demoCodeHighlight}>{generatedCode}</Text>
        </Text>
        <Text style={styles.demoCodeNote}>
          {hasNotificationPermission 
            ? "En production, vous recevriez une vraie notification push"
            : "Activez les notifications pour la simulation push complète"}
        </Text>
      </View>
    </>
  );

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
              <Text style={styles.headerTitle}>
                {currentStep === 'form' ? 'Inscription' : 'Vérification'}
              </Text>
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
            {currentStep === 'form' ? (
              <>
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
              </>
            ) : (
              <>
              {/* Verification Step Hero */}
              </>
            )}
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
            {currentStep === 'form' ? renderFormStep() : renderVerificationStep()}

            {/* Login Link (only in form step) */}
            {currentStep === 'form' && (
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
            )}

            {/* Security Assurance */}
            <View style={styles.securityAssurance}>
              <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
              <View style={styles.securityTextContainer}>
                <Text style={styles.securityTitle}>
                  {currentStep === 'form' ? 'Sécurité garantie' : 'Vérification multi-canal'}
                </Text>
                <Text style={styles.securityDescription}>
                  {currentStep === 'form' 
                    ? 'Vos données personnelles sont cryptées et protégées'
                    : 'Votre code est envoyé par SMS, notification push et email pour plus de sécurité'}
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Push Notification Overlay */}
      {showPushNotification && currentStep === 'phoneVerification' && renderPushNotification()}
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
  verificationStepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A8E8",
    marginBottom: 12,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  stepDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00A8E8",
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: "#00A8E8",
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
  codeActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  codeHintContainer: {
    marginTop: 8,
  },
  codeHint: {
    fontSize: 13,
  },
  codeHintWarning: {
    color: "#FF9800",
  },
  codeHintSuccess: {
    color: "#4CAF50",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
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
  notificationPermissionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F0F8FF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0F0FF",
    marginBottom: 24,
  },
  notificationPermissionContent: {
    flex: 1,
  },
  notificationPermissionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00A8E8",
    marginBottom: 4,
  },
  notificationPermissionText: {
    fontSize: 13,
    color: "#666",
  },
  verificationButton: {
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
  verificationButtonLoading: {
    opacity: 0.9,
  },
  verificationButtonDisabled: {
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
  verificationButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.2,
  },
  // Verification Step Styles
  verificationHeader: {
    marginBottom: 24,
  },
  backToFormButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  backToFormText: {
    fontSize: 15,
    color: "#00A8E8",
    fontWeight: "600",
  },
  verificationIconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  verificationIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  verificationTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 12,
  },
  verificationSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  phoneHighlight: {
    color: "#00A8E8",
    fontWeight: "700",
  },
  deliveryMethodsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  deliveryMethod: {
    alignItems: "center",
    gap: 8,
  },
  deliveryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  smsIcon: {
    backgroundColor: "#F0F8FF",
    borderWidth: 2,
    borderColor: "#00A8E8",
  },
  pushIcon: {
    backgroundColor: "#F0FFF0",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  emailIcon: {
    backgroundColor: "#FFF8F0",
    borderWidth: 2,
    borderColor: "#FF9800",
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  verificationInputGroup: {
    alignItems: "center",
    marginBottom: 24,
  },
  verificationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  verificationCodeContainer: {
    width: 200,
    marginBottom: 8,
  },
  verificationCodeInput: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 8,
  },
  verificationUnderline: {
    height: 3,
    backgroundColor: "#00A8E8",
    marginTop: 4,
    borderRadius: 2,
  },
  codeHintText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  autoFillButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F0F8FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E0F0FF",
  },
  autoFillText: {
    fontSize: 14,
    color: "#00A8E8",
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendButtonText: {
    fontSize: 14,
    color: "#00A8E8",
    fontWeight: "700",
  },
  resendButtonDisabled: {
    color: "#999",
  },
  verifyButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  verifyButtonLoading: {
    opacity: 0.9,
  },
  verifyButtonDisabled: {
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.2,
  },
  demoCodeContainer: {
    backgroundColor: "#F8F9FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E8EFFF",
  },
  demoCodeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00A8E8",
    marginBottom: 4,
  },
  demoCodeText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  demoCodeHighlight: {
    fontWeight: "700",
    color: "#00A8E8",
  },
  demoCodeNote: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
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
  // Push Notification Styles
  pushNotificationContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 10,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  pushNotification: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
  },
  notificationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: "#999",
  },
  notificationClose: {
    padding: 4,
  },
});