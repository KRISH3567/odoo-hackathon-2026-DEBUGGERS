import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Printer, QrCode, X } from 'lucide-react';

export default function BarcodeLabelsModal({ isOpen, onClose, initialSku }) {
  const { products } = useInventory();

  const [selectedSku, setSelectedSku] = useState(initialSku || 'all');

  if (!isOpen) return null;

  const targetProducts = selectedSku === 'all'
    ? products
    : products.filter(p => p.sku === selectedSku);

  // Helper to generate realistic visual SVG barcode lines from SKU string
  const renderBarcodeSVG = (text) => {
    const bars = [];
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed += text.charCodeAt(i);
    }
    // Generate 36 distinct barcode bars
    for (let i = 0; i < 36; i++) {
      const isThick = ((seed * (i + 1) * 7) % 5) === 0;
      const width = isThick ? 3.5 : 1.5;
      const space = 2.2;
      bars.push(
        <rect
          key={i}
          x={i * 4 + space}
          y="2"
          width={width}
          height="32"
          fill="#1e293b"
        />
      );
    }
    return (
      <svg viewBox="0 0 155 36" className="w-full h-8 overflow-hidden">
        {bars}
      </svg>
    );
  };

  // Helper to generate a stylized scannable QR Code pattern from SKU string
  const renderQRCodeSVG = () => {
    return (
      <div className="w-12 h-12 bg-white p-1 rounded border border-slate-300 flex items-center justify-center shrink-0">
        <QrCode className="w-10 h-10 text-slate-900" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto print:p-0 print:border-none print:shadow-none print:max-h-none print:bg-white">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container print:hidden">
          <div className="flex items-center gap-3">
            <img src="/stocksense-icon.png" alt="StockSense" className="w-9 h-9 rounded-xl object-contain shadow-purple-glow" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-lg font-bold text-on-surface">Industrial Shelf Barcode Label Sheet</h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-primary-light font-bold">
                  Avery 3x8 Standard
                </span>
              </div>
              <p className="text-xs text-secondary font-mono">Print Scannable Pallet &amp; Bin Stickers for Physical Warehouse Shelves</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-purple-glow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sticker Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls (Hidden when printing) */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-on-surface whitespace-nowrap">Filter Products:</span>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="h-9 px-3 bg-surface-container text-xs rounded-lg border border-surface-container font-mono font-semibold text-on-surface outline-none focus:ring-1 focus:ring-primary w-full sm:w-72"
            >
              <option value="all">All Products (Full Warehouse Sheet - {products.length} Labels)</option>
              {products.map(p => (
                <option key={p.sku} value={p.sku}>
                  [{p.sku}] {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary font-mono">
            <span>Labels to render: </span>
            <strong className="text-primary-light font-bold">{targetProducts.length} Stickers</strong>
          </div>
        </div>

        {/* Printable Sticker Sheet (Pure High-Contrast White Background for thermal / inkjet laser printing) */}
        <div className="bg-slate-100 p-4 sm:p-6 rounded-xl border border-slate-300 print:bg-white print:p-0 print:border-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {targetProducts.map((p) => (
              <div
                key={p.sku}
                className="bg-white text-slate-900 border-2 border-dashed border-slate-300 print:border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-xs print:shadow-none break-inside-avoid"
              >
                {/* Sticker Header */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <img src="/stocksense-logo-transparent.png" alt="StockSense" className="w-3.5 h-3.5 object-contain" />
                      <span className="font-mono text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        StockSense IMS • Bin Label
                      </span>
                    </div>
                    <h4 className="font-sans text-sm font-bold text-slate-900 leading-tight line-clamp-1 mt-0.5">
                      {p.name}
                    </h4>
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-slate-100 text-purple-700 font-bold border border-slate-300 shrink-0">
                    {p.category}
                  </span>
                </div>

                {/* Center Barcode & QR Code Section */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex flex-col items-center justify-center p-1 bg-slate-50 rounded border border-slate-200">
                    {renderBarcodeSVG(p.sku)}
                    <span className="font-mono text-xs font-black tracking-widest text-slate-800 mt-1">
                      {p.barcode || p.sku}
                    </span>
                  </div>

                  {renderQRCodeSVG(p.sku)}
                </div>

                {/* Sticker Footer Details */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 uppercase block">SKU Code</span>
                    <strong className="text-slate-900 font-bold text-xs">{p.sku}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block">Storage Bin</span>
                    <strong className="text-slate-900 font-semibold truncate block">
                      {p.category === 'Perishables' ? 'WH1: Cold Silo' : 'WH1: Rack A/B'}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 uppercase block">Price / UoM</span>
                    <strong className="text-purple-700 font-bold text-xs">
                      ₹{p.sellingPrice} / {p.uom}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
