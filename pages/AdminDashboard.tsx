
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
  CloudUpload
} from 'lucide-react';
import { CATEGORIES, SHIPPING_RATE_PER_KG, WHATSAPP_NUMBER } from '../constants';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: (products: Product[]) => Promise<boolean>;
  orders: Order[];
  setOrders: (orders: Order[]) => Promise<boolean>;
  cloudStatus: 'online' | 'offline' | 'syncing';
}

// Image Helpers
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts, orders, setOrders, cloudStatus }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoice Creator'>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<any>({
    name: '', scientificName: '', category: CATEGORIES[0], price: 0, 
    weight: 0, image: '', description: '', stock: 0, careLevel: 'Easy'
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

  const stats = useMemo(() => {
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
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
    let updatedProducts: Product[];
    
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p);
    } else {
      updatedProducts = [...products, { ...productForm, id: 'MVS-' + Math.floor(1000 + Math.random() * 9000) }];
    }
    
    const success = await setProducts(updatedProducts);
    setIsSaving(false);
    if (success) {
      setIsProductModalOpen(false);
    }
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

  const addItemToInvoice = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    setInvoiceForm(prev => ({ ...prev, items: [...prev.items, { ...prod, quantity: 1 }] }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-400 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-600 text-black font-black flex items-center justify-center text-xs">M</div>
            <span className="font-black text-white text-sm tracking-[0.2em] uppercase">MVS HUB</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white/50 hover:text-white"><X size={20}/></button>
        </div>
        <nav className="p-4 space-y-1 mt-6">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Products', icon: Box },
            { id: 'Orders', icon: PackageCheck },
            { id: 'Invoice Creator', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); setLastCreatedOrder(null); }}
              className={`w-full flex items-center gap-4 px-5 py-4 font-black transition-all text-[9px] uppercase tracking-[0.3em] ${
                activeTab === tab.id ? 'bg-cyan-600/10 text-cyan-400 border-l-2 border-cyan-500' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.id}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-slate-600 hover:text-red-400 font-black text-[9px] uppercase tracking-widest transition-all">
            <LogOut size={14} />
            <span>Terminate Hub Access</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 text-slate-500"><Menu size={20}/></button>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-lg uppercase tracking-tight">{activeTab}</span>
              <div className="flex items-center gap-2">
                 <Globe size={10} className={cloudStatus === 'online' ? 'text-emerald-500' : cloudStatus === 'syncing' ? 'text-cyan-500 animate-spin' : 'text-red-500'} />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   {cloudStatus === 'online' ? 'GLOBAL MASTER LINK ACTIVE' : cloudStatus === 'syncing' ? 'DATABASE SYNCING...' : 'DATABASE DISCONNECTED'}
                 </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {activeTab === 'Products' && (
                <button onClick={() => { setEditingProduct(null); setProductForm({name:'', scientificName:'', category:CATEGORIES[0], price:0, weight:0, image:'', description:'', stock:0}); setIsProductModalOpen(true); }} className="px-5 py-2.5 bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-600 shadow-lg shadow-slate-200 transition-all">
                  <Plus size={14} /> New Specimen Entry
                </button>
             )}
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-8 bg-slate-50/30">
          {(cloudStatus === 'offline' || cloudStatus === 'syncing') && (
            <div className={`mb-6 p-4 flex items-center gap-4 rounded-sm animate-fade-in border ${
              cloudStatus === 'offline' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-cyan-50 border-cyan-100 text-cyan-700'
            }`}>
              {cloudStatus === 'offline' ? <AlertCircle size={20} /> : <CloudUpload size={20} className="animate-bounce" />}
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                {cloudStatus === 'offline' 
                  ? 'Device is disconnected from Master Registry. Changes will not persist globally.' 
                  : 'Syncing changes to Global Master Registry...'}
              </p>
            </div>
          )}

          {activeTab === 'Dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-8 border border-slate-200 flex justify-between items-center group">
                  <div className="space-y-1">
                    <p className="font-black text-slate-400 text-[8px] uppercase tracking-[0.2em]">Live Registry Stock</p>
                    <h3 className="text-2xl font-black text-slate-900">{products.length} Biologicals</h3>
                  </div>
                  <Box className="text-slate-100 group-hover:text-cyan-500 transition-colors" size={32} />
                </div>
                <div className="bg-white p-8 border border-slate-200 flex justify-between items-center group">
                  <div className="space-y-1">
                    <p className="font-black text-slate-400 text-[8px] uppercase tracking-[0.2em]">Shipment Pipeline</p>
                    <h3 className="text-2xl font-black text-cyan-600">{stats.activeOrders} Active</h3>
                  </div>
                  <Truck className="text-slate-100 group-hover:text-cyan-500 transition-colors" size={32} />
                </div>
                <div className="bg-white p-8 border border-slate-200 flex justify-between items-center group">
                  <div className="space-y-1">
                    <p className="font-black text-slate-400 text-[8px] uppercase tracking-[0.2em]">Gross Revenue</p>
                    <h3 className="text-2xl font-black text-emerald-600">₹{stats.revenue.toLocaleString()}</h3>
                  </div>
                  <CreditCard className="text-slate-100 group-hover:text-emerald-500 transition-colors" size={32} />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-8 flex items-center justify-between">
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Registry Synchronization Protocol</h4>
                   <p className="text-xs font-bold text-slate-600">All data documents are committed to the secure cloud master endpoint.</p>
                </div>
                <button onClick={() => window.location.reload()} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl shadow-slate-200">
                  <RefreshCw size={14} className={cloudStatus === 'syncing' ? 'animate-spin' : ''} /> Force Master Fetch
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <div className="bg-white border border-slate-200 max-w-6xl mx-auto shadow-sm animate-fade-in overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Biological Description</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Global Units</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Valuation</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 uppercase tracking-tight text-xs">{p.name}</span>
                            <span className="text-[8px] font-bold text-slate-400 italic">{p.scientificName || 'UNIDENTIFIED TAXA'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-[8px] font-black bg-slate-100 border border-slate-200 px-2 py-0.5 uppercase tracking-widest">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-700 text-xs">{p.stock} Units</td>
                        <td className="px-6 py-4 font-black text-slate-900 text-xs">₹{p.price}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingProduct(p); setProductForm({...p}); setIsProductModalOpen(true); }} className="p-2 text-slate-400 hover:text-cyan-600 transition-colors"><Edit2 size={14}/></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}

          {activeTab === 'Orders' && (
            <div className="bg-white border border-slate-200 max-w-6xl mx-auto shadow-sm animate-fade-in overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Registry ID</th>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Profile Name</th>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Valuation</th>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Logistics Status</th>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-xs">
                     {orders.slice().reverse().map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-black text-cyan-600 uppercase tracking-tighter">#{o.id}</td>
                         <td className="px-6 py-4 font-black text-slate-900 uppercase tracking-tight">{o.customerName}</td>
                         <td className="px-6 py-4 font-black text-slate-900">₹{o.total.toLocaleString()}</td>
                         <td className="px-6 py-4">
                            <select 
                              className={`px-2 py-1 font-black uppercase text-[8px] rounded-sm border outline-none cursor-pointer ${
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
                         <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => shareOrderViaWhatsApp(o)} className="p-2 text-slate-400 hover:text-emerald-600 transition-all"><MessageCircle size={16}/></button>
                              <button onClick={() => navigate(`/invoice/${o.id}`, { state: { orderData: o } })} className="p-2 text-slate-400 hover:text-slate-900 transition-all"><Printer size={16}/></button>
                              <button onClick={() => handleStatusChange(o.id, 'cancelled')} className="p-2 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
            </div>
          )}

          {activeTab === 'Invoice Creator' && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
               <div className="lg:col-span-7 bg-white border border-slate-200 p-10 space-y-8">
                  {lastCreatedOrder ? (
                    <div className="py-12 flex flex-col items-center text-center animate-fade-in">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-sm flex items-center justify-center mb-6 border border-emerald-100">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Registry Record Locked</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Master Registry ID: #{lastCreatedOrder.id}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <button onClick={() => navigate(`/invoice/${lastCreatedOrder.id}`, { state: { orderData: lastCreatedOrder } })} className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all rounded-sm"><Download size={16} /> Export Document</button>
                        <button onClick={() => shareOrderViaWhatsApp(lastCreatedOrder)} className="flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all rounded-sm"><MessageCircle size={16} /> WhatsApp Push</button>
                      </div>
                      <button onClick={() => setLastCreatedOrder(null)} className="mt-8 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"><Plus size={12}/> Initialize New Entry</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                        <div className="p-3 bg-cyan-50 text-cyan-600"><User size={20}/></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Manual Master Registry Entry</h3>
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Off-Platform Consignment Logging</p>
                        </div>
                      </div>
                      <form onSubmit={handleCreateManualInvoice} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="First Name" required className="bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold uppercase outline-none focus:border-cyan-600" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                            <input placeholder="Last Name" required className="bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold uppercase outline-none focus:border-cyan-600" value={invoiceForm.lastName} onChange={e => setInvoiceForm({...invoiceForm, lastName: e.target.value})} />
                        </div>
                        <input placeholder="Phone / WhatsApp Contact" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold outline-none focus:border-cyan-600" value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                        <textarea placeholder="Biological Fulfillment Destination" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold outline-none focus:border-cyan-600 resize-none h-24" value={invoiceForm.address} onChange={e => setInvoiceForm({...invoiceForm, address: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="City" required className="bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold uppercase outline-none focus:border-cyan-600" value={invoiceForm.city} onChange={e => setInvoiceForm({...invoiceForm, city: e.target.value})} />
                            <input placeholder="PIN Code" required className="bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold uppercase outline-none focus:border-cyan-600" value={invoiceForm.pinCode} onChange={e => setInvoiceForm({...invoiceForm, pinCode: e.target.value})} />
                        </div>
                        <button type="submit" disabled={isSaving} className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-cyan-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200">
                            {isSaving ? <RefreshCw className="animate-spin" size={16}/> : <><Save size={16}/> COMMIT TO GLOBAL MASTER REGISTRY</>}
                        </button>
                      </form>
                    </>
                  )}
               </div>
               <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white border border-slate-200 p-8">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3"><Box size={14}/> Stock Allocation Engine</h4>
                     <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {products.map(p => (
                           <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 group">
                              <span className="text-[9px] font-black uppercase tracking-tight text-slate-700">{p.name}</span>
                              <button onClick={() => addItemToInvoice(p.id)} className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-cyan-600 hover:border-cyan-100 transition-all" disabled={!!lastCreatedOrder}><Plus size={14}/></button>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-black text-white p-8 space-y-6 rounded-sm shadow-2xl">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 border-b border-white/10 pb-4">Draft Consignment</h4>
                     <div className="space-y-4">
                        {(lastCreatedOrder ? lastCreatedOrder.items : invoiceForm.items).map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-[11px] font-black uppercase">
                              <span className="text-slate-400">{item.name}</span>
                              <div className="flex items-center gap-4">
                                 <span>₹{item.price}</span>
                                 {!lastCreatedOrder && <button onClick={() => setInvoiceForm(prev => ({...prev, items: prev.items.filter((_, i) => i !== idx)}))} className="text-red-400"><X size={12}/></button>}
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Gross Valuation</span>
                        <span className="text-3xl font-black text-white tracking-tighter">₹{(lastCreatedOrder ? lastCreatedOrder.subtotal : invoiceForm.items.reduce((acc, i) => acc + i.price, 0)).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal with Global DB Integration */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl relative animate-fade-in shadow-2xl border border-white/10 rounded-sm">
            <div className="p-10 pb-4 flex justify-between items-start border-b border-slate-100">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-sm flex items-center justify-center">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{editingProduct ? 'Tune Specimen' : 'Add Specimen'}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">COMMITTING TO GLOBAL MASTER REGISTRY</p>
                  </div>
               </div>
               <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-10 pt-6 space-y-8">
               <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Biological Label *</label>
                    <input required className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-xs font-black text-slate-900 outline-none focus:border-sky-500 transition-all rounded-sm" placeholder="e.g., Premium Halfmoon Betta" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Unit Valuation (₹) *</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-xs font-black text-sky-600 outline-none focus:border-sky-500 transition-all rounded-sm" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)||0})} />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Scientific Taxon ID</label>
                    <input className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-xs font-black text-slate-400 italic outline-none focus:border-sky-500 transition-all rounded-sm" placeholder="e.g., Betta splendens" value={productForm.scientificName} onChange={e => setProductForm({...productForm, scientificName: e.target.value})} />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Registry Stock Units *</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-100 px-4 py-4 text-xs font-black text-slate-900 outline-none focus:border-sky-500 transition-all rounded-sm" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)||0})} />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Biological Visual Asset</label>
                  <div className="flex gap-2">
                    <input className="flex-grow bg-slate-50 border border-slate-100 px-4 py-4 text-xs font-bold text-slate-600 outline-none rounded-sm" placeholder="Master Asset URL" value={productForm.image.startsWith('data:') ? '[LOCAL BUFFERED ASSET]' : productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                    <label className="px-8 bg-slate-900 text-white flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all rounded-sm cursor-pointer whitespace-nowrap">
                      <ImageIcon size={16} /> Asset Capture
                      <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                    </label>
                  </div>
                  {productForm.image && <img src={productForm.image} alt="Master Prev" className="mt-4 w-20 h-20 object-cover border border-slate-200 rounded-sm" />}
               </div>

               <button type="submit" disabled={isSaving} className="w-full py-5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-sky-100 transition-all rounded-sm">
                 {isSaving ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>} 
                 <span>{editingProduct ? 'UPDATE MASTER RECORD' : 'COMMIT TO GLOBAL MASTER REGISTRY'}</span>
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Visual Tuner (Cropper) */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950">
          <div className="flex items-center justify-between p-6 bg-slate-900 border-b border-white/5">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-cyan-600 text-black flex items-center justify-center"><CropIcon size={20} /></div>
               <h2 className="text-xl font-black text-white uppercase tracking-tighter">Specimen Visual Tuner</h2>
             </div>
             <button onClick={() => setImageToCrop(null)} className="text-slate-400 hover:text-white"><X size={24} /></button>
          </div>
          <div className="flex-grow relative bg-black">
            <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={(a, p) => setCroppedAreaPixels(p)} onZoomChange={setZoom} />
          </div>
          <div className="p-10 bg-slate-900 border-t border-white/5 flex justify-center gap-4">
              <button onClick={() => setImageToCrop(null)} className="px-10 py-4 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white rounded-sm">Cancel Tuning</button>
              <button onClick={handleConfirmCrop} className="px-16 py-4 bg-cyan-600 text-black font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 flex items-center gap-3 rounded-sm shadow-xl shadow-cyan-900/20"><Maximize size={16} /> Apply Protocol & Save</button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
