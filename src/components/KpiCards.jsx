import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function KpiCards() {
  const {
    totalUnits,
    totalValuation,
    lowStockCount,
    pendingReceiptsCount,
    pendingDeliveriesCount,
    scheduledTransfersCount,
    setCurrentView
  } = useInventory();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. Total Products in Stock */}
      <div 
        onClick={() => setCurrentView('products')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-surface-container"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
            Total Products in Stock
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-xl font-bold text-on-surface tracking-tight" id="kpiTotalUnits">
            {totalUnits.toLocaleString()} Units
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[11px] text-secondary">
              Valuation: ₹{totalValuation.toLocaleString()}
            </span>
            <span className="flex items-center text-tertiary font-mono text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +4.2%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Low / Out of Stock */}
      <div 
        onClick={() => setCurrentView('products')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-error-container/40"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-error font-bold">
            Low / Out of Stock
          </span>
          <div className="w-8 h-8 rounded-lg bg-error-container/30 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-xl font-bold text-error tracking-tight">
            {lowStockCount} SKUs Critical
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-secondary truncate" title="Wireless Mouse (8 units), Motor Oil">
              Mouse (8L), Oil (12L)
            </span>
            <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-mono text-[10px] uppercase font-bold">
              PO Req
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pending Receipts */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-surface-container"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
            Pending Receipts
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">move_to_inbox</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-xl font-bold text-on-surface tracking-tight">
            {pendingReceiptsCount} Incoming
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[11px] text-secondary">Awaiting Arrival</span>
            <span className="font-mono text-[11px] text-tertiary font-medium">Ready for Dock</span>
          </div>
        </div>
      </div>

      {/* 4. Pending Deliveries */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-surface-container"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
            Pending Deliveries
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-xl font-bold text-on-surface tracking-tight">
            {pendingDeliveriesCount} Outgoing Orders
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[11px] text-secondary">Across Active Clients</span>
            <span className="font-mono text-[11px] text-primary font-medium">Pick & Pack</span>
          </div>
        </div>
      </div>

      {/* 5. Internal Transfers Scheduled */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-surface-container"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
            Internal Transfers
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-xl font-bold text-on-surface tracking-tight">
            {scheduledTransfersCount} Scheduled
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[11px] text-secondary">Main → Prod Silo</span>
            <span className="font-mono text-[11px] text-secondary font-medium">Zero Stock Loss</span>
          </div>
        </div>
      </div>
    </section>
  );
}
