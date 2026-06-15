// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Globe2, Briefcase, FileText, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('destinations');
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [services, setServices] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState({ ceo_message: '', director_name: '', director_title: '', signature_img: '' });
  const [destinations, setDestinations] = useState<any[]>([]);
  
  // Modals Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'destinations', label: 'Global Destinations', icon: Globe2 },
    { id: 'services', label: 'Global Services', icon: Briefcase },
    { id: 'about', label: 'About & Legacy', icon: FileText },
  ];

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(res => res.json()),
      fetch('/api/about').then(res => res.json()),
      fetch('/api/destinations').then(res => res.json())
    ]).then(([servicesRes, aboutRes, destRes]) => {
      setServices(servicesRes);
      setAboutData(aboutRes);
      setDestinations(destRes);
      setIsLoading(false);
    });
  }, []);

  // -- Services Logic --
  const handleSaveService = async () => {
    let newServices = editingItem ? services.map(s => s.id === editingItem.id ? { ...s, ...formData } : s) : [{ id: Date.now(), ...formData }, ...services];
    setServices(newServices);
    setIsModalOpen(false);
    await fetch('/api/services', { method: 'POST', body: JSON.stringify(newServices) });
  };

  const handleDeleteService = async (id: number) => {
    if(confirm('Are you sure?')) {
      const newServices = services.filter(s => s.id !== id);
      setServices(newServices);
      await fetch('/api/services', { method: 'POST', body: JSON.stringify(newServices) });
    }
  };

  // -- Destinations Logic --
  const handleSaveDest = async () => {
    // تحويل الـ string المكتوب في حقل الـ highlights لمصفوفة (عشان الداتابيز تقرأه صح)
    const formattedData = {
      ...formData,
      highlights: typeof formData.highlights === 'string' ? formData.highlights.split(',').map((h: string) => h.trim()) : formData.highlights
    };

    let newDests = editingItem ? destinations.map(d => d.id === editingItem.id ? { ...d, ...formattedData } : d) : [{ id: formData.name.toLowerCase().replace(/\s+/g, '-'), ...formattedData }, ...destinations];
    
    setDestinations(newDests);
    setIsModalOpen(false);
    await fetch('/api/destinations', { method: 'POST', body: JSON.stringify(newDests) });
  };

  const handleDeleteDest = async (id: string) => {
    if(confirm('Delete this destination?')) {
      const newDests = destinations.filter(d => d.id !== id);
      setDestinations(newDests);
      await fetch('/api/destinations', { method: 'POST', body: JSON.stringify(newDests) });
    }
  };

  // -- Modal Opener --
  const openModal = (type: string, item: any = null) => {
    setEditingItem(item);
    if(type === 'service') {
      setFormData(item ? { ...item } : { title: '', desc: '', img: '/images/services-hero.jpg' });
    } else if (type === 'destination') {
      setFormData(item ? { ...item, highlights: item.highlights.join(', ') } : { name: '', subtitle: '', description: '', highlights: '', image: '', icon: 'MapPin' });
    }
    setIsModalOpen(true);
  };

  // -- About Logic --
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
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Manage {activeTab}</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {isLoading ? <div className="text-center text-slate-500 mt-10">Loading Data...</div> : 
          <>
            
            {/* -- Destinations Screen -- */}
            {activeTab === 'destinations' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <p className="text-slate-500 font-medium">Manage operational regions and branches.</p>
                  <button onClick={() => openModal('destination')} className="flex items-center gap-2 bg-[#020617] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#157670] transition-colors shadow-md">
                    <Plus className="w-4 h-4" /> Add Destination
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Image</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Country/Name</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Subtitle</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {destinations.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6"><div className="relative w-16 h-10 rounded-md overflow-hidden bg-slate-200"><Image src={item.image} alt={item.name} fill className="object-cover" /></div></td>
                          <td className="py-4 px-6 font-bold text-slate-900 text-sm">{item.name}</td>
                          <td className="py-4 px-6 text-slate-500 text-sm">{item.subtitle}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openModal('destination', item)} className="p-2 rounded-lg text-[#157670] bg-[#157670]/10 hover:bg-[#157670] hover:text-white"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteDest(item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-600 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -- Services Screen -- */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <button onClick={() => openModal('service')} className="flex items-center gap-2 bg-[#020617] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#157670] transition-colors shadow-md ml-auto">
                    <Plus className="w-4 h-4" /> Add Service
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Title</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {services.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-900 text-sm">{item.title}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openModal('service', item)} className="p-2 rounded-lg text-[#157670] bg-[#157670]/10"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteService(item.id)} className="p-2 rounded-lg text-red-600 bg-red-50"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -- About Screen -- */}
            {activeTab === 'about' && (
              <div className="max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <div className="space-y-6">
                  <div><label className="block text-sm font-bold text-slate-700 mb-2 uppercase">CEO Message</label><textarea value={aboutData.ceo_message} onChange={(e) => setAboutData({...aboutData, ceo_message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#157670] h-32 resize-none" /></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Director Name</label><input type="text" value={aboutData.director_name} onChange={(e) => setAboutData({...aboutData, director_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#157670]" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Director Title</label><input type="text" value={aboutData.director_title} onChange={(e) => setAboutData({...aboutData, director_title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#157670]" /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Signature Image Path</label><input type="text" value={aboutData.signature_img} onChange={(e) => setAboutData({...aboutData, signature_img: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#157670]" /></div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={handleSaveAbout} disabled={isSavingAbout} className="px-8 py-3 rounded-full font-bold text-white bg-[#157670]">{isSavingAbout ? 'Saving...' : 'Update'}</button>
                </div>
              </div>
            )}
            
            {activeTab === 'dashboard' && <p>Dashboard Overview Coming Soon</p>}
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
              {activeTab === 'services' ? (
                <>
                  <div><label className="block text-sm font-bold mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Description</label><textarea value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-3 rounded-xl border h-32" /></div>
                  <div><label className="block text-sm font-bold mb-2">Image</label><input type="text" value={formData.img} onChange={(e) => setFormData({...formData, img: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                </>
              ) : (
                <>
                  <div><label className="block text-sm font-bold mb-2">Destination Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Subtitle</label><input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                  <div><label className="block text-sm font-bold mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border h-32" /></div>
                  <div><label className="block text-sm font-bold mb-2">Highlights (Comma separated)</label><input type="text" value={formData.highlights} onChange={(e) => setFormData({...formData, highlights: e.target.value})} className="w-full px-4 py-3 rounded-xl border" placeholder="Hotel X, Safari Y, Tour Z" /></div>
                  <div><label className="block text-sm font-bold mb-2">Background Image</label><input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 rounded-xl border" /></div>
                </>
              )}
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={activeTab === 'services' ? handleSaveService : handleSaveDest} className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-white bg-[#157670]"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}