
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  LayoutDashboard, Trash2, Search, LogOut, 
  X, Image as ImageIcon, Edit2, 
  Box, Plus, FileText, RefreshCw, 
  CheckCircle, PackageCheck, Truck, ClipboardList, 
  CreditCard, UserCheck, Printer, Phone, Menu, Layers,
  ChevronRight, Save, Globe
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

  const deleteProduct = async (id: string) => {
    if (!confirm('Remove this specimen from global registry?')) return;
    const updated = products.filter(p => p.id !== id);
    await setProducts(updated);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {showSuccessToast && (
        <div className="fixed top-8 right-8 z-[100] bg-emerald-600 text-white px-6 py-4 flex items-center gap-3 rounded-sm shadow-2xl animate-fade-in border border-white/10">
          <CheckCircle className="text-white" size={20} />
          <span className="font-bold text-[10px] uppercase tracking-widest">Registry Sync Complete</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-600 text-white font-black flex items-center justify-center rounded-sm text-sm">M</div>
            <span className="font-extrabold text-white text-base tracking-tighter uppercase">Admin Hub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white/50 hover:text-white transition-colors"><X size={20}/></button>
        </div>

        <nav className="p-4 space-y-1.5 mt-6">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Products', icon: Box },
            { id: 'Orders', icon: PackageCheck },
            { id: 'Invoices', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 font-black rounded-sm transition-all text-[9px] uppercase tracking-[0.25em] ${
                activeTab === tab.id ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.id}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-slate-500 hover:text-red-400 font-black text-[9px] uppercase tracking-widest transition-all">
            <LogOut size={16} />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 text-slate-500"><Menu size={20}/></button>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none">{activeTab}</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Core v2.5</span>
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
                  className="px-5 py-2.5 bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest rounded-sm flex items-center gap-2 hover:bg-sky-600 transition-all shadow-md"
                >
                  <Plus size={14} /> Add Specimen
                </button>
             )}
             <div className="flex items-center gap-2.5 pl-6 border-l border-slate-200">
               <Globe size={12} className="text-emerald-500 animate-pulse" />
               <span className="text-slate-400 font-black text-[8px] uppercase tracking-[0.2em]">Connected</span>
             </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-8 bg-slate-50">
          {activeTab === 'Dashboard' && (
            <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Stock Types', value: products.length, icon: Box, color: 'text-slate-900' },
                  { label: 'Active Shipments', value: stats.activeOrders, icon: Truck, color: 'text-sky-600' },
                  { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-600' }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 border border-slate-200 rounded-sm shadow-sm flex items-center justify-between group hover:border-sky-500/30 transition-all">
                    <div className="space-y-1">
                       <p className="font-black text-slate-400 text-[8px] uppercase tracking-widest">{s.label}</p>
                       <h3 className={`text-2xl font-black ${s.color} tracking-tighter`}>{s.value}</h3>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-sm group-hover:bg-sky-50 transition-colors">
                      <s.icon size={22} className="text-slate-200 group-hover:text-sky-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                 <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h4 className="font-black text-slate-600 text-[8px] uppercase tracking-widest">Recent Activity Log</h4>
                    <RefreshCw size={12} className="text-slate-300 animate-spin-slow cursor-pointer hover:text-slate-500 transition-colors"/>
                 </div>
                 <div className="divide-y divide-slate-100">
                   {orders.slice(-5).reverse().map(o => (
                     <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 bg-slate-100 text-slate-900 flex items-center justify-center rounded-sm text-[9px] font-black border border-slate-200">#{o.id.slice(-3)}</div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-900 text-xs uppercase tracking-tight">{o.customerName}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(o.date).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <span className="font-black text-slate-900 text-sm">₹{o.total.toLocaleString()}</span>
                           <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                             o.status === 'delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                           }`}>{o.status}</span>
                        </div>
                     </div>
                   ))}
                   {orders.length === 0 && (
                     <div className="p-10 text-center text-slate-400 text-[9px] font-black uppercase tracking-widest">Registry Feed Empty</div>
                   )}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden max-w-5xl mx-auto shadow-sm animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Specimen</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Class</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Inventory</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 uppercase tracking-tight">{p.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 italic mt-0.5 tracking-tight">{p.scientificName || 'Unlabeled'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-slate-500 font-black text-[8px] bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200 uppercase tracking-widest">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-700">{p.stock} Units</td>
                        <td className="px-6 py-4 font-black text-slate-900">₹{p.price}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingProduct(p); setProductForm({...p, variations: p.variations || []} as any); setIsProductModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-sm transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Orders' && (
             <div className="bg-white border border-slate-200 rounded-sm overflow-hidden max-w-5xl mx-auto shadow-sm animate-fade-in">
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[700px]">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Order ID</th>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Customer Name</th>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest">Total Amount</th>
                       <th className="px-6 py-4 font-black text-slate-400 text-[8px] uppercase tracking-widest text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-xs">
                     {orders.slice().reverse().map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-black text-sky-600">#{o.id}</td>
                         <td className="px-6 py-4 font-black text-slate-900 uppercase tracking-tight">{o.customerName}</td>
                         <td className="px-6 py-4 font-black text-slate-900">₹{o.total.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                             <button onClick={() => navigate(`/invoice/${o.id}`, { state: { orderData: o } })} className="p-2.5 bg-slate-100 text-slate-600 rounded-sm hover:bg-slate-900 hover:text-white transition-all"><FileText size={16}/></button>
                             <button onClick={() => { if(confirm('Erase this record?')) setOrders(orders.filter(ord=>ord.id!==o.id)) }} className="p-2.5 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          )}
        </div>
      </main>

      {/* Product Management Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-10 relative rounded-sm animate-fade-in shadow-2xl border border-white/10">
            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
            
            <div className="mb-10 flex items-center gap-4">
               <div className="p-3.5 bg-sky-50 rounded-sm text-sky-600 shadow-inner"><Layers size={20} /></div>
               <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                    {editingProduct ? 'Modify Specimen' : 'Add New Specimen'}
                  </h2>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5">Registry Global Distribution System</p>
               </div>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                   <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Product Name *</label>
                      <input required placeholder="Premium Halfmoon" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-black rounded-sm outline-none focus:border-slate-900 transition-all text-xs uppercase" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scientific Nomenclature</label>
                      <input placeholder="Betta splendens" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-bold rounded-sm outline-none focus:border-slate-900 transition-all italic text-xs" value={productForm.scientificName} onChange={e => setProductForm({...productForm, scientificName: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Class</label>
                         <select className="w-full bg-slate-50 border border-slate-200 px-3 py-3 font-black rounded-sm text-[9px] uppercase tracking-widest" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stock *</label>
                         <input type="number" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-black rounded-sm text-xs" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)||0})} />
                      </div>
                   </div>
                </div>

                <div className="space-y-5">
                   <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unit Price (₹) *</label>
                      <input type="number" required className="w-full bg-white border border-sky-100 px-4 py-3.5 font-black text-sky-600 rounded-sm outline-none text-base tracking-tighter" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)||0})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Net Mass (kg) *</label>
                      <input type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 font-black rounded-sm text-xs" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: parseFloat(e.target.value)||0})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Visual Asset (Photo)</label>
                      <div className="flex gap-4">
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-grow py-3 px-4 bg-slate-900 text-white font-black rounded-sm hover:bg-sky-600 transition-all flex items-center justify-center gap-2 text-[8px] uppercase tracking-[0.2em]">
                            <ImageIcon size={14}/>
                            {productForm.image ? 'Modify Visual' : 'Upload Asset'}
                         </button>
                         {productForm.image && (
                           <div className="w-12 h-12 bg-slate-50 rounded-sm border border-slate-200 overflow-hidden shrink-0 shadow-sm"><img src={productForm.image} className="w-full h-full object-cover" /></div>
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

              <div className="pt-6 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full py-4 bg-sky-600 text-white font-black uppercase tracking-[0.3em] rounded-sm hover:bg-sky-700 transition-all shadow-xl active:scale-[0.98] text-[9px] disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-3"><RefreshCw className="animate-spin" size={14} /> Global Sync in Progress...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-3"><Save size={14} /> Confirm and Broadcast Changes</span>
                  )}
                </button>
              </div>
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
