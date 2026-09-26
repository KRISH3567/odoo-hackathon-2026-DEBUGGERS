import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function BarcodeView() {
  const { products, operations, simulateBarcodeScan, triggerToast } = useInventory();

  const [inputVal, setInputVal] = useState('');
  const [scanHistory, setScanHistory] = useState([
    { id: 1, code: 'RAW-STL-001', match: 'Steel Rods (RAW-STL-001)', type: 'Product SKU', time: '09:22:15', status: 'Success' },
    { id: 2, code: 'WH/OUT/2026/0291', match: 'Delivery Order 0291 (Bharat Infra)', type: 'Outbound Delivery', time: '09:18:40', status: 'Picked' },
    { id: 3, code: 'LOC-RACK-A04', match: 'Storage Rack Bay A04', type: 'Location Node', time: '09:05:12', status: 'Verified' }
  ]);
  const [lastResult, setLastResult] = useState(null);

  const handleScan = (code) => {
    if (!code) return;
    const res = simulateBarcodeScan(code);
    setLastResult(res);

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
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Barcode &amp; RFID Simulator</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            Warehouse Staff Barcode Terminal
          </h1>
          <p className="text-xs text-secondary mt-1">
            Rapid handheld terminal emulation. Scan SKUs, pick lists, bin tags, and pallet lot numbers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-tertiary/10 text-tertiary font-mono text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></span>
            Laser Synthesizer Online
          </span>
        </div>
      </div>

      {/* Main Grid: Scanner Terminal + Scan Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Scanner Box (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-secondary">
                Optical Scanner Viewport
              </span>
              <span className="font-mono text-xs text-secondary">Sensor: Zebra TC57 / Honeywell 2D Imager</span>
            </div>

            {/* Industrial Laser Simulation Frame */}
            <div className="relative h-64 bg-inverse-surface rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 border-2 border-outline/30 shadow-inner">
              {/* Laser Line */}
              <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_16px_#ff0000] animate-scan-beam"></div>

              {/* Target Aiming Reticle */}
              <div className="w-64 h-32 border-2 border-dashed border-white/40 rounded-xl flex flex-col items-center justify-center relative">
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>

                <span className="material-symbols-outlined text-[48px] text-white/30">qr_code_scanner</span>
                <span className="text-white/60 font-mono text-[11px] mt-2">Center Barcode Inside Framing</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-inverse-on-surface font-mono text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Ready for Scan • Hardware Interop Enabled</span>
              </div>
            </div>

            {/* Hardware / Manual Input */}
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-secondary">barcode</span>
                <input
                  type="text"
                  autoFocus
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Scan with USB reader or type barcode / SKU..."
                  className="w-full h-11 pl-10 pr-4 bg-surface-container-low text-xs rounded-xl border border-surface-container font-mono outline-none focus:ring-1 focus:ring-primary font-bold text-on-surface"
                />
              </div>
              <button
                type="submit"
                className="px-6 h-11 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
              >
                Scan Now
              </button>
            </form>

            {/* Quick 1-Click Floor Presets */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-mono text-xs font-bold uppercase text-secondary">
                Simulated Floor Barcode Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleScan('RAW-STL-001')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary">RAW-STL-001</span>
                  <span className="text-[11px] text-secondary">Tata Steel Rods</span>
                  <span className="font-mono text-[10px] text-tertiary mt-1 font-semibold">Verify Stock</span>
                </button>

                <button
                  onClick={() => handleScan('WH/OUT/2026/0291')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary">WH/OUT/0291</span>
                  <span className="text-[11px] text-secondary">Bharat Infra</span>
                  <span className="font-mono text-[10px] text-primary mt-1 font-semibold">Auto-Pick</span>
                </button>

                <button
                  onClick={() => handleScan('WH/IN/2026/0043')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary">WH/IN/0043</span>
                  <span className="text-[11px] text-secondary">Omron Mouse PO</span>
                  <span className="font-mono text-[10px] text-tertiary mt-1 font-semibold">Receive Dock</span>
                </button>

                <button
                  onClick={() => handleScan('LOC-RACK-A04')}
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs transition-colors flex flex-col border border-surface-container"
                >
                  <span className="font-mono font-bold text-primary">LOC-RACK-A04</span>
                  <span className="text-[11px] text-secondary">Central Silo Bin</span>
                  <span className="font-mono text-[10px] text-secondary mt-1 font-semibold">Check Rack</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scan History & Live Result (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Result Card */}
          {lastResult && (
            <div className="p-4 rounded-xl bg-tertiary-fixed/20 border border-tertiary-fixed shadow-sm flex flex-col gap-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-tertiary font-bold">verified</span>
                <span className="text-xs font-bold text-tertiary uppercase">Match Decoded Successfully</span>
              </div>
              <div className="font-mono text-xs text-on-surface">
                {lastResult.type === 'product' && (
                  <div>
                    <div className="font-bold text-sm">[{lastResult.data.sku}] {lastResult.data.name}</div>
                    <div className="text-secondary mt-0.5">Category: {lastResult.data.category} • Cost: ₹{lastResult.data.costPrice}</div>
                    <div className="text-tertiary font-bold mt-1">Total On-Hand: {lastResult.data.totalStock} {lastResult.data.uom}</div>
                  </div>
                )}
                {lastResult.type === 'operation' && (
                  <div>
                    <div className="font-bold text-sm">Order #{lastResult.data.ref}</div>
                    <div className="text-secondary mt-0.5">{lastResult.data.partner} • Status: {lastResult.data.status.toUpperCase()}</div>
                    <div className="text-primary font-bold mt-1">Quantity: {lastResult.data.quantity} {lastResult.data.uom}</div>
                  </div>
                )}
                {lastResult.type === 'location' && (
                  <div>
                    <div className="font-bold text-sm">Warehouse Location: {lastResult.data}</div>
                    <div className="text-secondary mt-0.5">Capacity Nominal • Ready for Put-Away</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline text-sm font-bold text-on-surface">Floor Scan Activity Log</h3>
              <span className="font-mono text-xs text-secondary">{scanHistory.length} Recorded</span>
            </div>

            <div className="flex flex-col divide-y divide-surface-container max-h-[380px] overflow-y-auto">
              {scanHistory.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-primary">{item.code}</span>
                    <span className="text-secondary text-[11px]">{item.match}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] text-secondary">{item.time}</span>
                    <span className="font-mono text-[10px] font-bold text-tertiary">{item.status}</span>
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
