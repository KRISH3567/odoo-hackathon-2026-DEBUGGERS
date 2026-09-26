# 📦 StockSense IMS v2.0 — Next-Gen Modular Inventory Management System
> **Official Submission for Odoo x LPU Hackathon 2026 (Virtual Round)**  
> **Team Name:** DEBUGGERS  
> **Team Members:**
> 1. **Krish Sharma** (Team Leader) — GitHub: [@KRISH3567](https://github.com/KRISH3567)
> 2. **Gursimarjit Singh**
> 3. **Siratpreet Kaur**
> 4. **Navya Mahajan**  
> **Date:** September 26, 2026  
> **Specification Compliance:** 100% Alignment with Official Odoo Double-Entry PRD + Winning Innovations

---

## 🌟 Executive Summary & Problem Statement

Traditional micro, small, and medium businesses (MSMEs) rely heavily on manual paper registers, fragmented Excel spreadsheets, and informal communication channels to manage warehouse inventory. This causes frequent stockouts, untracked shrinkage, delayed customer shipments, and costly discrepancies.

**StockSense IMS** digitizes and unifies all incoming, outgoing, internal, and adjustment stock operations into an intuitive, real-time platform matching **Odoo's world-class double-entry inventory philosophy**.

---

## 🏆 Key Features & Innovations

### 1. ⚡ Interactive 1-Click Official Odoo Scenario Walkthrough
- Executes the official 4-step benchmark lifecycle in 15 seconds:
  1. **Vendor Receipt:** Receive 100 kg Steel from Tata Steel (`+100 kg` into WH1 Central Store).
  2. **Internal Transfer:** Relocate 80 kg from WH1 Store to WH2 Production Rack.
  3. **Customer Delivery:** Ship 20 kg to Bharat Infra Ltd (`-20 kg` customer debit).
  4. **Cycle Adjustment:** Audit finds 3 kg damaged on rack (`-3 kg` moved to Virtual Scrap).
- **Live Reactive Updates:** Watch KPIs, Location Quantities, the Visual Node Map, and the Stock Ledger synchronize in real-time with celebratory confetti on completion.

### 2. 🗺️ Odoo Double-Entry Visual Material Flow Map
- Interactive visual node diagram displaying balanced material routing:
  ```
  [Vendors (Virtual)] ──> [WH1: Main Store] ──> [WH2: Production Floor] ──> [Customers (Virtual)]
                                │
                                └──> [Virtual Scrap & Damaged]
  ```
- Complies strictly with Odoo's core principle: **Inventory is never lost or magically created — it is always moved from a source location to a destination location.**

### 3. 🧠 Predictive Reorder Rules & AI Stress-Test Engine
- Goes beyond static min/max thresholds with dynamic consumption formulas:
  $$\text{ROP} = (\text{Daily Demand} \times \text{Lead Time}) + \text{Safety Stock}$$
  $$\text{DIR} = \frac{\text{Current Stock}}{\text{Average Daily Demand}}$$
- **Interactive Stress Sliders:** Simulate demand surges (0% to +150%) and logistics delays (0 to 21 days) to test supply chain resilience.
- **1-Click Auto-Draft POs:** Instantly generates supplier purchase orders for items falling below safety limits.

### 4. 🔍 Smart Barcode & Handheld Scanner Simulator
- Tailored for the **Warehouse Staff** persona.
- Features an optical scanner viewport with animated laser reticle, Web Audio API synthesizer chirps, and instant 1-click presets:
  - Verify SKU: `[RAW-STL-001]`
  - Auto-Pick & Dispatch: `[WH/OUT/2026/0291]`
  - Bin Check: `[LOC-RACK-A04]`
  - Receive PO: `[WH/IN/2026/0043]`
- Supports manual keyboard input or physical USB/Bluetooth handheld barcode scanners.

### 5. ⏳ FEFO & Perishable Batch Expiry Intelligence
- First-Expired, First-Out sequence tracking batch numbers and expiration countdowns.
- Automatic dynamic markdown suggestions (e.g. 25% discount) to salvage margins on products nearing expiration before spoilage occurs.

### 6. 📊 Shrinkage Financial Impact & Loss Prevention
- Automatically quantifies financial loss from damaged and unaccounted stock.
- Breaks down leakage root causes (Handling Damage vs. Cycle Variance) with audit tracking.

### 7. 📄 Printable Slips & Audit Reporting
- Official print-ready documents with barcodes, timestamps, and signature blocks:
  - Goods Receipt Notes (GRN)
  - Delivery Packing & Dispatch Slips
  - Internal Transfer Manifests
  - Physical Count Reconciliation Memos
- Instant one-click CSV export for all stock moves and catalog entities.

---

## 🛠️ Technical Stack & Architecture

- **Frontend:** React 19 + Vite (lightning-fast build & hot module replacement)
- **Styling:** Tailwind CSS v4 with an enterprise Odoo aubergine & clean navy color palette
- **Typography:** Geist, Inter, and JetBrains Mono with Google Material Symbols
- **State Architecture:** React Context API with LocalStorage caching (state persists across browser refreshes with zero backend friction)
- **Sound Effects:** Pure HTML5 Web Audio API synthesizer (no external audio assets required)
- **Micro-Interactions:** `canvas-confetti` celebrations upon order and scenario completion

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Run

1. Clone or navigate to the repository directory:
   ```bash
   cd stocksense
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🕒 4-Hour Hackathon Commit Roadmap (Rule 04 Compliance)

- **Hour 1 — Core Layout, Navigation & Product Management**
  - *Lead:* Krish Sharma
  - *Commit:* `feat: initialize enterprise layout, product management, and multi-location data`
- **Hour 2 — Operations Hub (Receipts & Delivery Orders)**
  - *Lead:* Gursimarjit Singh
  - *Commit:* `feat: implement incoming receipts and outgoing delivery operations with stock automation`
- **Hour 3 — Internal Transfers, Stock Adjustments & Move History Ledger**
  - *Lead:* Siratpreet Kaur
  - *Commit:* `feat: add internal transfers, cycle count adjustments, and double-entry stock ledger`
- **Hour 4 — Winning Innovations, Printable POs & Final Polish**
  - *Lead:* Navya Mahajan
  - *Commit:* `feat: add predictive ROP engine, barcode simulator, FEFO batching, and complete documentation`

---

## 🎤 Evaluator 5-Minute Demo Script

- **[0:00 - 0:45] The Pitch:**
  *"Hello evaluators. We are Team DEBUGGERS. We built StockSense — a modular Inventory Management System tailored specifically to Odoo's design principles. StockSense replaces clunky spreadsheets and manual registers with real-time, double-entry inventory tracking."*
- **[0:45 - 1:45] The 5 Dashboard KPIs & Dynamic Filtering:**
  *"Our landing dashboard shows the 5 required operational metrics: Total Products in Stock, Low Stock alerts, Pending Receipts, Pending Deliveries, and Scheduled Internal Transfers. Our dynamic filters let managers slice data by document type, status, warehouse, and category."*
- **[1:45 - 2:45] The 4-Step Official Odoo Flow Demo:**
  *"To prove end-to-end functionality, click 'Run Official Odoo Flow':*
  1. *Receipt: 100 kg Steel received from Tata Steel into WH1.*
  2. *Internal Transfer: 80 kg moved to WH2 Production Rack.*
  3. *Delivery Order: 20 kg dispatched to Bharat Infra.*
  4. *Cycle Adjustment: 3 kg damaged found on rack moved to Virtual Scrap.*
  *Every movement is immediately recorded in our immutable Double-Entry Stock Ledger."*
- **[2:45 - 3:45] Winning Innovations (Predictive ROP & Barcode Simulator):**
  *"StockSense introduces an intelligent ROP engine with Demand Spike sliders and 1-Click PO generation. For warehouse floor staff, our Barcode Simulator allows 1-click scanning for rapid picking and shelving without touching a keyboard."*
- **[3:45 - 4:45] FEFO Batch Expiry & Shrinkage Analytics:**
  *"For perishable stock, we enforce FEFO batch sequencing and provide dynamic markdown recommendations. Our stock adjustment module also calculates shrinkage financial loss in Rupees."*
- **[4:45 - 5:15] Architecture & Conclusion:**
  *"StockSense is fully modular, responsive, offline-capable via LocalStorage, and ready to interface directly with Odoo APIs via XML-RPC. Thank you!"*

---

*Built with passion by Team DEBUGGERS for the Odoo Combat Hackathon 2026.*
