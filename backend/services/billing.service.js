'use strict';
const { getConnection } = require('../db');
const { nextBillNo }    = require('./idGenerator.service');
const AppError          = require('../utils/errors');

/**
 * Create a bill atomically:
 *  1. Validate stock availability for all items
 *  2. INSERT BILL
 *  3. INSERT BILL_ITEM rows
 *  4. Decrement ITEM.AvailableQuantity
 *  5. COMMIT — or ROLLBACK on any error
 *
 * @param {object} params
 * @param {string} params.customerId
 * @param {string} params.employeeId
 * @param {Date}   params.billDate
 * @param {Array}  params.items  — [{ itemId, quantity }]
 * @returns {string} billNo
 */
async function createBill({ customerId, employeeId, billDate, items }) {
  let conn;
  try {
    conn = await getConnection();

    // ── 1. Validate stock for each item ────────────────────
    for (const it of items) {
      const stockResult = await conn.execute(
        'SELECT AVAILABLEQUANTITY, ITEMNAME FROM ITEM WHERE ITEMID = :id',
        { id: it.itemId }
      );
      if (stockResult.rows.length === 0) {
        throw new AppError(`Item ${it.itemId} does not exist.`, 400);
      }
      const row = stockResult.rows[0];
      if (row.AVAILABLEQUANTITY < it.quantity) {
        throw new AppError(
          `Insufficient stock for "${row.ITEMNAME}". Available: ${row.AVAILABLEQUANTITY}, requested: ${it.quantity}.`,
          400
        );
      }
    }

    // ── 2. Generate bill number ─────────────────────────────
    const billNo = await nextBillNo();

    // ── 3. INSERT BILL ──────────────────────────────────────
    await conn.execute(
      `INSERT INTO BILL (BILLNO, BILLDATE, CUSTOMERID, EMPLOYEEID)
       VALUES (:billNo, :billDate, :customerId, :employeeId)`,
      { billNo, billDate, customerId, employeeId }
    );

    // ── 4. INSERT BILL_ITEM + decrement stock ───────────────
    for (const it of items) {
      await conn.execute(
        `INSERT INTO BILL_ITEM (BILLNO, ITEMID, QUANTITY)
         VALUES (:billNo, :itemId, :qty)`,
        { billNo, itemId: it.itemId, qty: it.quantity }
      );

      await conn.execute(
        `UPDATE ITEM SET AVAILABLEQUANTITY = AVAILABLEQUANTITY - :qty
         WHERE ITEMID = :id`,
        { qty: it.quantity, id: it.itemId }
      );
    }

    // ── 5. COMMIT ────────────────────────────────────────────
    await conn.commit();
    return billNo;

  } catch (err) {
    if (conn) await conn.rollback();
    throw err;  // Re-throw so controller can respond
  } finally {
    if (conn) await conn.close();
  }
}

module.exports = { createBill };
