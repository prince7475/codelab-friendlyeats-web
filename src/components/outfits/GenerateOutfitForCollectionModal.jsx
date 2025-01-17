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
  FormControlLabel,
  Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function GenerateOutfitForCollectionModal({ 
  open, 
  onClose, 
  onGenerate,
  collectionName 
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excludeExistingItems: true,
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setError(null);

    try {
      await onGenerate(formData);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      excludeExistingItems: true,
    });
    setErrors({});
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
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
        {`Generate Outfit for ${collectionName}`}
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
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
            placeholder="Describe the type of outfit you want to generate. For example: 'Create a casual outfit suitable for a weekend brunch with friends.'"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            error={!!errors.description}
            helperText={errors.description}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.excludeExistingItems}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  excludeExistingItems: e.target.checked 
                }))}
                name="excludeExistingItems"
              />
            }
            label="Exclude items from existing outfits"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
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
