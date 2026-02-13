
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trash2, 
  Edit, 
  Search, 
  TrendingUp, 
  LogOut,
  ShoppingCart,
  FileText,
  X,
  PlusCircle,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Download,
  CreditCard,
  Activity,
  ChevronDown,
  Layers,
  Box,
  Truck,
  Plus
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { Product, Order } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'invoice'>('overview');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Forms / Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    category: CATEGORIES[0],
    price: 0,
    weight: 0.1,
    image: '',
    description: '',
    stock: 0
  });

  // Invoice Generator State
  const [invoiceForm, setInvoiceForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    shipping: 80,
    items: [{ name: '', quantity: 1, price: 0 }]
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

  const saveProductsToStorage = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('mvs_aqua_products', JSON.stringify(newProducts));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mvs_aqua_admin');
    navigate('/admin-login');
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsOtherCategory(false);
    setCustomCategory('');
    setProductForm({ name: '', category: CATEGORIES[0], price: 0, weight: 0.1, image: '', description: '', stock: 10 });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const isCustom = !CATEGORIES.includes(product.category);
    setIsOtherCategory(isCustom);
    setCustomCategory(isCustom ? product.category : '');
    setProductForm({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isOtherCategory ? customCategory : productForm.category;
    
    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm, category: finalCategory } : p);
      saveProductsToStorage(updated);
    } else {
      const newProduct: Product = { ...productForm, category: finalCategory, id: 'P' + Date.now() };
      saveProductsToStorage([...products, newProduct]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      saveProductsToStorage(updated);
    }
  };

  const handleGenerateInvoice = () => {
    if (!invoiceForm.firstName || !invoiceForm.phone) return alert('Name and Phone are required');
    
    const orderId = 'MVS' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = invoiceForm.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    
    const newOrder: Order = {
      id: orderId,
      firstName: invoiceForm.firstName,
      lastName: invoiceForm.lastName,
      customerName: `${invoiceForm.firstName} ${invoiceForm.lastName}`,
      phone: invoiceForm.phone,
      address: invoiceForm.address,
      city: invoiceForm.city,
      email: '',
      country: 'India',
      pinCode: '',
      state: '',
      items: invoiceForm.items.map((i, idx) => ({ 
        ...MOCK_PRODUCTS[0], 
        id: `man-${idx}`, 
        name: i.name, 
        price: i.price, 
        quantity: i.quantity,
        weight: 0.5,
        description: 'Manual Entry',
        category: 'Manual',
        stock: 99,
        image: 'https://via.placeholder.com/150'
      })),
      subtotal,
      shippingCharge: invoiceForm.shipping,
      total: subtotal + invoiceForm.shipping,
      weight: invoiceForm.items.length * 0.5,
      date: new Date().toISOString(),
      status: 'pending'
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('mvs_aqua_orders', JSON.stringify(updatedOrders));
    window.open(`/#/invoice/${orderId}`, '_blank');
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-slate-950/80 ${colorClass}`}><Icon size={24} /></div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-1">Telemetry Data</div>
      </div>
      <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{value}</h3>
      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-300 font-sans relative overflow-hidden">
      {/* Admin OS Background Animations */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-scan" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px] animate-drift" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-drift" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-slate-900 bg-slate-900/80 backdrop-blur-3xl hidden lg:flex flex-col p-8 sticky top-0 h-screen z-20">
        <div className="flex items-center space-x-4 mb-16 px-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-cyan-500/20 text-xl">M</div>
          <div>
            <span className="text-2xl font-black text-white tracking-tighter block leading-none">MVS AQUA</span>
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mt-1">Admin Console 3.0</span>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Control Center' },
            { id: 'orders', icon: ShoppingCart, label: 'Order Ledger' },
            { id: 'invoice', icon: CreditCard, label: 'Billing Desk' },
            { id: 'products', icon: Layers, label: 'Product Catalog' },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.25rem] transition-all font-black text-[11px] uppercase tracking-widest group border ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                  : 'hover:bg-white/5 text-slate-500 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-4">
                <tab.icon size={18} className={activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-800 mt-8">
          <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-5 rounded-2xl text-slate-500 hover:text-red-400 font-black text-[11px] uppercase tracking-widest transition-all bg-slate-950 hover:bg-red-500/5">
            <LogOut size={18} /><span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 lg:p-14 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-14 flex justify-between items-end">
             <div className="animate-fade-in-up">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                   <span className="text-cyan-500">{activeTab}</span> 
                   <span className="text-slate-800">/</span>
                   Module
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-3">
                   <Activity size={14} className="text-cyan-500 animate-pulse" />
                   Authenticated Logistics Interface
                </p>
             </div>
             {activeTab === 'products' && (
                <button onClick={handleAddProduct} className="px-10 py-5 bg-cyan-500 text-slate-950 font-black rounded-2xl shadow-2xl shadow-cyan-500/20 flex items-center space-x-3 hover:bg-cyan-400 transition-all transform hover:-translate-y-1 active:scale-95">
                    <Plus size={22} />
                    <span className="text-xs uppercase tracking-widest">Add New Species</span>
                </button>
             )}
          </header>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                <StatCard title="Inventory Depth" value={products.length} icon={Box} colorClass="text-cyan-400" />
                <StatCard title="Active Shipments" value={orders.length} icon={Truck} colorClass="text-indigo-400" />
                <StatCard title="Revenue Ledger" value={`₹${orders.reduce((a,b)=>a+b.total,0).toLocaleString()}`} icon={TrendingUp} colorClass="text-emerald-400" />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase">Order History</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Registry of all transactions</p>
                    </div>
                    <button onClick={() => exportToCSV(orders, 'orders_ledger')} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-all px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <Download size={16} />
                      <span>Data Export</span>
                    </button>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950/80 border-b border-slate-800">
                        <tr>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Flow Identifier</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Consignee Detail</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Valuation</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {orders.length === 0 ? (
                          <tr><td colSpan={5} className="p-40 text-center text-slate-700 font-black uppercase text-[12px] tracking-widest">No active logs in registry</td></tr>
                        ) : (
                          orders.map(order => (
                            <tr key={order.id} className="hover:bg-cyan-500/5 transition-colors group">
                              <td className="px-10 py-10">
                                <div className="font-black text-cyan-500 text-xl tracking-tighter">#{order.id}</div>
                                <div className="text-[10px] text-slate-500 font-black uppercase mt-2">{new Date(order.date).toLocaleDateString()}</div>
                              </td>
                              <td className="px-10 py-10">
                                <div className="text-white font-black text-base">{order.customerName}</div>
                                <div className="text-[11px] text-slate-500 font-bold mt-1 tracking-wider">{order.phone}</div>
                              </td>
                              <td className="px-10 py-10 font-black text-white text-xl">₹{order.total.toLocaleString()}</td>
                              <td className="px-10 py-10">
                                <span className={`inline-block px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                  order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-10 py-10 text-right">
                                <div className="flex justify-end space-x-3">
                                  <button onClick={() => navigate(`/invoice/${order.id}`, { state: { orderData: order } })} className="p-4 bg-slate-950 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5 rounded-xl transition-all border border-slate-800"><FileText size={20} /></button>
                                  <button onClick={() => { if(confirm('Delete Record?')) setOrders(orders.filter(o => o.id !== order.id)) }} className="p-4 bg-slate-950 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all border border-slate-800"><Trash2 size={20} /></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoice' && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 lg:p-16 max-w-5xl shadow-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Billing Desk</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Manual Receipt Generation Terminal</p>
                  </div>
                  <button 
                    onClick={() => setInvoiceForm({ firstName: '', lastName: '', phone: '', address: '', city: '', shipping: 80, items: [{ name: '', quantity: 1, price: 0 }] })} 
                    className="px-8 py-4 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-red-400 transition-all tracking-widest"
                  >
                    Reset Interface
                  </button>
                </div>
                
                <div className="bg-slate-950/80 p-12 rounded-[2.5rem] border border-slate-800 mb-12 shadow-inner">
                  <h3 className="text-[11px] font-black uppercase text-cyan-500 tracking-[0.3em] mb-10 flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-cyan-500 rounded-full" />
                    Consignee Identification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Customer Profile Name</label>
                      <input 
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 text-white font-bold transition-all placeholder:text-slate-800 text-lg" 
                        placeholder="Enter Full Name..." 
                        value={invoiceForm.firstName} 
                        onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Contact Link (Phone)</label>
                      <input 
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 text-white font-bold transition-all placeholder:text-slate-800 text-lg" 
                        placeholder="+91..." 
                        value={invoiceForm.phone} 
                        onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Final Destination Address</label>
                      <textarea 
                        rows={2}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 text-white font-bold transition-all placeholder:text-slate-800 resize-none text-lg" 
                        placeholder="Street, City, State, ZIP..." 
                        value={invoiceForm.address} 
                        onChange={e => setInvoiceForm({...invoiceForm, address: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-12 rounded-[2.5rem] border border-slate-800 mb-14 shadow-inner">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[11px] font-black uppercase text-cyan-500 tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-4 bg-cyan-500 rounded-full" />
                        Species Registry
                    </h3>
                    <button 
                      onClick={() => setInvoiceForm({...invoiceForm, items: [...invoiceForm.items, { name: '', quantity: 1, price: 0 }]})} 
                      className="bg-cyan-500 text-slate-950 px-8 py-4.5 rounded-2xl flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-95"
                    >
                        <PlusCircle size={20} />
                        <span>Append Species</span>
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {invoiceForm.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-6 items-end bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] transition-all hover:border-slate-600 group">
                        <div className="w-full md:flex-grow space-y-4">
                          <label className="text-[9px] font-black text-slate-600 uppercase ml-1 tracking-widest">Nomenclature / Specimen</label>
                          <input className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-5 text-base font-bold text-white outline-none focus:border-cyan-500 placeholder:text-slate-800" placeholder="e.g. Royal Blue Betta" value={item.name} onChange={e => {
                            const newItems = [...invoiceForm.items];
                            newItems[idx].name = e.target.value;
                            setInvoiceForm({...invoiceForm, items: newItems});
                          }} />
                        </div>
                        <div className="w-full md:w-32 space-y-4">
                          <label className="text-[9px] font-black text-slate-600 uppercase ml-1 tracking-widest">Qty</label>
                          <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-5 text-base font-bold text-white outline-none focus:border-cyan-500" value={item.quantity} onChange={e => {
                            const newItems = [...invoiceForm.items];
                            newItems[idx].quantity = parseInt(e.target.value) || 0;
                            setInvoiceForm({...invoiceForm, items: newItems});
                          }} />
                        </div>
                        <div className="w-full md:w-40 space-y-4">
                          <label className="text-[9px] font-black text-slate-600 uppercase ml-1 tracking-widest">Rate (₹)</label>
                          <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-5 text-base font-bold text-white outline-none focus:border-cyan-500" value={item.price} onChange={e => {
                            const newItems = [...invoiceForm.items];
                            newItems[idx].price = parseInt(e.target.value) || 0;
                            setInvoiceForm({...invoiceForm, items: newItems});
                          }} />
                        </div>
                        <button 
                          onClick={() => setInvoiceForm({...invoiceForm, items: invoiceForm.items.filter((_, i) => i !== idx)})} 
                          className="p-5 text-slate-600 hover:text-red-500 transition-all bg-slate-950 rounded-xl hover:bg-red-500/10 border border-slate-800"
                        >
                          <X size={22} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-800 gap-12">
                  <div className="flex flex-wrap items-center gap-16">
                      <div className="flex flex-col">
                        <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Species Subtotal</span>
                        <span className="text-5xl font-black text-white tracking-tighter">₹{invoiceForm.items.reduce((a, i) => a + (i.price * i.quantity), 0).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col border-l border-slate-800 pl-16">
                        <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3 ml-1">Logistics Overhead</span>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-500 font-black text-3xl">₹</span>
                            <input type="number" className="w-28 bg-transparent border-b-4 border-slate-800 font-black text-3xl text-white outline-none focus:border-cyan-500 transition-colors py-1" value={invoiceForm.shipping} onChange={e => setInvoiceForm({...invoiceForm, shipping: parseInt(e.target.value) || 0})} />
                        </div>
                      </div>
                  </div>
                  <button onClick={handleGenerateInvoice} className="w-full md:w-auto px-16 py-7 bg-cyan-500 text-slate-950 font-black rounded-3xl shadow-2xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center justify-center space-x-4 group active:scale-[0.98]">
                      <Save size={28} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm uppercase tracking-[0.2em]">Authorize Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
                  <div className="relative w-full max-w-xl">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                      <input className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-16 pr-8 py-5 text-base font-bold text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-800 shadow-inner" placeholder="Scan or filter catalog..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-5">
                      <button onClick={() => exportToCSV(products, 'inventory_export')} className="p-5 bg-slate-950/80 text-slate-500 hover:text-white rounded-2xl transition-all border border-slate-800">
                        <Download size={22} />
                      </button>
                  </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950/80 border-b border-slate-800">
                        <tr>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Species Profile</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Classification</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Price (₹)</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Stock</th>
                          <th className="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                          <tr key={p.id} className="hover:bg-cyan-500/5 transition-colors group">
                            <td className="px-10 py-8">
                              <div className="flex items-center space-x-8">
                                  <div className="w-20 h-20 rounded-[1.5rem] bg-slate-950 border border-slate-800 overflow-hidden shrink-0 shadow-inner">
                                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                  </div>
                                  <span className="font-black text-white text-xl tracking-tight">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-10 py-8 uppercase font-black text-[10px] text-slate-500 tracking-[0.2em]">{p.category}</td>
                            <td className="px-10 py-8 font-black text-white text-xl">₹{p.price.toLocaleString()}</td>
                            <td className="px-10 py-8 font-black text-cyan-400 uppercase text-[10px] tracking-widest">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-500 mr-3 shadow-[0_0_10px_#22d3ee]" />
                              {p.stock} Units
                            </td>
                            <td className="px-10 py-8 text-right">
                              <div className="flex justify-end space-x-3">
                                <button onClick={() => handleEditProduct(p)} className="p-4 bg-slate-950 text-slate-500 hover:text-cyan-400 border border-slate-800 rounded-xl transition-all"><Edit size={20} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-4 bg-slate-950 text-slate-500 hover:text-red-400 border border-slate-800 rounded-xl transition-all"><Trash2 size={20} /></button>
                              </div>
                            </td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Product Management Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-fade-in">
           <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] w-full max-w-3xl shadow-2xl p-12 lg:p-16 relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setIsProductModalOpen(false)} className="absolute top-12 right-12 text-slate-600 hover:text-white transition-all p-4 bg-slate-950 rounded-2xl border border-slate-800">
                 <X size={28} />
              </button>
              
              <div className="mb-14">
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase flex items-center gap-5">
                  <div className="w-14 h-14 bg-cyan-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/20">
                    {editingProduct ? <Edit size={28} /> : <Plus size={28} />}
                  </div>
                  {editingProduct ? 'Update Registry' : 'Add New Species'}
                </h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] ml-20">System Catalog Protocol x9</p>
              </div>
              
              <form onSubmit={handleSaveProduct} className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Species Name</label>
                       <input required placeholder="e.g. Galaxy Koi Betta" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 font-bold text-white transition-all text-lg placeholder:text-slate-800 shadow-inner" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Species Classification</label>
                       <div className="relative group">
                          <select 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 font-bold text-white transition-all appearance-none cursor-pointer text-lg shadow-inner" 
                            value={isOtherCategory ? 'Other' : productForm.category} 
                            onChange={e => {
                               if (e.target.value === 'Other') {
                                 setIsOtherCategory(true);
                               } else {
                                 setIsOtherCategory(false);
                                 setProductForm({...productForm, category: e.target.value});
                               }
                            }}
                          >
                             {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                             <option value="Other">Add New Category Manually...</option>
                          </select>
                          <ChevronDown size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                       </div>
                    </div>

                    {isOtherCategory && (
                      <div className="md:col-span-2 space-y-4 animate-fade-in-up">
                        <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1">New Manual Classification</label>
                        <input required placeholder="Define new category name..." className="w-full bg-slate-950 border-2 border-cyan-500/30 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500 font-bold text-white transition-all text-lg placeholder:text-slate-800 shadow-[0_0_20px_rgba(34,211,238,0.1)]" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
                      </div>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Unit Valuation (₹)</label>
                       <input type="number" required className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 font-bold text-white transition-all text-lg shadow-inner" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logistics Weight (kg)</label>
                       <input type="number" step="0.1" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 font-bold text-white transition-all text-lg shadow-inner" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registry Stock</label>
                       <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 font-bold text-white transition-all text-lg shadow-inner" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Digital Asset Reference (URL)</label>
                    <div className="flex gap-8 items-center">
                       <div className="w-24 h-24 rounded-[2rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-800 shrink-0 shadow-inner overflow-hidden">
                          {productForm.image ? <img src={productForm.image} className="w-full h-full object-cover" /> : <ImageIcon size={32} />}
                       </div>
                       <input className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500/50 font-bold text-white transition-all text-lg placeholder:text-slate-800 shadow-inner" placeholder="https://..." value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                    </div>
                 </div>

                 <button type="submit" className="w-full py-8 bg-cyan-500 text-slate-950 font-black rounded-[2.5rem] shadow-2xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center justify-center space-x-5 text-sm uppercase tracking-[0.3em] group active:scale-[0.97] mt-6">
                    <CheckCircle2 size={30} className="group-hover:scale-110 transition-transform" />
                    <span>Authorize Species Entry</span>
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
