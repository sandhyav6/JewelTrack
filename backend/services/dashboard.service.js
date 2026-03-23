'use strict';
const { query } = require('../config/db');

/**
 * Dashboard summary statistics.
 */
async function getSummary() {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM CUSTOMER) AS TOTALCUSTOMERS,
      (SELECT COUNT(*) FROM ITEM)     AS TOTALITEMS,
      (SELECT COUNT(*) FROM SUPPLIER) AS TOTALSUPPLIERS,
      (SELECT COUNT(*) FROM ITEM WHERE AVAILABLEQUANTITY <= 5) AS LOWSTOCKCOUNT
    FROM DUAL
  `;
  const result = await query(sql);
  const row = result.rows[0];
  return {
    totalCustomers: Number(row.TOTALCUSTOMERS),
    totalItems:     Number(row.TOTALITEMS),
    totalSuppliers: Number(row.TOTALSUPPLIERS),
    lowStockCount:  Number(row.LOWSTOCKCOUNT),
  };
}

/**
 * Recent sales — last 6 bills with totals.
 */
async function getRecentSales() {
  const sql = `
    SELECT * FROM (
      SELECT
        BD.BILLNO,
        BD.BILLDATE,
        BD.CUSTOMERNAME,
        SUM(BD.LINEAMOUNT) AS TOTALAMOUNT
      FROM V_BILL_DETAIL BD
      GROUP BY BD.BILLNO, BD.BILLDATE, BD.CUSTOMERNAME
      ORDER BY BD.BILLDATE DESC
    ) WHERE ROWNUM <= 6
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    bill:     r.BILLNO,
    customer: r.CUSTOMERNAME,
    amount:   Number(r.TOTALAMOUNT),
    date:     r.BILLDATE,
  }));
}

/**
 * Low stock items (AvailableQuantity <= 5).
 */
async function getLowStock() {
  const sql = `
    SELECT ITEMID, ITEMNAME, AVAILABLEQUANTITY, STOCKSTATUS
    FROM V_INVENTORY
    WHERE AVAILABLEQUANTITY <= 5
    ORDER BY AVAILABLEQUANTITY ASC
    FETCH FIRST 8 ROWS ONLY
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    id:        r.ITEMID,
    name:      r.ITEMNAME,
    stock:     Number(r.AVAILABLEQUANTITY),
    status:    r.STOCKSTATUS,
  }));
}

/**
 * Top customers by total spent.
 */
async function getTopCustomers() {
  const sql = `
    SELECT * FROM (
      SELECT
        CUSTOMERID, CUSTOMERNAME, TOTALPURCHASES, TOTALSPENT
      FROM V_CUSTOMER_STATS
      WHERE TOTALSPENT > 0
      ORDER BY TOTALSPENT DESC
    ) WHERE ROWNUM <= 5
  `;
  const result = await query(sql);
  return result.rows.map(r => ({
    id:         r.CUSTOMERID,
    name:       r.CUSTOMERNAME,
    purchases:  Number(r.TOTALPURCHASES),
    spent:      Number(r.TOTALSPENT),
  }));
}

/**
 * Recent activity: last 6 bills + last 6 purchases merged and sorted by date.
 */
async function getRecentActivity() {
  const billSql = `
    SELECT
      'Bill ' || BILLNO || ' placed for ' || CUSTOMERNAME AS ACTTEXT,
      BILLDATE AS ACTDATE
    FROM (
      SELECT DISTINCT BILLNO, CUSTOMERNAME, BILLDATE FROM V_BILL_DETAIL
      ORDER BY BILLDATE DESC
    ) WHERE ROWNUM <= 6
  `;
  const purSql = `
    SELECT
      'Purchase ' || PURCHASEID || ' from ' || SUPPLIERNAME AS ACTTEXT,
      PURCHASEDATE AS ACTDATE
    FROM (
      SELECT DISTINCT PURCHASEID, SUPPLIERNAME, PURCHASEDATE FROM V_PURCHASE_DETAIL
      ORDER BY PURCHASEDATE DESC
    ) WHERE ROWNUM <= 4
  `;
  const [bills, purs] = await Promise.all([query(billSql), query(purSql)]);
  const combined = [
    ...bills.rows.map(r => ({ text: r.ACTTEXT, date: r.ACTDATE })),
    ...purs.rows.map(r => ({ text: r.ACTTEXT, date: r.ACTDATE })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  return combined;
}

module.exports = {
  getSummary,
  getRecentSales,
  getLowStock,
  getTopCustomers,
  getRecentActivity,
};
