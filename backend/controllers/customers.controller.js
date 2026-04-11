'use strict';
const { query }           = require('../db');
const asyncHandler        = require('../utils/asyncHandler');
const AppError            = require('../utils/errors');
const { validateCustomer } = require('../utils/validators');
const { nextCustomerId }  = require('../services/idGenerator.service');

const LIST_SQL = `SELECT CUSTOMERID, CUSTOMERNAME, PHONE, TOTALPURCHASES, TOTALSPENT, LASTVISIT, STATUS, FAVORITECATEGORY FROM V_CUSTOMER_STATS ORDER BY CUSTOMERNAME`;

exports.getAll = asyncHandler(async (req, res) => {
  const result = await query(LIST_SQL);
  res.json({ success: true, data: result.rows });
});

exports.getById = asyncHandler(async (req, res) => {
  const sql = `SELECT CUSTOMERID, CUSTOMERNAME, PHONE, TOTALPURCHASES, TOTALSPENT, LASTVISIT, STATUS, FAVORITECATEGORY FROM V_CUSTOMER_STATS WHERE CUSTOMERID = :id`;
  const result = await query(sql, { id: req.params.id });
  if (!result.rows.length) throw new AppError('Customer not found.', 404);
  res.json({ success: true, data: result.rows[0] });
});

exports.create = asyncHandler(async (req, res) => {
  const { name, phone } = validateCustomer(req.body);
  const id = await nextCustomerId();
  await query(
    'INSERT INTO CUSTOMER (CUSTOMERID, CUSTOMERNAME, PHONE) VALUES (:id, :name, :phone)',
    { id, name, phone },
    { autoCommit: true }
  );
  res.status(201).json({ success: true, data: { id, name, phone } });
});

exports.update = asyncHandler(async (req, res) => {
  const { name, phone } = validateCustomer(req.body);
  try {
    const result = await query(
      'UPDATE CUSTOMER SET CUSTOMERNAME = :name, PHONE = :phone WHERE CUSTOMERID = :id',
      { name, phone, id: req.params.id },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) throw new AppError('Customer not found.', 404);
    res.json({ success: true, data: { id: req.params.id, name, phone } });
  } catch (err) {
    if (err.statusCode) throw err;
    throw new AppError(err.message || 'Failed to update customer.', 400);
  }
});

exports.remove = asyncHandler(async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM CUSTOMER WHERE CUSTOMERID = :id',
      { id: req.params.id },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) throw new AppError('Customer not found.', 404);
    res.json({ success: true, message: 'Customer deleted.' });
  } catch (err) {
    if (err.statusCode) throw err;
    if (err.message && err.message.includes('ORA-02292')) {
      throw new AppError('Cannot delete customer with existing bills or transactions.', 400);
    }
    throw new AppError('Failed to delete customer.', 400);
  }
});
