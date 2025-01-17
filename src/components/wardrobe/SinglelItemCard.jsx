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
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useDeleteWardrobeItem } from '@/src/hooks/wardrobe.hooks';

function ItemDetailsModal({ item, open, onClose }) {
  if (!item) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={item.imageUrl}
          alt={item.name}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '60vh',
            objectFit: 'cover'
          }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="h5" gutterBottom>
          {item.name}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {item.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {/* Colors */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {item.colors?.map((color, index) => (
                <Chip
                  key={index}
                  label={color}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          {/* Styles */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Styles
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {item.styles?.map((style, index) => (
                <Chip
                  key={index}
                  label={style}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          {/* Occasions */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Occasions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {item.occasions?.map((occasion, index) => (
                <Chip
                  key={index}
                  label={occasion}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          {/* Additional Info */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Category: {item.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confidence Score: {Math.round(item.confidenceScore)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default function ItemCard({ item, onClick }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  if (!item) return <ItemCardSkeleton />;

  return (
    <>
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
        onClick={handleCardClick}
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

      <ItemDetailsModal
        item={item}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

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
