
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  LayoutDashboard, Trash2, Search, LogOut, 
  X, Image as ImageIcon, Edit2, 
  Box, Plus, FileText, RefreshCw, 
  CheckCircle, PackageCheck, Truck, ClipboardList, 
  CreditCard, UserCheck, Printer, Phone, MapPin, Menu, Layers
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product, Order, Variation } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoices'>('Dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
      const newProduct: Product = { 
        ...productForm, 
        id: 'MVS-' + Math.floor(1000 + Math.random() * 9000) 
      };
      updatedProducts = [...products, newProduct];
    }
    
    await setProducts(updatedProducts); 
    setIsSaving(false);
    setIsProductModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
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
        <div className="fixed top-8 right-8 z-[100] bg-emerald-600 text-white px-6 py-4 flex items-center gap-3 rounded-md shadow-2xl animate-fade-in">
          <CheckCircle className="text-white" size={20} />
          <span className="font-bold text-sm">Inventory Successfully Updated</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-600 text-white font-black flex items-center justify-center rounded-md text-base">M</div>
            <span className="font-extrabold text-white text-lg tracking-tight">Admin Console</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white"><X size={24}/></button>
        </div>

        <nav className="p-4 space-y-2 mt-6">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Products', icon: Box },
            { id: 'Orders', icon: PackageCheck },
            { id: 'Invoices', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 font-bold rounded-md transition-all ${
                activeTab === tab.id ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-sm">{tab.id}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-400 font-bold rounded-md transition-all">
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500"><Menu size={24}/></button>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-2xl leading-none">{activeTab}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Store Management</span>
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
                  className="px-6 py-3 bg-slate-900 text-white font-bold rounded-md flex items-center gap-2 hover:bg-sky-600 transition-all text-sm shadow-md"
                >
                  <Plus size={18} /> Add Product
                </button>
             )}
             <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
               <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Cloud Connected</span>
             </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-8 md:p-12 bg-slate-50">
          {activeTab === 'Dashboard' && (
            <div className="space-y-8 max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  { label: 'Total Stocked Species', value: products.length, icon: Box, color: 'text-slate-900' },
                  { label: 'Active Order Flow', value: stats.activeOrders, icon: Truck, color: 'text-sky-600' },
                  { label: 'Cumulative Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-600' }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 border border-slate-200 rounded-md shadow-sm flex items-center justify-between group hover:border-sky-500/30 transition-all">
                    <div className="space-y-1">
                       <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">{s.label}</p>
                       <h3 className={`text-3xl font-black ${s.color} leading-none`}>{s.value}</h3>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg group-hover:bg-sky-50 transition-colors">
                      <s.icon size={28} className="text-slate-200 group-hover:text-sky-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                 <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest">Live Activity Log</h4>
                    <RefreshCw size={16} className="text-slate-300 animate-spin-slow cursor-pointer hover:text-slate-500 transition-colors"/>
                 </div>
                 <div className="divide-y divide-slate-100">
                   {orders.slice(-6).reverse().map(o => (
                     <div key={o.id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 text-slate-900 flex items-center justify-center rounded-md text-xs font-black border border-slate-200">#{o.id.slice(-3)}</div>
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-base">{o.customerName}</span>
                              <span className="text-xs font-medium text-slate-400 mt-0.5">{new Date(o.date).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-10">
                           <span className="font-bold text-slate-900 text-lg">₹{o.total.toLocaleString()}</span>
                           <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                             o.status === 'delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                           }`}>{o.status}</span>
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
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Product Name</th>
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Stock</th>
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Price</th>
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 group transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm leading-tight">{p.name}</span>
                          <span className="text-xs font-medium text-slate-400 italic mt-1">{p.scientificName || 'Unlabeled Specimen'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-slate-500 font-bold text-xs bg-slate-100 px-3 py-1 rounded-md border border-slate-200">{p.category}</span>
                      </td>
                      <td className="px-8 py-5 font-bold text-sm text-slate-700">{p.stock}</td>
                      <td className="px-8 py-5 font-bold text-sm text-slate-900">₹{p.price}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-all">
                          <button onClick={() => { setEditingProduct(p); setProductForm({...p, variations: p.variations || []} as any); setIsProductModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"><Edit2 size={20} /></button>
                          <button onClick={() => { if(confirm('Permanently delete this item?')) setProducts(products.filter(i=>i.id!==p.id)) }} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={20} /></button>
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
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Order ID</th>
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Customer Name</th>
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Total Amount</th>
                    <th className="px-8 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice().reverse().map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-bold text-sky-600 text-sm">#{o.id}</td>
                      <td className="px-8 py-5 font-bold text-slate-900 text-sm">{o.customerName}</td>
                      <td className="px-8 py-5 font-bold text-slate-900 text-sm">₹{o.total.toLocaleString()}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => navigate(`/invoice/${o.id}`, { state: { orderData: o } })} className="p-3 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-900 hover:text-white transition-all"><FileText size={20}/></button>
                          <button onClick={() => { if(confirm('Remove this order record?')) setOrders(orders.filter(ord=>ord.id!==o.id)) }} className="p-3 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={20}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Invoices' && (
            <div className="max-w-4xl space-y-8 mx-auto">
               <form onSubmit={generateManualInvoice} className="space-y-8">
                <div className="bg-white border border-slate-200 p-10 rounded-md shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                    <UserCheck size={24} className="text-sky-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Customer Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                        <input required placeholder="First Name" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 font-bold rounded-md outline-none focus:border-slate-900 transition-all text-sm" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                        <input required placeholder="Last Name" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 font-bold rounded-md outline-none focus:border-slate-900 transition-all text-sm" value={invoiceForm.lastName} onChange={e => setInvoiceForm({...invoiceForm, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                       <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-4 rounded-md focus-within:border-slate-900 transition-all">
                          <Phone size={18} className="text-slate-300"/>
                          <input required type="tel" className="w-full bg-transparent font-bold outline-none text-sm" placeholder="Phone Number" value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-10 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList size={24} className="text-sky-600" />
                      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Order Items</h3>
                    </div>
                    <button type="button" onClick={() => setInvoiceForm({...invoiceForm, items: [...invoiceForm.items, { id: 'manual-' + Date.now(), name: '', quantity: 1, price: 0, weight: 0 }]})} className="px-6 py-2 border border-sky-100 text-sky-600 bg-sky-50/50 font-bold uppercase text-[10px] tracking-wider rounded-md hover:bg-sky-100 transition-all shadow-sm">+ Add Row</button>
                  </div>
                  <div className="space-y-4">
                    {invoiceForm.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-5 items-center bg-slate-50 p-4 rounded-md border border-slate-100 group">
                        <div className="col-span-6 md:col-span-5">
                          <input required placeholder="Item Description" className="w-full bg-white px-4 py-3 border border-slate-200 font-bold rounded-md outline-none focus:border-slate-900 transition-all text-sm" value={item.name} onChange={e => { const updated = invoiceForm.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i); setInvoiceForm({...invoiceForm, items: updated}); }} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <input required type="number" placeholder="Qty" className="w-full bg-white px-2 py-3 border border-slate-200 font-bold rounded-md text-center text-sm" value={item.quantity} onChange={e => { const updated = invoiceForm.items.map(i => i.id === item.id ? { ...i, quantity: parseInt(e.target.value)||1 } : i); setInvoiceForm({...invoiceForm, items: updated}); }} />
                        </div>
                        <div className="col-span-2 md:col-span-2">
                          <input required type="number" placeholder="Price" className="w-full bg-white px-3 py-3 border border-slate-200 font-bold rounded-md text-center text-sm" value={item.price} onChange={e => { const updated = invoiceForm.items.map(i => i.id === item.id ? { ...i, price: parseInt(e.target.value)||0 } : i); setInvoiceForm({...invoiceForm, items: updated}); }} />
                        </div>
                        <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                          <button type="button" onClick={() => { if(invoiceForm.items.length > 1) setInvoiceForm({...invoiceForm, items: invoiceForm.items.filter(i=>i.id!==item.id)}) }} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="w-full mt-12 py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-md hover:bg-sky-600 transition-all flex items-center justify-center gap-3 shadow-xl text-sm">
                     <Printer size={20} />
                     Generate and Print Invoice
                  </button>
                </div>
               </form>
            </div>
          )}
        </div>
      </main>

      {/* Product Management Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-10 relative rounded-lg animate-fade-in shadow-2xl border border-slate-200">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={28} /></button>
            
            <div className="mb-10 flex items-center gap-4">
               <div className="p-3 bg-sky-50 rounded-lg"><Layers size={28} className="text-sky-600" /></div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {editingProduct ? 'Edit Specimen' : 'Add New Specimen'}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global Inventory Registry</p>
               </div>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name *</label>
                      <input required placeholder="e.g., Premium Halfmoon Betta" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 font-bold rounded-md outline-none focus:border-slate-900 transition-all text-sm" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Scientific Name</label>
                      <input placeholder="e.g., Betta splendens" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 font-bold rounded-md outline-none focus:border-slate-900 transition-all italic text-sm" value={productForm.scientificName} onChange={e => setProductForm({...productForm, scientificName: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                         <select className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-md text-xs" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Stock Count *</label>
                         <input type="number" required className="w-full bg-slate-50 border border-slate-200 px-5 py-4 font-bold rounded-md text-sm" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)||0})} />
                      </div>
                   </div>
                </div>

                <div className="space-y-5">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Price (₹) *</label>
                      <input type="number" required className="w-full bg-white border border-sky-100 px-5 py-4 font-black text-sky-600 rounded-md outline-none text-base" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)||0})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Weight per Unit (kg) *</label>
                      <input type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-200 px-5 py-4 font-bold rounded-md text-sm" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: parseFloat(e.target.value)||0})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Product Image</label>
                      <div className="flex gap-4">
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-grow py-4 px-5 bg-slate-900 text-white font-bold rounded-md hover:bg-sky-600 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                            <ImageIcon size={18}/>
                            {productForm.image ? 'Change Photo' : 'Upload Photo'}
                         </button>
                         {productForm.image && (
                           <div className="w-16 h-16 bg-slate-50 rounded-md border border-slate-200 overflow-hidden shrink-0 shadow-sm"><img src={productForm.image} className="w-full h-full object-cover" /></div>
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

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full py-5 bg-sky-600 text-white font-black uppercase tracking-[0.2em] rounded-md hover:bg-sky-700 transition-all shadow-2xl active:scale-[0.98] text-sm mt-4 disabled:opacity-50"
              >
                {isSaving ? 'Synchronizing Cloud...' : editingProduct ? 'Save and Sync Changes' : 'Confirm and Publish Globally'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
