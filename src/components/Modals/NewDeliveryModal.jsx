import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Truck, X, AlertTriangle } from 'lucide-react';

export default function NewDeliveryModal({ isOpen, onClose }) {
  const { products, createDelivery, triggerToast } = useInventory();

  const [customer, setCustomer] = useState('Bharat Infra Ltd');
  const [sourceLocation, setSourceLocation] = useState('WH1: Staging Area');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'RAW-STL-001');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('Sales Order SO-9941 Dispatch');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);
  const availableStock = currentProduct?.totalStock ?? 0;
  const isOverStock = Number(quantity) > availableStock;

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
      notes
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
            <label className="text-xs font-bold text-on-surface mb-1 block">Customer / Destination Client</label>
            <input
              type="text"
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Bharat Infra Ltd, Apex Workspaces"
            />
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
                    [{p.sku}] {p.name} ({p.totalStock} {p.uom} avail)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">Quantity ({currentProduct?.uom || 'units'})</label>
                <span className="font-mono text-[10px] text-secondary">Available: {availableStock}</span>
              </div>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border outline-none font-mono font-bold ${
                  isOverStock ? 'border-error focus:ring-1 focus:ring-error' : 'border-surface-container focus:ring-1 focus:ring-primary'
                }`}
              />
              {isOverStock && (
                <span className="text-[10px] text-error flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Exceeds available stock ({availableStock} on-hand)
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Est. Revenue Value</label>
              <div className="h-9 px-3 rounded-lg bg-surface-container flex items-center font-mono text-xs font-bold text-tertiary border border-surface-container">
                ₹{((currentProduct?.sellingPrice || 0) * Number(quantity)).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Dispatch Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Courier tracking / Priority express handling"
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
              disabled={isOverStock}
              className={`px-4 py-2 rounded-lg text-xs font-bold shadow-purple-glow transition-all ${
                isOverStock 
                  ? 'bg-surface-container-highest text-secondary cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
              }`}
            >
              Schedule Delivery Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
