'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DESCRIPTION_LIMIT = 100;

function OutfitCollection({ collection, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);

  const {
    name,
    description,
    inspirationImages = [],
    outfits = [],
  } = collection;

  const truncatedDescription = description.length > DESCRIPTION_LIMIT
    ? `${description.substring(0, DESCRIPTION_LIMIT)}...`
    : description;

  const handleGenerateOutfit = () => {
    // TODO: Implement generate outfit functionality
    console.log('Generate outfit clicked');
  };

  const handleEdit = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    onEdit?.(collection);
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent accordion from toggling
    onDelete?.(collection);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)}
      sx={{ width: '100%' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          },
        }}
      >
        <Typography variant="h6" noWrap>{name}</Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {truncatedDescription}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        {/* Full Description */}
        <Typography paragraph>{description}</Typography>

        {/* Inspiration Images Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Inspiration Images
          </Typography>
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flexWrap: 'wrap',
              gap: 1,
              '& img': {
                width: isMobile ? '80px' : '120px',
                height: isMobile ? '80px' : '120px',
                objectFit: 'cover',
                borderRadius: 1,
              }
            }}
          >
            {inspirationImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Inspiration ${index + 1}`}
              />
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleGenerateOutfit}
          >
            Generate New Outfit
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Collection">
              <IconButton
                onClick={handleEdit}
                sx={{ 
                  color: 'action.active',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Collection">
              <IconButton
                onClick={handleDelete}
                sx={{ 
                  color: 'action.active',
                  '&:hover': { color: 'error.main' },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Outfits List */}
        {outfits.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              px: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              No outfits generated yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Generate your first outfit based on your inspiration images and style preferences.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleGenerateOutfit}
            >
              Generate First Outfit
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            {outfits.map((outfit) => (
              <Box
                key={outfit.id}
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                }}
              >
                {/* TODO: Replace with GeneratedOutfitCard component */}
                <Typography variant="subtitle1">
                  {outfit.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default OutfitCollection;
