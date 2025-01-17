'use client';

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  ImageList,
  ImageListItem,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreateCollection } from '@/src/hooks/outfitGenerator.hooks';

const MAX_IMAGES = 6;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateOutfitCollection({ open, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { createCollection, isCreating, error: createError } = useCreateCollection();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    inspirationImages: [],
  });
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Collection name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Collection name must be less than 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.inspirationImages.length === 0) {
      newErrors.images = 'At least one inspiration image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const remainingSlots = MAX_IMAGES - formData.inspirationImages.length;
    
    if (files.length > remainingSlots) {
      setErrors(prev => ({
        ...prev,
        images: `You can only upload ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}`
      }));
      return;
    }

    const validFiles = files.filter(file => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          images: 'Only JPEG, PNG and WebP images are allowed'
        }));
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({
          ...prev,
          images: 'Each image must be less than 5MB'
        }));
        return false;
      }
      return true;
    });

    // Create preview URLs for valid files
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      inspirationImages: [...prev.inspirationImages, ...newImages]
    }));
    setErrors(prev => ({ ...prev, images: null }));

    // Initialize upload progress for new files
    const newProgress = {};
    validFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(prev => ({ ...prev, ...newProgress }));
  };

  const handleRemoveImage = (index) => {
    const removedImage = formData.inspirationImages[index];
    if (removedImage.preview) {
      URL.revokeObjectURL(removedImage.preview);
    }
    
    setFormData(prev => ({
      ...prev,
      inspirationImages: prev.inspirationImages.filter((_, i) => i !== index)
    }));

    // Remove progress for the removed image
    const { [removedImage.file.name]: removed, ...remainingProgress } = uploadProgress;
    setUploadProgress(remainingProgress);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createCollection(formData);
      handleClose();
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message
      }));
    }
  };

  const handleClose = useCallback(() => {
    // Cleanup preview URLs
    formData.inspirationImages.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    // Reset form state
    setFormData({
      name: '',
      description: '',
      inspirationImages: [],
    });
    setErrors({});
    setUploadProgress({});
    onClose();
  }, [formData, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Create New Collection
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {(errors.submit || createError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit || createError}
          </Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="normal"
            required
            fullWidth
            id="name"
            label="Collection Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isCreating}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            error={!!errors.description}
            helperText={errors.description}
            disabled={isCreating}
          />

          <Box sx={{ mt: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="inspiration-image-upload"
              multiple
              type="file"
              onChange={handleImageUpload}
              disabled={isCreating || formData.inspirationImages.length >= MAX_IMAGES}
            />
            <label htmlFor="inspiration-image-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={isCreating || formData.inspirationImages.length >= MAX_IMAGES}
              >
                Upload Inspiration Images
              </Button>
            </label>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {`${formData.inspirationImages.length}/${MAX_IMAGES} images uploaded`}
            </Typography>
            {errors.images && (
              <Typography color="error" variant="caption" display="block">
                {errors.images}
              </Typography>
            )}
          </Box>

          {formData.inspirationImages.length > 0 && (
            <ImageList
              sx={{ mt: 2 }}
              cols={fullScreen ? 2 : 3}
              rowHeight={164}
            >
              {formData.inspirationImages.map((image, index) => (
                <ImageListItem key={index} sx={{ position: 'relative' }}>
                  <img
                    src={image.preview}
                    alt={`Inspiration ${index + 1}`}
                    loading="lazy"
                    style={{ height: '164px', objectFit: 'cover' }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    onClick={() => handleRemoveImage(index)}
                    disabled={isCreating}
                  >
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                  {uploadProgress[image.file.name] !== undefined && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress[image.file.name]}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    />
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isCreating}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating}
          startIcon={isCreating ? <CircularProgress size={20} /> : null}
        >
          {isCreating ? 'Creating Collection...' : 'Create Collection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
