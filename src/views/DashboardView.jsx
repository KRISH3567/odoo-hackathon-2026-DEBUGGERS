import React from 'react';
import KpiCards from '../components/KpiCards';
import OperationsTable from '../components/OperationsTable';
import { useInventory } from '../context/InventoryContext';
import {
  Plus,
  ArrowDownLeft,
  Truck,
  ArrowLeftRight,
  SlidersHorizontal,
  Zap,
  Warehouse,
  AlertTriangle,
  Package,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function DashboardView({
  onOpenNewProductModal,
  onOpenReceiptModal,
  onOpenDeliveryModal,
  onOpenTransferModal,
  onOpenAdjustmentModal,
  onOpenQuickRestockModal,
  onOpenSlipModal
}) {
  const {
    products,
    generateDraftPO,
    setCurrentView
  } = useInventory();

  // Multi-location breakdown counts
  const wh1StoreTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['wh1-store']) || 0), 0);
  const wh2ProdTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['wh2-prod']) || 0), 0);

  // Critical low-stock items
  const lowStockProducts = products.filter(p => p.totalStock <= p.minStock);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* 1. Executive KPI Cards */}
      <KpiCards />

      {/* 2. Manager Fast-Action Operations Toolbar */}
      <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider font-mono mr-1 hidden sm:inline">
            Fast Actions:
          </span>

          <button
            onClick={onOpenNewProductModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all shadow-purple-glow active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>

          <button
            onClick={onOpenReceiptModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-tertiary-container/30 text-tertiary border border-tertiary/30 text-xs font-bold hover:bg-tertiary/20 transition-all active:scale-95"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>+ Inbound Receipt</span>
          </button>

          <button
            onClick={onOpenDeliveryModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-bold transition-all active:scale-95"
          >
            <Truck className="w-3.5 h-3.5 text-primary-light" />
            <span>- Delivery Order</span>
          </button>

          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-semibold transition-all active:scale-95"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-secondary" />
            <span>⇄ Internal Transfer</span>
          </button>

          <button
            onClick={onOpenAdjustmentModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-semibold transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-error" />
            <span>± Stock Adjustment</span>
          </button>
        </div>

        <button
          onClick={() => onOpenQuickRestockModal()}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-all active:scale-95 shrink-0"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>1-Click Restock</span>
        </button>
      </div>

      {/* 3. Main Operational Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Operations Hub Table (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <OperationsTable
            onOpenSlipModal={onOpenSlipModal}
            onOpenReceiptModal={onOpenReceiptModal}
            onOpenDeliveryModal={onOpenDeliveryModal}
            onOpenTransferModal={onOpenTransferModal}
            onOpenAdjustmentModal={onOpenAdjustmentModal}
          />
        </div>

        {/* Right: Low Stock Watchlist & Warehouse Balance (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Low Stock Watchlist */}
          <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-error-container/20 text-error border border-error/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-headline text-sm font-bold text-on-surface">Low Stock Watchlist</h3>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-error-container/30 text-error font-bold border border-error/30">
                {lowStockProducts.length} Items Critical
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-4 rounded-lg bg-surface-container-low text-center flex flex-col items-center justify-center gap-1.5 text-secondary border border-surface-container">
                <CheckCircle2 className="w-6 h-6 text-tertiary" />
                <span className="text-xs font-medium text-on-surface">All items above reorder thresholds</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {lowStockProducts.map(p => (
                  <div
                    key={p.sku}
                    className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2 border border-surface-container hover:border-error/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">{p.name}</span>
                        <span className="font-mono text-[10px] text-primary-light font-semibold">{p.sku}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-error bg-error-container/20 px-2 py-0.5 rounded border border-error/30">
                        {p.totalStock} / {p.minStock} {p.uom}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-surface-container">
                      <span className="text-[10px] text-secondary">
                        Supplier: {p.supplier}
                      </span>
                      <button
                        onClick={() => onOpenQuickRestockModal(p.sku)}
                        className="px-2.5 py-1 rounded bg-primary text-white text-[11px] font-bold hover:bg-primary-hover transition-colors shadow-2xs flex items-center gap-1"
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
              className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-secondary hover:text-on-surface text-center transition-colors border border-surface-container"
            >
              View Full Catalog ({products.length} SKUs) →
            </button>
          </section>

          {/* Warehouse Storage Distribution */}
          <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-primary-container/20 text-primary border border-primary/20">
                  <Warehouse className="w-4 h-4" />
                </div>
                <h3 className="font-headline text-sm font-bold text-on-surface">Warehouse Balances</h3>
              </div>
              <span className="font-mono text-[10px] text-secondary">2 Locations</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">WH1: Central Store</span>
                  <span className="text-[10px] text-secondary">Rack A / Rack B Main Storage</span>
                </div>
                <span className="font-mono text-base font-bold text-primary-light">
                  {wh1StoreTotal.toLocaleString()} Units
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">WH2: Manufacturing Plant</span>
                  <span className="text-[10px] text-secondary">Production Floor Silo</span>
                </div>
                <span className="font-mono text-base font-bold text-tertiary">
                  {wh2ProdTotal.toLocaleString()} Units
                </span>
              </div>
            </div>

            <button
              onClick={onOpenTransferModal}
              className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors border border-surface-container"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-secondary" />
              <span>Transfer Between Warehouses</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
