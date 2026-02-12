
import { AdminConfig, Product } from './types';

export const COLORS = {
  bg: '#ffffff',
  card: '#ffffff',
  primary: '#0ea5e9', // Deep Sky Blue
  primaryHover: '#0369a1',
  success: '#16a34a',
  warning: '#ca8a04',
  danger: '#dc2626',
  textMain: '#0f172a',
  textMuted: '#64748b',
};

export const ADMIN_CREDENTIALS: AdminConfig = {
  user: 'admin',
  pass: 'mvs@123',
};

// The primary number for WhatsApp redirects
export const WHATSAPP_NUMBER = '919490255775'; 
export const SHIPPING_RATE_PER_KG = 80;

export const CATEGORIES = [
  'Bettas', 'Tetras', 'Goldfish', 'Plants', 'Shrimps', 
  'Discus', 'Livebearers', 'Cichlids', 'Tools', 'Food', 'Accessories'
];

export const BUSINESS_INFO = {
  name: 'MVS Aqua',
  address: '15 Line, Upadhyaya Nagar, Tirupati, Andhra Pradesh 517507',
  phone: '+91 94902 55775',
  email: 'support@mvsaqua.com',
  website: 'https://aquariumproductsindia.in'
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Halfmoon Betta - Royal Blue',
    description: 'A stunning specimen of the Halfmoon Betta family, featuring deep royal blue hues and a perfect 180-degree tail spread. Ideal for focal point aquariums.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200',
    category: 'Bettas',
    stock: 12,
    weight: 1.0 
  },
  {
    id: '2',
    name: 'Neon Tetra Schooling Set',
    description: 'Active and peaceful community fish. These 10 pieces of high-quality Neon Tetras will bring vibrant life to any planted tank with their iridescent blue and red stripes.',
    price: 900,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    category: 'Tetras',
    stock: 50,
    weight: 0.5
  },
  {
    id: '3',
    name: 'Red Cap Oranda Goldfish - Grade A',
    description: 'Elegant and graceful, the Red Cap Oranda is known for its pure white body and contrasting red hood (wen). A true classic for goldfish enthusiasts.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1524704659690-3f7a3000bb24?auto=format&fit=crop&q=80&w=1200',
    category: 'Goldfish',
    stock: 20,
    weight: 1.5
  },
  {
    id: '4',
    name: 'Anubias Nana - Live Aquatic Plant',
    description: 'The Anubias Nana is a hardy, slow-growing plant that is perfect for beginners and experts alike. It features dark green, waxy leaves and is highly resilient.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=1200',
    category: 'Plants',
    stock: 15,
    weight: 0.2
  }
];
