
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  ShoppingCart,
  FileText,
  X,
  PlusCircle,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Download,
  CreditCard,
  Layers,
  Activity
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
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Bettas',
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

  // CSV Export
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

  // CRUD
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Bettas', price: 0, weight: 0.1, image: '', description: '', stock: 10 });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p);
      saveProductsToStorage(updated);
    } else {
      const newProduct: Product = { ...productForm, id: 'P' + Date.now() };
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

  // Invoice
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
    <div className="bg-[#0b1220] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-sky-500/50 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-slate-900/50 ${colorClass}`}><Icon size={24} /></div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-1">Analytics Engine</div>
      </div>
      <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{value}</h3>
      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{title}</p>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-300 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-slate-900 bg-slate-950 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center space-x-3 mb-16 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#0ea5e9] flex items-center justify-center text-white font-black shadow-lg shadow-sky-500/20">M</div>
          <span className="text-2xl font-black text-white tracking-tighter">MVS <span className="text-[#0ea5e9]">Console</span></span>
        </div>

        <nav className="flex-grow space-y-3">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Control Center' },
            { id: 'orders', icon: ShoppingCart, label: 'Order Ledger' },
            { id: 'invoice', icon: CreditCard, label: 'Billing Desk' },
            { id: 'products', icon: Package, label: 'Inventory SKU' },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest group ${
                activeTab === tab.id 
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                  : 'hover:bg-slate-900 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-4">
                <tab.icon size={18} className={activeTab === tab.id ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'} />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && <div className="w-1 h-4 bg-sky-500 rounded-full shadow-[0_0_8px_#0ea5e9]" />}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-900 mt-8">
          <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-slate-500 hover:text-red-400 font-black text-[11px] uppercase tracking-widest transition-all">
            <LogOut size={18} /><span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 flex justify-between items-center">
             <div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                   <span className="text-sky-500">{activeTab}</span> 
                   <span className="text-slate-700">/</span>
                   System
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                   <Activity size={12} className="text-emerald-500" />
                   Premium Aquatic Logistics Monitoring
                </p>
             </div>
             <div className="hidden md:flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
                <div className="px-4 py-2 bg-[#020617] rounded-xl border border-slate-800 text-[9px] font-black uppercase tracking-widest">
                   Network: <span className="text-emerald-500">Secured</span>
                </div>
             </div>
          </header>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              <StatCard title="Total SKU Count" value={products.length} icon={Package} colorClass="text-sky-400" />
              <StatCard title="Active Fulfillments" value={orders.length} icon={ShoppingCart} colorClass="text-amber-400" />
              <StatCard title="Ledger Valuation" value={`₹${orders.reduce((a,b)=>a+b.total,0).toFixed(0)}`} icon={TrendingUp} colorClass="text-emerald-400" />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-fade-in space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">Order Ledger</h3>
                  <button onClick={() => exportToCSV(orders, 'orders_ledger')} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-all px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-sky-500/30">
                     <Download size={14} />
                     <span>Export CSV</span>
                  </button>
               </div>
               <div className="bg-[#0b1220] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                      <tr>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Flow ID</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Consignee</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valuation</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">State</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {orders.length === 0 ? (
                        <tr><td colSpan={5} className="p-32 text-center text-slate-700 font-black uppercase text-[11px] tracking-widest">No transaction logs detected</td></tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-900/30 transition-colors group">
                            <td className="px-8 py-8">
                               <div className="font-black text-sky-500 text-lg tracking-tight group-hover:scale-105 transition-transform origin-left">#{order.id}</div>
                               <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">{new Date(order.date).toLocaleDateString()}</div>
                            </td>
                            <td className="px-8 py-8">
                              <div className="text-white font-black text-sm">{order.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-bold mt-1">{order.phone}</div>
                            </td>
                            <td className="px-8 py-8 font-black text-white text-lg">₹{order.total.toFixed(0)}</td>
                            <td className="px-8 py-8">
                              <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-8 py-8 text-right">
                              <div className="flex justify-end space-x-3">
                                 <button onClick={() => navigate(`/invoice/${order.id}`, { state: { orderData: order } })} className="p-3 bg-slate-900 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-xl transition-all border border-slate-800"><FileText size={18} /></button>
                                 <button onClick={() => { if(confirm('Delete Record?')) setOrders(orders.filter(o => o.id !== order.id)) }} className="p-3 bg-slate-900 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-slate-800"><Trash2 size={18} /></button>
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
            <div className="bg-[#0b1220] border border-slate-800 rounded-[3rem] p-8 lg:p-12 animate-fade-in max-w-4xl shadow-2xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">Billing Module</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Manual Receipt Generation Terminal</p>
                </div>
                <button onClick={() => setInvoiceForm({ firstName: '', lastName: '', phone: '', address: '', city: '', shipping: 80, items: [{ name: '', quantity: 1, price: 0 }] })} className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-red-400 transition-all tracking-widest">Clear Terminal</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Consignee Identity</label>
                  <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-sky-500 text-white font-bold transition-all shadow-inner placeholder:text-slate-700" placeholder="e.g. Rahul Sharma" value={invoiceForm.firstName} onChange={e => setInvoiceForm({...invoiceForm, firstName: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Contact</label>
                  <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-sky-500 text-white font-bold transition-all shadow-inner placeholder:text-slate-700" placeholder="+91..." value={invoiceForm.phone} onChange={e => setInvoiceForm({...invoiceForm, phone: e.target.value})} />
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                   <h3 className="text-[11px] font-black uppercase text-white tracking-[0.2em]">Itemization</h3>
                   <button onClick={() => setInvoiceForm({...invoiceForm, items: [...invoiceForm.items, { name: '', quantity: 1, price: 0 }]})} className="bg-sky-500 text-slate-950 px-5 py-3 rounded-xl flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20">
                      <PlusCircle size={14} />
                      <span>Add Registry</span>
                   </button>
                </div>
                {invoiceForm.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50 group transition-all hover:border-sky-500/20">
                    <div className="w-full md:flex-grow space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Description</label>
                      <input className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-500 placeholder:text-slate-800" placeholder="Species / Product Name" value={item.name} onChange={e => {
                        const newItems = [...invoiceForm.items];
                        newItems[idx].name = e.target.value;
                        setInvoiceForm({...invoiceForm, items: newItems});
                      }} />
                    </div>
                    <div className="w-full md:w-24 space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Units</label>
                      <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-500" value={item.quantity} onChange={e => {
                        const newItems = [...invoiceForm.items];
                        newItems[idx].quantity = parseInt(e.target.value) || 0;
                        setInvoiceForm({...invoiceForm, items: newItems});
                      }} />
                    </div>
                    <div className="w-full md:w-32 space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Rate</label>
                      <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-500" value={item.price} onChange={e => {
                        const newItems = [...invoiceForm.items];
                        newItems[idx].price = parseInt(e.target.value) || 0;
                        setInvoiceForm({...invoiceForm, items: newItems});
                      }} />
                    </div>
                    <button onClick={() => setInvoiceForm({...invoiceForm, items: invoiceForm.items.filter((_, i) => i !== idx)})} className="p-3 text-slate-700 hover:text-red-500 transition-all"><X size={18} /></button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-800 gap-8">
                 <div className="flex items-center gap-12">
                    <div className="flex flex-col">
                       <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Subtotal</span>
                       <span className="text-3xl font-black text-white tracking-tighter">₹{invoiceForm.items.reduce((a, i) => a + (i.price * i.quantity), 0)}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-800 pl-8">
                       <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Logistic Rate</span>
                       <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-black text-xl">₹</span>
                          <input type="number" className="w-20 bg-transparent border-b border-slate-800 font-black text-xl text-white outline-none focus:border-sky-500 transition-colors" value={invoiceForm.shipping} onChange={e => setInvoiceForm({...invoiceForm, shipping: parseInt(e.target.value) || 0})} />
                       </div>
                    </div>
                 </div>
                 <button onClick={handleGenerateInvoice} className="w-full md:w-auto px-12 py-5 bg-sky-500 text-slate-950 font-black rounded-2xl shadow-2xl shadow-sky-500/10 hover:bg-sky-400 transition-all flex items-center justify-center space-x-3 group">
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs uppercase tracking-widest">Finalize Receipt</span>
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-fade-in space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#0b1220] p-6 rounded-[2.5rem] border border-slate-800 shadow-xl">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all" placeholder="Search SKU..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                 </div>
                 <div className="flex items-center gap-4">
                    <button onClick={() => exportToCSV(products, 'inventory_export')} className="p-4 bg-slate-950 text-slate-500 hover:text-white rounded-2xl transition-all border border-slate-800">
                       <Download size={20} />
                    </button>
                    <button onClick={handleAddProduct} className="px-8 py-4 bg-sky-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-sky-500/20 flex items-center space-x-3 hover:bg-sky-400 transition-all">
                        <Plus size={20} />
                        <span className="text-xs uppercase tracking-widest">Register SKU</span>
                    </button>
                 </div>
              </div>

              <div className="bg-[#0b1220] border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                      <tr>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Specimen</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Class</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rate</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Units</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                        <tr key={p.id} className="hover:bg-slate-900/30 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 shadow-inner">
                                   <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                </div>
                                <span className="font-black text-white text-lg tracking-tight">{p.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 uppercase font-black text-[10px] text-slate-500 tracking-widest">{p.category}</td>
                          <td className="px-8 py-6 font-black text-white text-lg">₹{p.price}</td>
                          <td className="px-8 py-6 font-black text-emerald-400 uppercase text-[10px] tracking-widest">
                             <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_#10b981]" />
                             {p.stock} Units
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end space-x-3">
                               <button onClick={() => handleEditProduct(p)} className="p-3 bg-slate-950 text-slate-500 hover:text-sky-400 border border-slate-800 rounded-xl transition-all"><Edit size={18} /></button>
                               <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-slate-950 text-slate-500 hover:text-red-400 border border-slate-800 rounded-xl transition-all"><Trash2 size={18} /></button>
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
      </main>

      {/* Product Management Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
           <div className="bg-[#0b1220] border border-slate-800 rounded-[3.5rem] w-full max-w-2xl shadow-2xl p-10 lg:p-14 relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setIsProductModalOpen(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-all p-2 bg-slate-950 rounded-full">
                 <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">{editingProduct ? 'Refine Registry' : 'New Species Entry'}</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10">Inventory Authority Protocol</p>
              
              <form onSubmit={handleSaveProduct} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Species Nomenclature</label>
                       <input required className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 font-bold text-white transition-all" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Classification</label>
                       <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 font-bold text-white transition-all appearance-none" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Market Rate (₹)</label>
                       <input type="number" required className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 font-bold text-white transition-all" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Payload (kg)</label>
                       <input type="number" step="0.1" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 font-bold text-white transition-all" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Inventory</label>
                       <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 font-bold text-white transition-all" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Asset Reference (URL)</label>
                    <div className="flex gap-4 items-center">
                       <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-700 shrink-0">
                          {productForm.image ? <img src={productForm.image} className="w-full h-full object-cover rounded-2xl" /> : <ImageIcon size={24} />}
                       </div>
                       <input className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 font-bold text-white transition-all" placeholder="https://..." value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                    </div>
                 </div>

                 <button type="submit" className="w-full py-6 bg-sky-500 text-slate-950 font-black rounded-[2rem] shadow-2xl shadow-sky-500/10 hover:bg-sky-400 transition-all flex items-center justify-center space-x-3 text-xs uppercase tracking-widest group">
                    <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Authorize Changes</span>
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
