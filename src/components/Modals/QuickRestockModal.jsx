import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PlusCircle, X, Truck, Sparkles } from 'lucide-react';

export default function QuickRestockModal({ isOpen, onClose, initialSku }) {
  const { products, quickReceiveStock, triggerToast } = useInventory();

  const [selectedSku, setSelectedSku] = useState(initialSku || products[0]?.sku || 'RAW-STL-001');
  const [prevSkuProp, setPrevSkuProp] = useState(initialSku);
  const [quantity, setQuantity] = useState(25);
  const [supplier, setSupplier] = useState('');
  const [destLocation, setDestLocation] = useState('WH1: Main Store Rack A/B');

  if (initialSku !== prevSkuProp) {
    setPrevSkuProp(initialSku);
    const newSku = initialSku || products[0]?.sku || 'RAW-STL-001';
    setSelectedSku(newSku);
    const prod = products.find(p => p.sku === newSku);
    if (prod) {
      setSupplier(prod.supplier || 'Tata Steel Ltd');
      if (prod.isPerishable) {
        setDestLocation('WH1: Cold Storage Bin');
      } else {
        setDestLocation('WH1: Main Store Rack A/B');
      }
    }
  }

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.sku === selectedSku) || products[0];

  const totalAddedValue = (currentProduct?.costPrice || 0) * Number(quantity || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      triggerToast('Quantity must be greater than zero', 'error');
      return;
    }

    quickReceiveStock({
      sku: selectedSku,
      quantity: qty,
      supplier: supplier || 'Tata Steel Ltd',
      destLocation
    });
    onClose();
  };

  const vendorPresets = [
    'Tata Steel Ltd',
    'Havells India Ltd',
    'Reliance Petrochemicals',
    'Amul Dairy Cooperative',
    'Jindal Steel & Power'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-tertiary-container/30 text-tertiary border border-tertiary/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Quick Inbound Stock Receive</h3>
              <p className="text-xs text-secondary font-mono">Immediate Stock Inflow &amp; Double-Entry Credit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Target Product Picker */}
          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Select Item to Restock</label>
            <select
              value={selectedSku}
              onChange={(e) => {
                const sku = e.target.value;
                setSelectedSku(sku);
                const prod = products.find(p => p.sku === sku);
                if (prod?.supplier) setSupplier(prod.supplier);
                if (prod?.isPerishable) setDestLocation('WH1: Cold Storage Bin');
              }}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-semibold"
            >
              {products.map(p => (
                <option key={p.sku} value={p.sku}>
                  [{p.sku}] {p.name} — Current: {p.totalStock} {p.uom}
                </option>
              ))}
            </select>
          </div>

          {/* Current Stock Context Strip */}
          {currentProduct && (
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs">
              <div>
                <span className="text-secondary font-mono text-[10px] uppercase font-bold block">Current On-Hand</span>
                <span className="font-mono text-base font-bold text-on-surface">
                  {currentProduct.totalStock} {currentProduct.uom}
                </span>
              </div>
              <div className="text-right">
                <span className="text-secondary font-mono text-[10px] uppercase font-bold block">Unit Valuation</span>
                <span className="font-mono text-sm font-semibold text-primary-light">
                  ₹{currentProduct.costPrice.toLocaleString()} / {currentProduct.uom}
                </span>
              </div>
            </div>
          )}

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">
                Quantity to Inflow (+{currentProduct?.uom || 'units'})
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-bold text-base text-tertiary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Destination Warehouse Bin</label>
              <select
                value={destLocation}
                onChange={(e) => setDestLocation(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="WH1: Main Store Rack A/B">WH1: Main Store Rack A/B</option>
                <option value="WH1: Staging Area">WH1: Staging Area (Inbound)</option>
                <option value="WH1: Cold Storage Bin">WH1: Cold Storage Bin</option>
                <option value="WH2: Production Floor">WH2: Production Floor</option>
                <option value="WH2: Raw Material Silo">WH2: Raw Material Silo</option>
              </select>
            </div>
          </div>

          {/* Supplier with 1-Click Chips */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-on-surface">Supplier / Vendor</label>
              <span className="text-[10px] text-secondary">Click preset to auto-fill</span>
            </div>
            <input
              type="text"
              required
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g. Tata Steel Ltd"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary mb-1.5"
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

          {/* Total Value Summary Box */}
          <div className="p-3 rounded-xl bg-tertiary-container/15 border border-tertiary/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-tertiary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Total Stock Inflow Value:
            </span>
            <span className="font-mono text-sm font-bold text-tertiary">
              +₹{totalAddedValue.toLocaleString()}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-secondary hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tertiary text-navy-base font-headline text-xs font-bold hover:bg-emerald-400 shadow-md transition-all active:scale-95"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm &amp; Add Stock Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
