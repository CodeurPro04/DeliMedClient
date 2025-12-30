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
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const PAYMENT_LOGOS = {
  orange: require('../assets/images/orange.png'),
  mtn: require('../assets/images/mtn.png'),
  wave: require('../assets/images/wave.png'),
};

const PHARMACIES = {
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
};

const PAYMENT_METHODS = [
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
    description: "Paiement via Orange Money",
    color: "#FF7900"
  },
  { 
    id: "mtn", 
    name: "MTN MoMo", 
    description: "Paiement via MTN Mobile Money",
    color: "#FFC400"
  },
  { 
    id: "wave", 
    name: "Wave", 
    description: "Paiement instantané via Wave",
    color: "#0066FF"
  },
];

const MOBILE_MONEY_PROVIDERS = {
  orange: {
    name: "Orange Money",
    color: "#FF7900",
    description: "Paiement sécurisé via Orange Money",
    ussd: "#144#",
    format: "07 XX XX XX XX"
  },
  mtn: {
    name: "MTN MoMo",
    color: "#FFC400",
    description: "Paiement sécurisé via MTN Mobile Money",
    ussd: "#156#",
    format: "05 XX XX XX XX"
  },
  wave: {
    name: "Wave",
    color: "#0066FF",
    description: "Paiement instantané via Wave",
    ussd: "WAVE",
    format: "07 XX XX XX XX"
  }
};

const CHECKOUT_STEPS = [
  { id: 1, title: "Adresse", description: "Où livrer votre commande ?" },
  { id: 2, title: "Paiement", description: "Comment souhaitez-vous payer ?" },
  { id: 3, title: "Confirmation", description: "Vérifiez votre commande" },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const pharmacyId = params.pharmacyId || "1";
  const items = params.items ? JSON.parse(params.items) : [];
  const subtotal = parseFloat(params.subtotal || "0");
  const total = parseFloat(params.total || "0");
  const pharmacy = PHARMACIES[pharmacyId] || PHARMACIES["1"];

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressType, setSelectedAddressType] = useState("current");
  const [address, setAddress] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobileMoneyCode, setMobileMoneyCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: currentStep,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);


  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation est nécessaire pour utiliser votre position actuelle."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (addressResponse[0]) {
        const addr = addressResponse[0];
        const formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`.trim();
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Erreur de localisation:", error);
      Alert.alert("Erreur", "Impossible de récupérer votre position actuelle.");
    }
  };

  const handleUseCurrentLocation = async () => {
    setSelectedAddressType("current");
    await getCurrentLocation();
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const finalAddress = selectedAddressType === "current" ? address : addressInput;
      
      if (!finalAddress.trim()) {
        Alert.alert("Adresse requise", "Veuillez saisir ou sélectionner une adresse de livraison.");
        return false;
      }
      
      if (!contactPhone.trim() || contactPhone.length < 10) {
        Alert.alert("Téléphone requis", "Veuillez saisir un numéro de téléphone valide pour la livraison.");
        return false;
      }
      
      setAddress(finalAddress);
    }
    
    if (currentStep === 2) {
      if (["orange", "mtn", "wave"].includes(selectedPayment)) {
        if (!phoneNumber.trim() || phoneNumber.length < 10) {
          Alert.alert("Numéro requis", "Veuillez saisir un numéro de téléphone valide.");
          return false;
        }
      }
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep()) return;
    
    if (currentStep < CHECKOUT_STEPS.length) {
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
    
    setTimeout(() => {
      setIsConfirming(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.replace({
          pathname: "/order/success",
          params: {
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            pharmacyName: pharmacy.name,
            deliveryTime: pharmacy.deliveryTime,
            total: total.toString(),
            paymentMethod: PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name || "Espèces"
          },
        });
      }, 3000);
    }, 2000);
  };

  const renderContactSection = () => (
    <View style={styles.contactSection}>
      <Text style={styles.contactLabel}>
        <Ionicons name="call" size={16} color="#00A8E8" /> Numéro de téléphone pour la livraison
      </Text>
      <View style={styles.contactInputWrapper}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+225</Text>
        </View>
        <TextInput
          style={styles.contactInput}
          placeholder="07 XX XX XX XX"
          value={contactPhone}
          onChangeText={setContactPhone}
          keyboardType="phone-pad"
          maxLength={10}
          placeholderTextColor="#999"
        />
      </View>
      <Text style={styles.contactHint}>
        Le livreur vous contactera sur ce numéro
      </Text>
    </View>
  );

  const renderCurrentLocationOption = () => (
    <TouchableOpacity
      style={[
        styles.addressOption,
        selectedAddressType === "current" && styles.addressOptionSelected,
      ]}
      onPress={handleUseCurrentLocation}
    >
      <View style={styles.addressOptionHeader}>
        <View style={styles.addressOptionIcon}>
          <Ionicons 
            name="location" 
            size={24} 
            color={selectedAddressType === "current" ? "#00A8E8" : "#666"} 
          />
        </View>
        <View style={styles.addressOptionContent}>
          <Text style={styles.addressOptionTitle}>Ma position actuelle</Text>
          <Text style={styles.addressOptionDesc}>Utiliser le GPS</Text>
        </View>
        {selectedAddressType === "current" && (
          <Ionicons name="checkmark-circle" size={24} color="#00A8E8" />
        )}
      </View>
      
      {selectedAddressType === "current" && address && (
        <View style={styles.selectedAddressPreview}>
          <Ionicons name="navigate" size={16} color="#00A8E8" />
          <Text style={styles.selectedAddressText}>{address}</Text>
        </View>
      )}
      
      {selectedAddressType === "current" && location && (
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
    </TouchableOpacity>
  );

  const renderCustomAddressOption = () => (
    <TouchableOpacity
      style={[
        styles.addressOption,
        selectedAddressType === "custom" && styles.addressOptionSelected,
      ]}
      onPress={() => setSelectedAddressType("custom")}
    >
      <View style={styles.addressOptionHeader}>
        <View style={styles.addressOptionIcon}>
          <Ionicons 
            name="create-outline" 
            size={24} 
            color={selectedAddressType === "custom" ? "#00A8E8" : "#666"} 
          />
        </View>
        <View style={styles.addressOptionContent}>
          <Text style={styles.addressOptionTitle}>Adresse personnalisée</Text>
          <Text style={styles.addressOptionDesc}>Saisir manuellement</Text>
        </View>
        {selectedAddressType === "custom" && addressInput && (
          <Ionicons name="checkmark-circle" size={24} color="#00A8E8" />
        )}
      </View>
      
      {selectedAddressType === "custom" && (
        <View style={styles.customAddressInput}>
          <View style={styles.addressInputContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.addressInput}
              placeholder="Ex: Rue 12, Cocody, Abidjan..."
              value={addressInput}
              onChangeText={setAddressInput}
              multiline
              numberOfLines={2}
              placeholderTextColor="#999"
            />
          </View>
          
          {addressInput.trim() && (
            <View style={styles.addressPreview}>
              <Ionicons name="location" size={16} color="#00A8E8" />
              <Text style={styles.addressPreviewText}>{addressInput}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAddressStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Où livrer votre commande ?</Text>
      
      {renderContactSection()}
      {renderCurrentLocationOption()}
      {renderCustomAddressOption()}
      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#00A8E8" />
        <Text style={styles.infoText}>
          Assurez-vous que votre adresse est exacte pour une livraison rapide
        </Text>
      </View>
    </View>
  );

  const renderMobileMoneyDetails = () => {
    if (!["orange", "mtn", "wave"].includes(selectedPayment)) return null;
    
    const provider = MOBILE_MONEY_PROVIDERS[selectedPayment];
    const method = PAYMENT_METHODS.find(m => m.id === selectedPayment);
    const isWave = selectedPayment === "wave";
    
    return (
      <View style={[styles.paymentDetailsCard, { borderLeftColor: provider.color }]}>
        <View style={styles.detailsHeader}>
          <Image 
            source={PAYMENT_LOGOS[selectedPayment]}
            style={styles.detailsLogo}
            resizeMode="contain"
          />
          <View style={styles.detailsHeaderText}>
            <Text style={[styles.detailsTitle, { color: provider.color }]}>
              {provider.name}
            </Text>
            <Text style={styles.detailsSubtitle}>
              {provider.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            <Ionicons name="call-outline" size={16} color="#666" /> Numéro de téléphone
          </Text>
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
              placeholderTextColor="#999"
            />
          </View>
        </View>
        
        {!isWave && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#666" /> Code de transaction (optionnel)
            </Text>
            <TextInput
              style={styles.codeInput}
              placeholder="Code reçu par SMS"
              value={mobileMoneyCode}
              onChangeText={setMobileMoneyCode}
              secureTextEntry
              maxLength={6}
              placeholderTextColor="#999"
            />
          </View>
        )}
        
        <View style={[styles.ussdInfo, { backgroundColor: `${provider.color}15` }]}>
          <Ionicons name="information-circle" size={20} color={provider.color} />
          <Text style={styles.ussdText}>
            {isWave 
              ? `Vous serez redirigé vers Wave pour valider le paiement de ${total.toLocaleString()} FCFA`
              : `Vous recevrez une demande de paiement via ${provider.ussd}`
            }
          </Text>
        </View>
      </View>
    );
  };

  const renderCardDetails = () => {
    if (selectedPayment !== "card") return null;
    
    return (
      <View style={styles.paymentDetailsCard}>
        <Text style={styles.detailsSectionTitle}>Informations de la carte</Text>
        
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Numéro de carte</Text>
          <TextInput
            style={styles.cardInputField}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.cardRow}>
          <View style={[styles.inputSection, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Expiration</Text>
            <TextInput
              style={styles.cardInputField}
              placeholder="MM/AA"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputSection, { flex: 1 }]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.cardInputField}
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderCashDetails = () => {
    if (selectedPayment !== "cash") return null;
    
    return (
      <View style={styles.paymentDetailsCard}>
        <View style={styles.cashInfo}>
          <Ionicons name="cash-outline" size={40} color="#00A8E8" />
          <Text style={styles.cashInfoTitle}>Paiement à la livraison</Text>
          <Text style={styles.cashInfoText}>
            Préparez le montant exact si possible pour faciliter la transaction
          </Text>
        </View>
      </View>
    );
  };

  const renderPaymentOption = (method) => {
    const isMobileMoney = ["orange", "mtn", "wave"].includes(method.id);
    const isSelected = selectedPayment === method.id;
    
    return (
      <View key={method.id}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            isSelected && styles.paymentOptionSelected,
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <View style={styles.paymentIconContainer}>
            {isMobileMoney ? (
              <Image 
                source={PAYMENT_LOGOS[method.id]}
                style={styles.paymentLogo}
                resizeMode="contain"
              />
            ) : (
              <Ionicons 
                name={method.icon} 
                size={28} 
                color={isSelected ? "#00A8E8" : "#666"} 
              />
            )}
          </View>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentName, isSelected && styles.paymentNameSelected]}>
              {method.name}
            </Text>
            <Text style={styles.paymentDescription}>{method.description}</Text>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#00A8E8" />
          )}
        </TouchableOpacity>
        
        {isSelected && (
          <>
            {renderMobileMoneyDetails()}
            {renderCardDetails()}
            {renderCashDetails()}
          </>
        )}
      </View>
    );
  };

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choisissez votre mode de paiement</Text>
      {PAYMENT_METHODS.map(renderPaymentOption)}
    </View>
  );

  const renderPharmacySection = () => (
    <View style={styles.summarySection}>
      <View style={styles.summarySectionHeader}>
        <Ionicons name="medical" size={20} color="#00A8E8" />
        <Text style={styles.summarySectionTitle}>Pharmacie</Text>
      </View>
      <View style={styles.pharmacySummary}>
        <Image source={{ uri: pharmacy.image }} style={styles.pharmacyImage} />
        <View style={styles.pharmacySummaryInfo}>
          <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
          <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
          <View style={styles.deliveryTimeContainer}>
            <Ionicons name="time-outline" size={14} color="#00A8E8" />
            <Text style={styles.deliveryTime}>{pharmacy.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItemsSection = () => (
    <View style={styles.summarySection}>
      <View style={styles.summarySectionHeader}>
        <Ionicons name="cart" size={20} color="#00A8E8" />
        <Text style={styles.summarySectionTitle}>Articles ({items.length})</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.orderItem}>
          <View style={styles.orderItemInfo}>
            <Text style={styles.orderItemName}>{item.name}</Text>
            <Text style={styles.orderItemQuantity}>Quantité: {item.quantity}</Text>
          </View>
          <Text style={styles.orderItemPrice}>{item.total.toLocaleString()} FCFA</Text>
        </View>
      ))}
    </View>
  );

  const renderDeliverySection = () => (
    <View style={styles.summarySection}>
      <View style={styles.summarySectionHeader}>
        <Ionicons name="location" size={20} color="#00A8E8" />
        <Text style={styles.summarySectionTitle}>Livraison</Text>
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryInfoLabel}>Adresse:</Text>
        <Text style={styles.deliveryInfoText}>{address}</Text>
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryInfoLabel}>Contact:</Text>
        <Text style={styles.deliveryInfoText}>+225 {contactPhone}</Text>
      </View>
    </View>
  );

  const renderPaymentSection = () => {
    const method = PAYMENT_METHODS.find(m => m.id === selectedPayment);
    const isMobileMoney = ["orange", "mtn", "wave"].includes(selectedPayment);
    
    return (
      <View style={styles.summarySection}>
        <View style={styles.summarySectionHeader}>
          <Ionicons name="card" size={20} color="#00A8E8" />
          <Text style={styles.summarySectionTitle}>Paiement</Text>
        </View>
        <View style={styles.paymentSummary}>
          {isMobileMoney ? (
            <Image 
              source={PAYMENT_LOGOS[selectedPayment]}
              style={styles.paymentSummaryLogo}
              resizeMode="contain"
            />
          ) : (
            <Ionicons 
              name={method?.icon || "cash-outline"} 
              size={24} 
              color="#00A8E8" 
            />
          )}
          <View style={styles.paymentSummaryInfo}>
            <Text style={styles.paymentSummaryName}>{method?.name}</Text>
            {isMobileMoney && phoneNumber && (
              <Text style={styles.paymentSummaryPhone}>+225 {phoneNumber}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTotalSection = () => (
    <View style={styles.totalCard}>
      <View style={styles.totalRow}>
        <Text style={styles.totalRowLabel}>Sous-total</Text>
        <Text style={styles.totalRowValue}>{subtotal.toLocaleString()} FCFA</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalRowLabel}>Livraison</Text>
        <Text style={styles.totalRowValue}>0</Text>
      </View>
      <View style={styles.totalDivider} />
      <View style={styles.grandTotalRow}>
        <Text style={styles.grandTotalLabel}>Total à payer</Text>
        <Text style={styles.grandTotalValue}>{total.toLocaleString()} FCFA</Text>
      </View>
    </View>
  );

  const renderConfirmationStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Récapitulatif de votre commande</Text>
      
      {renderPharmacySection()}
      {renderItemsSection()}
      {renderDeliverySection()}
      {renderPaymentSection()}
      {renderTotalSection()}
      
      <View style={styles.termsBox}>
        <Ionicons name="shield-checkmark" size={16} color="#666" />
        <Text style={styles.termsText}>
          En confirmant, vous acceptez nos conditions d'utilisation
        </Text>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressSteps}>
        {CHECKOUT_STEPS.map((step, index) => (
          <View key={step.id} style={styles.progressStep}>
            <View style={[
              styles.progressCircle,
              currentStep >= step.id && styles.progressCircleActive,
            ]}>
              <Text style={[
                styles.progressNumber,
                currentStep >= step.id && styles.progressNumberActive,
              ]}>
                {step.id}
              </Text>
            </View>
            <Text style={[
              styles.progressLabel,
              currentStep >= step.id && styles.progressLabelActive,
            ]}>
              {step.title}
            </Text>
            {index < CHECKOUT_STEPS.length - 1 && (
              <View style={[
                styles.progressLine,
                currentStep > step.id && styles.progressLineActive,
              ]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>{total.toLocaleString()} FCFA</Text>
        </View>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStep}
          disabled={isConfirming}
        >
          {isConfirming ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.nextButtonText}>Traitement...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentStep === CHECKOUT_STEPS.length ? "Confirmer" : "Continuer"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuccessScreen = () => (
    <View style={styles.successContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      <View style={styles.statusBarBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successHeader}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.successHeaderTitle}>Commande confirmée</Text>
        </View>
      </SafeAreaView>

      <View style={styles.successContent}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        </View>
        
        <Text style={styles.successMessage}>Commande effectuée avec succès !</Text>
        <Text style={styles.successSubtitle}>
          Un livreur a été assigné à votre commande
        </Text>
        
        <View style={styles.successDetails}>
          <View style={styles.successDetailItem}>
            <Ionicons name="time" size={20} color="#00A8E8" />
            <Text style={styles.successDetailText}>Livraison: {pharmacy.deliveryTime}</Text>
          </View>
          <View style={styles.successDetailItem}>
            <Ionicons name="call" size={20} color="#00A8E8" />
            <Text style={styles.successDetailText}>Contact: +225 {contactPhone}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderAddressStep();
      case 2:
        return renderPaymentStep();
      case 3:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  if (showSuccess) {
    return renderSuccessScreen();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      <View style={styles.statusBarBackground} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paiement</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>

      {renderProgressBar()}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
        <View style={{ height: 120 }} />
      </ScrollView>

      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepContent: {
    gap: 20,
  },

  header: {
    backgroundColor: "#00A8E8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  headerPlaceholder: {
    width: 40,
  },

  progressContainer: {
    backgroundColor: "white",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressStep: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    zIndex: 2,
  },
  progressCircleActive: {
    backgroundColor: "#00A8E8",
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  progressNumberActive: {
    color: "white",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  progressLabelActive: {
    color: "#00A8E8",
  },
  progressLine: {
    position: "absolute",
    top: 18,
    left: "50%",
    right: "-50%",
    height: 2,
    backgroundColor: "#E5E7EB",
    zIndex: 1,
  },
  progressLineActive: {
    backgroundColor: "#00A8E8",
  },

  stepTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },

  contactSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  contactInputWrapper: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  contactInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  contactHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },

  addressOption: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  addressOptionSelected: {
    borderColor: "#00A8E8",
    backgroundColor: "#F0F9FF",
  },
  addressOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addressOptionContent: {
    flex: 1,
  },
  addressOptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  addressOptionDesc: {
    fontSize: 14,
    color: "#6B7280",
  },
  selectedAddressPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
    gap: 8,
  },
  selectedAddressText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  mapContainer: {
    marginTop: 16,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  customAddressInput: {
    marginTop: 16,
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  addressInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    minHeight: 50,
    textAlignVertical: "top",
  },
  addressPreview: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
    gap: 8,
  },
  addressPreviewText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },

  paymentOption: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: "#00A8E8",
    backgroundColor: "#F0F9FF",
  },
  paymentIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  paymentLogo: {
    width: 40,
    height: 40,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  paymentNameSelected: {
    color: "#00A8E8",
  },
  paymentDescription: {
    fontSize: 13,
    color: "#6B7280",
  },

  paymentDetailsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginTop: -8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderLeftWidth: 4,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  detailsLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  detailsHeaderText: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  detailsSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  codeInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontWeight: "500",
  },
  ussdInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  ussdText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  cardInputField: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  cashInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  cashInfoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  cashInfoText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  summarySection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summarySectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  pharmacySummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  pharmacyImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  pharmacySummaryInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  deliveryTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    borderBottomColor: "#F3F4F6",
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: "#6B7280",
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00A8E8",
  },
  deliveryInfo: {
    marginBottom: 12,
  },
  deliveryInfoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  deliveryInfoText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  paymentSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentSummaryLogo: {
    width: 36,
    height: 36,
  },
  paymentSummaryInfo: {
    flex: 1,
  },
  paymentSummaryName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  paymentSummaryPhone: {
    fontSize: 13,
    color: "#6B7280",
  },
  totalCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalRowLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  totalRowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  totalDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#00A8E8",
  },
  termsBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footerLeft: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#00A8E8",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00A8E8",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#00A8E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  successContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  successHeader: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  successHeaderTitle: {
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
  successIconContainer: {
    marginBottom: 32,
  },
  successMessage: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  successDetails: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  successDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  successDetailText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
});