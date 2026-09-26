import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { ArrowDownLeft, X } from 'lucide-react';

export default function NewReceiptModal({ isOpen, onClose }) {
  const { products, createReceipt, triggerToast } = useInventory();

  const [supplier, setSupplier] = useState('Tata Steel Ltd');
  const [destLocation, setDestLocation] = useState('WH1: Main Store Rack A/B');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'RAW-STL-001');
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState('Scheduled supplier PO replenishment');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);

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
      notes
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
              <h3 className="font-headline text-lg font-bold text-on-surface">New Inbound Receipt (PO)</h3>
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
            <label className="text-xs font-bold text-on-surface mb-1 block">Supplier / Vendor</label>
            <input
              type="text"
              required
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Tata Steel Ltd, Omron Precision"
            />
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
                Quantity ({currentProduct?.uom || 'units'})
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Est. Cost Valuation</label>
              <div className="h-9 px-3 rounded-lg bg-surface-container flex items-center font-mono text-xs font-bold text-primary-light border border-surface-container">
                ₹{((currentProduct?.costPrice || 0) * Number(quantity)).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">PO Notes / Bill of Lading</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. PO-2026-904, Quality Checked at Receiving"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-secondary hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-purple-glow transition-all"
            >
              Queue &amp; Ready Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
