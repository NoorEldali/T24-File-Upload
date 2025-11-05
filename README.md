# Document Upload System

A full-stack document upload application with React frontend and Node.js backend, designed to simulate T24 integration with future SharePoint connectivity.

## Features

### Backend
- Node.js + Express server with RESTful API
- Multipart form data handling with Multer
- Input validation and error handling
- Mock SharePoint integration (ready for future Graph API integration)
- CORS enabled for cross-origin requests
- File type and size validation
- Automatic document ID generation

### Frontend
- React + TypeScript + TailwindCSS
- Clean, intuitive upload form interface
- Axios integration for API communication
- Real-time upload status indicators
- Success/error message handling
- File preview and validation
- Responsive design

## Project Structure

```
document-upload-app/
├── backend/                 # Node.js + Express backend
│   ├── routes/
│   │   └── document.js     # Upload endpoint and routes
│   ├── middleware/
│   │   ├── upload.js       # Multer configuration
│   │   └── validation.js   # Request validation
│   ├── uploads/            # Temporary file storage
│   ├── server.js           # Main server file
│   ├── package.json
│   ├── .env                # Environment variables
│   └── .gitignore
│
├── frontend/               # React + TailwindCSS frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── DocumentUploadForm.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── .env                # Environment variables
│   └── vite.config.ts
│
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

## Installation

### 1. Clone and Navigate to Project
```bash
cd document-upload-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# PORT=5000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:5173
# MAX_FILE_SIZE=10485760
# ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png

# Start the server
npm start

# Or use nodemon for development
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
pnpm install

# Create .env file (already provided)
# VITE_API_URL=http://localhost:5000/api

# Start the development server
pnpm dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Fill in the required fields:
   - **Customer ID**: Enter the customer identifier
   - **Document Type**: Select from dropdown (Identity, Proof of Address, Financial Statement, etc.)
   - **Document File**: Upload a file (PDF, DOC, DOCX, JPG, PNG up to 10MB)
3. Click "Upload Document"
4. View the upload status and document ID

## API Endpoints

### POST /api/uploadDocument

Upload a document with customer information.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: Document file (required)
  - `customerId`: Customer identifier (required)
  - `documentType`: Type of document (required)

**Response (Success):**
```json
{
  "status": "success",
  "documentId": "DOC-1730000000000-123",
  "message": "File uploaded successfully.",
  "details": {
    "filename": "document.pdf",
    "size": 12345,
    "documentType": "identity",
    "customerId": "CUST001",
    "sharePointId": "SP-1730000000000"
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Error description"
}
```

### GET /api/health

Check server health status.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## File Upload Specifications

- **Supported Formats**: PDF, DOC, DOCX, JPG, PNG
- **Maximum File Size**: 10 MB
- **Storage**: Files are stored in `backend/uploads/` directory
- **Naming**: Automatically generated unique filename with timestamp

## Mock Integration

### SharePoint Integration
The backend includes a mock SharePoint integration function that logs file details to the console. This is ready for future Microsoft Graph API integration.

Location: `backend/routes/document.js` - `sendToSharePoint()` function

### T24 Integration
The system logs document metadata for T24 integration purposes.

## Testing the API

You can test the API using curl:

```bash
curl -X POST http://localhost:5000/api/uploadDocument \
  -F "file=@/path/to/document.pdf" \
  -F "customerId=CUST001" \
  -F "documentType=identity"
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
pnpm dev     # Starts Vite dev server with HMR
```

## Production Build

### Frontend
```bash
cd frontend
pnpm build   # Creates optimized production build in dist/
```

## Future Enhancements

1. **SharePoint Integration**: Replace mock integration with Microsoft Graph API
2. **Authentication**: Add user authentication and authorization
3. **Database**: Store document metadata in a database
4. **File Management**: Implement document retrieval and deletion
5. **Advanced Validation**: Add virus scanning and content validation
6. **Cloud Storage**: Migrate to cloud storage (Azure Blob, AWS S3)
7. **Audit Trail**: Complete audit logging for compliance

## Security Considerations

- File type validation on both client and server
- File size limits to prevent abuse
- Input sanitization and validation
- CORS configuration for production
- Environment variables for sensitive data

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify all dependencies are installed
- Check .env file exists with correct values

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify VITE_API_URL in frontend .env

### File upload fails
- Check file size (must be under 10MB)
- Verify file type is supported
- Ensure uploads/ directory exists and is writable

## License

MIT

## Author

MiniMax Agent

---

For questions or support, please refer to the documentation or contact the development team.
