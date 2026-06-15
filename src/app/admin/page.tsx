// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, Ship, Building2, Briefcase, LogOut, Search, Plus, Edit3, Trash2, X, Save
} from 'lucide-react';
import Image from 'next/image';

// الداتا المبدئية
const initialServices = [
  { id: 1, title: "Inbound & Outbound Tourism", desc: "With many years of experience in the industry, we have diversified our portfolio in hospitality...", img: "/images/services-hero.jpg" },
  { id: 2, title: "Flight Reservations", desc: "Our team will handle all ticketing procedures as we have partnered up with IATA...", img: "/images/services-hero.jpg" },
  { id: 3, title: "Hotel Reservations", desc: "We have contracted most of the hotels in the region across all categories, both in terms of luxury...", img: "/images/services-hero.jpg" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState(initialServices);
  
  // حالات التحكم في النافذة المنبثقة (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', desc: '', img: '' });

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Global Services', icon: Briefcase },
    { id: 'cruises', label: 'Nile Cruises', icon: Ship },
    { id: 'hotels', label: 'Hotels & Resorts', icon: Building2 },
  ];

  // فتح نافذة الإضافة
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ title: '', desc: '', img: '/images/services-hero.jpg' });
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ title: item.title, desc: item.desc, img: item.img });
    setIsModalOpen(true);
  };

  // حفظ البيانات
  const handleSave = () => {
    if (editingItem) {
      // تعديل خدمة موجودة
      setServices(services.map(s => s.id === editingItem.id ? { ...s, ...formData } : s));
    } else {
      // إضافة خدمة جديدة
      setServices([{ id: Date.now(), ...formData }, ...services]);
    }
    setIsModalOpen(false);
  };

  // حذف خدمة
  const handleDelete = (id: number) => {
    if(confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-en overflow-hidden relative">
      
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Manage {activeTab}</h1>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            <div className="w-10 h-10 bg-[#020617] rounded-full flex items-center justify-center text-[#F1B820] font-bold">AT</div>
            <div className="text-sm">
              <p className="font-bold text-slate-900">Ahmed Tawfik</p>
              <p className="text-slate-500 text-xs font-semibold">Super Admin</p>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          <div className="flex justify-between items-center mb-8">
            <p className="text-slate-500 font-medium">Currently managing active records.</p>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#020617] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#157670] transition-colors shadow-md">
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Image</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase w-1/4">Title</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">Description Snippet</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="relative w-16 h-10 rounded-md overflow-hidden bg-slate-200 border border-slate-300">
                        <Image src={item.img} alt={item.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">{item.title}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm truncate max-w-md">{item.desc}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-[#157670] bg-[#157670]/10 hover:bg-[#157670] hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-[#020617] uppercase tracking-tight">
                {editingItem ? 'Edit Record' : 'Add New Record'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#157670] focus:border-transparent transition-all"
                  placeholder="Enter service title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
                <textarea 
                  value={formData.desc} 
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#157670] focus:border-transparent transition-all h-32 resize-none"
                  placeholder="Enter full description..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Image Path</label>
                <input 
                  type="text" 
                  value={formData.img} 
                  onChange={(e) => setFormData({...formData, img: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#157670] focus:border-transparent transition-all"
                  placeholder="/images/your-image.jpg"
                />
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-white bg-[#157670] hover:bg-[#0f5450] transition-colors shadow-lg">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}