const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const documentRoutes = require('./routes/document');
//const customerRoutes = require('./routes/customers');
//const accountRoutes = require('./routes/accounts');
//const depositRoutes = require('./routes/deposits');
//const lendingRoutes = require('./routes/lending');
const { getAccessToken } = require('./middleware/temenosClient');

// Mount routes
app.use('/api', documentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/lending', lendingRoutes);

// Health check with T24 token validation
app.get('/health', async (req, res) => {
  try {
    await getAccessToken();
    res.json({ ok: true, message: 'Server is running and T24 authentication is active' });
  } catch (error) {
    res.status(503).json({ ok: false, message: 'T24 authentication failed', error: error.message });
  }
});

// Debug routes endpoint
app.get('/debug/routes', (req, res) => {
  try {
    const postmanMap = require('./postman-map.json');
    res.json({
      message: 'API Route Mappings',
      mappings: postmanMap,
      totalRoutes: postmanMap.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load route mappings' });
  }
});

// Generic proxy endpoint for T24 API
app.all('/api/proxy/*', async (req, res) => {
  try {
    const { temenosGet, temenosPost, temenosPut, temenosDelete } = require('./middleware/temenosClient');
    const path = req.path.replace('/api/proxy', '');
    
    let response;
    switch (req.method) {
      case 'GET':
        response = await temenosGet(path, req.query);
        break;
      case 'POST':
        response = await temenosPost(path, req.body);
        break;
      case 'PUT':
        response = await temenosPut(path, req.body);
        break;
      case 'DELETE':
        response = await temenosDelete(path);
        break;
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: 'Proxy request failed' }
    );
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'T24 Banking API Server',
    version: '2.0.0',
    endpoints: {
      health: 'GET /health',
      debugRoutes: 'GET /debug/routes',
      proxy: 'ALL /api/proxy/*',
      documents: 'POST /api/uploadDocument',
      customers: 'GET /api/customers/:id',
      customerAccounts: 'GET /api/customers/:id/accounts',
      accounts: 'GET /api/accounts/:id',
      deposits: 'POST /api/deposits',
      lending: 'POST /api/lending/loans'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File size exceeds the maximum limit'
      });
    }
  }
  
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('========================================');
});
