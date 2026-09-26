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
import QuickRestockModal from './components/Modals/QuickRestockModal';
import SlipModal from './components/Modals/SlipModal';
import BarcodeScannerModal from './components/Modals/BarcodeScannerModal';
import AuthModal from './components/Modals/AuthModal';
import VoiceAssistantModal from './components/Modals/VoiceAssistantModal';
import BarcodeLabelsModal from './components/Modals/BarcodeLabelsModal';

import { CheckCircle2, AlertCircle } from 'lucide-react';

function AppContent() {
  const { currentView, toast } = useInventory();

  // Mobile drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal visibility states
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuickRestockModalOpen, setIsQuickRestockModalOpen] = useState(false);
  const [quickRestockSku, setQuickRestockSku] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [labelsModalSku, setLabelsModalSku] = useState('all');

  const [activeSlipOperation, setActiveSlipOperation] = useState(null);

  // Global shortcut: press 'v' or 'V' to trigger hands-free voice terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsVoiceModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenSlip = (operation) => {
    setActiveSlipOperation(operation);
  };

  const handleCloseSlip = () => {
    setActiveSlipOperation(null);
  };

  const handleOpenQuickRestock = (sku) => {
    setQuickRestockSku(sku || null);
    setIsQuickRestockModalOpen(true);
  };

  return (
    <div className="bg-surface font-body text-body text-on-surface min-h-screen">
      {/* 1. Header */}
      <Header
        onOpenScanModal={() => setIsBarcodeModalOpen(true)}
        onOpenNewProductModal={() => setIsProductModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* 2. Operations & Navigation Sidebar */}
      <Sidebar
        onOpenNewProductModal={() => setIsProductModalOpen(true)}
        onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
        onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
        onOpenTransferModal={() => setIsTransferModalOpen(true)}
        onOpenAdjustmentModal={() => setIsAdjustmentModalOpen(true)}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* 3. Main Workspace Router View */}
      <div className="md:pl-60 pl-0 transition-all duration-200">
        <main className="w-full pt-20 px-4 sm:px-8 pb-12 bg-surface min-h-screen">
          {currentView === 'dashboard' && (
            <DashboardView
              onOpenNewProductModal={() => setIsProductModalOpen(true)}
              onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
              onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
              onOpenAdjustmentModal={() => setIsAdjustmentModalOpen(true)}
              onOpenQuickRestockModal={handleOpenQuickRestock}
              onOpenSlipModal={handleOpenSlip}
            />
          )}

          {currentView === 'products' && (
            <ProductsView
              onOpenNewProductModal={() => setIsProductModalOpen(true)}
              onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
              onOpenAdjustmentModal={() => setIsAdjustmentModalOpen(true)}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
              onOpenQuickRestockModal={handleOpenQuickRestock}
              onOpenLabelsModal={(sku) => {
                setLabelsModalSku(sku || 'all');
                setIsLabelsModalOpen(true);
              }}
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

          {currentView === 'barcode' && (
            <BarcodeView
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            />
          )}

          {currentView === 'reordering' && (
            <ReorderingView />
          )}

          {currentView === 'warehouse' && (
            <WarehouseView
              onOpenReceiptModal={() => setIsReceiptModalOpen(true)}
              onOpenTransferModal={() => setIsTransferModalOpen(true)}
              onOpenQuickRestockModal={handleOpenQuickRestock}
            />
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

      <QuickRestockModal
        isOpen={isQuickRestockModalOpen}
        onClose={() => setIsQuickRestockModalOpen(false)}
        initialSku={quickRestockSku}
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

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      <BarcodeLabelsModal
        isOpen={isLabelsModalOpen}
        onClose={() => setIsLabelsModalOpen(false)}
        initialSku={labelsModalSku}
      />

      {/* 5. Floating Interactive Toast Notification Container */}
      <div
        id="toast-container"
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border ${
          toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95'
        } ${
          toast.type === 'error'
            ? 'bg-rose-950 text-rose-200 border-rose-800'
            : 'bg-navy-card text-white border-primary/40 shadow-purple-glow'
        }`}
      >
        {toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-tertiary shrink-0" />
        )}
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
