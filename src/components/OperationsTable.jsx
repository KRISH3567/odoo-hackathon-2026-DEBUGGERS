import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';
import {
  Search,
  FileSpreadsheet,
  ArrowRight,
  Printer,
  CheckCircle2,
  Clock,
  FileEdit,
  Inbox,
  ArrowDownLeft,
  Truck,
  ArrowLeftRight,
  SlidersHorizontal
} from 'lucide-react';

export default function OperationsTable({
  onOpenSlipModal
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 animate-pulse">
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'receipt':
        return <ArrowDownLeft className="w-3.5 h-3.5 text-purple-400" />;
      case 'delivery':
        return <Truck className="w-3.5 h-3.5 text-blue-400" />;
      case 'transfer':
        return <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />;
      case 'adjustment':
      default:
        return <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 shadow-xl flex flex-col gap-4">
      {/* Top Controls: Tabs and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'receipt', label: 'Inbound Receipts' },
            { id: 'delivery', label: 'Outbound Deliveries' },
            { id: 'transfer', label: 'Internal Moves' },
            { id: 'adjustment', label: 'Cycle Counts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={() => {
            exportToCSV(operations, 'StockSense_Operations_Export');
            triggerToast('Operations data exported as CSV');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all self-end sm:self-auto shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Reference, SKU or Partner..."
            className="w-full h-9 pl-9 pr-3 bg-slate-900/60 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-purple-500/50 transition-all border border-slate-800"
          />
        </div>

        <div>
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="w-full h-9 px-3 bg-slate-900/60 rounded-xl text-xs text-slate-200 outline-none cursor-pointer focus:border-purple-500/50 border border-slate-800 font-medium"
          >
            <option value="all">All Warehouses (Global)</option>
            <option value="wh1">WH1: Central Warehouse</option>
            <option value="wh2">WH2: Manufacturing Plant</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 px-3 bg-slate-900/60 rounded-xl text-xs text-slate-200 outline-none cursor-pointer focus:border-purple-500/50 border border-slate-800 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="done">Done (Validated)</option>
            <option value="ready">Ready (Awaiting)</option>
            <option value="waiting">Waiting</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-3">Route / Partner</th>
              <th className="py-3 px-3">Product (SKU)</th>
              <th className="py-3 px-3 text-right">Quantity</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs text-slate-200">
            {filteredOps.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-slate-500" />
                    <span className="font-medium">No operations found matching current filters.</span>
                    <button
                      onClick={() => {
                        setActiveTab('all');
                        setSearchTerm('');
                        setWarehouseFilter('all');
                        setStatusFilter('all');
                      }}
                      className="text-xs text-purple-400 hover:underline font-semibold mt-1"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOps.map((op) => {
                const qtyVal = op.quantity || op.qty || 0;
                return (
                  <tr key={op.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-purple-300">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(op.type)}
                        <span>{op.ref}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <span>{op.partner}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-400">{op.destLocation}</span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">{op.subLocation}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{op.productName}</div>
                      <div className="font-mono text-[10px] text-purple-400">{op.sku}</div>
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-bold ${
                      op.type === 'receipt' 
                        ? 'text-emerald-400' 
                        : (op.type === 'delivery' || op.type === 'adjustment' ? 'text-rose-400' : 'text-slate-200')
                    }`}>
                      {op.type === 'receipt' 
                        ? `+${qtyVal}` 
                        : (op.type === 'delivery' || op.type === 'adjustment' ? `-${qtyVal}` : qtyVal)} {op.uom}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(op.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {op.type === 'receipt' && op.status !== 'done' && (
                          <button
                            onClick={() => validateReceipt(op.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Receive
                          </button>
                        )}

                        {op.type === 'transfer' && op.status !== 'done' && (
                          <button
                            onClick={() => validateTransfer(op.id)}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Transfer
                          </button>
                        )}

                        {op.type === 'delivery' && op.status === 'ready' && (
                          <button
                            onClick={() => validateDelivery(op.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Ship
                          </button>
                        )}

                        {op.type === 'delivery' && op.status === 'draft' && (
                          <button
                            onClick={() => advanceDeliveryStep(op.id, 'ready')}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Pick &amp; Pack
                          </button>
                        )}

                        <button
                          onClick={() => onOpenSlipModal(op)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 border border-slate-700"
                          title="Print official document slip"
                        >
                          <Printer className="w-3 h-3 text-slate-400" />
                          <span>Slip</span>
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
  );
}
