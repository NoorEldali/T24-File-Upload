import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface UploadResponse {
  status: string;
  documentId: string;
  message: string;
  details?: {
    filename: string;
    size: number;
    documentType: string;
    customerId: string;
    sharePointId: string;
  };
}

const DocumentUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');
  const [uploadDetails, setUploadDetails] = useState<UploadResponse | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !customerId || !documentType) {
      setUploadStatus('error');
      setResponseMessage('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('customerId', customerId);
    formData.append('documentType', documentType);

    try {
      const response = await axios.post<UploadResponse>(
        `${apiUrl}/uploadDocument`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadStatus('success');
      setResponseMessage(response.data.message);
      setUploadDetails(response.data);

      // Reset form
      setFile(null);
      setCustomerId('');
      setDocumentType('');
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      setUploadStatus('error');
      if (error.response?.data?.message) {
        setResponseMessage(error.response.data.message);
      } else if (error.message) {
        setResponseMessage(`Upload failed: ${error.message}`);
      } else {
        setResponseMessage('An unexpected error occurred during upload');
      }
      setUploadDetails(null);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Upload System
          </h1>
          <p className="text-gray-600">
            T24 Integration with SharePoint Connectivity
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="customerId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Customer ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter customer ID"
                required
              />
            </div>

            <div>
              <label
                htmlFor="documentType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select document type</option>
                <option value="identity">Identity Document</option>
                <option value="proof-of-address">Proof of Address</option>
                <option value="financial-statement">Financial Statement</option>
                <option value="contract">Contract</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="file-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Document File <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-input"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-input"
                        name="file-input"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
              {file && (
                <div className="mt-3 flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="flex-1">{file.name}</span>
                  <span className="text-gray-400">{formatFileSize(file.size)}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="-ml-1 mr-2 h-5 w-5" />
                  Upload Document
                </>
              )}
            </button>
          </form>

          {uploadStatus !== 'idle' && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                uploadStatus === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start">
                {uploadStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3
                    className={`text-sm font-medium ${
                      uploadStatus === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {uploadStatus === 'success' ? 'Upload Successful' : 'Upload Failed'}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      uploadStatus === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {responseMessage}
                  </p>
                  {uploadDetails && uploadStatus === 'success' && (
                    <div className="mt-3 space-y-2 text-sm text-green-700">
                      <p>
                        <strong>Document ID:</strong> {uploadDetails.documentId}
                      </p>
                      {uploadDetails.details && (
                        <>
                          <p>
                            <strong>Filename:</strong> {uploadDetails.details.filename}
                          </p>
                          <p>
                            <strong>SharePoint ID:</strong>{' '}
                            {uploadDetails.details.sharePointId}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            System Information
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Integration Status:</strong> T24 & SharePoint Mock Integration Active
            </p>
            <p>
              <strong>Supported Formats:</strong> PDF, DOC, DOCX, JPG, PNG
            </p>
            <p>
              <strong>Maximum File Size:</strong> 10 MB
            </p>
            <p>
              <strong>API Endpoint:</strong> {apiUrl}/uploadDocument
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
