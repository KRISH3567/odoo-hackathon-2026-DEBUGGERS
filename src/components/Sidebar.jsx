import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function Sidebar({ onOpenReceiptModal, onOpenTransferModal, onOpenAdjustmentModal }) {
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
      icon: 'move_to_inbox',
      badge: pendingReceiptsCount,
      targetView: 'operations',
      filter: 'receipt',
      onClick: () => setCurrentView('operations')
    },
    {
      id: 'transfers',
      label: 'Internal Moves',
      icon: 'swap_horiz',
      badge: scheduledTransfersCount,
      targetView: 'operations',
      filter: 'transfer',
      onClick: () => setCurrentView('operations')
    },
    {
      id: 'deliveries',
      label: 'Delivery Orders',
      icon: 'local_shipping',
      badge: pendingDeliveriesCount,
      targetView: 'operations',
      filter: 'delivery',
      onClick: () => setCurrentView('operations')
    },
    {
      id: 'adjustments',
      label: 'Scrap & Adjust',
      icon: 'delete_forever',
      targetView: 'operations',
      filter: 'adjustment',
      onClick: () => setCurrentView('operations')
    },
  ];

  const topologyLinks = [
    {
      id: 'bins',
      label: 'Bins & Locations',
      icon: 'grid_view',
      onClick: () => setCurrentView('warehouse')
    },
    {
      id: 'lots',
      label: 'Lots & Serials',
      icon: 'qr_code_2',
      onClick: () => setCurrentView('products')
    },
  ];

  return (
    <aside className="fixed left-0 top-[124px] bottom-0 w-60 bg-surface-container-low shadow-[1px_0_8px_rgba(0,0,0,0.02)] flex flex-col justify-between py-4 z-40 border-r border-surface-container">
      <div className="flex flex-col gap-1 px-3">
        {/* Operations Scope Section */}
        <div className="px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
          Operations Scope
        </div>
        <nav className="flex flex-col gap-1">
          {operationsLinks.map(link => {
            const isActive = currentView === link.targetView;
            return (
              <button
                key={link.id}
                onClick={link.onClick}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                  <span>{link.label}</span>
                </span>
                {link.badge !== undefined && (
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
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
          {topologyLinks.map(link => (
            <button
              key={link.id}
              onClick={link.onClick}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors ${
                currentView === 'warehouse' && link.id === 'bins' ? 'bg-primary-container text-on-primary font-semibold' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Action Shortcuts for Staff/Managers */}
        <div className="mt-4 pt-3 border-t border-surface-container px-1 flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-secondary uppercase font-semibold px-2">Quick Forms</span>
          <button
            onClick={onOpenReceiptModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-surface-container-lowest hover:bg-surface-bright text-xs text-on-surface transition-colors shadow-2xs text-left"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">add_box</span>
            <span>+ Draft Receipt</span>
          </button>
          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-surface-container-lowest hover:bg-surface-bright text-xs text-on-surface transition-colors shadow-2xs text-left"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">move_up</span>
            <span>+ Internal Move</span>
          </button>
          <button
            onClick={onOpenAdjustmentModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-surface-container-lowest hover:bg-surface-bright text-xs text-on-surface transition-colors shadow-2xs text-left"
          >
            <span className="material-symbols-outlined text-[16px] text-error">tune</span>
            <span>+ Cycle Count</span>
          </button>
        </div>
      </div>

      {/* Main Store Capacity Meter */}
      <div className="px-4 py-3 bg-surface-container-lowest mx-3 rounded-xl shadow-xs border border-surface-container">
        <div className="flex items-center justify-between text-[11px] text-secondary mb-1">
          <span className="font-medium">Main Store Capacity</span>
          <span className="font-mono font-bold text-on-surface">82.4%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
          <div className="w-[82.4%] h-full bg-primary-container rounded-full transition-all duration-500"></div>
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-secondary">
          <span>4,120 / 5,000 Pallets</span>
          <span className="text-tertiary font-semibold">Active</span>
        </div>
      </div>
    </aside>
  );
}
