import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import Logo from './Logo';
import {
  Warehouse,
  Search,
  ScanLine,
  Bell,
  ArrowLeftRight,
  ChevronDown,
  UserCheck,
  RefreshCw,
  Sparkles,
  KeyRound,
  Menu,
  X,
  Mic
} from 'lucide-react';

export default function Header({
  onOpenScanModal,
  onOpenAuthModal,
  onOpenVoiceModal,
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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: Mobile Menu, Brand Logo & Warehouse Selector */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={() => setMobileSidebarOpen?.(!mobileSidebarOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Toggle Navigation Menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentView('dashboard')}
        >
          <Logo variant="icon" className="w-9 h-9 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-lg font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">
                Stock<span className="text-purple-400">Sense</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-mono font-bold border border-purple-500/30">
                Odoo MVP
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Double-Entry Inventory
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

        {/* Warehouse Location Selector */}
        <div className="relative hidden md:flex items-center">
          <Warehouse className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={activeWarehouse}
            onChange={(e) => {
              setActiveWarehouse(e.target.value);
              triggerToast(`Filtered view to: ${e.target.options[e.target.selectedIndex].text}`);
            }}
            className="h-9 pl-9 pr-8 bg-slate-900/60 hover:bg-slate-800/60 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 focus:border-purple-500/50 outline-none cursor-pointer appearance-none transition-colors"
          >
            <option value="all">All Warehouses (Consolidated)</option>
            <option value="wh1">WH1: Central Warehouse (Main Store)</option>
            <option value="wh2">WH2: Manufacturing Plant (Floor)</option>
          </select>
          <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Right: Quick Search & Floor Utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, product, barcode..."
            className="h-9 w-52 xl:w-64 pl-9 pr-8 bg-slate-900/60 text-slate-200 placeholder:text-slate-500 text-xs rounded-xl border border-slate-800 focus:border-purple-500/60 outline-none transition-all focus:w-72"
          />
          <span className="absolute right-2.5 font-mono text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
            /
          </span>
        </form>

        {/* Floor Barcode Scanner */}
        <button
          onClick={onOpenScanModal}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all border border-slate-800 active:scale-95 hover:border-emerald-500/30"
          title="Optical Barcode & QR Camera Scanner"
        >
          <ScanLine className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Scanner</span>
        </button>

        {/* Hands-Free Voice Assistant */}
        <button
          onClick={onOpenVoiceModal}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all border border-slate-800 active:scale-95 hover:border-purple-500/30 group"
          title="Hands-Free Voice Terminal (Press 'V')"
        >
          <Mic className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Voice</span>
          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 hidden xl:inline">V</span>
        </button>

        {/* Low Stock Alert Bell */}
        <button
          onClick={() => {
            setCurrentView('products');
            triggerToast(`${lowStockCount} items currently critical under safety stock!`);
          }}
          className="relative p-2 rounded-xl hover:bg-slate-800/60 transition-colors text-slate-400 hover:text-white border border-transparent hover:border-slate-800"
          title="Low Stock Alerts"
        >
          <Bell className="w-4 h-4" />
          {lowStockCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold shadow-md animate-pulse">
              {lowStockCount}
            </span>
          )}
        </button>

        {/* Fast Role Switcher Pill */}
        <button
          onClick={handleToggleRole}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            user.role === 'manager'
              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25 shadow-purple-glow'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
          }`}
          title="Click to toggle between Manager Mode and Warehouse Staff Mode"
        >
          <span className={`w-2 h-2 rounded-full ${user.role === 'manager' ? 'bg-purple-400' : 'bg-emerald-400'}`}></span>
          <span className="font-bold">{user.role === 'manager' ? '👔 Manager' : '👷 Staff'}</span>
          <ArrowLeftRight className="w-3 h-3 opacity-60" />
        </button>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer border border-transparent hover:border-slate-800"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user.name.split(' ').map(n => n[0]).join('') || 'AV'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0d1322] rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-800 mb-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-100">{user.name}</p>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase border border-purple-500/30">
                    {user.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</p>
              </div>

              {/* Demo Scenario Trigger */}
              <button
                onClick={() => {
                  runOfficialOdooScenario();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-purple-500/15 text-xs text-purple-300 font-medium text-left transition-colors"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Run Demo Scenario</span>
              </button>

              <button
                onClick={() => {
                  handleToggleRole();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 font-medium text-left transition-colors"
              >
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>Switch to {user.role === 'manager' ? 'Staff Mode' : 'Manager Mode'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenAuthModal?.();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 font-medium text-left transition-colors"
              >
                <KeyRound className="w-4 h-4 text-slate-400" />
                <span>Switch User / OTP Login</span>
              </button>

              <button
                onClick={() => {
                  resetAllData();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-500/15 text-xs text-rose-400 font-medium text-left transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-rose-400" />
                <span>Reset to Seed Data</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
