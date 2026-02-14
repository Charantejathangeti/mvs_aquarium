
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Trash2, Edit, Search, LogOut, 
  X, PlusCircle, Image as ImageIcon, Save, CheckCircle2, 
  Camera, Edit2Icon, TrashIcon, DollarSign, PackageCheck, 
  Truck, Box, Plus, Send, Download, ShoppingBag, User, MapPin,
  FileText, ListPlus, Settings2, Fish, Database, Copy, Terminal, Cloud, AlertCircle
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
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoice' | 'System'>('Dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  // Product Management
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string; category: string; price: number; weight: number; 
    image: string; description: string; stock: number; variations: Variation[];
  }>({
    name: '', category: CATEGORIES[0], price: 0, weight: 0, image: '', description: '', stock: 0, variations: []
  });

  // Invoice State
  const [invoiceForm, setInvoiceForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: '', city: '', state: 'Andhra Pradesh', pinCode: '',
    shippingCharge: 0,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProductForm(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // Invoice Logic
  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { id: 'manual-' + Date.now(), name: '', quantity: 1, price: 0, weight: 0 }]
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
      setInvoiceForm(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === rowId ? {
          ...item, name: '', price: 0, weight: 0, quantity: 1
        } : item)
      }));
      return;
    }
    const found = products.find(p => p.id === productId);
    if (found) {
      setInvoiceForm(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === rowId ? {
          ...item, name: found.name, price: found.price, weight: found.weight, quantity: 1
        } : item)
      }));
    }
  };

  const generateManualInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = 'MVS' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = invoiceForm.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const total = subtotal + Number(invoiceForm.shippingCharge);

    const newOrder: Order = {
      id: orderId,
      firstName: invoiceForm.firstName,
      lastName: invoiceForm.lastName,
      customerName: `${invoiceForm.firstName} ${invoiceForm.lastName}`,
      email: invoiceForm.email, phone: invoiceForm.phone, address: invoiceForm.address,
      city: invoiceForm.city, state: invoiceForm.state, pinCode: invoiceForm.pinCode,
      country: 'India', items: invoiceForm.items as any, subtotal, 
      shippingCharge: Number(invoiceForm.shippingCharge), total,
      weight: invoiceForm.items.reduce((acc, i) => acc + (i.weight * i.quantity), 0),
      date: new Date().toISOString(), status: 'pending'
    };

    const existing = JSON.parse(localStorage.getItem('mvs_aqua_orders') || '[]');
    existing.push(newOrder);
    localStorage.setItem('mvs_aqua_orders', JSON.stringify(existing));
    setOrders(existing);
    setActiveTab('Orders');
  };

  return (
    <div className="relative min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col p-4 h-screen sticky top-0 shrink-0 shadow-sm z-30">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-7 h-7 bg-black text-white font-bold flex items-center justify-center rounded-sm text-[10px]">M</div>
          <span className="text-[11px] font-black uppercase tracking-widest">Operator Console</span>
        </div>
        <nav className="flex-grow space-y-1">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Products', icon: Box },
            { id: 'Orders', icon: PackageCheck },
            { id: 'Invoice', icon: FileText },
            { id: 'System', icon: Database }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center space-x-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all ${
                activeTab === tab.id ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}>
              <tab.icon size={14} />
              <span>{tab.id}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-auto flex items-center space-x-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600">
          <LogOut size={14} /><span>Exit Session</span>
        </button>
      </aside>

      <main className="flex-grow p-8 max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-black uppercase tracking-[0.2em]">{activeTab}</h2>
             {localStorage.getItem('mvs_aqua_products') && (
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-sm">
                  <AlertCircle size={10} className="text-amber-600" />
                  <span className="text-[7px] font-black text-amber-600 uppercase tracking-widest">Session Modified - Sync Required</span>
               </div>
             )}
          </div>
          {activeTab === 'Products' && (
            <button onClick={() => { setEditingProduct(null); setProductForm({name:'', category:CATEGORIES[0], price:0, weight:0, image:'', description:'', stock:0, variations: []}); setIsProductModalOpen(true); }}
              className="px-5 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-800 flex items-center gap-2">
              <Plus size={14} /> Add New Species
            </button>
          )}
        </header>

        <div className="animate-fade-in">
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Count</p>
                <h3 className="text-2xl font-black">{stats.totalStock} Units</h3>
              </div>
              <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Queue</p>
                <h3 className="text-2xl font-black text-sky-600">{stats.activeOrders} Orders</h3>
              </div>
              <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <h3 className="text-2xl font-black">₹{stats.revenue.toLocaleString()}</h3>
              </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Species Name</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Class</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Price</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold">{p.name}</td>
                      <td className="px-6 py-4 uppercase text-slate-400 tracking-tighter">{p.category}</td>
                      <td className="px-6 py-4 font-black">₹{p.price}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => { setEditingProduct(p); setProductForm({...p, variations: p.variations || []}); setIsProductModalOpen(true); }} className="p-1 text-slate-400 hover:text-sky-600 mr-3"><Edit2Icon size={14} /></button>
                        <button onClick={() => { if(confirm('Purge species?')) setProducts(products.filter(i=>i.id!==p.id)) }} className="p-1 text-slate-400 hover:text-red-600"><TrashIcon size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'System' && (
            <div className="max-w-4xl mx-auto">
               <div className="bg-slate-900 text-white p-10 rounded-sm shadow-2xl border border-white/5 relative overflow-hidden">
                  <Terminal size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <Terminal size={32} className="text-sky-400" />
                       <div>
                         <h3 className="text-lg font-black uppercase tracking-[0.3em]">Master Sync Protocol</h3>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Deploy local changes to the global web</p>
                       </div>
                    </div>
                    <div className="bg-black/50 border border-white/10 p-8 rounded-sm mb-10">
                       <p className="text-[11px] text-slate-300 leading-relaxed font-medium uppercase tracking-tight mb-8">
                         Livestock added on THIS computer is stored locally. To make them visible to <span className="text-white font-black underline decoration-sky-500 decoration-2">ALL VISITORS (NEW BROWSERS)</span>, you must update the source code manually:
                       </p>
                       <button onClick={() => {
                         const json = JSON.stringify(products, null, 2);
                         navigator.clipboard.writeText(json);
                         setCopyFeedback(true);
                         setTimeout(() => setCopyFeedback(false), 2000);
                       }} className={`w-full py-5 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm ${copyFeedback ? 'bg-emerald-600 text-white' : 'bg-sky-500 hover:bg-sky-400 text-black'}`}>
                         {copyFeedback ? <><CheckCircle2 size={18} /> Master Registry Copied</> : <><Copy size={18} /> Copy Master Registry Code</>}
                       </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Protocol Step 1</h4>
                          <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase">Open <code className="text-sky-400">constants.ts</code> in your code editor.</p>
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Protocol Step 2</h4>
                          <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase">Locate <code className="text-sky-400">MOCK_PRODUCTS</code> and paste the copied data inside the brackets.</p>
                       </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                       <button onClick={() => { if(confirm('Wipe session?')) { localStorage.removeItem('mvs_aqua_products'); window.location.reload(); } }} className="text-[8px] font-black uppercase tracking-widest text-slate-600 hover:text-red-500 transition-colors">Emergency: Wipe Local Session & Revert to Master</button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Invoice' && (
            <div className="max-w-4xl mx-auto">
              <form onSubmit={generateManualInvoice} className="space-y-6">
                <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Logistic Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="First Name *" required className="bg-slate-50 border border-slate-200 px-4 py-2.5 text-[10px] font-bold outline-none focus:border-black rounded-sm" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                    <input placeholder="Last Name *" required className="bg-slate-50 border border-slate-200 px-4 py-2.5 text-[10px] font-bold outline-none focus:border-black rounded-sm" value={invoiceForm.lastName} onChange={e => setInvoiceForm({...invoiceForm, lastName: e.target.value})} />
                    <input placeholder="WhatsApp Phone *" required className="bg-slate-50 border border-slate-200 px-4 py-2.5 text-[10px] font-bold outline-none focus:border-black rounded-sm" value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                    <input placeholder="Delivery Address *" required className="md:col-span-2 bg-slate-50 border border-slate-200 px-4 py-2.5 text-[10px] font-bold outline-none focus:border-black rounded-sm" value={invoiceForm.address} onChange={e => setInvoiceForm({...invoiceForm, address: e.target.value})} />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Itemized Payload</h3>
                    <button type="button" onClick={addInvoiceItem} className="text-[8px] font-black uppercase text-sky-600 hover:text-black flex items-center gap-1"><Plus size={12} /> Add Row</button>
                  </div>
                  <div className="space-y-4">
                    {invoiceForm.items.map(item => (
                      <div key={item.id} className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-sm border border-slate-100">
                        <div className="col-span-4 space-y-1">
                          <label className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Inventory</label>
                          <select className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold rounded-sm" onChange={e => autopopulateProduct(item.id, e.target.value)}>
                            <option value="">Other / Manual Entry...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>
                        <div className="col-span-3 space-y-1">
                          <label className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Item Identity</label>
                          <input required className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold rounded-sm" value={item.name} onChange={e => updateInvoiceItem(item.id, 'name', e.target.value)} />
                        </div>
                        <div className="col-span-1 space-y-1">
                          <label className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Qty</label>
                          <input type="number" className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold rounded-sm" value={item.quantity} onChange={e => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value)||1)} />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Price (₹)</label>
                          <input type="number" className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold rounded-sm" value={item.price} onChange={e => updateInvoiceItem(item.id, 'price', parseInt(e.target.value)||0)} />
                        </div>
                        <div className="col-span-2 flex justify-end pb-1">
                          <button type="button" onClick={() => { if(invoiceForm.items.length > 1) setInvoiceForm({...invoiceForm, items: invoiceForm.items.filter(i=>i.id!==item.id)}) }} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="px-12 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm shadow-xl hover:bg-slate-800">Generate & Save Consignment Receipt</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Orders' && (
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">ID</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Recipient</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">Total</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice().reverse().map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-black text-sky-600">#{o.id}</td>
                      <td className="px-6 py-4 font-bold uppercase">{o.customerName}</td>
                      <td className="px-6 py-4 font-black">₹{o.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => navigate(`/invoice/${o.id}`, { state: { orderData: o } })} className="p-1.5 bg-slate-100 hover:bg-black hover:text-white rounded-sm transition-all mr-2"><Download size={14} /></button>
                        <button onClick={() => { if(confirm('Purge order?')) setOrders(orders.filter(ord=>ord.id!==o.id)) }} className="p-1.5 text-slate-300 hover:text-red-500"><TrashIcon size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal - Product Registry */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-xl shadow-2xl p-10 relative my-10 rounded-sm">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black"><X size={20} /></button>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 border-b border-slate-100 pb-3">Livestock Registration</h2>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Common Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-[11px] font-bold text-black outline-none focus:border-black rounded-sm" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                      <select className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-[10px] font-bold rounded-sm" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price ₹</label>
                      <input type="number" required className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-[11px] font-bold rounded-sm" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)||0})} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bio-Description</label>
                      <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-[11px] font-bold h-[120px] resize-none outline-none focus:border-black rounded-sm" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                       {productForm.image ? <img src={productForm.image} className="w-full h-full object-cover" /> : <Camera size={24} className="text-slate-200" />}
                     </div>
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase text-sky-600 underline">Upload Image</button>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                   </div>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm transition-all hover:bg-slate-800 shadow-xl">
                {editingProduct ? 'Commit Changes' : 'Execute Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
