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
  IconButton,
  ImageList,
  ImageListItem,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUploadMultipleItems } from '@/src/hooks/wardrobe.hooks';

const MAX_IMAGES = 30;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadDialog({ open, onClose }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const { uploadItems, isUploading, error, resetError, progress } = useUploadMultipleItems();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const remainingSlots = MAX_IMAGES - selectedFiles.length;
    
    if (files.length > remainingSlots) {
      setErrors(prev => ({
        ...prev,
        files: `You can only upload ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}`
      }));
      return;
    }

    const validFiles = files.filter(file => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          files: 'Only JPEG, PNG and WebP images are allowed'
        }));
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({
          ...prev,
          files: 'Each image must be less than 5MB'
        }));
        return false;
      }
      return true;
    });

    // Create preview URLs for valid files
    const newFiles = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setErrors(prev => ({ ...prev, files: null }));
    resetError();
  };

  const handleRemoveFile = (index) => {
    const removedFile = selectedFiles[index];
    if (removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const files = selectedFiles.map(f => f.file);
    const results = await uploadItems(files);
    if (results) {
      handleClose();
    }
  };

  const handleClose = () => {
    // Cleanup preview URLs
    selectedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
    setErrors({});
    resetError();
    onClose();
  };

  const getFileProgress = (file) => {
    const fileProgress = progress[file.name];
    if (fileProgress === undefined) return null;
    if (fileProgress === -1) return 'error';
    if (fileProgress === 100) return 'complete';
    return fileProgress;
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isUploading ? handleClose : undefined}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Upload Items
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
        {(error || errors.files) && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => {
                  setErrors(prev => ({ ...prev, files: null }));
                  resetError();
                }}
              >
                DISMISS
              </Button>
            }
          >
            {error || errors.files}
          </Alert>
        )}
        
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
            },
            mb: 2
          }}
          component="label"
        >
          <input
            type="file"
            accept="image/*"
            hidden
            multiple
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
          <Typography>
            Click or drag images here to upload
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Up to {MAX_IMAGES} images, max 5MB each
          </Typography>
        </Box>

        {selectedFiles.length > 0 && (
          <ImageList cols={3} gap={8}>
            {selectedFiles.map((file, index) => (
              <ImageListItem 
                key={index} 
                sx={{ 
                  position: 'relative',
                  opacity: isUploading ? 0.7 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  loading="lazy"
                  style={{ aspectRatio: '1', objectFit: 'cover' }}
                />
                {!isUploading && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.95)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                {isUploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      p: 1
                    }}
                  >
                    {(() => {
                      const fileProgress = getFileProgress(file.file);
                      if (fileProgress === 'error') {
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ErrorIcon color="error" />
                            <Typography variant="caption">Failed</Typography>
                          </Box>
                        );
                      }
                      if (fileProgress === 'complete') {
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon color="success" />
                            <Typography variant="caption">Complete</Typography>
                          </Box>
                        );
                      }
                      if (fileProgress !== null) {
                        return (
                          <Box sx={{ width: '100%' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={fileProgress} 
                              sx={{ 
                                height: 8,
                                borderRadius: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 'primary.light'
                                }
                              }}
                            />
                          </Box>
                        );
                      }
                      return null;
                    })()}
                  </Box>
                )}
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {isUploading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>
              Uploading {selectedFiles.length} items...
              {Object.values(progress).filter(p => p === 100).length}/{selectedFiles.length} complete
            </Typography>
          </Box>
        ) : (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
            >
              Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}