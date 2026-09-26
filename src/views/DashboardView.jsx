import React, { useState } from 'react';
import KpiCards from '../components/KpiCards';
import { useInventory } from '../context/InventoryContext';
import {
  ArrowDownLeft,
  Truck,
  ArrowLeftRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Warehouse,
  Zap,
  ChevronRight,
} from 'lucide-react';

export default function DashboardView({
  onOpenNewProductModal,
  onOpenReceiptModal,
  onOpenDeliveryModal,
  onOpenTransferModal,
  onOpenAdjustmentModal: _onOpenAdjustmentModal,
  onOpenQuickRestockModal,
  onOpenSlipModal
}) {
  const {
    products,
    operations,
    user,
    setCurrentView,
    validateReceipt,
    validateTransfer,
    validateDelivery,
  } = useInventory();

  const [activityTab, setActivityTab] = useState('all'); // 'all' | 'receipt' | 'delivery' | 'transfer'

  // Critical low-stock items
  const lowStockProducts = products.filter(p => p.totalStock <= p.minStock);

  // Multi-location breakdown counts
  const wh1StoreTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['wh1-store']) || 0), 0);
  const wh2ProdTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['wh2-prod']) || 0), 0);
  const totalStockSum = (wh1StoreTotal + wh2ProdTotal) || 1;
  const wh1Percent = Math.round((wh1StoreTotal / totalStockSum) * 100);
  const wh2Percent = Math.round((wh2ProdTotal / totalStockSum) * 100);

  // Filtered recent activity
  const filteredOperations = operations
    .filter(op => {
      const matchTab = activityTab === 'all' || op.type === activityTab;
      const matchSearch = searchTerm === '' ||
        op.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.partner.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTab && matchSearch;
    })
    .slice(0, 7); // Show top 7 for a clean, digestible view

  const handleQuickValidate = (op) => {
    if (op.type === 'receipt') {
      validateReceipt(op.id);
    } else if (op.type === 'delivery') {
      validateDelivery(op.id);
    } else if (op.type === 'transfer') {
      validateTransfer(op.id);
    }
  };

  return (
    <div className="flex flex-col w-full gap-7 animate-in fade-in duration-300">
      {/* 1. Welcome & Greeting Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome, {user.name || 'Warehouse Team'}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time double-entry inventory console • All nodes operational
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenQuickRestockModal()}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>1-Click Fast Restock</span>
          </button>
        </div>
      </div>

      {/* 2. Core 4 Primary Action Cards (Clean, Big, Obvious) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receive Goods */}
        <div
          onClick={onOpenReceiptModal}
          className="group relative p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-slate-950/80 border border-purple-500/20 hover:border-purple-500/50 shadow-md hover:shadow-purple-500/10 cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              Inbound GRN
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Receive Goods
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              Log supplier shipment &amp; increase stock
            </p>
          </div>
        </div>

        {/* Deliver / Dispatch */}
        <div
          onClick={onOpenDeliveryModal}
          className="group relative p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-950/80 border border-blue-500/20 hover:border-blue-500/50 shadow-md hover:shadow-blue-500/10 cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              Outbound DO
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              Dispatch Order
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              Pick, pack &amp; deliver customer shipment
            </p>
          </div>
        </div>

        {/* Internal Transfer */}
        <div
          onClick={onOpenTransferModal}
          className="group relative p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/50 shadow-md hover:shadow-emerald-500/10 cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Internal Move
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Move Stock
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              Transfer between WH1 &amp; WH2 Silos
            </p>
          </div>
        </div>

        {/* Add Product SKU */}
        <div
          onClick={onOpenNewProductModal}
          className="group relative p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80 border border-indigo-500/20 hover:border-indigo-500/50 shadow-md hover:shadow-indigo-500/10 cursor-pointer transition-all duration-200 active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              New SKU
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-headline text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              + Add Product
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              Register item code, barcode &amp; safety stock
            </p>
          </div>
        </div>
      </div>

      {/* 3. Executive KPI Metric Cards */}
      <KpiCards />

      {/* 4. Main Two-Column Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Stock Movements Activity Stream (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-xl flex flex-col gap-4">
            {/* Header & Filter Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="font-headline text-base font-bold text-white">
                  Recent Stock Movements &amp; Activity
                </h3>
                <p className="text-xs text-slate-400">
                  Live double-entry transfers and warehouse dispatches
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'receipt', label: 'Inbound' },
                  { id: 'delivery', label: 'Outbound' },
                  { id: 'transfer', label: 'Internal' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActivityTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activityTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Operations List Items */}
            {filteredOperations.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-900/40 text-center flex flex-col items-center justify-center gap-2 border border-slate-800/60">
                <CheckCircle2 className="w-8 h-8 text-slate-500" />
                <span className="text-sm font-medium text-slate-300">No operations found in this category</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {filteredOperations.map(op => {
                  const isDone = op.status === 'done';
                  const isReceipt = op.type === 'receipt';
                  const isDelivery = op.type === 'delivery';

                  return (
                    <div
                      key={op.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          isReceipt
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                            : isDelivery
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isReceipt ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : isDelivery ? (
                            <Truck className="w-4 h-4" />
                          ) : (
                            <ArrowLeftRight className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                              {op.ref}
                            </span>
                            <span className="text-xs font-medium text-slate-300">
                              {op.productName}
                            </span>
                            <span className="font-mono text-xs font-bold text-purple-400">
                              {isReceipt ? '+' : isDelivery ? '-' : ''}{op.qty} {op.uom}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{op.partner}</span>
                            <span>•</span>
                            <span className="text-slate-500">{op.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border ${
                          isDone
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : op.status === 'ready'
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30 animate-pulse'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}>
                          {op.status}
                        </span>

                        {/* Action buttons */}
                        {isDone ? (
                          <button
                            onClick={() => onOpenSlipModal(op)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                            title="Print Official Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleQuickValidate(op)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Validate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setCurrentView('operations')}
              className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white text-center transition-all border border-slate-800 flex items-center justify-center gap-1.5 group"
            >
              <span>View All Operations &amp; Complete Move Ledger</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Column: Low Stock Center & Warehouse Balances (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Low Stock Watchlist */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-xl ${lowStockProducts.length > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {lowStockProducts.length > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <h3 className="font-headline text-sm font-bold text-white">Safety Stock Alerts</h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                lowStockProducts.length > 0 ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                {lowStockProducts.length} Items Below Min
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-5 rounded-xl bg-slate-900/40 text-center flex flex-col items-center justify-center gap-1.5 border border-slate-800/60 text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Inventory levels are healthy</span>
                <span className="text-[11px] text-slate-500">All items meet minimum safety thresholds</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {lowStockProducts.map(p => (
                  <div
                    key={p.sku}
                    className="p-3 rounded-xl bg-slate-900/60 border border-rose-500/20 hover:border-rose-500/40 transition-colors flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-100">{p.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {p.totalStock} / {p.minStock} {p.uom}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {p.supplier}
                      </span>
                      <button
                        onClick={() => onOpenQuickRestockModal(p.sku)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setCurrentView('products')}
              className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white text-center transition-colors border border-slate-800"
            >
              Browse All {products.length} Products →
            </button>
          </div>

          {/* Warehouse Distribution & Digital Twin Link */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Warehouse className="w-4 h-4" />
                </div>
                <h3 className="font-headline text-sm font-bold text-white">Warehouse Capacity</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">2 Hubs Live</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* WH1 */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">WH1: Central Warehouse</span>
                  <span className="font-mono font-bold text-purple-300">{wh1StoreTotal.toLocaleString()} units</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${wh1Percent}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 flex justify-between">
                  <span>Rack A/B Main Store</span>
                  <span>{wh1Percent}% capacity</span>
                </span>
              </div>

              {/* WH2 */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">WH2: Manufacturing Plant</span>
                  <span className="font-mono font-bold text-emerald-400">{wh2ProdTotal.toLocaleString()} units</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${wh2Percent}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 flex justify-between">
                  <span>Production Silo Floor</span>
                  <span>{wh2Percent}% capacity</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('warehouse')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-xs font-bold text-purple-300 hover:text-white flex items-center justify-center gap-2 transition-all border border-purple-500/30"
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Launch 2D Digital Twin Schematic →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
