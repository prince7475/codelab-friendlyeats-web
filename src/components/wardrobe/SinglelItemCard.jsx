'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  IconButton,
  CardMedia,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteWardrobeItem } from '@/src/hooks/wardrobe.hooks';

export function ItemCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', paddingTop: '133%', width: '100%' }}>
        <Skeleton 
          variant="rectangular" 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }} 
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </CardContent>
    </Card>
  );
}

export default function ItemCard({ item, onClick }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteItem } = useDeleteWardrobeItem();

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setMenuAnchor(null);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    setIsDeleting(true);
    try {
      await deleteItem(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    handleMenuClose();
  };

  if (!item) return <ItemCardSkeleton />;

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'relative',
          paddingTop: '133%', // 3:4 aspect ratio
          width: '100%',
          bgcolor: 'grey.100'
        }}
      >
        <CardMedia
          component="img"
          image={item.imageUrl}
          alt={item.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {isDeleting && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
            },
          }}
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '2.5em'
        }}>
          {item.description}
        </Typography>
      </CardContent>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleDelete} disabled={isDeleting}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
