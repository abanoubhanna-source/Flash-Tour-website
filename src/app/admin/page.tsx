// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Ship, Building2, Briefcase, Search, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', desc: '', img: '' });
  const [isLoading, setIsLoading] = useState(true);

  // جلب البيانات من الـ API
  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setIsLoading(false);
      });
  }, []);

  // حفظ التعديلات في الـ API
  const handleSave = async () => {
    let newServices = [];
    if (editingItem) {
      newServices = services.map(s => s.id === editingItem.id ? { ...s, ...formData } : s);
    } else {
      newServices = [{ id: Date.now(), ...formData }, ...services];
    }

    setServices(newServices);
    setIsModalOpen(false);

    // إرسال البيانات للسيرفر
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newServices)
    });
  };

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure you want to delete this service?')) {
      const newServices = services.filter(s => s.id !== id);
      setServices(newServices);
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newServices)
      });
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ title: '', desc: '', img: '/images/services-hero.jpg' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ title: item.title, desc: item.desc, img: item.img });
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-en overflow-hidden relative">
      <aside className="w-72 bg-[#020617] text-white flex flex-col h-full border-r border-slate-800 shrink-0">
        <div className="p-8 border-b border-white/10">
          <div className="text-2xl font-black tracking-widest uppercase mb-1">Flash<span className="text-[#F1B820]">Admin</span></div>
          <div className="text-xs text-[#157670] font-bold tracking-[0.2em] uppercase">Control Panel v1.0</div>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#157670] text-white shadow-lg">
            <Briefcase className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide">Global Services</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Manage Services</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="flex justify-between items-center mb-8">
            <p className="text-slate-500 font-medium">Currently managing live records.</p>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#020617] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#157670] transition-colors shadow-md">
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          </div>

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
                {isLoading ? <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading records...</td></tr> : 
                services.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="relative w-16 h-10 rounded-md overflow-hidden bg-slate-200 border border-slate-300">
                        <Image src={item.img} alt={item.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">{item.title}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm truncate max-w-md">{item.desc}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-[#157670] bg-[#157670]/10 hover:bg-[#157670] hover:text-white"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-600 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-[#020617] uppercase tracking-tight">{editingItem ? 'Edit Record' : 'Add New Record'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#157670]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Description</label>
                <textarea value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#157670] h-32 resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Image Path</label>
                <input type="text" value={formData.img} onChange={(e) => setFormData({...formData, img: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#157670]" />
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-white bg-[#157670] hover:bg-[#0f5450]"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}