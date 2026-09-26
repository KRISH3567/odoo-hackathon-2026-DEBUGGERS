import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  GitFork,
  Factory,
  Warehouse,
  Cpu,
  Store,
  CornerDownRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function FlowMap() {
  const { products } = useInventory();

  // Calculate live quantities for Steel Rods (the primary Odoo scenario product)
  const steelProd = products.find(p => p.sku === 'RAW-STL-001') || {
    locations: { 'wh1-store': 0, 'wh2-prod': 0, 'virtual-scrap': 0 },
    totalStock: 0
  };

  const storeQty = (steelProd.locations && steelProd.locations['wh1-store']) || 0;
  const prodQty = (steelProd.locations && steelProd.locations['wh2-prod']) || 0;
  const scrapQty = (steelProd.locations && steelProd.locations['virtual-scrap']) || 0;
  const totalOnHand = storeQty + prodQty;

  return (
    <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3.5 border border-surface-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-container/20 text-primary border border-primary/20">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface">
              Odoo Double-Entry Visual Material Flow Map
            </h3>
            <p className="text-[11px] text-secondary">
              Real-time multi-location movement routing for Steel Rods (RAW-STL-001)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-surface font-semibold border border-surface-container">
            Total On-Hand: <strong className="text-primary-light">{totalOnHand} kg</strong>
          </span>
          {totalOnHand === 77 && (
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-tertiary/20 text-tertiary font-bold border border-tertiary/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Reconciled 77 kg
            </span>
          )}
        </div>
      </div>

      {/* Node Map Interactive Canvas */}
      <div className="relative w-full bg-surface-container-low rounded-xl p-4 overflow-x-auto border border-surface-container">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {/* Node 1: Vendors (Virtual Source) */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-xs w-36 text-center border border-surface-container hover:border-primary transition-colors">
            <span className="font-mono text-[10px] text-secondary uppercase font-bold">Source (Partner)</span>
            <Factory className="w-6 h-6 text-secondary my-1.5" />
            <span className="text-xs font-bold text-on-surface">Vendors (Virtual)</span>
            <span className="font-mono text-[11px] text-tertiary font-semibold mt-1">Inbound PO</span>
          </div>

          {/* Arrow 1: Inbound */}
          <div className="flex-1 flex flex-col items-center px-1">
            <span className="font-mono text-[11px] text-primary-light font-bold">WH/IN • Tata Steel</span>
            <div className="w-full flex items-center justify-center my-1.5">
              <div className="h-0.5 w-full bg-primary/40 relative flex items-center justify-end">
                <ArrowRight className="w-3.5 h-3.5 text-primary absolute -right-1" />
              </div>
            </div>
            <span className="font-mono text-[10px] text-secondary">Credit: Vendor</span>
          </div>

          {/* Node 2: WH1 Central Store (Physical Asset) */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-sm w-44 text-center ring-2 ring-primary/40 border border-primary/30">
            <span className="font-mono text-[10px] text-primary uppercase font-bold">Physical Store</span>
            <Warehouse className="w-6 h-6 text-primary my-1.5" />
            <span className="text-xs font-bold text-on-surface">WH1: Main Store</span>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary-container text-white font-bold" id="nodeStoreQty">
                {storeQty} kg Steel
              </span>
            </div>
          </div>

          {/* Arrow 2: Internal Transfer */}
          <div className="flex-1 flex flex-col items-center px-1">
            <span className="font-mono text-[11px] text-secondary font-bold">WH/INT • Bin Move</span>
            <div className="w-full flex items-center justify-center my-1.5">
              <div className="h-0.5 w-full bg-secondary relative flex items-center justify-end">
                <ArrowRight className="w-3.5 h-3.5 text-secondary absolute -right-1" />
              </div>
            </div>
            <span className="font-mono text-[10px] text-secondary">Zero Delta Balance</span>
          </div>

          {/* Node 3: WH2 Production Floor */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-xs w-40 text-center border border-surface-container hover:border-secondary transition-colors">
            <span className="font-mono text-[10px] text-secondary uppercase font-bold">Internal Floor</span>
            <Cpu className="w-6 h-6 text-secondary my-1.5" />
            <span className="text-xs font-bold text-on-surface">WH2: Production</span>
            <span className="font-mono text-[11px] text-tertiary font-bold mt-1.5" id="nodeProdQty">
              {prodQty} kg Steel WIP
            </span>
          </div>

          {/* Arrow 3: Delivery Out */}
          <div className="flex-1 flex flex-col items-center px-1">
            <span className="font-mono text-[11px] text-secondary font-bold">WH/OUT • Order</span>
            <div className="w-full flex items-center justify-center my-1.5">
              <div className="h-0.5 w-full bg-tertiary/60 relative flex items-center justify-end">
                <ArrowRight className="w-3.5 h-3.5 text-tertiary absolute -right-1" />
              </div>
            </div>
            <span className="font-mono text-[10px] text-secondary">Debit: Customer</span>
          </div>

          {/* Node 4: Customers (Virtual Destination) */}
          <div className="flex flex-col items-center p-3 rounded-xl bg-surface-container-lowest shadow-xs w-36 text-center border border-surface-container hover:border-tertiary transition-colors">
            <span className="font-mono text-[10px] text-secondary uppercase font-bold">Dest (Partner)</span>
            <Store className="w-6 h-6 text-secondary my-1.5" />
            <span className="text-xs font-bold text-on-surface">Customers (Virtual)</span>
            <span className="font-mono text-[10px] text-on-surface-variant font-medium mt-1">Dispatched</span>
          </div>
        </div>

        {/* Bottom Scrap Split Line */}
        <div className="mt-3.5 pt-3 border-t border-surface-container flex items-center justify-between text-secondary">
          <div className="flex items-center gap-2">
            <CornerDownRight className="w-4 h-4 text-error" />
            <span className="text-xs font-semibold text-on-surface">Virtual Scrap Branch:</span>
            <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-error-container/30 text-error font-bold border border-error/20">
              Scrap &amp; Disposed ({scrapQty} kg Steel Damaged)
            </span>
          </div>
          <span className="font-mono text-[10px] text-secondary hidden sm:inline">
            Zero-Discrepancy Invariant: Inbound (100) = Store (20) + Floor (57) + Delivered (20) + Scrap (3)
          </span>
        </div>
      </div>
    </section>
  );
}
