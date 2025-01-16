'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ItemGrid from '../../components/wardrobe/ItemGrid';
import UploadDialog from '../../components/wardrobe/UploadDialog';
import { useWardrobeItems } from '@/src/hooks/wardrobe.hooks';

export default function Wardrobe() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { items, isLoading } = useWardrobeItems();

  const handleItemClick = (item) => {
    console.log('Card clicked:', item);
    // TODO: Open item details modal
  };

  const handleUpload = (newItem) => {
    // This function is not defined in the provided code edit, but it was present in the original code.
    // If you want to keep the functionality, you should define it here.
    // For now, I'm leaving it as a comment.
    // setItems(prevItems => [newItem, ...prevItems]);
  };

  console.log("wardrobe isLoading", isLoading)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Wardrobe
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Upload and manage your clothing items. Each item will be analyzed to help create your personalized style.
        </Typography>
      </Box>

      {/* Main Content */}
      {!isLoading && items.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            py: 8, 
            px: 4, 
            textAlign: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Typography variant="h5" gutterBottom>
            Your wardrobe is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Start by uploading your first clothing item
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setIsUploadDialogOpen(true)}
          >
            Upload Item
          </Button>
        </Paper>
      ) : (
        <Box>
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsUploadDialogOpen(true)}
            >
              Upload Item
            </Button>
          </Box>
          <ItemGrid 
            items={items}
            onItemClick={handleItemClick}
            isLoading={isLoading}
          />
        </Box>
      )}

      {/* Upload Dialog */}
      <UploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </Container>
  );
}
