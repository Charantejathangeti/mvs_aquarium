
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Trash2, Edit, Search, LogOut, 
  X, PlusCircle, Image as ImageIcon, Save, CheckCircle2, 
  Camera, Edit2Icon, TrashIcon, DollarSign, PackageCheck, 
  Truck, Box, Plus, Send, Download, ShoppingBag, User, MapPin,
  FileText, ListPlus, Settings2, Fish, Cloud
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product, Order, CartItem, Variation } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoice'>('Dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Product Management State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string;
    category: string;
    price: number;
    weight: number;
    image: string;
    description: string;
    stock: number;
    variations: Variation[];
  }>({
    name: '', category: CATEGORIES[0], price: 0, weight: 0, image: '', description: '', stock: 0, variations: []
  });

  // Manual Invoice Generation State
  const [invoiceForm, setInvoiceForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Andhra Pradesh',
    pinCode: '',
    shippingCharge: 0,
    items: [{ id: 'temp-' + Date.now(), name: '', quantity: 0, price: 0, weight: 0 }]
  });

  // Background Fish Animation Logic
  const dashboardFishes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bottom: `${-10 - Math.random() * 20}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: 15 + Math.random() * 25,
      opacity: 0.05 + Math.random() * 0.1,
      type: i % 4 === 0 ? 'jump' : 'swim',
      flip: Math.random() > 0.5,
    }));
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('mvs_aqua_admin') !== '1') {
      navigate('/admin-login');
      return;
    }
    const savedOrders = JSON.parse(localStorage.getItem('mvs_aqua_orders') || '[]');
    setOrders(savedOrders);
  }, [navigate]);

  const stats = useMemo(() => {
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
    const completedMonth = orders.filter(o => {
      const d = new Date(o.date);
      const now = new Date();
      return o.status === 'delivered' && d.getMonth() === now.getMonth();
    }).length;
    const revenue = orders.reduce((acc, o) => acc + o.total, 0);
    return { totalStock, activeOrders, completedMonth, revenue };
  }, [products, orders]);

  const handleLogout = () => {
    sessionStorage.removeItem('mvs_aqua_admin');
    navigate('/admin-login');
  };

  // Automated Product Actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p);
      setProducts(updated);
    } else {
      const newProduct: Product = { ...productForm, id: 'P' + Date.now() };
      const updated = [...products, newProduct];
      setProducts(updated);
    }
    
    setIsSyncing(false);
    setIsProductModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProductForm(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const addVariation = () => {
    setProductForm(prev => ({
      ...prev,
      variations: [...prev.variations, { name: '', priceModifier: 0 }]
    }));
  };

  const removeVariation = (idx: number) => {
    setProductForm(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== idx)
    }));
  };

  const updateVariation = (idx: number, field: keyof Variation, value: any) => {
    setProductForm(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => i === idx ? { ...v, [field]: value } : v)
    }));
  };

  // Invoice Actions
  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { id: 'temp-' + Date.now(), name: '', quantity: 0, price: 0, weight: 0 }]
    }));
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateInvoiceItem = (id: string, field: string, value: any) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const autopopulateProduct = (rowId: string, productId: string) => {
    if (productId === "") {
      // Clear fields for manual entry
      setInvoiceForm(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === rowId ? {
          ...item,
          name: '',
          price: 0,
          weight: 0,
          quantity: 0
        } : item)
      }));
      return;
    }

    const found = products.find(p => p.id === productId);
    if (found) {
      setInvoiceForm(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === rowId ? {
          ...item,
          name: found.name,
          price: found.price,
          weight: found.weight,
          quantity: 1
        } : item)
      }));
    }
  };

  const generateManualInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = 'MVS' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = invoiceForm.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const totalWeight = invoiceForm.items.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
    const total = subtotal + Number(invoiceForm.shippingCharge);

    const newOrder: Order = {
      id: orderId,
      firstName: invoiceForm.firstName,
      lastName: invoiceForm.lastName,
      customerName: `${invoiceForm.firstName} ${invoiceForm.lastName}`,
      email: invoiceForm.email,
      phone: invoiceForm.phone,
      address: invoiceForm.address,
      city: invoiceForm.city,
      state: invoiceForm.state,
      pinCode: invoiceForm.pinCode,
      country: 'India',
      items: invoiceForm.items as any,
      subtotal,
      shippingCharge: Number(invoiceForm.shippingCharge),
      total,
      weight: totalWeight,
      date: new Date().toISOString(),
      status: 'pending'
    };

    const existingOrders = JSON.parse(localStorage.getItem('mvs_aqua_orders') || '[]');
    existingOrders.push(newOrder);
    localStorage.setItem('mvs_aqua_orders', JSON.stringify(existingOrders));
    setOrders(existingOrders);
    
    alert(`Invoice ${orderId} Generated Successfully`);
    setActiveTab('Orders');
  };

  const sendOrderToWhatsApp = (order: Order) => {
    const productList = order.items.map(i => `• ${i.name} x ${i.quantity} (₹${i.price})`).join('\n');
    const message = `*MANUAL INVOICE: #${order.id}*

*Customer Details:*
Name: ${order.customerName}
Phone: ${order.phone}
Address: ${order.address}, ${order.city}, ${order.state} - ${order.pinCode}

*Items:*
${productList}

*Summary:*
Subtotal: ₹${order.subtotal}
Shipping: ₹${order.shippingCharge}
*Total: ₹${order.total}*

_MVS Aqua Enterprise - Tirupati_`;
    window.open(`https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative min-h-screen flex bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Dynamic Aquatic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {dashboardFishes.map((fish) => (
          <div
            key={fish.id}
            className={`absolute ${fish.type === 'jump' ? 'animate-fish-jump' : 'animate-fish-swim'}`}
            style={{
              left: fish.left,
              bottom: fish.bottom,
              animationDelay: fish.delay,
              animationDuration: fish.duration,
              opacity: fish.opacity,
              transform: fish.flip ? 'scaleX(-1)' : 'none',
            }}
          >
            <Fish size={fish.size} className="text-sky-400 fill-sky-200" />
          </div>
        ))}
      </div>

      {/* Sidebar - Tight & Black */}
      <aside className="relative z-20 w-56 bg-white border-r border-slate-200 flex flex-col p-4 sticky top-0 h-screen shrink-0 shadow-lg">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <div className="w-7 h-7 bg-black flex items-center justify-center text-white font-bold rounded-sm text-[10px]">M</div>
          <span className="text-[11px] font-black uppercase tracking-widest">Admin Console</span>
        </div>
        <nav className="flex-grow space-y-1">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Orders', icon: PackageCheck },
            { id: 'Invoice', icon: FileText },
            { id: 'Products', icon: Box }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center space-x-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all ${
                activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.id}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-6 flex items-center space-x-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 rounded-sm">
          <LogOut size={14} /><span>Exit Session</span>
        </button>
      </aside>

      <main className="relative z-10 flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
             <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-black">{activeTab} Interface</h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-sm">
                   <Cloud size={10} className="text-emerald-600" />
                   <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Auto-Sync Active</span>
                </div>
             </div>
             {activeTab === 'Products' && (
                <button 
                  onClick={() => { 
                    setEditingProduct(null); 
                    setProductForm({name:'', category:CATEGORIES[0], price:0, weight:0, image:'', description:'', stock:0, variations: []}); 
                    setIsProductModalOpen(true); 
                  }} 
                  className="px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <Plus size={12} /> New Species
                </button>
             )}
          </header>

          <div className="animate-fade-in">
            {activeTab === 'Dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Available Stock', val: stats.totalStock, color: 'text-black' },
                  { label: 'Active Queue', val: stats.activeOrders, color: 'text-sky-600' },
                  { label: 'Monthly Closed', val: stats.completedMonth, color: 'text-emerald-600' },
                  { label: 'Total Revenue', val: `₹${stats.revenue.toLocaleString()}`, color: 'text-black' }
                ].map((s, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm border border-slate-200 p-5 rounded-sm shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <h3 className={`text-xl font-black ${s.color}`}>{s.val}</h3>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Products' && (
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Livestock</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Class</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Price</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Mass (kg)</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Inv</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400 text-right">Op</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-bold text-black">{p.name}</td>
                        <td className="px-5 py-3 font-medium text-slate-500 uppercase tracking-tighter">{p.category}</td>
                        <td className="px-5 py-3 font-bold text-black">₹{p.price}</td>
                        <td className="px-5 py-3 font-medium text-slate-500">{p.weight}</td>
                        <td className="px-5 py-3"><span className={`font-bold ${p.stock < 10 ? 'text-red-600' : 'text-emerald-600'}`}>{p.stock}</span></td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => { setEditingProduct(p); setProductForm({ ...p, variations: p.variations || [] }); setIsProductModalOpen(true); }} className="p-1 text-slate-400 hover:text-sky-600 mr-2"><Edit2Icon size={12} /></button>
                          <button onClick={() => { if(confirm('Purge Species Record?')) setProducts(products.filter(item=>item.id!==p.id)) }} className="p-1 text-slate-400 hover:text-red-600"><TrashIcon size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Orders' && (
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Ref ID</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Customer</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Total</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-5 py-3 font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice().reverse().map(o => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-black text-sky-600">#{o.id}</td>
                        <td className="px-5 py-3 font-bold text-black">{o.customerName}</td>
                        <td className="px-5 py-3 font-bold text-black">₹{o.total}</td>
                        <td className="px-5 py-3">
                           <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm ${
                             o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                             o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                           }`}>{o.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right flex items-center justify-end gap-2">
                           <button onClick={() => navigate(`/invoice/${o.id}`, { state: { orderData: o } })} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-black hover:text-white rounded-sm transition-all" title="View/Print">
                             <Download size={12} />
                           </button>
                           <button onClick={() => sendOrderToWhatsApp(o)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-sm transition-all" title="WhatsApp Invoice">
                             <Send size={12} />
                           </button>
                           <button onClick={() => { if(confirm('Delete Order?')) setOrders(orders.filter(ord=>ord.id!==o.id)) }} className="p-1.5 text-slate-400 hover:text-red-600"><TrashIcon size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Invoice' && (
              <div className="max-w-4xl mx-auto">
                <form onSubmit={generateManualInvoice} className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                       <User size={14} className="text-sky-600" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Billing Identity & Logistics</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">First Name *</label>
                        <input required className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Last Name *</label>
                        <input required className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.lastName} onChange={e => setInvoiceForm({...invoiceForm, lastName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">WhatsApp / Phone *</label>
                        <input required className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" placeholder="+91..." value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                        <input className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" type="email" value={invoiceForm.email} onChange={e => setInvoiceForm({...invoiceForm, email: e.target.value})} />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Full Delivery Address *</label>
                        <input required className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.address} onChange={e => setInvoiceForm({...invoiceForm, address: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-3 md:col-span-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">City *</label>
                          <input required className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.city} onChange={e => setInvoiceForm({...invoiceForm, city: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">State *</label>
                          <input required className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.state} onChange={e => setInvoiceForm({...invoiceForm, state: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">PIN *</label>
                          <input required className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.pinCode} onChange={e => setInvoiceForm({...invoiceForm, pinCode: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                       <div className="flex items-center gap-2">
                         <ShoppingBag size={14} className="text-sky-600" />
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Itemized Payload</h3>
                       </div>
                       <button type="button" onClick={addInvoiceItem} className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-sky-600 hover:text-black transition-colors">
                         <Plus size={10} /> Add Item
                       </button>
                    </div>
                    <div className="space-y-3">
                      {invoiceForm.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-end bg-slate-50/50 p-2 rounded-sm border border-slate-100">
                           <div className="col-span-3 space-y-1">
                              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Stock Lookup</label>
                              <select className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" onChange={(e) => autopopulateProduct(item.id, e.target.value)}>
                                <option value="">Other / Manual Entry...</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                           </div>
                           <div className="col-span-3 space-y-1">
                              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Item Label (Manual Name)</label>
                              <input required className={`w-full bg-white border rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none ${!item.name ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`} placeholder="Type name manually..." value={item.name} onChange={e => updateInvoiceItem(item.id, 'name', e.target.value)} />
                           </div>
                           <div className="col-span-1 space-y-1">
                              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Qty</label>
                              <input type="number" required className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" value={item.quantity} onChange={e => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value)||0)} />
                           </div>
                           <div className="col-span-1 space-y-1">
                              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Price (₹)</label>
                              <input type="number" required className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" value={item.price} onChange={e => updateInvoiceItem(item.id, 'price', parseInt(e.target.value)||0)} />
                           </div>
                           <div className="col-span-2 space-y-1">
                              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Mass (kg)</label>
                              <input type="number" step="0.1" className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" value={item.weight} onChange={e => updateInvoiceItem(item.id, 'weight', parseFloat(e.target.value)||0)} />
                           </div>
                           <div className="col-span-2 pb-0.5">
                              {invoiceForm.items.length > 1 && (
                                <button type="button" onClick={() => removeInvoiceItem(item.id)} className="w-full h-8 flex items-center justify-center text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                              )}
                           </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-8 items-end">
                       <div className="space-y-1">
                         <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Logistics / Shipping Fee (₹)</label>
                         <input type="number" className="w-full bg-white/50 border border-slate-200 rounded-sm px-3 py-2 text-[10px] font-black outline-none focus:border-black" value={invoiceForm.shippingCharge} onChange={e => setInvoiceForm({...invoiceForm, shippingCharge: parseInt(e.target.value)||0})} />
                       </div>
                       <button type="submit" className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg">
                         <FileText size={14} /> Commit & Generate Invoice
                       </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 animate-fade-in backdrop-blur-sm overflow-y-auto">
           <div className="bg-white border border-slate-200 rounded-sm w-full max-w-xl shadow-2xl p-8 relative my-8">
              <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black transition-colors"><X size={18} /></button>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-slate-100 pb-3">Livestock Registry Profile</h2>
              <form onSubmit={handleSaveProduct} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Species Name *</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold text-black outline-none focus:border-black" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Classification</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-[10px] font-bold outline-none" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                         <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Base Price (₹) *</label>
                            <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)||0})} />
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Stock *</label>
                            <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)||0})} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Mass (kg) *</label>
                            <input type="number" step="0.1" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: parseFloat(e.target.value)||0})} />
                         </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Biological Description</label>
                          <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none resize-none h-[116px]" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Detailed traits..." />
                       </div>
                       <div className="flex items-center gap-4 py-2">
                          <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                             {productForm.image ? <img src={productForm.image} className="w-full h-full object-cover" /> : <Camera size={20} className="text-slate-300" />}
                          </div>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase tracking-widest text-sky-600 hover:text-black transition-colors underline underline-offset-4">Upload Specimen Image</button>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                       </div>
                    </div>
                 </div>
                 <div className="border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Settings2 size={14} /> Color/Size Variations</h3>
                       <button type="button" onClick={addVariation} className="text-[8px] font-black uppercase tracking-widest text-sky-600 hover:text-black flex items-center gap-1"><ListPlus size={12} /> Add Variation</button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                       {productForm.variations.map((v, i) => (
                         <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-sm">
                            <div className="flex-grow">
                               <input placeholder="Variation Name" className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1 text-[9px] font-bold outline-none" value={v.name} onChange={e => updateVariation(i, 'name', e.target.value)} />
                            </div>
                            <div className="w-24">
                               <input type="number" placeholder="Add ₹" className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1 text-[9px] font-bold outline-none" value={v.priceModifier} onChange={e => updateVariation(i, 'priceModifier', parseInt(e.target.value)||0)} />
                            </div>
                            <button type="button" onClick={() => removeVariation(i)} className="p-1 text-slate-300 hover:text-red-600"><Trash2 size={12} /></button>
                         </div>
                       ))}
                    </div>
                 </div>
                 <button 
                  type="submit" 
                  disabled={isSyncing}
                  className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isSyncing ? <><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Committing to Cloud</> : (editingProduct ? 'Commit Changes' : 'Register Entry')}
                 </button>
              </form>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fish-jump {
          0% { transform: translateY(0) rotate(0deg); bottom: -10%; }
          30% { transform: translateY(-300px) rotate(-45deg); bottom: 40%; }
          60% { transform: translateY(-300px) rotate(45deg); bottom: 40%; }
          100% { transform: translateY(0) rotate(180deg); bottom: -10%; }
        }
        @keyframes fish-swim {
          0% { transform: translateX(-100px) translateY(0); }
          50% { transform: translateX(100px) translateY(-20px); }
          100% { transform: translateX(-100px) translateY(0); }
        }
        .animate-fish-jump { animation: fish-jump linear infinite; }
        .animate-fish-swim { animation: fish-swim ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
