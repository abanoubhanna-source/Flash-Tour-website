// src/app/dashboard/brands/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Save, Building, Ship, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ManageBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: '', subtitle: '', description: '', features: '', image: '', type: 'Hotel'
  });
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setBrands(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch brands:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. Open Modal for Add/Edit
  const openModal = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      // تحويل مصفوفة الـ features لنص عشان يظهر في الـ Input
      setFormData({ 
        ...item, 
        features: item.features ? item.features.join(', ') : '' 
      });
    } else {
      setFormData({ name: '', subtitle: '', description: '', features: '', image: '', type: 'Hotel' });
    }
    setIsModalOpen(true);
  };

  // 3. Save Data
  const handleSave = async () => {
    setIsSaving(true);
    let formattedData = { ...formData };
    
    // تحويل النص لمصفوفة تاني
    if (typeof formattedData.features === 'string') {
      formattedData.features = formattedData.features.split(',').map((f: string) => f.trim()).filter(Boolean);
    }

    let newList;
    if (editingItem) {
      newList = brands.map(item => item.id === editingItem.id ? { ...item, ...formattedData } : item);
    } else {
      const newId = formData.name.toLowerCase().replace(/\s+/g, '-');
      newList = [{ id: newId, ...formattedData }, ...brands];
    }
    
    setBrands(newList);
    
    try {
      await fetch('/api/brands', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList) 
      });
    } catch (err) {
      console.error("Error saving data", err);
    }
    
    setIsSaving(false);
    setIsModalOpen(false);
  };

  // 4. Delete Data
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
      const newList = brands.filter(item => item.id !== id);
      setBrands(newList);
      
      try {
        await fetch('/api/brands', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newList) 
        });
      } catch (err) {
        console.error("Error deleting data", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0F162A] uppercase tracking-tight">Our Brands & Fleet</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage hotels, Nile cruises, and owned hospitality assets.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="flex items-center gap-2 bg-[#0F162A] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#157670] transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" /> Add Asset
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#157670] mb-4" />
            <p className="font-bold uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-medium">
            No assets found. Click "Add Asset" to register a new hotel or cruise.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Visual</th>
                  <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                  <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {brands.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-black text-[#0F162A] text-base">{item.name}</div>
                      <div className="text-slate-500 text-sm font-medium line-clamp-1 max-w-md">{item.subtitle}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                        item.type === 'Cruise' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {item.type === 'Cruise' ? <Ship className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                        {item.type || 'Hotel'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(item)} 
                          className="p-2 rounded-xl text-[#157670] bg-[#157670]/10 hover:bg-[#157670] hover:text-white transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F162A]/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#157670]/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-[#157670]" />
                  </div>
                  <h2 className="text-xl font-black text-[#0F162A] uppercase tracking-tight">
                    {editingItem ? 'Edit Asset' : 'Add New Asset'}
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Brand / Asset Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#157670] focus:ring-1 focus:ring-[#157670] outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Asset Type</label>
                    <select 
                      value={formData.type || 'Hotel'} 
                      onChange={(e) => setFormData({...formData, type: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#157670] focus:ring-1 focus:ring-[#157670] outline-none transition-all font-medium text-slate-800 appearance-none bg-white"
                    >
                      <option value="Hotel">Hotel / Resort</option>
                      <option value="Cruise">Nile Cruise</option>
                      <option value="Restaurant">Restaurant</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Subtitle / Tag</label>
                  <input 
                    type="text" 
                    value={formData.subtitle} 
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#157670] outline-none transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#157670] outline-none transition-all font-medium text-slate-800 h-28 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Key Features <span className="text-slate-400 lowercase font-normal">(Comma separated)</span></label>
                  <input 
                    type="text" 
                    value={formData.features} 
                    onChange={(e) => setFormData({...formData, features: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#157670] outline-none transition-all font-medium text-slate-800"
                    placeholder="e.g., 5-Star, Private Beach, Spa"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Image URL Path</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#157670] outline-none transition-all font-medium text-slate-800"
                    placeholder="/images/hotel-1.jpg"
                  />
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4 shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 rounded-full font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-[#0F162A] hover:bg-[#157670] transition-colors shadow-lg disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Saving...' : 'Save Asset'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}