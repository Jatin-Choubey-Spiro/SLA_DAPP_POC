import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading animation
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload to local server and get hash
      const localResponse = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const fileHash = localResponse.data.hash;
      setHash(fileHash);

      // Upload to IPFS
      const ipfsResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          pinata_api_key: '21ddbbd4f82166a98957',
          pinata_secret_api_key: '1f1bd9ae74d3b93991a1789d077263a81d77d891011c6c6bdce71945873c08e5',
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsResponse.data.IpfsHash}`;
      setFileUrl(fileUrl);

      // Call the onFileUpload prop with the hash and CID
      onFileUpload(fileHash, ipfsResponse.data.IpfsHash);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit} className="file-upload-form">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Upload
        </button>

      </form>
      {preview && <img src={preview} alt="File preview" className="file-preview" />}
      {!preview && file && <p>File selected: {file.name}</p>}
      {loading && <div className="loading-spinner"></div>}
      {hash && <p>SHA-256 Hash: {hash}</p>}
      {fileUrl && <p>IPFS URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>}
    </div>
  );
};

export default FileUpload;