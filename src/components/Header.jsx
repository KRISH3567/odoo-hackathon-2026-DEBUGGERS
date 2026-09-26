import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Warehouse,
  Search,
  ScanLine,
  Plus,
  Bell,
  ArrowLeftRight,
  Boxes,
  ChevronDown,
  UserCheck,
  RefreshCw,
  Sparkles,
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
    setCurrentView,
    activeWarehouse,
    setActiveWarehouse,
    user,
    switchRole,
    lowStockCount,
    resetAllData,
    runOfficialOdooScenario,
    triggerToast
  } = useInventory();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-container-lowest shadow-[0_2px_12px_rgba(0,0,0,0.4)] border-b border-surface-container px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle, Brand & Warehouse Filter */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          onClick={() => setMobileSidebarOpen?.(!mobileSidebarOpen)}
          className="md:hidden p-2 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Toggle Navigation Menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center font-bold shadow-purple-glow transition-transform group-hover:scale-105">
            <Boxes className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-lg font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                StockSense
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-container/40 text-primary-light font-mono font-bold border border-primary/30">
                MVP
              </span>
            </div>
            <span className="text-[11px] text-secondary font-medium hidden sm:inline">
              Inventory Management System
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-outline/20 hidden sm:block"></div>

        {/* Warehouse Selector */}
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

      {/* Right: Quick Search, Actions, Role Toggle & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center">
          <Search className="absolute left-2.5 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, product, batch..."
            className="h-9 w-48 xl:w-64 pl-8 pr-3 bg-surface-container-low text-on-surface placeholder:text-secondary text-xs rounded-lg border border-surface-container outline-none focus:ring-1 focus:ring-primary transition-all focus:w-72"
          />
        </form>

        {/* Quick Scan Button */}
        <button
          onClick={onOpenScanModal}
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-surface-container shadow-2xs active:scale-95"
          title="Quick Optical Barcode Scanner"
        >
          <ScanLine className="w-4 h-4 text-tertiary" />
          <span className="hidden sm:inline">Scan</span>
        </button>

        {/* New Product Button */}
        <button
          onClick={onOpenNewProductModal}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-purple-glow active:scale-95"
          title="Create New Product SKU"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">+ Add Product</span>
        </button>

        {/* Low Stock Alert Bell */}
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            user.role === 'manager'
              ? 'bg-primary-container/30 text-primary-light border-primary/40 hover:bg-primary-container/50'
              : 'bg-tertiary-container/30 text-tertiary border-tertiary/40 hover:bg-tertiary-container/50'
          }`}
          title="Click to toggle between Manager Mode and Warehouse Staff Mode"
        >
          <span className={`w-2 h-2 rounded-full ${user.role === 'manager' ? 'bg-primary' : 'bg-tertiary'} animate-pulse`}></span>
          <span className="font-bold">{user.role === 'manager' ? 'Manager' : 'Staff'}</span>
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
            <ChevronDown className="w-3.5 h-3.5 text-secondary hidden sm:block" />
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

              {/* Demo Scenario Trigger */}
              <button
                onClick={() => {
                  runOfficialOdooScenario();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-primary-container/20 text-xs text-primary-light font-medium text-left transition-colors"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Run Tata Steel Demo Scenario</span>
              </button>

              <button
                onClick={() => {
                  handleToggleRole();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-container text-xs text-on-surface font-medium text-left transition-colors"
              >
                <UserCheck className="w-4 h-4 text-secondary" />
                <span>Switch to {user.role === 'manager' ? 'Staff Mode' : 'Manager Mode'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenAuthModal?.();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-container text-xs text-on-surface font-medium text-left transition-colors"
              >
                <KeyRound className="w-4 h-4 text-secondary" />
                <span>Switch User / OTP Reset</span>
              </button>

              <button
                onClick={() => {
                  resetAllData();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-error-container/20 text-xs text-error font-medium text-left transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-error" />
                <span>Reset to Clean Seed Data</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
