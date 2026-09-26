import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  BrainCircuit,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ReorderingView() {
  const { products, generateDraftPO, triggerToast } = useInventory();

  const [simSpike, setSimSpike] = useState(25);
  const [simDelay, setSimDelay] = useState(2);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>StockSense IMS</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-on-surface font-semibold">Reordering &amp; Predictive Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              Predictive Reorder Rules &amp; AI Stress-Testing
            </h1>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-primary-container/30 text-primary-light font-bold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Velocity Adjusted
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Replaces static min/max thresholds with consumption-velocity and transit-latency buffers.
          </p>
        </div>

        <button
          onClick={() => {
            products.filter(p => p.totalStock <= p.minStock).forEach(p => {
              generateDraftPO(p.sku, 50);
            });
            triggerToast('Bulk Auto-Draft POs generated for all critical under-threshold items!');
          }}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all shadow-purple-glow"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Generate Bulk POs for Critical SKUs</span>
        </button>
      </div>

      {/* AI Stress-Test Simulator Controller */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary-container/20 text-primary border border-primary/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline text-base font-bold text-on-surface">Global Supply Chain Stress-Test Simulator</h3>
              <p className="text-xs text-secondary">Dynamically simulate holiday surges, supplier strikes, or container delays</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-primary-container/30 text-primary-light font-mono text-xs font-bold border border-primary/20">
            Dynamic ROP Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Demand Surge Factor</span>
              <span className="font-mono text-sm font-bold text-primary-light">+{simSpike}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={simSpike}
              onChange={(e) => setSimSpike(Number(e.target.value))}
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-[11px] text-secondary">
              Simulates elevated consumption rates across manufacturing and customer channels.
            </span>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Supplier Transit Delay</span>
              <span className="font-mono text-sm font-bold text-secondary">+{simDelay} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="21"
              value={simDelay}
              onChange={(e) => setSimDelay(Number(e.target.value))}
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <span className="text-[11px] text-secondary">
              Adds port congestion or logistics friction to standard supplier lead times.
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Products ROP Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card-depth overflow-hidden border border-surface-container">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h3 className="font-headline text-sm font-bold text-on-surface">Dynamic Reorder Thresholds (All SKUs)</h3>
          <span className="font-mono text-xs text-secondary">Formula: ROP = (Demand × Lead Time) + Safety Stock</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container">
                <th className="py-2.5 px-3">Product (SKU)</th>
                <th className="py-2.5 px-3 text-right">Base Demand</th>
                <th className="py-2.5 px-3 text-right">Simulated Demand</th>
                <th className="py-2.5 px-3 text-right">Effective Lead Time</th>
                <th className="py-2.5 px-3 text-right">Static Min</th>
                <th className="py-2.5 px-3 text-right font-bold text-primary-light">Dynamic ROP</th>
                <th className="py-2.5 px-3 text-right font-bold">On-Hand</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Auto Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {products.map(p => {
                const adjDemand = p.dailyDemand * (1 + simSpike / 100);
                const adjLeadTime = p.leadTimeDays + simDelay;
                const dynamicROP = Math.ceil((adjDemand * adjLeadTime) + p.safetyStock);
                const isUnder = p.totalStock <= dynamicROP;

                return (
                  <tr key={p.sku} className={`hover:bg-surface-container-low/60 transition-colors ${isUnder ? 'bg-error-container/10' : ''}`}>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-on-surface">{p.name}</div>
                      <div className="font-mono text-[10px] text-secondary">{p.sku}</div>
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-secondary">
                      {p.dailyDemand} {p.uom}/d
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-on-surface">
                      {adjDemand.toFixed(1)} {p.uom}/d
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-secondary">
                      {adjLeadTime} Days
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-secondary">
                      {p.minStock} {p.uom}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-primary-light">
                      {dynamicROP} {p.uom}
                    </td>

                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${isUnder ? 'text-error' : 'text-on-surface'}`}>
                      {p.totalStock} {p.uom}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        isUnder 
                          ? 'bg-error-container/30 text-error border-error/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {isUnder ? 'REORDER' : 'Nominal'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {isUnder ? (
                        <button
                          onClick={() => generateDraftPO(p.sku, 50)}
                          className="px-2.5 py-1 rounded bg-primary text-white font-mono text-[11px] font-bold hover:bg-primary-hover shadow-2xs"
                        >
                          Auto PO
                        </button>
                      ) : (
                        <span className="font-mono text-secondary text-[11px]">Safe</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
