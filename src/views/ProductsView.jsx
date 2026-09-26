import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';
import {
  Package,
  Search,
  Download,
  Plus,
  AlertTriangle,
  SlidersHorizontal,
  Boxes,
  PlusCircle,
  Eye,
  X,
  Warehouse,
  Barcode
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
    totalValuation,
    lowStockCount,
    triggerToast
  } = useInventory();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inspectProduct, setInspectProduct] = useState(null);

  // Helper for dynamic stock level visual
  const getStockBadge = (totalStock, minStock) => {
    const ratio = minStock > 0 ? totalStock / minStock : 1;
    if (ratio <= 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold bg-error-container/30 text-error border border-error/30">
          <AlertTriangle className="w-3 h-3" /> Critical ({totalStock})
        </span>
      );
    } else if (ratio <= 1.35) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Low ({totalStock})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Healthy ({totalStock})
        </span>
      );
    }
  };

  // Filter products
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
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'in_stock' && !isLow) ||
      (statusFilter === 'low_stock' && isLow);

    return matchCat && matchSearch && matchWarehouse && matchStatus;
  });

  const handleExport = () => {
    exportToCSV(products, 'StockSense_Product_Catalog');
    triggerToast('Product catalog exported as CSV!');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-1 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              Products &amp; Inventory Catalog
            </h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary-container text-white font-bold">
              {products.length} SKUs Managed
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Real-time stock ledger tracking physical allocations, safety reorder limits, and continuous inventory valuation.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-surface-container shadow-2xs"
          >
            <Download className="w-4 h-4 text-secondary" />
            <span>Export CSV</span>
          </button>

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

      {/* 2. Filter & Search Toolbar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-card-depth flex flex-col gap-3 border border-surface-container">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, product name, barcode, or supplier..."
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
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">Healthy Stock</option>
              <option value="low_stock">Critical / Below Min</option>
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
            { id: 'perishables', label: 'Perishables' },
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setCategoryFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                categoryFilter === chip.id
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-surface-container'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Clean Full-Width Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card-depth overflow-hidden border border-surface-container">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container">
                <th className="py-3 px-4">Product &amp; SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Unit</th>
                <th className="py-3 px-3 text-right">Cost Price</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4">Location Split</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-surface-container">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Boxes className="w-8 h-8 text-secondary/40" />
                      <span>No products match the selected filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const isLow = p.totalStock <= p.minStock;
                  const storeQty = (p.locations && p.locations['wh1-store']) || 0;
                  const prodQty = (p.locations && p.locations['wh2-prod']) || 0;

                  return (
                    <tr
                      key={p.sku}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-light shrink-0 border border-surface-container">
                            <Package className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface">{p.name}</span>
                            <span className="font-mono text-[10px] text-primary-light font-bold">{p.sku}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-secondary font-medium">
                          {p.category}
                        </span>
                      </td>

                      {/* Unit */}
                      <td className="py-3.5 px-3 text-center font-mono text-secondary">
                        {p.uom}
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-3 text-right font-mono font-medium text-on-surface">
                        ₹{p.costPrice}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-tertiary">
                        ₹{p.sellingPrice}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {getStockBadge(p.totalStock, p.minStock)}
                          <span className="text-[10px] text-secondary font-mono">
                            Min: {p.minStock} {p.uom}
                          </span>
                        </div>
                      </td>

                      {/* Location Split */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-secondary">
                        <div className="flex flex-col gap-0.5">
                          <span>WH1 Store: <strong className="text-on-surface">{storeQty}</strong></span>
                          <span>WH2 Floor: <strong className="text-on-surface">{prodQty}</strong></span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenQuickRestockModal?.(p.sku)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Quick Inbound Stock Receive"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Receive</span>
                          </button>

                          <button
                            onClick={() => onOpenAdjustmentModal?.()}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors border border-surface-container"
                            title="Audit / Adjust Stock"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setInspectProduct(p)}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors border border-surface-container"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
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

      {/* 4. Product Details Modal (Inspect) */}
      {inspectProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-surface-container shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center font-bold">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-primary-light">{inspectProduct.sku}</span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">{inspectProduct.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setInspectProduct(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[10px] text-secondary uppercase font-bold">Category</span>
                <p className="text-sm font-semibold text-on-surface mt-0.5">{inspectProduct.category}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[10px] text-secondary uppercase font-bold">Total Stock</span>
                <p className="text-sm font-semibold text-on-surface mt-0.5">{inspectProduct.totalStock} {inspectProduct.uom}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[10px] text-secondary uppercase font-bold">Cost Price</span>
                <p className="text-sm font-semibold text-on-surface mt-0.5">₹{inspectProduct.costPrice}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[10px] text-secondary uppercase font-bold">Selling Price</span>
                <p className="text-sm font-semibold text-tertiary mt-0.5">₹{inspectProduct.sellingPrice}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[10px] text-secondary uppercase font-bold">Supplier</span>
                <p className="text-sm font-semibold text-on-surface mt-0.5">{inspectProduct.supplier || 'Tata Steel Ltd.'}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="text-[10px] text-secondary uppercase font-bold">Barcode</span>
                <p className="text-sm font-mono font-semibold text-on-surface mt-0.5">{inspectProduct.barcode}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
              <span className="text-[10px] text-secondary uppercase font-bold">Location Breakdown</span>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>WH1 Central Store:</span>
                <strong className="text-on-surface">{inspectProduct.locations?.['wh1-store'] || 0} {inspectProduct.uom}</strong>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>WH2 Manufacturing Floor:</span>
                <strong className="text-on-surface">{inspectProduct.locations?.['wh2-prod'] || 0} {inspectProduct.uom}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setInspectProduct(null);
                  onOpenQuickRestockModal?.(inspectProduct.sku);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
              >
                + Receive Stock
              </button>
              <button
                onClick={() => setInspectProduct(null)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
