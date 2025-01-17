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
import GeneratedOutfitCard from './GeneratedOutfitCard';
import GenerateOutfitForCollectionModal from './GenerateOutfitForCollectionModal';

const DESCRIPTION_LIMIT = 100;

function OutfitCollection({ collection, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const {
    name,
    description,
    inspirationImages = [],
    outfits = [],
  } = collection;

  const truncatedDescription = description.length > DESCRIPTION_LIMIT
    ? `${description.substring(0, DESCRIPTION_LIMIT)}...`
    : description;

  const handleGenerateOutfit = async (formData) => {
    // TODO: Implement actual generation logic
    console.log('Generating outfit:', formData);
    // Mock generation response
    const mockOutfit = {
      id: `outfit-${Date.now()}`,
      title: formData.title,
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
      ],
      description: formData.description,
      confidenceScore: Math.random()
    };
    // TODO: Update collection with new outfit
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
            variant="contained"
            onClick={() => setIsGenerateModalOpen(true)}
            sx={{ mt: 2 }}
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
              onClick={() => setIsGenerateModalOpen(true)}
            >
              Generate First Outfit
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            {outfits.map((outfit) => (
              <GeneratedOutfitCard
                key={outfit.id}
                outfit={outfit}
              />
            ))}
          </Stack>
        )}
      </AccordionDetails>

      {/* Generate Outfit Modal */}
      <GenerateOutfitForCollectionModal
        open={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerateOutfit}
        collectionName={collection.name}
      />
    </Accordion>
  );
}

export default OutfitCollection;
