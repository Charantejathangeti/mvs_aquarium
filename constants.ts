
import { AdminConfig, Product } from './types';

export const COLORS = {
  bg: '#ffffff',
  card: '#ffffff',
  primary: '#00d2ff', // Electric Teal
  primaryDark: '#008ba8',
  secondary: '#d4af37', // Champagne Gold
  accent: '#10b981',    
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#0a0f14', // Deep Sea Charcoal
  textMain: '#0f172a', 
  textMuted: '#64748b', 
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
    id: 'MVS-1001',
    name: 'Premium Halfmoon Betta - Royal Blue',
    scientificName: 'Betta splendens',
    careLevel: 'Easy',
    description: 'A stunning specimen of the Halfmoon Betta family, featuring deep royal blue hues and a perfect 180-degree tail spread. Professionally quarantined for 14 days.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200',
    category: 'Bettas',
    stock: 12,
    weight: 0.5,
    tempRange: '24-28°C',
    phRange: '6.5-7.5',
    diet: 'Carnivore',
    origin: 'Southeast Asia'
  }
];
