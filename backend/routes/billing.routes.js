'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/billing.controller');

router.get('/', controller.getAll);
router.get('/next-number', controller.getNextNumber);
router.get('/:id', controller.getById);
router.post('/', controller.create);

module.exports = router;
