import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function WarehouseView() {
  const { locations, products } = useInventory();

  // Compute total items per location
  const getLocationStock = (locKey) => {
    return products.reduce((acc, p) => acc + ((p.locations && p.locations[locKey]) || 0), 0);
  };

  const wh1Store = getLocationStock('wh1-store');
  const wh2Prod = getLocationStock('wh2-prod');
  const wh1Staging = getLocationStock('wh1-staging');
  const wh1Cold = getLocationStock('wh1-cold');
  const scrap = getLocationStock('virtual-scrap');

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>StockSense IMS</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Warehouse Topology</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            Multi-Warehouse Topology &amp; Physical Bins
          </h1>
          <p className="text-xs text-secondary mt-1">
            Visual map of physical facilities, aisles, storage racks, cold chain bins, and double-entry virtual partner nodes.
          </p>
        </div>
      </div>

      {/* WH1 Central Warehouse Facility Card */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">warehouse</span>
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">WH1: Central Distribution Warehouse</h2>
              <p className="text-xs text-secondary">Mumbai Industrial Corridor • Facility Area: 45,000 sq.ft</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
            Operational • Normal Load
          </span>
        </div>

        {/* Storage Bins inside WH1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Main Store */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">Main Store (Rack A/B)</span>
                <h3 className="font-bold text-base text-on-surface mt-0.5">Heavy Pallet Racks</h3>
              </div>
              <span className="p-1.5 rounded-lg bg-surface-container text-primary">
                <span className="material-symbols-outlined text-[20px]">shelves</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-2xl font-bold text-primary">{wh1Store.toLocaleString()} Units</span>
              <span className="font-mono text-xs text-secondary">Cap: 2,000</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (wh1Store / 2000) * 100)}%` }}></div>
            </div>
          </div>

          {/* Staging Bay A03 */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">Staging Bay A03</span>
                <h3 className="font-bold text-base text-on-surface mt-0.5">Outbound Dispatch Staging</h3>
              </div>
              <span className="p-1.5 rounded-lg bg-surface-container text-secondary">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-2xl font-bold text-on-surface">{wh1Staging.toLocaleString()} Units</span>
              <span className="font-mono text-xs text-secondary">Cap: 500</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
              <div className="bg-secondary-fixed h-full rounded-full" style={{ width: `${Math.min(100, (wh1Staging / 500) * 100)}%` }}></div>
            </div>
          </div>

          {/* Cold Storage */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">Cold Storage Bin 01</span>
                <h3 className="font-bold text-base text-on-surface mt-0.5">Perishable Climate Silo</h3>
              </div>
              <span className="p-1.5 rounded-lg bg-surface-container text-tertiary">
                <span className="material-symbols-outlined text-[20px]">ac_unit</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-2xl font-bold text-tertiary">{wh1Cold.toLocaleString()} Packs</span>
              <span className="font-mono text-xs text-secondary">4°C • Cap: 400</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
              <div className="bg-tertiary-fixed h-full rounded-full" style={{ width: `${Math.min(100, (wh1Cold / 400) * 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* WH2 Manufacturing Plant Facility Card */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">precision_manufacturing</span>
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">WH2: Manufacturing Plant &amp; Assembly Silo</h2>
              <p className="text-xs text-secondary">Pune Industrial Estate • Active CNC &amp; Fabrication lines</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-bold">
            Assembly Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Production Floor */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-secondary font-bold uppercase">Production Floor Bins</span>
                <h3 className="font-bold text-base text-on-surface mt-0.5">WIP Fabrication Racks</h3>
              </div>
              <span className="material-symbols-outlined text-[20px] text-secondary">construction</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-2xl font-bold text-on-surface">{wh2Prod.toLocaleString()} WIP Units</span>
              <span className="font-mono text-xs text-secondary">Cap: 1,500</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
              <div className="bg-secondary-fixed h-full rounded-full" style={{ width: `${Math.min(100, (wh2Prod / 1500) * 100)}%` }}></div>
            </div>
          </div>

          {/* Virtual Scrap & Loss Branch */}
          <div className="p-4 rounded-xl bg-error-container/20 border border-error-container/40 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] text-error font-bold uppercase">Virtual Scrap &amp; Loss Node</span>
                <h3 className="font-bold text-base text-error mt-0.5">Audit Disposed Inventory</h3>
              </div>
              <span className="material-symbols-outlined text-[20px] text-error">delete_forever</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-headline text-2xl font-bold text-error">{scrap} Units</span>
              <span className="font-mono text-xs text-secondary">Immutable Audit Log</span>
            </div>
            <span className="text-[11px] text-secondary">
              Zero loss in double-entry balance: all scrap debits partner virtual loss node.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
