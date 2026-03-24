'use strict';
const asyncHandler = require('../utils/asyncHandler');
const reportsService = require('../services/reports.service');

exports.getSalesTrend = asyncHandler(async (req, res) => {
  const data = await reportsService.getSalesTrend();
  res.json({ success: true, data });
});

exports.getCategoryDistribution = asyncHandler(async (req, res) => {
  const data = await reportsService.getCategoryDistribution();
  res.json({ success: true, data });
});

exports.getTopItems = asyncHandler(async (req, res) => {
  const data = await reportsService.getTopItems();
  res.json({ success: true, data });
});

exports.getTopCustomers = asyncHandler(async (req, res) => {
  const data = await reportsService.getTopCustomers();
  res.json({ success: true, data });
});

exports.getInventoryStatus = asyncHandler(async (req, res) => {
  const data = await reportsService.getInventoryStatus();
  res.json({ success: true, data });
});
