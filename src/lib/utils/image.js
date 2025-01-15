import imageCompression from 'browser-image-compression';

/**
 * Maximum file size in bytes (1MB)
 * @constant
 */
export const MAX_FILE_SIZE = 1024 * 1024;

/**
 * Thumbnail dimensions
 * @constant
 */
export const THUMBNAIL_SIZE = {
  width: 200,
  height: 200,
};

/**
 * Allowed image types
 * @constant
 */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validates if the file is an allowed image type
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const isValidImageType = (file) => {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
};

/**
 * Compresses an image file to target size
 * @param {File} imageFile - The image file to compress
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (imageFile) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

/**
 * Generates a thumbnail from an image file
 * @param {File} imageFile - The image file to generate thumbnail from
 * @returns {Promise<Blob>} - Thumbnail as a blob
 */
export const generateThumbnail = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate aspect ratio to maintain proportions
      const aspectRatio = img.width / img.height;
      let width = THUMBNAIL_SIZE.width;
      let height = THUMBNAIL_SIZE.height;

      if (aspectRatio > 1) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }

      // Set canvas size
      canvas.width = THUMBNAIL_SIZE.width;
      canvas.height = THUMBNAIL_SIZE.height;

      // Fill background with white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center the image
      const x = (THUMBNAIL_SIZE.width - width) / 2;
      const y = (THUMBNAIL_SIZE.height - height) / 2;

      // Draw image
      ctx.drawImage(img, x, y, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(imageFile);
  });
};

/**
 * Process multiple images in batch
 * @param {File[]} files - Array of image files to process
 * @param {number} maxBatchSize - Maximum number of files to process at once
 * @returns {Promise<Array<{original: File, thumbnail: Blob}>>} - Processed images
 */
export const processBatchImages = async (files, maxBatchSize = 10) => {
  const validFiles = files.filter(isValidImageType);

  if (validFiles.length === 0) {
    throw new Error('No valid image files provided');
  }

  if (validFiles.length > maxBatchSize) {
    throw new Error(`Cannot process more than ${maxBatchSize} images at once`);
  }

  const processedImages = await Promise.all(
    validFiles.map(async (file) => {
      try {
        const compressedFile = await compressImage(file);
        const thumbnail = await generateThumbnail(compressedFile);
        
        return {
          original: compressedFile,
          thumbnail,
        };
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        throw error;
      }
    })
  );

  return processedImages;
};

/**
 * Creates an object URL for a blob/file
 * @param {Blob|File} blob - The blob or file to create URL for
 * @returns {string} - Object URL
 */
export const createObjectURL = (blob) => {
  return URL.createObjectURL(blob);
};

/**
 * Revokes an object URL to free up memory
 * @param {string} url - The URL to revoke
 */
export const revokeObjectURL = (url) => {
  URL.revokeObjectURL(url);
};
