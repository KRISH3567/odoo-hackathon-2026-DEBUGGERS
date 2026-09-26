import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  BrainCircuit,
  Zap,
  ScanLine,
  QrCode,
  Hourglass,
  BadgePercent,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

export default function RightColumnIntelligence() {
  const {
    generateDraftPO,
    simulateBarcodeScan,
    triggerToast
  } = useInventory();

  // AI Stress-Test Sliders
  const [demandSpike, setDemandSpike] = useState(35);
  const [supplierDelay, setSupplierDelay] = useState(3);
  const [customScanCode, setCustomScanCode] = useState('');
  const [scannerStatus, setScannerStatus] = useState('Ready • Aim laser at barcode');
  const [isLaserSuccess, setIsLaserSuccess] = useState(false);

  // Dynamic formula calculation
  // Base daily demand for Wireless Mouse = 3.8
  const baseDemand = 3.8 * (1 + demandSpike / 100);
  const effectiveLeadTime = 4 + Number(supplierDelay);
  const safetyStock = 10;
  const calculatedROP = ((baseDemand * effectiveLeadTime) + safetyStock).toFixed(1);
  const currentMouseStock = 8;
  const daysLeft = Math.max(0.4, (currentMouseStock / baseDemand)).toFixed(1);

  const handleScanPreset = (code) => {
    setIsLaserSuccess(true);
    setScannerStatus(`Scanned [${code}] • Verified!`);
    simulateBarcodeScan(code);
    setTimeout(() => {
      setIsLaserSuccess(false);
      setScannerStatus('Ready • Aim laser at barcode');
    }, 2500);
  };

  const handleCustomScan = (e) => {
    e.preventDefault();
    if (!customScanCode.trim()) return;
    handleScanPreset(customScanCode);
    setCustomScanCode('');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* INNOVATION 4.3: Predictive Reorder Engine & AI Stress-Test */}
      <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3 border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-primary-container/20 text-primary border border-primary/20">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="font-headline text-sm font-bold text-on-surface">Predictive Reorder Engine</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-mono text-[10px] font-bold border border-primary/30">
            AI Stress-Test
          </span>
        </div>

        <p className="font-mono text-[10px] text-secondary bg-surface-container-low p-2 rounded-lg border border-surface-container leading-relaxed">
          Formula: <span className="text-on-surface font-bold">ROP = (Daily Demand × Lead Time) + Safety Stock</span>
        </p>

        {/* Sliders */}
        <div className="flex flex-col gap-3 mt-1">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-on-surface">Demand Spike Simulation:</span>
              <span className="font-mono font-bold text-primary-light">+{demandSpike}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={demandSpike}
              onChange={(e) => setDemandSpike(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-on-surface">Supplier Delay Factor:</span>
              <span className="font-mono font-bold text-secondary">+{supplierDelay} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              value={supplierDelay}
              onChange={(e) => setSupplierDelay(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
            />
          </div>
        </div>

        {/* Dynamic Critical Trigger Card */}
        <div className="p-3 rounded-xl bg-error-container/15 flex flex-col gap-2 border border-error-container/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-error flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Wireless Mouse (ELEC-MOU-001)
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-error text-white font-bold">
              {daysLeft} Days Left
            </span>
          </div>
          <div className="text-xs text-on-surface-variant leading-relaxed">
            Dynamic ROP expanded to <span className="font-bold text-error">{calculatedROP} units</span> under simulated stress. Stockout imminent within 48h!
          </div>
          <button
            onClick={() => generateDraftPO('ELEC-MOU-001', 50)}
            className="w-full py-2 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover flex items-center justify-center gap-1.5 shadow-purple-glow transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>1-Click Auto-Draft PO (₹20,500)</span>
          </button>
        </div>
      </section>

      {/* INNOVATION 4.4: Smart Barcode & Quick-Action Scanner Simulator */}
      <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3 relative overflow-hidden border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-tertiary-container/30 text-tertiary border border-tertiary/20">
              <ScanLine className="w-4 h-4" />
            </div>
            <h3 className="font-headline text-sm font-bold text-on-surface">Handheld Scanner Terminal</h3>
          </div>
          <span className="flex items-center gap-1 font-mono text-[10px] text-tertiary font-bold">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span> Laser Active
          </span>
        </div>

        {/* Scanner Simulation Box with Animated Beam */}
        <div className="relative h-24 bg-surface-container-lowest text-on-surface rounded-xl flex flex-col items-center justify-center overflow-hidden p-2 border border-surface-container shadow-inner">
          <div
            className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ff0000] animate-scan-beam"
          ></div>
          <QrCode className="w-7 h-7 text-secondary/40 mb-1" />
          <span className={`font-mono text-[11px] transition-colors ${isLaserSuccess ? 'text-tertiary font-bold' : 'text-secondary'}`}>
            {scannerStatus}
          </span>
        </div>

        {/* Custom Barcode Input */}
        <form onSubmit={handleCustomScan} className="flex items-center gap-1.5">
          <input
            type="text"
            value={customScanCode}
            onChange={(e) => setCustomScanCode(e.target.value)}
            placeholder="Type barcode or SKU..."
            className="flex-1 h-8 px-2.5 bg-surface-container-low text-xs rounded-lg outline-none focus:ring-1 focus:ring-primary font-mono border border-surface-container text-on-surface"
          />
          <button
            type="submit"
            className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors"
          >
            Scan
          </button>
        </form>

        {/* Quick Scan Preset Buttons */}
        <div className="grid grid-cols-1 gap-1.5">
          <button
            onClick={() => handleScanPreset('RAW-STL-001')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-mono text-[11px] text-left flex items-center justify-between transition-colors border border-surface-container"
          >
            <span>Scan [RAW-STL-001]</span>
            <span className="text-tertiary font-bold">Verify SKU</span>
          </button>

          <button
            onClick={() => handleScanPreset('WH/OUT/2026/0291')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-mono text-[11px] text-left flex items-center justify-between transition-colors border border-surface-container"
          >
            <span>Quick Pick [Order 0291]</span>
            <span className="text-primary-light font-bold">Auto-Pick</span>
          </button>

          <button
            onClick={() => handleScanPreset('WH1: Main Store Rack A/B')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-mono text-[11px] text-left flex items-center justify-between transition-colors border border-surface-container"
          >
            <span>Bin Check [Rack A/B]</span>
            <span className="text-secondary font-bold">Locate</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[10px] text-secondary">Web Audio API Synth</span>
          <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-mono text-[10px] font-bold border border-tertiary/20">
            Audio Beep On
          </span>
        </div>
      </section>

      {/* INNOVATION 4.5: FEFO & Perishable Batch Expiry Intelligence */}
      <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3 border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-error-container/30 text-error border border-error/20">
              <Hourglass className="w-4 h-4" />
            </div>
            <h3 className="font-headline text-sm font-bold text-on-surface">FEFO Batch Expiry Tracker</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[10px] font-bold border border-surface-container">
            Perishables
          </span>
        </div>
        <p className="text-xs text-secondary leading-snug">
          First-Expired, First-Out sequence prevents margin decay before expiration.
        </p>

        {/* Batch items */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Greek Yogurt (GROC-YOG-001)</span>
              <span className="px-2 py-0.5 rounded-full bg-error-container/40 text-error font-mono text-[10px] font-bold border border-error/30">
                Exp: 7 Days Left
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-secondary">
              <span>Batch: B-102 • 120 units</span>
              <span className="text-error font-bold">Markdown: 25% Suggested</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Cold Juice (GROC-JUC-002)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                Exp: 14 Days Left
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-secondary">
              <span>Batch: B-088 • 90 bottles</span>
              <span className="text-secondary font-medium">Standard Flow</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => triggerToast('Dynamic 25% Markdown broadcasted to sales & dispatch!')}
          className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-surface-container"
        >
          <BadgePercent className="w-4 h-4 text-primary" />
          <span>Apply Dynamic 25% Markdown</span>
        </button>
      </section>

      {/* INNOVATION 4.6: Shrinkage & Financial Impact Summary */}
      <section className="p-4 rounded-xl bg-surface-container-lowest shadow-card-depth flex flex-col gap-3 border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-surface-container text-secondary">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-headline text-sm font-bold text-on-surface">Shrinkage &amp; Financial Impact</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary-fixed font-mono text-[10px] font-bold border border-tertiary/20">
            Target Met
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="font-headline text-xl font-bold text-on-surface">₹14,850</span>
          <span className="font-mono text-[11px] text-tertiary font-bold">
            0.8% of GMV (Target &lt; 1.5%)
          </span>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
          <div className="h-full bg-error" style={{ width: '68%' }} title="Handling Damage (68%)"></div>
          <div className="h-full bg-amber-500" style={{ width: '32%' }} title="Cycle Count Discrepancy (32%)"></div>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-secondary pt-0.5">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error"></span> 68% Handling Damage
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 32% Cycle Variance
          </span>
        </div>
      </section>
    </div>
  );
}
