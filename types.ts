
export interface Variation {
  name: string;
  priceModifier?: number; 
}

export interface Product {
  id: string; // Acts as _id in MongoDB
  name: string;
  scientificName?: string;
  careLevel?: 'Easy' | 'Moderate' | 'Advanced';
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  weight: number; 
  variations?: Variation[];
  updatedAt?: string;
  // Professional biological metadata
  tempRange?: string;
  phRange?: string;
  diet?: string;
  origin?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: string;
}

export interface Order {
  id: string; // Acts as _id in MongoDB
  customerName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  country: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  items: CartItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  weight: number;
  date: string;
  status: 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
}

export interface Invoice extends Order {}

export interface AdminConfig {
  user: string;
  pass: string;
}
