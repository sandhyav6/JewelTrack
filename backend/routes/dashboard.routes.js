'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');

router.get('/summary', controller.getSummary);
router.get('/recent-sales', controller.getRecentSales);
router.get('/low-stock', controller.getLowStock);
router.get('/top-customers', controller.getTopCustomers);
router.get('/recent-activity', controller.getRecentActivity);

module.exports = router;
