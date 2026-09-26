import React from 'react';
import { FileText, Printer, X } from 'lucide-react';

export default function SlipModal({ isOpen, onClose, operation }) {
  if (!isOpen || !operation) return null;

  const isReceipt = operation.type === 'receipt';
  const isDelivery = operation.type === 'delivery';
  const isTransfer = operation.type === 'transfer';

  const title = isReceipt
    ? 'OFFICIAL GOODS RECEIPT NOTE (GRN)'
    : isDelivery
    ? 'DELIVERY PACKING & DISPATCH SLIP'
    : isTransfer
    ? 'INTERNAL MATERIAL TRANSFER MANIFEST'
    : 'INVENTORY CYCLE COUNT RECONCILIATION MEMO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-container/20 text-primary border border-primary/20">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-on-surface">DOCUMENT PREVIEW • {operation.ref}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Slip Document */}
        <div className="p-6 bg-white text-slate-900 border border-slate-200 rounded-xl flex flex-col gap-5 print:border-none print:p-0 font-sans shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">StockSense IMS</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-bold">
                  ODOO v2.0
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1">Enterprise Double-Entry Logistics Network</span>
              <span className="text-[11px] text-slate-500">WH1 Central Distribution Hub • Mumbai Industrial Corridor</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-slate-900">{operation.ref}</span>
              <span className="text-[11px] text-slate-500">Date: {operation.timestamp}</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded mt-1 bg-slate-100 font-bold border border-slate-300">
                Status: {operation.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="text-center py-2 bg-slate-100 border border-slate-300 rounded-lg">
            <h2 className="text-sm font-bold tracking-wider text-slate-800 uppercase">{title}</h2>
          </div>

          {/* Parties & Route Details */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-3.5 rounded-lg bg-slate-50/80">
            <div>
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">Source Node (Credit):</span>
              <div className="font-bold text-slate-900 mt-0.5">{operation.sourceLocation}</div>
              <div className="text-slate-600 font-mono text-[11px]">{operation.partner}</div>
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">Destination Node (Debit):</span>
              <div className="font-bold text-slate-900 mt-0.5">{operation.destLocation}</div>
              <div className="text-slate-600 font-mono text-[11px]">{operation.subLocation || 'Dock Area'}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-mono text-[10px] uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item #</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">UoM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-3 font-mono">01</td>
                  <td className="py-3 px-3 font-mono font-bold text-purple-700">{operation.sku}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{operation.productName}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-base text-slate-900">{operation.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">{operation.uom}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Document Notes */}
          <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
            <span className="font-bold">Operational Ledger Memo: </span>
            <span>{operation.notes || 'Double-entry stock movement verified by StockSense IMS core.'}</span>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 mt-2 border-t border-dashed border-slate-300">
            <div className="flex flex-col items-center">
              <div className="w-full border-b border-slate-400 pb-8 text-center font-mono text-[11px] text-slate-400">
                Signature / Digital Stamp
              </div>
              <span className="text-[11px] text-slate-800 font-bold mt-1">Warehouse Floor Supervisor</span>
              <span className="text-[10px] text-slate-500 font-mono">Alex Vance (Operations Lead)</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full border-b border-slate-400 pb-8 text-center font-mono text-[11px] text-slate-400">
                Signature / Digital Stamp
              </div>
              <span className="text-[11px] text-slate-800 font-bold mt-1">Logistics Driver / Recipient</span>
              <span className="text-[10px] text-slate-500 font-mono">Authorized Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
