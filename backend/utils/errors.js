'use strict';

/**
 * Custom application error with HTTP status code support.
 * Thrown in controllers/services; caught by global error handler in app.js.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

module.exports = AppError;
