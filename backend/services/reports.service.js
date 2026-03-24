'use strict';
const { query } = require('../config/db');

/**
 * Sales trend — daily totals for the last 30 days.
 * Returns raw-style keys expected by frontend.
 */
async function getSalesTrend() {
  const sql = `
    SELECT
      TRUNC(BD.BILLDATE) AS BILLDATE,
      SUM(BD.LINEAMOUNT) AS DAILYTOTAL
    FROM V_BILL_DETAIL BD
    WHERE BD.BILLDATE >= SYSDATE - 30
    GROUP BY TRUNC(BD.BILLDATE)
    ORDER BY BILLDATE ASC
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    BILLDATE: r.BILLDATE,
    DAILYTOTAL: Number(r.DAILYTOTAL),
  }));
}

/**
 * Category distribution — revenue per category from bills.
 * Returns raw-style keys expected by frontend.
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
    CATEGORYNAME: r.CATEGORYNAME,
    TOTALREVENUE: Number(r.TOTALREVENUE),
  }));
}

/**
 * Top selling items by quantity sold.
 * Returns raw-style keys expected by frontend.
 */
async function getTopItems() {
  const sql = `
    SELECT * FROM (
      SELECT
        ITEMID,
        ITEMNAME,
        CATEGORYNAME,
        SUM(QUANTITY)   AS QTYSOLD,
        SUM(LINEAMOUNT) AS REVENUE
      FROM V_BILL_DETAIL
      GROUP BY ITEMID, ITEMNAME, CATEGORYNAME
      ORDER BY QTYSOLD DESC, REVENUE DESC, ITEMNAME ASC
    ) WHERE ROWNUM <= 8
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    ITEMID: r.ITEMID,
    ITEMNAME: r.ITEMNAME,
    CATEGORYNAME: r.CATEGORYNAME,
    QTYSOLD: Number(r.QTYSOLD),
    REVENUE: Number(r.REVENUE),
  }));
}

/**
 * Top customers by spend.
 * Returns raw-style keys expected by frontend.
 */
async function getTopCustomers() {
  const sql = `
    SELECT * FROM (
      SELECT
        CUSTOMERID,
        CUSTOMERNAME,
        TOTALPURCHASES,
        TOTALSPENT
      FROM V_CUSTOMER_STATS
      WHERE TOTALSPENT > 0
      ORDER BY TOTALSPENT DESC, TOTALPURCHASES DESC, CUSTOMERNAME ASC
    ) WHERE ROWNUM <= 8
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    CUSTOMERID: r.CUSTOMERID,
    CUSTOMERNAME: r.CUSTOMERNAME,
    TOTALPURCHASES: Number(r.TOTALPURCHASES),
    TOTALSPENT: Number(r.TOTALSPENT),
  }));
}

/**
 * Inventory status summary.
 * Returns raw-style keys expected by frontend.
 */
async function getInventoryStatus() {
  const sql = `
    SELECT
      COUNT(*) AS TOTAL,
      SUM(CASE WHEN AVAILABLEQUANTITY > 5 THEN 1 ELSE 0 END) AS INSTOCK,
      SUM(CASE WHEN AVAILABLEQUANTITY BETWEEN 1 AND 5 THEN 1 ELSE 0 END) AS LOWSTOCK,
      SUM(CASE WHEN AVAILABLEQUANTITY = 0 THEN 1 ELSE 0 END) AS OUTOFSTOCK
    FROM ITEM
  `;
  const result = await query(sql);
  const row = result.rows[0];
  return {
    TOTAL: Number(row.TOTAL),
    INSTOCK: Number(row.INSTOCK),
    LOWSTOCK: Number(row.LOWSTOCK),
    OUTOFSTOCK: Number(row.OUTOFSTOCK),
    IN_STOCK: Number(row.INSTOCK),
    LOW_STOCK: Number(row.LOWSTOCK),
    OUT_OF_STOCK: Number(row.OUTOFSTOCK),
  };
}

module.exports = {
  getSalesTrend,
  getCategoryDistribution,
  getTopItems,
  getTopCustomers,
  getInventoryStatus,
};