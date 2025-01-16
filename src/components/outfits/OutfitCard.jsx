'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  IconButton
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function OutfitCard({ outfit }) {
  const { items, description, createdAt } = outfit;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <Card sx={{ mb: 4, position: 'relative', overflow: 'visible' }}>
      {/* Stacked Photos Container */}
      <Box 
        sx={{ 
          position: 'relative',
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '1000px',
          cursor: 'pointer'
        }}
        onClick={handleNext}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const position = (index - activeIndex + items.length) % items.length;
          
          return (
            <Box
              key={item.id}
              sx={{
                position: 'absolute',
                width: '80%',
                height: '300px',
                transform: `rotate(${(position - 1) * 5}deg) translateY(${position * 5}px)`,
                transition: 'all 0.3s ease-in-out',
                opacity: position === 0 ? 1 : 0.8,
                '&:hover': {
                  transform: 'rotate(0deg) translateY(-10px)',
                  zIndex: 10,
                  opacity: 1,
                },
                zIndex: items.length - position,
                bgcolor: 'white',
                p: 1,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <Box
                component="img"
                src={item.imageUrl}
                alt={item.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  boxShadow: 3,
                  borderRadius: 1,
                }}
              />
            </Box>
          );
        })}

        {/* Navigation Buttons */}
        <IconButton
          onClick={handlePrevious}
          sx={{
            position: 'absolute',
            left: '10%',
            zIndex: items.length + 1,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: '10%',
            zIndex: items.length + 1,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>

      {/* Description and Timestamp */}
      <CardContent sx={{ mt: 2 }}>
        <Stack spacing={1}>
          <Typography variant="body1">
            {description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Generated on {new Date(createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}