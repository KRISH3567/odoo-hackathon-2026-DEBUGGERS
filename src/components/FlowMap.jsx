import React from 'react';
import { useInventory } from '../context/InventoryContext';

export default function FlowMap() {
  const { products } = useInventory();

  // Calculate live quantities for Steel Rods (the primary Odoo scenario product)
  const steelProd = products.find(p => p.sku === 'RAW-STL-001') || {
    locations: { 'wh1-store': 80, 'wh2-prod': 20 }
  };

  const storeQty = (steelProd.locations && steelProd.locations['wh1-store']) || 0;
  const prodQty = (steelProd.locations && steelProd.locations['wh2-prod']) || 0;

  // Total scrap units
  const scrapTotal = products.reduce((acc, p) => acc + ((p.locations && p.locations['virtual-scrap']) || 0), 3);

  return (
    <section className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">account_tree</span>
          <h3 className="font-headline text-base font-bold text-on-surface">
            Odoo Double-Entry Visual Material Flow Map
          </h3>
          <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-mono text-[10px] font-bold">
            Real-Time Routing
          </span>
        </div>
        <span className="font-mono text-xs text-secondary">Balanced Debit / Credit Ledger</span>
      </div>

      {/* Node Map Interactive Canvas */}
      <div className="relative w-full bg-surface-container-low rounded-xl p-4 overflow-x-auto border border-surface-container">
        <div className="flex items-center justify-between min-w-[640px] gap-2">
          {/* Node 1: Vendors (Virtual Source) */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-xs w-36 text-center border border-surface-container hover:border-primary transition-colors">
            <span className="font-mono text-[10px] text-secondary uppercase font-bold">Source (Partner)</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1">factory</span>
            <span className="text-xs font-bold text-on-surface">Vendors (Virtual)</span>
            <span className="font-mono text-[11px] text-tertiary font-semibold mt-1">+100 kg Inbound</span>
          </div>

          {/* Arrow 1: Inbound */}
          <div className="flex-1 flex flex-col items-center px-1">
            <span className="font-mono text-[11px] text-primary font-bold">WH/IN • PO-2601</span>
            <div className="w-full flex items-center justify-center my-1">
              <div className="h-0.5 w-full bg-primary-container relative">
                <div className="absolute right-0 -top-1 w-2 h-2 bg-primary rotate-45"></div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-secondary">Credit: Vendor</span>
          </div>

          {/* Node 2: WH1 Central Store (Physical Asset) */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-sm w-44 text-center ring-2 ring-primary/30 border border-primary/20">
            <span className="font-mono text-[10px] text-primary uppercase font-bold">Physical Store</span>
            <span className="material-symbols-outlined text-[24px] text-primary my-1">warehouse</span>
            <span className="text-xs font-bold text-on-surface">WH1: Main Store</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-bold" id="nodeStoreQty">
                {storeQty} kg Steel on-hand
              </span>
            </div>
          </div>

          {/* Arrow 2: Internal Transfer */}
          <div className="flex-1 flex flex-col items-center px-1">
            <span className="font-mono text-[11px] text-secondary font-bold">WH/INT • Bin Move</span>
            <div className="w-full flex items-center justify-center my-1">
              <div className="h-0.5 w-full bg-secondary-fixed relative">
                <div className="absolute right-0 -top-1 w-2 h-2 bg-secondary rotate-45"></div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-secondary">Zero Delta Balance</span>
          </div>

          {/* Node 3: WH2 Production Floor */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-xs w-40 text-center border border-surface-container hover:border-secondary transition-colors">
            <span className="font-mono text-[10px] text-secondary uppercase font-bold">Internal Silo</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1">precision_manufacturing</span>
            <span className="text-xs font-bold text-on-surface">WH2: Production</span>
            <span className="font-mono text-[11px] text-tertiary font-bold mt-1" id="nodeProdQty">
              {prodQty} kg Steel WIP
            </span>
          </div>

          {/* Arrow 3: Delivery Out */}
          <div className="flex-1 flex flex-col items-center px-1">
            <span className="font-mono text-[11px] text-secondary font-bold">WH/OUT • Order 0291</span>
            <div className="w-full flex items-center justify-center my-1">
              <div className="h-0.5 w-full bg-tertiary-fixed relative">
                <div className="absolute right-0 -top-1 w-2 h-2 bg-tertiary rotate-45"></div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-secondary">Debit: Customer</span>
          </div>

          {/* Node 4: Customers (Virtual Destination) */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-xs w-36 text-center border border-surface-container hover:border-tertiary transition-colors">
            <span className="font-mono text-[10px] text-secondary uppercase font-bold">Dest (Partner)</span>
            <span className="material-symbols-outlined text-[24px] text-secondary my-1">storefront</span>
            <span className="text-xs font-bold text-on-surface">Customers (Virtual)</span>
            <span className="font-mono text-[10px] text-on-surface-variant font-medium mt-1">Dispatched</span>
          </div>
        </div>

        {/* Bottom Scrap Split Line */}
        <div className="mt-3 pt-3 border-t border-surface-container flex items-center justify-between text-secondary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-error">subdirectory_arrow_right</span>
            <span className="text-xs font-semibold">Virtual Scrap Branch:</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-error-container text-on-error-container font-bold">
              Scrap & Disposed (-{scrapTotal} kg Steel Damaged)
            </span>
          </div>
          <span className="font-mono text-[10px] text-secondary hidden sm:inline">
            Zero Discrepancy Double-Entry Principle • Audit-Proof
          </span>
        </div>
      </div>
    </section>
  );
}
