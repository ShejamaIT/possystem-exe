// -------------------------------
// Node.js Backend for Shop Management System
// Fully CommonJS, ready for pkg/exe
// -------------------------------

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');

// Patch for pdfkit/fontkit ascii encoding
const { TextDecoder } = require('util');
global.TextDecoder = global.TextDecoder || TextDecoder;
const origTextDecoder = TextDecoder;
global.TextDecoder = function (encoding, options) {
  if (encoding && encoding.toLowerCase() === 'ascii') encoding = 'utf-8';
  return new origTextDecoder(encoding, options);
};

// -------------------------------
// Load .env (works in pkg exe as well)
// -------------------------------
const envPath = path.join(
  process.pkg ? path.dirname(process.execPath) : __dirname,
  '.env'
);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ .env loaded from:', envPath);
} else {
  console.warn('⚠️ .env file not found at:', envPath);
}

// -------------------------------
// Routes
// -------------------------------
const mainRoutes = require('./Routes/mainRoutes');
const auth = require('./Routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// -------------------------------
// Middleware
// -------------------------------
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use('/uploads', express.static(path.resolve('uploads')));

// -------------------------------
// Serve frontend build (pkg-safe)
// -------------------------------

// Since your frontend build is in adminBackend/build
const frontendBuildPath = process.pkg
  ? path.resolve(path.dirname(process.execPath), 'build') // exe: inside dist/build
  : path.join(__dirname, 'build'); // dev: adminBackend/build

if (fs.existsSync(frontendBuildPath)) {
  console.log('✅ Frontend build folder found at:', frontendBuildPath);
  app.use(express.static(frontendBuildPath));
} else {
  console.warn('⚠️ Frontend build folder not found at:', frontendBuildPath);
}

// -------------------------------
// API routes
// -------------------------------
app.use('/api/admin/main', mainRoutes);
app.use('/api/auth', auth);

// React catch-all
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found!');
  }
});

// -------------------------------
// Start server
// -------------------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
