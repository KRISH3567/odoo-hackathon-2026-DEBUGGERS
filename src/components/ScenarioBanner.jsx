import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { exportToCSV } from '../utils/export';
import {
  Play,
  Hourglass,
  CheckCircle2,
  Download,
  Plus,
  ArrowLeftRight,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function ScenarioBanner({ onOpenReceiptModal, onOpenTransferModal, onOpenAdjustmentModal }) {
  const {
    scenarioRunning,
    scenarioStep,
    scenarioVerified,
    runOfficialOdooScenario,
    triggerToast,
    ledger
  } = useInventory();

  const handleDownloadReport = () => {
    exportToCSV(ledger, 'StockSense_Audit_Ledger');
    triggerToast('Double-Entry Stock Report downloaded as CSV!');
  };

  const steps = [
    {
      step: 1,
      title: 'Vendor Receipt',
      subtitle: '+100 kg Steel (Tata Steel)',
      location: 'WH1: Main Store',
      active: scenarioStep === 1,
      completed: scenarioStep > 1 || (scenarioVerified && scenarioStep === 0),
    },
    {
      step: 2,
      title: 'Internal Move',
      subtitle: '80 kg to Production Floor',
      location: 'WH1 Store → WH2 Floor',
      active: scenarioStep === 2,
      completed: scenarioStep > 2 || (scenarioVerified && scenarioStep === 0),
    },
    {
      step: 3,
      title: 'Customer Delivery',
      subtitle: 'Ship 20 kg to Bharat Infra',
      location: 'WH2 Floor → Bharat Infra',
      active: scenarioStep === 3,
      completed: scenarioStep > 3 || (scenarioVerified && scenarioStep === 0),
    },
    {
      step: 4,
      title: 'Damaged Scrap',
      subtitle: '-3 kg Damaged → Virtual Scrap',
      location: 'WH2 Floor → Scrap (77 kg Total)',
      active: scenarioStep === 4,
      completed: scenarioStep === 4 || (scenarioVerified && scenarioStep === 0),
    }
  ];

  return (
    <section className="relative w-full rounded-2xl bg-gradient-to-r from-navy-card via-surface-container-high to-primary-dim text-on-surface p-6 shadow-card-depth border border-primary/30 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/20 pointer-events-none blur-3xl"></div>
      <div className="absolute left-1/3 -bottom-16 w-60 h-60 rounded-full bg-tertiary/10 pointer-events-none blur-2xl"></div>

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-mono text-[10px] uppercase tracking-wider font-bold border border-primary/40 shadow-xs">
              <Sparkles className="w-3 h-3 text-tertiary-fixed" /> Odoo Combat Hackathon Benchmark
            </span>
            <span className="font-mono text-xs text-primary-light">
              Team DEBUGGERS • Rule 04 Spec
            </span>
            {scenarioVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/20 text-tertiary font-mono text-[11px] font-bold border border-tertiary/40 animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5" /> Reconciled: Exactly 77 kg
              </span>
            )}
          </div>
          <h2 className="font-headline text-xl lg:text-2xl font-bold text-on-surface tracking-tight">
            Interactive 1-Click Official Odoo Walkthrough
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Replays the canonical lifecycle in 15 seconds: <span className="text-on-surface font-semibold">Vendor Receipt (+100 kg)</span> → <span className="text-on-surface font-semibold">Inter-Warehouse Transfer (80 kg)</span> → <span className="text-on-surface font-semibold">Customer Dispatch (-20 kg)</span> → <span className="text-on-surface font-semibold">Damaged Scrap (-3 kg)</span>. Invariant ends at <span className="text-primary-light font-mono font-bold">exactly 77 kg</span>!
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="runScenarioBtn"
            disabled={scenarioRunning}
            onClick={runOfficialOdooScenario}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-purple-glow transition-all active:scale-95 ${
              scenarioRunning 
                ? 'bg-surface-container-highest text-primary-light opacity-90 cursor-wait animate-pulse' 
                : 'bg-primary text-white hover:bg-primary-hover hover:shadow-lg'
            }`}
          >
            {scenarioRunning ? (
              <Hourglass className="w-4 h-4 text-tertiary-fixed animate-spin" />
            ) : (
              <Play className="w-4 h-4 text-white fill-white" />
            )}
            <span>{scenarioRunning ? `Executing Step ${scenarioStep}/4...` : 'Run Official Odoo Flow (15s)'}</span>
          </button>

          <div className="flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-xs p-1 rounded-xl border border-surface-container">
            <button
              onClick={onOpenReceiptModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1"
              title="New Vendor Receipt"
            >
              <Plus className="w-3.5 h-3.5 text-tertiary" /> Receipt
            </button>
            <button
              onClick={onOpenTransferModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1"
              title="New Internal Transfer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-primary" /> Transfer
            </button>
            <button
              onClick={onOpenAdjustmentModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1"
              title="New Cycle Count Adjustment"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-error" /> Adjust
            </button>
            <button
              onClick={handleDownloadReport}
              className="p-1.5 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
              title="Download Stock Report (CSV)"
            >
              <Download className="w-4 h-4 text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Step Visualizer Strip */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-surface-container-highest/60">
        {steps.map((st) => {
          let cardStyle = 'bg-surface-container-low/70 border-surface-container text-on-surface-variant';
          let icon = null;

          if (st.active) {
            cardStyle = 'bg-primary-container/30 border-primary shadow-purple-glow text-on-surface scale-[1.02]';
            icon = <RefreshCw className="w-4 h-4 text-primary-light animate-spin ml-auto" />;
          } else if (st.completed) {
            cardStyle = 'bg-tertiary-container/20 border-tertiary/40 text-on-surface';
            icon = <CheckCircle2 className="w-4 h-4 text-tertiary ml-auto font-bold" />;
          }

          return (
            <div
              key={st.step}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${cardStyle}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                st.active 
                  ? 'bg-primary text-white shadow-sm' 
                  : (st.completed ? 'bg-tertiary text-white' : 'bg-surface-container text-secondary')
              }`}>
                {st.step}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate text-on-surface">{st.title}</span>
                <span className="font-mono text-[11px] text-primary-light truncate">{st.subtitle}</span>
                <span className="font-mono text-[9px] text-secondary truncate">{st.location}</span>
              </div>
              {icon}
            </div>
          );
        })}
      </div>
    </section>
  );
}
