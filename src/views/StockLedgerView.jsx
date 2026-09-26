import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';

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
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Move History</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            The Double-Entry Stock Ledger
          </h1>
          <p className="text-xs text-secondary mt-1">
            The single source of truth for all inventory movements. Every transaction balanced with debit &amp; credit source/destination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">table_chart</span>
            <span>Export Ledger CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                typeFilter === tab.id
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-secondary">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Reference, SKU or Location..."
            className="w-full h-9 pl-8 pr-3 bg-surface-container-low text-xs rounded-lg outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Date &amp; Time</th>
                <th className="py-2.5 px-3">Product Name &amp; SKU</th>
                <th className="py-2.5 px-3">From Location</th>
                <th className="py-2.5 px-3">To Location</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3 text-right">Value (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs text-on-surface divide-y divide-surface-container font-body">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-secondary">
                    No ledger entries found matching filters.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((item) => {
                  const isPositive = Number(item.quantity) > 0 && item.type === 'receipt';
                  const isNegative = item.type === 'delivery' || item.type === 'adjustment' || Number(item.quantity) < 0;

                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-primary">
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
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                          {item.status || 'Done'}
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
