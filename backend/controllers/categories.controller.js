'use strict';
const { query } = require('../db');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const result = await query('SELECT CATEGORYID, CATEGORYNAME FROM CATEGORY ORDER BY CATEGORYNAME');
  res.json({ success: true, data: result.rows });
});
