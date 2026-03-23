'use strict';
require('dotenv').config();

const { createPool, closePool } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Initialize Oracle connection pool before accepting requests
    await createPool();
    console.log('[Oracle] Connection pool initialized.');

    const server = app.listen(PORT, () => {
      console.log(`[JewelTrack] Server running on http://localhost:${PORT}`);
      console.log(`[JewelTrack] Health check: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n[JewelTrack] Shutting down...');
      server.close(async () => {
        await closePool();
        console.log('[Oracle] Pool closed.');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('[Oracle] Failed to initialize pool:', err.message);
    process.exit(1);
  }
}

main();
