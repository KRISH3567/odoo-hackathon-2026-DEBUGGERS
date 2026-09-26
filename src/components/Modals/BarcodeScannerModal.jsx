import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  ScanLine,
  QrCode,
  X,
  CheckCircle2
} from 'lucide-react';

export default function BarcodeScannerModal({ isOpen, onClose }) {
  const { simulateBarcodeScan } = useInventory();
  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState(null);

  if (!isOpen) return null;

  const handleScan = (code) => {
    const res = simulateBarcodeScan(code);
    setScanResult(res);
    setInputCode('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    handleScan(inputCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-tertiary-container/30 text-tertiary border border-tertiary/20">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Industrial Barcode Terminal</h3>
              <p className="text-xs text-secondary font-mono">Floor Staff Rapid Scan &amp; Auto-Pick</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Laser Scanner Viewport */}
        <div className="relative h-44 bg-navy-base rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner border border-surface-container">
          {/* Animated Laser Beam */}
          <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_12px_#ff0000] animate-scan-beam"></div>

          {/* Crosshairs & Target Box */}
          <div className="w-48 h-24 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center relative bg-white/5">
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>
            <QrCode className="w-8 h-8 text-white/30" />
          </div>

          <div className="mt-3 flex items-center gap-2 text-white font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Laser Ready • Aim at SKU or Order Barcode</span>
          </div>
        </div>

        {/* Direct Keyboard / Hardware Barcode Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            autoFocus
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Type or hardware-scan barcode..."
            className="flex-1 h-10 px-3 bg-surface-container-low text-xs rounded-xl border border-surface-container font-mono outline-none focus:ring-1 focus:ring-primary text-on-surface"
          />
          <button
            type="submit"
            className="px-4 h-10 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-purple-glow"
          >
            Scan
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[11px] font-mono uppercase text-secondary font-bold">1-Click Fast Presets:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleScan('RAW-STL-001')}
              className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
            >
              <span className="font-mono font-bold text-primary-light">[RAW-STL-001]</span>
              <span className="text-[11px] text-secondary">Verify Steel Stock</span>
            </button>

            <button
              onClick={() => handleScan('WH/OUT/2026/0291')}
              className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
            >
              <span className="font-mono font-bold text-tertiary">[WH/OUT/0291]</span>
              <span className="text-[11px] text-secondary">Auto-Pick &amp; Dispatch</span>
            </button>

            <button
              onClick={() => handleScan('WH1: Main Store Rack A/B')}
              className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
            >
              <span className="font-mono font-bold text-secondary">[Rack A/B]</span>
              <span className="text-[11px] text-secondary">Bin Check</span>
            </button>

            <button
              onClick={() => handleScan('ELEC-MOU-001')}
              className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
            >
              <span className="font-mono font-bold text-error">[ELEC-MOU-001]</span>
              <span className="text-[11px] text-secondary">Critical Low Mouse</span>
            </button>
          </div>
        </div>

        {/* Scan Result Card */}
        {scanResult && (
          <div className="p-3 rounded-xl bg-tertiary-container/20 border border-tertiary/30 text-xs text-on-surface flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-tertiary">Match Verified!</span>
              <span className="font-mono text-[11px] text-on-surface">
                {scanResult.type === 'product'
                  ? `[${scanResult.data.sku}] ${scanResult.data.name} • On-Hand: ${scanResult.data.totalStock} ${scanResult.data.uom}`
                  : `Operation #${scanResult.data?.ref} (${scanResult.data?.status})`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
