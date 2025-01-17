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

// Mock data - will be replaced with real data later
const mockCollection = {
  id: 'casual-weekend',
  name: 'Casual Weekend',
  description: 'Relaxed and comfortable outfits perfect for weekend activities',
  inspirationImage: '/mock/inspiration.jpg',
  outfits: [
    {
      id: 'outfit-1',
      items: [
        { id: 'item-1', name: 'Blue Jeans', image: '/mock/jeans.jpg' },
        { id: 'item-2', name: 'White T-Shirt', image: '/mock/tshirt.jpg' },
        { id: 'item-3', name: 'Sneakers', image: '/mock/sneakers.jpg' }
      ],
      description: 'Classic casual look perfect for running errands or meeting friends',
      confidenceScore: 0.95
    }
  ]
};

function OutfitCollectionPage() {
  const [collections, setCollections] = useState([mockCollection]);
  const hasCollections = collections.length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Outfit Collections
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create and manage your outfit collections. Each collection can be inspired by a specific style or occasion.
        </Typography>
      </Box>

      {/* Create Collection Button */}
      {!hasCollections ? (
        <Paper 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            gap: 2
          }}
        >
          <Typography variant="h6">
            Create Your First Collection
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start by creating a collection of outfits inspired by your favorite styles or occasions.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* TODO: Open create collection modal */}}
          >
            Create Collection
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* TODO: Open create collection modal */}}
          >
            Create Collection
          </Button>
        </Box>
      )}

      {/* Collections List */}
      {hasCollections && (
        <Box sx={{ mt: 4 }}>
          {/* TODO: Replace with OutfitCollection component */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{mockCollection.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {mockCollection.description}
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
}

export default OutfitCollectionPage;