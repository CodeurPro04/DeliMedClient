import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { TextInput } from "react-native";
import waveLogo from '../../assets/images/icon.png';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Récupérer les données de la commande
  const pharmacyId = params.pharmacyId || "1";
  const items = params.items ? JSON.parse(params.items) : [];
  const subtotal = parseFloat(params.subtotal || "0");
  const total = parseFloat(params.total || "0");

  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState("");
  const [selectedAddressType, setSelectedAddressType] = useState("current");
  const [isConfirming, setIsConfirming] = useState(false);
  const [location, setLocation] = useState(null);
  const [addressInput, setAddressInput] = useState("");
  const [animation] = useState(new Animated.Value(0));
  const [showSuccess, setShowSuccess] = useState(false);

  // Données de la pharmacie
  const pharmacy = {
    "1": {
      id: "1",
      name: "Pharmacie de la Riviera Palmeraie",
      address: "Boulevard Mitterrand, Riviera Palmeraie, Cocody, Abidjan",
      deliveryTime: "10-20 min",
      image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80",
    },
    "2": {
      id: "2",
      name: "Pharmacie du Plateau Indénié",
      address: "Avenue Delafosse, Plateau, Abidjan",
      deliveryTime: "20-30 min",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    },
  }[pharmacyId] || pharmacy["1"];

  // Méthodes de paiement - avec logos spécifiques pour la Côte d'Ivoire
  const paymentMethods = [
    { 
      id: "cash", 
      name: "Espèces", 
      icon: "cash-outline", 
      description: "Payez à la livraison" 
    },
    { 
      id: "card", 
      name: "Carte bancaire", 
      icon: "card-outline", 
      description: "Paiement sécurisé" 
    },
    { 
      id: "orange", 
      name: "Orange Money", 
      icon: "logo-orange",
      description: "Paiement via Orange Money",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/4/45/Orange_Money_logo.svg/1200px-Orange_Money_logo.svg.png",
      color: "#FF7900"
    },
    { 
      id: "mtn", 
      name: "MTN MoMo", 
      icon: "logo-android",
      description: "Paiement via MTN Mobile Money",
      logo: "https://www.mtn.ci/wp-content/uploads/2020/07/momo.png",
      color: "#FFC400"
    },
    { 
      id: "wave", 
      name: "Wave", 
      icon: "logo-euro",
      description: "Paiement via Wave",
      logo: waveLogo,
      color: "#0066FF"
    },
  ];

  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobileMoneyCode, setMobileMoneyCode] = useState("");

  // Mobile Money providers specific data
  const mobileMoneyProviders = {
    "orange": {
      name: "Orange Money",
      logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/4/45/Orange_Money_logo.svg/1200px-Orange_Money_logo.svg.png",
      color: "#FF7900",
      description: "Paiement sécurisé via Orange Money",
      ussd: "#144#",
      format: "07 XX XX XX XX"
    },
    "mtn": {
      name: "MTN MoMo",
      logo: "https://www.mtn.ci/wp-content/uploads/2020/07/momo.png",
      color: "#FFC400",
      description: "Paiement sécurisé via MTN Mobile Money",
      ussd: "#156#",
      format: "05 XX XX XX XX"
    },
    "wave": {
      name: "Wave",
      logo: require('../assets/images/wave.png'),
      color: "#0066FF",
      description: "Paiement instantané via Wave",
      ussd: "WAVE .",
      format: "07 XX XX XX XX"
    }
  };

  // Récupérer la localisation actuelle
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation est nécessaire pour utiliser votre position actuelle."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      
      // Reverse geocoding pour obtenir l'adresse
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (addressResponse[0]) {
        const addr = addressResponse[0];
        const formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`.trim();
        setAddress(formattedAddress);
        setAddressInput(formattedAddress);
      }
    } catch (error) {
      console.error("Erreur de localisation:", error);
      Alert.alert("Erreur", "Impossible de récupérer votre position actuelle.");
    }
  };

  // Étapes de la commande
  const steps = [
    { id: 1, title: "Adresse", description: "Où livrer votre commande ?" },
    { id: 2, title: "Paiement", description: "Comment souhaitez-vous payer ?" },
    { id: 3, title: "Confirmation", description: "Vérifiez votre commande" },
  ];

  // Animation des étapes
  useEffect(() => {
    Animated.timing(animation, {
      toValue: currentStep,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!address.trim()) {
        Alert.alert("Adresse requise", "Veuillez saisir ou sélectionner une adresse de livraison.");
        return;
      }
    }
    if (currentStep === 2) {
      // Validation pour mobile money
      if (["orange", "mtn", "wave"].includes(selectedPayment)) {
        if (!phoneNumber.trim() || phoneNumber.length < 10) {
          Alert.alert("Numéro requis", "Veuillez saisir un numéro de téléphone valide.");
          return;
        }
      }
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      confirmOrder();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const confirmOrder = () => {
    setIsConfirming(true);
    
    // Simulation du traitement
    setTimeout(() => {
      setIsConfirming(false);
      setShowSuccess(true);
      
      // Redirection après 3 secondes
      setTimeout(() => {
        router.replace({
          pathname: "/order/success",
          params: {
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            pharmacyName: pharmacy.name,
            deliveryTime: pharmacy.deliveryTime,
            total: total.toString(),
            paymentMethod: paymentMethods.find(m => m.id === selectedPayment)?.name || "Espèces"
          },
        });
      }, 3000);
    }, 2000);
  };

  const handleUseCurrentLocation = async () => {
    setSelectedAddressType("current");
    await getCurrentLocation();
  };

  const handleCustomAddress = () => {
    setSelectedAddressType("custom");
    setAddress(addressInput);
  };

  // Fonction pour afficher les logos des mobile money
  const renderMobileMoneyLogos = () => {
    return (
      <View style={styles.mobileMoneyLogos}>
        <Text style={styles.mobileMoneyTitle}>Services de paiement disponibles:</Text>
        <View style={styles.logosContainer}>
          <View style={styles.logoItem}>
            <Image 
              source={{ uri: "https://www.rapyd.net/wp-content/uploads/2025/04/Orange-Money-logo-500x336-1.png" }}
              style={[styles.logoImage, { tintColor: "#FF7900" }]}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Orange</Text>
          </View>
          <View style={styles.logoItem}>
            <Image 
              source={{ uri: "https://cdn.prod.website-files.com/64199d190fc7afa82666d89c/6491bed05d55a53d01e67c92_mtn-mobile-money.webp" }}
              style={[styles.logoImage, { tintColor: "#FFC400" }]}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>MTN</Text>
          </View>
          <View style={styles.logoItem}>
            <Image 
              source={{ uri: "https://goamobile.com/logosent/wave@221@-P-2021-06-30_00-18-27wave_logo_2.png" }}
              style={[styles.logoImage, { tintColor: "#0066FF" }]}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Wave</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPaymentDetails = () => {
    if (["orange", "mtn", "wave"].includes(selectedPayment)) {
      const provider = mobileMoneyProviders[selectedPayment];
      return (
        <View style={[styles.mobileMoneyDetails, { borderColor: provider.color }]}>
          <View style={styles.providerHeader}>
            <Image 
              source={{ uri: provider.logo }}
              style={[styles.providerLogo, { tintColor: provider.color }]}
              resizeMode="contain"
            />
            <Text style={[styles.providerName, { color: provider.color }]}>
              {provider.name}
            </Text>
          </View>
          
          <Text style={styles.providerDescription}>
            {provider.description}
          </Text>
          
          <View style={styles.phoneInputContainer}>
            <Text style={styles.inputLabel}>Numéro de téléphone</Text>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+225</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder={provider.format}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <Text style={styles.inputHint}>
              Format: {provider.format}
            </Text>
          </View>
          
          <View style={styles.codeInputContainer}>
            <Text style={styles.inputLabel}>Code de transaction (optionnel)</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="Entrez le code reçu par SMS"
              value={mobileMoneyCode}
              onChangeText={setMobileMoneyCode}
              secureTextEntry
              maxLength={6}
            />
          </View>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={provider.color} />
            <Text style={[styles.infoText, { color: provider.color }]}>
              Vous recevrez une demande de paiement sur votre téléphone via {provider.ussd}
            </Text>
          </View>
        </View>
      );
    }
    
    if (selectedPayment === "card") {
      return (
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>Détails de la carte</Text>
          <View style={styles.cardInputGroup}>
            <View style={styles.cardInput}>
              <Text style={styles.cardLabel}>Numéro de carte</Text>
              <TextInput
                style={styles.cardInputField}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.cardRow}>
              <View style={[styles.cardInput, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.cardLabel}>Date d&apos;expiration</Text>
                <TextInput
                  style={styles.cardInputField}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.cardInput, { flex: 1 }]}>
                <Text style={styles.cardLabel}>CVV</Text>
                <TextInput
                  style={styles.cardInputField}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>
      );
    }
    
    return null;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Où livrer votre commande ?</Text>
            
            {/* Option 1: Localisation actuelle */}
            <TouchableOpacity
              style={[
                styles.addressOption,
                selectedAddressType === "current" && styles.addressOptionSelected,
              ]}
              onPress={handleUseCurrentLocation}
            >
              <View style={styles.addressOptionIcon}>
                <Ionicons 
                  name="location" 
                  size={24} 
                  color={selectedAddressType === "current" ? "#00A8E8" : "#666"} 
                />
              </View>
              <View style={styles.addressOptionContent}>
                <Text style={styles.addressOptionTitle}>Utiliser ma position actuelle</Text>
                <Text style={styles.addressOptionText}>
                  {address || "Appuyez pour activer la localisation"}
                </Text>
                {location && (
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                        }}
                        title="Votre position"
                      />
                    </MapView>
                  </View>
                )}
              </View>
              {selectedAddressType === "current" && (
                <Ionicons name="checkmark-circle" size={24} color="#00A8E8" />
              )}
            </TouchableOpacity>

            {/* Option 2: Adresse personnalisée */}
            <TouchableOpacity
              style={[
                styles.addressOption,
                selectedAddressType === "custom" && styles.addressOptionSelected,
                { marginTop: 16 },
              ]}
              onPress={handleCustomAddress}
            >
              <View style={styles.addressOptionIcon}>
                <Ionicons 
                  name="home" 
                  size={24} 
                  color={selectedAddressType === "custom" ? "#00A8E8" : "#666"} 
                />
              </View>
              <View style={styles.addressOptionContent}>
                <Text style={styles.addressOptionTitle}>Saisir une adresse</Text>
                <View style={styles.addressInputContainer}>
                  <Ionicons name="search" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.addressInput}
                    placeholder="Entrez votre adresse complète..."
                    value={addressInput}
                    onChangeText={setAddressInput}
                    onFocus={() => setSelectedAddressType("custom")}
                  />
                </View>
                {selectedAddressType === "custom" && addressInput && (
                  <View style={styles.addressPreview}>
                    <Ionicons name="navigate" size={16} color="#666" />
                    <Text style={styles.addressPreviewText}>{addressInput}</Text>
                  </View>
                )}
              </View>
              {selectedAddressType === "custom" && (
                <Ionicons name="checkmark-circle" size={24} color="#00A8E8" />
              )}
            </TouchableOpacity>

            {/* Note d'information */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#00A8E8" />
              <Text style={styles.infoText}>
                Votre livreur utilisera cette adresse pour la livraison. Assurez-vous qu&apos;elle est exacte.
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Comment souhaitez-vous payer ?</Text>
            
            {renderMobileMoneyLogos()}
            
            {paymentMethods.map((method) => {
              const isMobileMoney = ["orange", "mtn", "wave"].includes(method.id);
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    selectedPayment === method.id && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <View style={styles.paymentIconContainer}>
                    {isMobileMoney && method.logo ? (
                      <Image 
                        source={{ uri: method.logo }}
                        style={[styles.paymentLogo, { tintColor: method.color }]}
                        resizeMode="contain"
                      />
                    ) : (
                      <Ionicons 
                        name={method.icon} 
                        size={24} 
                        color={selectedPayment === method.id ? "#00A8E8" : "#666"} 
                      />
                    )}
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    <Text style={styles.paymentDescription}>{method.description}</Text>
                  </View>
                  {selectedPayment === method.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#00A8E8" />
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Détails de paiement */}
            {renderPaymentDetails()}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Vérifiez votre commande</Text>
            
            {/* Pharmacie */}
            <View style={styles.orderSection}>
              <Text style={styles.sectionTitle}>Pharmacie</Text>
              <View style={styles.pharmacySummary}>
                <Image source={{ uri: pharmacy.image }} style={styles.pharmacyImage} />
                <View style={styles.pharmacySummaryInfo}>
                  <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                  <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
                  <Text style={styles.deliveryTime}>Livraison: {pharmacy.deliveryTime}</Text>
                </View>
              </View>
            </View>

            {/* Articles */}
            <View style={styles.orderSection}>
              <Text style={styles.sectionTitle}>Articles ({items.length})</Text>
              {items.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.orderItemPrice}>{item.total.toLocaleString()} FCFA</Text>
                </View>
              ))}
            </View>

            {/* Adresse de livraison */}
            <View style={styles.orderSection}>
              <Text style={styles.sectionTitle}>Adresse de livraison</Text>
              <View style={styles.deliveryAddress}>
                <Ionicons name="location" size={20} color="#00A8E8" />
                <Text style={styles.deliveryAddressText}>{address}</Text>
              </View>
            </View>

            {/* Mode de paiement */}
            <View style={styles.orderSection}>
              <Text style={styles.sectionTitle}>Mode de paiement</Text>
              <View style={styles.paymentSummary}>
                {["orange", "mtn", "wave"].includes(selectedPayment) ? (
                  <Image 
                    source={{ uri: paymentMethods.find(m => m.id === selectedPayment)?.logo }}
                    style={[styles.paymentSummaryLogo, { 
                      tintColor: paymentMethods.find(m => m.id === selectedPayment)?.color 
                    }]}
                    resizeMode="contain"
                  />
                ) : (
                  <Ionicons 
                    name={paymentMethods.find(m => m.id === selectedPayment)?.icon || "cash-outline"} 
                    size={20} 
                    color="#00A8E8" 
                  />
                )}
                <View style={styles.paymentSummaryInfo}>
                  <Text style={styles.paymentSummaryText}>
                    {paymentMethods.find(m => m.id === selectedPayment)?.name}
                  </Text>
                  {["orange", "mtn", "wave"].includes(selectedPayment) && phoneNumber && (
                    <Text style={styles.paymentSummaryPhone}>Numéro: {phoneNumber}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Récapitulatif */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total</Text>
                <Text style={styles.summaryValue}>{subtotal.toLocaleString()} FCFA</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frais de livraison</Text>
                <Text style={styles.summaryValue}>0</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>{total.toLocaleString()} FCFA</Text>
              </View>
            </View>

            {/* Conditions */}
            <View style={styles.conditions}>
              <Text style={styles.conditionsText}>
                En confirmant votre commande, vous acceptez nos conditions générales d&apos;utilisation.
                Vous pourrez suivre l&apos;avancement de votre commande dans l&apos;espace Mes commandes.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
        
        <View style={styles.statusBarBackground} />
        
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successHeader}>
            <Text style={styles.successTitle}>Commande effectuée !</Text>
          </View>
        </SafeAreaView>

        <View style={styles.successContent}>
          <Animated.View style={styles.successAnimation}>
            <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
            <View style={styles.successRing} />
          </Animated.View>
          
          <Text style={styles.successMessage}>Votre commande a été effectuée avec succès</Text>
          <Text style={styles.successSubtitle}>
            Vous pouvez suivre l&apos;avancement de votre commande dans votre espace Mes commandes.
          </Text>
          
          <View style={styles.successInfo}>
            <View style={styles.successInfoItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.successInfoText}>Livraison estimée: {pharmacy.deliveryTime}</Text>
            </View>
            <View style={styles.successInfoItem}>
              <Ionicons name="medical-outline" size={20} color="#666" />
              <Text style={styles.successInfoText}>{pharmacy.name}</Text>
            </View>
            <View style={styles.successInfoItem}>
              <Ionicons name="card-outline" size={20} color="#666" />
              <Text style={styles.successInfoText}>
                Paiement: {paymentMethods.find(m => m.id === selectedPayment)?.name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      
      <View style={styles.statusBarBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePreviousStep}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirmation</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {steps.map((step) => (
            <View key={step.id} style={styles.stepIndicatorContainer}>
              <View
                style={[
                  styles.stepIndicator,
                  currentStep >= step.id && styles.stepIndicatorActive,
                ]}
              >
                <Text style={[
                  styles.stepNumber,
                  currentStep >= step.id && styles.stepNumberActive,
                ]}>
                  {step.id}
                </Text>
              </View>
              <Text style={[
                styles.stepTitleSmall,
                currentStep >= step.id && styles.stepTitleActive,
              ]}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.progressLineBackground}>
          <Animated.View 
            style={[
              styles.progressLineFill,
              {
                width: animation.interpolate({
                  inputRange: [1, 3],
                  outputRange: ['33%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerTotal}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalPrice}>{total.toLocaleString()} FCFA</Text>
          </View>
          
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleNextStep}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="reload-outline" size={20} color="white" style={styles.spinner} />
                <Text style={styles.confirmButtonText}>Traitement en cours...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.confirmButtonText}>
                  {currentStep === steps.length ? "Confirmer la commande" : "Continuer"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  progressContainer: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stepIndicatorContainer: {
    alignItems: "center",
    zIndex: 2,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepIndicatorActive: {
    backgroundColor: "#00A8E8",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#999",
  },
  stepNumberActive: {
    color: "white",
  },
  stepTitleSmall: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  stepTitleActive: {
    color: "#00A8E8",
  },
  progressLineBackground: {
    position: "absolute",
    top: 36,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: "#E0E0E0",
  },
  progressLineFill: {
    height: 2,
    backgroundColor: "#00A8E8",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stepContent: {
    marginTop: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 24,
  },
  addressOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  addressOptionSelected: {
    borderColor: "#00A8E8",
    backgroundColor: "#F0F9FF",
  },
  addressOptionIcon: {
    marginRight: 16,
  },
  addressOptionContent: {
    flex: 1,
  },
  addressOptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  addressOptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  mapContainer: {
    marginTop: 12,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 8,
  },
  addressPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    gap: 8,
  },
  addressPreviewText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#00A8E8",
    lineHeight: 18,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  paymentOptionSelected: {
    borderColor: "#00A8E8",
    backgroundColor: "#F0F9FF",
  },
  paymentIconContainer: {
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentLogo: {
    width: 32,
    height: 32,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 13,
    color: "#666",
  },
  mobileMoneyLogos: {
    marginBottom: 24,
  },
  mobileMoneyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  logosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  logoItem: {
    alignItems: "center",
  },
  logoImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  mobileMoneyDetails: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 2,
    borderTopColor: "#00A8E8",
    borderLeftColor: "#F0F0F0",
    borderRightColor: "#F0F0F0",
    borderBottomColor: "#F0F0F0",
  },
  providerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  providerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "700",
  },
  providerDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  phoneInputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#E0E0E0",
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  inputHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  codeInputContainer: {
    marginBottom: 16,
  },
  codeInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  cardDetails: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  cardInputGroup: {
    gap: 16,
  },
  cardInput: {
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  cardInputField: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  cardRow: {
    flexDirection: "row",
  },
  orderSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  pharmacySummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  pharmacyImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  pharmacySummaryInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 13,
    color: "#00A8E8",
    fontWeight: "600",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: "#666",
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00A8E8",
  },
  deliveryAddress: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  deliveryAddressText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  paymentSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentSummaryLogo: {
    width: 32,
    height: 32,
  },
  paymentSummaryInfo: {
    flex: 1,
  },
  paymentSummaryText: {
    fontSize: 14,
    color: "#666",
  },
  paymentSummaryPhone: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#00A8E8",
  },
  conditions: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  conditionsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    textAlign: "center",
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
  footerTotal: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  footerTotalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#00A8E8",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00A8E8",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    animationKeyframes: {
      '0%': { transform: [{ rotate: '0deg' }] },
      '100%': { transform: [{ rotate: '360deg' }] },
    },
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  successHeader: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "ios" ? 0 : 12,
    alignItems: "center",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  successContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  successAnimation: {
    position: "relative",
    marginBottom: 32,
  },
  successRing: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 70,
    opacity: 0.3,
  },
  successMessage: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  successInfo: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  successInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  successInfoText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
});