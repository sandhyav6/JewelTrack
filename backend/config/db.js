'use strict';
const oracledb = require('oracledb');

// Use object output format so query results return as plain JS objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Auto-commit is OFF by default — we manage transactions explicitly
oracledb.autoCommit = false;

let pool;

/**
 * Initialise the Oracle connection pool.
 * Called once at server startup.
 */
async function createPool() {
  pool = await oracledb.createPool({
    user:             process.env.ORACLE_USER,
    password:         process.env.ORACLE_PASSWORD,
    connectString:    process.env.ORACLE_CONNECT_STRING,
    poolMin:          2,
    poolMax:          10,
    poolIncrement:    1,
    poolTimeout:      60,
    poolAlias:        'default'
  });
}

/**
 * Acquire a connection from the pool.
 * Always release in a finally block.
 */
async function getConnection() {
  return pool.getConnection();
}

/**
 * Convenience wrapper: run a single SQL statement on a temporary connection.
 * For simple SELECTs and individual INSERTs/UPDATEs that need no transaction.
 *
 * @param {string} sql
 * @param {object|Array} binds
 * @param {object} opts   - additional oracledb options
 */
async function query(sql, binds = {}, opts = {}) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(sql, binds, { autoCommit: true, ...opts });
    return result;
  } finally {
    if (conn) await conn.close();
  }
}

/**
 * Close the pool gracefully (called on server shutdown).
 */
async function closePool() {
  if (pool) await pool.close(10);
}

module.exports = { createPool, getConnection, query, closePool };
