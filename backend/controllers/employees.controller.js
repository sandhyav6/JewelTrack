'use strict';
const { query } = require('../db');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT
      EMPLOYEEID,
      EMPLOYEENAME AS FIRSTNAME,
      '' AS LASTNAME
    FROM EMPLOYEE
    ORDER BY EMPLOYEENAME
  `);
  res.json({ success: true, data: result.rows });
});