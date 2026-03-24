'use strict';
const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard.service');

exports.getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary();
  res.json({ success: true, data });
});

exports.getRecentSales = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentSales();
  res.json({ success: true, data });
});

exports.getLowStock = asyncHandler(async (req, res) => {
  const data = await dashboardService.getLowStock();
  res.json({ success: true, data });
});

exports.getTopCustomers = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTopCustomers();
  res.json({ success: true, data });
});

exports.getRecentActivity = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentActivity();
  res.json({ success: true, data });
});
