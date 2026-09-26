import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Warehouse,
  Search,
  ScanLine,
  Plus,
  Bell,
  ArrowLeftRight,
  UserCheck,
  RefreshCw,
  LayoutDashboard,
  Package,
  Boxes,
  FileText,
  BrainCircuit,
  ChevronDown,
  Shield,
  Activity,
  KeyRound,
  Menu,
  X
} from 'lucide-react';

export default function Header({
  onOpenScanModal,
  onOpenNewProductModal,
  onOpenAuthModal,
  mobileSidebarOpen,
  setMobileSidebarOpen
}) {
  const {
    currentView,
    setCurrentView,
    activeWarehouse,
    setActiveWarehouse,
    user,
    switchRole,
    lowStockCount,
    resetAllData,
    triggerToast
  } = useInventory();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'operations', label: 'Operations', icon: ArrowLeftRight },
    { id: 'ledger', label: 'Stock Ledger', icon: FileText },
    { id: 'reordering', label: 'Reordering & AI', icon: BrainCircuit },
    { id: 'barcode', label: 'Barcode Terminal', icon: ScanLine },
    { id: 'warehouse', label: 'Warehouse Topology', icon: Warehouse },
  ];

  const handleToggleRole = () => {
    const nextRole = user.role === 'manager' ? 'staff' : 'manager';
    switchRole(nextRole);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setCurrentView('products');
    triggerToast(`Filtering catalog for "${searchQuery}"`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-surface-container-lowest shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border-b border-surface-container">
      {/* 1. Top Hackathon Status Bar */}
      <div className="flex items-center justify-between px-6 h-7 bg-surface-container-high text-on-surface-variant border-b border-surface-container">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-tertiary" />
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-on-surface">
            Odoo Combat Hackathon 2026 Edition
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant border border-surface-container-highest">
            Team DEBUGGERS • v2.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-on-surface">
            <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_#10b981]"></span>
            Double-Entry Ledger Synced
          </span>
          <span className="font-mono text-[10px] text-secondary hidden sm:inline flex items-center gap-1">
            <Activity className="w-3 h-3 text-secondary" /> 14ms Latency
          </span>
        </div>
      </div>

      {/* 2. Main Executive Header Bar */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4 bg-surface-container-lowest">
        {/* Mobile Hamburger & Brand */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => setMobileSidebarOpen?.(!mobileSidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container"
            title="Toggle Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center font-bold text-lg shadow-purple-glow">
              <Boxes className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-lg font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                  StockSense
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-container text-on-primary font-semibold tracking-wide border border-primary/30">
                  IMS v2.0
                </span>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-outline/30 hidden sm:block"></div>

          {/* Active Warehouse Dropdown */}
          <div className="relative hidden md:flex items-center">
            <Warehouse className="absolute left-2.5 w-4 h-4 text-secondary pointer-events-none" />
            <select
              value={activeWarehouse}
              onChange={(e) => {
                setActiveWarehouse(e.target.value);
                triggerToast(`Filtered view to: ${e.target.options[e.target.selectedIndex].text}`);
              }}
              className="h-9 pl-8 pr-7 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg border border-surface-container focus:ring-1 focus:ring-primary outline-none cursor-pointer appearance-none transition-colors hover:bg-surface-container"
            >
              <option value="all">Consolidated (All Warehouses)</option>
              <option value="wh1">WH1: Central Warehouse (Main Store)</option>
              <option value="wh2">WH2: Manufacturing Plant (Floor)</option>
            </select>
            <ChevronDown className="absolute right-2 w-3.5 h-3.5 text-secondary pointer-events-none" />
          </div>
        </div>

        {/* Global Search & Action Suite */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center">
            <Search className="absolute left-2.5 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKU, batch, ref ID..."
              className="h-9 w-52 xl:w-72 pl-8 pr-16 bg-surface-container-low text-on-surface placeholder:text-secondary text-xs rounded-lg border border-surface-container outline-none focus:ring-1 focus:ring-primary transition-all focus:w-80"
            />
            <div className="absolute right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-container font-mono text-[9px] text-secondary border border-surface-container-highest">
              ↵ Enter
            </div>
          </form>

          {/* Barcode Quick Trigger */}
          <button
            onClick={onOpenScanModal}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-all border border-surface-container shadow-2xs hover:border-primary/40 active:scale-95"
            title="Open Laser Barcode Simulator Modal"
          >
            <ScanLine className="w-4 h-4 text-tertiary" />
            <span className="hidden sm:inline">Scan In</span>
          </button>

          {/* New Product Trigger */}
          <button
            onClick={onOpenNewProductModal}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Create New Product SKU"
          >
            <Plus className="w-4 h-4" />
            <span>+ Product</span>
          </button>

          {/* Low Stock Notifications */}
          <button
            onClick={() => {
              setCurrentView('products');
              triggerToast(`${lowStockCount} items currently critical under safety stock!`);
            }}
            className="relative p-2 rounded-lg hover:bg-surface-container transition-colors text-secondary hover:text-on-surface border border-transparent hover:border-surface-container"
            title="Low Stock Alerts"
          >
            <Bell className="w-5 h-5" />
            {lowStockCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white font-mono text-[10px] font-bold shadow-sm">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={handleToggleRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm border ${
              user.role === 'manager'
                ? 'bg-primary-container/30 text-primary-light border-primary/40 hover:bg-primary-container/50'
                : 'bg-tertiary-container/40 text-tertiary-fixed border-tertiary/40 hover:bg-tertiary-container/60'
            }`}
            title="Click to toggle between Manager Mode and Warehouse Staff Mode"
          >
            <span className={`w-2 h-2 rounded-full ${user.role === 'manager' ? 'bg-primary' : 'bg-tertiary'} animate-pulse`}></span>
            <span className="font-bold">{user.role === 'manager' ? 'Manager Mode' : 'Staff Mode'}</span>
            <ArrowLeftRight className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-surface-container"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {user.name.split(' ').map(n => n[0]).join('') || 'AV'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface leading-none">{user.name}</span>
                <span className="text-[11px] text-secondary leading-tight mt-0.5">
                  {user.role === 'manager' ? 'Operations Lead' : 'Warehouse Staff'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-secondary" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-2xl border border-surface-container p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2.5 border-b border-surface-container mb-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-on-surface">{user.name}</p>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary-container text-on-primary font-bold uppercase">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary font-mono mt-0.5">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    handleToggleRole();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-container text-xs text-on-surface font-medium text-left transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span>Switch to {user.role === 'manager' ? 'Warehouse Staff Mode' : 'Manager Mode'}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuthModal?.();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-container text-xs text-on-surface font-medium text-left transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-secondary" />
                  <span>Switch User / OTP Password Reset</span>
                </button>

                <button
                  onClick={() => {
                    resetAllData();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-error-container/20 text-xs text-error font-medium text-left transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-error" />
                  <span>Reset to Official Seed Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Global Navigation Tab Ribbon */}
      <nav className="flex items-center h-10 px-4 sm:px-6 gap-2 sm:gap-4 bg-surface-container-lowest border-t border-surface-container overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-1.5 h-full px-2.5 text-xs font-medium transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'text-primary border-primary font-bold bg-primary-container/10'
                  : 'text-on-surface-variant border-transparent hover:text-on-surface hover:border-surface-container-highest'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-secondary'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
