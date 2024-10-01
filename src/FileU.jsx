// src/FileUploader.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';

const FileU = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileType, setFileType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [latestFile, setLatestFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'video/mp4', 'application/pdf'];

        if (!allowedTypes.includes(selectedFile.type)) {
            setErrorMessage('Unsupported file type. Please upload an image, audio, video, or PDF file.');
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        setErrorMessage('');
        setFile(selectedFile);
        setFileType(selectedFile.type);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLatestFile(response.data.file);
            setFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">File Uploader</h1>
                <input
                    type="file"
                    accept="image/*,audio/*,video/*,.pdf"
                    onChange={handleFileChange}
                    className="border border-gray-300 p-2 mb-2"
                />
                {errorMessage && <div className="text-red-600 mb-2">{errorMessage}</div>}
                <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Upload
                </button>
                {previewUrl && (
                    <div className="mt-4 flex justify-center">
                        {fileType.startsWith('image/') && <img src={previewUrl} alt="Preview" className="max-w-xs" />}
                        {fileType.startsWith('audio/') && <audio controls src={previewUrl} className="mt-2" />}
                        {fileType.startsWith('video/') && <video controls src={previewUrl} className="mt-2 max-w-xs" />}
                        {fileType === 'application/pdf' && (
                          <iframe 
                          src={previewUrl} 
                          className="mt-2 mx-4 w-[160vh] h-[80vh] border border-gray-300 rounded-lg" 
                          title="PDF Preview"
                      />
                      
                      
                        )}
                    </div>
                )}
                {latestFile && (
                   <div className="mt-4 border-t pt-4 bg-gray-50 rounded-lg shadow-md p-4">
                   <h3 className="text-2xl font-bold text-blue-600 mb-2">Uploaded File Details</h3>
                   <div className="border-b pb-2 mb-2">
                       <strong className="text-gray-800">Filename:</strong> 
                       <span className="text-gray-600">{latestFile.originalname}</span>
                       <br />
                       <strong className="text-gray-800">Mimetype:</strong> 
                       <span className="text-gray-600">{latestFile.mimetype}</span>
                       <br />
                       <strong className="text-gray-800">Size:</strong> 
                       <span className="text-gray-600">{latestFile.size} bytes</span>
                   </div>
               </div>
               
                )}
            </div>
        </div>
    );
};

export default FileU;
