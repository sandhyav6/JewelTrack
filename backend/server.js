require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const path = require('path');
const { createPool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const dbUser = process.env.DB_USER || process.env.ORACLE_USER;
const dbPassword = process.env.DB_PASSWORD || process.env.ORACLE_PASSWORD;
const dbConnectString = process.env.DB_CONNECT_STRING || process.env.ORACLE_CONNECT_STRING;

console.log('DB_USER =', dbUser);
console.log('DB_CONNECT_STRING =', dbConnectString);

async function testConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: dbUser,
      password: dbPassword,
      connectString: dbConnectString
    });

    console.log('[Oracle] Connected successfully');
    await connection.close();
  } catch (err) {
    console.error('[Oracle] Connection failed:', err.message);
  }
}

testConnection();

(async () => {
  try {
    await createPool();
    console.log('Database pool created successfully.');
  } catch (err) {
    console.error('Failed to create database pool:', err.message);
  }
})();

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API running' });
});

const billingRoutes = require('./routes/billing.routes');
const categoriesRoutes = require('./routes/categories.routes');
const customersRoutes = require('./routes/customers.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const employeesRoutes = require('./routes/employees.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const itemsRoutes = require('./routes/items.routes');
const purchasesRoutes = require('./routes/purchases.routes');
const reportsRoutes = require('./routes/reports.routes');
const suppliersRoutes = require('./routes/suppliers.routes');

app.use('/api/billing', billingRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/suppliers', suppliersRoutes);

// API 404 fallback (returns JSON instead of HTML)
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
