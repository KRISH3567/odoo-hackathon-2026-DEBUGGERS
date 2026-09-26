import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';

export default function OperationsTable({ onOpenSlipModal }) {
  const {
    operations,
    validateReceipt,
    validateTransfer,
    validateDelivery,
    advanceDeliveryStep,
    triggerToast
  } = useInventory();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter operations list
  const filteredOps = operations.filter(op => {
    const matchTab = activeTab === 'all' || op.type === activeTab;
    const matchSearch = searchTerm === '' ||
      op.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.partner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchWarehouse = warehouseFilter === 'all' ||
      (warehouseFilter === 'wh1' && (op.sourceLocation.includes('WH1') || op.destLocation.includes('WH1'))) ||
      (warehouseFilter === 'wh2' && (op.sourceLocation.includes('WH2') || op.destLocation.includes('WH2')));

    const matchStatus = statusFilter === 'all' || op.status === statusFilter;

    return matchTab && matchSearch && matchWarehouse && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-800">
            Done
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-800">
            Ready
          </span>
        );
      case 'waiting':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800">
            Waiting
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-700">
            Draft
          </span>
        );
    }
  };

  return (
    <section className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-surface-container">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface">
            Operations Hub & Live Stock Moves
          </h3>
          <p className="text-xs text-secondary">
            Multi-warehouse ledger tracking live picking, transfers, adjustments and incoming manifests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              exportToCSV(operations, 'StockSense_Operations_Export');
              triggerToast('Operations data exported as CSV');
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => triggerToast('Refreshing live double-entry sync...')}
            className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
            title="Sync Ledger"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
          </button>
        </div>
      </div>

      {/* Filter Tab Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-surface-container">
        {[
          { id: 'all', label: 'All Operations' },
          { id: 'receipt', label: 'Receipts (Incoming)' },
          { id: 'delivery', label: 'Deliveries (Outgoing)' },
          { id: 'transfer', label: 'Internal Transfers' },
          { id: 'adjustment', label: 'Adjustments' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Granular Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-secondary">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Reference, SKU or Entity..."
            className="w-full h-9 pl-8 pr-3 bg-surface-container-low rounded-lg text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="relative flex items-center">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="w-full h-9 pl-3 pr-8 bg-surface-container-low rounded-lg text-xs text-on-surface appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Warehouses (Global)</option>
            <option value="wh1">WH1: Central Warehouse</option>
            <option value="wh2">WH2: Manufacturing Plant</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 text-[16px] text-secondary pointer-events-none">
            expand_more
          </span>
        </div>

        <div className="relative flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 pl-3 pr-8 bg-surface-container-low rounded-lg text-xs text-on-surface appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="done">Done</option>
            <option value="ready">Ready</option>
            <option value="waiting">Waiting</option>
            <option value="draft">Draft</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 text-[16px] text-secondary pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {/* Operations Data Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Reference ID</th>
              <th className="py-2.5 px-3">Route / Partners</th>
              <th className="py-2.5 px-3">Product (SKU)</th>
              <th className="py-2.5 px-3 text-right">Quantity</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-xs text-on-surface font-body">
            {filteredOps.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-secondary">
                  No operations found matching current filters.
                </td>
              </tr>
            ) : (
              filteredOps.map((op) => (
                <tr key={op.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">
                    {op.ref}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1 font-semibold">
                      <span>{op.partner}</span>
                      <span className="material-symbols-outlined text-[14px] text-secondary">arrow_forward</span>
                      <span className="text-secondary">{op.destLocation}</span>
                    </div>
                    <div className="font-mono text-[10px] text-secondary">{op.subLocation}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold">{op.productName}</div>
                    <div className="font-mono text-[10px] text-secondary">{op.sku}</div>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                    op.type === 'receipt' ? 'text-tertiary' : (op.type === 'delivery' || op.type === 'adjustment' ? 'text-error' : 'text-on-surface')
                  }`}>
                    {op.type === 'receipt' ? `+${op.quantity}` : (op.type === 'delivery' || op.type === 'adjustment' ? `-${op.quantity}` : op.quantity)} {op.uom}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {getStatusBadge(op.status)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {op.type === 'receipt' && op.status !== 'done' && (
                        <button
                          onClick={() => validateReceipt(op.id)}
                          className="px-2.5 py-1 rounded bg-tertiary-container text-on-tertiary text-[11px] font-bold hover:opacity-90 transition-opacity"
                        >
                          Receive
                        </button>
                      )}

                      {op.type === 'transfer' && op.status !== 'done' && (
                        <button
                          onClick={() => validateTransfer(op.id)}
                          className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-[11px] font-bold hover:bg-primary transition-colors"
                        >
                          Validate Transfer
                        </button>
                      )}

                      {op.type === 'delivery' && op.status === 'ready' && (
                        <button
                          onClick={() => validateDelivery(op.id)}
                          className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-fixed text-[11px] font-bold hover:bg-secondary-fixed transition-colors"
                        >
                          Validate Ship
                        </button>
                      )}

                      {op.type === 'delivery' && op.status === 'draft' && (
                        <button
                          onClick={() => advanceDeliveryStep(op.id, 'ready')}
                          className="px-2.5 py-1 rounded bg-primary text-on-primary text-[11px] font-bold hover:opacity-90 transition-colors"
                        >
                          Pick & Pack
                        </button>
                      )}

                      <button
                        onClick={() => onOpenSlipModal(op)}
                        className="px-2 py-1 rounded bg-surface-container text-on-surface text-[11px] font-semibold hover:bg-surface-container-high transition-colors"
                        title="View printable document slip"
                      >
                        Slip
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
