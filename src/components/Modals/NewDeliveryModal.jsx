import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

export default function NewDeliveryModal({ isOpen, onClose }) {
  const { products, createDelivery } = useInventory();

  const [customer, setCustomer] = useState('Bharat Infra Ltd');
  const [sourceLocation, setSourceLocation] = useState('WH1: Staging Bay A03');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'FURN-CHR-010');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('Sales Order SO-2026-88. Scheduled for expedited ground delivery.');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);
  const availableStock = currentProduct?.totalStock || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    createDelivery({
      customer,
      sourceLocation,
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
            <span className="material-symbols-outlined text-[24px] text-primary">local_shipping</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">New Customer Delivery Order</h3>
              <p className="text-xs text-secondary font-mono">Company Warehouse → Customer (Virtual Destination)</p>
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
          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Customer / Destination Client</label>
            <input
              type="text"
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., Bharat Infra Ltd, Apex Workspaces"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Source Location</label>
              <select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="WH1: Staging Bay A03">WH1: Staging Bay A03</option>
                <option value="WH1: Central Store">WH1: Central Store</option>
                <option value="WH2: Production Floor">WH2: Production Floor</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Product to Dispatch</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              >
                {products.map(p => (
                  <option key={p.sku} value={p.sku}>
                    [{p.sku}] {p.name} ({p.totalStock} {p.uom} avail)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-on-surface mb-1">
                <span>Dispatch Quantity</span>
                <span className={`font-mono text-[10px] ${availableStock >= quantity ? 'text-tertiary' : 'text-error'}`}>
                  Max: {availableStock} {currentProduct?.uom}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max={availableStock}
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Total Revenue Value</label>
              <div className="h-9 px-3 rounded-lg bg-surface-container flex items-center font-mono text-xs font-bold text-tertiary">
                ₹{((currentProduct?.sellingPrice || 0) * Number(quantity)).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Packing / Delivery Instructions</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Courier: BlueDart Express, Fragile packaging required"
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
              disabled={availableStock < quantity}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50"
            >
              Schedule Delivery (Ready to Pick)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
