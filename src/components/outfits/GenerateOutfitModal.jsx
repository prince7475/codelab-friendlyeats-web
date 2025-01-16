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
  TextField,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function GenerateOutfitModal({ open, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Mock generation delay - will be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription('');
    onClose();
  };

  const isSubmitDisabled = !selectedFile || !description.trim();

  return (
    <Dialog 
      open={open} 
      onClose={!isGenerating ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Drip Generator
        {!isGenerating && (
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
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Describe Your Occasion"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isGenerating}
            placeholder="Help us understand what you're looking for by answering these questions:
- Where are you going?
- What's the dress code?
- Any specific colors or styles you prefer?
- What kind of vibe are you going for?"
          />
        </Box>

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
              disabled={isGenerating}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
            <Typography>
              Upload an inspiration image
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drop an image here or click to browse
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
              }}
            />
            {!isGenerating && (
              <IconButton
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        )}

        {isGenerating && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Generating your drip...
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={isGenerating}
        >
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isSubmitDisabled || isGenerating}
          variant="contained"
          startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
        >
          Generate My Drip Please
        </Button>
      </DialogActions>
    </Dialog>
  );
}
