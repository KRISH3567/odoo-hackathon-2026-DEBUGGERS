import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';
import {
  Search,
  FileSpreadsheet,
  RotateCcw,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  FileEdit,
  Inbox
} from 'lucide-react';

export default function OperationsTable({
  onOpenSlipModal,
  onOpenReceiptModal,
  onOpenDeliveryModal,
  onOpenTransferModal,
  onOpenAdjustmentModal
}) {
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-primary-container/30 text-primary-light border border-primary/30">
            <Clock className="w-3 h-3" /> Ready
          </span>
        );
      case 'waiting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Waiting
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <FileEdit className="w-3 h-3" /> Draft
          </span>
        );
    }
  };

  return (
    <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-4 border border-surface-container">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface">
            Operations Hub &amp; Live Stock Moves
          </h3>
          <p className="text-xs text-secondary">
            Multi-warehouse ledger tracking live picking, transfers, adjustments and incoming manifests
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenReceiptModal && (
            <button
              onClick={onOpenReceiptModal}
              className="px-2.5 py-1.5 rounded-lg bg-tertiary-container/30 text-tertiary border border-tertiary/30 text-xs font-bold hover:bg-tertiary/20 transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>+ Receipt</span>
            </button>
          )}
          {onOpenDeliveryModal && (
            <button
              onClick={onOpenDeliveryModal}
              className="px-2.5 py-1.5 rounded-lg bg-primary-container text-on-primary border border-primary/30 text-xs font-bold hover:bg-primary transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>+ Delivery</span>
            </button>
          )}
          {onOpenTransferModal && (
            <button
              onClick={onOpenTransferModal}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>⇄ Move</span>
            </button>
          )}
          {onOpenAdjustmentModal && (
            <button
              onClick={onOpenAdjustmentModal}
              className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>± Audit</span>
            </button>
          )}
          <button
            onClick={() => {
              exportToCSV(operations, 'StockSense_Operations_Export');
              triggerToast('Operations data exported as CSV');
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5 border border-surface-container shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => triggerToast('Double-entry engine in sync')}
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors border border-surface-container"
            title="Sync Ledger"
          >
            <RotateCcw className="w-4 h-4" />
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
                ? 'bg-primary-container text-on-primary shadow-xs border border-primary/30'
                : 'text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Granular Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Reference, SKU or Partner..."
            className="w-full h-9 pl-8 pr-3 bg-surface-container-low rounded-lg text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container"
          />
        </div>

        <div className="relative flex items-center">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="w-full h-9 pl-3 pr-8 bg-surface-container-low rounded-lg text-xs text-on-surface appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-primary border border-surface-container font-medium"
          >
            <option value="all">All Warehouses (Global)</option>
            <option value="wh1">WH1: Central Warehouse</option>
            <option value="wh2">WH2: Manufacturing Plant</option>
          </select>
        </div>

        <div className="relative flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 pl-3 pr-8 bg-surface-container-low rounded-lg text-xs text-on-surface appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-primary border border-surface-container font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="done">Done</option>
            <option value="ready">Ready</option>
            <option value="waiting">Waiting</option>
            <option value="draft">Draft</option>
          </select>
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
                <td colSpan="6" className="py-12 text-center text-secondary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-secondary/60" />
                    <span className="font-medium">No operations found matching current filters.</span>
                    <button
                      onClick={() => {
                        setActiveTab('all');
                        setSearchTerm('');
                        setWarehouseFilter('all');
                        setStatusFilter('all');
                      }}
                      className="text-xs text-primary hover:underline font-semibold mt-1"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOps.map((op) => (
                <tr key={op.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary-light">
                    {op.ref}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                      <span>{op.partner}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-secondary">{op.destLocation}</span>
                    </div>
                    <div className="font-mono text-[10px] text-secondary">{op.subLocation}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold">{op.productName}</div>
                    <div className="font-mono text-[10px] text-secondary">{op.sku}</div>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                    op.type === 'receipt' 
                      ? 'text-tertiary' 
                      : (op.type === 'delivery' || op.type === 'adjustment' ? 'text-error' : 'text-on-surface')
                  }`}>
                    {op.type === 'receipt' 
                      ? `+${op.quantity}` 
                      : (op.type === 'delivery' || op.type === 'adjustment' ? `-${op.quantity}` : op.quantity)} {op.uom}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {getStatusBadge(op.status)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {op.type === 'receipt' && op.status !== 'done' && (
                        <button
                          onClick={() => validateReceipt(op.id)}
                          className="px-2.5 py-1 rounded-lg bg-tertiary-container text-tertiary-fixed text-[11px] font-bold hover:bg-tertiary/30 transition-colors border border-tertiary/30"
                        >
                          Receive
                        </button>
                      )}

                      {op.type === 'transfer' && op.status !== 'done' && (
                        <button
                          onClick={() => validateTransfer(op.id)}
                          className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary text-[11px] font-bold hover:bg-primary transition-colors border border-primary/30"
                        >
                          Validate Transfer
                        </button>
                      )}

                      {op.type === 'delivery' && op.status === 'ready' && (
                        <button
                          onClick={() => validateDelivery(op.id)}
                          className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-surface text-[11px] font-bold hover:bg-secondary transition-colors border border-surface-container"
                        >
                          Validate Ship
                        </button>
                      )}

                      {op.type === 'delivery' && op.status === 'draft' && (
                        <button
                          onClick={() => advanceDeliveryStep(op.id, 'ready')}
                          className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary-hover transition-colors shadow-2xs"
                        >
                          Pick &amp; Pack
                        </button>
                      )}

                      <button
                        onClick={() => onOpenSlipModal(op)}
                        className="px-2 py-1 rounded-lg bg-surface-container text-on-surface text-[11px] font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1 border border-surface-container"
                        title="View printable document slip"
                      >
                        <FileText className="w-3 h-3 text-secondary" />
                        <span>Slip</span>
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
