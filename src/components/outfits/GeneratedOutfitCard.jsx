'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Stack,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';

const DESCRIPTION_LIMIT = 150;

function getConfidenceColor(score) {
  if (score >= 0.8) return '#4caf50'; // green
  if (score >= 0.6) return '#ffc107'; // yellow
  return '#f44336'; // red
}

function GeneratedOutfitCard({ outfit }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    items = [],
    description,
    confidenceScore,
    title = 'Generated Outfit', // Default title if not provided
  } = outfit;

  const confidenceColor = useMemo(() => 
    getConfidenceColor(confidenceScore),
    [confidenceScore]
  );

  const truncatedDescription = description.length > DESCRIPTION_LIMIT
    ? `${description.substring(0, DESCRIPTION_LIMIT)}...`
    : description;

  return (
    <Card
      sx={{
        width: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      {/* Title and Confidence Score */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium">
          {title}
        </Typography>
        <Chip
          label={`${Math.round(confidenceScore * 100)}% Match`}
          size="small"
          sx={{
            backgroundColor: confidenceColor,
            color: '#fff',
            fontWeight: 'medium',
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      </Box>

      {/* Items Row */}
      <Stack 
        direction="row" 
        spacing={2}
        sx={{ 
          p: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: '4px',
          },
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              minWidth: isMobile ? '120px' : '180px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: '100%',
                paddingTop: '100%', // 1:1 aspect ratio
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Typography 
              variant="caption" 
              noWrap 
              align="center"
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Description */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {truncatedDescription}
        </Typography>
      </Box>

      {/* Confidence Score Bar */}
      <LinearProgress
        variant="determinate"
        value={confidenceScore * 100}
        sx={{
          height: 4,
          backgroundColor: theme.palette.divider,
          '& .MuiLinearProgress-bar': {
            backgroundColor: confidenceColor,
          },
        }}
      />
    </Card>
  );
}

export default GeneratedOutfitCard;
