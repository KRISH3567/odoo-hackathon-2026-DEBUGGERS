import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  FileText,
  ScanLine,
  ArrowDownLeft,
  Truck,
  Plus,
  SlidersHorizontal,
  Shield,
  Zap
} from 'lucide-react';

export default function Sidebar({
  onOpenNewProductModal,
  onOpenReceiptModal,
  onOpenDeliveryModal,
  onOpenTransferModal,
  onOpenAdjustmentModal,
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

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products',
      label: 'Products & Stock',
      icon: Package,
      badge: products.length
    },
    {
      id: 'operations',
      label: 'Operations Hub',
      icon: ArrowLeftRight,
      badge: totalPendingOps > 0 ? totalPendingOps : null,
      badgeColor: 'bg-primary text-white'
    },
    {
      id: 'ledger',
      label: 'Stock Ledger',
      icon: FileText,
      badge: null
    },
    {
      id: 'barcode',
      label: 'Barcode Terminal',
      icon: ScanLine,
      badge: null
    }
  ];

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
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`fixed left-0 top-16 bottom-0 w-60 bg-surface-container-low shadow-[4px_0_20px_rgba(0,0,0,0.3)] flex flex-col justify-between py-4 z-40 border-r border-surface-container transition-transform duration-200 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col gap-6 px-3 overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary font-bold mb-1">
              Main Menu
            </div>
            <nav className="flex flex-col gap-1">
              {mainNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-purple-glow font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-surface-container-highest text-secondary'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions (Manager & Staff Fast Triggers) */}
          <div>
            <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary font-bold mb-1 flex items-center justify-between">
              <span>Quick Actions</span>
              <span className="text-primary text-[10px]">1-Click</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  onOpenReceiptModal?.();
                  setMobileSidebarOpen?.(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors border border-surface-container"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-tertiary" />
                <span>+ Inbound Receipt</span>
              </button>

              <button
                onClick={() => {
                  onOpenDeliveryModal?.();
                  setMobileSidebarOpen?.(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors border border-surface-container"
              >
                <Truck className="w-3.5 h-3.5 text-primary-light" />
                <span>- Delivery Order</span>
              </button>

              <button
                onClick={() => {
                  onOpenTransferModal?.();
                  setMobileSidebarOpen?.(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors border border-surface-container"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-secondary" />
                <span>⇄ Internal Transfer</span>
              </button>

              <button
                onClick={() => {
                  onOpenAdjustmentModal?.();
                  setMobileSidebarOpen?.(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors border border-surface-container"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-error" />
                <span>± Stock Adjustment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom User Role Card */}
        <div className="px-3 pt-3 border-t border-surface-container">
          <div className="p-3 rounded-xl bg-surface-container flex items-center justify-between border border-surface-container">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-wider text-secondary font-bold">Active Role</span>
              <span className="text-xs font-bold text-on-surface capitalize">
                {user.role === 'manager' ? 'Inventory Manager' : 'Warehouse Staff'}
              </span>
            </div>
            <button
              onClick={() => switchRole(user.role === 'manager' ? 'staff' : 'manager')}
              className="px-2 py-1 rounded-md bg-primary-container/30 hover:bg-primary-container/50 text-primary-light text-[10px] font-bold border border-primary/30 transition-colors"
              title="Switch Role"
            >
              Switch
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
