import React from 'react';
import { useInventory } from '../context/InventoryContext';
import AnimatedCounter from './AnimatedCounter';
import {
  Package,
  AlertTriangle,
  ArrowDownLeft,
  Truck,
  ArrowLeftRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Products in Stock */}
      <div 
        onClick={() => setCurrentView('products')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border border-surface-container group"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold group-hover:text-primary transition-colors">
            Total Inventory Units
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-on-surface tracking-tight" id="kpiTotalUnits">
            <AnimatedCounter value={totalUnits} suffix=" Units" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono text-[11px] text-secondary">
              Valuation: ₹<AnimatedCounter value={totalValuation} />
            </span>
            <span className="flex items-center gap-0.5 text-tertiary font-mono text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" /> +4.2%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Low / Out of Stock */}
      <div 
        onClick={() => setCurrentView('products')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border border-error-container/40 group hover:border-error/60"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-error font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Low / Out of Stock
          </span>
          <div className="w-8 h-8 rounded-lg bg-error-container/30 border border-error/30 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-error tracking-tight">
            <AnimatedCounter value={lowStockCount} suffix=" SKUs Critical" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-secondary truncate max-w-[120px]" title="Mouse (8 units), Oil (80L)">
              Mouse (8u), Oil
            </span>
            <span className="px-1.5 py-0.5 rounded bg-error-container text-white font-mono text-[10px] uppercase font-bold">
              PO Needed
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pending Receipts */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border border-surface-container group"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold group-hover:text-tertiary transition-colors">
            Pending Receipts
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            <AnimatedCounter value={pendingReceiptsCount} suffix=" Inbound" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono text-[11px] text-secondary">Awaiting Arrival</span>
            <span className="font-mono text-[11px] text-tertiary font-medium">Ready for Dock</span>
          </div>
        </div>
      </div>

      {/* 4. Pending Deliveries */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border border-surface-container group"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold group-hover:text-primary transition-colors">
            Pending Deliveries
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-center text-primary-light group-hover:scale-110 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            <AnimatedCounter value={pendingDeliveriesCount} suffix=" Outbound" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono text-[11px] text-secondary">Active Dispatch</span>
            <span className="font-mono text-[11px] text-primary font-medium">Pick &amp; Pack</span>
          </div>
        </div>
      </div>

      {/* 5. Internal Transfers Scheduled */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border border-surface-container group"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold group-hover:text-on-surface transition-colors">
            Internal Transfers
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            <AnimatedCounter value={scheduledTransfersCount} suffix=" Moves" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono text-[11px] text-secondary">Main → Prod Silo</span>
            <span className="font-mono text-[11px] text-tertiary font-semibold flex items-center gap-1">
              <FileCheck className="w-3 h-3" /> Balanced
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
