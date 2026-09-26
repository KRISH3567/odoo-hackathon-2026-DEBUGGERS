import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_PRODUCTS, INITIAL_OPERATIONS, INITIAL_LEDGER, INITIAL_LOCATIONS } from '../data/seedData';
import { soundFX } from '../utils/audio';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  // 1. Core State with LocalStorage Caching
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('stocksense_products_v2');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [operations, setOperations] = useState(() => {
    try {
      const saved = localStorage.getItem('stocksense_operations_v2');
      return saved ? JSON.parse(saved) : INITIAL_OPERATIONS;
    } catch {
      return INITIAL_OPERATIONS;
    }
  });

  const [ledger, setLedger] = useState(() => {
    try {
      const saved = localStorage.getItem('stocksense_ledger_v2');
      return saved ? JSON.parse(saved) : INITIAL_LEDGER;
    } catch {
      return INITIAL_LEDGER;
    }
  });

  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('stocksense_locations_v2');
      return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
    } catch {
      return INITIAL_LOCATIONS;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('stocksense_user_v2');
      return saved ? JSON.parse(saved) : {
        name: 'Alex Vance',
        email: 'alex.vance@stocksense.io',
        role: 'manager', // 'manager' | 'staff'
        isLoggedIn: true
      };
    } catch {
      return {
        name: 'Alex Vance',
        email: 'alex.vance@stocksense.io',
        role: 'manager',
        isLoggedIn: true
      };
    }
  });

  const [activeWarehouse, setActiveWarehouse] = useState('all'); // 'all' | 'wh1' | 'wh2'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProductSku, setSelectedProductSku] = useState('ELEC-MOU-001');

  // Interactive Scenario State
  const [scenarioRunning, setScenarioRunning] = useState(false);
  const [scenarioStep, setScenarioStep] = useState(0); // 0 = idle, 1, 2, 3, 4
  const [scenarioLogs, setScenarioLogs] = useState([]);

  // Toast System
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeoutRef = useRef(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('stocksense_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stocksense_operations_v2', JSON.stringify(operations));
  }, [operations]);

  useEffect(() => {
    localStorage.setItem('stocksense_ledger_v2', JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    localStorage.setItem('stocksense_locations_v2', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('stocksense_user_v2', JSON.stringify(user));
  }, [user]);

  const triggerToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3200);
  };

  // Helper: Recalculate and add entry to ledger
  const addLedgerEntry = ({ ref, productName, sku, from, to, quantity, uom, costValue, type }) => {
    const newEntry = {
      id: `led-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ref: ref || `WH/LOG/${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      productName,
      sku,
      from,
      to,
      quantity,
      uom: uom || 'units',
      costValue: costValue || 0,
      type,
      status: 'Done'
    };
    setLedger(prev => [newEntry, ...prev]);
    return newEntry;
  };

  // Helper: Update total stock and location allocations
  const updateProductStock = (sku, delta, locId = 'wh1-store') => {
    setProducts(prev => prev.map(p => {
      if (p.sku === sku) {
        const newTotal = Math.max(0, p.totalStock + delta);
        const currentLocQty = (p.locations && p.locations[locId]) || 0;
        const newLocQty = Math.max(0, currentLocQty + delta);
        return {
          ...p,
          totalStock: newTotal,
          locations: {
            ...p.locations,
            [locId]: newLocQty
          }
        };
      }
      return p;
    }));
  };

  // Helper: Relocate product between two locations
  const relocateProduct = (sku, qty, fromLoc, toLoc) => {
    setProducts(prev => prev.map(p => {
      if (p.sku === sku) {
        const fromQty = (p.locations && p.locations[fromLoc]) || 0;
        const toQty = (p.locations && p.locations[toLoc]) || 0;
        return {
          ...p,
          locations: {
            ...p.locations,
            [fromLoc]: Math.max(0, fromQty - qty),
            [toLoc]: toQty + qty
          }
        };
      }
      return p;
    }));
  };

  // OPERATIONS LIFECYCLE HANDLERS

  // 1. Receipts (Incoming Stock)
  const createReceipt = ({ supplier, destLocation, sku, quantity, uom, notes }) => {
    const prod = products.find(p => p.sku === sku);
    const newOp = {
      id: `op-${Date.now()}`,
      ref: `WH/IN/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'receipt',
      partner: supplier || 'Global Vendor',
      sourceLocation: 'Vendors (Virtual)',
      destLocation: destLocation || 'WH1: Central Store',
      sku,
      productName: prod ? prod.name : 'Unknown Item',
      quantity: Number(quantity),
      uom: uom || (prod ? prod.uom : 'units'),
      status: 'ready',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      subLocation: 'Inbound Receiving Dock',
      notes: notes || 'Incoming replenishment manifest'
    };
    setOperations(prev => [newOp, ...prev]);
    soundFX.playSuccessChime();
    triggerToast(`Receipt #${newOp.ref} generated and queued for inspection`);
    return newOp;
  };

  const validateReceipt = (opId) => {
    const op = operations.find(o => o.id === opId);
    if (!op || op.status === 'done') return;

    // Increment inventory
    const locKey = op.destLocation.includes('WH2') ? 'wh2-prod' : 'wh1-store';
    updateProductStock(op.sku, op.quantity, locKey);

    // Update operation status
    setOperations(prev => prev.map(o => o.id === opId ? { ...o, status: 'done' } : o));

    // Add immutable ledger entry
    const prod = products.find(p => p.sku === op.sku);
    addLedgerEntry({
      ref: op.ref,
      productName: op.productName,
      sku: op.sku,
      from: op.sourceLocation,
      to: op.destLocation,
      quantity: op.quantity,
      uom: op.uom,
      costValue: (prod ? prod.costPrice : 50) * op.quantity,
      type: 'receipt'
    });

    soundFX.playSuccessChime();
    triggerToast(`Receipt #${op.ref} validated! +${op.quantity} ${op.uom} credited to ${op.destLocation}`);
  };

  // 2. Deliveries (Outgoing Stock)
  const createDelivery = ({ customer, sourceLocation, sku, quantity, uom, notes }) => {
    const prod = products.find(p => p.sku === sku);
    const newOp = {
      id: `op-${Date.now()}`,
      ref: `WH/OUT/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'delivery',
      partner: customer || 'Direct Client',
      sourceLocation: sourceLocation || 'WH1: Staging Bay A03',
      destLocation: `${customer || 'Client'} (Customer Virtual)`,
      sku,
      productName: prod ? prod.name : 'Unknown Item',
      quantity: Number(quantity),
      uom: uom || (prod ? prod.uom : 'units'),
      status: 'ready', // ready for pick & pack
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      subLocation: 'Staging Bay A03',
      notes: notes || 'Customer Sales Order Dispatch'
    };
    setOperations(prev => [newOp, ...prev]);
    soundFX.playSuccessChime();
    triggerToast(`Delivery Order #${newOp.ref} scheduled for Pick & Pack`);
    return newOp;
  };

  const advanceDeliveryStep = (opId, newStatus) => {
    setOperations(prev => prev.map(o => o.id === opId ? { ...o, status: newStatus } : o));
    soundFX.playScanBeep();
    triggerToast(`Order status updated to: ${newStatus.toUpperCase()}`);
  };

  const validateDelivery = (opId) => {
    const op = operations.find(o => o.id === opId);
    if (!op || op.status === 'done') return;

    // Check availability
    const prod = products.find(p => p.sku === op.sku);
    if (prod && prod.totalStock < op.quantity) {
      soundFX.playWarningBuzz();
      triggerToast(`Insufficient stock! Available: ${prod.totalStock}, Required: ${op.quantity}`, 'error');
      return;
    }

    // Decrement stock
    const locKey = op.sourceLocation.includes('Staging') ? 'wh1-staging' : 'wh1-store';
    updateProductStock(op.sku, -op.quantity, locKey);

    // Update op
    setOperations(prev => prev.map(o => o.id === opId ? { ...o, status: 'done' } : o));

    // Ledger debit
    addLedgerEntry({
      ref: op.ref,
      productName: op.productName,
      sku: op.sku,
      from: op.sourceLocation,
      to: op.destLocation,
      quantity: -op.quantity,
      uom: op.uom,
      costValue: (prod ? prod.sellingPrice : 100) * op.quantity,
      type: 'delivery'
    });

    soundFX.playSuccessChime();
    triggerToast(`Delivery #${op.ref} dispatched! -${op.quantity} ${op.uom} debited to customer`);
  };

  // 3. Internal Transfers
  const createTransfer = ({ sourceLocation, destLocation, sku, quantity, uom, notes }) => {
    const prod = products.find(p => p.sku === sku);
    const newOp = {
      id: `op-${Date.now()}`,
      ref: `WH/INT/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'transfer',
      partner: 'Internal Route',
      sourceLocation: sourceLocation || 'WH1: Central Store',
      destLocation: destLocation || 'WH2: Production Floor',
      sku,
      productName: prod ? prod.name : 'Unknown Item',
      quantity: Number(quantity),
      uom: uom || (prod ? prod.uom : 'units'),
      status: 'ready',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      subLocation: 'Internal Bin Transit',
      notes: notes || 'Bin-to-bin relocation'
    };
    setOperations(prev => [newOp, ...prev]);
    soundFX.playSuccessChime();
    triggerToast(`Internal Move #${newOp.ref} scheduled`);
    return newOp;
  };

  const validateTransfer = (opId) => {
    const op = operations.find(o => o.id === opId);
    if (!op || op.status === 'done') return;

    const fromKey = op.sourceLocation.includes('WH2') ? 'wh2-prod' : 'wh1-store';
    const toKey = op.destLocation.includes('WH2') ? 'wh2-prod' : (op.destLocation.includes('Staging') ? 'wh1-staging' : 'wh1-store');

    relocateProduct(op.sku, op.quantity, fromKey, toKey);

    // Update op
    setOperations(prev => prev.map(o => o.id === opId ? { ...o, status: 'done' } : o));

    // Ledger move
    const prod = products.find(p => p.sku === op.sku);
    addLedgerEntry({
      ref: op.ref,
      productName: op.productName,
      sku: op.sku,
      from: op.sourceLocation,
      to: op.destLocation,
      quantity: op.quantity,
      uom: op.uom,
      costValue: (prod ? prod.costPrice : 50) * op.quantity,
      type: 'transfer'
    });

    soundFX.playSuccessChime();
    triggerToast(`Transfer #${op.ref} validated: ${op.quantity} ${op.uom} moved from ${op.sourceLocation} to ${op.destLocation}`);
  };

  // 4. Inventory Adjustments & Cycle Count
  const createAdjustment = ({ location, sku, physicalCount, reason, notes }) => {
    const prod = products.find(p => p.sku === sku);
    if (!prod) return;

    const currentRecorded = prod.totalStock;
    const diff = Number(physicalCount) - currentRecorded;
    const isLoss = diff < 0;

    const newOp = {
      id: `op-${Date.now()}`,
      ref: `WH/ADJ/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'adjustment',
      partner: `Audit: ${reason || 'Cycle Count'}`,
      sourceLocation: location || 'WH1: Central Store',
      destLocation: isLoss ? 'Virtual Scrap & Damaged' : 'Inventory Surplus',
      sku,
      productName: prod.name,
      quantity: Math.abs(diff),
      uom: prod.uom,
      status: 'done', // auto-applied
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      subLocation: reason || 'Physical Count Adjustment',
      notes: notes || `Recorded: ${currentRecorded}, Physical: ${physicalCount} (Variance: ${diff})`
    };

    // Apply adjustment
    const locKey = location.includes('WH2') ? 'wh2-prod' : 'wh1-store';
    setProducts(prev => prev.map(p => {
      if (p.sku === sku) {
        return {
          ...p,
          totalStock: Number(physicalCount),
          locations: {
            ...p.locations,
            [locKey]: Math.max(0, ((p.locations && p.locations[locKey]) || 0) + diff)
          }
        };
      }
      return p;
    }));

    setOperations(prev => [newOp, ...prev]);

    // Ledger entry
    addLedgerEntry({
      ref: newOp.ref,
      productName: prod.name,
      sku: prod.sku,
      from: newOp.sourceLocation,
      to: newOp.destLocation,
      quantity: diff,
      uom: prod.uom,
      costValue: Math.abs(diff * prod.costPrice),
      type: 'adjustment'
    });

    soundFX.playSuccessChime();
    triggerToast(`Inventory Adjusted for ${prod.name}: Stock updated to ${physicalCount} ${prod.uom} (${diff > 0 ? '+' : ''}${diff})`);
  };

  // Product Management CRUD
  const createProduct = (prodData) => {
    const newProd = {
      id: `prod-${Date.now()}`,
      sku: prodData.sku.toUpperCase(),
      name: prodData.name,
      category: prodData.category || 'Raw Materials',
      uom: prodData.uom || 'units',
      costPrice: Number(prodData.costPrice || 10),
      sellingPrice: Number(prodData.sellingPrice || 15),
      totalStock: Number(prodData.initialStock || 0),
      minStock: Number(prodData.minStock || 20),
      dailyDemand: Number(prodData.dailyDemand || 2.5),
      leadTimeDays: Number(prodData.leadTimeDays || 4),
      safetyStock: Number(prodData.safetyStock || 10),
      locations: {
        'wh1-store': Number(prodData.initialStock || 0),
        'wh2-prod': 0,
        'wh1-staging': 0,
        'wh1-cold': 0,
        'virtual-scrap': 0
      },
      barcode: prodData.barcode || `8901230${Math.floor(100000 + Math.random() * 900000)}`,
      batchNumber: prodData.batchNumber || `BATCH-${Date.now().toString().slice(-4)}`,
      isPerishable: !!prodData.isPerishable,
      expDays: prodData.isPerishable ? (prodData.expDays || 30) : undefined,
      image: prodData.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      supplier: prodData.supplier || 'Standard Supplier'
    };

    setProducts(prev => [newProd, ...prev]);

    // Initial stock ledger if > 0
    if (newProd.totalStock > 0) {
      addLedgerEntry({
        ref: `WH/INIT/${newProd.sku}`,
        productName: newProd.name,
        sku: newProd.sku,
        from: 'Vendors (Virtual)',
        to: 'WH1: Central Store',
        quantity: newProd.totalStock,
        uom: newProd.uom,
        costValue: newProd.costPrice * newProd.totalStock,
        type: 'receipt'
      });
    }

    soundFX.playSuccessChime();
    triggerToast(`Product [${newProd.sku}] ${newProd.name} registered successfully`);
    return newProd;
  };

  const updateProduct = (sku, updates) => {
    setProducts(prev => prev.map(p => p.sku === sku ? { ...p, ...updates } : p));
    triggerToast(`Product [${sku}] details updated`);
  };

  const deleteProduct = (sku) => {
    setProducts(prev => prev.filter(p => p.sku !== sku));
    triggerToast(`Product [${sku}] deleted from catalog`, 'error');
  };

  // 1-Click Auto Draft PO Generator
  const generateDraftPO = (sku, qty = 50) => {
    const prod = products.find(p => p.sku === sku);
    if (!prod) return;
    const po = createReceipt({
      supplier: prod.supplier || 'Primary Supplier',
      destLocation: 'WH1: Central Store',
      sku: prod.sku,
      quantity: qty,
      uom: prod.uom,
      notes: `Automated Predictive ROP Reorder (Stress-test trigger)`
    });
    triggerToast(`⚡ 1-Click Draft PO #${po.ref} created for ₹${(qty * prod.costPrice).toLocaleString()}`);
  };

  // INNOVATION 4.1: Interactive 1-Click Official Odoo Scenario Walkthrough
  const runOfficialOdooScenario = () => {
    if (scenarioRunning) return;
    setScenarioRunning(true);
    setScenarioStep(0);
    setScenarioLogs([]);
    triggerToast('Starting Official Odoo 4-Step Scenario Walkthrough (15s)...');

    // Step 1: Tata Steel Receipt +100 kg
    setTimeout(() => {
      setScenarioStep(1);
      soundFX.playScanBeep();
      updateProductStock('RAW-STL-001', 100, 'wh1-store');
      addLedgerEntry({
        ref: 'WH/IN/2026/0042',
        productName: 'Steel Rods',
        sku: 'RAW-STL-001',
        from: 'Vendors (Virtual)',
        to: 'WH1: Central Store',
        quantity: 100,
        uom: 'kg',
        costValue: 6500,
        type: 'receipt'
      });
      triggerToast('Step 1/4: Vendor Receipt Validated (+100 kg Tata Steel into WH1)');
    }, 1200);

    // Step 2: Internal Transfer 80 kg WH1 -> WH2
    setTimeout(() => {
      setScenarioStep(2);
      soundFX.playScanBeep();
      relocateProduct('RAW-STL-001', 80, 'wh1-store', 'wh2-prod');
      addLedgerEntry({
        ref: 'WH/INT/2026/0108',
        productName: 'Steel Rods',
        sku: 'RAW-STL-001',
        from: 'WH1: Central Store',
        to: 'WH2: Production Floor',
        quantity: 80,
        uom: 'kg',
        costValue: 5200,
        type: 'transfer'
      });
      triggerToast('Step 2/4: Internal Transfer: 80 kg Steel moved to WH2 Production Rack');
    }, 5000);

    // Step 3: Delivery Order 20 kg to Bharat Infra
    setTimeout(() => {
      setScenarioStep(3);
      soundFX.playScanBeep();
      updateProductStock('RAW-STL-001', -20, 'wh2-prod');
      addLedgerEntry({
        ref: 'WH/OUT/2026/0291',
        productName: 'Steel Rods',
        sku: 'RAW-STL-001',
        from: 'WH2: Production Floor',
        to: 'Bharat Infra Ltd (Customer)',
        quantity: -20,
        uom: 'kg',
        costValue: 1840,
        type: 'delivery'
      });
      triggerToast('Step 3/4: Delivery Order Dispatched to Bharat Infra (-20 kg)');
    }, 9000);

    // Step 4: Cycle count scrap adjustment (-3 kg damaged)
    setTimeout(() => {
      setScenarioStep(4);
      soundFX.playSuccessChime();
      updateProductStock('RAW-STL-001', -3, 'wh2-prod');
      addLedgerEntry({
        ref: 'WH/ADJ/2026/0014',
        productName: 'Steel Rods',
        sku: 'RAW-STL-001',
        from: 'WH2: Production Floor',
        to: 'Virtual Scrap & Damaged',
        quantity: -3,
        uom: 'kg',
        costValue: 195,
        type: 'adjustment'
      });
      triggerToast('Step 4/4: Adjustment Recorded: -3 kg Damaged moved to Virtual Scrap');

      // Celebration Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore if unavailable
      }

      setScenarioRunning(false);
    }, 13500);
  };

  // Reset to Clean Seed Data
  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOperations(INITIAL_OPERATIONS);
    setLedger(INITIAL_LEDGER);
    setLocations(INITIAL_LOCATIONS);
    soundFX.playSuccessChime();
    triggerToast('All warehouse data successfully reset to Official Odoo Seed!');
  };

  // Barcode Simulator Scan execution
  const simulateBarcodeScan = (code) => {
    soundFX.playScanBeep();
    const clean = code.trim().toUpperCase();

    // Check if matching SKU
    const prod = products.find(p => p.sku === clean || p.barcode === clean);
    if (prod) {
      setSelectedProductSku(prod.sku);
      triggerToast(`Laser Scan: Product [${prod.sku}] "${prod.name}" Verified! Stock: ${prod.totalStock} ${prod.uom}`);
      return { type: 'product', data: prod };
    }

    // Check if matching Operation Ref
    const op = operations.find(o => o.ref.toUpperCase().includes(clean));
    if (op) {
      if (op.status === 'ready' && op.type === 'receipt') {
        validateReceipt(op.id);
        return { type: 'operation', data: op, action: 'received' };
      } else if (op.status === 'ready' && op.type === 'delivery') {
        validateDelivery(op.id);
        return { type: 'operation', data: op, action: 'dispatched' };
      } else {
        triggerToast(`Scanned Operation #${op.ref} (${op.status.toUpperCase()})`);
        return { type: 'operation', data: op };
      }
    }

    // Location Check
    if (clean.includes('RACK') || clean.includes('LOC') || clean.includes('BAY')) {
      triggerToast(`Storage Location [${clean}] verified: Active bin capacity nominal`);
      return { type: 'location', data: clean };
    }

    soundFX.playWarningBuzz();
    triggerToast(`Barcode "${code}" not matched in active register`, 'error');
    return null;
  };

  // Executive Metric Computations
  const totalUnits = products.reduce((acc, p) => acc + p.totalStock, 0);
  const totalValuation = products.reduce((acc, p) => acc + (p.totalStock * p.costPrice), 0);
  const lowStockCount = products.filter(p => p.totalStock <= p.minStock).length;
  const pendingReceiptsCount = operations.filter(o => o.type === 'receipt' && o.status !== 'done').length;
  const pendingDeliveriesCount = operations.filter(o => o.type === 'delivery' && o.status !== 'done').length;
  const scheduledTransfersCount = operations.filter(o => o.type === 'transfer' && o.status !== 'done').length;

  return (
    <InventoryContext.Provider
      value={{
        products,
        operations,
        ledger,
        locations,
        user,
        setUser,
        activeWarehouse,
        setActiveWarehouse,
        currentView,
        setCurrentView,
        selectedProductSku,
        setSelectedProductSku,
        scenarioRunning,
        scenarioStep,
        runOfficialOdooScenario,
        createReceipt,
        validateReceipt,
        createDelivery,
        advanceDeliveryStep,
        validateDelivery,
        createTransfer,
        validateTransfer,
        createAdjustment,
        createProduct,
        updateProduct,
        deleteProduct,
        generateDraftPO,
        simulateBarcodeScan,
        resetAllData,
        toast,
        triggerToast,
        // Computed KPIs
        totalUnits,
        totalValuation,
        lowStockCount,
        pendingReceiptsCount,
        pendingDeliveriesCount,
        scheduledTransfersCount
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within an InventoryProvider');
  return ctx;
}
