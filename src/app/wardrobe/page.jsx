'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ItemCard from '../../components/wardrobe/itemCard';

// Placeholder for actual components
const UploadDialog = () => <div>UploadDialog Placeholder</div>;

export default function Wardrobe() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Placeholder for actual data fetching
  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="h6" color="text.secondary">
            Loading your wardrobe...
          </Typography>
        </Stack>
      </Box>
    );
  }

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
      {items.length === 0 ? (
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
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={3}>
            {items.map((item) => (
              <ItemCard 
                key={item.id}
                item={item}
                onClick={() => console.log('Card clicked:', item)}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Upload Dialog */}
      {isUploadDialogOpen && (
        <UploadDialog
          open={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onUpload={(newItem) => {
            setItems([...items, newItem]);
            setIsUploadDialogOpen(false);
          }}
        />
      )}
    </Container>
  );
}
