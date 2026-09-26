import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  Truck,
  Trash2,
  Grid3X3,
  QrCode,
  PlusCircle,
  MoveUpRight,
  SlidersHorizontal,
  HardDrive
} from 'lucide-react';

export default function Sidebar({
  onOpenReceiptModal,
  onOpenTransferModal,
  onOpenAdjustmentModal,
  mobileSidebarOpen,
  setMobileSidebarOpen
}) {
  const {
    currentView,
    setCurrentView,
    pendingReceiptsCount,
    pendingDeliveriesCount,
    scheduledTransfersCount
  } = useInventory();

  const operationsLinks = [
    {
      id: 'receipts',
      label: 'Receipts',
      icon: ArrowDownLeft,
      badge: pendingReceiptsCount,
      targetView: 'operations',
      onClick: () => {
        setCurrentView('operations');
        setMobileSidebarOpen?.(false);
      }
    },
    {
      id: 'transfers',
      label: 'Internal Moves',
      icon: ArrowLeftRight,
      badge: scheduledTransfersCount,
      targetView: 'operations',
      onClick: () => {
        setCurrentView('operations');
        setMobileSidebarOpen?.(false);
      }
    },
    {
      id: 'deliveries',
      label: 'Delivery Orders',
      icon: Truck,
      badge: pendingDeliveriesCount,
      targetView: 'operations',
      onClick: () => {
        setCurrentView('operations');
        setMobileSidebarOpen?.(false);
      }
    },
    {
      id: 'adjustments',
      label: 'Scrap & Adjust',
      icon: Trash2,
      targetView: 'operations',
      onClick: () => {
        setCurrentView('operations');
        setMobileSidebarOpen?.(false);
      }
    },
  ];

  const topologyLinks = [
    {
      id: 'bins',
      label: 'Bins & Locations',
      icon: Grid3X3,
      onClick: () => {
        setCurrentView('warehouse');
        setMobileSidebarOpen?.(false);
      }
    },
    {
      id: 'lots',
      label: 'Lots & Serials',
      icon: QrCode,
      onClick: () => {
        setCurrentView('products');
        setMobileSidebarOpen?.(false);
      }
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen?.(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`fixed left-0 top-[124px] bottom-0 w-60 bg-surface-container-low shadow-[4px_0_20px_rgba(0,0,0,0.3)] flex flex-col justify-between py-4 z-40 border-r border-surface-container transition-transform duration-200 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col gap-1 px-3 overflow-y-auto">
          {/* Operations Scope Section */}
          <div className="px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-secondary font-bold flex items-center justify-between">
            <span>Operations Scope</span>
            <span className="text-[10px] text-primary font-semibold">Active</span>
          </div>

          <nav className="flex flex-col gap-1">
            {operationsLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentView === link.targetView;
              return (
                <button
                  key={link.id}
                  onClick={link.onClick}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold shadow-xs border border-primary/30'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Warehouse Topology Section */}
          <div className="mt-5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
            Warehouse Topology
          </div>

          <nav className="flex flex-col gap-1">
            {topologyLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentView === 'warehouse' && link.id === 'bins';
              return (
                <button
                  key={link.id}
                  onClick={link.onClick}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors ${
                    isActive ? 'bg-primary-container text-on-primary font-semibold border border-primary/30' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Action Shortcuts for Staff & Managers */}
          <div className="mt-4 pt-3 border-t border-surface-container px-1 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-secondary uppercase font-semibold px-2">Quick Forms</span>
            <button
              onClick={() => {
                onOpenReceiptModal();
                setMobileSidebarOpen?.(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-xs text-on-surface transition-colors border border-surface-container text-left shadow-2xs group"
            >
              <PlusCircle className="w-3.5 h-3.5 text-tertiary group-hover:scale-110 transition-transform" />
              <span>+ Draft Receipt</span>
            </button>
            <button
              onClick={() => {
                onOpenTransferModal();
                setMobileSidebarOpen?.(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-xs text-on-surface transition-colors border border-surface-container text-left shadow-2xs group"
            >
              <MoveUpRight className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span>+ Internal Move</span>
            </button>
            <button
              onClick={() => {
                onOpenAdjustmentModal();
                setMobileSidebarOpen?.(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-xs text-on-surface transition-colors border border-surface-container text-left shadow-2xs group"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-error group-hover:scale-110 transition-transform" />
              <span>+ Cycle Count</span>
            </button>
          </div>
        </div>

        {/* Main Store Capacity Meter */}
        <div className="px-4 py-3 bg-surface-container-lowest mx-3 rounded-xl shadow-xs border border-surface-container">
          <div className="flex items-center justify-between text-[11px] text-secondary mb-1">
            <span className="font-medium flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-secondary" /> Main Store Cap
            </span>
            <span className="font-mono font-bold text-on-surface">82.4%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
            <div className="w-[82.4%] h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"></div>
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-secondary">
            <span>4,120 / 5,000 Pallets</span>
            <span className="text-tertiary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
