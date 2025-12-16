import { useState } from 'react';
import { Pharmacy } from '@/types/pharmacy';

export function usePharmacies() {
  const [pharmacies] = useState<Pharmacy[]>([
    {
      id: '1',
      name: 'Pharmacie Porte de Montreuil',
      distance: '2.8 km',
      status: 'open',
      address: 'Paris, France',
    },
    {
      id: '2',
      name: 'Pharmacie Opéra',
      distance: '3.5 km',
      status: 'closed',
      address: 'Paris, France',
    },
  ]);

  return { pharmacies };
}
