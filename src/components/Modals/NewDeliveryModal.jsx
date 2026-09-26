import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Truck, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NewDeliveryModal({ isOpen, onClose }) {
  const { products, createDelivery, triggerToast } = useInventory();

  const [customer, setCustomer] = useState('Bharat Infra Ltd');
  const [sourceLocation, setSourceLocation] = useState('WH1: Staging Area');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'RAW-STL-001');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('Sales Order SO-9941 Dispatch');
  const [autoValidate, setAutoValidate] = useState(true);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);
  const availableStock = currentProduct?.totalStock ?? 0;
  const isOverStock = Number(quantity) > availableStock;

  const customerPresets = [
    'Bharat Infra Ltd',
    'Larsen & Toubro Ltd',
    'Reliance Retail Ltd',
    'Croma Digital Express',
    'Mahindra Auto Works'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      triggerToast('Delivery quantity must be greater than zero', 'error');
      return;
    }

    if (qty > availableStock) {
      triggerToast(`Cannot dispatch ${qty} ${currentProduct?.uom}: Only ${availableStock} in total stock!`, 'error');
      return;
    }

    createDelivery({
      customer,
      sourceLocation,
      sku: selectedSku,
      quantity: qty,
      uom: currentProduct?.uom || 'units',
      notes,
      autoValidate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-container/20 text-primary border border-primary/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">New Customer Delivery Order</h3>
              <p className="text-xs text-secondary font-mono">Company Warehouse → Customers (Virtual)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-on-surface">Customer / Destination Client</label>
              <span className="text-[10px] text-secondary">Click to fill</span>
            </div>
            <input
              type="text"
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary mb-1.5"
              placeholder="e.g. Bharat Infra Ltd, Apex Workspaces"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {customerPresets.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setCustomer(preset)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    customer === preset
                      ? 'bg-primary-container text-on-primary border-primary'
                      : 'bg-surface-container text-secondary hover:text-on-surface border-surface-container'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Source Picking Bay</label>
              <select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="WH1: Staging Area">WH1: Staging Area (Dispatch Bay)</option>
                <option value="WH1: Main Store Rack A/B">WH1: Main Store Rack A/B</option>
                <option value="WH1: Cold Storage Bin">WH1: Cold Storage Bin</option>
                <option value="WH2: Production Floor">WH2: Production Floor</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Product SKU</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-semibold"
              >
                {products.map(p => (
                  <option key={p.sku} value={p.sku}>
                    [{p.sku}] {p.name} (Stock: {p.totalStock})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">
                Quantity to Dispatch ({currentProduct?.uom || 'units'})
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs border outline-none font-mono font-bold ${
                  isOverStock
                    ? 'border-error text-error focus:ring-1 focus:ring-error'
                    : 'border-surface-container text-on-surface focus:ring-1 focus:ring-primary'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Sales Order / Dispatch Ref</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Real-Time Stock Availability Indicator */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
            <span className="text-xs text-secondary font-mono">
              Available Company Stock: <span className="font-bold text-on-surface">{availableStock} {currentProduct?.uom}</span>
            </span>
            {isOverStock ? (
              <span className="flex items-center gap-1 font-mono text-[10px] text-error font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-error" /> Stock Deficit!
              </span>
            ) : (
              <span className="font-mono text-[10px] text-emerald-400 font-bold">
                Sufficient Inventory
              </span>
            )}
          </div>

          {/* Instant Auto-Validate Dispatch */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoValDelivery"
                checked={autoValidate}
                onChange={(e) => setAutoValidate(e.target.checked)}
                className="rounded accent-primary w-4 h-4 cursor-pointer"
              />
              <label htmlFor="autoValDelivery" className="text-xs font-semibold text-on-surface cursor-pointer">
                Immediate Real-World Dispatch (Auto-debit stock &amp; ledger)
              </label>
            </div>
            <span className="font-mono text-[10px] text-primary-light font-bold">Instant Outflow</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-secondary hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isOverStock}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-headline text-xs font-bold transition-all active:scale-95 ${
                isOverStock
                  ? 'bg-surface-container text-secondary cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-hover shadow-purple-glow'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{autoValidate ? 'Confirm & Ship Now' : 'Schedule Pick & Pack'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
