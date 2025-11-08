import { useState } from 'react';

const API_BASE = 'https://api.temenos.com/api/v5.8.0/party/customers/';

function App() {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [fileType, setFileType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputter, setInputter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = async () => {
    setCustomerName('');
    setNotFound(false);
    setSuccessMessage('');

    try {
      const res = await fetch(`${API_BASE}${customerId}`, {
        headers: {
          'ApiKey': process.env.REACT_APP_TEMENOS_API_KEY || 'YOUR_TEMENOS_API_KEY',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCustomerName(data.customer?.name || 'Customer');
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setNotFound(true);
    }
  };

  const handleUpload = async () => {
    if (!file || !fileType || !customerId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', new Date().toISOString());
    formData.append('customerId', customerId);
    formData.append('fileType', fileType);
    formData.append('fileInputter', inputter);
    formData.append('originalName', file.name);

    const res = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setSuccessMessage('Upload successful!');
      setFile(null);
      setFileType('');
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>KYC Upload Portal</h1>

      <div>
        <label>Customer ID:</label>
        <input value={customerId} onChange={e => setCustomerId(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>

      {customerName && (
        <div>
          <p>Customer Name: {customerName}</p>
          <div>
            <label>File Type:</label>
            <input value={fileType} onChange={e => setFileType(e.target.value)} />
          </div>
          <div>
            <label>Inputter:</label>
            <input value={inputter} onChange={e => setInputter(e.target.value)} />
          </div>
          <div>
            <label>Select File:</label>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <button disabled={!file || !fileType} onClick={handleUpload}>
            Upload
          </button>
        </div>
      )}

      {notFound && (
        <div>
          <p style={{ color: 'red' }}>Customer not found</p>
          <button>Register New Customer</button>
        </div>
      )}

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default App;
