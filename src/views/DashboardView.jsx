import React from 'react';
import ScenarioBanner from '../components/ScenarioBanner';
import KpiCards from '../components/KpiCards';
import FlowMap from '../components/FlowMap';
import OperationsTable from '../components/OperationsTable';
import RightColumnIntelligence from '../components/RightColumnIntelligence';
import { useInventory } from '../context/InventoryContext';
import { Layers, Warehouse, Cpu, Truck, Trash2 } from 'lucide-react';

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

      {/* 2. Top 5 Executive KPI Metric Cards with Animated Counter */}
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
