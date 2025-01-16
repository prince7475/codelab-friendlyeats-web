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
  
  // Mock data with multiple outfits
  const mockOutfits = [
    {
      id: '1',
      description: 'Perfect for a casual day out',
      createdAt: '2025-01-16T17:40:59-05:00',
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
    },
    {
      id: '2',
      description: 'Business meeting ready',
      createdAt: '2025-01-16T16:30:00-05:00',
      items: [
        {
          id: '4',
          name: 'Navy Blazer',
          imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
          category: 'Tops'
        },
        {
          id: '5',
          name: 'White Dress Shirt',
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
          category: 'Tops'
        },
        {
          id: '6',
          name: 'Gray Dress Pants',
          imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
          category: 'Bottoms'
        }
      ]
    },
    {
      id: '3',
      description: 'Weekend brunch vibes',
      createdAt: '2025-01-16T15:20:00-05:00',
      items: [
        {
          id: '7',
          name: 'Floral Dress',
          imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
          category: 'Dresses'
        },
        {
          id: '8',
          name: 'Denim Jacket',
          imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923',
          category: 'Tops'
        },
        {
          id: '9',
          name: 'Ankle Boots',
          imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
          category: 'Shoes'
        }
      ]
    },
    {
      id: '4',
      description: 'Date night ready',
      createdAt: '2025-01-16T14:15:00-05:00',
      items: [
        {
          id: '10',
          name: 'Black Turtleneck',
          imageUrl: 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114',
          category: 'Tops'
        },
        {
          id: '11',
          name: 'Leather Jacket',
          imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
          category: 'Tops'
        },
        {
          id: '12',
          name: 'Black Jeans',
          imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
          category: 'Bottoms'
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