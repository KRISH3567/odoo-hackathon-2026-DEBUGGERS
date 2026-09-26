import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';
import {
  Printer,
  FileSpreadsheet,
  Search,
  Inbox,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function StockLedgerView() {
  const { ledger, triggerToast } = useInventory();

  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLedger = ledger.filter(item => {
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    const matchSearch = searchTerm === '' ||
      item.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.to.toLowerCase().includes(searchTerm.toLowerCase());

    return matchType && matchSearch;
  });

  const handleExport = () => {
    exportToCSV(ledger, 'StockSense_Double_Entry_Ledger');
    triggerToast('Double-entry Stock Ledger exported as CSV!');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>StockSense IMS</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-on-surface font-semibold">Move History</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              The Double-Entry Stock Ledger
            </h1>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-bold border border-tertiary/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Append-Only Audit Trail
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            The single source of truth for all inventory movements. Every debit strictly balanced with a credit location.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-surface-container shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-card-depth border border-surface-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All Entries (${ledger.length})` },
            { id: 'receipt', label: 'Receipts (Inbound)' },
            { id: 'delivery', label: 'Deliveries (Outbound)' },
            { id: 'transfer', label: 'Internal Moves' },
            { id: 'adjustment', label: 'Adjustments / Scrap' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                typeFilter === tab.id
                  ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                  : 'text-secondary hover:bg-surface-container hover:text-on-surface border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Reference, SKU or Location..."
            className="w-full h-9 pl-8 pr-3 bg-surface-container-low text-xs text-on-surface rounded-lg outline-none focus:ring-1 focus:ring-primary border border-surface-container"
          />
        </div>
      </div>

      {/* Ledger Table (Append-only: No edit or delete actions) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card-depth overflow-hidden border border-surface-container">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container">
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Date &amp; Time</th>
                <th className="py-2.5 px-3">Product Name &amp; SKU</th>
                <th className="py-2.5 px-3">From Location (Credit)</th>
                <th className="py-2.5 px-3">To Location (Debit)</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3 text-right">Valuation (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-surface-container font-body">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="w-8 h-8 text-secondary/50" />
                      <span>No ledger moves match the current filter.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLedger.map((item) => {
                  const isPositive = Number(item.quantity) > 0 && item.type === 'receipt';
                  const isNegative = item.type === 'delivery' || item.type === 'adjustment' || Number(item.quantity) < 0;

                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-primary-light">
                        {item.ref}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-secondary">
                        {item.timestamp}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-on-surface">{item.productName}</div>
                        <div className="font-mono text-[10px] text-secondary">{item.sku}</div>
                      </td>

                      <td className="py-2.5 px-3 text-secondary font-medium">
                        {item.from}
                      </td>

                      <td className="py-2.5 px-3 text-on-surface font-medium">
                        {item.to}
                      </td>

                      <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                        isPositive ? 'text-tertiary' : (isNegative ? 'text-error' : 'text-on-surface')
                      }`}>
                        {isPositive ? `+${item.quantity}` : item.quantity} {item.uom}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-medium text-secondary">
                        ₹{(item.costValue || 0).toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                          Done
                        </span>
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
  );
}
