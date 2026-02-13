
import { AdminConfig, Product } from './types';

export const COLORS = {
  bg: '#ffffff',
  card: '#ffffff',
  primary: '#0284c7', // Darker Sky Blue for contrast
  primaryHover: '#0369a1',
  secondary: '#db2777', // Darker Pink
  accent: '#d97706',    // Darker Amber
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  textMain: '#000000', // Pure black for main text
  textMuted: '#4b5563', // Darker gray for readability
};

export const ADMIN_CREDENTIALS: AdminConfig = {
  user: 'admin',
  pass: 'mvs@123',
};

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
    weight: 0.5 
  },
  {
    id: '2',
    name: 'Neon Tetra Schooling Set (10 Pcs)',
    description: 'Active and peaceful community fish. These 10 pieces of high-quality Neon Tetras will bring vibrant life to any planted tank.',
    price: 900,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    category: 'Tetras',
    stock: 50,
    weight: 0.2
  },
  {
    id: '3',
    name: 'Oranda Goldfish - Red Cap',
    description: 'High-grade Red Cap Oranda with prominent wen growth. Known for their graceful swimming and distinctive appearance.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1524704659690-3f7a3000bb24?auto=format&fit=crop&q=80&w=1200',
    category: 'Goldfish',
    stock: 8,
    weight: 1.2
  },
  {
    id: '4',
    name: 'Anubias Nana on Driftwood',
    description: 'Ready-to-place aquatic plant. Extremely hardy and slow-growing, perfect for low-tech setups and beginners.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=1200',
    category: 'Plants',
    stock: 25,
    weight: 0.8
  },
  {
    id: '5',
    name: 'Blue Velvet Shrimp Colony (5 Pcs)',
    description: 'Vibrant deep blue freshwater shrimps. Excellent algae eaters and a colorful addition to any nano tank.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1520102145455-8717885b9c02?auto=format&fit=crop&q=80&w=1200',
    category: 'Shrimps',
    stock: 15,
    weight: 0.1
  },
  {
    id: '6',
    name: 'Red Dragon Discus - Juveniles',
    description: 'Stunning Pigeon Blood variant with intense red patterning. Requires stable water conditions and high-quality diet.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1534685785832-62fe73994362?auto=format&fit=crop&q=80&w=1200',
    category: 'Discus',
    stock: 6,
    weight: 1.5
  },
  {
    id: '7',
    name: 'Dumbo Ear Guppy Pair',
    description: 'A breeding pair of Dumbo Ear Guppies featuring oversized pectoral fins and high-contrast color patterns.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200',
    category: 'Livebearers',
    stock: 20,
    weight: 0.1
  },
  {
    id: '8',
    name: 'Electric Blue Ram (Pair)',
    description: 'Peaceful dwarf cichlids with striking iridescent blue coloration. Ideal for established community aquariums.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    category: 'Cichlids',
    stock: 10,
    weight: 0.4
  },
  {
    id: '9',
    name: 'Aquascaping Tool Kit (5-in-1)',
    description: 'Professional grade stainless steel tools including scissors, tweezers, and substrate leveler in a carry case.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1546024073-922623a8a84b?auto=format&fit=crop&q=80&w=1200',
    category: 'Tools',
    stock: 30,
    weight: 1.0
  },
  {
    id: '10',
    name: 'MVS Premium Spirulina Pellets',
    description: 'Balanced nutrition for all tropical fish. Rich in natural carotenoids to enhance livestock coloration.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1524704659690-3f7a3000bb24?auto=format&fit=crop&q=80&w=1200',
    category: 'Food',
    stock: 100,
    weight: 0.2
  }
];
