'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ItemGrid from '../../components/wardrobe/ItemGrid';
import UploadDialog from '../../components/wardrobe/UploadDialog';

// Mock data for testing
const mockItems = [
  {
    id: '1',
    userId: 'user123',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSY4wzEKvodpYi7yLrW_Az136oG-BjAsPFFNNAb4PmE_CnPB5Pzj7nw6_yC2shsN9cIrPgDOKQBzkhcIFXyxnPh1b1czVuQXtQh1TJ7zvcDJqkBl3GCFCadM64',
    name: 'Classic White Sneakers',
    description: 'Versatile white sneakers perfect for casual outfits',
    category: 'shoes',
    style: ['casual', 'streetwear'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user123',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSY4wzEKvodpYi7yLrW_Az136oG-BjAsPFFNNAb4PmE_CnPB5Pzj7nw6_yC2shsN9cIrPgDOKQBzkhcIFXyxnPh1b1czVuQXtQh1TJ7zvcDJqkBl3GCFCadM64',
    name: 'Denim Jacket',
    description: 'Classic denim jacket that goes with everything',
    category: 'outerwear',
    style: ['casual', 'vintage'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user123',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSY4wzEKvodpYi7yLrW_Az136oG-BjAsPFFNNAb4PmE_CnPB5Pzj7nw6_yC2shsN9cIrPgDOKQBzkhcIFXyxnPh1b1czVuQXtQh1TJ7zvcDJqkBl3GCFCadM64',
    name: 'Black Baseball Cap',
    description: 'Simple black cap for a sporty look',
    category: 'accessories',
    style: ['sporty', 'casual'],
    createdAt: new Date().toISOString(),
  }
];

export default function Wardrobe() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Placeholder for actual data fetching
  React.useEffect(() => {
    // Simulate loading with longer delay
    const timer = setTimeout(() => {
      setItems(mockItems);
      setIsLoading(false);
    }, 3000); // Increased to 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleItemClick = (item) => {
    console.log('Card clicked:', item);
    // TODO: Open item details modal
  };

  const handleUpload = (newItem) => {
    setItems(prevItems => [newItem, ...prevItems]);
  };

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
