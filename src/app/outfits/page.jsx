'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import OutfitCollection from '@/src/components/outfits/OutfitCollection';
import CreateOutfitCollection from '@/src/components/outfits/CreateOutfitCollection';
import { useOutfitCollections } from '@/src/hooks/outfitGenerator.hooks';

function OutfitCollectionPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { collections, isLoading, error } = useOutfitCollections();
  const hasCollections = collections.length > 0;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading collections: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Outfit Collections
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create and manage your outfit collections. Each collection can have multiple outfits generated based on your preferences.
      </Typography>

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
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Collection
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Collection
          </Button>
        </Box>
      )}

      {/* Collections List */}
      {hasCollections && (
        <Box sx={{ mt: 2 }}>
          {collections.map((collection) => (
            <OutfitCollection
              key={collection.id}
              collection={collection}
            />
          ))}
        </Box>
      )}

      {/* Create Collection Modal */}
      <CreateOutfitCollection
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Container>
  );
}

export default OutfitCollectionPage;