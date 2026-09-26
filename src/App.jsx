import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import ProductsView from './views/ProductsView';
import OperationsView from './views/OperationsView';
import StockLedgerView from './views/StockLedgerView';
import ReorderingView from './views/ReorderingView';
import BarcodeView from './views/BarcodeView';
import WarehouseView from './views/WarehouseView';

// Modals
import NewReceiptModal from './components/Modals/NewReceiptModal';
import NewDeliveryModal from './components/Modals/NewDeliveryModal';
import NewTransferModal from './components/Modals/NewTransferModal';
import NewAdjustmentModal from './components/Modals/NewAdjustmentModal';
import NewProductModal from './components/Modals/NewProductModal';
import SlipModal from './components/Modals/SlipModal';
import BarcodeScannerModal from './components/Modals/BarcodeScannerModal';
import AuthModal from './components/Modals/AuthModal';

function AppContent() {
  const { currentView, toast } = useInventory();

  // Modal visibility states
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [activeSlipOperation, setActiveSlipOperation] = useState(null);

  const handleOpenSlip = (operation) => {
    setActiveSlipOperation(operation);
  };

  const handleCloseSlip = () => {
    setActiveSlipOperation(null);
  };

  return (
    <div className="bg-surface font-body text-body text-on-surface min-h-screen">
      {/* 1. Dual-Tier Navigation Header */}
      <Header
        onOpenScanModal={() => setIsBarcodeModalOpen(true)}
        onOpenNewProductModal={() => setIsProductModalOpen(true)}
      />

      {/* 2. Operations & Topology Sidebar */}
      <Sidebar
        onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
        onOpenTransferModal={() => setIsTransferModalOpen(true)}
        onOpenAdjustmentModal={() => setIsAdjustmentModalOpen(true)}
      />

      {/* 3. Main Workspace Router View */}
      <div className="pl-60">
        <main className="w-full pt-[124px] px-8 pb-12 bg-surface min-h-screen">
          {currentView === 'dashboard' && (
            <DashboardView
              onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
              onOpenAdjustmentModal={() => setIsAdjustmentModalOpen(true)}
              onOpenSlipModal={handleOpenSlip}
            />
          )}

          {currentView === 'products' && (
            <ProductsView
              onOpenNewProductModal={() => setIsProductModalOpen(true)}
              onOpenAdjustmentModal={() => setIsAdjustmentModalOpen(true)}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
            />
          )}

          {currentView === 'operations' && (
            <OperationsView
              onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
              onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
              onOpenAdjustmentModal={() => setIsAdjustmentModalOpen(true)}
              onOpenSlipModal={handleOpenSlip}
            />
          )}

          {currentView === 'ledger' && (
            <StockLedgerView />
          )}

          {currentView === 'reordering' && (
            <ReorderingView />
          )}

          {currentView === 'barcode' && (
            <BarcodeView />
          )}

          {currentView === 'warehouse' && (
            <WarehouseView />
          )}
        </main>
      </div>

      {/* 4. Interactive Modals */}
      <NewReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      <NewDeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
      />

      <NewTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />

      <NewAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
      />

      <NewProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
      />

      <SlipModal
        isOpen={!!activeSlipOperation}
        onClose={handleCloseSlip}
        operation={activeSlipOperation}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 5. Floating Interactive Toast Notification Container */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        } ${
          toast.type === 'error'
            ? 'bg-error text-on-error'
            : 'bg-inverse-surface text-inverse-on-surface'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${
          toast.type === 'error' ? 'text-on-error' : 'text-tertiary-fixed'
        }`}>
          {toast.type === 'error' ? 'error' : 'check_circle'}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
