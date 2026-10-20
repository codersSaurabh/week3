import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Handle File Selection and Generate Client-Side Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        setSelectedFile(null);
        setPreview(null);
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Upload to Backend via FormData
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setUploading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadedUrl(res.data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Assignment 2: Image Upload Feature</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '15px' }} />
        <br />
        <button 
          type="submit" 
          disabled={uploading} 
          style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {/* Local Preview before uploading */}
      {preview && (
        <div style={{ marginTop: '20px' }}>
          <h4>1. Client-Side Preview (Before Upload):</h4>
          <img src={preview} alt="Local Preview" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid #ccc' }} />
        </div>
      )}

      {/* Server Response Display after uploading */}
      {uploadedUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>2. Uploaded Image (Served from Backend API):</h4>
          <p><a href={uploadedUrl} target="_blank" rel="noreferrer">{uploadedUrl}</a></p>
          <img src={uploadedUrl} alt="Uploaded Result" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid #28a745' }} />
        </div>
      )}
    </div>
  );
}
