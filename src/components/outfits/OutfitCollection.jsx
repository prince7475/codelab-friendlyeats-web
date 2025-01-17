'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  ImageList,
  ImageListItem,
  Divider,
  Alert,
  CircularProgress,
  Collapse,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GeneratedOutfitCard from './GeneratedOutfitCard';
import GenerateOutfitForCollectionModal from './GenerateOutfitForCollectionModal';
import { useDeleteCollection, useDeleteOutfitFromCollection } from '@/src/hooks/outfitGenerator.hooks';

export default function OutfitCollection({ collection }) {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { deleteCollection, isDeleting, error: deleteError } = useDeleteCollection();
  const { 
    deleteOutfit, 
    isDeleting: isDeletingOutfit, 
    error: deleteOutfitError 
  } = useDeleteOutfitFromCollection();

  const handleDelete = async () => {
    try {
      await deleteCollection(collection.id);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to delete collection:', err);
    }
  };

  const handleDeleteOutfit = async (outfitId) => {
    try {
      await deleteOutfit(collection.id, outfitId);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to delete outfit:', err);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Collection Header */}
      <Box 
        onClick={toggleExpand}
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="h2">
              {collection.name}
            </Typography>
            <IconButton size="small" sx={{ ml: 1 }}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            {collection.description}
          </Typography>
        </Box>
        <IconButton 
          onClick={(e) => {
            e.stopPropagation(); // Prevent header click from triggering
            handleDelete();
          }}
          disabled={isDeleting}
          sx={{ ml: 2 }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Error Messages */}
      {(deleteError || deleteOutfitError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteError || deleteOutfitError}
        </Alert>
      )}

      <Collapse in={isExpanded}>
        {/* Inspiration Images */}
        {collection.inspirationImages?.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Inspiration Images
            </Typography>
            <ImageList cols={6} rowHeight={100} sx={{ mb: 2 }}>
              {collection.inspirationImages.map((image, index) => (
                <ImageListItem 
                  key={index}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      '& .image-info': {
                        display: 'flex'
                      }
                    }
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.metadata.name || `Inspiration ${index + 1}`}
                    loading="lazy"
                    style={{ height: '100px', objectFit: 'cover' }}
                  />
                  <Box
                    className="image-info"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      display: 'none',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                      textAlign: 'center',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {image.metadata.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                      {image.metadata.styles.slice(0, 3).join(', ')}
                    </Typography>
                  </Box>
                </ImageListItem>
              ))}
            </ImageList>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Generated Outfits */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Generated Outfits
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setIsGenerateModalOpen(true)}
            >
              Generate New Outfit
            </Button>
          </Box>

          {/* Loading State */}
          {isDeletingOutfit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Outfits Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 2 
          }}>
            {collection.outfits?.map((outfit) => (
              <GeneratedOutfitCard
                key={outfit.id}
                outfit={outfit}
                onDelete={() => handleDeleteOutfit(outfit.id)}
              />
            ))}
          </Box>

          {/* Empty State */}
          {(!collection.outfits || collection.outfits.length === 0) && (
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 4,
                bgcolor: 'background.default',
                borderRadius: 1
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No outfits generated yet. Click the button above to create your first outfit!
              </Typography>
            </Box>
          )}
        </Box>

        {/* Generate Outfit Modal */}
        <GenerateOutfitForCollectionModal
          open={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          collectionId={collection.id}
        />
      </Collapse>
    </Paper>
  );
}
