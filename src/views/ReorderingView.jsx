import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function ReorderingView() {
  const { products, generateDraftPO, triggerToast } = useInventory();

  const [simSpike, setSimSpike] = useState(25);
  const [simDelay, setSimDelay] = useState(2);

  // Perishable items for FEFO
  const perishables = products.filter(p => p.isPerishable);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>StockSense IMS</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Reordering &amp; Predictive Analytics</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            Predictive Reorder Rules &amp; AI Stress-Testing
          </h1>
          <p className="text-xs text-secondary mt-1">
            Replace static min/max thresholds with velocity-adjusted lead-time buffers and automated supplier PO drafting.
          </p>
        </div>

        <button
          onClick={() => {
            products.filter(p => p.totalStock <= p.minStock).forEach(p => {
              generateDraftPO(p.sku, 50);
            });
            triggerToast('Bulk Auto-Draft POs generated for all under-threshold items!');
          }}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Generate Bulk POs for Critical SKUs</span>
        </button>
      </div>

      {/* AI Stress-Test Simulator Controller */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-primary">psychology</span>
            <div>
              <h3 className="font-headline text-base font-bold text-on-surface">Global Supply Chain Stress-Test Simulator</h3>
              <p className="text-xs text-secondary">Dynamically simulate holiday surges, supplier strikes, or container delays</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-mono text-xs font-bold">
            Dynamic ROP Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Demand Surge Factor</span>
              <span className="font-mono text-sm font-bold text-primary">+{simSpike}%</span>
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
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h3 className="font-headline text-sm font-bold text-on-surface">Dynamic Reorder Thresholds (All SKUs)</h3>
          <span className="font-mono text-xs text-secondary">Formula: ROP = (Demand × Lead Time) + Safety Stock</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Product (SKU)</th>
                <th className="py-2.5 px-3 text-right">Base Daily Demand</th>
                <th className="py-2.5 px-3 text-right">Simulated Demand</th>
                <th className="py-2.5 px-3 text-right">Effective Lead Time</th>
                <th className="py-2.5 px-3 text-right">Static Min</th>
                <th className="py-2.5 px-3 text-right font-bold text-primary">Dynamic ROP</th>
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

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-primary">
                      {dynamicROP} {p.uom}
                    </td>

                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${isUnder ? 'text-error' : 'text-on-surface'}`}>
                      {p.totalStock} {p.uom}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        isUnder ? 'bg-error-container text-on-error-container' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isUnder ? 'CRITICAL DEFICIT' : 'SURPLUS'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {isUnder && (
                        <button
                          onClick={() => generateDraftPO(p.sku, 50)}
                          className="px-2.5 py-1 rounded bg-primary text-on-primary text-[11px] font-bold hover:bg-primary-container shadow-xs"
                        >
                          Draft PO (+50)
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FEFO Batch Expiry & Markdown Management */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-error">hourglass_bottom</span>
            <div>
              <h3 className="font-headline text-base font-bold text-on-surface">
                FEFO (First-Expired, First-Out) Perishable Intelligence
              </h3>
              <p className="text-xs text-secondary">Automated progressive markdowns salvage margin before spoilage</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-mono text-xs font-bold">
            Active Perishables: {perishables.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perishables.map(p => (
            <div key={p.sku} className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{p.name}</h4>
                  <div className="font-mono text-xs text-secondary">Batch: {p.batchNumber} • SKU: {p.sku}</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error font-mono text-xs font-bold">
                  Exp: {p.expDays} Days Left
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-xs bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container">
                <span>Stock On-Hand: <strong className="text-on-surface">{p.totalStock} {p.uom}</strong></span>
                <span className="text-error font-bold">25% Markdown Recommended</span>
              </div>

              <button
                onClick={() => triggerToast(`Dynamic 25% promotional markdown applied to ${p.name}!`)}
                className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">price_change</span>
                <span>Apply 25% Dynamic Markdown (₹{(p.sellingPrice * 0.75).toFixed(1)})</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
