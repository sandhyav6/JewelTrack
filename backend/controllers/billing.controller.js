'use strict';
const { query }          = require('../db');
const asyncHandler       = require('../utils/asyncHandler');
const AppError           = require('../utils/errors');
const { validateBill }   = require('../utils/validators');
const { createBill }     = require('../services/billing.service');

// GET /api/bills
exports.getAll = asyncHandler(async (req, res) => {
  const sql = `
    SELECT * FROM (
      SELECT
        BILLNO, BILLDATE, CUSTOMERNAME, EMPLOYEENAME,
        SUM(LINEAMOUNT) AS TOTALAMOUNT,
        SUM(QUANTITY)   AS TOTALITEMS
      FROM V_BILL_DETAIL
      GROUP BY BILLNO, BILLDATE, CUSTOMERNAME, EMPLOYEENAME
      ORDER BY BILLDATE DESC
    )
  `;
  const result = await query(sql);
  res.json({ success: true, data: result.rows });
});

// GET /api/bills/next-number
exports.getNextNumber = asyncHandler(async (req, res) => {
  const sql = `
    SELECT NVL(MAX(TO_NUMBER(SUBSTR(BILLNO, 4))), 2847) AS MAXNUM FROM BILL WHERE BILLNO LIKE 'BL-%'
  `;
  const result = await query(sql);
  const next = Number(result.rows[0].MAXNUM) + 1;
  res.json({ success: true, data: { nextBillNo: `BL-${next}` } });
});

// GET /api/bills/:id
exports.getById = asyncHandler(async (req, res) => {
  const headerSql = `
    SELECT DISTINCT BILLNO, BILLDATE, CUSTOMERID, CUSTOMERNAME, EMPLOYEEID, EMPLOYEENAME,
                    SUM(LINEAMOUNT) OVER (PARTITION BY BILLNO) AS TOTALAMOUNT
    FROM V_BILL_DETAIL WHERE BILLNO = :id
  `;
  const itemsSql = `
    SELECT ITEMID, ITEMNAME, CATEGORYNAME, QUANTITY, UNITPRICE, LINEAMOUNT
    FROM V_BILL_DETAIL WHERE BILLNO = :id
  `;
  const [headerRes, itemsRes] = await Promise.all([
    query(headerSql, { id: req.params.id }),
    query(itemsSql,  { id: req.params.id }),
  ]);
  if (!headerRes.rows.length) throw new AppError('Bill not found.', 404);
  res.json({ success: true, data: { ...headerRes.rows[0], items: itemsRes.rows } });
});

// POST /api/bills
exports.create = asyncHandler(async (req, res) => {
  const validated = validateBill(req.body);
  const billNo = await createBill(validated);
  res.status(201).json({ success: true, data: { billNo } });
});
