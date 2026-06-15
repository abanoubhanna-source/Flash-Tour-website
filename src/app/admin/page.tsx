// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Globe2, Briefcase, FileText, Plus, Edit3, Trash2, X, Save, Building,
  TrendingUp, Users, MousePointerClick, Clock, Activity, BarChart3
} from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [services, setServices] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState({ ceo_message: '', director_name: '', director_title: '', signature_img: '' });
  const [destinations, setDestinations] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  // Modals Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Overview & Analytics', icon: LayoutDashboard },
    { id: 'brands', label: 'Our Brands', icon: Building },
    { id: 'destinations', label: 'Global Destinations', icon: Globe2 },
    { id: 'services', label: 'Global Services', icon: Briefcase },
    { id: 'about', label: 'About & Legacy', icon: FileText },
  ];

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(res => res.json()),
      fetch('/api/about').then(res => res.json()),
      fetch('/api/destinations').then(res => res.json()),
      fetch('/api/brands').then(res => res.json())
    ]).then(([servicesRes, aboutRes, destRes, brandsRes]) => {
      setServices(servicesRes);
      setAboutData(aboutRes);
      setDestinations(destRes);
      setBrands(brandsRes);
      setIsLoading(false);
    });
  }, []);

  // -- Generic Save/Delete Handlers --
  const handleSave = async (endpoint: string, stateList: any[], setStateFn: any) => {
    let formattedData = { ...formData };
    
    if (formattedData.highlights && typeof formattedData.highlights === 'string') {
      formattedData.highlights = formattedData.highlights.split(',').map((h: string) => h.trim());
    }
    if (formattedData.features && typeof formattedData.features === 'string') {
      formattedData.features = formattedData.features.split(',').map((h: string) => h.trim());
    }

    let newList = editingItem 
      ? stateList.map(item => item.id === editingItem.id ? { ...item, ...formattedData } : item) 
      : [{ id: formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : Date.now(), ...formattedData }, ...stateList];
    
    setStateFn(newList);
    setIsModalOpen(false);
    await fetch(endpoint, { method: 'POST', body: JSON.stringify(newList) });
  };

  const handleDelete = async (id: any, endpoint: string, stateList: any[], setStateFn: any) => {
    if(confirm('Are you sure you want to delete this record?')) {
      const newList = stateList.filter(item => item.id !== id);
      setStateFn(newList);
      await fetch(endpoint, { method: 'POST', body: JSON.stringify(newList) });
    }
  };

  // -- Modal Opener --
  const openModal = (type: string, item: any = null) => {
    setEditingItem(item);
    if(type === 'service') {
      setFormData(item ? { ...item } : { title: '', desc: '', img: '/images/services-hero.jpg' });
    } else if (type === 'destination') {
      setFormData(item ? { ...item, highlights: item.highlights.join(', ') } : { name: '', subtitle: '', description: '', highlights: '', image: '', icon: 'MapPin' });
    } else if (type === 'brand') {
      setFormData(item ? { ...item, features: item.features.join(', ') } : { name: '', subtitle: '', description: '', features: '', image: '', icon: 'Building', color: 'teal' });
    }
    setIsModalOpen(true);
  };

  const handleSaveAbout = async () => {
    setIsSavingAbout(true);
    await fetch('/api/about', { method: 'POST', body: JSON.stringify(aboutData) });
    setTimeout(() => setIsSavingAbout(false), 800);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-en overflow-hidden relative">
      <aside className="w-72 bg-[#020617] text-white flex flex-col h-full border-r border-slate-800 shrink-0">
        <div className="p-8 border-b border-white/10">
          <div className="text-2xl font-black tracking-widest uppercase mb-1">Flash<span className="text-[#F1B820]">Admin</span></div>
          <div className="text-xs text-[#157670] font-bold tracking-[0.2em] uppercase">Control Panel v1.0</div>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-[#157670] text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#157670] bg-[#157670]/10 px-4 py-2 rounded-full">
              <Activity className="w-4 h-4 animate-pulse" /> System Online
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {isLoading ? <div className="text-center text-slate-500 mt-10">Loading Data...</div> : 
          <>
            
            {/* ========================================= */}
            {/* 1. DASHBOARD & ANALYTICS SCREEN (NEW)     */}
            {/* ========================================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-teal-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mb-4"><Users className="w-6 h-6" /></div>
                      <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Total Visitors</h3>
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-slate-900">24,592</span>
                        <span className="text-emerald-500 text-sm font-bold flex items-center mb-1"><TrendingUp className="w-4 h-4 mr-1" /> +12%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-4"><MousePointerClick className="w-6 h-6" /></div>
                      <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Page Views</h3>
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-slate-900">89,201</span>
                        <span className="text-emerald-500 text-sm font-bold flex items-center mb-1"><TrendingUp className="w-4 h-4 mr-1" /> +8%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-4"><Clock className="w-6 h-6" /></div>
                      <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Avg. Session</h3>
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-slate-900">4m 12s</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4"><BarChart3 className="w-6 h-6 text-[#F1B820]" /></div>
                      <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Database Records</h3>
                      <div className="flex items-end gap-3 mt-2">
                        <div className="text-center"><span className="block text-2xl font-black">{brands.length}</span><span className="text-xs text-slate-400 uppercase">Brands</span></div>
                        <div className="w-px h-8 bg-white/20 mx-2"></div>
                        <div className="text-center"><span className="block text-2xl font-black">{destinations.length}</span><span className="text-xs text-slate-400 uppercase">Dests</span></div>
                        <div className="w-px h-8 bg-white/20 mx-2"></div>
                        <div className="text-center"><span className="block text-2xl font-black">{services.length}</span><span className="text-xs text-slate-400 uppercase">Services</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Top Regions Traffic */}
                  <div className="col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Traffic By Region</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Europe (Germany, Italy, UK)</span><span>45%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-teal-600 h-3 rounded-full" style={{ width: '45%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Middle East (UAE, KSA)</span><span>30%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-amber-500 h-3 rounded-full" style={{ width: '30%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Asia (India, China)</span><span>15%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: '15%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Others</span><span>10%</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-slate-400 h-3 rounded-full" style={{ width: '10%' }}></div></div>
                      </div>
                    </div>
                  </div>

                  {/* Most Visited Pages */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Top Pages</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">1</div>
                          <span className="font-bold text-slate-800 text-sm">/brands</span>
                        </div>
                        <span className="text-sm font-bold text-teal-700">12.4k</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">2</div>
                          <span className="font-bold text-slate-800 text-sm">/destinations</span>
                        </div>
                        <span className="text-sm font-bold text-teal-700">8.2k</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">3</div>
                          <span className="font-bold text-slate-800 text-sm">/services</span>
                        </div>
                        <span className="text-sm font-bold text-teal-700">5.1k</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-6 text-center italic">* Google Analytics Integration Pending</p>
                  </div>

                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* 2. BRANDS SCREEN                          */}
            {/* ========================================= */}
            {activeTab === 'brands' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-slate-500 font-medium">Manage hotels, cruises, and owned assets.</p>
                  <button onClick={() => openModal('brand')} className="flex items-center gap-2 bg-[#020617] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#157670] transition-colors shadow-md">
                    <Plus className="w-4 h-4" /> Add Brand
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Image</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Brand Name</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Subtitle</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {brands.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6"><div className="relative w-16 h-10 rounded-md overflow-hidden bg-slate-200"><Image src={item.image} alt={item.name} fill className="object-cover" /></div></td>
                          <td className="py-4 px-6 font-bold text-slate-900 text-sm">{item.name}</td>
                          <td className="py-4 px-6 text-slate-500 text-sm">{item.subtitle}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openModal('brand', item)} className="p-2 rounded-lg text-[#157670] bg-[#157670]/10 hover:bg-[#157670] hover:text-white"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(item.id, '/api/brands', brands, setBrands)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-600 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* 3. DESTINATIONS SCREEN                    */}
            {/* ========================================= */}
            {activeTab === 'destinations' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-slate-500 font-medium">Manage operational regions and branches.</p>
                  <button onClick={() => openModal('destination')} className="flex items-center gap-2 bg-[#020617] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#157670] transition-colors shadow-md ml-auto">
                    <Plus className="w-4 h-4" /> Add Destination
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Image</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Country</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {destinations.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-4 px-6"><div className="relative w-16 h-10 rounded-md overflow-hidden bg-slate-200"><Image src={item.image} alt={item.name} fill className="object-cover" /></div></td>
                          <td className="py-4 px-6 font-bold text-slate-900 text-sm">{item.name}</td>
                          <td className="py-4 px-6 text-right">
                            <button onClick={() => openModal('destination', item)} className="p-2 text-[#157670]"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id, '/api/destinations', destinations, setDestinations)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* 4. SERVICES SCREEN                        */}
            {/* ========================================= */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-slate-500 font-medium">Manage global business services.</p>
                  <button onClick={() => openModal('service')} className="flex items-center gap-2 bg-[#020617] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#157670] ml-auto"><Plus className="w-4 h-4" /> Add Service</button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      {services.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-4 px-6 font-bold text-slate-900 text-sm">{item.title}</td>
                          <td className="py-4 px-6 text-right">
                            <button onClick={() => openModal('service', item)} className="p-2 text-[#157670]"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id, '/api/services', services, setServices)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* 5. ABOUT SCREEN                           */}
            {/* ========================================= */}
            {activeTab === 'about' && (
              <div className="max-w-3xl bg-white rounded-3xl p-8 border border-slate-200">
                  <div><label className="block text-sm font-bold mb-2">CEO Message</label><textarea value={aboutData.ceo_message} onChange={(e) => setAboutData({...aboutData, ceo_message: e.target.value})} className="w-full px-4 py-3 rounded-xl border h-32" /></div>
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div><label className="block text-sm font-bold mb-2">Director Name</label><input type="text" value={aboutData.director_name} onChange={(e) => setAboutData({...aboutData, director_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                    <div><label className="block text-sm font-bold mb-2">Director Title</label><input type="text" value={aboutData.director_title} onChange={(e) => setAboutData({...aboutData, director_title: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  </div>
                  <div className="mt-4"><label className="block text-sm font-bold mb-2">Signature Image Path</label><input type="text" value={aboutData.signature_img} onChange={(e) => setAboutData({...aboutData, signature_img: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                <div className="mt-8 flex justify-end">
                  <button onClick={handleSaveAbout} disabled={isSavingAbout} className="px-8 py-3 rounded-full font-bold text-white bg-[#157670]">{isSavingAbout ? 'Saving...' : 'Update'}</button>
                </div>
              </div>
            )}
            
          </>}
        </div>
      </main>

      {/* Dynamic Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-xl font-black text-[#020617] uppercase tracking-tight">{editingItem ? 'Edit Record' : 'Add Record'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto">
              {activeTab === 'brands' && (
                <>
                  <div><label className="block text-sm font-bold mb-2">Brand Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Subtitle</label><input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border h-32" /></div>
                  <div><label className="block text-sm font-bold mb-2">Features (Comma separated)</label><input type="text" value={formData.features} onChange={(e) => setFormData({...formData, features: e.target.value})} className="w-full px-4 py-3 rounded-xl border" placeholder="Feature A, Feature B" /></div>
                  <div><label className="block text-sm font-bold mb-2">Image Path</label><input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                </>
              )}
              {activeTab === 'destinations' && (
                <>
                  <div><label className="block text-sm font-bold mb-2">Destination Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Subtitle</label><input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border h-32" /></div>
                  <div><label className="block text-sm font-bold mb-2">Highlights (Comma separated)</label><input type="text" value={formData.highlights} onChange={(e) => setFormData({...formData, highlights: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Background Image</label><input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                </>
              )}
              {activeTab === 'services' && (
                <>
                  <div><label className="block text-sm font-bold mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Description</label><textarea value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-3 rounded-xl border h-32" /></div>
                  <div><label className="block text-sm font-bold mb-2">Image</label><input type="text" value={formData.img} onChange={(e) => setFormData({...formData, img: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                </>
              )}
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={() => {
                if(activeTab === 'brands') handleSave('/api/brands', brands, setBrands);
                if(activeTab === 'destinations') handleSave('/api/destinations', destinations, setDestinations);
                if(activeTab === 'services') handleSave('/api/services', services, setServices);
              }} className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-white bg-[#157670]"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}