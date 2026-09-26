import React from 'react';
import ScenarioBanner from '../components/ScenarioBanner';
import KpiCards from '../components/KpiCards';
import FlowMap from '../components/FlowMap';
import OperationsTable from '../components/OperationsTable';
import RightColumnIntelligence from '../components/RightColumnIntelligence';
import { useInventory } from '../context/InventoryContext';

export default function DashboardView({
  onOpenReceiptModal,
  onOpenTransferModal,
  onOpenAdjustmentModal,
  onOpenSlipModal
}) {
  const { products } = useInventory();

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

      {/* 2. Top 5 Executive KPI Metric Cards */}
      <KpiCards />

      {/* 3. Main Split Layout (68% Left | 32% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Innovation 4.2: Odoo Double-Entry Visual Flow Map */}
          <FlowMap />

          {/* Operations Hub & Live Stock Moves Table */}
          <OperationsTable onOpenSlipModal={onOpenSlipModal} />

          {/* Multi-Location Breakdown Quick Matrix */}
          <section className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">layers</span>
                <h4 className="font-headline text-sm font-bold text-on-surface">
                  Multi-Location Breakdown Snapshot
                </h4>
              </div>
              <span className="font-mono text-xs text-secondary">4 Managed Locations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col border border-surface-container">
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">WH1: Main Store</span>
                <span className="font-mono text-base font-bold text-on-surface mt-1">
                  {wh1StoreTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-tertiary font-semibold">Rack A / Rack B</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col border border-surface-container">
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">WH2: Production Floor</span>
                <span className="font-mono text-base font-bold text-on-surface mt-1">
                  {wh2ProdTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-secondary font-semibold">Silo &amp; Active Racks</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col border border-surface-container">
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">Staging Bay A03</span>
                <span className="font-mono text-base font-bold text-on-surface mt-1">
                  {stagingTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-primary font-semibold">Pre-Dispatch Ready</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col border border-surface-container">
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">Virtual Scrap / Damage</span>
                <span className="font-mono text-base font-bold text-error mt-1">
                  {scrapTotal.toLocaleString()} Units
                </span>
                <span className="font-mono text-[11px] text-error font-semibold">Audit Disposed</span>
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
