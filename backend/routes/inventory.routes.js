'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventory.controller');

router.get('/', controller.getAll);
router.get('/low-stock', controller.getLowStock);

module.exports = router;
