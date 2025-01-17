'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const MAX_IMAGES = 6;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateOutfitCollection({ open, onClose, onSubmit }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    inspirationImages: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      inspirationImages: [...prev.inspirationImages, ...newImages]
    }));
    setErrors(prev => ({ ...prev, images: null }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      inspirationImages: prev.inspirationImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      inspirationImages: [],
    });
    setErrors({});
    setSubmitError(null);
    onClose();
  };

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
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
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
          />

          <Box sx={{ mt: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="inspiration-image-upload"
              multiple
              type="file"
              onChange={handleImageUpload}
              disabled={formData.inspirationImages.length >= MAX_IMAGES}
            />
            <label htmlFor="inspiration-image-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={formData.inspirationImages.length >= MAX_IMAGES}
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
                  >
                    <DeleteIcon sx={{ color: 'white' }} />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          Create Collection
        </Button>
      </DialogActions>
    </Dialog>
  );
}
