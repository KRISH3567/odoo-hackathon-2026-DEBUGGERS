import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';
import {
  Package,
  Search,
  Upload,
  Download,
  Plus,
  AlertTriangle,
  TrendingUp,
  Warehouse,
  Cpu,
  SlidersHorizontal,
  Zap,
  Sparkles,
  Barcode,
  ArrowRight,
  Boxes,
  PlusCircle
} from 'lucide-react';

export default function ProductsView({
  onOpenNewProductModal,
  onOpenReceiptModal,
  onOpenAdjustmentModal,
  onOpenTransferModal,
  onOpenQuickRestockModal
}) {
  const {
    products,
    selectedProductSku,
    setSelectedProductSku,
    generateDraftPO,
    totalValuation,
    lowStockCount,
    triggerToast
  } = useInventory();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedProduct = products.find(p => p.sku === selectedProductSku) || products[0];

  // Helper for dynamic stock gradient indicator
  const getStockLevelVisual = (totalStock, minStock) => {
    const ratio = minStock > 0 ? totalStock / minStock : 1;
    if (ratio <= 1) {
      return {
        status: 'Critical Deficit',
        badgeClass: 'bg-error-container/30 text-error border-error/30',
        barGradient: 'bg-gradient-to-r from-rose-600 to-red-500',
        glowClass: 'shadow-[0_0_10px_rgba(244,63,94,0.4)]',
        textColor: 'text-error'
      };
    } else if (ratio <= 1.35) {
      return {
        status: 'Approaching ROP',
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        barGradient: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400',
        glowClass: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
        textColor: 'text-amber-400'
      };
    } else {
      return {
        status: 'Safe Stock',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        barGradient: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400',
        glowClass: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
        textColor: 'text-emerald-400'
      };
    }
  };

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    const matchWarehouse = warehouseFilter === 'all' ||
      (warehouseFilter === 'wh1' && ((p.locations && p.locations['wh1-store']) || 0) > 0) ||
      (warehouseFilter === 'wh2' && ((p.locations && p.locations['wh2-prod']) || 0) > 0);

    const isLow = p.totalStock <= p.minStock;
    const isPerish = p.isPerishable;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'in_stock' && !isLow) ||
      (statusFilter === 'low_stock' && isLow) ||
      (statusFilter === 'fefo' && isPerish);

    return matchCat && matchSearch && matchWarehouse && matchStatus;
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
            <span>StockSense IMS</span>
            <span className="text-secondary/60">/</span>
            <span>Products &amp; Inventory</span>
            <span className="text-secondary/60">/</span>
            <span className="text-on-surface font-semibold">Catalog Management</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              Products &amp; Inventory Catalog
            </h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-secondary-container text-on-surface font-bold border border-surface-container">
              {products.length} SKUs Managed
            </span>
          </div>
          <p className="text-xs text-secondary max-w-3xl">
            Real-time stock ledger tracking physical allocations, velocity-adjusted ROP limits, and FIFO inventory valuation in INR.
          </p>
        </div>

        {/* Action Suite */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => triggerToast('Select CSV file to import products...')}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-surface-container shadow-2xs"
          >
            <Upload className="w-4 h-4 text-secondary" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-surface-container shadow-2xs"
          >
            <Download className="w-4 h-4 text-secondary" />
            <span>Export Catalog</span>
          </button>
          {onOpenReceiptModal && (
            <button
              onClick={() => onOpenReceiptModal()}
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-surface-container shadow-2xs"
            >
              <span>+ Inbound PO</span>
            </button>
          )}
          <button
            onClick={() => onOpenQuickRestockModal?.()}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all active:scale-95 shadow-2xs"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Receive Stock</span>
          </button>
          <button
            onClick={onOpenNewProductModal}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active SKUs */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-secondary uppercase tracking-wider font-bold">Active SKUs</span>
            <span className="font-mono text-[11px] text-tertiary flex items-center gap-0.5 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +3 this wk
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface">{products.length}</span>
            <span className="text-xs text-secondary">across 4 categories</span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-secondary font-mono text-[10px] bg-surface-container-low px-2 py-1 rounded-lg border border-surface-container">
            <span>Raw: 4</span>
            <span>•</span>
            <span>Finished: 4</span>
            <span>•</span>
            <span>Perishables: 2</span>
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-secondary uppercase tracking-wider font-bold">Total Valuation</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-container/30 text-primary-light font-bold border border-primary/20">
              INR Basis
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface">
              ₹{totalValuation.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-secondary text-xs bg-surface-container-low px-2 py-1 rounded-lg border border-surface-container">
            <span className="text-tertiary font-semibold">Continuous FIFO Sync</span>
            <span className="font-mono text-[10px]">Real-Time</span>
          </div>
        </div>

        {/* Below ROP Alert */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col justify-between border border-error-container/40">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-error uppercase tracking-wider font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Below Reorder Point
            </span>
            <span className="flex h-2 w-2 rounded-full bg-error animate-ping"></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-error">{lowStockCount}</span>
            <span className="text-xs text-secondary">SKUs require replenishment</span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-error font-mono text-[10px] bg-error-container/20 px-2 py-1 rounded-lg border border-error/30">
            <span className="font-bold">ELEC-MOU-001 (8 units)</span>
            <button
              onClick={() => generateDraftPO('ELEC-MOU-001', 50)}
              className="underline cursor-pointer font-bold hover:text-white"
            >
              Auto-Order
            </button>
          </div>
        </div>

        {/* Active Storage Nodes */}
        <div className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-secondary uppercase tracking-wider font-bold">Active Facilities</span>
            <span className="font-mono text-[10px] text-secondary">WH1 &amp; WH2</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-2xl font-bold text-on-surface">5 Physical Bins</span>
            <span className="text-xs text-tertiary font-semibold">100% Active</span>
          </div>
          <div className="mt-3 pt-1 flex items-center justify-between text-secondary font-mono text-[10px] bg-surface-container-low px-2 py-1 rounded-lg border border-surface-container">
            <span>WH1 Store: 3</span>
            <span>•</span>
            <span>WH2 Plant: 2</span>
          </div>
        </div>
      </div>

      {/* Dual Column Layout: Grid Table (70%) + Detail Drawer (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Bar & Table (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Filter & Search Toolbar */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-card-depth flex flex-col gap-3 border border-surface-container">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU, Product Name, Barcode, or Supplier..."
                  className="w-full h-9 pl-9 pr-4 bg-surface-container-low text-on-surface text-xs rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg outline-none cursor-pointer border border-surface-container"
                >
                  <option value="all">All Locations (Consolidated)</option>
                  <option value="wh1">WH1: Central Warehouse</option>
                  <option value="wh2">WH2: Manufacturing Plant</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg outline-none cursor-pointer border border-surface-container"
                >
                  <option value="all">All Statuses</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Under ROP Threshold</option>
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
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                    categoryFilter === chip.id
                      ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-surface-container'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Data Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card-depth overflow-hidden border border-surface-container">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container">
                    <th className="py-2.5 px-3">Product &amp; SKU</th>
                    <th className="py-2.5 px-3 text-center">UoM</th>
                    <th className="py-2.5 px-3 text-right">Cost / Price</th>
                    <th className="py-2.5 px-3 text-right">Stock Level Indicator</th>
                    <th className="py-2.5 px-3">Location Allocation</th>
                    <th className="py-2.5 px-3 text-center">Batch / Shelf</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-on-surface divide-y divide-surface-container">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-secondary">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Boxes className="w-8 h-8 text-secondary/50" />
                          <span>No products match the selected filters.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const isSelected = p.sku === selectedProductSku;
                      const visual = getStockLevelVisual(p.totalStock, p.minStock);
                      const isLow = p.totalStock <= p.minStock;

                      const storeQty = (p.locations && p.locations['wh1-store']) || 0;
                      const prodQty = (p.locations && p.locations['wh2-prod']) || 0;

                      const totalSafe = Math.max(1, p.totalStock);
                      const storePct = Math.round((storeQty / totalSafe) * 100);
                      const prodPct = Math.round((prodQty / totalSafe) * 100);
                      const otherPct = Math.max(0, 100 - storePct - prodPct);

                      return (
                        <tr
                          key={p.sku}
                          onClick={() => setSelectedProductSku(p.sku)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-primary-container/20 border-l-4 border-l-primary'
                              : 'hover:bg-surface-container-low'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-light shrink-0 border border-surface-container">
                                <Package className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-on-surface">{p.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] text-primary-light font-bold">{p.sku}</span>
                                  <span className="font-mono text-[10px] px-1 rounded bg-surface-container text-secondary">
                                    {p.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center font-mono text-secondary">
                            {p.uom}
                          </td>

                          <td className="py-3 px-3 text-right font-mono">
                            <div className="font-medium text-on-surface">₹{p.costPrice}</div>
                            <div className="text-[10px] text-tertiary font-semibold">₹{p.sellingPrice}</div>
                          </td>

                          {/* Gradient Fill Stock Level Indicator */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-mono font-bold ${visual.textColor}`}>
                                  {p.totalStock} {p.uom}
                                </span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold border ${visual.badgeClass}`}>
                                  {visual.status}
                                </span>
                              </div>
                              {/* Stock ratio gauge with smooth gradient fill */}
                              <div className="w-32 h-1.5 rounded-full bg-surface-container overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${visual.barGradient} ${visual.glowClass}`}
                                  style={{
                                    width: `${Math.min(100, Math.max(8, (p.totalStock / (p.minStock * 2 || 1)) * 100))}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* Multi-Location Allocation Bar */}
                          <td className="py-3 px-3">
                            <div className="flex flex-col gap-1 w-36">
                              <div className="flex items-center justify-between font-mono text-[10px] text-secondary">
                                <span>WH1: {storeQty}</span>
                                <span>WH2: {prodQty}</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden flex">
                                <div className="bg-primary h-full" style={{ width: `${storePct}%` }}></div>
                                <div className="bg-secondary h-full" style={{ width: `${prodPct}%` }}></div>
                                <div className="bg-tertiary h-full" style={{ width: `${otherPct}%` }}></div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            {p.isPerishable ? (
                              <span className="font-mono text-[10px] font-bold text-error bg-error-container/20 px-2 py-0.5 rounded-full border border-error/30">
                                Exp: {p.expDays}d
                              </span>
                            ) : (
                              <span className="font-mono text-[10px] text-secondary">{p.batchNumber}</span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenQuickRestockModal?.(p.sku);
                                }}
                                className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                                title="Quick Inbound Stock Receive"
                              >
                                <PlusCircle className="w-3 h-3" />
                                <span>Receive</span>
                              </button>

                              {isLow ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    generateDraftPO(p.sku, 50);
                                  }}
                                  className="px-2 py-1 rounded bg-primary text-white font-mono text-[10px] font-bold hover:bg-primary-hover shadow-2xs"
                                >
                                  Auto PO
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProductSku(p.sku);
                                  }}
                                  className="px-2 py-1 rounded bg-surface-container text-on-surface font-semibold text-[11px] hover:bg-surface-container-high border border-surface-container"
                                >
                                  Inspect
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenAdjustmentModal();
                                }}
                                className="p-1 rounded hover:bg-surface-container text-secondary hover:text-on-surface"
                                title="Audit & Adjust Stock"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Detail Intelligence Drawer (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sticky top-[132px]">
          {selectedProduct && (
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card-depth border border-surface-container flex flex-col gap-4">
              {/* Product Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center font-bold shadow-purple-glow">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-primary-light">{selectedProduct.sku}</span>
                      {selectedProduct.totalStock <= selectedProduct.minStock && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-error-container text-white font-bold">
                          Critical Deficit
                        </span>
                      )}
                    </div>
                    <h2 className="font-headline text-base font-bold text-on-surface leading-tight mt-0.5">
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
                <div className="absolute inset-0 bg-gradient-to-t from-navy-base/90 via-transparent to-transparent flex items-end p-2.5">
                  <div className="flex items-center justify-between w-full text-white font-mono text-[10px]">
                    <span className="flex items-center gap-1"><Barcode className="w-3 h-3" /> {selectedProduct.barcode}</span>
                    <span>Batch: {selectedProduct.batchNumber}</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Physical Location Distribution */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-secondary font-bold">
                    Multi-Bin Allocation
                  </span>
                  <span className="font-mono text-xs text-on-surface font-bold">
                    Total: {selectedProduct.totalStock} {selectedProduct.uom}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs border border-surface-container">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-primary" />
                      <span>WH1: Central Store</span>
                    </div>
                    <span className="font-mono font-bold text-on-surface">
                      {((selectedProduct.locations && selectedProduct.locations['wh1-store']) || 0)} {selectedProduct.uom}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs border border-surface-container">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-secondary" />
                      <span>WH2: Production Floor</span>
                    </div>
                    <span className="font-mono font-bold text-on-surface">
                      {((selectedProduct.locations && selectedProduct.locations['wh2-prod']) || 0)} {selectedProduct.uom}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic AI ROP Stress Calculator Module */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-on-surface">Dynamic ROP Calculator</span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary-container/40 text-primary-light font-bold border border-primary/30">
                    Odoo Formula
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center py-1">
                  <div className="p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <div className="font-mono text-[9px] text-secondary">Daily Demand</div>
                    <div className="font-mono text-xs font-bold text-on-surface">{selectedProduct.dailyDemand} /d</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <div className="font-mono text-[9px] text-secondary">Lead Time</div>
                    <div className="font-mono text-xs font-bold text-on-surface">{selectedProduct.leadTimeDays}d</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-container-lowest border border-surface-container">
                    <div className="font-mono text-[9px] text-secondary">Safety Stock</div>
                    <div className="font-mono text-xs font-bold text-on-surface">{selectedProduct.safetyStock} {selectedProduct.uom}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface-container font-mono text-[11px] border border-surface-container">
                  <span className="text-secondary">Reorder Threshold:</span>
                  <span className="font-bold text-primary-light font-mono">
                    {((selectedProduct.dailyDemand * selectedProduct.leadTimeDays) + selectedProduct.safetyStock).toFixed(1)} {selectedProduct.uom}
                  </span>
                </div>
              </div>

              {/* 1-Click Operational Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => onOpenQuickRestockModal?.(selectedProduct.sku)}
                  className="w-full h-10 px-4 rounded-xl bg-tertiary text-navy-base text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Quick Inbound Stock (+Receive)</span>
                </button>

                <button
                  onClick={() => generateDraftPO(selectedProduct.sku, 50)}
                  className="w-full h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-purple-glow"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Generate PO to {selectedProduct.supplier} (+50)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => triggerToast(`Barcode generated for [${selectedProduct.sku}]`)}
                    className="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-surface-container shadow-2xs"
                  >
                    <Barcode className="w-3.5 h-3.5 text-secondary" />
                    <span>Print Tag</span>
                  </button>

                  <button
                    onClick={onOpenTransferModal}
                    className="h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-surface-container shadow-2xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                    <span>Transfer</span>
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
