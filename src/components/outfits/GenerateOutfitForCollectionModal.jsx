'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGenerateOutfitForCollection } from '@/src/hooks/outfitGenerator.hooks';

export default function GenerateOutfitForCollectionModal({ open, onClose, collectionId }) {
  const { generateOutfit, isGenerating, error: generateError } = useGenerateOutfitForCollection();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excludeExistingItems: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await generateOutfit(collectionId, formData);
      handleClose();
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      excludeExistingItems: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Generate New Outfit
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Error Messages */}
        {(errors.submit || generateError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit || generateError}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" paragraph>
          Provide details about the outfit you want to generate. Our AI will create an outfit based on your wardrobe items and collection inspiration.
        </Typography>

        <Box component="form" noValidate>
          <TextField
            autoFocus
            margin="normal"
            required
            fullWidth
            id="title"
            label="Outfit Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isGenerating}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Outfit Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            error={!!errors.description}
            helperText={errors.description}
            disabled={isGenerating}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.excludeExistingItems}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  excludeExistingItems: e.target.checked 
                }))}
                disabled={isGenerating}
              />
            }
            label="Exclude items from existing outfits"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} /> : null}
        >
          {isGenerating ? 'Generating...' : 'Generate Outfit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
