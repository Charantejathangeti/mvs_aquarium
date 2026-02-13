# MVS Aqua - Premium Aquarium Livestock Store

MVS Aqua is a high-performance, professional e-commerce platform specifically designed for premium biological fulfillment. Based in Tirupati, the platform bridges the gap between ethical breeders and discerning aquarium hobbyists across India.

## 🐟 Platform Overview

This application serves as a dual-sided portal: a high-end storefront for customers and a robust management console for operators. It prioritizes livestock safety, logistics precision, and a professional aesthetic characterized by high-contrast design and sharp, rectangular geometry.

## 🚀 Key Features

### Storefront Experience
- **Dynamic Stocklist**: Categorized livestock catalog (Bettas, Discus, Goldfish, etc.) with real-time filtering and search.
- **Specimen Details**: Detailed biological descriptions, weight data, and multi-image galleries.
- **Advanced Cart System**: Persistence-enabled shopping cart with weight-based logistics calculation.
- **WhatsApp Checkout Protocol**: Direct order transmission to WhatsApp, automating the bridge between digital selection and human-led fulfillment.
- **Dispatch Tracking**: Integrated logistics timeline for tracking "Monday Dispatch" shipments via regional courier networks.

### Operator Console (Admin)
- **Secure Authentication**: Encrypted portal for business operators.
- **Inventory Management**: Full CRUD capabilities for the livestock registry, including image uploads and stock tracking.
- **Manual Invoice Generation**: Interface for creating custom orders and generating professional, printable PDFs/Receipts for off-platform sales.
- **WhatsApp Business Integration**: One-click sharing of orders and invoices to customer mobile numbers.

## 🛠 Tech Stack

- **Framework**: React 19 (ES Modules via ESM.sh)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router (HashRouter)
- **State Management**: React Hooks (useState, useEffect, useMemo)

## 📁 Project Structure

```text
/
├── components/          # Reusable UI components (Layout, etc.)
├── pages/               # Functional page views
│   ├── Home.tsx         # Landing page with cinematic hero
│   ├── Shop.tsx         # Livestock stocklist
│   ├── AdminDashboard.tsx# Business management interface
│   └── ...              # Checkout, Tracking, About, etc.
├── types.ts             # TypeScript interfaces for Products and Orders
├── constants.ts         # Business logic, mock data, and configuration
├── App.tsx              # Main routing and global state logic
└── index.html           # Entry HTML with Tailwind and ESM configuration
```

## 📐 Design Philosophy

MVS Aqua follows a "Swiss-style" minimalist aesthetic:
- **Rectangular Aesthetics**: Deliberate avoidance of rounded corners to convey professional reliability.
- **Typography-First**: Heavy use of the 'Inter' typeface with varying weights for clear information hierarchy.
- **High Contrast**: A strict palette of pure black, slate grays, and tactical sky-blue accents.
- **Performance**: Lightweight asset loading and transition-optimized interactions.

## 🚢 Logistics Model

The platform is hardcoded with MVS Aqua's proprietary "Monday Dispatch" logic, ensuring livestock never stalls in courier hubs over weekends. Shipping rates are dynamically calculated based on consignment mass (kg).

---
*© 2024 MVS Aqua Enterprise - Tirupati, AP.*