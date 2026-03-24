'use strict';
const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/errors');
const { validateItem } = require('../utils/validators');
const { nextItemId } = require('../services/idGenerator.service');

const LIST_SQL = `
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
    RECENTSUPPLIER AS SUPPLIERNAME
  FROM V_INVENTORY
  ORDER BY ITEMNAME
`;

exports.getAll = asyncHandler(async (req, res) => {
  const result = await query(LIST_SQL);

  const data = result.rows.map(r => ({
    ITEMID: r.ITEMID,
    ITEMNAME: r.ITEMNAME,
    CATEGORYID: r.CATEGORYID,
    CATEGORYNAME: r.CATEGORYNAME,
    MATERIAL: r.MATERIAL,
    WEIGHT: r.WEIGHT,
    BASEPRICE: Number(r.BASEPRICE || 0),
    CURRENTSTOCK: Number(r.CURRENTSTOCK || 0),
    STOCKSTATUS: r.STOCKSTATUS,
    SUPPLIERNAME: r.SUPPLIERNAME || 'N/A',
    SUPPLIERID: null,
    DESCRIPTION: ''
  }));

  res.json({ success: true, data });
});

exports.getById = asyncHandler(async (req, res) => {
  const sql = `
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
      RECENTSUPPLIER AS SUPPLIERNAME
    FROM V_INVENTORY
    WHERE ITEMID = :id
  `;
  const result = await query(sql, { id: req.params.id });
  if (!result.rows.length) throw new AppError('Item not found.', 404);

  const r = result.rows[0];
  res.json({
    success: true,
    data: {
      ITEMID: r.ITEMID,
      ITEMNAME: r.ITEMNAME,
      CATEGORYID: r.CATEGORYID,
      CATEGORYNAME: r.CATEGORYNAME,
      MATERIAL: r.MATERIAL,
      WEIGHT: r.WEIGHT,
      BASEPRICE: Number(r.BASEPRICE || 0),
      CURRENTSTOCK: Number(r.CURRENTSTOCK || 0),
      STOCKSTATUS: r.STOCKSTATUS,
      SUPPLIERNAME: r.SUPPLIERNAME || 'N/A',
      SUPPLIERID: null,
      DESCRIPTION: ''
    }
  });
});

exports.create = asyncHandler(async (req, res) => {
  const { name, categoryId, material, weight, price, stock } = validateItem(req.body);
  const id = await nextItemId();

  await query(
    `INSERT INTO ITEM (ITEMID, ITEMNAME, CATEGORYID, MATERIAL, WEIGHT, PRICE, AVAILABLEQUANTITY)
     VALUES (:id, :name, :categoryId, :material, :weight, :price, :stock)`,
    { id, name, categoryId, material, weight, price, stock },
    { autoCommit: true }
  );

  res.status(201).json({
    success: true,
    data: {
      ITEMID: id,
      ITEMNAME: name,
      CATEGORYID: categoryId,
      MATERIAL: material,
      WEIGHT: weight,
      BASEPRICE: Number(price),
      CURRENTSTOCK: Number(stock),
      SUPPLIERNAME: 'N/A',
      SUPPLIERID: null,
      DESCRIPTION: ''
    }
  });
});

exports.update = asyncHandler(async (req, res) => {
  const { name, categoryId, material, weight, price, stock } = validateItem(req.body);

  const result = await query(
    `UPDATE ITEM
     SET ITEMNAME = :name,
         CATEGORYID = :categoryId,
         MATERIAL = :material,
         WEIGHT = :weight,
         PRICE = :price,
         AVAILABLEQUANTITY = :stock
     WHERE ITEMID = :id`,
    { name, categoryId, material, weight, price, stock, id: req.params.id },
    { autoCommit: true }
  );

  if (result.rowsAffected === 0) throw new AppError('Item not found.', 404);

  res.json({
    success: true,
    data: {
      ITEMID: req.params.id,
      ITEMNAME: name,
      CATEGORYID: categoryId,
      MATERIAL: material,
      WEIGHT: weight,
      BASEPRICE: Number(price),
      CURRENTSTOCK: Number(stock),
      SUPPLIERNAME: 'N/A',
      SUPPLIERID: null,
      DESCRIPTION: ''
    }
  });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await query(
    'DELETE FROM ITEM WHERE ITEMID = :id',
    { id: req.params.id },
    { autoCommit: true }
  );

  if (result.rowsAffected === 0) throw new AppError('Item not found.', 404);

  res.json({ success: true, message: 'Item deleted.' });
});