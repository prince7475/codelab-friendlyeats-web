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
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadWardrobeImage } from '@/src/lib/firebase/storage';
import { useUser } from '@/src/lib/getUser';

export default function UploadDialog({ open, onClose, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const user = useUser();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadWardrobeImage(user.uid, selectedFile);
      
      // Create new wardrobe item
      const newItem = {
        id: Date.now().toString(), // This should be replaced with a proper ID from the database
        userId: user.uid,
        imageUrl,
        name: 'Generated Name', // This will be replaced with LLM-generated name
        description: 'Generated Description', // This will be replaced with LLM-generated description
        category: 'others',
        style: ['casual'],
        createdAt: new Date().toISOString(),
      };

      onUpload(newItem);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isUploading ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Upload Item
        {!isUploading && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => setError(null)}>
                DISMISS
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        {!selectedFile ? (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'grey.50'
              }
            }}
            component="label"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
            <Typography>
              Click or drag an image here to upload
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                marginBottom: '16px'
              }}
            />
            {!isUploading && (
              <Button
                size="small"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                Remove
              </Button>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {isUploading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Uploading...</Typography>
          </Box>
        ) : (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}