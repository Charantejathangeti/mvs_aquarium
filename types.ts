
export interface Variation {
  name: string;
  priceModifier?: number; // Optional price change (e.g., +100 for Larger size)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  weight: number; // in kg
  variations?: Variation[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: string;
}

export interface Order {
  id: string;
  customerName: string; // Combined first + last
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
