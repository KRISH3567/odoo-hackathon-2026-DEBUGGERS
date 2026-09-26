import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

export default function NewProductModal({ isOpen, onClose }) {
  const { createProduct } = useInventory();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [uom, setUom] = useState('units');
  const [costPrice, setCostPrice] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(150);
  const [initialStock, setInitialStock] = useState(50);
  const [minStock, setMinStock] = useState(20);
  const [supplier, setSupplier] = useState('');
  const [isPerishable, setIsPerishable] = useState(false);
  const [expDays, setExpDays] = useState(30);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !sku) return;
    createProduct({
      name,
      sku: sku.toUpperCase(),
      category,
      uom,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      initialStock: Number(initialStock),
      minStock: Number(minStock),
      supplier: supplier || 'Global Vendor',
      isPerishable,
      expDays: isPerishable ? Number(expDays) : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-primary">add_box</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Create New Product SKU</h3>
              <p className="text-xs text-secondary font-mono">Catalog Master Record &amp; Multi-Location Allocation</p>
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
              <label className="text-xs font-bold text-on-surface mb-1 block">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Precision Ball Bearings"
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">SKU / Internal Reference</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. RAW-BRG-005"
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Raw Materials">Raw Materials</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="Electronics">Electronics</option>
                <option value="Hardware">Hardware</option>
                <option value="Consumables">Consumables</option>
                <option value="Perishables">Perishables</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Unit of Measure (UoM)</label>
              <select
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="units">units (Individual items)</option>
                <option value="kg">kg (Kilograms)</option>
                <option value="sq.m">sq.m (Square meters)</option>
                <option value="liters">liters (Liquid capacity)</option>
                <option value="packs">packs (Multi-packs)</option>
                <option value="bottles">bottles</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Cost Price (₹ INR)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Selling Price (₹ INR)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Initial On-Hand Stock</label>
              <input
                type="number"
                min="0"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Safety Stock Threshold (ROP)</label>
              <input
                type="number"
                min="1"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Primary Vendor / Supplier</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g. Bosch Industries Ltd"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Perishable Checkbox */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPerishableCheck"
                checked={isPerishable}
                onChange={(e) => setIsPerishable(e.target.checked)}
                className="accent-primary rounded cursor-pointer"
              />
              <label htmlFor="isPerishableCheck" className="text-xs font-bold text-on-surface cursor-pointer">
                Track FEFO Batch Expiry (Perishable Product)
              </label>
            </div>
            {isPerishable && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-secondary">Shelf Expiration (Days):</span>
                <input
                  type="number"
                  min="1"
                  value={expDays}
                  onChange={(e) => setExpDays(e.target.value)}
                  className="w-24 h-8 px-2 rounded bg-surface-container-lowest text-xs text-on-surface border border-surface-container font-mono font-bold"
                />
              </div>
            )}
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
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary text-xs font-bold hover:bg-primary shadow-sm transition-all"
            >
              Save Product &amp; Add to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
