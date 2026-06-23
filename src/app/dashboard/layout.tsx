// src/app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Map, Ship, Users, Settings, 
  LogOut, Menu, X, Bell, Building2, FileText, ImageIcon, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuGroups = [
    {
      title: 'Analytics',
      links: [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Content Management (CMS)',
      links: [
        { name: 'Pages Content', href: '/dashboard/pages', icon: FileText },
        { name: 'Media Library', href: '/dashboard/media', icon: ImageIcon },
      ]
    },
    {
      title: 'Business Data',
      links: [
        { name: 'Global Destinations', href: '/dashboard/destinations', icon: Globe },
        { name: 'Our Brands & Fleet', href: '/dashboard/brands', icon: Ship },
        { name: 'Enterprise Services', href: '/dashboard/services', icon: Building2 },
      ]
    },
    {
      title: 'Administration',
      links: [
        { name: 'Users & Roles', href: '/dashboard/users', icon: Users },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex overflow-hidden font-en">
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }} 
            animate={{ width: 280, opacity: 1 }} 
            exit={{ width: 0, opacity: 0 }}
            className="hidden md:flex flex-col bg-[#0F162A] h-screen sticky top-0 shrink-0 shadow-2xl z-20"
          >
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <span className="text-2xl font-black text-white tracking-tighter">
                FLASH<span className="text-[#157670]">ADMIN</span>
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-8 no-scrollbar">
              {menuGroups.map((group, idx) => (
                <div key={idx} className="px-6 space-y-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{group.title}</p>
                  <div className="space-y-1">
                    {group.links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                            isActive 
                              ? 'bg-[#157670] text-white shadow-lg shadow-[#157670]/20' 
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className="text-sm">{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/5">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-medium text-sm">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:text-[#0F162A] hover:bg-slate-100 rounded-xl transition-colors hidden md:block"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-[#0F162A] capitalize tracking-tight">
              {pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-400 hover:text-[#0F162A] hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#0F162A]">Admin User</p>
                <p className="text-xs font-bold text-[#157670]">Super Admin</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#0F162A] flex items-center justify-center text-white font-black shadow-lg">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}