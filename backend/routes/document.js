const express = require('express');
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

// POST /uploadDocument endpoint
router.post('/uploadDocument', upload.single('file'), validateUploadRequest, async (req, res) => {
  try {
    const { customerId, documentType } = req.body;
    const file = req.file;
    
    // Generate document ID
    const documentId = `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Prepare metadata for SharePoint
    const metadata = {
      customerId,
      documentType,
      documentId,
      uploadDate: new Date().toISOString()
    };
    
    // Send to SharePoint (mock integration)
    const sharePointResponse = await sendToSharePoint(file, metadata);
    
    // Log T24 integration (mock)
    console.log('T24 Integration: Document metadata logged', {
      documentId,
      customerId,
      documentType
    });
    
    // Return success response
    res.json({
      status: 'success',
      documentId: documentId,
      message: 'File uploaded successfully.',
      details: {
        filename: file.originalname,
        size: file.size,
        documentType: documentType,
        customerId: customerId,
        sharePointId: sharePointResponse.sharePointId
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'File upload failed',
      error: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

module.exports = router;
