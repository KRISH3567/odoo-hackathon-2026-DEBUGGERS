import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

export default function NewAdjustmentModal({ isOpen, onClose }) {
  const { products, createAdjustment } = useInventory();

  const [location, setLocation] = useState('WH1: Central Store');
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || 'RAW-STL-001');
  const [physicalCount, setPhysicalCount] = useState(products[0]?.totalStock || 100);
  const [reason, setReason] = useState('Damaged Items');
  const [notes, setNotes] = useState('Physical rack count audit discrepancy identified');

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku);
  const systemStock = currentProduct?.totalStock || 0;
  const variance = Number(physicalCount) - systemStock;
  const shrinkagePercent = systemStock > 0 ? (((systemStock - Number(physicalCount)) / systemStock) * 100).toFixed(1) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    createAdjustment({
      location,
      sku: selectedSku,
      physicalCount: Number(physicalCount),
      reason,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-error">tune</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Physical Inventory Adjustment</h3>
              <p className="text-xs text-secondary font-mono">Cycle Count Audit • System vs Physical Reconciliation</p>
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
              <label className="text-xs font-bold text-on-surface mb-1 block">Storage Location Audited</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="WH1: Central Store">WH1: Central Store</option>
                <option value="WH2: Production Floor">WH2: Production Floor</option>
                <option value="WH1: Staging Bay A03">WH1: Staging Bay A03</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Select Product SKU</label>
              <select
                value={selectedSku}
                onChange={(e) => {
                  setSelectedSku(e.target.value);
                  const p = products.find(item => item.sku === e.target.value);
                  if (p) setPhysicalCount(p.totalStock);
                }}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              >
                {products.map(p => (
                  <option key={p.sku} value={p.sku}>
                    [{p.sku}] {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Variance & Shrinkage Live Computation Strip */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-container-low border border-surface-container text-center">
            <div>
              <span className="font-mono text-[10px] text-secondary uppercase font-semibold">System Recorded</span>
              <div className="font-mono text-sm font-bold text-on-surface mt-0.5">
                {systemStock} {currentProduct?.uom}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] text-secondary uppercase font-semibold">Variance Delta</span>
              <div className={`font-mono text-sm font-bold mt-0.5 ${variance < 0 ? 'text-error' : (variance > 0 ? 'text-tertiary' : 'text-secondary')}`}>
                {variance > 0 ? `+${variance}` : variance} {currentProduct?.uom}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] text-secondary uppercase font-semibold">Shrinkage Rate</span>
              <div className={`font-mono text-sm font-bold mt-0.5 ${variance < 0 ? 'text-error' : 'text-tertiary'}`}>
                {variance < 0 ? `${shrinkagePercent}% Loss` : 'Nominal'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">
                Actual Physical Count ({currentProduct?.uom})
              </label>
              <input
                type="number"
                min="0"
                required
                value={physicalCount}
                onChange={(e) => setPhysicalCount(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Adjustment Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Damaged Items">Damaged Items (Handling / Storage)</option>
                <option value="Cycle Count Discrepancy">Cycle Count Discrepancy</option>
                <option value="Expired Stock">Expired Stock (Perishable Disposal)</option>
                <option value="Theft or Unaccounted Loss">Theft / Unaccounted Loss</option>
                <option value="Found Unrecorded Stock">Found Unrecorded Stock (Surplus)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Audit Notes / Disposal Authorization</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Authorized by Floor Lead Alex Vance"
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
              className="px-4 py-2 rounded-lg bg-error text-on-error text-xs font-bold hover:opacity-90 shadow-sm transition-all"
            >
              Apply Adjustment &amp; Reconcile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
