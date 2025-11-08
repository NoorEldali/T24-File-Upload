const express = require('express');
const fetch = require('node-fetch'); // add this at the top if not already imported
const router = express.Router();
const upload = require('../middleware/upload');
const { validateUploadRequest } = require('../middleware/validation');

// Mock SharePoint integration function
const sendToSharePoint = async (fileData, metadata) => {
  // Simulate SharePoint integration
  console.log('========================================');
  console.log('File sent to SharePoint');
  console.log('File Details:', {
    originalName: fileData.originalname,
    filename: fileData.filename,
    size: fileData.size,
    mimetype: fileData.mimetype,
    path: fileData.path
  });
  console.log('Metadata:', metadata);
  console.log('========================================');
  
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sharePointId: `SP-${Date.now()}`,
        status: 'uploaded'
      });
    }, 500);
  });
};
router.get('/customer/:id', async (req, res) => {
  const customerId = req.params.id;
  const temenosUrl = `https://api.temenos.com/api/v5.8.0/party/customers/${customerId}`;

  try {
    const response = await fetch(temenosUrl, {
      headers: {
        ApiKey: process.env.T24_API_KEY_HEADER, // ← USE YOUR ENV VARIABLE HERE
      },
    });

    if (!response.ok) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const data = await response.json();
    res.json({ name: data.customer?.name || 'Customer' });
  } catch (err) {
    console.error('Temenos fetch failed:', err);
    res.status(500).json({ message: 'Failed to fetch from T24' });
  }
});
// POST /uploadDocument endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { customerId, fileType, fileInputter, timestamp, originalName } = req.body;
    const file = req.file;

    if (!file || !customerId || !fileType) {
      return res.status(400).json({ message: 'Missing required fields or file.' });
    }

    const metadata = {
      timestamp,
      customerId,
      fileType,
      fileInputter,
      originalName,
    };

    // Log or save the file + metadata
    console.log('===========================');
    console.log('File uploaded locally:');
    console.log(`Original Name: ${file.originalname}`);
    console.log(`Stored As: ${file.filename}`);
    console.log('Metadata:', metadata);
    console.log('===========================');

    res.json({
      status: 'success',
      message: 'File uploaded successfully.',
      metadata,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({
      status: 'error',
      message: 'Upload failed',
      error: err.message,
    });
  }
});


// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = router;
