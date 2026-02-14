
import { AdminConfig, Product } from './types';

export const COLORS = {
  bg: '#ffffff',
  card: '#ffffff',
  primary: '#0369a1', // Deeper Ocean Blue
  primaryHover: '#0c4a6e',
  secondary: '#be185d', 
  accent: '#b45309',    
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  textMain: '#0f172a', // Slate 900 for better readability
  textMuted: '#64748b', // Slate 500
};

export const ADMIN_CREDENTIALS: AdminConfig = {
  user: 'admin',
  pass: 'mvs@123',
};

export const WHATSAPP_NUMBER = '919490255775'; 
export const SHIPPING_RATE_PER_KG = 80;

export const CATEGORIES = [
  'Bettas', 'Tetras', 'Goldfish', 'Plants', 'Shrimps', 
  'Discus', 'Livebearers', 'Cichlids', 'Tools', 'Food', 'Accessories', 'Other'
];

export const BUSINESS_INFO = {
  name: 'MVS Aqua',
  address: '15 Line, Upadhyaya Nagar, Tirupati, Andhra Pradesh 517507',
  phone: '+91 94902 55775',
  email: 'support@mvsaqua.com',
  website: 'https://aquariumproductsindia.in',
  socials: {
    instagram: 'https://www.instagram.com/mvs_aqua',
    youtube: 'https://www.youtube.com/@mvs_aqua'
  }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Halfmoon Betta - Royal Blue',
    description: 'A stunning specimen of the Halfmoon Betta family, featuring deep royal blue hues and a perfect 180-degree tail spread.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200',
    category: 'Bettas',
    stock: 12,
    weight: 0.5,
    variations: [
      { name: 'Royal Blue' },
      { name: 'Red Dragon', priceModifier: 50 },
      { name: 'Mustard Gas', priceModifier: 100 }
    ]
  }
];
