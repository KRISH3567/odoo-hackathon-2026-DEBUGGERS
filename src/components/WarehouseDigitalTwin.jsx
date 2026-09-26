import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Warehouse,
  Boxes,
  Truck,
  Snowflake,
  Factory,
  ArrowRight,
  PlusCircle,
  ArrowLeftRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function WarehouseDigitalTwin({
  onOpenReceiptModal,
  onOpenTransferModal,
  onOpenQuickRestockModal
}) {
  const { products } = useInventory();
  const [selectedBay, setSelectedBay] = useState(null);

  // Compute live quantities and items per physical zone
  const getZoneData = (locKey) => {
    const itemsInZone = products.filter(p => (p.locations?.[locKey] || 0) > 0);
    const totalUnits = itemsInZone.reduce((acc, p) => acc + (p.locations?.[locKey] || 0), 0);
    return { items: itemsInZone, totalUnits };
  };

  const wh1Store = getZoneData('wh1-store');
  const wh1Staging = getZoneData('wh1-staging');
  const wh1Cold = getZoneData('wh1-cold');
  const wh2Prod = getZoneData('wh2-prod');
  const wh2Silo = getZoneData('wh2-silo');
  const virtualScrap = getZoneData('virtual-scrap');

  // Bay capacities for realistic % calculation
  const bays = [
    {
      id: 'wh1-store',
      zone: 'WH1 Main Hub',
      code: 'RACK-A1/B2',
      name: 'Central Pallet Racks',
      description: 'Heavy steel, coils, ball bearings & raw stock',
      icon: Boxes,
      capacity: 2000,
      current: wh1Store.totalUnits,
      items: wh1Store.items,
      type: 'ambient'
    },
    {
      id: 'wh1-staging',
      zone: 'WH1 Main Hub',
      code: 'BAY-STG-03',
      name: 'Outbound Dispatch Bay',
      description: 'Picked goods queued for courier & customer transit',
      icon: Truck,
      capacity: 500,
      current: wh1Staging.totalUnits,
      items: wh1Staging.items,
      type: 'dispatch'
    },
    {
      id: 'wh1-cold',
      zone: 'WH1 Main Hub',
      code: 'COLD-SILO-01',
      name: 'Cold Storage Vault (4°C)',
      description: 'Temperature-monitored bin for dairy, ghee & perishables',
      icon: Snowflake,
      capacity: 400,
      current: wh1Cold.totalUnits,
      items: wh1Cold.items,
      type: 'cold'
    },
    {
      id: 'wh2-prod',
      zone: 'WH2 Pune Plant',
      code: 'LINE-FAB-01',
      name: 'CNC & Assembly Floor',
      description: 'Active production line buffer & work-in-progress',
      icon: Factory,
      capacity: 1000,
      current: wh2Prod.totalUnits,
      items: wh2Prod.items,
      type: 'manufacturing'
    },
    {
      id: 'wh2-silo',
      zone: 'WH2 Pune Plant',
      code: 'SILO-TANK-04',
      name: 'Bulk Fluid Silo',
      description: 'Hydraulic lubricants and industrial consumables',
      icon: Boxes,
      capacity: 600,
      current: wh2Silo.totalUnits,
      items: wh2Silo.items,
      type: 'fluid'
    },
    {
      id: 'virtual-scrap',
      zone: 'Virtual Ledger Node',
      code: 'SCRAP-AUDIT',
      name: 'Virtual Scrap & Loss',
      description: 'Double-entry destination for damaged cycle-count variance',
      icon: SlidersHorizontal,
      capacity: 200,
      current: virtualScrap.totalUnits,
      items: virtualScrap.items,
      type: 'virtual'
    }
  ];

  const getCapacityColor = (current, cap, type) => {
    if (type === 'virtual') return 'border-error/40 bg-error/5 text-error';
    const pct = (current / cap) * 100;
    if (pct > 85) return 'border-amber-500/50 bg-amber-500/5 text-amber-400';
    if (pct > 50) return 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400';
    return 'border-primary/40 bg-primary/5 text-primary-light';
  };

  const activeBay = bays.find(b => b.id === selectedBay);

  return (
    <div className="flex flex-col gap-4">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-card-depth">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-purple-glow">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-base font-bold text-on-surface">Digital Twin: Interactive Facility Floorplan</h2>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-bold border border-tertiary/30">
                Live Density
              </span>
            </div>
            <p className="text-xs text-secondary">
              Real-time spatial visualization of physical pallet racks, cold vaults, assembly lines, and virtual ledger nodes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary font-mono">Click any bin to inspect physical SKUs</span>
        </div>
      </div>

      {/* Tactical 2D Schematic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bays.map((bay) => {
          const Icon = bay.icon;
          const pct = Math.min(100, Math.round((bay.current / bay.capacity) * 100));
          const colorClass = getCapacityColor(bay.current, bay.capacity, bay.type);
          const isSelected = selectedBay === bay.id;

          return (
            <div
              key={bay.id}
              onClick={() => setSelectedBay(bay.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 border-2 ${colorClass} ${
                isSelected
                  ? 'ring-2 ring-primary shadow-purple-glow scale-[1.02]'
                  : 'hover:scale-[1.01] hover:border-primary/60'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-surface-container text-on-surface border border-surface-container shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {bay.code}
                      </span>
                      <span className="text-[10px] font-semibold text-secondary">• {bay.zone}</span>
                    </div>
                    <h3 className="font-headline text-sm font-bold text-on-surface mt-0.5">{bay.name}</h3>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-container border border-surface-container">
                  {pct}% Full
                </span>
              </div>

              {/* Middle Description */}
              <p className="text-[11px] text-secondary line-clamp-2">{bay.description}</p>

              {/* Progress & Units */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-on-surface text-sm">
                    {bay.current.toLocaleString()} <span className="text-xs font-normal text-secondary">Units</span>
                  </span>
                  <span className="font-mono text-[11px] text-secondary">
                    Cap: {bay.capacity.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      bay.type === 'virtual'
                        ? 'bg-error'
                        : pct > 85
                        ? 'bg-amber-400'
                        : pct > 50
                        ? 'bg-emerald-400'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Footer item badges */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-container/60 text-[11px]">
                <span className="text-secondary font-mono">{bay.items.length} SKUs Allocated</span>
                <span className="text-primary-light font-bold flex items-center gap-1 group">
                  <span>Inspect Bay</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Bay Detailed Inspector Modal / Drawer */}
      {activeBay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary-container/20 text-primary-light border border-primary/20">
                  <activeBay.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline text-lg font-bold text-on-surface">{activeBay.name}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-primary-light font-bold">
                      {activeBay.code}
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-mono">{activeBay.zone} • Capacity: {activeBay.capacity} units</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBay(null)}
                className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions for this specific bay */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedBay(null);
                  if (onOpenReceiptModal) {
                    onOpenReceiptModal();
                  } else {
                    onOpenQuickRestockModal?.();
                  }
                }}
                className="py-2 px-3 rounded-xl bg-tertiary-container/30 text-tertiary border border-tertiary/30 text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Receive to this Bay</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBay(null);
                  onOpenTransferModal?.();
                }}
                className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-surface-container"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-primary-light" />
                <span>⇄ Relocate From Bay</span>
              </button>
            </div>

            {/* Live Inventory Sitting in this Physical Bay */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold uppercase text-secondary">
                Physical Items Stored ({activeBay.items.length}):
              </span>

              {activeBay.items.length === 0 ? (
                <div className="p-6 rounded-xl bg-surface-container-low text-center text-secondary text-xs border border-surface-container">
                  No stock currently occupying this storage node.
                </div>
              ) : (
                <div className="divide-y divide-surface-container rounded-xl border border-surface-container bg-surface-container-low overflow-hidden">
                  {activeBay.items.map((prod) => {
                    const binQty = prod.locations?.[activeBay.id] || 0;
                    return (
                      <div key={prod.sku} className="p-3 flex items-center justify-between hover:bg-surface-container transition-colors">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-on-surface">{prod.name}</span>
                          <span className="font-mono text-[10px] text-primary-light">
                            SKU: {prod.sku} • Barcode: {prod.barcode}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-on-surface block">
                            {binQty} {prod.uom}
                          </span>
                          <span className="font-mono text-[10px] text-secondary">
                            (Total across all: {prod.totalStock})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-surface-container">
              <button
                onClick={() => setSelectedBay(null)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
