'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useLanguage } from '../../../contexts/LanguageContext';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}

export default function MediaManagement() {
  const { language } = useLanguage();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Fetch existing files when component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        // Map database fields to MediaFile interface
        const mappedFiles = data.map((file: any) => ({
          id: file.id.toString(),
          filename: file.filename,
          originalName: file.original_name,
          fileType: file.file_type,
          fileSize: file.file_size,
          url: file.url,
          uploadedAt: file.uploaded_at,
        }));
        setFiles(mappedFiles);
      } else {
        console.error('Failed to fetch files');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          // Refresh the file list after successful upload
          fetchFiles();
        } else {
          console.error('Upload failed for', file.name);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setUploading(false);
    setUploadProgress({});
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleDelete = async (fileId: string) => {
    if (!confirm(language === 'hi' ? 'क्या आप वाकई इस फाइल को हटाना चाहते हैं?' : 'Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the file list after successful deletion
        fetchFiles();
      } else {
        alert(language === 'hi' ? 'फाइल हटाने में त्रुटि' : 'Error deleting file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(language === 'hi' ? 'फाइल हटाने में त्रुटि' : 'Error deleting file');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(language === 'hi' ? 'URL कॉपी किया गया' : 'URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {language === 'hi' ? 'मीडिया लाइब्रेरी' : 'Media Library'}
          </h1>

          {/* Upload Area */}
          <div className="mt-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
              } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input {...getInputProps()} />
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive
                    ? (language === 'hi' ? 'फाइलें यहाँ छोड़ें' : 'Drop files here')
                    : (language === 'hi' ? 'फाइल अपलोड करें' : 'Upload files')
                  }
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {language === 'hi' 
                    ? 'छवियां, वीडियो, और दस्तावेज़ (अधिकतम 50MB)' 
                    : 'Images, videos, and documents (max 50MB)'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{filename}</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Files Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">
                  {language === 'hi' ? 'फाइलें लोड हो रही हैं...' : 'Loading files...'}
                </p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {language === 'hi' ? 'कोई फाइल अपलोड नहीं की गई' : 'No files uploaded yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {files.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center">
                        {getFileIcon(file.fileType)}
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.originalName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                      </div>
                      
                      {file.fileType.startsWith('image/') && (
                        <div className="mt-3">
                          <img
                            src={file.url}
                            alt={file.originalName}
                            className="w-full h-32 object-cover rounded"
                          />
                        </div>
                      )}
                      
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="text-sm text-orange-600 hover:text-orange-800"
                        >
                          {language === 'hi' ? 'URL कॉपी करें' : 'Copy URL'}
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          {language === 'hi' ? 'हटाएं' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
