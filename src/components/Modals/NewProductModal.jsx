import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PackagePlus, X, Sparkles } from 'lucide-react';

export default function NewProductModal({ isOpen, onClose }) {
  const { createProduct, triggerToast } = useInventory();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Raw Materials');
  const [uom, setUom] = useState('units');
  const [costPrice, setCostPrice] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(150);
  const [initialStock, setInitialStock] = useState(50);
  const [minStock, setMinStock] = useState(20);
  const [supplier, setSupplier] = useState('Tata Steel Ltd');
  const [targetLocationKey, setTargetLocationKey] = useState('wh1-store');
  const [isPerishable, setIsPerishable] = useState(false);
  const [expDays, setExpDays] = useState(30);

  if (!isOpen) return null;

  const presets = [
    {
      label: 'Steel Coils',
      name: 'Cold-Rolled Steel Coils',
      sku: 'RAW-STL-002',
      category: 'Raw Materials',
      uom: 'kg',
      costPrice: 75,
      sellingPrice: 95,
      initialStock: 150,
      minStock: 40,
      supplier: 'Tata Steel Ltd',
      targetLocationKey: 'wh1-store',
      isPerishable: false
    },
    {
      label: 'Ball Bearing',
      name: 'Deep Groove Ball Bearing 6204',
      sku: 'IND-BRG-6204',
      category: 'Hardware',
      uom: 'units',
      costPrice: 240,
      sellingPrice: 360,
      initialStock: 80,
      minStock: 25,
      supplier: 'SKF Bearings India',
      targetLocationKey: 'wh1-store',
      isPerishable: false
    },
    {
      label: 'ESP32 MCU',
      name: 'ESP32-WROOM Dual Core MCU',
      sku: 'ELEC-ESP-032',
      category: 'Electronics',
      uom: 'units',
      costPrice: 320,
      sellingPrice: 480,
      initialStock: 45,
      minStock: 15,
      supplier: 'Havells India Ltd',
      targetLocationKey: 'wh1-staging',
      isPerishable: false
    },
    {
      label: 'Cow Ghee (FEFO)',
      name: 'Pure Desi Cow Ghee (500ml)',
      sku: 'FOOD-GHEE-500',
      category: 'Perishables',
      uom: 'bottles',
      costPrice: 450,
      sellingPrice: 650,
      initialStock: 60,
      minStock: 20,
      supplier: 'Amul Dairy Cooperative',
      targetLocationKey: 'wh1-cold',
      isPerishable: true,
      expDays: 90
    },
    {
      label: 'Hydraulic Oil',
      name: 'Industrial Hydraulic Oil ISO 68',
      sku: 'FLUID-HYD-068',
      category: 'Consumables',
      uom: 'liters',
      costPrice: 180,
      sellingPrice: 250,
      initialStock: 120,
      minStock: 30,
      supplier: 'Reliance Petrochemicals',
      targetLocationKey: 'wh2-silo',
      isPerishable: false
    }
  ];

  const applyPreset = (p) => {
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setUom(p.uom);
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setInitialStock(p.initialStock);
    setMinStock(p.minStock);
    setSupplier(p.supplier);
    setTargetLocationKey(p.targetLocationKey);
    setIsPerishable(p.isPerishable);
    if (p.expDays) setExpDays(p.expDays);
    triggerToast(`Loaded sample template: ${p.name}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      triggerToast('Product name and SKU are required', 'error');
      return;
    }

    createProduct({
      name,
      sku: sku.toUpperCase().trim(),
      category,
      uom,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      initialStock: Number(initialStock),
      minStock: Number(minStock),
      supplier: supplier || 'Standard Supplier',
      targetLocationKey,
      isPerishable,
      expDays: isPerishable ? Number(expDays) : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-container/20 text-primary border border-primary/20">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Register New Product SKU</h3>
              <p className="text-xs text-secondary font-mono">Catalog Master Record &amp; Multi-Location Allocation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Presets */}
        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase text-secondary flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> 1-Click Real-World Industry Presets:
            </span>
            <span className="text-[10px] text-secondary">Click to auto-fill</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {presets.map(p => (
              <button
                type="button"
                key={p.sku}
                onClick={() => applyPreset(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface border border-surface-container font-medium transition-all active:scale-95 shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>
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
              <label className="text-xs font-bold text-on-surface mb-1 block">SKU / Code</label>
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
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-medium"
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
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="units">units (Individual items)</option>
                <option value="kg">kg (Kilograms)</option>
                <option value="liters">liters (Liquid volume)</option>
                <option value="sq.m">sq.m (Square meters)</option>
                <option value="bottles">bottles</option>
                <option value="packs">packs</option>
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Initial Stock</label>
              <input
                type="number"
                min="0"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono font-bold text-primary-light"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Safety Stock (ROP)</label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface mb-1 block">Target Storage Bin</label>
              <select
                value={targetLocationKey}
                onChange={(e) => setTargetLocationKey(e.target.value)}
                className="w-full h-9 px-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary font-medium"
              >
                <option value="wh1-store">WH1: Main Store</option>
                <option value="wh1-staging">WH1: Staging Area</option>
                <option value="wh1-cold">WH1: Cold Storage</option>
                <option value="wh2-prod">WH2: Production</option>
                <option value="wh2-silo">WH2: Silo Tanks</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface mb-1 block">Primary Vendor / Supplier</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g. Tata Steel Ltd, SKF India"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-surface-container outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Perishable Checkbox */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPerishCheck"
                checked={isPerishable}
                onChange={(e) => setIsPerishable(e.target.checked)}
                className="rounded accent-primary w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isPerishCheck" className="text-xs font-bold text-on-surface cursor-pointer">
                Perishable Item (Enforces FEFO - First Expired, First Out)
              </label>
            </div>

            {isPerishable && (
              <div className="pl-6 pt-1 flex items-center gap-3">
                <label className="text-xs text-secondary">Shelf Life (Days):</label>
                <input
                  type="number"
                  min="1"
                  value={expDays}
                  onChange={(e) => setExpDays(e.target.value)}
                  className="w-24 h-8 px-2.5 rounded-lg bg-surface-container text-xs text-on-surface font-mono border border-surface-container outline-none focus:ring-1 focus:ring-primary"
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
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-purple-glow transition-all active:scale-95"
            >
              Register SKU &amp; Init Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
