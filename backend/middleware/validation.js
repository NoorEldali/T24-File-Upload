// Validation middleware for document upload
const validateUploadRequest = (req, res, next) => {
  const { customerId, documentType } = req.body;
  
  // Validate customer ID
  if (!customerId || customerId.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Customer ID is required'
    });
  }
  
  // Validate document type
  if (!documentType || documentType.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Document type is required'
    });
  }
  
  // Validate file
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded'
    });
  }
  
  next();
};

module.exports = { validateUploadRequest };
