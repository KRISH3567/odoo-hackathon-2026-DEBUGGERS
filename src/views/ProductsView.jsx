import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';

export default function ProductsView({ onOpenNewProductModal, onOpenAdjustmentModal, onOpenTransferModal }) {
  const {
    products,
    selectedProductSku,
    setSelectedProductSku,
    generateDraftPO,
    totalUnits,
    totalValuation,
    lowStockCount,
    triggerToast
  } = useInventory();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedProduct = products.find(p => p.sku === selectedProductSku) || products[0];

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    const isLow = p.totalStock <= p.minStock;
    const isPerish = p.isPerishable;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'in_stock' && !isLow) ||
      (statusFilter === 'low_stock' && isLow) ||
      (statusFilter === 'fefo' && isPerish);

    return matchCat && matchSearch && matchStatus;
  });

  const handleExport = () => {
    exportToCSV(products, 'StockSense_Product_Catalog');
    triggerToast('Product catalog exported as CSV!');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Action Area & Breadcrumb Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="hover:text-primary transition-colors cursor-pointer">StockSense IMS</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Products &amp; Inventory</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Catalog Management</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              Products &amp; Inventory Catalog
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-bold">
              SKU Index: {products.length} Entities
            </span>
          </div>
          <p className="text-xs text-secondary max-w-3xl">
            Manage SKU definitions, multi-location physical inventory, automated reorder thresholds (ROP), and real-time inventory valuations across regional sites.
          </p>
        </div>

        {/* Action Suite */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => triggerToast('Select CSV file to import products...')}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">upload_file</span>
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
            <span>Export Catalog</span>
          </button>
          <button
            onClick={onOpenNewProductModal}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active SKUs */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-secondary uppercase tracking-wider font-bold">Active SKUs</span>
            <span className="font-mono text-[11px] text-tertiary-container flex items-center font-bold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +3 this wk
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface">{products.length}</span>
            <span className="text-xs text-secondary">across 5 categories</span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-secondary font-mono text-[10px] bg-surface-container-low px-2 py-1 rounded-lg">
            <span>Raw: 2</span>
            <span>•</span>
            <span>Finished: 4</span>
            <span>•</span>
            <span>Perishable: 2</span>
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-secondary uppercase tracking-wider font-bold">Stock Valuation</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container text-primary font-bold">
              Margin 38.5%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface">
              ₹{totalValuation.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-secondary text-xs bg-surface-container-low px-2 py-1 rounded-lg">
            <span className="text-tertiary-container font-semibold">INR FIFO Basis</span>
            <span className="font-mono text-[10px]">Real-Time Sync</span>
          </div>
        </div>

        {/* Below ROP Alert */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-error-container/40">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-error uppercase tracking-wider font-bold">Below Reorder Point</span>
            <span className="flex h-2 w-2 rounded-full bg-error animate-ping"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-error">{lowStockCount}</span>
            <span className="text-xs text-secondary">SKUs require PO issue</span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-on-error-container font-mono text-[10px] bg-error-container/30 px-2 py-1 rounded-lg">
            <span className="font-bold">ELEC-MOU, RAW-OIL</span>
            <button
              onClick={() => generateDraftPO('ELEC-MOU-001', 50)}
              className="underline cursor-pointer font-bold hover:text-error"
            >
              Auto-Order
            </button>
          </div>
        </div>

        {/* Active Storage Nodes */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-secondary uppercase tracking-wider font-bold">Active Storage Nodes</span>
            <span className="font-mono text-[10px] text-secondary">WH1 &amp; WH2</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface">14 Bins</span>
            <span className="text-xs text-tertiary-container font-semibold">100% Mapped</span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-secondary font-mono text-[10px] bg-surface-container-low px-2 py-1 rounded-lg">
            <span>Main Rack: 8</span>
            <span>•</span>
            <span>Production: 4</span>
            <span>•</span>
            <span>Staging: 2</span>
          </div>
        </div>
      </div>

      {/* Dual Column Layout: Grid Table (70%) + Detail Drawer (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Bar & Table (lg:col-span-8 xl:col-span-9) */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-4">
          {/* Filter & Search Toolbar */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-surface-container">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-secondary">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU, Product Name, Barcode, or Supplier..."
                  className="w-full h-9 pl-9 pr-4 bg-surface-container-low text-on-surface text-xs rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg outline-none cursor-pointer border-0"
                >
                  <option value="all">All Statuses</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock / Under ROP</option>
                  <option value="fefo">Nearing Expiry (FEFO)</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
              {[
                { id: 'all', label: `All Products (${products.length})` },
                { id: 'raw', label: 'Raw Materials' },
                { id: 'finished', label: 'Finished Goods' },
                { id: 'electronics', label: 'Electronics' },
                { id: 'perishables', label: 'Perishables / Consumables' },
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setCategoryFilter(chip.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === chip.id
                      ? 'bg-primary-container text-on-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Data Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Product &amp; SKU</th>
                    <th className="py-2.5 px-3 text-center">UoM</th>
                    <th className="py-2.5 px-3 text-right">Cost / Sale</th>
                    <th className="py-2.5 px-3 text-right">Total On Hand</th>
                    <th className="py-2.5 px-3">Multi-Location Allocation</th>
                    <th className="py-2.5 px-3 text-center">ROP Status</th>
                    <th className="py-2.5 px-3 text-center">Batch / Shelf</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-on-surface divide-y divide-surface-container">
                  {filteredProducts.map(p => {
                    const isSelected = p.sku === selectedProductSku;
                    const isLow = p.totalStock <= p.minStock;
                    const storeQty = (p.locations && p.locations['wh1-store']) || 0;
                    const prodQty = (p.locations && p.locations['wh2-prod']) || 0;
                    const stagingQty = (p.locations && p.locations['wh1-staging']) || 0;
                    const coldQty = (p.locations && p.locations['wh1-cold']) || 0;

                    const total = Math.max(1, p.totalStock);
                    const storePct = Math.round((storeQty / total) * 100);
                    const prodPct = Math.round((prodQty / total) * 100);
                    const otherPct = 100 - storePct - prodPct;

                    return (
                      <tr
                        key={p.sku}
                        onClick={() => setSelectedProductSku(p.sku)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary-fixed/20 hover:bg-primary-fixed/30'
                            : (isLow ? 'bg-error-container/10 hover:bg-error-container/20' : 'hover:bg-surface-container-low')
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                              <span className="material-symbols-outlined text-[18px]">
                                {p.category === 'Electronics' ? 'devices' : p.isPerishable ? 'nutrition' : 'inventory_2'}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-on-surface">{p.name}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-secondary font-bold">{p.sku}</span>
                                <span className="font-mono text-[10px] px-1 rounded bg-surface-container text-on-surface-variant">
                                  {p.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono text-secondary">
                          {p.uom}
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono">
                          <div className="font-medium text-on-surface">₹{p.costPrice}</div>
                          <div className="text-[10px] text-tertiary font-semibold">₹{p.sellingPrice}</div>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className={`font-mono font-bold ${isLow ? 'text-error' : 'text-on-surface'}`}>
                            {p.totalStock} {p.uom}
                          </div>
                          <span className={`text-[10px] font-bold ${isLow ? 'text-error' : 'text-tertiary'}`}>
                            {isLow ? 'Under ROP' : 'In Stock'}
                          </span>
                        </td>

                        {/* Multi-Location Allocation Bar */}
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col gap-1 w-40">
                            <div className="flex items-center justify-between font-mono text-[10px] text-secondary">
                              <span>WH1: {storeQty + stagingQty + coldQty}</span>
                              <span>WH2: {prodQty}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden flex">
                              <div className="bg-primary h-full" style={{ width: `${storePct}%` }}></div>
                              <div className="bg-secondary-fixed h-full" style={{ width: `${prodPct}%` }}></div>
                              <div className="bg-tertiary-fixed h-full" style={{ width: `${otherPct}%` }}></div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <div className="font-mono text-[10px] text-secondary">Min: {p.minStock}</div>
                          <span className={`inline-block px-1.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            isLow ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container/10 text-tertiary-container'
                          }`}>
                            {isLow ? 'REORDER' : 'Safe'}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          {p.isPerishable ? (
                            <span className="font-mono text-[10px] font-bold text-error">
                              Exp: {p.expDays} Days
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] text-secondary">{p.batchNumber}</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isLow ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generateDraftPO(p.sku, 50);
                                }}
                                className="px-2 py-1 rounded bg-error text-on-error font-mono text-[10px] font-bold hover:opacity-90"
                              >
                                Auto PO
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProductSku(p.sku);
                                }}
                                className="px-2 py-1 rounded bg-surface-container text-on-surface font-semibold text-[11px] hover:bg-surface-container-high"
                              >
                                Inspect
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Detail Intelligence Drawer (lg:col-span-4 xl:col-span-4) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-4 sticky top-[132px]">
          {selectedProduct && (
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-container flex flex-col gap-4">
              {/* Product Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[26px]">
                      {selectedProduct.category === 'Electronics' ? 'mouse' : selectedProduct.isPerishable ? 'nutrition' : 'inventory_2'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-primary">{selectedProduct.sku}</span>
                      {selectedProduct.totalStock <= selectedProduct.minStock && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-bold">
                          Critical Deficit
                        </span>
                      )}
                    </div>
                    <h2 className="font-headline text-base font-bold text-on-surface leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <span className="text-[11px] text-secondary">Supplier: {selectedProduct.supplier}</span>
                  </div>
                </div>
              </div>

              {/* Product Visual Context Image */}
              <div className="w-full h-32 rounded-xl bg-surface-container overflow-hidden relative border border-surface-container">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-2.5">
                  <div className="flex items-center justify-between w-full text-inverse-on-surface font-mono text-[10px]">
                    <span>Barcode: {selectedProduct.barcode}</span>
                    <span>Batch: {selectedProduct.batchNumber}</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Physical Location Distribution */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
                    Location Distribution
                  </span>
                  <span className="font-mono text-xs text-on-surface font-bold">
                    Total: {selectedProduct.totalStock} {selectedProduct.uom}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs border border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">warehouse</span>
                      <span>WH1: Central Store</span>
                    </div>
                    <span className="font-mono font-bold">
                      {((selectedProduct.locations && selectedProduct.locations['wh1-store']) || 0)} {selectedProduct.uom}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs border border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">precision_manufacturing</span>
                      <span>WH2: Production Floor</span>
                    </div>
                    <span className="font-mono font-bold">
                      {((selectedProduct.locations && selectedProduct.locations['wh2-prod']) || 0)} {selectedProduct.uom}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic AI ROP Stress Calculator Module */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                    <span className="text-xs font-bold text-on-surface">Dynamic ROP Calculator</span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
                    AI Recommended
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center py-1">
                  <div className="p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <div className="font-mono text-[9px] text-secondary">Daily Demand</div>
                    <div className="font-mono text-xs font-bold text-on-surface">{selectedProduct.dailyDemand} /day</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <div className="font-mono text-[9px] text-secondary">Lead Time</div>
                    <div className="font-mono text-xs font-bold text-on-surface">{selectedProduct.leadTimeDays} Days</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <div className="font-mono text-[9px] text-secondary">Safety Stock</div>
                    <div className="font-mono text-xs font-bold text-on-surface">{selectedProduct.safetyStock} {selectedProduct.uom}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-surface-container font-mono text-[11px]">
                  <span className="text-secondary">Formula ({selectedProduct.dailyDemand}×{selectedProduct.leadTimeDays})+{selectedProduct.safetyStock}:</span>
                  <span className="font-bold text-primary font-mono">
                    {((selectedProduct.dailyDemand * selectedProduct.leadTimeDays) + selectedProduct.safetyStock).toFixed(1)} {selectedProduct.uom}
                  </span>
                </div>
              </div>

              {/* 1-Click Operational Direct Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => generateDraftPO(selectedProduct.sku, 50)}
                  className="w-full h-10 px-4 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                  <span>Generate PO to {selectedProduct.supplier} (+50)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => triggerToast(`Barcode generated for [${selectedProduct.sku}]`)}
                    className="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">qr_code_scanner</span>
                    <span>Print Barcode</span>
                  </button>

                  <button
                    onClick={onOpenTransferModal}
                    className="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">sync_alt</span>
                    <span>Internal Move</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
