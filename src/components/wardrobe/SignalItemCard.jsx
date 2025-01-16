'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip,
  Stack,
  IconButton,
  CardActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteWardrobeItem } from '@/src/hooks/wardrobe.hooks';

// Mock data for testing
export const mockItem = {
  id: '1',
  userId: 'user123',
  imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSY4wzEKvodpYi7yLrW_Az136oG-BjAsPFFNNAb4PmE_CnPB5Pzj7nw6_yC2shsN9cIrPgDOKQBzkhcIFXyxnPh1b1czVuQXtQh1TJ7zvcDJqkBl3GCFCadM64',
  name: 'Classic White Sneakers',
  description: 'Versatile white sneakers perfect for casual outfits',
  category: 'shoes',
  style: ['casual', 'streetwear'],
  createdAt: new Date().toISOString(),
};

export function ItemCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          paddingTop: '75%', // 4:3 aspect ratio
        }}
      />
      <CardContent>
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="60%" height={20} />
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ItemCard({ item, onClick }) {
  const { deleteItem, isDeleting } = useDeleteWardrobeItem();
  
  if (!item) return <ItemCardSkeleton />;

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click event
    try {
      await deleteItem(item.id);
    } catch (error) {
      console.error('Failed to delete item:', error);
      // You might want to show a snackbar/toast here
    }
  };

  const {
    imageUrl,
    name,
    description,
    category,
    style,
    createdAt
  } = item;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={() => onClick?.(item)}
    >
      <Box
        sx={{
          position: 'relative',
          paddingTop: '75%', // 4:3 aspect ratio
          backgroundColor: 'grey.100'
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={category} size="small" />
          {style.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton 
          onClick={handleDelete}
          disabled={isDeleting}
          size="small"
          color="error"
          aria-label="delete item"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
