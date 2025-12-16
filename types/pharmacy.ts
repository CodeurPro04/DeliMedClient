export interface Pharmacy {
  id: string;
  name: string;
  distance: string;
  status: 'open' | 'closed';
  address: string;
}
