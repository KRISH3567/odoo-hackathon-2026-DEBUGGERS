import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function Header({ onOpenScanModal, onOpenNewProductModal }) {
  const {
    currentView,
    setCurrentView,
    activeWarehouse,
    setActiveWarehouse,
    user,
    setUser,
    lowStockCount,
    resetAllData,
    triggerToast
  } = useInventory();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'products', label: 'Products & Inventory', icon: 'inventory_2' },
    { id: 'operations', label: 'Operations', icon: 'swap_horiz' },
    { id: 'ledger', label: 'Stock Ledger', icon: 'receipt_long' },
    { id: 'reordering', label: 'Reordering & Analytics', icon: 'psychology' },
    { id: 'barcode', label: 'Barcode Simulator', icon: 'barcode_scanner' },
    { id: 'warehouse', label: 'Warehouse Topology', icon: 'warehouse' },
  ];

  const toggleRole = () => {
    const newRole = user.role === 'manager' ? 'staff' : 'manager';
    setUser(prev => ({ ...prev, role: newRole }));
    triggerToast(`Switched to: ${newRole === 'manager' ? '👔 Manager Mode (Full Privileges)' : '👷 Warehouse Staff Mode (Floor Operations)'}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setCurrentView('products');
    triggerToast(`Filtering catalog for "${searchQuery}"`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* 1. Top Hackathon Status Bar */}
      <div className="flex items-center justify-between px-6 h-7 bg-surface-container-high text-on-surface-variant border-b border-surface-container">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-tertiary">flag</span>
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-on-surface">
            Odoo Combat Hackathon 2026 Edition
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
            Team DEBUGGERS • v2.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-on-surface">
            <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            Double-Entry Engine Synced
          </span>
          <span className="font-mono text-[10px] text-secondary">Latency: 14ms</span>
        </div>
      </div>

      {/* 2. Main Executive Header Bar */}
      <div className="h-14 px-6 flex items-center justify-between gap-4 bg-surface-container-lowest">
        {/* Brand & Warehouse Selector */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-lg font-bold tracking-tight text-primary">StockSense</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-container text-on-primary font-semibold tracking-wide">
                  IMS v2.0
                </span>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-outline-variant/40 hidden sm:block"></div>

          {/* Active Warehouse Dropdown */}
          <div className="relative hidden md:flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-secondary pointer-events-none">
              warehouse
            </span>
            <select
              value={activeWarehouse}
              onChange={(e) => {
                setActiveWarehouse(e.target.value);
                triggerToast(`Filtered view to: ${e.target.options[e.target.selectedIndex].text}`);
              }}
              className="h-9 pl-8 pr-7 bg-surface-container-low text-on-surface text-xs font-semibold rounded border-0 focus:ring-1 focus:ring-primary outline-none cursor-pointer appearance-none transition-colors hover:bg-surface-container"
            >
              <option value="all">Consolidated (All Warehouses)</option>
              <option value="wh1">WH1: Central Warehouse (Main Store)</option>
              <option value="wh2">WH2: Manufacturing Plant</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 text-[16px] text-secondary pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Global Search & Action Center */}
        <div className="flex items-center gap-3">
          {/* Global Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-secondary">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKU, batch, ref ID..."
              className="h-9 w-64 pl-8 pr-16 bg-surface-container-low text-on-surface placeholder:text-secondary text-xs rounded outline-none focus:ring-1 focus:ring-primary transition-all focus:w-80"
            />
            <div className="absolute right-2 flex items-center gap-0.5 px-1 py-0.5 rounded bg-surface-container-highest font-mono text-[9px] text-on-surface-variant">
              Enter
            </div>
          </form>

          {/* Barcode Quick Trigger */}
          <button
            onClick={onOpenScanModal}
            className="flex items-center gap-1.5 h-9 px-3 rounded bg-secondary-container text-on-secondary-fixed text-xs font-semibold hover:bg-secondary-fixed transition-colors active:scale-95 shadow-sm"
            title="Open Laser Barcode Simulator"
          >
            <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
            <span className="hidden sm:inline">Scan In</span>
          </button>

          {/* New Product Trigger */}
          <button
            onClick={onOpenNewProductModal}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors shadow-2xs"
            title="Create New Product SKU"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">add</span>
            <span>+ Product</span>
          </button>


          {/* Notifications */}
          <button
            onClick={() => {
              setCurrentView('products');
              triggerToast(`${lowStockCount} items currently critical under safety stock!`);
            }}
            className="relative p-2 rounded hover:bg-surface-container transition-colors text-secondary hover:text-on-surface"
            title="Low Stock Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {lowStockCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-mono text-[10px] font-bold">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={toggleRole}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
              user.role === 'manager'
                ? 'bg-primary-container text-on-primary hover:bg-primary'
                : 'bg-tertiary-container text-on-tertiary hover:opacity-90'
            }`}
            title="Click to toggle between Manager Mode and Warehouse Staff Mode"
          >
            <span className={`w-2 h-2 rounded-full ${user.role === 'manager' ? 'bg-primary-fixed' : 'bg-tertiary-fixed'} animate-pulse`}></span>
            <span>{user.role === 'manager' ? 'Manager Mode' : 'Staff Mode'}</span>
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
                AV
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-on-surface leading-none">{user.name}</span>
                <span className="text-[11px] text-secondary leading-tight">
                  {user.role === 'manager' ? 'Operations Lead' : 'Floor Staff'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-2 z-50">
                <div className="p-2 border-b border-surface-container mb-1">
                  <p className="text-xs font-bold text-on-surface">{user.name}</p>
                  <p className="text-[11px] text-secondary font-mono">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    toggleRole();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-container text-xs text-on-surface font-medium text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                  Switch to {user.role === 'manager' ? 'Staff Mode' : 'Manager Mode'}
                </button>
                <button
                  onClick={() => {
                    resetAllData();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-error-container/20 text-xs text-error font-medium text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-error">restart_alt</span>
                  Reset to Odoo Seed Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Global Navigation Tab Ribbon */}
      <nav className="flex items-center h-10 px-6 gap-6 bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-x-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-1.5 h-full px-2 text-xs font-medium transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'text-primary border-primary font-bold bg-surface-container-low/50'
                  : 'text-on-surface-variant border-transparent hover:text-on-surface hover:border-surface-container-highest'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-primary' : 'text-secondary'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
