import React from 'react';
import ScenarioBanner from '../components/ScenarioBanner';
import KpiCards from '../components/KpiCards';
import FlowMap from '../components/FlowMap';
import OperationsTable from '../components/OperationsTable';
import RightColumnIntelligence from '../components/RightColumnIntelligence';
import { useInventory } from '../context/InventoryContext';
import {
  Layers,
  Warehouse,
  Cpu,
  Truck,
  Trash2,
  Plus,
  ArrowDownLeft,
  ArrowLeftRight,
  SlidersHorizontal,
  Zap
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
    isLiveStreamActive,
    setIsLiveStreamActive,
    simulateLiveEvent,
    triggerToast
  } = useInventory();

  // Multi-location breakdown counts
  const wh1StoreTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['wh1-store']) || 0), 0);
  const wh2ProdTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['wh2-prod']) || 0), 0);
  const stagingTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['wh1-staging']) || 0), 0);
  const scrapTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['virtual-scrap']) || 0), 3);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* 1. Official Odoo Scenario Walkthrough Banner */}
      <ScenarioBanner
        onOpenReceiptModal={onOpenReceiptModal}
        onOpenTransferModal={onOpenTransferModal}
        onOpenAdjustmentModal={onOpenAdjustmentModal}
      />

      {/* 2. Top 5 Executive KPI Metric Cards with Animated Counter */}
      <KpiCards />

      {/* 2.5 Manager Quick Action & Real-World Live Suite */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Quick Inflow & Outflow Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider font-mono mr-1 hidden sm:inline">
            Manager Actions:
          </span>

          <button
            onClick={onOpenNewProductModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all shadow-purple-glow active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>

          <button
            onClick={onOpenReceiptModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-tertiary-container/30 text-tertiary border border-tertiary/30 text-xs font-bold hover:bg-tertiary/20 transition-all active:scale-95"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>+ Inbound PO</span>
          </button>

          <button
            onClick={onOpenDeliveryModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-bold transition-all active:scale-95"
          >
            <Truck className="w-3.5 h-3.5 text-primary-light" />
            <span>- Dispatch</span>
          </button>

          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-semibold transition-all active:scale-95"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-secondary" />
            <span>⇄ Transfer</span>
          </button>

          <button
            onClick={onOpenAdjustmentModal}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-semibold transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-error" />
            <span>± Audit</span>
          </button>

          <button
            onClick={() => onOpenQuickRestockModal()}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Restock</span>
          </button>
        </div>

        {/* Right: Live Stream Real-Time Simulator */}
        <div className="flex items-center gap-2 pt-2 xl:pt-0 border-t xl:border-t-0 border-surface-container flex-wrap">
          {/* 1-Click Live Event Triggers */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => simulateLiveEvent('order')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-[11px] font-semibold border border-surface-container transition-all active:scale-95"
              title="Simulate immediate customer sales order"
            >
              ⚡ Live Order
            </button>
            <button
              onClick={() => simulateLiveEvent('receipt')}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-[11px] font-semibold border border-surface-container transition-all active:scale-95"
              title="Simulate immediate vendor delivery"
            >
              ⚡ Live Supply
            </button>
          </div>

          <div className="h-5 w-px bg-outline/20 hidden sm:block"></div>

          {/* Real-time background feed toggle */}
          <button
            onClick={() => {
              const next = !isLiveStreamActive;
              setIsLiveStreamActive(next);
              triggerToast(
                next 
                  ? '🟢 Live Stream Activated: Real-world customer orders & supply inflows will process in real-time!' 
                  : '⏸️ Live Stream Paused'
              );
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isLiveStreamActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-surface-container text-secondary border-surface-container hover:text-on-surface'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreamActive ? 'bg-emerald-400 animate-ping' : 'bg-secondary'}`}></span>
            <span className="font-mono text-[11px]">
              {isLiveStreamActive ? 'LIVE FEED: ON' : 'LIVE FEED: OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Main Split Layout (68% Left | 32% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Innovation 4.2: Odoo Double-Entry Visual Flow Map */}
          <FlowMap />

          {/* Operations Hub & Live Stock Moves Table */}
          <OperationsTable
            onOpenSlipModal={onOpenSlipModal}
            onOpenReceiptModal={onOpenReceiptModal}
            onOpenDeliveryModal={onOpenDeliveryModal}
            onOpenTransferModal={onOpenTransferModal}
            onOpenAdjustmentModal={onOpenAdjustmentModal}
          />

          {/* Multi-Location Breakdown Quick Matrix */}
          <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-surface-container text-secondary">
                  <Layers className="w-4 h-4 text-primary-light" />
                </div>
                <h4 className="font-headline text-sm font-bold text-on-surface">
                  Multi-Location Physical Matrix
                </h4>
              </div>
              <span className="font-mono text-xs text-secondary">4 Managed Physical &amp; Virtual Nodes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col border border-surface-container">
                <span className="font-mono text-[10px] text-secondary font-bold uppercase flex items-center gap-1">
                  <Warehouse className="w-3 h-3 text-primary-light" /> WH1: Main Store
                </span>
                <span className="font-mono text-base font-bold text-on-surface mt-1.5">
                  {wh1StoreTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-tertiary font-semibold mt-0.5">Rack A / Rack B</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col border border-surface-container">
                <span className="font-mono text-[10px] text-secondary font-bold uppercase flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-secondary" /> WH2: Production
                </span>
                <span className="font-mono text-base font-bold text-on-surface mt-1.5">
                  {wh2ProdTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-secondary font-semibold mt-0.5">Silo &amp; Active Racks</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col border border-surface-container">
                <span className="font-mono text-[10px] text-secondary font-bold uppercase flex items-center gap-1">
                  <Truck className="w-3 h-3 text-primary-light" /> Staging Area
                </span>
                <span className="font-mono text-base font-bold text-on-surface mt-1.5">
                  {stagingTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-primary-light font-semibold mt-0.5">Bay A03 Ready</span>
              </div>

              <div className="p-3 rounded-xl bg-error-container/15 flex flex-col border border-error-container/30">
                <span className="font-mono text-[10px] text-error font-bold uppercase flex items-center gap-1">
                  <Trash2 className="w-3 h-3 text-error" /> Virtual Scrap
                </span>
                <span className="font-mono text-base font-bold text-error mt-1.5">
                  {scrapTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-error font-semibold mt-0.5">Audit Disposed</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (lg:col-span-4) - Winning Innovations & AI Center */}
        <div className="lg:col-span-4">
          <RightColumnIntelligence />
        </div>
      </div>
    </div>
  );
}
