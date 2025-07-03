// Cloudinary Integration for MediMate
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (server-side only)
if (typeof window === 'undefined') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Client-side upload function
export const uploadToCloudinary = async (file, folder = 'medical-reports') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'medimate_uploads'); // You'll need to create this
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      fileType: data.resource_type,
      size: data.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      message: error.message || 'Upload failed',
    };
  }
};

// Server-side functions (for API routes)
export const uploadFileToCloudinary = async (fileBuffer, fileName, folder = 'medical-reports') => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: folder,
          public_id: fileName,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
              fileType: result.resource_type,
              size: result.bytes,
            });
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error('Server upload error:', error);
    return {
      success: false,
      message: error.message || 'Upload failed',
    };
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      message: result.result,
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      message: error.message || 'Delete failed',
    };
  }
};

// React hook for file uploads
export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const uploadFile = async (file, folder) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for user experience
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadToCloudinary(file, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

      return result;
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadFile,
  };
};
