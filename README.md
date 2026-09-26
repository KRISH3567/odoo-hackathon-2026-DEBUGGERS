# 📦 StockSense — Modular Inventory Management System (IMS)

> **Odoo x LPU Hackathon 2026 (Virtual Round)**  
> Developed by **Team DEBUGGERS**

---

## 👥 Team Information
- **Team Name:** DEBUGGERS
- **Team Leader:** Krish Sharma ([@KRISH3567](https://github.com/KRISH3567))
- **Team Members:**
  1. **Krish Sharma** (Team Leader)
  2. **Siratpreet Kaur**
  3. **Navya Mahajan**

---

## 📌 Problem Statement Overview
Small and medium businesses running manufacturing and retail operations frequently suffer from lost revenue, stockouts, and untracked shrinkage due to manual paper registers and fragmented spreadsheets.

**StockSense** is a centralized, real-time, modular Inventory Management System (IMS) inspired by **Odoo's double-entry inventory philosophy**. It replaces manual tracking by digitizing incoming receipts, outgoing delivery dispatches, internal bin transfers, physical cycle count adjustments, and an immutable stock ledger.

---

## 🚀 Key Modules & Capabilities

### 1. Operations Hub
- **Receipts (Incoming Stock):** Receive supplier shipments with line items. Validating increases stock automatically (`Receive 50 units -> Stock +50`).
- **Delivery Orders (Outgoing Stock):** 3-stage dispatch process (**Pick $\to$ Pack $\to$ Validate**) to decrease stock for customer orders.
- **Internal Transfers:** Move materials between internal company locations (e.g., *Main Store $\to$ Production Rack*, *Rack A $\to$ Rack B*) without changing total company stock.
- **Stock Adjustments:** Resolve discrepancies between system-recorded stock and physical counts with automatic shrinkage logging and loss calculation.
- **Move History (Stock Ledger):** Immutable double-entry ledger logging every transaction with timestamps, source, destination, and reference codes.

### 2. Products & Multi-Location Stock
- Full product catalog with SKU, Category, Cost/Selling price, and Unit of Measure (UoM).
- Real-time stock availability broken down per location and warehouse.
- Configurable **Min/Max Reordering Rules**.

### 3. Executive Dashboard
- **5 Mandatory Operational KPIs:**
  1. *Total Products in Stock* (On-hand count & valuation)
  2. *Low Stock / Out of Stock Items*
  3. *Pending Receipts* (Awaiting vendor delivery)
  4. *Pending Deliveries* (Awaiting dispatch)
  5. *Internal Transfers Scheduled*
- **Dynamic Filters:** Filter operations by Document Type (*Receipts, Deliveries, Transfers, Adjustments*), Status (*Draft, Waiting, Ready, Done, Canceled*), Warehouse, and Product Category.

### 4. 🏆 Unique Winning Innovations
- **Interactive 1-Click Odoo Flow Walkthrough:** A top-bar shortcut that automatically executes Odoo's official 4-step reference flow live (*Receive 100kg Steel $\to$ Move to Production Rack $\to$ Deliver 20kg $\to$ Scrap 3kg Damaged*).
- **Double-Entry Flow Map:** Visual diagram of inventory moving across *Vendors $\to$ Stock Racks $\to$ Production $\to$ Customers/Scrap*.
- **Dynamic Predictive Reordering (AI Stress-Test):** An interactive **Demand Spike (0% to +100%)** slider calculating dynamic Reorder Points ($\text{ROP} = \text{Demand} \times \text{Lead Time} + \text{Safety Stock}$).
- **Smart Barcode Scanner Simulator:** Rapid scanning tool for warehouse floor staff to pick, pack, and verify bins with sound feedback.
- **FEFO Batch Expiry & Markdown Engine:** First-Expired, First-Out batch sequencing with automated dynamic discounts for perishable items.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS (Enterprise Odoo theme)
- **Icons:** Lucide React
- **State & Storage:** React State + LocalStorage persistence (instant demo readiness)
- **Reporting:** Browser Print Engine (`window.print()`) for Purchase Orders and Receipts

---

## ⚙️ Local Setup and Run Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/KRISH3567/odoo-hackathon-2026-DEBUGGERS.git
cd odoo-hackathon-2026-DEBUGGERS

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open your browser and navigate to:  
👉 **`http://localhost:5173`**

---

## 🎥 Demo Video Link
- **Demo Video:** *[To be updated upon recording submission]* (Duration: 5–6 Minutes)
