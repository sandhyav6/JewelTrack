'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reports.controller');

router.get('/sales-trend', controller.getSalesTrend);
router.get('/category-distribution', controller.getCategoryDistribution);
router.get('/top-items', controller.getTopItems);
router.get('/top-customers', controller.getTopCustomers);
router.get('/inventory-status', controller.getInventoryStatus);

module.exports = router;
