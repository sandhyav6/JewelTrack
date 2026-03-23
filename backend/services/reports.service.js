'use strict';
const { query } = require('../config/db');

/**
 * Sales trend — daily totals for the last 30 days.
 */
async function getSalesTrend() {
  const sql = `
    SELECT
      TRUNC(BD.BILLDATE) AS SALEDATE,
      SUM(BD.LINEAMOUNT)      AS DAILYTOTAL
    FROM V_BILL_DETAIL BD
    WHERE BD.BILLDATE >= SYSDATE - 30
    GROUP BY TRUNC(BD.BILLDATE)
    ORDER BY SALEDATE ASC
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    date:  r.SALEDATE,
    total: Number(r.DAILYTOTAL),
  }));
}

/**
 * Category distribution — revenue per category from bills.
 */
async function getCategoryDistribution() {
  const sql = `
    SELECT
      CATEGORYNAME,
      SUM(LINEAMOUNT) AS TOTALREVENUE
    FROM V_BILL_DETAIL
    GROUP BY CATEGORYNAME
    ORDER BY TOTALREVENUE DESC
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    category: r.CATEGORYNAME,
    revenue:  Number(r.TOTALREVENUE),
  }));
}

/**
 * Top selling items by quantity sold.
 */
async function getTopItems() {
  const sql = `
    SELECT * FROM (
      SELECT
        ITEMID, ITEMNAME, CATEGORYNAME,
        SUM(QUANTITY)    AS QTYSOLD,
        SUM(LINEAMOUNT)  AS REVENUE
      FROM V_BILL_DETAIL
      GROUP BY ITEMID, ITEMNAME, CATEGORYNAME
      ORDER BY QTYSOLD DESC
    ) WHERE ROWNUM <= 8
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    id:       r.ITEMID,
    name:     r.ITEMNAME,
    category: r.CATEGORYNAME,
    qtySold:  Number(r.QTYSOLD),
    revenue:  Number(r.REVENUE),
  }));
}

/**
 * Top customers by spend.
 */
async function getTopCustomers() {
  const sql = `
    SELECT * FROM (
      SELECT CUSTOMERID, CUSTOMERNAME, TOTALPURCHASES, TOTALSPENT
      FROM V_CUSTOMER_STATS
      WHERE TOTALSPENT > 0
      ORDER BY TOTALSPENT DESC
    ) WHERE ROWNUM <= 8
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    id:        r.CUSTOMERID,
    name:      r.CUSTOMERNAME,
    purchases: Number(r.TOTALPURCHASES),
    spent:     Number(r.TOTALSPENT),
  }));
}

/**
 * Inventory status summary.
 */
async function getInventoryStatus() {
  const sql = `
    SELECT
      COUNT(*) AS TOTAL,
      SUM(CASE WHEN AVAILABLEQUANTITY > 5  THEN 1 ELSE 0 END) AS INSTOCK,
      SUM(CASE WHEN AVAILABLEQUANTITY BETWEEN 1 AND 5 THEN 1 ELSE 0 END) AS LOWSTOCK,
      SUM(CASE WHEN AVAILABLEQUANTITY = 0  THEN 1 ELSE 0 END) AS OUTOFSTOCK
    FROM ITEM
  `;
  const result = await query(sql);
  const row = result.rows[0];
  return {
    total:      Number(row.TOTAL),
    inStock:    Number(row.INSTOCK),
    lowStock:   Number(row.LOWSTOCK),
    outOfStock: Number(row.OUTOFSTOCK),
  };
}

module.exports = {
  getSalesTrend,
  getCategoryDistribution,
  getTopItems,
  getTopCustomers,
  getInventoryStatus,
};
