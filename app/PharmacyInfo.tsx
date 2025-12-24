import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Données simulées 
const pharmaciesData = {
  '1': {
    id: '1',
    name: 'Pharmacie Porte de Montreuil',
    address: '2 Av. de la Prte de Montreuil, 75020 Paris, France',
    distance: '9.90 km',
    closingTime: '23:59',
    phone: '+33 1 43 73 81 04',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80',
    rating: 4.7,
    reviews: 128,
    deliveryTime: '30-45 min',
  },
  '2': {
    id: '2',
    name: 'Pharmacie de la Porte des Lilas',
    address: '168 Bd Mortier, 75020 Paris, France',
    distance: '10.11 km',
    closingTime: '20:00',
    phone: '+33 1 43 73 82 05',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    rating: 4.5,
    reviews: 95,
    deliveryTime: '17-22 min',
  },
  '3': {
    id: '3',
    name: 'Pharmacie Centrale',
    address: '15 Rue de la République, 75011 Paris, France',
    distance: '12.5 km',
    closingTime: '19:30',
    phone: '+33 1 43 73 83 06',
    isOpen: false,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80',
    rating: 4.3,
    reviews: 210,
    deliveryTime: '10-15 min',
  },
  '4': {
    id: '4',
    name: 'Pharmacie du Marché',
    address: '8 Place du Marché, 75018 Paris, France',
    distance: '15.2 km',
    closingTime: '20:00',
    phone: '+33 1 43 73 84 07',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    rating: 4.8,
    reviews: 156,
    deliveryTime: '15-20 min',
  },
  '5': {
    id: '5',
    name: 'Pharmacie Saint-Martin',
    address: '45 Boulevard Saint-Martin, 75003 Paris, France',
    distance: '7.3 km',
    closingTime: '22:00',
    phone: '+33 1 43 73 85 08',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1585435421671-0c16764179c0?w=800&q=80',
    rating: 4.6,
    reviews: 187,
    deliveryTime: '5-10 min',
  },
};

export default function PharmacyInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<any>(null);

  // Récupérer l'ID depuis l'URL
  const pharmacyId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    // Simulation d'une requête API
    setTimeout(() => {
      const foundPharmacy = pharmaciesData[pharmacyId as keyof typeof pharmaciesData] || pharmaciesData['1'];
      setPharmacy(foundPharmacy);
      setLoading(false);
    }, 500);
  }, [pharmacyId]);

  // Catégories de produits sans ordonnance
  const productCategories = [
    { id: '1', name: 'Appareil digestif', icon: 'medical-outline', color: '#4CAF50' },
    { id: '2', name: 'Dermatologie', icon: 'body-outline', color: '#2196F3' },
    { id: '3', name: 'Douleurs articulaires et musculaires', icon: 'fitness-outline', color: '#FF9800' },
    { id: '4', name: 'Soins des yeux', icon: 'eye-outline', color: '#9C27B0' },
    { id: '5', name: 'Santé ORL', icon: 'ear-outline', color: '#00BCD4' },
    { id: '6', name: 'Premiers secours', icon: 'medkit-outline', color: '#F44336' },
    { id: '7', name: 'Soins bébé', icon: 'happy-outline', color: '#FF4081' },
    { id: '8', name: 'Hygiène bucco-dentaire', icon: 'sparkles-outline', color: '#795548' },
  ];

  // Produits populaires
  const popularProducts = [
    { id: '1', name: 'Paracétamol 500mg', category: 'Douleurs', price: '2.50€' },
    { id: '2', name: 'Vitamine C', category: 'Immunité', price: '8.90€' },
    { id: '3', name: 'Gel hydroalcoolique', category: 'Hygiène', price: '4.20€' },
    { id: '4', name: 'Masques FFP2', category: 'Protection', price: '12.90€' },
  ];

  const handleAddPrescription = () => {
    setPrescriptionModalVisible(true);
  };

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleOrder = () => {
    if (selectedProducts.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des produits avant de commander');
      return;
    }
    router.push({
      pathname: '/cart',
      params: { pharmacyId: pharmacy.id, products: selectedProducts.join(',') }
    });
  };

  if (loading || !pharmacy) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#00A8E8" />
          <Text style={styles.loadingText}>Chargement de la pharmacie...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {pharmacy.name}
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="share-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: pharmacy.image }}
            style={styles.pharmacyImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          
          <View style={styles.pharmacyInfoOverlay}>
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
            <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
            
            <View style={styles.pharmacyStats}>
              <View style={styles.statItem}>
                <Ionicons name="location" size={16} color="white" />
                <Text style={styles.statText}>{pharmacy.distance}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="white" />
                <Text style={styles.statText}>Ferme à {pharmacy.closingTime}</Text>
              </View>
              
              <TouchableOpacity style={styles.statItem}>
                <Ionicons name="call-outline" size={16} color="white" />
                <Text style={styles.statText}>{pharmacy.phone}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{pharmacy.rating} ({pharmacy.reviews} avis)</Text>
            </View>
          </View>
        </View>

        {/* Section Ordonnance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Une ordonnance ?</Text>
          <Text style={styles.sectionDescription}>
            Ajoutez votre ordonnance au format PDF ou photo. Le pharmacien va préparer 
            votre commande. Vous n'avez pas besoin de sélectionner le contenu de votre 
            ordonnance depuis le catalogue des produits 😊
          </Text>
          
          <TouchableOpacity 
            style={styles.addPrescriptionButton}
            onPress={handleAddPrescription}
            activeOpacity={0.8}
          >
            <View style={styles.addButtonContent}>
              <Ionicons name="add-circle-outline" size={24} color="#00A8E8" />
              <Text style={styles.addButtonText}>Ajouter une ordonnance</Text>
            </View>
            <Text style={styles.addButtonSubtext}>PDF, JPG, PNG jusqu'à 5MB</Text>
          </TouchableOpacity>
        </View>

        {/* Section Recherche de produits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rechercher un produit</Text>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Nom du produit, marque, catégorie..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Section Produits sans ordonnance */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Ajouter des produits sans ordonnance</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAllText}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <View style={styles.categoriesContainer}>
              {productCategories.map((category) => (
                <TouchableOpacity 
                  key={category.id} 
                  style={styles.categoryCard}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/category/${category.id}`)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                    <Ionicons name={category.icon} size={24} color={category.color} />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Section Produits populaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produits populaires</Text>
          
          <View style={styles.productsGrid}>
            {popularProducts.map((product) => (
              <TouchableOpacity 
                key={product.id}
                style={[
                  styles.productCard,
                  selectedProducts.includes(product.id) && styles.productCardSelected
                ]}
                onPress={() => handleSelectProduct(product.id)}
                activeOpacity={0.7}
              >
                <View style={styles.productHeader}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={[
                    styles.checkbox,
                    selectedProducts.includes(product.id) && styles.checkboxSelected
                  ]}>
                    {selectedProducts.includes(product.id) && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                </View>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton Commander */}
      {selectedProducts.length > 0 && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={handleOrder}
            activeOpacity={0.8}
          >
            <View style={styles.cartIndicator}>
              <Text style={styles.cartCount}>{selectedProducts.length}</Text>
            </View>
            <Text style={styles.floatingButtonText}>Commander</Text>
            <Text style={styles.deliveryTime}>Livraison: {pharmacy.deliveryTime}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal pour ajouter une ordonnance */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={prescriptionModalVisible}
        onRequestClose={() => setPrescriptionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter une ordonnance</Text>
              <TouchableOpacity onPress={() => setPrescriptionModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalOptions}>
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="camera" size={32} color="#00A8E8" />
                <Text style={styles.modalOptionText}>Prendre une photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="images" size={32} color="#00A8E8" />
                <Text style={styles.modalOptionText}>Choisir depuis la galerie</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="document" size={32} color="#00A8E8" />
                <Text style={styles.modalOptionText}>Importer un PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#00A8E8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  pharmacyImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  pharmacyInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
  },
  pharmacyName: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  pharmacyStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#00A8E8',
    fontWeight: '600',
  },
  addPrescriptionButton: {
    borderWidth: 2,
    borderColor: '#00A8E8',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#00A8E8',
    fontWeight: '600',
  },
  addButtonSubtext: {
    fontSize: 12,
    color: '#999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  categoriesScroll: {
    marginHorizontal: -20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  categoryCard: {
    width: 100,
    marginRight: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#00A8E8',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00A8E8',
    borderColor: '#00A8E8',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00A8E8',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: '#00A8E8',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartIndicator: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#E91E63',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cartCount: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  floatingButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginHorizontal: 12,
  },
  deliveryTime: {
    position: 'absolute',
    top: -20,
    fontSize: 12,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalOptions: {
    gap: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});