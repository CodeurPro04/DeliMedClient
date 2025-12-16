import { Pharmacy, Category } from '../types';

export const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'Pharmacie Porte de Montreuil',
    address: '2 Av. de la Prte de Montreuil',
    city: 'Paris',
    postalCode: '75020',
    phone: '+33143738104',
    distance: 9.9,
    isOpen: true,
    closingTime: '23:59',
    preparationTime: '0-5 min',
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    id: '2',
    name: 'Pharmacie de la Porte des Lilas',
    address: '168 Bd Mortier',
    city: 'Paris',
    postalCode: '75020',
    phone: '+33143617788',
    distance: 10.1,
    isOpen: true,
    closingTime: '20:00',
    preparationTime: '17-22 min',
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    id: '3',
    name: 'Pharmacie Garde Royale',
    address: '287 rue de Napoleon',
    city: 'Paris',
    postalCode: '75010',
    phone: '+33142857654',
    distance: 2.8,
    isOpen: true,
    closingTime: '14:00',
    preparationTime: '5-10 min',
    latitude: 48.8566,
    longitude: 2.3522
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Appareil digestif', color: '#FF8C00', icon: '🍽️' },
  { id: '2', name: 'Dermatologie', color: '#FF6B9D', icon: '💊' },
  { id: '3', name: 'Douleurs articulaires', color: '#00A6FF', icon: '💪' },
  { id: '4', name: 'Bébé et maternité', color: '#FF69B4', icon: '👶' },
  { id: '5', name: 'Fièvre et grippe', color: '#00D4AA', icon: '🌡️' }
];