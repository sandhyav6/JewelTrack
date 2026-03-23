'use strict';
const { query }            = require('../config/db');
const asyncHandler         = require('../utils/asyncHandler');
const AppError             = require('../utils/errors');
const { validatePurchase } = require('../utils/validators');
const { createPurchase }   = require('../services/purchases.service');

// GET /api/purchases
exports.getAll = asyncHandler(async (req, res) => {
  const sql = `
    SELECT PURCHASEID, PURCHASEDATE, SUPPLIERNAME,
           SUM(LINEAMOUNT) AS TOTALVALUE,
           SUM(QUANTITY)   AS TOTALQTY
    FROM V_PURCHASE_DETAIL
    GROUP BY PURCHASEID, PURCHASEDATE, SUPPLIERNAME
    ORDER BY PURCHASEDATE DESC
  `;
  const result = await query(sql);
  res.json({ success: true, data: result.rows });
});

// GET /api/purchases/:id
exports.getById = asyncHandler(async (req, res) => {
  const headerSql = `
    SELECT DISTINCT PURCHASEID, PURCHASEDATE, SUPPLIERID, SUPPLIERNAME,
           SUM(LINEAMOUNT) OVER(PARTITION BY PURCHASEID) AS TOTALVALUE
    FROM V_PURCHASE_DETAIL WHERE PURCHASEID = :id
  `;
  const itemsSql = `
    SELECT ITEMID, ITEMNAME, CATEGORYNAME, QUANTITY, COSTPRICE, LINEAMOUNT
    FROM V_PURCHASE_DETAIL WHERE PURCHASEID = :id
  `;
  const [headerRes, itemsRes] = await Promise.all([
    query(headerSql, { id: req.params.id }),
    query(itemsSql,  { id: req.params.id }),
  ]);
  if (!headerRes.rows.length) throw new AppError('Purchase not found.', 404);
  res.json({ success: true, data: { ...headerRes.rows[0], items: itemsRes.rows } });
});

// POST /api/purchases
exports.create = asyncHandler(async (req, res) => {
  const validated  = validatePurchase(req.body);
  const purchaseId = await createPurchase(validated);
  res.status(201).json({ success: true, data: { purchaseId } });
});
