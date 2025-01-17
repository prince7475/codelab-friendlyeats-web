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
import OutfitCollection from '@/src/components/outfits/OutfitCollection';

// Mock data - will be replaced with real data later
const mockCollection = {
  id: 'casual-weekend',
  name: 'Old Money',
  description: 'Relaxed and comfortable outfits perfect for weekend activities. Create a versatile collection that works for brunch, shopping, or casual meetups with friends.',
  inspirationImages: [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRRwUyUXxI7T8YTrG2SdChgaT3UiQfV7TKFw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzJSDPRQf4pcpjCjXVr8MsPTPubRkKimBu5g&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSafXNSEphv7KGB5qAH4UY_vzZgOGOp2ZwAkA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqD90LGTW1velseoVf8P4jQex50-uOYkThw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRQU84Mvfq5wRQtvYnxupru9aMwajRfiMCLw&s',
  ],
  outfits: [
    {
      id: 'outfit-1',
      title: 'Classic Casual Look',
      items: [
        { 
          id: 'item-1', 
          name: 'Classic Blue Jeans', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzJSDPRQf4pcpjCjXVr8MsPTPubRkKimBu5g&s'
        },
        { 
          id: 'item-2', 
          name: 'White Cotton T-Shirt', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSafXNSEphv7KGB5qAH4UY_vzZgOGOp2ZwAkA&s'
        },
        { 
          id: 'item-3', 
          name: 'Canvas Sneakers', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqD90LGTW1velseoVf8P4jQex50-uOYkThw&s'
        },
        { 
          id: 'item-4', 
          name: 'Denim Jacket', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRQU84Mvfq5wRQtvYnxupru9aMwajRfiMCLw&s'
        }
      ],
      description: 'A timeless casual ensemble perfect for weekend brunches or casual meetups. The combination of classic blue jeans and a white tee creates a clean foundation, while the denim jacket adds layering potential for variable weather.',
      confidenceScore: 0.95
    },
    {
      id: 'outfit-2',
      title: 'Classic Casual Look',
      items: [
        { 
          id: 'item-1', 
          name: 'Classic Blue Jeans', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzJSDPRQf4pcpjCjXVr8MsPTPubRkKimBu5g&s'
        },
        { 
          id: 'item-2', 
          name: 'White Cotton T-Shirt', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSafXNSEphv7KGB5qAH4UY_vzZgOGOp2ZwAkA&s'
        },
        { 
          id: 'item-3', 
          name: 'Canvas Sneakers', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqD90LGTW1velseoVf8P4jQex50-uOYkThw&s'
        },
        { 
          id: 'item-4', 
          name: 'Denim Jacket', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRQU84Mvfq5wRQtvYnxupru9aMwajRfiMCLw&s'
        }
      ],
      description: 'A timeless casual ensemble perfect for weekend brunches or casual meetups. The combination of classic blue jeans and a white tee creates a clean foundation, while the denim jacket adds layering potential for variable weather.',
      confidenceScore: 0.25
    },
    {
      id: 'outfit-3',
      title: 'Classic Casual Look',
      items: [
        { 
          id: 'item-1', 
          name: 'Classic Blue Jeans', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzJSDPRQf4pcpjCjXVr8MsPTPubRkKimBu5g&s'
        },
        { 
          id: 'item-2', 
          name: 'White Cotton T-Shirt', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSafXNSEphv7KGB5qAH4UY_vzZgOGOp2ZwAkA&s'
        },
        { 
          id: 'item-3', 
          name: 'Canvas Sneakers', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqD90LGTW1velseoVf8P4jQex50-uOYkThw&s'
        },
        { 
          id: 'item-4', 
          name: 'Denim Jacket', 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRQU84Mvfq5wRQtvYnxupru9aMwajRfiMCLw&s'
        }
      ],
      description: 'A timeless casual ensemble perfect for weekend brunches or casual meetups. The combination of classic blue jeans and a white tee creates a clean foundation, while the denim jacket adds layering potential for variable weather.',
      confidenceScore: 0.70
    }
  ]
};

function OutfitCollectionPage() {
  const [collections, setCollections] = useState([mockCollection]);
  const hasCollections = collections.length > 0;

  const handleEditCollection = (collection) => {
    // TODO: Open edit collection modal
    console.log('Edit collection:', collection);
  };

  const handleDeleteCollection = (collection) => {
    // TODO: Show confirmation dialog before deleting
    console.log('Delete collection:', collection);
  };

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
          {collections.map(collection => (
            <OutfitCollection 
              key={collection.id} 
              collection={collection} 
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default OutfitCollectionPage;