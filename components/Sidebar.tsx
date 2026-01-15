import React, { useState } from 'react';
import { LayoutDashboard, FileText, CreditCard, FolderOpen, Settings, LogOut, Users, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { User, Client } from '../types';
import { db } from '../services/mockData';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  selectedClientId: string;
  onClientChange: (clientId: string) => void;
  clients?: Client[]; // Optional because standard users won't use it, but Admin will
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, onNavigate, user, onLogout, isMobileOpen, setIsMobileOpen, selectedClientId, onClientChange, clients = [] 
}) => {
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  
  // If admin, use passed clients (which are reactive state from App). If user, just one context.
  // Note: For regular users, clients prop might be empty or full list, but we only show their own context.
  
  const currentClient = user?.role === 'admin' 
    ? clients.find(c => c.id === selectedClientId) 
    : user;

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'reports', label: '보고서', icon: FileText },
    { id: 'payments', label: '결제 관리', icon: CreditCard },
    { id: 'files', label: '파일함', icon: FolderOpen },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  if (user?.role === 'admin') {
    // Standard Admin Menu: Client Management
    menuItems.push({ id: 'clients', label: '고객 관리', icon: Users });

    // Master Admin Only Menu: Admin Management
    if (user.email === 'kwad@kohwoonc.com') {
      menuItems.push({ id: 'admins', label: '관리자 계정 관리', icon: ShieldCheck });
    }
  }

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-out transform lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
        
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-center px-6 border-b border-gray-50">
          <button onClick={() => handleNav('dashboard')} className="flex items-center gap-3 group w-full">
            {/* Logo Image */}
            <img 
              src="/logo.png" 
              alt="Kohwoon Ad" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback Placeholder (hidden by default if image loads) */}
            <div className="hidden w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xl rounded-none">
              K
            </div>
            
            <div className="flex flex-col items-start">
              <span className="font-bold text-lg tracking-tight text-gray-900 group-hover:text-brand-orange transition-colors">Kohwoon Ad</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Marketing Partner</span>
            </div>
          </button>
        </div>

        {/* Client Context Selector (For Admin) or Profile (For User) */}
        <div className="px-6 py-6">
          <div className="relative">
            <button 
              onClick={() => user?.role === 'admin' && setIsClientMenuOpen(!isClientMenuOpen)}
              className={`w-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-4 border border-gray-100 flex items-center justify-between group ${user?.role === 'admin' ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                  {user?.role === 'admin' ? 'Selected Client' : 'My Clinic'}
                </span>
                <span className="font-bold text-gray-900 text-sm truncate w-full text-left">
                  {currentClient?.clinicName || 'Select Client'}
                </span>
                <span className="text-xs text-gray-500 truncate w-full text-left">
                  {currentClient?.name}
                </span>
              </div>
              {user?.role === 'admin' && (
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isClientMenuOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Admin Client Dropdown */}
            {isClientMenuOpen && user?.role === 'admin' && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="max-h-60 overflow-y-auto py-1">
                  {clients.length > 0 ? clients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => {
                        onClientChange(client.id);
                        setIsClientMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{client.clinicName}</div>
                        <div className="text-xs text-gray-500">{client.name}</div>
                      </div>
                      {client.id === selectedClientId && <Check size={14} className="text-brand-orange"/>}
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-gray-400 text-center">등록된 고객이 없습니다</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-brand-orange' : 'text-gray-400'} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-orange" />}
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;