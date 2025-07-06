// Image upload utility for Cloudinary
export const uploadImageToCloudinary = async (file) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please select JPEG, PNG, GIF, or WebP');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    // Upload to API
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    return {
      success: true,
      url: data.url,
      publicId: data.public_id
    };

  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate placeholder avatar URL
export const generatePlaceholderAvatar = (name) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'A';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&size=400&background=3b82f6&color=ffffff&bold=true`;
};
