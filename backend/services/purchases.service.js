'use strict';
const { getConnection }  = require('../db');
const { nextPurchaseId } = require('./idGenerator.service');
const AppError           = require('../utils/errors');

/**
 * Create a purchase atomically:
 *  1. INSERT PURCHASE
 *  2. INSERT PURCHASE_ITEM rows
 *  3. INCREMENT ITEM.AvailableQuantity
 *  4. COMMIT — or ROLLBACK on any error
 *
 * @param {object} params
 * @param {string} params.supplierId
 * @param {Date}   params.purchaseDate
 * @param {Array}  params.items  — [{ itemId, quantity, costPrice }]
 * @returns {string} purchaseId
 */
async function createPurchase({ supplierId, purchaseDate, items }) {
  let conn;
  try {
    conn = await getConnection();

    // ── 1. Validate each item exists ────────────────────────
    for (const it of items) {
      const check = await conn.execute(
        'SELECT ITEMID FROM ITEM WHERE ITEMID = :id',
        { id: it.itemId }
      );
      if (check.rows.length === 0) {
        throw new AppError(`Item ${it.itemId} does not exist.`, 400);
      }
    }

    // ── 2. Generate purchase ID ─────────────────────────────
    const purchaseId = await nextPurchaseId();

    // ── 3. INSERT PURCHASE ──────────────────────────────────
    await conn.execute(
      `INSERT INTO PURCHASE (PURCHASEID, PURCHASEDATE, SUPPLIERID)
       VALUES (:purchaseId, :purchaseDate, :supplierId)`,
      { purchaseId, purchaseDate, supplierId }
    );

    // ── 4. INSERT PURCHASE_ITEM + increment stock ───────────
    for (const it of items) {
      await conn.execute(
        `INSERT INTO PURCHASE_ITEM (PURCHASEID, ITEMID, QUANTITY, COSTPRICE)
         VALUES (:purchaseId, :itemId, :qty, :costPrice)`,
        { purchaseId, itemId: it.itemId, qty: it.quantity, costPrice: it.costPrice }
      );

      await conn.execute(
        `UPDATE ITEM SET AVAILABLEQUANTITY = AVAILABLEQUANTITY + :qty
         WHERE ITEMID = :id`,
        { qty: it.quantity, id: it.itemId }
      );
    }

    // ── 5. COMMIT ────────────────────────────────────────────
    await conn.commit();
    return purchaseId;

  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) await conn.close();
  }
}

module.exports = { createPurchase };
