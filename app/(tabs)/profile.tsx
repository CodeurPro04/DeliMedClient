import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Données des commandes récentes
  const recentOrders = [
    {
      id: 'ORD-001',
      date: '15 déc. 2023',
      status: 'Livré',
      items: ['Paracétamol', 'Vitamine C'],
      total: '200 FCFA',
      statusColor: '#4CAF50'
    },
    {
      id: 'ORD-002',
      date: '10 déc. 2023',
      status: 'En cours',
      items: ['Masques FFP2', 'Gel hydroalcoolique'],
      total: '800 FCFA',
      statusColor: '#FF9800'
    },
    {
      id: 'ORD-003',
      date: '5 déc. 2023',
      status: 'Annulé',
      items: ['Thermomètre'],
      total: '2,000 FCFA',
      statusColor: '#F44336'
    }
  ];

  // Sections du profil
  const profileSections = [
    {
      title: 'Informations personnelles',
      items: [
        { icon: 'person-outline', title: 'Mon profil', color: '#00A8E8', subtitle: 'Nabo Clément • naboclementt@email.com' },
        { icon: 'location-outline', title: 'Adresses', color: '#4CAF50', badge: '3' },
        { icon: 'card-outline', title: 'Paiements', color: '#FF9800', badge: '2' },
      ]
    },
    {
      title: 'Santé & Documents',
      items: [
        { icon: 'medical-outline', title: 'Carte Vitale', color: '#2196F3', status: 'Validée' },
        { icon: 'shield-checkmark-outline', title: 'Mutuelle', color: '#9C27B0', status: 'Connectée' },
        { icon: 'document-text-outline', title: 'Ordonnances', color: '#00BCD4', badge: '5' },
        { icon: 'bandage-outline', title: 'Allergies & Traitements', color: '#FF5722' },
      ]
    },
    {
      title: 'Services',
      items: [
        { icon: 'heart-outline', title: 'Pharmacies favorites', color: '#E91E63', badge: '3' },
        { icon: 'people-outline', title: 'Parrainage', color: '#795548', subtitle: 'Parrainez, gagnez 1000 FCFA' },
        { icon: 'gift-outline', title: 'Mes avantages', color: '#FF4081' },
      ]
    }
  ];

  const menuItems = [
    { icon: 'home-outline', title: 'Accueil', route: '/' },
    { icon: 'search-outline', title: 'Recherche', route: '/search' },
    { icon: 'receipt-outline', title: 'Commandes', route: '/orders' },
    { icon: 'heart-outline', title: 'Favoris', route: '/favorites' },
    { icon: 'person-outline', title: 'Profil', route: '/profile', active: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00A8E8" />
      
      {/* Header avec style cohérent */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Mon compte</Text>
            <Text style={styles.headerSubtitle}>Gérez votre profil et vos préférences</Text>
          </View>
          
          {/* Avatar et bouton édition */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="white" />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera-outline" size={16} color="#00A8E8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>Nabo Clément</Text>
            <Text style={styles.userEmail}>naboclement@email.com</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistiques en haut */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Adresses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Cartes</Text>
            </View>
          </View>
        </View>

        {/* Commandes récentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Commandes récentes</Text>
            <TouchableOpacity onPress={() => router.push('/orders')}>
              <Text style={styles.seeAllText}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ordersContainer}>
            {recentOrders.map((order, index) => (
              <TouchableOpacity 
                key={order.id} 
                style={styles.orderCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/order/${order.id}`)}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={[styles.orderStatus, { color: order.statusColor }]}>
                    {order.status}
                  </Text>
                </View>
                <Text style={styles.orderDate}>{order.date}</Text>
                <Text style={styles.orderItems}>
                  {order.items.join(', ')}
                </Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>{order.total}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sections du profil */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={styles.profileItem}
                  activeOpacity={0.7}
                >
                  <View style={[styles.itemIconContainer, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <View style={styles.itemContent}>
                    <View style={styles.itemTitleRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      {item.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    {item.subtitle && (
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    )}
                    {item.status && (
                      <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Paramètres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.settingsContent}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="notifications-outline" size={22} color="#2196F3" />
                </View>
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                style={[styles.toggle, notificationsEnabled && styles.toggleActive]}
              >
                <View style={[styles.toggleCircle, notificationsEnabled && styles.toggleCircleActive]} />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setDarkModeEnabled(!darkModeEnabled)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="moon-outline" size={22} color="#9C27B0" />
                </View>
                <Text style={styles.settingText}>Mode sombre</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setDarkModeEnabled(!darkModeEnabled)}
                style={[styles.toggle, darkModeEnabled && styles.toggleActive]}
              >
                <View style={[styles.toggleCircle, darkModeEnabled && styles.toggleCircleActive]} />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#E8F5E8' }]}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.settingText}>Sécurité et confidentialité</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="help-circle-outline" size={22} color="#FF9800" />
                </View>
                <Text style={styles.settingText}>Centre d'aide</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="log-out-outline" size={22} color="#F44336" />
                </View>
                <Text style={[styles.settingText, { color: '#F44336' }]}>Déconnexion</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00A8E8',
  },
  header: {
    backgroundColor: "#00A8E8",
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  titleContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00A8E8',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#00A8E8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00A8E8',
    fontWeight: '600',
  },
  ordersContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  orderItems: {
    fontSize: 13,
    color: '#333',
    marginBottom: 12,
    lineHeight: 18,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    backgroundColor: '#00A8E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  settingsContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#00A8E8',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 4,
    backgroundColor: '#00A8E8',
    borderRadius: 2,
  },
});