import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

export default function NewTransferModal({ isOpen, onClose }) {
  const { products, createTransfer } = useInventory();

  const [sourceLocation, setSourceLocation] = useState('WH1: Central Store');
  const [destLocation, setDestLocation] = useState('WH2: Production Floor');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'RAW-STL-001');
  const [quantity, setQuantity] = useState(25);
  const [notes, setNotes] = useState('Internal replenishment between silos');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);

  const handleSubmit = (e) => {
    e.preventDefault();
    createTransfer({
      sourceLocation,
      destLocation,
      sku: selectedSku,
      quantity: Number(quantity),
      uom: currentProduct?.uom || 'units',
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-secondary">swap_horiz</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">New Internal Transfer</h3>
              <p className="text-xs text-secondary font-mono">Location-to-Location (Zero Total Balance Delta)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Source Location</label>
              <select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="WH1: Central Store">WH1: Central Store</option>
                <option value="WH2: Production Floor">WH2: Production Floor</option>
                <option value="WH1: Staging Bay A03">WH1: Staging Bay A03</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Destination Location</label>
              <select
                value={destLocation}
                onChange={(e) => setDestLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="WH2: Production Floor">WH2: Production Floor</option>
                <option value="WH1: Central Store">WH1: Central Store</option>
                <option value="WH1: Staging Bay A03">WH1: Staging Bay A03</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Product SKU</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              >
                {products.map(p => (
                  <option key={p.sku} value={p.sku}>
                    [{p.sku}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">
                Transfer Quantity ({currentProduct?.uom})
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
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Transfer Purpose / Work Order</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Work Order WO-401 for assembly line #2"
            />
          </div>

          <div className="p-3 rounded-xl bg-secondary-container/40 text-xs text-secondary flex items-start gap-2 border border-secondary-container">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0">info</span>
            <span>
              Odoo Double-Entry Rule: Total company inventory remains unchanged. Location-level balances and stock ledger will update automatically.
            </span>
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
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:bg-on-surface shadow-sm transition-all"
            >
              Schedule Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
