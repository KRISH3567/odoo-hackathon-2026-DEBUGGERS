import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { ArrowDownLeft, X, CheckCircle2 } from 'lucide-react';

export default function NewReceiptModal({ isOpen, onClose }) {
  const { products, createReceipt, triggerToast } = useInventory();

  const [supplier, setSupplier] = useState('Tata Steel Ltd');
  const [destLocation, setDestLocation] = useState('WH1: Main Store Rack A/B');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'RAW-STL-001');
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState('Scheduled supplier PO replenishment');
  const [autoValidate, setAutoValidate] = useState(true);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);

  const vendorPresets = [
    'Tata Steel Ltd',
    'Havells India Ltd',
    'Reliance Petrochemicals',
    'Amul Dairy Cooperative',
    'Jindal Steel & Power'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      triggerToast('Quantity must be greater than zero', 'error');
      return;
    }

    createReceipt({
      supplier,
      destLocation,
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
            <div className="p-2 rounded-xl bg-tertiary-container/30 text-tertiary border border-tertiary/20">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">New Inbound Vendor Receipt (PO)</h3>
              <p className="text-xs text-secondary font-mono">Vendors (Virtual) → Company Warehouse</p>
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
              <label className="text-xs font-bold text-on-surface">Supplier / Vendor</label>
              <span className="text-[10px] text-secondary">Click to fill</span>
            </div>
            <input
              type="text"
              required
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary mb-1.5"
              placeholder="e.g. Tata Steel Ltd, Havells India"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {vendorPresets.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setSupplier(preset)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    supplier === preset
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
              <label className="text-xs font-bold text-on-surface mb-1 block">Destination Node</label>
              <select
                value={destLocation}
                onChange={(e) => setDestLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="WH1: Main Store Rack A/B">WH1: Main Store Rack A/B</option>
                <option value="WH1: Staging Area">WH1: Staging Area</option>
                <option value="WH1: Cold Storage Bin">WH1: Cold Storage Bin</option>
                <option value="WH2: Production Floor">WH2: Production Floor</option>
                <option value="WH2: Raw Material Silo">WH2: Raw Material Silo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Select Product SKU</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-semibold"
              >
                {products.map(p => (
                  <option key={p.sku} value={p.sku}>
                    [{p.sku}] {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">
                Quantity to Ingest ({currentProduct?.uom || 'units'})
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-bold text-tertiary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Operational Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Instant Auto-Validate Toggle */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoValReceipt"
                checked={autoValidate}
                onChange={(e) => setAutoValidate(e.target.checked)}
                className="rounded accent-tertiary w-4 h-4 cursor-pointer"
              />
              <label htmlFor="autoValReceipt" className="text-xs font-semibold text-on-surface cursor-pointer">
                Immediate Real-World Inflow (Auto-credit stock &amp; ledger)
              </label>
            </div>
            <span className="font-mono text-[10px] text-tertiary font-bold">Direct To Bin</span>
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-tertiary text-navy-base font-headline text-xs font-bold hover:bg-emerald-400 shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{autoValidate ? 'Confirm & Ingest Stock' : 'Generate PO Manifest'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
