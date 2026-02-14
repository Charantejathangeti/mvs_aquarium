
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Cropper from 'https://esm.sh/react-easy-crop@^5.2.0';
import { 
  LayoutDashboard, Trash2, LogOut, 
  X, Edit2, 
  Box, Plus, FileText, RefreshCw, 
  PackageCheck, Truck, 
  CreditCard, Menu, Layers,
  Save, Globe, 
  User, Printer, 
  Image as ImageIcon,
  ChevronDown,
  MessageCircle,
  Download,
  CheckCircle2,
  Crop as CropIcon,
  Maximize,
  AlertCircle,
  CloudUpload,
  Unplug,
  FlaskConical,
  Thermometer,
  Dna,
  Database,
  Search,
  ArrowUpRight,
  Activity,
  Filter,
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { CATEGORIES, SHIPPING_RATE_PER_KG, WHATSAPP_NUMBER, MOCK_PRODUCTS } from '../constants';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: (products: Product[]) => Promise<boolean>;
  orders: Order[];
  setOrders: (orders: Order[]) => Promise<boolean>;
  cloudStatus: 'online' | 'offline' | 'syncing';
  onReconnect?: () => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  canvas.width = 800;
  canvas.height = 800;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, 800, 800);
  return canvas.toDataURL('image/jpeg', 0.8);
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts, orders, setOrders, cloudStatus, onReconnect }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoice Creator'>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<any>({
    name: '', scientificName: '', category: CATEGORIES[0], price: 0, 
    weight: 0.5, image: '', description: '', stock: 0, careLevel: 'Easy',
    tempRange: '24-28°C', phRange: '6.5-7.5', diet: 'Omnivore', origin: 'Indo-Pacific'
  });

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [invoiceForm, setInvoiceForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: '', city: '', state: 'Andhra Pradesh', pinCode: '',
    items: [] as any[]
  });

  useEffect(() => {
    if (sessionStorage.getItem('mvs_aqua_admin') !== '1') {
      navigate('/admin-login');
    }
  }, [navigate]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.scientificName?.toLowerCase().includes(productSearch.toLowerCase()));
      const matchCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  const stats = useMemo(() => {
    const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
    const revenue = orders.reduce((acc, o) => acc + o.total, 0);
    return { totalStock, activeOrders, revenue };
  }, [products, orders]);

  const handleLogout = () => {
    sessionStorage.removeItem('mvs_aqua_admin');
    navigate('/admin-login');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Strict numeric casting to prevent data corruption
    const sanitizedProduct = {
      ...productForm,
      price: Number(productForm.price) || 0,
      stock: Number(productForm.stock) || 0,
      weight: Number(productForm.weight) || 0.5,
      updatedAt: new Date().toISOString()
    };

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? { ...p, ...sanitizedProduct } : p);
    } else {
      updatedProducts = [...products, { ...sanitizedProduct, id: 'MVS-' + Math.floor(1000 + Math.random() * 9000) }];
    }
    
    const success = await setProducts(updatedProducts);
    setIsSaving(false);
    if (success) {
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleQuickStockAdjust = async (id: string, delta: number) => {
    const updated = products.map(p => p.id === id ? { ...p, stock: Math.max(0, (Number(p.stock) || 0) + delta) } : p);
    await setProducts(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Permanent Deletion: Remove this specimen from the global registry?")) {
      const updated = products.filter(p => p.id !== id);
      await setProducts(updated);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProductForm({ ...productForm, image: croppedImage });
      setImageToCrop(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    await setOrders(updated);
  };

  const shareOrderViaWhatsApp = (order: Order) => {
    const productList = order.items.map(i => `• ${i.name} x ${i.quantity} (₹${i.price})`).join('\n');
    const message = `*INVOICE: #${order.id}*\n\n*Customer:*\n${order.customerName}\n${order.phone}\n\n*Items:*\n${productList}\n\n*Total: ₹${order.total}*`;
    const targetPhone = order.phone.startsWith('91') ? order.phone : `91${order.phone}`;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const addItemToInvoice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setInvoiceForm(prev => ({
        ...prev,
        items: [...prev.items, { ...product, quantity: 1 }]
      }));
    }
  };

  const handleCreateManualInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceForm.items.length === 0) return alert("Allocation Error: No items selected.");
    setIsSaving(true);
    const orderId = 'MVS-OFF-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = invoiceForm.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const weight = invoiceForm.items.reduce((acc, i) => acc + (i.weight * i.quantity), 0);
    const shipping = Math.max(80, Math.ceil(weight) * SHIPPING_RATE_PER_KG);
    
    const newOrder: Order = {
      id: orderId,
      customerName: `${invoiceForm.firstName} ${invoiceForm.lastName}`,
      firstName: invoiceForm.firstName,
      lastName: invoiceForm.lastName,
      email: invoiceForm.email,
      phone: invoiceForm.phone,
      address: invoiceForm.address,
      city: invoiceForm.city,
      state: invoiceForm.state,
      pinCode: invoiceForm.pinCode,
      country: 'India',
      items: invoiceForm.items as any,
      subtotal,
      shippingCharge: shipping,
      total: subtotal + shipping,
      weight,
      date: new Date().toISOString(),
      status: 'pending'
    };

    const success = await setOrders([...orders, newOrder]);
    setIsSaving(false);
    if (success) {
      setLastCreatedOrder(newOrder);
      setInvoiceForm({firstName:'', lastName:'', phone:'', email:'', address:'', city:'', state:'Andhra Pradesh', pinCode:'', items:[]});
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* Sidebar - Pro Layout */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] text-slate-400 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-500 text-black font-black flex items-center justify-center rounded-sm">M</div>
            <span className="font-black text-white text-base tracking-[0.2em] uppercase">MVS HUB</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white/50 hover:text-white"><X size={20}/></button>
        </div>
        <nav className="px-4 space-y-1 mt-6">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Products', icon: Box },
            { id: 'Orders', icon: PackageCheck },
            { id: 'Invoice Creator', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); setLastCreatedOrder(null); }}
              className={`w-full flex items-center gap-4 px-6 py-4 font-black transition-all text-[10px] uppercase tracking-[0.3em] rounded-sm ${
                activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-500' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.id}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-8 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 font-black text-[10px] uppercase tracking-widest transition-all">
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-sm"><Menu size={24}/></button>
            <h2 className="font-black text-slate-900 text-2xl uppercase tracking-tighter">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'Products' && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-sm group focus-within:border-cyan-500 transition-all">
                <Search size={14} className="text-slate-400" />
                <input type="text" placeholder="Search stock..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-40 placeholder:text-slate-300" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
              </div>
            )}
            {activeTab === 'Products' && (
              <button onClick={() => { setEditingProduct(null); setProductForm({name:'', scientificName:'', category:CATEGORIES[0], price:0, weight:0.5, image:'', description:'', stock:0, careLevel: 'Easy', tempRange: '24-28°C', phRange: '6.5-7.5', diet: 'Omnivore', origin: 'Indo-Pacific'}); setIsProductModalOpen(true); }} className="px-6 py-3 bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-600 shadow-2xl transition-all rounded-sm">
                <Plus size={16} /> New Specimen
              </button>
            )}
            {cloudStatus === 'offline' && onReconnect && (
              <button onClick={onReconnect} className="px-6 py-3 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-red-700 shadow-xl transition-all rounded-sm">
                <Unplug size={16} /> Reconnect
              </button>
            )}
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-10 bg-[#f8fafc]">
          {activeTab === 'Dashboard' && (
            <div className="space-y-10 max-w-7xl mx-auto animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-10 border border-slate-200 rounded-sm shadow-sm">
                    <p className="font-black text-slate-400 text-[9px] uppercase tracking-[0.3em]">Stocklist</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{products.length} Items</h3>
                  </div>
                  <div className="bg-white p-10 border border-slate-200 rounded-sm shadow-sm">
                    <p className="font-black text-slate-400 text-[9px] uppercase tracking-[0.3em]">Inventory Units</p>
                    <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">{stats.totalStock}</h3>
                  </div>
                  <div className="bg-white p-10 border border-slate-200 rounded-sm shadow-sm">
                    <p className="font-black text-slate-400 text-[9px] uppercase tracking-[0.3em]">Revenue</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{stats.revenue.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white p-10 border border-slate-200 rounded-sm shadow-sm">
                    <p className="font-black text-slate-400 text-[9px] uppercase tracking-[0.3em]">Registry Status</p>
                    <div className="flex items-center gap-2 mt-2">
                       <Globe size={20} className={cloudStatus === 'online' ? 'text-emerald-500' : cloudStatus === 'syncing' ? 'text-cyan-500 animate-spin' : 'text-red-500'} />
                       <h3 className="text-xl font-black uppercase text-slate-900 tracking-tighter">{cloudStatus}</h3>
                    </div>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 p-10 rounded-sm">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900 flex items-center gap-3"><Activity size={18} className="text-cyan-500" /> System Activity</h4>
                  </div>
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                    {orders.slice(-5).reverse().map(order => (
                      <div key={order.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-sm group hover:border-cyan-200 transition-colors">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-sm flex items-center justify-center text-slate-900 font-black text-xs">#{order.id.slice(-3)}</div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Order Logged: {order.customerName}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(order.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-emerald-600">₹{order.total}</p>
                          <ArrowUpRight size={14} className="ml-auto text-slate-300" />
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <button onClick={() => setProducts(MOCK_PRODUCTS)} className="w-full py-12 border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-[0.5em] rounded-sm">
                        Seed Registry Protocol
                      </button>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <div className="bg-white border border-slate-200 max-w-7xl mx-auto shadow-sm animate-fade-in overflow-hidden rounded-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center gap-6">
                  <Filter size={14} className="text-slate-400" />
                  <select 
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest">Biological Description</th>
                      <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest text-center">Units</th>
                      <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest">Valuation</th>
                      <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 group transition-all">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-sm overflow-hidden shrink-0">
                                <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                             </div>
                             <div className="flex flex-col">
                                <span className="font-black text-slate-900 uppercase tracking-tight text-xs">{p.name}</span>
                                <span className="text-[9px] font-bold text-slate-400 italic mt-1 uppercase tracking-tight">{p.scientificName || 'UNIDENTIFIED TAXA'}</span>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-center gap-4">
                              <button onClick={() => handleQuickStockAdjust(p.id, -1)} className="text-slate-300 hover:text-red-500 transition-colors"><MinusCircle size={16} /></button>
                              <span className="text-xs font-black text-slate-900 min-w-[30px] text-center">{p.stock}</span>
                              <button onClick={() => handleQuickStockAdjust(p.id, 1)} className="text-slate-300 hover:text-emerald-500 transition-colors"><PlusCircle size={16} /></button>
                           </div>
                        </td>
                        <td className="px-8 py-6 font-black text-emerald-600 text-sm">₹{p.price}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingProduct(p); setProductForm({...p}); setIsProductModalOpen(true); }} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-cyan-600 rounded-sm"><Edit2 size={16}/></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-sm"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}

          {activeTab === 'Orders' && (
            <div className="bg-white border border-slate-200 max-w-7xl mx-auto shadow-sm animate-fade-in overflow-hidden rounded-sm">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest">ID</th>
                       <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest">Customer</th>
                       <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest">Total</th>
                       <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest">Status</th>
                       <th className="px-8 py-6 font-black text-slate-400 text-[9px] uppercase tracking-widest text-right">Ops</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-xs">
                     {orders.slice().reverse().map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-8 py-6 font-black text-cyan-600 uppercase">#{o.id}</td>
                         <td className="px-8 py-6 font-black text-slate-900 uppercase">{o.customerName}</td>
                         <td className="px-8 py-6 font-black text-emerald-600">₹{o.total.toLocaleString()}</td>
                         <td className="px-8 py-6">
                            <select 
                              className={`px-3 py-1.5 font-black uppercase text-[9px] rounded-sm border outline-none cursor-pointer ${
                                o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                o.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                'bg-sky-50 text-sky-600 border-sky-100'
                              }`}
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            >
                               {['pending', 'packed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                         </td>
                         <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-3">
                              <button onClick={() => shareOrderViaWhatsApp(o)} className="p-2 text-slate-400 hover:text-emerald-600"><MessageCircle size={18}/></button>
                              <button onClick={() => navigate(`/invoice/${o.id}`, { state: { orderData: o } })} className="p-2 text-slate-400 hover:text-slate-900"><Printer size={18}/></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
            </div>
          )}

          {activeTab === 'Invoice Creator' && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
               <div className="lg:col-span-8 bg-white border border-slate-200 p-12 rounded-sm shadow-sm">
                  {lastCreatedOrder ? (
                    <div className="py-20 flex flex-col items-center text-center animate-fade-in">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-sm flex items-center justify-center mb-10 border border-emerald-100 shadow-xl">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Consignment Logged</h3>
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Registry Node ID: #{lastCreatedOrder.id}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                        <button onClick={() => navigate(`/invoice/${lastCreatedOrder.id}`, { state: { orderData: lastCreatedOrder } })} className="flex items-center justify-center gap-4 py-5 bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all rounded-sm"><Download size={18} /> Export Document</button>
                        <button onClick={() => shareOrderViaWhatsApp(lastCreatedOrder)} className="flex items-center justify-center gap-4 py-5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all rounded-sm"><MessageCircle size={18} /> Push WhatsApp</button>
                      </div>
                      <button onClick={() => setLastCreatedOrder(null)} className="mt-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3"><Plus size={14}/> New Transaction</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-6 border-b border-slate-50 pb-8 mb-10">
                        <div className="p-4 bg-cyan-50 text-cyan-600 rounded-sm"><User size={24}/></div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Offline Consignment Hub</h3>
                      </div>
                      <form onSubmit={handleCreateManualInvoice} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">First Name *</label>
                               <input placeholder="Enter Name" required className="w-full bg-slate-50 border border-slate-200 px-5 py-4 text-xs font-black uppercase outline-none focus:border-cyan-600 transition-all rounded-sm" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Name *</label>
                               <input placeholder="Enter Name" required className="w-full bg-slate-50 border border-slate-200 px-5 py-4 text-xs font-black uppercase outline-none focus:border-cyan-600 transition-all rounded-sm" value={invoiceForm.lastName} onChange={e => setInvoiceForm({...invoiceForm, lastName: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">WhatsApp Protocol *</label>
                           <input placeholder="91XXXXXXXXXX" required className="w-full bg-slate-50 border border-slate-200 px-5 py-4 text-xs font-black outline-none focus:border-cyan-600 transition-all rounded-sm" value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Delivery Address *</label>
                           <textarea placeholder="Logistics Details..." required className="w-full bg-slate-50 border border-slate-200 px-5 py-4 text-xs font-black outline-none focus:border-cyan-600 transition-all rounded-sm resize-none h-28" value={invoiceForm.address} onChange={e => setInvoiceForm({...invoiceForm, address: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <input placeholder="City" required className="bg-slate-50 border border-slate-200 px-5 py-4 text-xs font-black uppercase outline-none focus:border-cyan-600 rounded-sm" value={invoiceForm.city} onChange={e => setInvoiceForm({...invoiceForm, city: e.target.value})} />
                            <input placeholder="PIN Code" required className="bg-slate-50 border border-slate-200 px-5 py-4 text-xs font-black uppercase outline-none focus:border-cyan-600 rounded-sm" value={invoiceForm.pinCode} onChange={e => setInvoiceForm({...invoiceForm, pinCode: e.target.value})} />
                        </div>
                        <button type="submit" disabled={isSaving} className="w-full py-6 bg-[#0f172a] text-white font-black text-[12px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-cyan-600 transition-all disabled:opacity-50 shadow-2xl rounded-sm">
                            {isSaving ? <RefreshCw className="animate-spin" size={20}/> : <><Save size={20}/> LOCK CONSIGNMENT TO REGISTRY</>}
                        </button>
                      </form>
                    </>
                  )}
               </div>
               
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white border border-slate-200 p-10 rounded-sm shadow-sm">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 flex items-center gap-3"><Box size={16}/> Specimen Allocation</h4>
                     <div className="space-y-2 max-h-80 overflow-y-auto pr-3 custom-scrollbar">
                        {products.map(p => (
                           <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 group rounded-sm">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">{p.name}</span>
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">₹{p.price}</span>
                              </div>
                              <button onClick={() => addItemToInvoice(p.id)} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-cyan-600 hover:border-cyan-200 transition-all rounded-sm shadow-sm" disabled={!!lastCreatedOrder}><Plus size={16}/></button>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="bg-[#0f172a] text-white p-10 space-y-8 rounded-sm shadow-2xl border-t-4 border-cyan-500">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-cyan-400 border-b border-white/10 pb-6">Consignment Preview</h4>
                     <div className="space-y-6">
                        {(lastCreatedOrder ? lastCreatedOrder.items : invoiceForm.items).map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight">
                              <span className="text-slate-400 leading-tight pr-4">{item.name}</span>
                              <div className="flex items-center gap-4 shrink-0">
                                 <span>₹{item.price}</span>
                                 {!lastCreatedOrder && <button onClick={() => setInvoiceForm(prev => ({...prev, items: prev.items.filter((_, i) => i !== idx)}))} className="text-red-400 hover:scale-110 transition-transform"><X size={14}/></button>}
                              </div>
                           </div>
                        ))}
                        {(lastCreatedOrder ? lastCreatedOrder.items : invoiceForm.items).length === 0 && <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center py-4">No Specimens Allocated</p>}
                     </div>
                     <div className="pt-8 border-t border-white/10 flex justify-between items-baseline">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Total Value</span>
                        <span className="text-5xl font-black text-white tracking-tighter">₹{(lastCreatedOrder ? lastCreatedOrder.subtotal : invoiceForm.items.reduce((acc, i) => acc + i.price, 0)).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Specimen Enrollment Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-6xl relative animate-fade-in shadow-2xl border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <div className="flex-grow p-10 md:p-20 overflow-y-auto custom-scrollbar bg-white">
              <div className="flex justify-between items-start mb-16 border-b border-slate-50 pb-10">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-[#0f172a] text-cyan-400 flex items-center justify-center rounded-sm shadow-2xl">
                      <Dna size={40} />
                    </div>
                    <div>
                      <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{editingProduct ? 'Registry Update' : 'New Enrollment'}</h2>
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mt-4 flex items-center gap-3">
                        <Database size={12} className="text-cyan-500" /> Master Registry Synch Protocol
                      </p>
                    </div>
                 </div>
                 <button onClick={() => setIsProductModalOpen(false)} className="p-4 text-slate-300 hover:text-slate-900 transition-all rounded-sm hover:bg-slate-50"><X size={32}/></button>
              </div>
              
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-20">
                 <div className="space-y-12">
                    <div className="flex items-center gap-5">
                       <div className="p-3 bg-cyan-50 text-cyan-600 rounded-sm"><FlaskConical size={20} /></div>
                       <h3 className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-900">Sector A: Biological Data</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Specimen Name *</label>
                          <input required className="w-full bg-slate-50 border-b-4 border-slate-200 px-6 py-6 text-base font-black text-slate-900 outline-none focus:border-cyan-500 transition-all" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Scientific Taxon ID</label>
                          <input className="w-full bg-slate-50 border-b-4 border-slate-200 px-6 py-6 text-base font-bold text-slate-400 italic outline-none focus:border-cyan-500 transition-all" placeholder="e.g., Betta splendens" value={productForm.scientificName} onChange={e => setProductForm({...productForm, scientificName: e.target.value})} />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Class Type</label>
                          <select className="w-full appearance-none bg-slate-50 border-b-4 border-slate-200 px-6 py-5 text-[11px] font-black uppercase tracking-widest outline-none" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Valuation (₹) *</label>
                          <input required type="number" className="w-full bg-slate-50 border-b-4 border-slate-200 px-6 py-5 text-lg font-black text-emerald-600 outline-none focus:border-cyan-500" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Registry Stock *</label>
                          <input required type="number" className="w-full bg-slate-50 border-b-4 border-slate-200 px-6 py-5 text-lg font-black text-slate-900 outline-none focus:border-cyan-500" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Mass (KG)</label>
                          <input type="number" step="0.01" className="w-full bg-slate-50 border-b-4 border-slate-200 px-6 py-5 text-lg font-black text-slate-900 outline-none focus:border-cyan-500" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: e.target.value})} />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-10 border-t border-slate-50">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Biological Narrative</label>
                    <textarea required rows={6} className="w-full bg-slate-50 border border-slate-200 p-8 text-base font-bold text-slate-600 outline-none focus:border-slate-900 rounded-sm resize-none" placeholder="Detailed specimen characteristics..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                 </div>
              </form>
            </div>

            <div className="w-full md:w-[480px] bg-[#020617] p-12 flex flex-col justify-between border-l border-white/5 relative">
               <div className="space-y-12">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-cyan-400 flex items-center gap-4 border-b border-white/10 pb-8"><ImageIcon size={20}/> Asset Registry</h4>
                  <div className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-sm overflow-hidden flex flex-col items-center justify-center group relative cursor-pointer hover:border-cyan-500/50 hover:bg-white/[0.08] transition-all shadow-2xl">
                     {productForm.image ? (
                        <>
                          <img src={productForm.image} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-500">
                             <RefreshCw className="text-white mb-4" size={32}/>
                             <span className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Replace Asset</span>
                          </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center gap-6">
                           <CloudUpload size={56} className="text-white/10 animate-pulse" />
                           <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/30 text-center px-12">Upload Specimen Asset</span>
                        </div>
                     )}
                     <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onFileChange} />
                  </div>
               </div>

               <div className="pt-12 space-y-5">
                  <button type="submit" form="productForm" disabled={isSaving} className="w-full py-8 bg-cyan-600 hover:bg-cyan-500 text-black font-black text-[14px] uppercase tracking-[0.6em] flex items-center justify-center gap-4 shadow-3xl shadow-cyan-900/40 transition-all disabled:opacity-30 rounded-sm">
                    {isSaving ? <RefreshCw size={24} className="animate-spin" /> : <Save size={24} />} 
                    <span>{editingProduct ? 'Commit Update' : 'Broadcast to Node'}</span>
                  </button>
                  <button onClick={() => setIsProductModalOpen(false)} className="w-full py-5 text-white/30 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white/5 rounded-sm">Discard Changes</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Asset Tuner (Cropper) */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[#020617]">
          <div className="flex items-center justify-between p-10 bg-[#0a0f14] border-b border-white/5">
             <div className="flex items-center gap-8"><h2 className="text-3xl font-black text-white uppercase tracking-tighter">Asset Processing</h2></div>
             <button onClick={() => setImageToCrop(null)} className="p-4 text-slate-500 hover:text-white transition-all"><X size={40} /></button>
          </div>
          <div className="flex-grow relative bg-black">
            <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={(a, p) => setCroppedAreaPixels(p)} onZoomChange={setZoom} />
          </div>
          <div className="p-16 bg-[#0a0f14] border-t border-white/5 flex justify-center gap-8">
              <button onClick={() => setImageToCrop(null)} className="px-16 py-6 bg-white/5 text-slate-400 font-black text-[12px] uppercase tracking-widest hover:text-white transition-all rounded-sm border border-white/5">Abort</button>
              <button onClick={handleConfirmCrop} className="px-28 py-6 bg-cyan-600 text-black font-black text-[12px] uppercase tracking-widest hover:bg-cyan-500 flex items-center gap-5 transition-all active:scale-95 rounded-sm"><Maximize size={24} /> Sync Asset</button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
