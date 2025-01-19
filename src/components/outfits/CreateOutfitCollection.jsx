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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateCollection } from '@/src/hooks/outfitGenerator.hooks';

export default function CreateOutfitCollection({ open, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { createCollection, isCreating, error: createError } = useCreateCollection();
  
  const [formData, setFormData] = useState({
    prompt: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate prompt length if it's not empty
    if (formData.prompt.trim() && formData.prompt.length > 500) {
      newErrors.prompt = 'Prompt must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setFormData({
      prompt: '',
    });
    setErrors({});
    onClose();
  }, [onClose]);

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
            fullWidth
            multiline
            rows={4}
            id="prompt"
            label="What kind of collection would you like to create? (Optional)"
            name="prompt"
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            error={!!errors.prompt}
            helperText={errors.prompt || "Leave empty to let AI suggest a collection based on your wardrobe"}
            disabled={isCreating}
          />
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
