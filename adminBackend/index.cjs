// index.cjs
// Allows pkg to bundle ES modules server.js

(async () => {
  try {
    await import('./server.js');
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();
