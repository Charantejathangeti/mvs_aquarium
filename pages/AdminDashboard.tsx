
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Trash2, Edit, Search, LogOut, 
  X, PlusCircle, Image as ImageIcon, Save, CheckCircle2, 
  Camera, Edit2Icon, TrashIcon, DollarSign, PackageCheck, 
  Truck, Box, Plus, Send, Download, ShoppingBag, User, MapPin,
  FileText
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES, WHATSAPP_NUMBER } from '../constants';
import { Product, Order, CartItem } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoice'>('Dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Product Management State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', category: CATEGORIES[0], price: 0, weight: 0, image: '', description: '', stock: 0
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

  useEffect(() => {
    if (sessionStorage.getItem('mvs_aqua_admin') !== '1') {
      navigate('/admin-login');
      return;
    }
    const savedProducts = JSON.parse(localStorage.getItem('mvs_aqua_products') || JSON.stringify(MOCK_PRODUCTS));
    setProducts(savedProducts);
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

  // Product Actions
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p);
      setProducts(updated);
      localStorage.setItem('mvs_aqua_products', JSON.stringify(updated));
    } else {
      const newProduct: Product = { ...productForm, id: 'P' + Date.now() };
      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem('mvs_aqua_products', JSON.stringify(updated));
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
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar - Tight & Black */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col p-4 sticky top-0 h-screen shrink-0">
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

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
             <h2 className="text-sm font-black uppercase tracking-widest text-black">{activeTab} Interface</h2>
             {activeTab === 'Products' && (
                <button 
                  onClick={() => { 
                    setEditingProduct(null); 
                    setProductForm({name:'', category:CATEGORIES[0], price:0, weight:0, image:'', description:'', stock:0}); 
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
                  <div key={idx} className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <h3 className={`text-xl font-black ${s.color}`}>{s.val}</h3>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Products' && (
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
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
                          <button onClick={() => { setEditingProduct(p); setProductForm({...p}); setIsProductModalOpen(true); }} className="p-1 text-slate-400 hover:text-sky-600 mr-2"><Edit2Icon size={12} /></button>
                          <button onClick={() => { if(confirm('Purge Species Record?')) setProducts(products.filter(item=>item.id!==p.id)) }} className="p-1 text-slate-400 hover:text-red-600"><TrashIcon size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Orders' && (
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
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
                  {/* Billing Details Section */}
                  <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                       <User size={14} className="text-sky-600" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Billing Identity & Logistics</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">First Name *</label>
                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Last Name *</label>
                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.lastName} onChange={e => setInvoiceForm({...invoiceForm, lastName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">WhatsApp / Phone *</label>
                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" placeholder="+91..." value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" type="email" value={invoiceForm.email} onChange={e => setInvoiceForm({...invoiceForm, email: e.target.value})} />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Full Delivery Address *</label>
                        <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.address} onChange={e => setInvoiceForm({...invoiceForm, address: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-3 md:col-span-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">City *</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.city} onChange={e => setInvoiceForm({...invoiceForm, city: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">State *</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.state} onChange={e => setInvoiceForm({...invoiceForm, state: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">PIN *</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-1.5 text-[10px] font-bold outline-none focus:border-black" value={invoiceForm.pinCode} onChange={e => setInvoiceForm({...invoiceForm, pinCode: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
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
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                           <div className="col-span-4 space-y-1">
                              {index === 0 && <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Species Name</label>}
                              <input required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" value={item.name} onChange={e => updateInvoiceItem(item.id, 'name', e.target.value)} />
                           </div>
                           <div className="col-span-2 space-y-1">
                              {index === 0 && <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Qty</label>}
                              <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" value={item.quantity} onChange={e => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value)||0)} />
                           </div>
                           <div className="col-span-2 space-y-1">
                              {index === 0 && <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Price (₹)</label>}
                              <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" value={item.price} onChange={e => updateInvoiceItem(item.id, 'price', parseInt(e.target.value)||0)} />
                           </div>
                           <div className="col-span-2 space-y-1">
                              {index === 0 && <label className="text-[7px] font-black uppercase tracking-widest text-slate-400">Mass (kg)</label>}
                              <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-[10px] font-bold outline-none" value={item.weight} onChange={e => updateInvoiceItem(item.id, 'weight', parseFloat(e.target.value)||0)} />
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
                         <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-[10px] font-black" value={invoiceForm.shippingCharge} onChange={e => setInvoiceForm({...invoiceForm, shippingCharge: parseInt(e.target.value)||0})} />
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

      {/* Product Modal - Rectangular & Dense */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 animate-fade-in backdrop-blur-sm">
           <div className="bg-white border border-slate-200 rounded-sm w-full max-w-lg shadow-2xl p-8 relative">
              <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black transition-colors"><X size={18} /></button>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-slate-100 pb-3">Livestock Registry Profile</h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
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
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Price (₹) *</label>
                      <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)||0})} />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Current Stock *</label>
                      <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)||0})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Net Mass (kg) *</label>
                      <input type="number" step="0.1" required className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: parseFloat(e.target.value)||0})} />
                   </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Biological Description</label>
                    <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2 text-[10px] font-bold outline-none resize-none" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Detailed traits..." />
                 </div>

                 <div className="flex items-center gap-4 py-4 border-t border-slate-100">
                   <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-sm overflow-hidden shrink-0">
                      {productForm.image ? <img src={productForm.image} className="w-full h-full object-cover" /> : <Camera size={14} className="m-auto mt-4 text-slate-300" />}
                   </div>
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black uppercase tracking-widest text-sky-600 hover:text-black transition-colors underline underline-offset-4">Reference Image</button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                 </div>
                 <button type="submit" className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm shadow-xl hover:bg-slate-800 transition-all">
                   {editingProduct ? 'Commit Changes' : 'Register Entry'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
