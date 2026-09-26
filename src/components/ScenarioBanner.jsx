import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';

export default function ScenarioBanner({ onOpenReceiptModal, onOpenTransferModal, onOpenAdjustmentModal }) {
  const {
    scenarioRunning,
    scenarioStep,
    runOfficialOdooScenario,
    triggerToast,
    ledger
  } = useInventory();

  const handleDownloadReport = () => {
    exportToCSV(ledger, 'StockSense_Audit_Ledger');
    triggerToast('Stock Report generated and downloaded as CSV!');
  };

  const steps = [
    {
      step: 1,
      title: 'Receipt (Vendor → Store)',
      subtitle: '+100 kg Steel (Tata Steel)',
      active: scenarioStep === 1,
      completed: scenarioStep > 1,
    },
    {
      step: 2,
      title: 'Transfer (Store → Floor)',
      subtitle: '80 kg to Production Rack',
      active: scenarioStep === 2,
      completed: scenarioStep > 2,
    },
    {
      step: 3,
      title: 'Delivery Order (Customer)',
      subtitle: 'Ship 20 kg to Bharat Infra',
      active: scenarioStep === 3,
      completed: scenarioStep > 3,
    },
    {
      step: 4,
      title: 'Cycle Adjustment',
      subtitle: '-3 kg Damaged → Scrap',
      active: scenarioStep === 4,
      completed: scenarioStep === 4 && !scenarioRunning,
    }
  ];

  return (
    <section className="relative w-full rounded-2xl bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary p-6 shadow-md overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-surface-container-highest/10 pointer-events-none blur-3xl"></div>

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[10px] uppercase tracking-wider font-bold shadow-xs">
              Odoo Hackathon Benchmark
            </span>
            <span className="font-mono text-xs text-primary-fixed-dim">
              Team DEBUGGERS • Rule 04 Spec
            </span>
          </div>
          <h2 className="font-headline text-xl lg:text-2xl font-bold text-on-primary tracking-tight">
            Interactive 1-Click Official Odoo Scenario Walkthrough
          </h2>
          <p className="text-xs text-primary-fixed leading-relaxed">
            Simulate the full inventory lifecycle in 15 seconds: Double-entry Vendor Receipt → Inter-bin Transfer → Outgoing Dispatch → Damaged Scrap Adjustment with live ledger sync.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="runScenarioBtn"
            disabled={scenarioRunning}
            onClick={runOfficialOdooScenario}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-primary text-xs font-bold hover:bg-surface-bright shadow-sm transition-all active:scale-95 ${
              scenarioRunning ? 'opacity-75 cursor-wait animate-pulse' : 'hover:shadow-md'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-tertiary">
              {scenarioRunning ? 'hourglass_top' : 'play_circle'}
            </span>
            <span>{scenarioRunning ? `Executing Step ${scenarioStep}/4...` : 'Run Official Odoo Flow (15s)'}</span>
          </button>

          <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl">
            <button
              onClick={onOpenReceiptModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-primary hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Receipt
            </button>
            <button
              onClick={onOpenTransferModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-primary hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Transfer
            </button>
            <button
              onClick={onOpenAdjustmentModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-primary hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span> Cycle Count
            </button>
            <button
              onClick={handleDownloadReport}
              className="p-1.5 rounded-lg text-on-primary hover:bg-white/10 transition-colors"
              title="Download Stock Report (CSV)"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Step Visualizer Strip */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-white/15">
        {steps.map((st) => {
          let cardStyle = 'bg-white/10 text-on-primary';
          let icon = 'schedule';
          let iconColor = 'text-white/50';

          if (st.active) {
            cardStyle = 'bg-white/25 ring-2 ring-white shadow-md scale-102';
            icon = 'sync';
            iconColor = 'text-tertiary-fixed animate-spin';
          } else if (st.completed) {
            cardStyle = 'bg-white/15 border border-white/20';
            icon = 'check_circle';
            iconColor = 'text-tertiary-fixed font-bold';
          }

          return (
            <div
              key={st.step}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${cardStyle}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                st.active ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-sm' : 'bg-white/20 text-on-primary'
              }`}>
                {st.step}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate">{st.title}</span>
                <span className="font-mono text-[11px] text-primary-fixed truncate">{st.subtitle}</span>
              </div>
              <span className={`material-symbols-outlined text-[18px] ml-auto ${iconColor}`}>
                {icon}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
