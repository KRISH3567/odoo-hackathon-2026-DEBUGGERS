import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

export default function BarcodeScannerModal({ isOpen, onClose }) {
  const { simulateBarcodeScan, triggerToast } = useInventory();
  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [laserActive, setLaserActive] = useState(true);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-tertiary">barcode_scanner</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Industrial Barcode Terminal</h3>
              <p className="text-xs text-secondary font-mono">Floor Staff Rapid Scan &amp; Auto-Pick</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Laser Scanner Viewport */}
        <div className="relative h-44 bg-inverse-surface rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 shadow-inner border border-outline/20">
          {/* Animated Laser Beam */}
          {laserActive && (
            <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_12px_#ff0000] animate-scan-beam"></div>
          )}

          {/* Crosshairs & Target Box */}
          <div className="w-48 h-24 border-2 border-dashed border-white/40 rounded-lg flex items-center justify-center relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>
            <span className="material-symbols-outlined text-[36px] text-white/30">qr_code_scanner</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-inverse-on-surface font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
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
            className="flex-1 h-10 px-3 bg-surface-container-low text-xs rounded-xl border border-surface-container font-mono outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-4 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container shadow-sm"
          >
            Scan
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[11px] font-mono uppercase text-secondary font-bold">1-Click Scan Presets:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleScan('RAW-STL-001')}
              className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col"
            >
              <span className="font-mono font-bold text-primary">[RAW-STL-001]</span>
              <span className="text-[11px] text-secondary">Verify Steel Stock</span>
            </button>

            <button
              onClick={() => handleScan('WH/OUT/2026/0291')}
              className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col"
            >
              <span className="font-mono font-bold text-tertiary">[WH/OUT/0291]</span>
              <span className="text-[11px] text-secondary">Auto-Pick &amp; Dispatch</span>
            </button>

            <button
              onClick={() => handleScan('LOC-RACK-A04')}
              className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col"
            >
              <span className="font-mono font-bold text-secondary">[LOC-RACK-A04]</span>
              <span className="text-[11px] text-secondary">Bin Capacity Check</span>
            </button>

            <button
              onClick={() => handleScan('WH/IN/2026/0043')}
              className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col"
            >
              <span className="font-mono font-bold text-tertiary-container">[WH/IN/0043]</span>
              <span className="text-[11px] text-secondary">Receive Mouse PO</span>
            </button>
          </div>
        </div>

        {/* Scan Result Card */}
        {scanResult && (
          <div className="p-3 rounded-xl bg-tertiary-fixed/20 border border-tertiary-fixed text-xs text-on-surface flex items-start gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[18px] text-tertiary font-bold">verified</span>
            <div className="flex flex-col">
              <span className="font-bold text-tertiary">Match Found!</span>
              <span className="font-mono text-[11px]">
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
