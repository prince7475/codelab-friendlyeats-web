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
    colors,
    styles,
    occasions,
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
        
        {/* Category */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={category} size="small" color="primary" />
        </Stack>

        {/* Colors */}
        {colors?.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Colors
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {colors.map((color) => (
                <Chip 
                  key={color} 
                  label={color} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderColor: 'primary.light' }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Styles */}
        {styles?.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Styles
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {styles.map((style) => (
                <Chip 
                  key={style} 
                  label={style} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderColor: 'secondary.light' }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Occasions */}
        {occasions?.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Perfect for
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {occasions.map((occasion) => (
                <Chip 
                  key={occasion} 
                  label={occasion} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderColor: 'success.light' }}
                />
              ))}
            </Stack>
          </Box>
        )}
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
