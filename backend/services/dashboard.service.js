'use strict';
const { query } = require('../db');

/**
 * Dashboard summary statistics.
 * Returns keys expected by frontend.
 */
async function getSummary() {
  const sql = `
    SELECT
      NVL((SELECT SUM(LINEAMOUNT) FROM V_BILL_DETAIL), 0) AS TOTALREVENUE,
      (SELECT COUNT(*) FROM BILL) AS TOTALORDERS,
      0 AS NEWCUSTOMERS,
      (SELECT COUNT(*) FROM ITEM WHERE AVAILABLEQUANTITY <= 5) AS LOWSTOCKITEMS
    FROM DUAL
  `;
  const result = await query(sql);
  return result.rows[0];
}

/**
 * Recent sales — last 6 bills with totals.
 * Returns keys expected by frontend.
 */
async function getRecentSales() {
  const sql = `
    SELECT * FROM (
      SELECT
        BD.BILLNO AS REFERENCENO,
        BD.BILLDATE,
        BD.CUSTOMERNAME,
        LISTAGG(BD.ITEMNAME, ', ') WITHIN GROUP (ORDER BY BD.ITEMNAME) AS ITEMS,
        SUM(BD.LINEAMOUNT) AS TOTALAMOUNT,
        'Paid' AS STATUS
      FROM V_BILL_DETAIL BD
      GROUP BY BD.BILLNO, BD.BILLDATE, BD.CUSTOMERNAME
      ORDER BY BD.BILLDATE DESC
    )
    WHERE ROWNUM <= 6
  `;
  const result = await query(sql);
  return result.rows;
}

/**
 * Low stock items.
 * Returns keys expected by frontend.
 */
async function getLowStock() {
  const sql = `
    SELECT
      ITEMID,
      ITEMNAME,
      AVAILABLEQUANTITY AS CURRENTSTOCK,
      5 AS REORDERLEVEL
    FROM V_INVENTORY
    WHERE AVAILABLEQUANTITY <= 5
    ORDER BY AVAILABLEQUANTITY ASC
    FETCH FIRST 8 ROWS ONLY
  `;
  const result = await query(sql);
  return result.rows;
}

/**
 * Top customers by total spent.
 * Returns keys expected by frontend.
 */
async function getTopCustomers() {
  const sql = `
    SELECT * FROM (
      SELECT
        CUSTOMERID,
        CUSTOMERNAME,
        TOTALPURCHASES AS TOTALBILLS,
        TOTALSPENT
      FROM V_CUSTOMER_STATS
      WHERE TOTALSPENT > 0
      ORDER BY TOTALSPENT DESC
    )
    WHERE ROWNUM <= 5
  `;
  const result = await query(sql);
  return result.rows;
}

/**
 * Recent activity.
 * Returns keys expected by inventory/dashboard frontend.
 */
async function getRecentActivity() {
  const billSql = `
    SELECT * FROM (
      SELECT
        'Bill' AS ACTIVITYTYPE,
        BILLNO AS REFERENCEID,
        SUM(LINEAMOUNT) AS AMOUNT,
        CUSTOMERNAME AS PERSONNAME,
        BILLDATE AS ACTIVITYDATE
      FROM V_BILL_DETAIL
      GROUP BY BILLNO, CUSTOMERNAME, BILLDATE
      ORDER BY BILLDATE DESC
    )
    WHERE ROWNUM <= 6
  `;

  const purSql = `
    SELECT * FROM (
      SELECT
        'Purchase' AS ACTIVITYTYPE,
        PURCHASEID AS REFERENCEID,
        SUM(LINEAMOUNT) AS AMOUNT,
        SUPPLIERNAME AS PERSONNAME,
        PURCHASEDATE AS ACTIVITYDATE
      FROM V_PURCHASE_DETAIL
      GROUP BY PURCHASEID, SUPPLIERNAME, PURCHASEDATE
      ORDER BY PURCHASEDATE DESC
    )
    WHERE ROWNUM <= 4
  `;

  const [bills, purchases] = await Promise.all([query(billSql), query(purSql)]);

  return [...bills.rows, ...purchases.rows]
    .sort((a, b) => new Date(b.ACTIVITYDATE) - new Date(a.ACTIVITYDATE))
    .slice(0, 8);
}

module.exports = {
  getSummary,
  getRecentSales,
  getLowStock,
  getTopCustomers,
  getRecentActivity,
};