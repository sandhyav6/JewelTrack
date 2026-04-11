'use strict';
const { query } = require('../db');
const asyncHandler = require('../utils/asyncHandler');

const INVENTORY_SQL = `
  SELECT
    ITEMID,
    ITEMNAME,
    CATEGORYID,
    CATEGORYNAME,
    MATERIAL,
    WEIGHT,
    PRICE AS BASEPRICE,
    AVAILABLEQUANTITY AS CURRENTSTOCK,
    STOCKSTATUS,
    RECENTSUPPLIER AS SUPPLIERNAME,
    5 AS REORDERLEVEL,
    TRUNC(SYSDATE) AS LASTRESTOCKEDDATE,
    '' AS DESCRIPTION
  FROM V_INVENTORY
  ORDER BY ITEMNAME
`;

// GET /api/inventory
exports.getAll = asyncHandler(async (req, res) => {
  const result = await query(INVENTORY_SQL);
  res.json({ success: true, data: result.rows });
});

// GET /api/inventory/low-stock
exports.getLowStock = asyncHandler(async (req, res) => {
  const sql = `
    SELECT
      ITEMID,
      ITEMNAME,
      CATEGORYNAME,
      MATERIAL,
      PRICE AS BASEPRICE,
      AVAILABLEQUANTITY AS CURRENTSTOCK,
      STOCKSTATUS,
      RECENTSUPPLIER AS SUPPLIERNAME,
      5 AS REORDERLEVEL,
      TRUNC(SYSDATE) AS LASTRESTOCKEDDATE,
      '' AS DESCRIPTION
    FROM V_INVENTORY
    WHERE AVAILABLEQUANTITY <= 5
    ORDER BY AVAILABLEQUANTITY ASC
  `;
  const result = await query(sql);
  res.json({ success: true, data: result.rows });
});