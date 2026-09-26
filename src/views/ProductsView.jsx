import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';
import {
  Package,
  Search,
  Download,
  Plus,
  AlertTriangle,
  PlusCircle,
  Eye,
  X,
  Edit2,
  Trash2,
  Save,
  Tag,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function ProductsView({
  onOpenNewProductModal,
  onOpenAdjustmentModal: _onOpenAdjustmentModal,
  onOpenQuickRestockModal,
  onOpenLabelsModal
}) {
  const { products, user, updateProduct, deleteProduct, triggerToast } = useInventory();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inspectProduct, setInspectProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCost, setEditCost] = useState(0);
  const [editPrice, setEditPrice] = useState(0);
  const [editMinStock, setEditMinStock] = useState(0);
  const [editSupplier, setEditSupplier] = useState('');

  const getStockStatus = (totalStock, minStock) => {
    const ratio = minStock > 0 ? totalStock / minStock : 1;
    if (ratio <= 1) return { label: 'Critical', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    if (ratio <= 1.35) return { label: 'Low', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  };

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode || '').includes(searchQuery);
    const isLow = p.totalStock <= p.minStock;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'healthy' && !isLow) ||
      (statusFilter === 'low' && isLow);
    return matchCat && matchSearch && matchStatus;
  });

  const lowCount = products.filter(p => p.totalStock <= p.minStock).length;

  const handleExport = () => {
    exportToCSV(products, 'StockSense_Products');
    triggerToast('Exported to CSV!');
  };

  const handleOpenInspect = (p) => {
    setInspectProduct(p);
    setIsEditing(false);
    setEditName(p.name);
    setEditCost(p.costPrice);
    setEditPrice(p.sellingPrice);
    setEditMinStock(p.minStock);
    setEditSupplier(p.supplier || '');
  };

  const handleSaveEdit = () => {
    if (!inspectProduct) return;
    const updated = {
      name: editName.trim() || inspectProduct.name,
      costPrice: Number(editCost),
      sellingPrice: Number(editPrice),
      minStock: Number(editMinStock),
      supplier: editSupplier.trim() || inspectProduct.supplier
    };
    updateProduct(inspectProduct.sku, updated);
    setInspectProduct({ ...inspectProduct, ...updated });
    setIsEditing(false);
    triggerToast('Product updated!');
  };

  const handleDelete = () => {
    if (!inspectProduct) return;
    if (window.confirm(`Delete "${inspectProduct.name}" (${inspectProduct.sku})?`)) {
      deleteProduct(inspectProduct.sku);
      setInspectProduct(null);
      triggerToast('Product removed from catalog.');
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Products
            <span className="ml-3 text-sm font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full align-middle">
              {products.length} SKUs
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Full inventory catalog — add, track and manage every product
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {user.role === 'manager' && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
          <button
            onClick={() => onOpenQuickRestockModal?.()}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Receive Stock
          </button>
          {user.role === 'manager' && (
            <button
              onClick={onOpenNewProductModal}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Pills ── */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
          <Package className="w-4 h-4 text-purple-400" />
          <span className="text-white font-bold">{products.length}</span>
          <span className="text-slate-400">Total Products</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold">
            ₹{products.reduce((s, p) => s + p.totalStock * p.costPrice, 0).toLocaleString('en-IN')}
          </span>
          <span className="text-slate-400">Stock Value</span>
        </div>
        {lowCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-bold">{lowCount}</span>
            <span className="text-red-400/70">Below Min Stock</span>
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        {/* Search + Status */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU or barcode…"
              className="w-full h-9 pl-9 pr-4 bg-slate-800 text-white text-sm rounded-xl outline-none focus:ring-1 focus:ring-purple-500 border border-slate-700 placeholder:text-slate-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 bg-slate-800 text-slate-300 text-sm rounded-xl outline-none border border-slate-700 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy Stock</option>
            <option value="low">Low / Critical</option>
          </select>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {[{ id: 'all', label: 'All' }, ...categories.map(c => ({ id: c, label: c }))].map(chip => (
            <button
              key={chip.id}
              onClick={() => setCategoryFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                categoryFilter === chip.id
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Table ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Cost</th>
                <th className="py-3 px-3 text-right">Sell Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const status = getStockStatus(p.totalStock, p.minStock);
                  return (
                    <tr key={p.sku} className="hover:bg-slate-800/30 transition-colors group">

                      {/* Product Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm leading-tight">{p.name}</p>
                            <p className="text-purple-400 text-[11px] font-mono font-bold">{p.sku}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {p.category}
                        </span>
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-3 text-right font-mono text-sm text-slate-300">
                        ₹{p.costPrice.toLocaleString('en-IN')}
                      </td>

                      {/* Sell Price */}
                      <td className="py-3.5 px-3 text-right font-mono text-sm font-semibold text-emerald-400">
                        ₹{p.sellingPrice.toLocaleString('en-IN')}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${status.color}`}>
                            {status.label === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                            {p.totalStock} {p.uom}
                          </span>
                          <span className="text-[10px] text-slate-500">min {p.minStock}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onOpenQuickRestockModal?.(p.sku)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Receive stock"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            Receive
                          </button>
                          <button
                            onClick={() => onOpenLabelsModal?.(p.sku)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-purple-400 border border-slate-700 transition-colors"
                            title="Print label"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenInspect(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                            title="Inspect / Edit"
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

        {/* Footer count */}
        {filteredProducts.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-800 text-xs text-slate-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>

      {/* ── Inspect / Edit Modal ── */}
      {inspectProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d1322] rounded-2xl max-w-md w-full p-6 border border-slate-700/60 shadow-2xl flex flex-col gap-4">

            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs font-mono font-bold">{inspectProduct.sku}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-base font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-600 outline-none focus:ring-1 focus:ring-purple-500 mt-0.5"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-white">{inspectProduct.name}</h3>
                  )}
                </div>
              </div>
              <button
                onClick={() => setInspectProduct(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fields */}
            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Cost Price (₹)', val: editCost, set: setEditCost, type: 'number' },
                  { label: 'Selling Price (₹)', val: editPrice, set: setEditPrice, type: 'number' },
                  { label: `Min Stock (${inspectProduct.uom})`, val: editMinStock, set: setEditMinStock, type: 'number' },
                  { label: 'Supplier', val: editSupplier, set: setEditSupplier, type: 'text' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      min={f.type === 'number' ? 0 : undefined}
                      value={f.val}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-800 text-sm text-white border border-slate-700 outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Category', val: inspectProduct.category },
                  { label: 'Total Stock', val: `${inspectProduct.totalStock} ${inspectProduct.uom}` },
                  { label: 'Cost Price', val: `₹${inspectProduct.costPrice.toLocaleString('en-IN')}` },
                  { label: 'Selling Price', val: `₹${inspectProduct.sellingPrice.toLocaleString('en-IN')}` },
                  { label: 'Supplier', val: inspectProduct.supplier || '—' },
                  { label: 'Barcode', val: inspectProduct.barcode },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{item.label}</p>
                    <p className="text-sm font-semibold text-white mt-0.5 font-mono">{item.val}</p>
                  </div>
                ))}

                {/* WH location split */}
                <div className="col-span-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Location Split</p>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">WH1 Central</span>
                    <strong className="text-white">{inspectProduct.locations?.['wh1-store'] || 0} {inspectProduct.uom}</strong>
                  </div>
                  <div className="flex justify-between text-xs font-mono mt-1">
                    <span className="text-slate-400">WH2 Floor</span>
                    <strong className="text-white">{inspectProduct.locations?.['wh2-prod'] || 0} {inspectProduct.uom}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <div>
                {user.role === 'manager' && !isEditing && (
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {user.role === 'manager' && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const sku = inspectProduct.sku;
                        setInspectProduct(null);
                        onOpenLabelsModal?.(sku);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-400 flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      Label
                    </button>
                    <button
                      onClick={() => {
                        const sku = inspectProduct.sku;
                        setInspectProduct(null);
                        onOpenQuickRestockModal?.(sku);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
                    >
                      + Receive
                    </button>
                    <button
                      onClick={() => setInspectProduct(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
