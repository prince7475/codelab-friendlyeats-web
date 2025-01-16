'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GenerateOutfitModal from '@/src/components/outfits/GenerateOutfitModal';
import OutfitList from '@/src/components/outfits/OutfitList';

export default function Outfits() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  
  // Mock data with multiple items per outfit
  const mockOutfits = [
    {
      id: '1',
      description: 'Perfect for a casual day out',
      createdAt: '2025-01-16T17:28:22-05:00',
      items: [
        {
          id: '1',
          name: 'Blue Oxford Shirt',
          imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
          category: 'Tops'
        },
        {
          id: '2',
          name: 'Dark Jeans',
          imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
          category: 'Bottoms'
        },
        {
          id: '3',
          name: 'White Sneakers',
          imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
          category: 'Shoes'
        }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Outfit Generator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Get personalized outfit suggestions based on your wardrobe. Perfect for any occasion!
        </Typography>
      </Box>

      {/* Generate Button - Centered */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AutoAwesomeIcon />}
          onClick={() => setIsGenerateModalOpen(true)}
        >
          Generate A Drip
        </Button>
      </Box>

      {/* Outfits List Section */}
      <OutfitList outfits={mockOutfits} />

      {/* Generate Outfit Modal */}
      <GenerateOutfitModal 
        open={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />
    </Container>
  );
}