import React from 'react';
import { useInventory } from '../context/InventoryContext';
import OperationsTable from '../components/OperationsTable';
import {
  ArrowDownLeft,
  Truck,
  ArrowLeftRight,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export default function OperationsView({
  onOpenReceiptModal,
  onOpenDeliveryModal,
  onOpenTransferModal,
  onOpenAdjustmentModal,
  onOpenSlipModal
}) {
  const { pendingReceiptsCount, pendingDeliveriesCount, scheduledTransfersCount } = useInventory();

  return (
    <div className="flex flex-col w-full gap-6 animate-in fade-in duration-300">
      {/* Top Header & Fast Action Suite */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Operations &amp; Stock Movements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Execute double-entry receipts, dispatches, warehouse transfers and physical count audits
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onOpenReceiptModal}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Receive Stock</span>
          </button>

          <button
            onClick={onOpenDeliveryModal}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Truck className="w-4 h-4" />
            <span>+ Ship Order</span>
          </button>

          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            <span>Transfer</span>
          </button>

          <button
            onClick={onOpenAdjustmentModal}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-400" />
            <span>Cycle Count</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Incoming Vendor Shipments</span>
            <span className="font-headline text-3xl font-extrabold text-white mt-1">{pendingReceiptsCount}</span>
            <span className="text-xs text-purple-400 font-medium mt-0.5">Ready for Receiving Dock</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Pending Customer Deliveries</span>
            <span className="font-headline text-3xl font-extrabold text-white mt-1">{pendingDeliveriesCount}</span>
            <span className="text-xs text-blue-400 font-medium mt-0.5">Pick &amp; Pack Verification</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Scheduled Internal Moves</span>
            <span className="font-headline text-3xl font-extrabold text-white mt-1">{scheduledTransfersCount}</span>
            <span className="text-xs text-emerald-400 font-medium mt-0.5">Zero Delta Balance</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Operations Master Table */}
      <OperationsTable
        onOpenSlipModal={onOpenSlipModal}
      />
    </div>
  );
}
