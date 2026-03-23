'use strict';
const express = require('express');
const cors = require('cors');

const customersRoutes   = require('./routes/customers.routes');
const itemsRoutes       = require('./routes/items.routes');
const suppliersRoutes   = require('./routes/suppliers.routes');
const billingRoutes     = require('./routes/billing.routes');
const purchasesRoutes   = require('./routes/purchases.routes');
const inventoryRoutes   = require('./routes/inventory.routes');
const dashboardRoutes   = require('./routes/dashboard.routes');
const reportsRoutes     = require('./routes/reports.routes');
const employeesRoutes   = require('./routes/employees.routes');
const categoriesRoutes  = require('./routes/categories.routes');

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: '*',  // Allow all origins for local development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'JewelTrack API is running', timestamp: new Date() });
});

// ── API Routes ─────────────────────────────────────────────
app.use('/api/customers',   customersRoutes);
app.use('/api/items',       itemsRoutes);
app.use('/api/suppliers',   suppliersRoutes);
app.use('/api/bills',       billingRoutes);
app.use('/api/purchases',   purchasesRoutes);
app.use('/api/inventory',   inventoryRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/reports',     reportsRoutes);
app.use('/api/employees',   employeesRoutes);
app.use('/api/categories',  categoriesRoutes);

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.message   || 'Internal Server Error';
  console.error(`[Error] ${statusCode} — ${message}`);
  res.status(statusCode).json({ success: false, error: message });
});

module.exports = app;
