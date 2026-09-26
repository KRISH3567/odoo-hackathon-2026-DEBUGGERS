import React from 'react';
import { useInventory } from '../context/InventoryContext';
import AnimatedCounter from './AnimatedCounter';
import {
  Package,
  AlertTriangle,
  Boxes,
  Truck,
  ArrowUpRight,
  Sparkles
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Stock Units */}
      <div 
        onClick={() => setCurrentView('products')}
        className="group relative p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
            Total Inventory Units
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="font-headline text-3xl font-extrabold text-white tracking-tight">
            <AnimatedCounter value={totalUnits} />
            <span className="text-sm font-medium text-slate-400 ml-1.5 font-sans">units</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">
              {products.length} active catalog SKUs
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Valuation */}
      <div 
        onClick={() => setCurrentView('products')}
        className="group relative p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
            Inventory Valuation
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Boxes className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="font-headline text-3xl font-extrabold text-white tracking-tight flex items-baseline">
            <span className="text-xl font-bold text-emerald-400 mr-1">₹</span>
            <AnimatedCounter value={totalValuation} />
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">FIFO Continuous Accounting</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              INR Asset
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pending Operations */}
      <div 
        onClick={() => setCurrentView('operations')}
        className="group relative p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
            Pending Operations
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4">
          <div className="font-headline text-3xl font-extrabold text-white tracking-tight">
            <AnimatedCounter value={totalPending} />
            <span className="text-sm font-medium text-slate-400 ml-1.5 font-sans">orders</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">
              {pendingReceiptsCount} in • {pendingDeliveriesCount} out
            </span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
        </div>
      </div>

      {/* 4. Safety Stock Health */}
      <div 
        onClick={() => setCurrentView('products')}
        className={`group relative p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
          lowStockCount > 0
            ? 'border-rose-500/30 hover:border-rose-500/50 shadow-lg shadow-rose-500/5'
            : 'border-slate-800/80 hover:border-emerald-500/40 shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${lowStockCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
            Safety Stock Alert
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
            lowStockCount > 0
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
          }`}>
            {lowStockCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
        </div>

        <div className="mt-4">
          <div className={`font-headline text-3xl font-extrabold tracking-tight ${
            lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            <AnimatedCounter value={lowStockCount} />
            <span className="text-sm font-medium text-slate-400 ml-1.5 font-sans">critical</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">
              {lowStockCount > 0 ? 'Items below reorder point' : 'All thresholds optimal'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              lowStockCount > 0
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                : 'text-emerald-400 bg-emerald-500/10'
            }`}>
              {lowStockCount > 0 ? 'Urgent' : 'Safe'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
