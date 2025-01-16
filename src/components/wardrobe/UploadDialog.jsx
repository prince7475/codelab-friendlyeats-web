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
import { useUploadItem } from '@/src/hooks/wardrobe.hooks';

export default function UploadDialog({ open, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { uploadItem, isUploading, error, resetError } = useUploadItem();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      resetError();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const newItem = await uploadItem(selectedFile);
    if (newItem) {
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    resetError();
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
              <Button color="inherit" size="small" onClick={resetError}>
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