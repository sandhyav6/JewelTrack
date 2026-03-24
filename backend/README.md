# JewelTrack Backend Integration

This directory contains the full Node.js & Express.js backend implementation for the JewelTrack Jewellery Store Management System, specifically built to connect to an Oracle Database.

## Features Added
- **Oracle DB Integration**: Comprehensive schema with 9 normalized tables.
- **REST APIs**: Full CRUD for Customers, Suppliers, Items, Billing, Purchases, Inventory, and Dashboard metrics.
- **Data Integrity**: Uses backend sequences and transactions for bills and purchases.
- **Frontend Rewiring**: Modified all original vanilla JS files (`customers.js`, `suppliers.js`, `items.js`, `inventory.js`, `purchases.js`, `billing.js`, `dashboard.js`, `reports.js`) to use dynamic asynchronous fetches from the backend instead of static arrays.

## Prerequisites
- Node.js (v18+)
- Oracle Database (19c, 21c, or 23c)
- Oracle Instant Client (if required by your system for `oracledb` node module)

## Setup Instructions

1. **Database Setup**
   The SQL scripts provided under `sql/` must be executed to prepare the database. Use SQL*Plus, SQL Developer, or any Oracle client:
   - Run `01_create_app_user.sql` as `SYSDBA` to create the `JEWELTRACK_APP` user.
   - Run `02_schema.sql` as the new user to define tables.
   - Run `03_seed.sql` to populate initial demo data.
   - Run `04_views_or_reports.sql` to create analytical views.

2. **Install Dependencies**
   Navigate to this backend folder and run:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment**
   Rename `.env.example` to `.env` and fill in your Oracle DB connection specifics:
   \`\`\`env
   PORT=3000
   ORACLE_USER=JEWELTRACK_APP
   ORACLE_PASSWORD=YourSecurePassword123
   ORACLE_CONNECT_STRING=localhost:1521/XEPDB1  # Update SID or Service Name appropriate to your Oracle instance
   \`\`\`

4. **Run Server**
   \`\`\`bash
   npm start
   # or for development with auto-restarts:
   npm run dev
   \`\`\`

5. **Access Frontend**
   Open the root `index.html` file in your browser to access JewelTrack. The JS files now point to `http://localhost:3000/api/...` to retrieve and modify data.

## Note on Application Security
This implementation retains the frontend's original LocalStorage mechanism for UI-level authentication as per limitations of preserving the original project's visual theme and logic structure perfectly. A complete Auth pipeline would require modifications beyond the stated scope. 
