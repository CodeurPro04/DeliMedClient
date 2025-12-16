export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  distance: number;
  isOpen: boolean;
  closingTime: string;
  preparationTime: string;
  image?: string;
  latitude: number;
  longitude: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  requiresPrescription: boolean;
}