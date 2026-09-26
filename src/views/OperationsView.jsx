import React from 'react';
import { useInventory } from '../context/InventoryContext';
import OperationsTable from '../components/OperationsTable';
import {
  ArrowDownLeft,
  Truck,
  ArrowLeftRight,
  SlidersHorizontal,
  ChevronRight,
  PlusCircle
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
    <div className="flex flex-col w-full gap-6">
      {/* Top Header & Fast Action Suite */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>StockSense IMS</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-on-surface font-semibold">Warehouse Operations Hub</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            Warehouse Operations &amp; Stock Movements
          </h1>
          <p className="text-xs text-secondary mt-1">
            Execute double-entry vendor receipts, customer deliveries, bin transfers, and physical cycle counts.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={onOpenReceiptModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-tertiary text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Receipt</span>
          </button>

          <button
            onClick={onOpenDeliveryModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
          >
            <Truck className="w-4 h-4" />
            <span>New Delivery</span>
          </button>

          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-colors border border-surface-container shadow-2xs"
          >
            <ArrowLeftRight className="w-4 h-4 text-primary-light" />
            <span>Internal Move</span>
          </button>

          <button
            onClick={onOpenAdjustmentModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors border border-surface-container shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-error" />
            <span>Cycle Count</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] text-secondary font-bold uppercase">Pending Vendor Receipts</span>
            <span className="font-headline text-2xl font-bold text-on-surface mt-1">{pendingReceiptsCount} Shipments</span>
            <span className="text-xs text-tertiary font-semibold mt-0.5">Ready for Receiving Dock</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/20 text-tertiary flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] text-secondary font-bold uppercase">Pending Customer Deliveries</span>
            <span className="font-headline text-2xl font-bold text-on-surface mt-1">{pendingDeliveriesCount} Orders</span>
            <span className="text-xs text-primary-light font-semibold mt-0.5">Pick &amp; Pack Verification</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/20 text-primary-light flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] text-secondary font-bold uppercase">Scheduled Internal Moves</span>
            <span className="font-headline text-2xl font-bold text-on-surface mt-1">{scheduledTransfersCount} Transfers</span>
            <span className="text-xs text-secondary font-semibold mt-0.5">Zero Delta Balance</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container border border-surface-container text-secondary flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Operations Master Table */}
      <OperationsTable onOpenSlipModal={onOpenSlipModal} />
    </div>
  );
}
