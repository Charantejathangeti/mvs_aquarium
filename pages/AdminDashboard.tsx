
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  LayoutDashboard, Trash2, Search, LogOut, 
  X, PlusCircle, Image as ImageIcon, Camera, Edit2Icon, 
  TrashIcon, Box, Plus, Download, FileText, RefreshCw, 
  AlertCircle, CheckCircle, PackageCheck, Zap, Globe, ExternalLink,
  Truck, ClipboardList, CreditCard, UserCheck, Settings, Printer, Phone, MapPin, Menu, Info, Layers,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../constants.ts';
import { Product, Order, Variation } from '../types.ts';

interface AdminDashboardProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const GLOBAL_SYNC_BIN = '043f82e16fdf9e246988';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoice'>('Dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'synced' | 'local-master'>('synced');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string; scientificName: string; category: string; price: number; 
    weight: number; image: string; description: string; stock: number; 
    careLevel: 'Easy' | 'Moderate' | 'Advanced'; variations: Variation[];
  }>({
    name: '', scientificName: '', category: CATEGORIES[0], price: 0, 
    weight: 0, image: '', description: '', stock: 0, careLevel: 'Easy', variations: []
  });

  const [invoiceForm, setInvoiceForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: '', city: '', state: 'Andhra Pradesh', pinCode: '',
    taxRate: 0,
    items: [{ id: 'manual-' + Date.now(), name: '', quantity: 1, price: 0, weight: 0 }]
  });

  useEffect(() => {
    if (sessionStorage.getItem('mvs_aqua_admin') !== '1') {
      navigate('/admin-login');
      return;
    }
    const savedOrders = JSON.parse(localStorage.getItem('mvs_aqua_orders') || '[]');
    setOrders(savedOrders);
  }, [navigate]);

  const handleForceSync = async () => {
    if (syncStatus === 'saving') return;
    setSyncStatus('saving');
    try {
      const response = await fetch(`https://api.npoint.io/${GLOBAL_SYNC_BIN}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      });
      if (response.ok) {
        setSyncStatus('synced');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else { setSyncStatus('local-master'); }
    } catch (err) { setSyncStatus('local-master'); }
  };

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setTimeout(handleForceSync, 15000); 
    return () => clearTimeout(timer);
  }, [products]);

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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p);
      setProducts(updated);
    } else {
      const newProduct: Product = { ...productForm, id: 'MVS-' + Math.floor(1000 + Math.random() * 9000) };
      setProducts([...products, newProduct]);
    }
    setIsProductModalOpen(false);
  };

  const generateManualInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = invoiceForm.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalWeight = invoiceForm.items.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
    const shipping = Math.max(80, Math.ceil(totalWeight) * 80);
    const tax = (subtotal * invoiceForm.taxRate) / 100;
    const total = subtotal + shipping + tax;
    const orderId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    
    const newOrder: Order = {
      id: orderId, firstName: invoiceForm.firstName, lastName: invoiceForm.lastName,
      customerName: `${invoiceForm.firstName} ${invoiceForm.lastName}`, email: invoiceForm.email,
      phone: invoiceForm.phone, address: invoiceForm.address, city: invoiceForm.city,
      state: invoiceForm.state, pinCode: invoiceForm.pinCode, country: 'India',
      items: invoiceForm.items.map(item => ({ ...item, category: 'Manual' } as any)),
      subtotal, shippingCharge: shipping, total, weight: totalWeight,
      date: new Date().toISOString(), status: 'pending'
    };

    const existing = JSON.parse(localStorage.getItem('mvs_aqua_orders') || '[]');
    existing.push(newOrder);
    localStorage.setItem('mvs_aqua_orders', JSON.stringify(existing));
    setOrders(existing);
    navigate(`/invoice/${orderId}`, { state: { orderData: newOrder } });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald-600 text-white px-5 py-3 flex items-center gap-3 rounded-md shadow-2xl animate-fade-in">
          <CheckCircle className="text-white" size={18} />
          <span className="font-bold text-sm">Inventory Synced Successfully</span>
        </div>
      )}

      {/* Sidebar - Modern Professional */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-slate-900 text-slate-300 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500 text-white font-black flex items-center justify-center rounded-md text-sm shadow-lg">M</div>
            <span className="font-bold text-white text-sm tracking-tight">Admin Panel</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-white/5 rounded-md"><X size={20}/></button>
        </div>

        <nav className="p-3 space-y-2 mt-4">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Products', icon: Box },
            { id: 'Orders', icon: PackageCheck },
            { id: 'Invoice', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-md transition-all ${
                activeTab === tab.id ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[13px]">{tab.id}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/5 font-bold rounded-md transition-all">
            <LogOut size={18} />
            <span className="text-[13px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Module Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"><Menu size={22}/></button>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-xl md:text-2xl leading-tight">{activeTab}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">MVS Aqua Store Management</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             {activeTab === 'Products' && (
                <button 
                  onClick={() => { 
                    setEditingProduct(null); 
                    setProductForm({name:'', scientificName: '', category:CATEGORIES[0], price:0, weight:0, image:'', description:'', stock:0, careLevel: 'Easy', variations: []}); 
                    setIsProductModalOpen(true); 
                  }} 
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-md flex items-center gap-2 hover:bg-sky-600 transition-all text-xs shadow-md"
                >
                  <Plus size={16} /> Add Product
                </button>
             )}
             <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className={`w-2 h-2 rounded-full ${syncStatus === 'saving' ? 'bg-sky-500 animate-pulse' : 'bg-emerald-500'}`} />
               <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">{syncStatus === 'saving' ? 'Updating' : 'Online'}</span>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-slate-50">
          
          {activeTab === 'Dashboard' && (
            <div className="space-y-6 max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Total Products', value: products.length, icon: Box, color: 'text-slate-900' },
                  { label: 'Active Orders', value: stats.activeOrders, icon: Truck, color: 'text-sky-600' },
                  { label: 'Store Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-600' }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 border border-slate-200 rounded-md shadow-sm flex items-center justify-between group hover:border-sky-500/20 transition-all">
                    <div className="space-y-1">
                       <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">{s.label}</p>
                       <h3 className={`text-2xl font-black ${s.color} leading-none`}>{s.value}</h3>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-sky-50 transition-colors">
                      <s.icon size={22} className="text-slate-300 group-hover:text-sky-500" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                 <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
                    <h4 className="font-bold text-slate-600 text-xs uppercase tracking-wider">Recent Orders</h4>
                    <RefreshCw size={14} className="text-slate-300 animate-spin-slow cursor-pointer hover:text-slate-500 transition-colors"/>
                 </div>
                 <div className="divide-y divide-slate-100">
                   {orders.slice(-6).reverse().map(o => (
                     <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 text-slate-900 flex items-center justify-center rounded-md text-[10px] font-black border border-slate-200">#{o.id.slice(-3)}</div>
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-[13px]">{o.customerName}</span>
                              <span className="text-[11px] font-medium text-slate-400">{new Date(o.date).toLocaleDateString('en-IN')}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <span className="font-bold text-slate-900 text-sm">₹{o.total.toLocaleString()}</span>
                           <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                             o.status === 'delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                           }`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden max-w-7xl overflow-x-auto shadow-sm">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Inventory</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-[13px] leading-tight">{p.name}</span>
                          <span className="text-[11px] font-medium text-slate-400 italic mt-0.5">{p.scientificName || 'Unlabeled Specimen'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-slate-500 font-bold text-[11px] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{p.category}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-slate-700">{p.stock}</td>
                      <td className="px-6 py-4 font-bold text-sm text-slate-900">₹{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                          <button onClick={() => { setEditingProduct(p); setProductForm({...p, variations: p.variations || []} as any); setIsProductModalOpen(true); }} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"><Edit2Icon size={16} /></button>
                          <button onClick={() => { if(confirm('Delete this product?')) setProducts(products.filter(i=>i.id!==p.id)) }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><TrashIcon size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Orders' && (
            <div className="bg-white border border-slate-200 rounded-md overflow-hidden max-w-7xl overflow-x-auto shadow-sm">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Customer Name</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Order Total</th>
                    <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice().reverse().map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sky-600 text-[13px]">#{o.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-[13px]">{o.customerName}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-[13px]">₹{o.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => navigate(`/invoice/${o.id}`, { state: { orderData: o } })} className="p-2.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-900 hover:text-white transition-all"><FileText size={16}/></button>
                          <button onClick={() => { if(confirm('Remove order record?')) setOrders(orders.filter(ord=>ord.id!==o.id)) }} className="p-2.5 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Invoice' && (
            <div className="max-w-4xl space-y-6 mx-auto">
               <form onSubmit={generateManualInvoice} className="space-y-6">
                <div className="bg-white border border-slate-200 p-8 rounded-md shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                    <UserCheck size={20} className="text-sky-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                        <input required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-md outline-none focus:border-sky-500 transition-colors text-sm" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                        <input required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-md outline-none focus:border-sky-500 transition-colors text-sm" value={invoiceForm.lastName} onChange={e => setInvoiceForm({...invoiceForm, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                       <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-3 rounded-md focus-within:border-sky-500 transition-colors">
                          <Phone size={16} className="text-slate-300"/>
                          <input required type="tel" className="w-full bg-transparent font-bold outline-none text-sm" placeholder="Mobile number..." value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                       </div>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Shipping Address</label>
                       <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 px-4 py-3 rounded-md focus-within:border-sky-500 transition-colors">
                          <MapPin size={16} className="text-slate-300 mt-1"/>
                          <textarea required rows={2} className="w-full bg-transparent font-bold outline-none resize-none text-sm leading-relaxed" placeholder="Detailed address for delivery..." value={invoiceForm.address} onChange={e => setInvoiceForm({...invoiceForm, address: e.target.value})} />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList size={20} className="text-sky-600" />
                      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Item Details</h3>
                    </div>
                    <button type="button" onClick={() => setInvoiceForm({...invoiceForm, items: [...invoiceForm.items, { id: 'manual-' + Date.now(), name: '', quantity: 1, price: 0, weight: 0 }]})} className="px-5 py-2 border border-sky-100 text-sky-600 bg-sky-50/30 font-bold uppercase text-[10px] tracking-wider rounded-md hover:bg-sky-50 transition-all">+ Add New Row</button>
                  </div>
                  <div className="space-y-3">
                    {invoiceForm.items.map((item, idx) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-3 rounded-md border border-slate-100 group">
                        <div className="col-span-6 md:col-span-5">
                          <input required placeholder="Item Description" className="w-full bg-white px-4 py-2 border border-slate-200 font-bold rounded-md outline-none focus:border-sky-500 transition-all text-[13px]" value={item.name} onChange={e => { const updated = invoiceForm.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i); setInvoiceForm({...invoiceForm, items: updated}); }} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <input required type="number" className="w-full bg-white px-2 py-2 border border-slate-200 font-bold rounded-md text-center text-[13px]" value={item.quantity} onChange={e => { const updated = invoiceForm.items.map(i => i.id === item.id ? { ...i, quantity: parseInt(e.target.value)||1 } : i); setInvoiceForm({...invoiceForm, items: updated}); }} />
                        </div>
                        <div className="col-span-2 md:col-span-2">
                          <input required type="number" placeholder="Price" className="w-full bg-white px-2 py-2 border border-slate-200 font-bold rounded-md text-center text-[13px]" value={item.price} onChange={e => { const updated = invoiceForm.items.map(i => i.id === item.id ? { ...i, price: parseInt(e.target.value)||0 } : i); setInvoiceForm({...invoiceForm, items: updated}); }} />
                        </div>
                        <div className="col-span-1 md:col-span-2 hidden md:block">
                          <input required type="number" step="0.01" placeholder="Wt (kg)" className="w-full bg-white px-2 py-2 border border-slate-200 font-bold rounded-md text-center text-[13px]" value={item.weight} onChange={e => { const updated = invoiceForm.items.map(i => i.id === item.id ? { ...i, weight: parseFloat(e.target.value)||0 } : i); setInvoiceForm({...invoiceForm, items: updated}); }} />
                        </div>
                        <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => { if(invoiceForm.items.length > 1) setInvoiceForm({...invoiceForm, items: invoiceForm.items.filter(i=>i.id!==item.id)}) }} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-8">
                    <div className="flex items-center gap-4">
                        <label className="font-bold text-slate-400 uppercase text-[10px]">Tax Rate</label>
                        <select className="bg-slate-50 border border-slate-200 px-4 py-2 font-bold rounded-md text-xs" value={invoiceForm.taxRate} onChange={e => setInvoiceForm({...invoiceForm, taxRate: parseInt(e.target.value)})}>
                           <option value="0">GST 0%</option>
                           <option value="5">GST 5%</option>
                           <option value="12">GST 12%</option>
                           <option value="18">GST 18%</option>
                        </select>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Total Payable</p>
                       <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{(invoiceForm.items.reduce((acc, i) => acc + (i.price * i.quantity), 0) + (invoiceForm.items.reduce((acc, i) => acc + (i.price * i.quantity), 0) * invoiceForm.taxRate / 100)).toLocaleString()}</p>
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-10 py-4 bg-slate-900 text-white font-bold rounded-md hover:bg-sky-600 transition-all flex items-center justify-center gap-3 shadow-xl text-sm uppercase tracking-widest">
                     <Printer size={18} />
                     Generate and Print Receipt
                  </button>
                </div>
               </form>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-8 relative rounded-lg animate-fade-in shadow-2xl border border-slate-200">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
            
            <div className="mb-8 flex items-center gap-3">
               <div className="p-3 bg-sky-50 rounded-lg"><Layers size={22} className="text-sky-600" /></div>
               <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {editingProduct ? 'Modify Product' : 'Add New Product'}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Management Portal</p>
               </div>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Product Display Name *</label>
                      <input required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-md outline-none focus:border-sky-500 transition-all text-sm" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Scientific Name</label>
                      <input className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-md outline-none focus:border-sky-500 transition-all italic text-sm" placeholder="Genus species..." value={productForm.scientificName} onChange={e => setProductForm({...productForm, scientificName: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                         <select className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 font-bold rounded-md text-xs" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Care Level</label>
                         <select className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 font-bold rounded-md text-xs" value={productForm.careLevel} onChange={e => setProductForm({...productForm, careLevel: e.target.value as any})}>
                            <option value="Easy">Beginner</option>
                            <option value="Moderate">Experienced</option>
                            <option value="Advanced">Professional</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Price (₹) *</label>
                         <input type="number" required className="w-full bg-white border border-sky-100 px-4 py-3 font-black text-sky-600 rounded-md outline-none text-base" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)||0})} />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Stock Level *</label>
                         <input type="number" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-md text-sm" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)||0})} />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Weight (kg) *</label>
                      <input type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-md text-sm" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: parseFloat(e.target.value)||0})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Product Media</label>
                      <div className="flex gap-4">
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-grow py-3 px-4 bg-slate-900 text-white font-bold rounded-md hover:bg-sky-600 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                            <ImageIcon size={16}/>
                            {productForm.image ? 'Change Photo' : 'Upload Photo'}
                         </button>
                         {productForm.image && (
                           <div className="w-12 h-12 bg-slate-50 rounded-md border border-slate-200 overflow-hidden shrink-0 shadow-sm"><img src={productForm.image} className="w-full h-full object-cover" /></div>
                         )}
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const r = new FileReader();
                           r.onloadend = () => setProductForm(p => ({...p, image: r.result as string}));
                           r.readAsDataURL(file);
                         }
                      }} />
                   </div>
                </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-slate-400 uppercase">Detailed Description</label>
                 <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-medium rounded-md resize-none outline-none focus:border-sky-500 transition-colors text-sm leading-relaxed" placeholder="Record characteristics, origin, and care instructions..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-5 bg-sky-600 text-white font-black rounded-md hover:bg-sky-700 transition-all shadow-2xl active:scale-[0.98] text-sm uppercase tracking-[0.2em] mt-4">
                {editingProduct ? 'Commit Product Changes' : 'Confirm and List Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
