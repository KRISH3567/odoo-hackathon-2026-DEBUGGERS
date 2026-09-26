import React from 'react';
import { useInventory } from '../context/InventoryContext';
import AnimatedCounter from './AnimatedCounter';
import {
  Package,
  AlertTriangle,
  Truck,
  TrendingUp,
  Boxes
} from 'lucide-react';

export default function KpiCards() {
  const {
    products,
    totalUnits,
    totalValuation,
    lowStockCount,
    pendingReceiptsCount,
    pendingDeliveriesCount,
    setCurrentView
  } = useInventory();

  const totalPending = pendingReceiptsCount + pendingDeliveriesCount;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Inventory Units */}
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
              {products.length} Managed SKUs
            </span>
            <span className="flex items-center gap-0.5 text-tertiary font-mono text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Valuation */}
      <div 
        onClick={() => setCurrentView('products')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border border-surface-container group"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold group-hover:text-tertiary transition-colors">
            Total Valuation
          </span>
          <div className="w-8 h-8 rounded-lg bg-tertiary-container/20 border border-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            ₹<AnimatedCounter value={totalValuation} />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono text-[11px] text-secondary">FIFO Continuous</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-tertiary-container/30 text-tertiary font-mono font-bold">
              INR Basis
            </span>
          </div>
        </div>
      </div>

      {/* 3. Low Stock Items */}
      <div 
        onClick={() => setCurrentView('products')}
        className={`p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border group ${
          lowStockCount > 0 ? 'border-error-container/50 hover:border-error/70' : 'border-surface-container'
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-error font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alert
          </span>
          <div className="w-8 h-8 rounded-lg bg-error-container/30 border border-error/30 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-error tracking-tight">
            <AnimatedCounter value={lowStockCount} suffix=" SKUs Low" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-secondary">
              {lowStockCount > 0 ? 'Below Safety Threshold' : 'All Stock Healthy'}
            </span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-error-container text-white font-mono text-[10px] uppercase font-bold">
                Restock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Pending Operations */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth hover:shadow-card-hover flex flex-col justify-between transition-all duration-200 cursor-pointer border border-surface-container group"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold group-hover:text-primary transition-colors">
            Pending Operations
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-center text-primary-light group-hover:scale-110 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            <AnimatedCounter value={totalPending} suffix=" Pending" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono text-[11px] text-tertiary">
              {pendingReceiptsCount} Inbound
            </span>
            <span className="font-mono text-[11px] text-primary-light">
              {pendingDeliveriesCount} Outbound
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
