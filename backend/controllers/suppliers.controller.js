'use strict';
const { query }             = require('../config/db');
const asyncHandler          = require('../utils/asyncHandler');
const AppError              = require('../utils/errors');
const { validateSupplier }  = require('../utils/validators');
const { nextSupplierId }    = require('../services/idGenerator.service');

const LIST_SQL = `
  SELECT SUPPLIERID, SUPPLIERNAME, SUPPLIERPHONE, TOTALORDERS, TOTALVALUE,
         LASTSUPPLY, STATUS, SUPPLYCATEGORY
  FROM V_SUPPLIER_STATS ORDER BY SUPPLIERNAME
`;

exports.getAll = asyncHandler(async (req, res) => {
  const result = await query(LIST_SQL);
  res.json({ success: true, data: result.rows });
});

exports.getById = asyncHandler(async (req, res) => {
  const sql = `
    SELECT SUPPLIERID, SUPPLIERNAME, SUPPLIERPHONE, TOTALORDERS, TOTALVALUE,
           LASTSUPPLY, STATUS, SUPPLYCATEGORY
    FROM V_SUPPLIER_STATS WHERE SUPPLIERID = :id
  `;
  const result = await query(sql, { id: req.params.id });
  if (!result.rows.length) throw new AppError('Supplier not found.', 404);
  res.json({ success: true, data: result.rows[0] });
});

exports.create = asyncHandler(async (req, res) => {
  const { name, phone } = validateSupplier(req.body);
  const id = await nextSupplierId();
  await query(
    'INSERT INTO SUPPLIER (SUPPLIERID, SUPPLIERNAME, SUPPLIERPHONE) VALUES (:id, :name, :phone)',
    { id, name, phone },
    { autoCommit: true }
  );
  res.status(201).json({ success: true, data: { id, name, phone } });
});

exports.update = asyncHandler(async (req, res) => {
  const { name, phone } = validateSupplier(req.body);
  const result = await query(
    'UPDATE SUPPLIER SET SUPPLIERNAME=:name, SUPPLIERPHONE=:phone WHERE SUPPLIERID=:id',
    { name, phone, id: req.params.id },
    { autoCommit: true }
  );
  if (result.rowsAffected === 0) throw new AppError('Supplier not found.', 404);
  res.json({ success: true, data: { id: req.params.id, name, phone } });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await query(
    'DELETE FROM SUPPLIER WHERE SUPPLIERID = :id',
    { id: req.params.id },
    { autoCommit: true }
  );
  if (result.rowsAffected === 0) throw new AppError('Supplier not found.', 404);
  res.json({ success: true, message: 'Supplier deleted.' });
});
