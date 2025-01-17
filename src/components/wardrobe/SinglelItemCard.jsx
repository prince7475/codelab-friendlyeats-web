'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteWardrobeItem } from '@/src/hooks/wardrobe.hooks';

export function ItemCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          paddingTop: '100%', // 1:1 aspect ratio
        }}
      />
      <CardContent>
        <Skeleton variant="text" width="80%" height={24} />
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
    }
  };

  const { imageUrl, name } = item;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: 6,
          '& .delete-button': {
            opacity: 1
          }
        }
      }}
      onClick={() => onClick?.(item)}
    >
      <Box
        sx={{
          position: 'relative',
          paddingTop: '100%', // 1:1 aspect ratio
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
        <IconButton 
          className="delete-button"
          onClick={handleDelete}
          disabled={isDeleting}
          size="small"
          color="error"
          aria-label="delete item"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            opacity: 0,
            transition: 'opacity 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      
      <CardContent sx={{ py: 1 }}>
        <Typography 
          variant="subtitle1" 
          component="h2"
          align="center"
          noWrap
          sx={{ fontWeight: 500 }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}
