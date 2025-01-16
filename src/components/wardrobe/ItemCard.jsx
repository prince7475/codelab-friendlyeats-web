'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip,
  Stack
} from '@mui/material';
// import { formatDistanceToNow } from 'date-fns';

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
  if (!item) return <ItemCardSkeleton />;

  const {
    imageUrl,
    name,
    description,
    category,
    style = [],
    createdAt
  } = item;

  console.log('image', imageUrl);
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
        <img 
          src={imageUrl} 
          alt={name}
          style={{
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
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {description}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
          <Chip 
            label={category} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          {style.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              color="secondary"
              variant="outlined"
            />
          ))}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Added ago
        </Typography>
      </CardContent>
    </Card>
  );
}
