const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Patch for pdfkit/fontkit ascii encoding
const { TextDecoder } = require('util');
global.TextDecoder = global.TextDecoder || TextDecoder;
const origTextDecoder = TextDecoder;
global.TextDecoder = function (encoding, options) {
  if (encoding && encoding.toLowerCase() === 'ascii') encoding = 'utf-8';
  return new origTextDecoder(encoding, options);
};

// Load .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ .env loaded from:', envPath);
} else {
  console.warn('⚠️ .env file not found at:', envPath);
}

// Import routes
const mainRoutes = require('./Routes/mainRoutes');
const auth = require('./Routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use('/uploads', express.static(path.resolve('uploads')));

// API routes
app.use('/api/admin/main', mainRoutes);
app.use('/api/auth', auth);

// Optional: simple root route
app.get('/', (req, res) => {
  res.send('Backend is running. Frontend is hosted separately on Vercel.');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
