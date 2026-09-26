import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  ArrowLeftRight,
  X,
  AlertTriangle
} from 'lucide-react';

export default function NewTransferModal({ isOpen, onClose }) {
  const { products, createTransfer, triggerToast } = useInventory();

  const [sourceLocation, setSourceLocation] = useState('WH1: Main Store Rack A/B');
  const [destLocation, setDestLocation] = useState('WH2: Production Floor');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'RAW-STL-001');
  const [quantity, setQuantity] = useState(20);
  const [notes, setNotes] = useState('Production batch requisition');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);

  // Compute location key for source availability check
  const sourceLocKey = sourceLocation.includes('WH2') 
    ? (sourceLocation.includes('Silo') ? 'wh2-silo' : 'wh2-prod') 
    : (sourceLocation.includes('Staging') ? 'wh1-staging' : (sourceLocation.includes('Cold') ? 'wh1-cold' : 'wh1-store'));

  const availableInSource = (currentProduct?.locations && currentProduct.locations[sourceLocKey]) || 0;
  const isSameLocation = sourceLocation === destLocation;
  const isOverQuantity = Number(quantity) > availableInSource;

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      triggerToast('Transfer quantity must be greater than zero', 'error');
      return;
    }

    if (isSameLocation) {
      triggerToast('Source and destination cannot be the same', 'error');
      return;
    }

    if (qty > availableInSource) {
      triggerToast(`Only ${availableInSource} ${currentProduct?.uom} available in ${sourceLocation}!`, 'error');
      return;
    }

    createTransfer({
      sourceLocation,
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
            <div className="p-2 rounded-xl bg-primary-container/20 text-primary border border-primary/20">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">New Internal Stock Movement</h3>
              <p className="text-xs text-secondary font-mono">Location A → Location B (Zero Net Delta)</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Source Location</label>
              <select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
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
              <label className="text-xs font-bold text-on-surface mb-1 block">Destination Location</label>
              <select
                value={destLocation}
                onChange={(e) => setDestLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="WH2: Production Floor">WH2: Production Floor</option>
                <option value="WH1: Main Store Rack A/B">WH1: Main Store Rack A/B</option>
                <option value="WH1: Staging Area">WH1: Staging Area</option>
                <option value="WH2: Raw Material Silo">WH2: Raw Material Silo</option>
              </select>
            </div>
          </div>

          {isSameLocation && (
            <span className="text-[11px] text-error flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Source and destination locations cannot be identical
            </span>
          )}

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Product to Move</label>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">Quantity ({currentProduct?.uom || 'units'})</label>
                <span className="font-mono text-[10px] text-secondary">Source has: {availableInSource}</span>
              </div>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border outline-none font-mono font-bold ${
                  isOverQuantity ? 'border-error focus:ring-1 focus:ring-error' : 'border-surface-container focus:ring-1 focus:ring-primary'
                }`}
              />
              {isOverQuantity && (
                <span className="text-[10px] text-error flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Exceeds stock in source bin ({availableInSource} available)
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Asset Value Shift</label>
              <div className="h-9 px-3 rounded-lg bg-surface-container flex items-center font-mono text-xs font-bold text-primary-light border border-surface-container">
                ₹{((currentProduct?.costPrice || 0) * Number(quantity)).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Requisition Memo / Reason</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Work-in-Progress requisition for assembly line"
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
              disabled={isSameLocation || isOverQuantity}
              className={`px-4 py-2 rounded-lg text-xs font-bold shadow-purple-glow transition-all ${
                isSameLocation || isOverQuantity
                  ? 'bg-surface-container-highest text-secondary cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
              }`}
            >
              Confirm Inter-Bin Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
