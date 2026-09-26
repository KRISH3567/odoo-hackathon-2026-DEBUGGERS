import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  ScanLine,
  QrCode,
  History,
  Volume2,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

export default function BarcodeView() {
  const { simulateBarcodeScan, operations } = useInventory();

  const [inputVal, setInputVal] = useState('');
  const [scanHistory, setScanHistory] = useState([
    { id: 1, code: 'RAW-STL-001', match: 'Steel Rods (RAW-STL-001)', type: 'Product SKU', time: '09:22:15', status: 'Success' },
    { id: 2, code: 'WH/OUT/2026/0291', match: 'Delivery Order 0291 (Bharat Infra)', type: 'Outbound Delivery', time: '09:18:40', status: 'Picked' },
    { id: 3, code: 'WH1: Main Store Rack A/B', match: 'Main Store Rack A/B', type: 'Location Node', time: '09:05:12', status: 'Verified' }
  ]);

  // Today's Pick and Pack tasks for Warehouse Staff
  const pickAndPackTasks = operations.filter(o => o.type === 'delivery' && o.status !== 'done');

  const handleScan = (code) => {
    if (!code) return;
    const res = simulateBarcodeScan(code);

    let matchDesc = `Code [${code}]`;
    let typeDesc = 'Unknown Entity';
    if (res?.type === 'product') {
      matchDesc = `${res.data.name} (${res.data.sku})`;
      typeDesc = 'Product SKU';
    } else if (res?.type === 'operation') {
      matchDesc = `Operation #${res.data.ref} (${res.data.partner})`;
      typeDesc = res.data.type.toUpperCase();
    } else if (res?.type === 'location') {
      matchDesc = `Location ${res.data}`;
      typeDesc = 'Warehouse Node';
    }

    const newLog = {
      id: Date.now(),
      code,
      match: matchDesc,
      type: typeDesc,
      time: new Date().toLocaleTimeString(),
      status: res ? 'Success' : 'Not Found'
    };

    setScanHistory(prev => [newLog, ...prev]);
    setInputVal('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleScan(inputVal);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>StockSense IMS</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-on-surface font-semibold">Warehouse Floor Terminal</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              Warehouse Staff Barcode Terminal
            </h1>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-bold border border-tertiary/30">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> Floor Staff Mode
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Rapid handheld terminal emulation. Scan SKUs, pick lists, bin tags, and validate shipments with zero keystrokes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-surface-container-high border border-surface-container text-tertiary font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Volume2 className="w-3.5 h-3.5" /> Synthesizer Sound On
          </span>
        </div>
      </div>

      {/* Main Grid: Scanner Terminal + Today's Pick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Scanner Box (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-secondary flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-tertiary" /> Optical Laser Viewport
              </span>
              <span className="font-mono text-xs text-secondary">Sensor: Zebra TC57 / Honeywell 2D</span>
            </div>

            {/* Industrial Laser Simulation Frame */}
            <div className="relative h-64 bg-navy-base rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 border-2 border-surface-container shadow-inner">
              {/* Laser Sweep Line */}
              <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_16px_#ff0000] animate-scan-beam"></div>

              {/* Target Aiming Reticle */}
              <div className="w-64 h-32 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center relative bg-white/5">
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>

                <QrCode className="w-12 h-12 text-white/30" />
                <span className="text-white/70 font-mono text-[11px] mt-2">Center Barcode Inside Framing</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-white font-mono text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active • Hardware Keyboard Interop Hooked</span>
              </div>
            </div>

            {/* Hardware / Manual Input */}
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <ScanLine className="absolute left-3 top-3 w-5 h-5 text-secondary" />
                <input
                  type="text"
                  autoFocus
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Scan with USB reader or type barcode / SKU..."
                  className="w-full h-11 pl-11 pr-4 bg-surface-container-low text-xs rounded-xl border border-surface-container font-mono outline-none focus:ring-1 focus:ring-primary font-bold text-on-surface"
                />
              </div>
              <button
                type="submit"
                className="px-6 h-11 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow"
              >
                Scan Now
              </button>
            </form>

            {/* Quick 1-Click Floor Presets */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-mono text-xs font-bold uppercase text-secondary">
                Simulated Floor Presets (1-Click Test):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleScan('RAW-STL-001')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary-light">RAW-STL-001</span>
                  <span className="text-[11px] text-secondary">Tata Steel</span>
                  <span className="font-mono text-[10px] text-tertiary mt-1 font-semibold">Verify SKU</span>
                </button>

                <button
                  onClick={() => handleScan('WH/OUT/2026/0291')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary-light">WH/OUT/0291</span>
                  <span className="text-[11px] text-secondary">Bharat Infra</span>
                  <span className="font-mono text-[10px] text-primary mt-1 font-semibold">Auto-Pick</span>
                </button>

                <button
                  onClick={() => handleScan('ELEC-MOU-001')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary-light">ELEC-MOU-001</span>
                  <span className="text-[11px] text-secondary">Wireless Mouse</span>
                  <span className="font-mono text-[10px] text-error mt-1 font-semibold">Low Stock</span>
                </button>

                <button
                  onClick={() => handleScan('WH1: Main Store Rack A/B')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary-light">Rack A/B</span>
                  <span className="text-[11px] text-secondary">WH1 Central</span>
                  <span className="font-mono text-[10px] text-secondary mt-1 font-semibold">Check Bin</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Pick & Pack Tasks + Live Scan Logs (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Today's Pick and Pack Tasks */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <h3 className="font-headline text-sm font-bold text-on-surface">Today's Pick &amp; Pack Tasks</h3>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary-container/30 text-primary-light font-bold border border-primary/20">
                {pickAndPackTasks.length} Pending
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {pickAndPackTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-secondary">
                  All picking and packing tasks completed!
                </div>
              ) : (
                pickAndPackTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-primary-light">{task.ref}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-secondary">
                          {task.status}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-on-surface truncate mt-0.5">{task.productName}</span>
                      <span className="font-mono text-[10px] text-secondary">
                        {task.quantity} {task.uom} • {task.partner}
                      </span>
                    </div>

                    <button
                      onClick={() => handleScan(task.ref)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-2xs shrink-0"
                    >
                      Quick Pick
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Live Scanner Audit Log */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-secondary" />
                <h3 className="font-headline text-sm font-bold text-on-surface">Recent Terminal Scans</h3>
              </div>
              <span className="font-mono text-xs text-secondary">{scanHistory.length} Recorded</span>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {scanHistory.map(log => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">{log.match}</span>
                    <span className="font-mono text-[10px] text-secondary">{log.code} • {log.type}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {log.status}
                    </span>
                    <span className="font-mono text-[9px] text-secondary mt-0.5">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
