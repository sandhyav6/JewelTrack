'use strict';
const AppError = require('./errors');

/**
 * Ensure a string field is present and non-empty.
 */
function requireString(value, fieldName) {
  if (!value || String(value).trim() === '') {
    throw new AppError(`${fieldName} is required.`, 400);
  }
  return String(value).trim();
}

/**
 * Ensure a positive number.
 */
function requirePositiveNumber(value, fieldName) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    throw new AppError(`${fieldName} must be a positive number.`, 400);
  }
  return num;
}

/**
 * Ensure a non-negative integer.
 */
function requireNonNegativeInt(value, fieldName) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0) {
    throw new AppError(`${fieldName} must be a non-negative integer.`, 400);
  }
  return num;
}

/**
 * Validate customer body — only name + phone are persisted.
 */
function validateCustomer(body) {
  return {
    name:  requireString(body.name,  'CustomerName'),
    phone: requireString(body.phone, 'Phone'),
  };
}

/**
 * Validate item body.
 */
function validateItem(body) {
  return {
    name:     requireString(body.name,       'ItemName'),
    categoryId: requireString(body.categoryId, 'CategoryID'),
    material: requireString(body.material,   'Material'),
    weight:   requireNonNegativeInt(body.weight || 0, 'Weight'),
    price:    requirePositiveNumber(body.price,       'Price'),
    stock:    requireNonNegativeInt(body.stock || 0,  'AvailableQuantity'),
  };
}

/**
 * Validate supplier body — only name + phone are persisted.
 */
function validateSupplier(body) {
  return {
    name:  requireString(body.name,  'SupplierName'),
    phone: requireString(body.phone, 'SupplierPhone'),
  };
}

/**
 * Validate bill creation body.
 */
function validateBill(body) {
  const customerId = requireString(body.customerId, 'CustomerID');
  const employeeId = requireString(body.employeeId, 'EmployeeID');
  const billDate   = body.billDate ? new Date(body.billDate) : new Date();
  if (isNaN(billDate.getTime())) throw new AppError('Invalid billDate.', 400);

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new AppError('At least one item is required in the bill.', 400);
  }
  const items = body.items.map((it, i) => ({
    itemId:   requireString(it.itemId,    `items[${i}].itemId`),
    quantity: requirePositiveNumber(it.quantity, `items[${i}].quantity`),
  }));

  return { customerId, employeeId, billDate, items };
}

/**
 * Validate purchase creation body.
 */
function validatePurchase(body) {
  const supplierId   = requireString(body.supplierId, 'SupplierID');
  const purchaseDate = body.purchaseDate ? new Date(body.purchaseDate) : new Date();
  if (isNaN(purchaseDate.getTime())) throw new AppError('Invalid purchaseDate.', 400);

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new AppError('At least one item is required in the purchase.', 400);
  }
  const items = body.items.map((it, i) => ({
    itemId:    requireString(it.itemId,              `items[${i}].itemId`),
    quantity:  requirePositiveNumber(it.quantity,    `items[${i}].quantity`),
    costPrice: requirePositiveNumber(it.costPrice,   `items[${i}].costPrice`),
  }));

  return { supplierId, purchaseDate, items };
}

module.exports = {
  validateCustomer,
  validateItem,
  validateSupplier,
  validateBill,
  validatePurchase,
  requireString,
  requirePositiveNumber,
  requireNonNegativeInt,
};
