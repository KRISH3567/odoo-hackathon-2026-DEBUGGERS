import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  FileText,
  ScanLine,
  Warehouse,
  UserCheck
} from 'lucide-react';

export default function Sidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen
}) {
  const {
    currentView,
    setCurrentView,
    products,
    pendingReceiptsCount,
    pendingDeliveriesCount,
    user,
    switchRole
  } = useInventory();

  const totalPendingOps = pendingReceiptsCount + pendingDeliveriesCount;
  const isStaff = user.role === 'staff';

  const managerNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'operations',
      label: 'Operations Hub',
      icon: ArrowLeftRight,
      badge: totalPendingOps > 0 ? totalPendingOps : null,
      badgeColor: 'bg-primary/20 text-primary-light border border-primary/30'
    },
    {
      id: 'products',
      label: 'Products & Stock',
      icon: Package,
      badge: products.length,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'warehouse',
      label: 'Digital Twin Map',
      icon: Warehouse,
      badge: '2D',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'ledger',
      label: 'Stock Ledger',
      icon: FileText,
      badge: null
    },
    {
      id: 'barcode',
      label: 'Barcode Scanner',
      icon: ScanLine,
      badge: null
    }
  ];

  const staffNavItems = [
    {
      id: 'barcode',
      label: 'Scan & Workstation',
      icon: ScanLine,
      badge: 'Floor',
      badgeColor: 'bg-tertiary/20 text-tertiary border border-tertiary/30'
    },
    {
      id: 'operations',
      label: 'Pick & Receive',
      icon: ArrowLeftRight,
      badge: totalPendingOps > 0 ? `${totalPendingOps} tasks` : null,
      badgeColor: 'bg-primary/20 text-primary-light border border-primary/30'
    },
    {
      id: 'products',
      label: 'Bin & Product Lookup',
      icon: Package,
      badge: products.length,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'warehouse',
      label: 'Digital Twin Map',
      icon: Warehouse,
      badge: null
    },
    {
      id: 'dashboard',
      label: 'Inventory Overview',
      icon: LayoutDashboard,
      badge: null
    }
  ];

  const currentNavItems = isStaff ? staffNavItems : managerNavItems;

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileSidebarOpen?.(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen?.(false)}
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-[#0a0f1d]/95 backdrop-blur-xl flex flex-col justify-between py-5 z-40 border-r border-slate-800/80 transition-all duration-300 ${
        mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col gap-6 px-4 overflow-y-auto">
          {/* Workstation Mode Badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-300">
                {isStaff ? 'Staff Workstation' : 'Manager Console'}
              </span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isStaff ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
            }`}>
              {isStaff ? 'Floor' : 'Admin'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1">
              Navigation
            </span>

            {currentNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? isStaff
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-bold translate-x-1'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 font-bold translate-x-1'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                    }`} />
                    <span className="tracking-wide">{item.label}</span>
                  </span>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card with Instant Role Toggle */}
        <div className="px-4 pt-3 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                isStaff
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {isStaff ? 'RK' : 'AV'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-200 truncate">
                  {user.name || (isStaff ? 'Ravi Kumar' : 'Alex Vance')}
                </span>
                <span className="text-[10px] text-slate-400 capitalize truncate flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  {isStaff ? 'Warehouse Staff' : 'Inventory Manager'}
                </span>
              </div>
            </div>

            <button
              onClick={() => switchRole(isStaff ? 'manager' : 'staff')}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-purple-500/40 active:scale-95"
              title="Switch role mode"
            >
              Switch
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
