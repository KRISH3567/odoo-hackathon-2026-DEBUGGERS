import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  ScanLine,
  History,
  ChevronRight,
  ArrowDownLeft,
  Truck,
  ArrowLeftRight,
  CheckCircle2,
  Package,
  Search,
  UserCheck
} from 'lucide-react';

export default function BarcodeView() {
  const {
    products,
    operations,
    simulateBarcodeScan,
    quickReceiveStock,
    validateReceipt,
    validateDelivery,
    relocateProduct,
    triggerToast,
    switchRole
  } = useInventory();

  const [inputVal, setInputVal] = useState('');
  const [activeScannedItem, setActiveScannedItem] = useState(products[0] || null);
  const [activeQueueTab, setActiveQueueTab] = useState('pick'); // 'pick' | 'receive' | 'history'
  const [quickQty, setQuickQty] = useState(10);
  const [scanHistory, setScanHistory] = useState([
    { id: 1, action: 'Verified SKU', title: 'Steel Rods (RAW-STL-001)', time: '10:02 AM', status: 'Success' },
    { id: 2, action: 'Picked & Packed', title: 'Order WH/OUT/2026/0291 (20 kg)', time: '09:48 AM', status: 'Shipped' },
    { id: 3, action: 'Dock Received', title: 'Tata Steel Receipt (100 kg)', time: '09:30 AM', status: 'Received' }
  ]);

  // Active Floor Tasks
  const pendingDeliveries = operations.filter(o => o.type === 'delivery' && o.status !== 'done');
  const pendingReceipts = operations.filter(o => o.type === 'receipt' && o.status !== 'done');

  // Handle Scanning or Typing
  const handleScan = (rawCode) => {
    if (!rawCode || !rawCode.trim()) return;
    const code = rawCode.trim().toUpperCase();

    // Check if matching SKU or Barcode
    const matchedProd = products.find(p => p.sku === code || p.barcode === code);
    if (matchedProd) {
      setActiveScannedItem(matchedProd);
      const log = {
        id: Date.now(),
        action: 'Scanned Product',
        title: `${matchedProd.name} (${matchedProd.sku})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Active'
      };
      setScanHistory(prev => [log, ...prev]);
      triggerToast(`Laser Match: [${matchedProd.sku}] ${matchedProd.name} • Stock: ${matchedProd.totalStock} ${matchedProd.uom}`);
      setInputVal('');
      return;
    }

    // Check if matching Operation Ref
    const matchedOp = operations.find(o => o.ref.toUpperCase().includes(code));
    if (matchedOp) {
      if (matchedOp.type === 'delivery' && matchedOp.status !== 'done') {
        validateDelivery(matchedOp.id);
        const log = {
          id: Date.now(),
          action: 'Picked & Dispatched',
          title: `Delivery #${matchedOp.ref} (${matchedOp.productName})`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Shipped'
        };
        setScanHistory(prev => [log, ...prev]);
        setInputVal('');
        return;
      } else if (matchedOp.type === 'receipt' && matchedOp.status !== 'done') {
        validateReceipt(matchedOp.id);
        const log = {
          id: Date.now(),
          action: 'Dock Received',
          title: `Receipt #${matchedOp.ref} (${matchedOp.productName})`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Received'
        };
        setScanHistory(prev => [log, ...prev]);
        setInputVal('');
        return;
      }
    }

    // General fallback simulator
    simulateBarcodeScan(code);
    setInputVal('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleScan(inputVal);
  };

  // Instant Floor Actions on Scanned Item
  const handleQuickReceive = () => {
    if (!activeScannedItem) return;
    const qty = Number(quickQty);
    if (!qty || qty <= 0) return;

    quickReceiveStock({
      sku: activeScannedItem.sku,
      quantity: qty,
      supplier: activeScannedItem.supplier || 'Tata Steel Ltd',
      destLocation: 'WH1: Main Store Rack A/B'
    });

    const log = {
      id: Date.now(),
      action: 'Quick Received',
      title: `+${qty} ${activeScannedItem.uom} of ${activeScannedItem.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Restocked'
    };
    setScanHistory(prev => [log, ...prev]);
  };

  const handleQuickTransferToPlant = () => {
    if (!activeScannedItem) return;
    const qty = Math.min(activeScannedItem.totalStock, Number(quickQty));
    if (!qty || qty <= 0) {
      triggerToast('No available stock to transfer', 'error');
      return;
    }

    const success = relocateProduct(activeScannedItem.sku, qty, 'wh1-store', 'wh2-prod');
    if (success) {
      triggerToast(`Moved ${qty} ${activeScannedItem.uom} from WH1 Store to WH2 Floor`);
      const log = {
        id: Date.now(),
        action: 'Internal Move',
        title: `${qty} ${activeScannedItem.uom} to WH2 Plant Floor`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Transferred'
      };
      setScanHistory(prev => [log, ...prev]);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* 1. Floor Staff Top Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-tertiary-container/20 border border-surface-container shadow-card-depth flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>StockSense</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-tertiary font-bold">Floor Staff Workstation</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
              Warehouse Floor &amp; Barcode Terminal
            </h1>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-tertiary text-white font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Staff Mode
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Optimized for fast barcode scanning, instant inbound receiving, and 1-tap customer order pick &amp; pack.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole('manager')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-surface-container transition-colors"
          >
            <UserCheck className="w-4 h-4 text-primary" />
            <span>Switch to Manager View</span>
          </button>
        </div>
      </div>

      {/* 2. Main Floor Grid: Left Workstation (Scan & Quick Action) | Right Task Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rapid Scanner & Active Item Workstation (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Hardware Barcode & Input Bar */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-tertiary-container/30 text-tertiary">
                  <ScanLine className="w-4 h-4" />
                </div>
                <h3 className="font-headline text-sm font-bold text-on-surface">Optical Laser Scanner Input</h3>
              </div>
              <span className="font-mono text-[10px] text-tertiary font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span> USB / Laser Hooked
              </span>
            </div>

            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-5 h-5 text-secondary" />
                <input
                  type="text"
                  autoFocus
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Scan barcode, SKU, or order ref (e.g. RAW-STL-001)..."
                  className="w-full h-11 pl-11 pr-4 bg-surface-container-low text-xs rounded-xl border border-surface-container font-mono outline-none focus:ring-2 focus:ring-primary font-bold text-on-surface"
                />
              </div>
              <button
                type="submit"
                className="px-6 h-11 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-purple-glow shrink-0 active:scale-95"
              >
                Scan / Enter
              </button>
            </form>

            {/* Quick Floor SKU Presets */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-mono font-bold text-secondary uppercase">Quick Barcodes:</span>
              {products.slice(0, 4).map(p => (
                <button
                  key={p.sku}
                  onClick={() => handleScan(p.sku)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-semibold text-on-surface transition-colors border border-surface-container active:scale-95"
                >
                  [{p.sku}] {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Scanned Item Workstation Card */}
          {activeScannedItem && (
            <div className="p-6 rounded-2xl bg-surface-container-lowest border-2 border-primary/30 shadow-card-depth flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary/30 text-primary flex items-center justify-center font-bold shadow-xs">
                    <Package className="w-7 h-7 text-primary-light" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary-light">{activeScannedItem.sku}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-secondary font-mono">
                        {activeScannedItem.category}
                      </span>
                    </div>
                    <h2 className="font-headline text-lg font-bold text-on-surface mt-0.5">
                      {activeScannedItem.name}
                    </h2>
                    <span className="text-xs text-secondary">
                      Barcode: <strong className="font-mono text-on-surface">{activeScannedItem.barcode}</strong> • Supplier: {activeScannedItem.supplier}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-secondary font-bold block">Current Stock</span>
                  <span className="font-headline text-2xl font-bold text-on-surface">
                    {activeScannedItem.totalStock} <span className="text-sm font-normal text-secondary">{activeScannedItem.uom}</span>
                  </span>
                </div>
              </div>

              {/* Physical Storage Bins */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                  <span className="text-xs text-secondary">WH1: Main Store Rack A/B</span>
                  <span className="font-mono text-sm font-bold text-on-surface">
                    {activeScannedItem.locations?.['wh1-store'] || 0} {activeScannedItem.uom}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                  <span className="text-xs text-secondary">WH2: Manufacturing Floor</span>
                  <span className="font-mono text-sm font-bold text-on-surface">
                    {activeScannedItem.locations?.['wh2-prod'] || 0} {activeScannedItem.uom}
                  </span>
                </div>
              </div>

              {/* Fast Floor Action Controls */}
              <div className="pt-2 border-t border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Quantity to Process:</span>
                  <div className="flex items-center gap-2">
                    {[5, 10, 25, 50].map(q => (
                      <button
                        key={q}
                        onClick={() => setQuickQty(q)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                          quickQty === q ? 'bg-primary text-white' : 'bg-surface-container text-secondary hover:text-on-surface'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="1"
                      value={quickQty}
                      onChange={(e) => setQuickQty(Number(e.target.value))}
                      className="w-16 h-8 px-2 rounded-lg bg-surface-container-low text-xs font-mono font-bold text-on-surface border border-surface-container text-center outline-none"
                    />
                  </div>
                </div>

                {/* 1-Tap Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleQuickReceive}
                    className="py-3 px-4 rounded-xl bg-tertiary hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Receive +{quickQty} {activeScannedItem.uom} on Dock</span>
                  </button>

                  <button
                    onClick={handleQuickTransferToPlant}
                    className="py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 border border-surface-container transition-all active:scale-95"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-primary-light" />
                    <span>Move {quickQty} to WH2 Plant</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Floor Tasks (Pick & Pack Queue + Receiving Dock) (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-card-depth flex flex-col gap-3">
            {/* Task Tabs */}
            <div className="flex items-center gap-2 pb-2 border-b border-surface-container">
              <button
                onClick={() => setActiveQueueTab('pick')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeQueueTab === 'pick'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-secondary hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Pick &amp; Pack ({pendingDeliveries.length})</span>
              </button>

              <button
                onClick={() => setActiveQueueTab('receive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeQueueTab === 'receive'
                    ? 'bg-tertiary text-white shadow-2xs'
                    : 'text-secondary hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Inbound Dock ({pendingReceipts.length})</span>
              </button>

              <button
                onClick={() => setActiveQueueTab('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeQueueTab === 'history'
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-secondary hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </div>

            {/* Tab 1: Pick & Pack Tasks */}
            {activeQueueTab === 'pick' && (
              <div className="flex flex-col gap-2.5">
                {pendingDeliveries.length === 0 ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-secondary">
                    <CheckCircle2 className="w-8 h-8 text-tertiary" />
                    <span className="text-xs font-medium text-on-surface">All picking and packing orders completed!</span>
                  </div>
                ) : (
                  pendingDeliveries.map(task => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-primary-light">{task.ref}</span>
                          <span className="text-xs font-bold text-on-surface mt-0.5">{task.productName}</span>
                          <span className="text-[11px] text-secondary">
                            Customer: <strong className="text-on-surface">{task.partner}</strong>
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-error bg-error-container/20 px-2 py-0.5 rounded border border-error/30">
                          {task.quantity} {task.uom}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
                        <span className="text-secondary font-mono">Location: {task.sourceLocation}</span>
                        <button
                          onClick={() => handleScan(task.ref)}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors shadow-2xs active:scale-95"
                        >
                          Pick &amp; Ship Done
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Inbound Dock Tasks */}
            {activeQueueTab === 'receive' && (
              <div className="flex flex-col gap-2.5">
                {pendingReceipts.length === 0 ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-secondary">
                    <CheckCircle2 className="w-8 h-8 text-tertiary" />
                    <span className="text-xs font-medium text-on-surface">Receiving dock clear. No pending shipments!</span>
                  </div>
                ) : (
                  pendingReceipts.map(task => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-tertiary">{task.ref}</span>
                          <span className="text-xs font-bold text-on-surface mt-0.5">{task.productName}</span>
                          <span className="text-[11px] text-secondary">
                            Supplier: <strong className="text-on-surface">{task.partner}</strong>
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded border border-tertiary/30">
                          +{task.quantity} {task.uom}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-surface-container text-[11px]">
                        <span className="text-secondary font-mono">Put Away: {task.destLocation}</span>
                        <button
                          onClick={() => handleScan(task.ref)}
                          className="px-3 py-1.5 rounded-lg bg-tertiary hover:opacity-90 text-white text-xs font-bold transition-opacity shadow-2xs active:scale-95"
                        >
                          Receive &amp; Shelf
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: History */}
            {activeQueueTab === 'history' && (
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {scanHistory.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{log.title}</span>
                      <span className="font-mono text-[10px] text-secondary">{log.action}</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
