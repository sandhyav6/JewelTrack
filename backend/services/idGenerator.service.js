'use strict';
const { query } = require('../db');

/**
 * Generates the next ID for a given entity by querying the current max.
 * Prefixes and starting values match the existing frontend ID conventions.
 *
 * @param {string} table       - Oracle table name
 * @param {string} idColumn    - Primary key column name
 * @param {string} prefix      - ID prefix string (e.g. 'CUS-')
 * @param {number} startNum    - Minimum starting number if table is empty
 * @returns {string}           - Next ID string (e.g. 'CUS-1011')
 */
async function nextId(table, idColumn, prefix, startNum) {
  const escapedPrefix = prefix.replace(/'/g, "''");
  const sql = `
    SELECT NVL(MAX(
      TO_NUMBER(SUBSTR(${idColumn}, ${prefix.length + 1}))
    ), ${startNum - 1}) AS MAXNUM
    FROM ${table}
    WHERE ${idColumn} LIKE '${escapedPrefix}%'
  `;
  const result = await query(sql);
  const maxNum = Number(result.rows[0].MAXNUM);
  return `${prefix}${maxNum + 1}`;
}

// Individual helpers per entity
const nextCustomerId  = () => nextId('CUSTOMER',  'CUSTOMERID',  'CUS-', 1001);
const nextSupplierId  = () => nextId('SUPPLIER',  'SUPPLIERID',  'SUP-', 101);
const nextEmployeeId  = () => nextId('EMPLOYEE',  'EMPLOYEEID',  'EMP-', 101);
const nextCategoryId  = () => nextId('CATEGORY',  'CATEGORYID',  'CAT-', 101);
const nextItemId      = () => nextId('ITEM',       'ITEMID',      'JW-',  1001);
const nextBillNo      = () => nextId('BILL',       'BILLNO',      'BL-',  2848);
const nextPurchaseId  = () => nextId('PURCHASE',   'PURCHASEID',  'PO-',  1201);

module.exports = {
  nextCustomerId,
  nextSupplierId,
  nextEmployeeId,
  nextCategoryId,
  nextItemId,
  nextBillNo,
  nextPurchaseId,
};
